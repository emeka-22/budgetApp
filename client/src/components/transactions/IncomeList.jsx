import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    getTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
} from '../../services/transactionService';
import { formatDate } from '../../utils/formatDate';
import './IncomeList.css';

const IncomeList = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [incomeTransactions, setIncomeTransactions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingIncome, setEditingIncome] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form state
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
    });

    const incomeCategories = [
        'Salary',
        'Freelance',
        'Business',
        'Investment',
        'Rental',
        'Gift',
        'Refund',
        'Other'
    ];

    useEffect(() => {
        fetchIncomeTransactions();
    }, []);

    const fetchIncomeTransactions = async () => {
        try {
            const data = await getTransactions();
            const income = data.filter(t => t.type === 'income');
            setIncomeTransactions(income);
        } catch (error) {
            console.error('Failed to fetch income:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setFormData({
            amount: '',
            category: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
        });
        setEditingIncome(null);
        setShowForm(true);
    };

    const handleEdit = (income) => {
        setFormData({
            amount: income.amount,
            category: income.category,
            description: income.description || '',
            date: new Date(income.date).toISOString().split('T')[0],
        });
        setEditingIncome(income);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this income?')) {
            try {
                await deleteTransaction(id);
                setIncomeTransactions(prev => prev.filter(t => t._id !== id));
            } catch (error) {
                console.error('Failed to delete income:', error);
                alert('Failed to delete income. Please try again.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const incomeData = {
            ...formData,
            type: 'income',
            amount: parseFloat(formData.amount),
        };

        try {
            if (editingIncome) {
                await updateTransaction(editingIncome._id, incomeData);
            } else {
                await addTransaction(incomeData);
            }
            setShowForm(false);
            setFormData({
                amount: '',
                category: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
            });
            fetchIncomeTransactions();
        } catch (error) {
            console.error('Failed to save income:', error);
            alert('Failed to save income. Please try again.');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="page-container">
            <header className="page-header">
                <div>
                    <button onClick={() => navigate('/dashboard')} className="btn-back">
                        ← Back to Dashboard
                    </button>
                    <h1>💰 Income</h1>
                </div>
                <div className="header-actions">
                    <span>{user?.name}</span>
                    <button onClick={logout} className="btn-secondary">
                        Logout
                    </button>
                </div>
            </header>

            <div className="page-content">
                <div className="income-summary">
                    <h2>Total Income</h2>
                    <p className="total-amount">${totalIncome.toFixed(2)}</p>
                </div>

                <div className="page-actions">
                    <button onClick={handleAdd} className="btn-primary">
                        + Add Income
                    </button>
                </div>

                {showForm && (
                    <div className="income-form-container">
                        <h3>{editingIncome ? 'Edit Income' : 'Add New Income'}</h3>
                        <form onSubmit={handleSubmit} className="income-form">
                            <div className="form-group">
                                <label>Amount *</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select category</option>
                                    {incomeCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="e.g., Monthly salary, Project payment"
                                />
                            </div>

                            <div className="form-group">
                                <label>Date *</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-primary">
                                    {editingIncome ? 'Update' : 'Add'} Income
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingIncome(null);
                                    }}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <p>Loading income...</p>
                ) : incomeTransactions.length === 0 ? (
                    <p className="empty-state">No income records yet. Add your first income!</p>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Category</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {incomeTransactions.map((income) => (
                                    <tr key={income._id}>
                                        <td>{formatDate(income.date)}</td>
                                        <td>
                                            <span className="category-badge">{income.category}</span>
                                        </td>
                                        <td>{income.description || '-'}</td>
                                        <td className="income-amount">
                                            +${income.amount.toFixed(2)}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleEdit(income)}
                                                className="btn-edit"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(income._id)}
                                                className="btn-delete"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IncomeList;
