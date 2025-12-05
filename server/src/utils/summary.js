const getBalance = (transactions) => {
  return transactions.reduce(
    (acc, tx) => (tx.type === "income" ? acc + tx.amount : acc - tx.amount),
    0
  );
};

module.exports = { getBalance };
