import apiUrl from "../constants/apiUrl";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

export const createBudget = async (budgetData) => {
    const response = await fetch(`${apiUrl}/budget`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(budgetData),
    });

    if (!response.ok) {
        throw new Error("Failed to create budget");
    }

    return response.json();
};

export const updateBudget = async (id, budgetData) => {
    const response = await fetch(`${apiUrl}/budget/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(budgetData),
    });

    if (!response.ok) {
        throw new Error("Failed to update budget");
    }

    return response.json();
};

export const getBudgets = async () => {
    const response = await fetch(`${apiUrl}/budget`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch budgets");
    }

    return response.json();
};

export const deleteBudget = async (id) => {
    const response = await fetch(`${apiUrl}/budget/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to delete budget");
    }

    return response.json();
};
