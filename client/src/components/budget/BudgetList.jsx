import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BudgetForm from "./BudgetForm";
import BudgetFilters from "./BudgetFilters";
import { formatDate } from "../../utils/formatDate";
import { createBudget, updateBudget, getBudgets, deleteBudget } from "../../services/budgetService";

const BudgetList = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [filteredBudgets, setFilteredBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    name: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const data = await getBudgets();
        setBudgets(data);
        setFilteredBudgets(data);
      } catch (error) {
        console.error("Failed to fetch budgets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  useEffect(() => {
    let filtered = [...budgets];

    if (filters.category) {
      filtered = filtered.filter((b) => b.category === filters.category);
    }
    if (filters.name) {
      filtered = filtered.filter((b) =>
        b.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    setFilteredBudgets(filtered);
  }, [filters, budgets]);

  const handleAdd = () => {
    console.log("Adding new budget");
    setEditingBudget(null);
    setShowForm(true);
  };

  const handleEdit = (budget) => {
    console.log("Editing budget:", budget);
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        console.log("Deleting budget:", id);
        await deleteBudget(id);
        setBudgets((prev) => prev.filter((b) => b._id !== id));
        setFilteredBudgets((prev) => prev.filter((b) => b._id !== id));
      } catch (error) {
        console.error("Failed to delete budget:", error);
        alert("Failed to delete budget. Please try again.");
      }
    }
  };

  const handleSave = async (budgetData) => {
    try {
      console.log("Saving budget:", budgetData);
      if (editingBudget) {
        const updatedBudget = await updateBudget(editingBudget._id, budgetData);
        setBudgets((prev) =>
          prev.map((b) => (b._id === editingBudget._id ? updatedBudget : b))
        );
      } else {
        const newBudget = await createBudget(budgetData);
        setBudgets((prev) => [...prev, newBudget]);
      }
      setShowForm(false);
      setEditingBudget(null);
      // Refresh to ensure consistency
      const data = await getBudgets();
      setBudgets(data);
    } catch (error) {
      console.error("Failed to save budget:", error);
      alert("Failed to save budget. Please try again.");
    }
  };

  const categories = [
    ...new Set(budgets.map((b) => b.category).filter(Boolean)),
  ];

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <button onClick={() => navigate("/dashboard")} className="btn-back">
            ← Back to Dashboard
          </button>
          <h1>Budgets</h1>
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
            + Add Budget
          </button>
        </div>

        <BudgetFilters
          filters={filters}
          setFilters={setFilters}
          categories={categories}
        />

        {showForm && (
          <BudgetForm
            budget={editingBudget}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingBudget(null);
            }}
            categories={categories}
          />
        )}

        {loading ? (
          <p>Loading budgets...</p>
        ) : filteredBudgets.length === 0 ? (
          <p className="empty-state">No budgets found.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBudgets.map((budget) => (
                  <tr key={budget._id}>
                    <td>{budget.name}</td>
                    <td>${budget.amount}</td>
                    <td>
                      <span className="category-badge">{budget.category}</span>
                    </td>
                    <td>{formatDate(budget.startDate)}</td>
                    <td>{formatDate(budget.endDate)}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(budget)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(budget._id)}
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

export default BudgetList;
