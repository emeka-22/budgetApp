import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AiChat from "../ai/AiChat";

import { getBudgets } from "../../services/budgetService";
import { getTransactions } from "../../services/transactionService";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [budgetsData, transactionsData] = await Promise.all([
          getBudgets(),
          getTransactions(),
        ]);
        setBudgets(budgetsData);
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Budget Dashboard</h1>
        <div className="header-actions">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card income">
            <h3>Total Income</h3>
            <p className="stat-amount">${totalIncome.toFixed(2)}</p>
          </div>
          <div className="stat-card expense">
            <h3>Total Expense</h3>
            <p className="stat-amount">${totalExpense.toFixed(2)}</p>
          </div>
          <div className="stat-card balance">
            <h3>Balance</h3>
            <p className="stat-amount">${balance.toFixed(2)}</p>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Budgets</h2>
              <Link to="/budgets" className="btn-link">
                View All →
              </Link>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : budgets.length === 0 ? (
              <p>No budgets yet. Create one to get started!</p>
            ) : (
              <div className="budget-preview">
                {budgets.slice(0, 3).map((budget) => (
                  <div key={budget._id} className="budget-item">
                    <h4>{budget.name}</h4>
                    <p>${budget.amount}</p>
                    <span className="category-badge">{budget.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Transactions</h2>
              <Link to="/transactions" className="btn-link">
                View All →
              </Link>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : transactions.length === 0 ? (
              <p>No transactions yet. Add one to get started!</p>
            ) : (
              <div className="transaction-preview">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction._id} className="transaction-item">
                    <div>
                      <span className={`type-badge ${transaction.type}`}>
                        {transaction.type}
                      </span>
                      <span>{transaction.category}</span>
                    </div>
                    <span className="amount">${transaction.amount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-actions">
          <Link to="/income" className="btn-primary">
            💰 Manage Income
          </Link>
          <Link to="/transactions" className="btn-primary">
            Manage Transactions
          </Link>
          <Link to="/budgets" className="btn-primary">
            Manage Budgets
          </Link>
        </div>
      </div>

      {/* AI Financial Assistant */}
      <AiChat />
    </div>
  );
};

export default Dashboard;
