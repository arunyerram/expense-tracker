import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("http://127.0.0.1:8000/register", form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Registration failed. Try a different username."
      );
    }
  };

  return (
    <div style={styles.bg}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Register</h2>
        {error && <div style={styles.error}>{error}</div>}
        {success && (
          <div style={styles.success}>Registration successful! Redirecting to login…</div>
        )}
        <div style={styles.inputGroup}>
          <label>Username</label>
          <input
            style={styles.input}
            name="username"
            value={form.username}
            onChange={handleChange}
            required
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
            autoComplete="new-password"
          />
        </div>
        <button type="submit" style={styles.button}>Create Account</button>
        <div style={styles.link}>
          Already have an account? <Link to="/login">Login</Link>
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
    background: "#43a047",
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
  success: {
    background: "#e8f5e9",
    color: "#1b5e20",
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
