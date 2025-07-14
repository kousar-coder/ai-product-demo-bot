![WhatsApp Image 2025-07-13 at 07 47 53_49f2c663](https://github.com/user-attachments/assets/194e7673-e586-4b2b-a120-32d8a804d202)


# AI Product Demo Agent

A smart, voice-controlled AI assistant that delivers live product demos — just like a real sales rep. It listens, responds, navigates your product UI, and provides an interactive experience powered by OpenAI.

---

## How It Works

1. User clicks a demo link  
2. AI agent greets the user and shares screen  
3. User speaks naturally (e.g., “Show me the dashboard”)  
4. AI navigates the product, explains features, and answers questions  
5. The session is recorded and a transcript is emailed to the user  

---

## Features

-  **Voice Control** — Real-time interaction using OpenAI Whisper  
-  **Context-Aware Replies** — GPT-4 responses tailored to UI state  
-  **Live UI Navigation** — Walkthroughs guided by user commands  
-  **Dark Mode Support** — Accessible and aesthetic design  
-  **Responsive Interface** — Mobile-first, fluid layout  
-  **Session Logs** — Auto-email with recording and transcript  

---

##  Tech Stack

###  Frontend
- React.js  
- Tailwind CSS  
- Framer Motion  
- React Router  

###  Backend
- Python  
- Django  
- Django REST Framework  

###  AI Integration
- [OpenAI Whisper API](https://openai.com/research/whisper) — Speech-to-text  
- [OpenAI GPT-4](https://openai.com/gpt-4) — Conversational AI  

---

##  Project Structure

```

ai-product-demo-agent/
├── frontend/            # React client for voice UI
├── backend/             # Django REST API for AI communication
├── .env                 # Environment configuration
├── README.md            # Project documentation

````

---

##  Setup Instructions

### Backend (Django + DRF)

```bash
cd backend
python -m venv env
source env/bin/activate      # or env\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py runserver
````

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

---

##  Environment Variables

Create a `.env` file in both `frontend/` and `backend/`.

### `.env` (Backend)

```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxx
DJANGO_SECRET_KEY=your-secret-key
```

### `.env` (Frontend)

```
VITE_OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxx
```

---

##  Use Cases

* Product demos for SaaS platforms
* Sales automation & onboarding
* Virtual assistants for customer support
* AI-enhanced user walkthroughs

---

##  Feedback & Contributions

Feel free to fork, improve, and raise pull requests. For feature requests or issues, open a GitHub issue or contact the maintainer.

---


