import React, { useState, useEffect } from "react";

const MonthlySummary = ({ transactions }) => {
  const [summary, setSummary] = useState({ income: {}, expense: {} });
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const monthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date);
      return tDate >= start && tDate < end;
    });

    const incomeSummary = {};
    const expenseSummary = {};
    let totalIncome = 0;
    let totalExpense = 0;

    monthTransactions.forEach((t) => {
      if (t.type === "income") {
        totalIncome += t.amount;
        incomeSummary[t.category] = (incomeSummary[t.category] || 0) + t.amount;
      } else {
        totalExpense += t.amount;
        expenseSummary[t.category] =
          (expenseSummary[t.category] || 0) + t.amount;
      }
    });

    setSummary({
      income: { ...incomeSummary, total: totalIncome },
      expense: { ...expenseSummary, total: totalExpense },
    });
  }, [transactions, selectedMonth]);

  return (
    <div className="summary-container">
      <div className="summary-header">
        <h3>Monthly Transaction Summary</h3>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      <div className="summary-tables">
        <div className="summary-table">
          <h4>Income</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(summary.income)
                .filter(([key]) => key !== "total")
                .map(([category, amount]) => (
                  <tr key={category}>
                    <td>{category}</td>
                    <td className="income">+${amount.toFixed(2)}</td>
                  </tr>
                ))}
              <tr className="total-row">
                <td>
                  <strong>Total Income</strong>
                </td>
                <td className="income">
                  <strong>+${(summary.income.total || 0).toFixed(2)}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="summary-table">
          <h4>Expenses</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(summary.expense)
                .filter(([key]) => key !== "total")
                .map(([category, amount]) => (
                  <tr key={category}>
                    <td>{category}</td>
                    <td className="expense">-${amount.toFixed(2)}</td>
                  </tr>
                ))}
              <tr className="total-row">
                <td>
                  <strong>Total Expenses</strong>
                </td>
                <td className="expense">
                  <strong>-${(summary.expense.total || 0).toFixed(2)}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="summary-balance">
        <p>
          <strong>Net Balance:</strong>{" "}
          <span
            className={
              (summary.income.total || 0) - (summary.expense.total || 0) >= 0
                ? "income"
                : "expense"
            }
          >
            $
            {(
              (summary.income.total || 0) - (summary.expense.total || 0)
            ).toFixed(2)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default MonthlySummary;
