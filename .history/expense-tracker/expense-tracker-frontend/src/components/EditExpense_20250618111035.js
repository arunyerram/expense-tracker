
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    amount: '',
    date: '',
    description: '',
    category: '',
  });
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    async function fetchExpense() {
      try {
        const token = localStorage.getItem('token');
        const resp = await axios.get(
          `https://expense-tracker-3-47ra.onrender.com/expenses/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          }
        );
        const data = resp.data;
        const localDate = new Date(data.date)
          .toISOString()
          .slice(0, 16);
        setForm({
          title:       data.title,
          amount:      data.amount.toString(),
          date:        localDate,
          description: data.description || '',
          category:    data.category || '',
        });
      } catch {
        setError('Failed to load expense');
      } finally {
        setLoading(false);
      }
    }
    fetchExpense();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://127.0.0.1:8000/expenses/${id}`,
        {
          title:       form.title,
          amount:      parseFloat(form.amount),
          date:        new Date(form.date).toISOString(),
          description: form.description,
          category:    form.category,
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
      setError('Failed to update expense');
    }
  };

  if (loading) return <p>Loading expense…</p>;
  if (error)   return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Edit Expense</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label><br/>
          <input name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Amount (₹):</label><br/>
          <input
            name="amount"
            type="number"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date:</label><br/>
          <input
            name="date"
            type="datetime-local"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label><br/>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Category:</label><br/>
          <input name="category" value={form.category} onChange={handleChange} />
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>
          Save
        </button>
      </form>
    </div>
  );
}


