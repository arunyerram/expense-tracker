import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  try {
    const resp = await axios.post(
      "https://expense-tracker-3-47ra.onrender.com/login",
      new URLSearchParams(form),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } } // <--- ADD THIS
    );
    localStorage.setItem("token", resp.data.access_token);
    navigate("/");
  } catch (err) {
    setError("Invalid username or password");
  }
};


  return (
    <div style={styles.bg}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Login</h2>
        {error && <div style={styles.error}>{error}</div>}
        <div style={styles.inputGroup}>
          <label>Username</label>
          <input
            style={styles.input}
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            autoFocus
            autoComplete="username"
          />
        </div>
        <div style={styles.inputGroup}>
          <label>Password</label>
          <input
            style={styles.input}
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" style={styles.button}>Log In</button>
        <div style={styles.link}>
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f7f9fa"
  },
  card: {
    width: 350,
    padding: "2rem",
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 6px 32px rgba(0,0,0,0.07)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  title: {
    fontWeight: "bold",
    fontSize: "1.6rem",
    marginBottom: "0.5rem"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 4
  },
  input: {
    padding: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: 6,
    fontSize: "1rem"
  },
  button: {
    background: "#2979ff",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "0.75rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: 8
  },
  error: {
    background: "#ffebee",
    color: "#b71c1c",
    padding: "0.5rem",
    borderRadius: 6,
    textAlign: "center"
  },
  link: {
    marginTop: 10,
    textAlign: "center",
    fontSize: "0.97rem"
  }
};

