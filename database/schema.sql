-- AI Contract Lifecycle Management Database Schema
-- SQLite Database Schema (will be created automatically by SQLAlchemy)

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    hashed_password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'legal_officer', 'procurement_manager', 'compliance_officer')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Contracts table
CREATE TABLE IF NOT EXISTS contracts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK(file_type IN ('pdf', 'docx')),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('pending', 'processing', 'completed', 'failed')),
    governing_law TEXT,
    jurisdiction TEXT,
    industry TEXT,
    contract_type TEXT,
    tags TEXT,  -- JSON array as string
    summary TEXT,
    purpose TEXT,
    scope TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_industry ON contracts(industry);
CREATE INDEX idx_contracts_governing_law ON contracts(governing_law);

-- Contract Parties table
CREATE TABLE IF NOT EXISTS contract_parties (
    id TEXT PRIMARY KEY,
    contract_id TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('individual', 'organization')),
    role TEXT NOT NULL CHECK(role IN ('client', 'vendor', 'partner', 'other')),
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE
);

CREATE INDEX idx_contract_parties_contract_id ON contract_parties(contract_id);

-- Key Dates table
CREATE TABLE IF NOT EXISTS key_dates (
    id TEXT PRIMARY KEY,
    contract_id TEXT NOT NULL,
    date_type TEXT NOT NULL CHECK(date_type IN ('effective_date', 'expiration_date', 'renewal_date', 'milestone', 'other')),
    date TIMESTAMP NOT NULL,
    description TEXT,
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE
);

CREATE INDEX idx_key_dates_contract_id ON key_dates(contract_id);
CREATE INDEX idx_key_dates_date ON key_dates(date);

-- Financial Terms table
CREATE TABLE IF NOT EXISTS financial_terms (
    id TEXT PRIMARY KEY,
    contract_id TEXT NOT NULL,
    term_type TEXT NOT NULL CHECK(term_type IN ('payment', 'penalty', 'deposit', 'other')),
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    schedule TEXT,
    description TEXT,
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE
);

CREATE INDEX idx_financial_terms_contract_id ON financial_terms(contract_id);

-- Risks table
CREATE TABLE IF NOT EXISTS risks (
    id TEXT PRIMARY KEY,
    contract_id TEXT NOT NULL,
    risk_type TEXT NOT NULL CHECK(risk_type IN ('missing_clause', 'unusual_clause', 'non_standard', 'inconsistency', 'compliance')),
    severity TEXT NOT NULL CHECK(severity IN ('low', 'medium', 'high', 'critical')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    recommendation TEXT,
    clause_reference TEXT,
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE
);

CREATE INDEX idx_risks_contract_id ON risks(contract_id);
CREATE INDEX idx_risks_severity ON risks(severity);

-- Clauses table
CREATE TABLE IF NOT EXISTS clauses (
    id TEXT PRIMARY KEY,
    contract_id TEXT NOT NULL,
    clause_type TEXT NOT NULL,
    content TEXT NOT NULL,
    section_number TEXT,
    is_standard BOOLEAN DEFAULT 1,
    risk_level TEXT CHECK(risk_level IN ('low', 'medium', 'high')),
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE
);

CREATE INDEX idx_clauses_contract_id ON clauses(contract_id);

-- Chat History table
CREATE TABLE IF NOT EXISTS chat_history (
    id TEXT PRIMARY KEY,
    contract_id TEXT,  -- NULL for general questions
    user_id TEXT NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_chat_history_contract_id ON chat_history(contract_id);
CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX idx_chat_history_timestamp ON chat_history(timestamp);
