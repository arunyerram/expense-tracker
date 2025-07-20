# Expense Tracker

A **full-stack web application** to track your personal expenses. Users can register, login, add/edit/delete expenses, and view detailed analytics—all with persistent data stored securely in MongoDB.


Deployed Link: https://spendly-app.netlify.app/

---

## Features

- **User Registration & Login** (JWT-based authentication)
- **Add, Edit, Delete Expenses**
- **View All Expenses** (only your own!)
- **Analytics Dashboard:** Pie/Bar/Line charts for your spending
- **Persistent Data:** All expenses are stored in MongoDB (cloud or local)
- **Modern UI:** Built with React (frontend) and FastAPI (backend)

---

## Technology Stack

- **Frontend:** React.js
- **Backend:** FastAPI (Python)
- **Database:** MongoDB (Atlas or local)
- **Authentication:** JWT (JSON Web Tokens)
- **API Client:** Axios
- **Deployment:** Render (for backend), Vercel/Netlify (for frontend, optional)

---

## Screenshots

![image](https://github.com/user-attachments/assets/24d97736-57e4-485b-bb9f-1ae1f57547f4)
![image](https://github.com/user-attachments/assets/009018e8-0da4-445f-8ee4-82f7db436d50)
![image](https://github.com/user-attachments/assets/ca5dca82-8270-4a6c-85b6-4f6dd9dc6073)
![image](https://github.com/user-attachments/assets/4b17d2a1-9d5c-4029-9cc7-de0d08b91ce4)
![image](https://github.com/user-attachments/assets/72975f53-80ca-4175-9196-4bbfe1a7b20c)


---

## Prerequisites

- **Python 3.8+**
- **Node.js 14+ and npm/yarn**
- **MongoDB Atlas account** (or local MongoDB running)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/arunyerram/expense-tracker.git
cd expense-tracker

Commands to start project
for Frontend from expense-tracker-frontend folder 
npm start.
For Backend from expense-tracker
uvicorn app.main:app --reload
