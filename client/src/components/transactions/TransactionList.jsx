import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TransactionForm from './TransactionForm';
import TransactionFilters from './TransactionFilters';
import MonthlySummary from './MonthlySummary';
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from '../../services/transactionService';
import { formatDate } from '../../utils/formatDate';

const TransactionList = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    date: '',
  });
  const [showSummary, setShowSummary] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data);
        setFilteredTransactions(data);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    let filtered = [...transactions];

    if (filters.type) {
      filtered = filtered.filter((t) => t.type === filters.type);
    }
    if (filters.category) {
      filtered = filtered.filter((t) => t.category === filters.category);
    }
    if (filters.date) {
      const filterDate = new Date(filters.date);
      filtered = filtered.filter((t) => {
        const tDate = new Date(t.date);
        return (
          tDate.getFullYear() === filterDate.getFullYear() &&
          tDate.getMonth() === filterDate.getMonth() &&
          tDate.getDate() === filterDate.getDate()
        );
      });
    }

    setFilteredTransactions(filtered);
  }, [filters, transactions]);

  const handleAdd = () => {
    console.log("Adding new transaction");
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEdit = (transaction) => {
    console.log("Editing transaction:", transaction);
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        console.log("Deleting transaction:", id);
        await deleteTransaction(id);
        setTransactions((prev) => prev.filter((t) => t._id !== id));
      } catch (error) {
        console.error('Failed to delete transaction:', error);
        alert('Failed to delete transaction. Please try again.');
      }
    }
  };

  const handleSave = async (transactionData) => {
    try {
      console.log("Saving transaction:", transactionData);
      if (editingTransaction) {
        const updatedTransaction = await updateTransaction(
          editingTransaction._id,
          transactionData
        );
        setTransactions((prev) =>
          prev.map((t) =>
            t._id === editingTransaction._id ? updatedTransaction : t
          )
        );
      } else {
        const newTransaction = await addTransaction(transactionData);
        setTransactions((prev) => [...prev, newTransaction]);
      }
      setShowForm(false);
      setEditingTransaction(null);
      // Refresh to ensure consistency
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to save transaction:', error);
      alert('Failed to save transaction. Please try again.');
    }
  };

  const categories = [
    ...new Set(transactions.map((t) => t.category).filter(Boolean)),
  ];

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <button onClick={() => navigate('/dashboard')} className="btn-back">
            ← Back to Dashboard
          </button>
          <h1>Transactions</h1>
        </div>
        <div className="header-actions">
          <span>{user?.name}</span>
          <button onClick={logout} className="btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <div className="page-content">
        <div className="page-actions">
          <button onClick={handleAdd} className="btn-primary">
            + Add Transaction
          </button>
          <button
            onClick={() => setShowSummary(!showSummary)}
            className="btn-secondary"
          >
            {showSummary ? 'Hide' : 'Show'} Monthly Summary
          </button>
        </div>

        {showSummary && <MonthlySummary transactions={transactions} />}

        <TransactionFilters
          filters={filters}
          setFilters={setFilters}
          categories={categories}
        />

        {showForm && (
          <TransactionForm
            transaction={editingTransaction}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingTransaction(null);
            }}
            categories={categories}
          />
        )}

        {loading ? (
          <p>Loading transactions...</p>
        ) : filteredTransactions.length === 0 ? (
          <p className="empty-state">No transactions found.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{formatDate(transaction.date)}</td>
                    <td>
                      <span className={`type-badge ${transaction.type}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td>{transaction.category}</td>
                    <td>{transaction.description || '-'}</td>
                    <td className={transaction.type === 'income' ? 'income' : 'expense'}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(transaction._id)}
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

export default TransactionList;