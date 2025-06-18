// src/components/ExpensesList.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ExpensesList.css";

export default function ExpensesList() {
  const [expenses, setExpenses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catFilter, setCatFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem("monthlyBudget");
    return saved ? parseFloat(saved) : "";
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const nav = useNavigate();

  // Fetch and load expenses
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return nav("/login");

    fetch("https://expense-tracker-3-47ra.onrender.com/expenses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401) {
          nav("/login");
          return;
        }
        if (!res.ok) {
          const err = await res.text();
          throw new Error(err || "Failed to load expenses");
        }
        return res.json();
      })
      .then((data) => {
        setExpenses(data);
        setFiltered(data);
        setCategories(Array.from(new Set(data.map((e) => e.category))));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [nav]);

  // Apply filters
  useEffect(() => {
    let tmp = [...expenses];
    if (catFilter) {
      tmp = tmp.filter((e) => e.category === catFilter);
    }
    if (startDate) {
      tmp = tmp.filter((e) => new Date(e.date) >= new Date(startDate));
    }
    if (endDate) {
      tmp = tmp.filter((e) => new Date(e.date) <= new Date(endDate));
    }
    setFiltered(tmp);
  }, [expenses, catFilter, startDate, endDate]);

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.status === 204) {
        setExpenses((prev) => prev.filter((e) => e._id !== id));
      } else {
        alert("Failed to delete");
      }
    } catch {
      alert("Error deleting expense");
    }
  };

  const handleBudgetChange = (e) => {
    const val = e.target.value;
    setBudget(val);
    localStorage.setItem("monthlyBudget", val);
  };

  const clearFilters = () => {
    setCatFilter("");
    setStartDate("");
    setEndDate("");
  };

  if (loading) return <p>Loading expenses…</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  // Calculate budget status once for display
  const total = filtered.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="expenses-container">
      <h2 className="expenses-title">All Expenses</h2>

      {/* --- Budget Section --- */}
      <div className="budget-section">
        <label>
          Set Monthly Budget: ₹{" "}
          <input
            type="number"
            placeholder="e.g. 2000"
            value={budget}
            onChange={handleBudgetChange}
          />
        </label>
        {budget && (
          <div
            className={
              "budget-status " +
              (total > budget ? "budget-status--warn" : "budget-status--ok")
            }
          >
            {total > budget
              ? `⚠️ You’ve exceeded your budget of ₹${budget}. Total spending: ₹${total.toFixed(2)}`
              : `✅ Spent ₹${total.toFixed(2)} of ₹${budget}`}
          </div>
        )}
      </div>

      {/* --- Filters Section --- */}
      <div className="filters-bar">
        <label>
          Category:{" "}
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
        <label>
          From:{" "}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          To:{" "}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button onClick={clearFilters}>Clear Filters</button>
      </div>

      {/* --- Expense List --- */}
      {filtered.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <table className="expenses-list">
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount (₹)</th>
              <th>Date</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((exp) => (
              <tr key={exp._id}>
                <td>{exp.title}</td>
                <td>₹{exp.amount.toFixed(2)}</td>
                <td>{new Date(exp.date).toLocaleDateString()}</td>
                <td>{exp.category}</td>
                <td>
                  <Link to={`/edit/${exp._id}`} className="action-btn edit-btn">
                    Edit
                  </Link>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(exp._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
