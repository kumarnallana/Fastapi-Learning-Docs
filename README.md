# FastAPI Learning Workspace

A clean, modular learning workspace for practicing FastAPI step-by-step across multiple hands-on systems.

---

## 📁 Workspace Structure

```text
Fastapi-Learning-Docs/
├── .venv/                         # Shared root virtual environment
├── .vscode/                       # Workspace IDE settings (points to root .venv)
├── .gitignore                     # Git ignore rules
├── requirements.txt               # Workspace dependencies (FastAPI, Uvicorn, HTTPX)
├── README.md                      # Workspace documentation
│
├── Product_managment_System/      # Practice System 1: Products CRUD, Schemas & Services
│   └── app/
│       ├── __init__.py
│       ├── main.py
│       ├── routers/
│       ├── schemas/
│       └── services/
│
└── Employees_Managment_System/    # Practice System 2: Employees Management
    └── app/
        ├── __init__.py
        └── main.py
```

---

## 🚀 Quick Start Guide

### 1. Activate the Root Virtual Environment

**In PowerShell:**
```powershell
.\.venv\Scripts\Activate.ps1
```

**In Command Prompt (CMD):**
```cmd
.venv\Scripts\activate.bat
```

*(Note: The IDE is configured in `.vscode/settings.json` to automatically use this root `.venv` interpreter for all subfolders).*

---

### 2. Running Applications

#### Option A: Running from the Workspace Root
```powershell
# Run Product Management System
uvicorn Product_managment_System.app.main:app --reload

# Run Employees Management System
uvicorn Employees_Managment_System.app.main:app --reload --port 8001
```

#### Option B: Running from within Subfolders
```powershell
# Navigate into any project folder and run:
cd Product_managment_System
uvicorn app.main:app --reload
```

---

### 3. Adding New Packages

Install any package into the shared root environment using `uv`:

```powershell
uv pip install <package_name>
```
All sub-projects will immediately have access to the newly installed package.
