import apiUrl from "../constants/apiUrl";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

export const getTransactions = async () => {
    const response = await fetch(`${apiUrl}/transactions`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch transactions");
    }

    return response.json();
};

export const addTransaction = async (transactionData) => {
    const response = await fetch(`${apiUrl}/transactions`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
        throw new Error("Failed to add transaction");
    }

    return response.json();
};

export const updateTransaction = async (id, transactionData) => {
    const response = await fetch(`${apiUrl}/transactions/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
        throw new Error("Failed to update transaction");
    }

    return response.json();
};

export const deleteTransaction = async (id) => {
    const response = await fetch(`${apiUrl}/transactions/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to delete transaction");
    }

    return response.json();
};
