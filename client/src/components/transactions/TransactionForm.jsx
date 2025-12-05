import React, { useState, useEffect } from "react";

const TransactionForm = ({ transaction, onSave, onCancel, categories }) => {
  const [formData, setFormData] = useState({
    amount: "",
    type: "income",
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount || "",
        type: transaction.type || "income",
        category: transaction.category || "",
        date: transaction.date
          ? new Date(transaction.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        description: transaction.description || "",
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "category" && value === "create new") {
      setShowNewCategory(true);
      setFormData({ ...formData, category: "" });
    } else {
      setShowNewCategory(false);
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const categoryToUse = showNewCategory ? newCategory : formData.category;
    if (!categoryToUse) {
      alert("Please select or create a category");
      return;
    }
    onSave({
      ...formData,
      amount: parseFloat(formData.amount),
      category: categoryToUse,
      date: new Date(formData.date),
    });
  };

  const defaultCategories = ["Family", "Personal", "Food"];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{transaction ? "Edit Transaction" : "Add Transaction"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Amount *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="form-group">
            <label>Category *</label>
            {!showNewCategory ? (
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                {defaultCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                {categories
                  .filter((cat) => !defaultCategories.includes(cat))
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                <option value="create new">Create New Category</option>
              </select>
            ) : (
              <div>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter new category name"
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCategory(false);
                    setNewCategory("");
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            )}
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

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Optional description"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {transaction ? "Update" : "Create"} Transaction
            </button>
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
