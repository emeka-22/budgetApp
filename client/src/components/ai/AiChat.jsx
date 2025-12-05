import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { sendChatMessage } from "../../services/aiService";
import "./AiChat.css";

const AiChat = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hi! I'm your AI financial assistant. Ask me anything about your budget, spending, or financial goals!",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput("");

        // Add user message
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setLoading(true);

        try {
            const response = await sendChatMessage(userMessage);

            // Add AI response
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: response.message },
            ]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: error.message || "Sorry, I encountered an error. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const suggestedQuestions = [
        "How much did I spend this month?",
        "Am I staying within my budget?",
        "What are my biggest expenses?",
        "How can I save more money?",
    ];

    return (
        <>
            {/* Floating Chat Button */}
            <button
                className={`ai-chat-button ${isOpen ? "open" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
                title="AI Financial Assistant"
            >
                {isOpen ? "✕" : "🤖"}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="ai-chat-window">
                    <div className="ai-chat-header">
                        <h3>Hi, {user?.name || "User"} 👋</h3>
                        <p>Powered by Groq (Llama 3.3)</p>
                    </div>

                    <div className="ai-chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}`}>
                                <div className="message-content">{msg.content}</div>
                            </div>
                        ))}
                        {loading && (
                            <div className="message assistant">
                                <div className="message-content typing">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {messages.length === 1 && (
                        <div className="suggested-questions">
                            <p>Try asking:</p>
                            {suggestedQuestions.map((question, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setInput(question);
                                    }}
                                    className="suggested-question"
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="ai-chat-input">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me about your finances..."
                            rows="2"
                            disabled={loading}
                        />
                        <button onClick={handleSend} disabled={loading || !input.trim()}>
                            {loading ? "..." : "Send"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AiChat;
