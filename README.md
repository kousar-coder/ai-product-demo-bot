

---


```markdown
# 🤖 AI Product Demo Agent

A smart, voice-controlled AI assistant that delivers live product demos — just like a real sales rep. It listens, responds, navigates your product UI, and provides an interactive experience using voice and AI.

---

## 🚀 Live Workflow

1. **User clicks a demo link**  
2. **AI agent starts screen sharing the product**
3. **User speaks naturally** (e.g. “Show me the dashboard”)
4. **AI agent navigates, explains features, and responds live**
5. **Entire session is recorded and emailed with a transcript**

---

## 💡 Key Features

- 🎙️ **Voice Commands**: Natural interaction via microphone using OpenAI Whisper  
- 🧠 **Smart Responses**: GPT-4-based answers customized to screen context  
- 🌐 **Live UI Navigation**: AI guides through your product screens  
- 🌓 **Dark Mode Toggle**: Seamless UI switch for modern look  
- 📱 **Responsive Design**: Optimized for all screen sizes  
- 💬 **Transcript Summary**: Email delivery of session logs  

---

## 🛠️ Tech Stack

### 🎯 Frontend
- **React.js**, **Tailwind CSS**, **Framer Motion**
- React Router, Dark Mode toggle, Responsive grid layout

### 🔧 Backend
- **Python**, **Django**, **Django REST Framework (DRF)**
- RESTful API integration with OpenAI services

### 🔊 AI Services
- **OpenAI Whisper API** – Real-time speech-to-text
- **OpenAI GPT-4** – Conversational and contextual product walkthroughs

---

## 📁 Folder Structure

```

ai-product-demo-agent/
├── frontend/            # React.js client with voice UI
├── backend/             # Django + DRF API server
├── .env                 # Environment variables (OpenAI keys, etc.)
├── README.md

````

---

## 📦 Setup Instructions

### ⚙️ Backend (Django DRF)

```bash
cd backend
python -m venv env
source env/bin/activate  # or env\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py runserver
````

### 🌐 Frontend (React.js)

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in both `frontend/` and `backend/` directories.

### Example `.env` for Backend:

```
OPENAI_API_KEY=sk-...
DJANGO_SECRET_KEY=your-secret
```

### Example `.env` for Frontend:

```
VITE_OPENAI_API_KEY=sk-...
```

---

## 🧠 Inspiration

Built for hackathons, sales automation platforms, and next-gen customer experience.

---

