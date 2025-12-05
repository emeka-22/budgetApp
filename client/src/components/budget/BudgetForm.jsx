import React, { useState, useEffect } from "react";

const BudgetForm = ({ budget, onSave, onCancel, categories }) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);

  useEffect(() => {
    if (budget) {
      setFormData({
        name: budget.name || "",
        amount: budget.amount || "",
        category: budget.category || "",
        startDate: budget.startDate
          ? new Date(budget.startDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        endDate: budget.endDate
          ? new Date(budget.endDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    }
  }, [budget]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "category" && value === "add a budget") {
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
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert("Start date must be before end date");
      return;
    }
    onSave({
      ...formData,
      amount: parseFloat(formData.amount),
      category: categoryToUse,
      startDate: formData.startDate, // Already in ISO format (YYYY-MM-DD)
      endDate: formData.endDate, // Already in ISO format (YYYY-MM-DD)
    });
  };

  const defaultCategories = ["Family", "Rent", "Groceries"];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{budget ? "Edit Budget" : "Create Budget"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name of Budget *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Monthly Budget"
            />
          </div>

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
                <option value="add a budget">Add a Budget</option>
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
            <label>Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date *</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {budget ? "Update" : "Create"} Budget
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

export default BudgetForm;
