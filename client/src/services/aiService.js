import apiUrl from "../constants/apiUrl";

export const sendChatMessage = async (message) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Not authenticated");
    }

    const response = await fetch(`${apiUrl}/ai/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to get AI response");
    }

    return await response.json();
};
