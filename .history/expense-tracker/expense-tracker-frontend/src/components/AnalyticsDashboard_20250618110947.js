import React, { useState, useEffect } from "react";
import { Pie, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
} from "chart.js";
import "./AnalyticsDashboard.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

const API_URL = process.env.REACT_APP_API_URL || "https://expense-tracker-3-47ra.onrender.com";

// --- CSV Export Helper ---
function exportCSV(data) {
  if (!data.length) return;
  const replacer = (key, value) => (value === null ? "" : value);
  const header = Object.keys(data[0]);
  const csv = [
    header.join(","),
    ...data.map(row =>
      header
        .map(fieldName => JSON.stringify(row[fieldName], replacer))
        .join(",")
    ),
  ].join("\r\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "expenses_analytics.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function AnalyticsDashboard() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated");
      return;
    }
    fetch(`${API_URL}/expenses`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`API error ${res.status}`);
        return res.json();
      })
      .then((data) =>
        Array.isArray(data) ? setExpenses(data) : setError("Unexpected server response")
      )
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="analytics-container error">
        <h2>Analytics Dashboard</h2>
        <p>ERROR</p>
        <pre>{error}</pre>
      </div>
    );
  }

  // ---------- Pie Chart: Spending by Category ----------
  const byCategory = expenses.reduce((acc, exp) => {
    acc[exp.category || "uncategorized"] =
      (acc[exp.category || "uncategorized"] || 0) + exp.amount;
    return acc;
  }, {});
  const categories = Object.keys(byCategory);
  const totals = Object.values(byCategory);
  const pieColors = [
    "#4F8EF7", "#F76B8A", "#FFD166", "#06D6A0", "#118AB2", "#ef476f", "#b892ff"
  ];
  const pieData = {
    labels: categories,
    datasets: [
      {
        label: "Spending by Category",
        data: totals,
        backgroundColor: pieColors.slice(0, categories.length),
        borderWidth: 1,
      },
    ],
  };
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom", labels: { font: { size: 14 } } },
    },
  };

  // ---------- Line Chart: Monthly Trend ----------
  const byMonth = expenses.reduce((acc, exp) => {
    const month = new Date(exp.date).toISOString().slice(0, 7);
    acc[month] = (acc[month] || 0) + exp.amount;
    return acc;
  }, {});
  const months = Object.keys(byMonth).sort();
  const monthTotals = months.map((m) => byMonth[m]);
  const lineData = {
    labels: months,
    datasets: [
      {
        label: "Total Spent",
        data: monthTotals,
        fill: false,
        borderColor: "#4F8EF7",
        backgroundColor: "#4F8EF7",
        tension: 0.2,
      },
    ],
  };
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // ---------- Bar Chart: Category-wise Breakdown ----------
  const barData = {
    labels: categories,
    datasets: [
      {
        label: "Spending by Category",
        data: totals,
        backgroundColor: pieColors.slice(0, categories.length),
      },
    ],
  };
  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // ---------- Budget vs Actual (all months) ----------
  const budget = parseFloat(localStorage.getItem("monthlyBudget")) || 0;
  const budgetArray = months.map(() => budget);

  const budgetVsActualData = {
    labels: months,
    datasets: [
      {
        label: "Budget",
        data: budgetArray,
        backgroundColor: "#FFD166",
        borderRadius: 6,
        barThickness: 24,
      },
      {
        label: "Actual Spent",
        data: monthTotals,
        backgroundColor: "#4F8EF7",
        borderRadius: 6,
        barThickness: 24,
      },
    ],
  };

  const budgetVsActualOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "bottom" },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="analytics-container">
      <h1>Analytics Dashboard</h1>
      
      {/* CSV Export Button */}
      <button
        className="action-btn"
        style={{ background: "#4F8EF7", color: "#fff", marginBottom: 18 }}
        onClick={() => exportCSV(expenses)}
      >
        Export All Expenses as CSV
      </button>
      
      <div className="charts-row">
        <div className="chart-card">
          <h2>Total Spending by Category</h2>
          <Pie data={pieData} options={pieOptions} style={{ maxHeight: 280, maxWidth: 280 }} />
        </div>
        <div className="chart-card">
          <h2>Monthly Spending Trend</h2>
          <Line data={lineData} options={lineOptions} style={{ maxHeight: 280, maxWidth: 420 }} />
        </div>
        <div className="chart-card">
          <h2>Bar Chart</h2>
          <Bar data={barData} options={barOptions} style={{ maxHeight: 280, maxWidth: 320 }} />
        </div>
        <div className="chart-card">
          <h2>Budget vs Actual Spending</h2>
          <Bar data={budgetVsActualData} options={budgetVsActualOptions} style={{ maxHeight: 280, maxWidth: 420 }}/>
          <div style={{ marginTop: 12, textAlign: "center" }}>
            <span style={{ color: "#FFD166", fontWeight: 600 }}>
              Budget: ₹{budget} (per month)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


// user 1:
// anynameyouwan
// password123

// user 2:
// anynameyouwants
// pass123


