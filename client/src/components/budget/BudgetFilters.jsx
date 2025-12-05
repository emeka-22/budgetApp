import React from "react";

const BudgetFilters = ({ filters, setFilters, categories }) => {
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({ category: "", name: "" });
  };

  return (
    <div className="filters-container">
      <h3>Filter Budgets</h3>
      <div className="filters-grid">
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
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleChange}
            placeholder="Search by name..."
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

export default BudgetFilters;
