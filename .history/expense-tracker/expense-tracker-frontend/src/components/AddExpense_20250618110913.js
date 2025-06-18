
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddExpense() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    amount: '',
    date: '',
    description: '',
    category: '',
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'https://expense-tracker-3-47ra.onrender.com/expenses',
        {
          ...form,
          amount: parseFloat(form.amount),
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      navigate('/');
    } catch {
      setError('Failed to add expense');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add Expense</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="e.g. Groceries"
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Amount (₹)</label>
          <input
            name="amount"
            type="number"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="e.g. 500"
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Date</label>
          <input
            name="date"
            type="datetime-local"
            value={form.date}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            style={{ ...styles.input, height: 60, resize: 'vertical' }}
            placeholder="Optional details"
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Category</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            style={styles.input}
            placeholder="e.g. Food, Bills"
          />
        </div>
        <button type="submit" style={styles.addBtn}>
          Add
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 440,
    margin: "2.5rem auto",
    background: "#fff",
    padding: "2rem 2.2rem",
    borderRadius: 10,
    boxShadow: "0 4px 24px #ececec",
    fontFamily: "Segoe UI, Arial, sans-serif",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#272d3a",
    marginBottom: 18,
    letterSpacing: "0.2px",
  },
  error: {
    color: "red",
    marginBottom: 18,
    fontWeight: 500,
    background: "#fff8f8",
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #ffebee",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.1rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  label: {
    fontWeight: 600,
    fontSize: 15,
    color: "#223",
    marginBottom: 2,
  },
  input: {
    padding: "9px 12px",
    borderRadius: 6,
    border: "1.5px solid #cfd8dc",
    fontSize: 15.5,
    background: "#f7fafd",
    transition: "border 0.2s",
    outline: "none",
    marginBottom: 0,
  },
  addBtn: {
    background: "linear-gradient(90deg, #2196f3 65%, #1de9b6 100%)",
    color: "#fff",
    padding: "10px 0",
    border: "none",
    borderRadius: 7,
    fontWeight: 700,
    fontSize: 17,
    cursor: "pointer",
    marginTop: 10,
    boxShadow: "0 2px 12px #e3f2fd",
    letterSpacing: "0.5px",
    transition: "background .2s",
  },
};
