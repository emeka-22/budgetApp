import React from "react";

const TransactionFilters = ({ filters, setFilters, categories }) => {
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({ type: "", category: "", date: "" });
  };

  return (
    <div className="filters-container">
      <h3>Filter Transactions</h3>
      <div className="filters-grid">
        <div className="filter-group">
          <label>Type</label>
          <select name="type" value={filters.type} onChange={handleChange}>
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleChange}
          />
        </div>

        <div className="filter-group">
          <button onClick={clearFilters} className="btn-secondary">
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;
