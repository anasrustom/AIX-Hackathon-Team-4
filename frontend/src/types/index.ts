// User & Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'legal_officer' | 'procurement_manager' | 'compliance_officer';
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  role: User['role'];
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Contract Types
export interface Contract {
  id: string;
  title: string;
  file_name: string;
  file_path: string;
  file_type: 'pdf' | 'docx';
  upload_date: string;
  uploaded_by: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  
  // Extracted Data
  parties: ContractParty[];
  key_dates: KeyDate[];
  financial_terms: FinancialTerm[];
  governing_law: string;
  jurisdiction: string;
  
  // Tags & Metadata
  industry: string;
  contract_type: string;
  tags: string[];
  
  // AI Analysis
  summary: string;
  purpose: string;
  scope: string;
  risks: Risk[];
  
  updated_at: string;
}

export interface ContractParty {
  id: string;
  contract_id: string;
  name: string;
  type: 'individual' | 'organization';
  role: 'client' | 'vendor' | 'partner' | 'other';
}

export interface KeyDate {
  id: string;
  contract_id: string;
  date_type: 'effective_date' | 'expiration_date' | 'renewal_date' | 'milestone' | 'other';
  date: string;
  description?: string;
}

export interface FinancialTerm {
  id: string;
  contract_id: string;
  term_type: 'payment' | 'penalty' | 'deposit' | 'other';
  amount: number;
  currency: string;
  schedule?: string;
  description?: string;
}

export interface Risk {
  id: string;
  contract_id: string;
  risk_type: 'missing_clause' | 'unusual_clause' | 'non_standard' | 'inconsistency' | 'compliance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  recommendation?: string;
  clause_reference?: string;
}

// Clause Types
export interface Clause {
  id: string;
  contract_id: string;
  clause_type: string;
  content: string;
  section_number?: string;
  is_standard: boolean;
  risk_level?: 'low' | 'medium' | 'high';
}

// Chat Types
export interface ChatMessage {
  id: string;
  contract_id: string | null; // null for general contract questions
  user_id: string;
  message: string;
  response: string;
  timestamp: string;
}

export interface ChatRequest {
  contract_id?: string;
  message: string;
}

export interface ChatResponse {
  response: string;
  sources?: string[];
}

// Upload Types
export interface UploadResponse {
  contract_id: string;
  file_name: string;
  status: string;
  message: string;
}

// Dashboard Types
export interface DashboardStats {
  total_contracts: number;
  pending_reviews: number;
  high_risk_contracts: number;
  expiring_soon: number;
  recent_uploads: Contract[];
}

// Filter Types
export interface ContractFilters {
  industry?: string;
  governing_law?: string;
  contract_type?: string;
  status?: Contract['status'];
  search?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
