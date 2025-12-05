const OpenAI = require("openai");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");

// Initialize Groq (using OpenAI SDK compatibility)
const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

exports.chat = async (req, res, next) => {
    try {
        const { message } = req.body;
        const userId = req.user.id;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        // Check if API key is configured
        if (!process.env.GROQ_API_KEY) {
            console.error("GROQ_API_KEY is not set in .env file");
            return res.status(500).json({
                message: "AI service not configured. Please add GROQ_API_KEY to .env file."
            });
        }

        // Fetch user's financial data
        const [transactions, budgets] = await Promise.all([
            Transaction.find({ user: userId }).sort({ date: -1 }).limit(50),
            Budget.find({ user: userId }),
        ]);

        // Prepare context for AI
        const context = `
You are a helpful financial assistant. The user has the following financial data:

BUDGETS:
${budgets.map(b => `- ${b.name}: $${b.amount} (${b.category})`).join('\n')}

RECENT TRANSACTIONS (last 50):
${transactions.map(t => `- ${t.type}: $${t.amount} on ${t.date.toLocaleDateString()} ${t.description ? '(' + t.description + ')' : ''}`).join('\n')}

Total Budgets: ${budgets.length}
Total Transactions: ${transactions.length}
Total Budget Amount: $${budgets.reduce((sum, b) => sum + b.amount, 0)}
Total Spent: $${transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)}
Total Income: $${transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)}

Please provide helpful, concise financial advice based on this data. Be friendly and encouraging.
`;

        // Get AI response from Groq
        const completion = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile", // New supported model
            messages: [
                {
                    role: "system",
                    content: context
                },
                {
                    role: "user",
                    content: message
                }
            ],
            max_tokens: 500,
            temperature: 0.7,
        });

        const aiMessage = completion.choices[0].message.content;

        res.json({
            message: aiMessage,
            success: true,
        });
    } catch (error) {
        console.error("AI Chat Error:", error);

        // Provide specific error messages
        if (error.code === 'invalid_api_key') {
            return res.status(500).json({
                message: "Invalid API key. Please check your GROQ_API_KEY in .env file."
            });
        }

        return res.status(500).json({
            message: error.message || "AI service error. Please try again."
        });
    }
};
