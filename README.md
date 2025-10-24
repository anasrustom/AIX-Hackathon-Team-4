# AI Contract Lifecycle Management (CLM) Platform

An AI-powered platform for automating and enhancing the management of legal contracts, supporting both English and Arabic with professional drafting capabilities.


## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.9+
- **Git**

### Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

```powershell
cd backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Copy environment file
copy .env.example .env
# Edit .env and add your Gemini API key

# Run the server
python main.py
```

The backend API will be available at `http://localhost:8000`

API documentation: `http://localhost:8000/docs`

## 📋 Features

### Implemented (Frontend Ready)
- ✅ User authentication (login/signup)
- ✅ Dashboard with statistics
- ✅ Contract upload interface (PDF/DOCX validation)
- ✅ Contracts list with filters
- ✅ Contract detail page with tabs
- ✅ Mini chat interface
- ✅ Database models and schema

### Pending (Backend Implementation Needed)
- ⏳ AI-powered data extraction
- ⏳ Risk analysis
- ⏳ Contract summarization
- ⏳ Natural language Q&A
- ⏳ OCR for document processing
- ⏳ Gemini AI integration

## 🗄️ Database Schema

The application uses **SQLite** for simplicity. The database includes:

- **users** - User accounts and authentication
- **contracts** - Contract metadata and analysis results
- **contract_parties** - Parties involved in contracts
- **key_dates** - Important contract dates
- **financial_terms** - Payment and financial information
- **risks** - Identified risks and recommendations
- **clauses** - Contract clauses
- **chat_history** - AI chat conversations

## 🔑 Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```
DATABASE_URL=sqlite:///./clm_database.db
SECRET_KEY=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key-here
UPLOAD_DIR=./uploads
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Contracts
- `GET /api/contracts` - List all contracts (with filters)
- `GET /api/contracts/{id}` - Get contract details
- `POST /api/contracts/upload` - Upload new contract
- `GET /api/dashboard/stats` - Get dashboard statistics

### Chat
- `POST /api/chat` - Ask question about contract(s)
- `GET /api/chat/history` - Get chat history

---

**Built for AIX Hackathon 2025** 🚀
