
// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import ExpensesList from "./components/ExpensesList";
import AddExpense from "./components/AddExpense";
import EditExpense from "./components/EditExpense";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";
// whether we’ve got a valid token in localStorage
const isLoggedIn = () => !!localStorage.getItem("token");

// simple wrapper for protected routes
function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

function App() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    // force‐nav back to /login
    window.location.href = "/";
  };

  return (
    <BrowserRouter>
      {/* --- NAV BAR --- */}

      <nav className="navbar">
  <div className="nav-links">
    <Link to="/">Home</Link>
    <Link to="/add">Add Expense</Link>
    <Link to="/analytics">Analytics</Link>
  </div>
  <div className="auth-buttons">
    {isLoggedIn() ? (
      <button onClick={handleLogout}>Logout</button>
    ) : (
      <>
        <Link to="/login">Login</Link>
        <Link to="/register" style={{ marginLeft: "1rem" }}>Register</Link>
      </>
    )}
  </div>
</nav>

      {/* <nav style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
        <Link to="/">Home</Link>{" | "}
        <Link to="/add">Add Expense</Link>{" | "}
        <Link to="/analytics">Analytics</Link>{" | "}
       
        {isLoggedIn() ? (
          <button
            onClick={handleLogout}
            style={{
              marginLeft: 8,
              padding: "0.25rem 0.5rem",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>{" | "}
            <Link to="/register">Register</Link>
          </>
        )}
      </nav> */}

      {/* --- ROUTES --- */}
      <Routes>
        {/* protected home → expenses list */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ExpensesList />
            </ProtectedRoute>
          }
        />

        {/* protected add */}
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddExpense />
            </ProtectedRoute>
          }
        />

        {/* protected edit */}
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditExpense />
            </ProtectedRoute>
          }
        />

        {/* protected analytics */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsDashboard />
            </ProtectedRoute>
          }
        />

        {/* public auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* catch-all → redirect home */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;



