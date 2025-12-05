import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri);
        console.error("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error", error);
        process.exit(1);
    }
};

// Start the server
async function main() {
    // Import models dynamically
    const User = (await import("./models/User.js")).default;
    const Transaction = (await import("./models/Transaction.js")).default;
    const Budget = (await import("./models/Budget.js")).default;

    // Connect to DB
    await connectDB(process.env.MONGO_URI);

    // Initialize MCP Server
    const server = new McpServer({
        name: "Budget App Agent",
        version: "1.0.0",
    });

    // Helper to ensure DB is connected
    const ensureDbConnected = async () => {
        if (mongoose.connection.readyState === 0) {
            await connectDB(process.env.MONGO_URI);
        }
    };

    // Resource: User Profile
    server.resource(
        "user-profile",
        "budget:///users/{userId}/profile",
        async (uri, { userId }) => {
            await ensureDbConnected();
            const user = await User.findById(userId).select("-password");
            if (!user) {
                throw new Error(`User not found: ${userId}`);
            }
            return {
                contents: [
                    {
                        uri: uri.href,
                        text: JSON.stringify(user, null, 2),
                    },
                ],
            };
        }
    );

    // Resource: User Transactions
    server.resource(
        "user-transactions",
        "budget:///users/{userId}/transactions",
        async (uri, { userId }) => {
            await ensureDbConnected();
            const transactions = await Transaction.find({ user: userId })
                .sort({ date: -1 })
                .limit(50);
            return {
                contents: [
                    {
                        uri: uri.href,
                        text: JSON.stringify(transactions, null, 2),
                    },
                ],
            };
        }
    );

    // Resource: User Budgets
    server.resource(
        "user-budgets",
        "budget:///users/{userId}/budgets",
        async (uri, { userId }) => {
            await ensureDbConnected();
            const budgets = await Budget.find({ user: userId });
            return {
                contents: [
                    {
                        uri: uri.href,
                        text: JSON.stringify(budgets, null, 2),
                    },
                ],
            };
        }
    );

    // Tool: Get User ID by Email
    server.tool(
        "get_user_by_email",
        "Find a user's ID by their email address",
        {
            email: z.string().email(),
        },
        async ({ email }) => {
            await ensureDbConnected();
            const user = await User.findOne({ email });
            if (!user) {
                return {
                    content: [{ type: "text", text: "User not found" }],
                    isError: true,
                };
            }
            return {
                content: [{ type: "text", text: user._id.toString() }],
            };
        }
    );

    // Connect transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Budget App MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});

