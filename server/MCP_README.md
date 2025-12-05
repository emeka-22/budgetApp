# Budget App MCP Server

This MCP (Model Context Protocol) server exposes your budget app's data to AI agents, allowing them to provide personalized financial insights and suggestions.

## What is MCP?

MCP is a protocol that allows AI agents to access external data sources and tools. This server makes your user profiles, transactions, and budgets available to AI assistants like Claude, GitHub Copilot, or Cursor.

## Running the Server

```bash
cd server
npm run mcp
```

The server will:
1. Connect to MongoDB
2. Start listening on stdio for MCP client connections
3. Expose resources and tools to connected AI agents

## Available Resources

### 1. User Profile
- **URI**: `budget:///users/{userId}/profile`
- **Description**: Get user details (name, email, currency, timezone)
- **Example**: `budget:///users/507f1f77bcf86cd799439011/profile`

### 2. User Transactions
- **URI**: `budget:///users/{userId}/transactions`
- **Description**: Get the last 50 transactions for a user
- **Example**: `budget:///users/507f1f77bcf86cd799439011/transactions`

### 3. User Budgets
- **URI**: `budget:///users/{userId}/budgets`
- **Description**: Get all budgets for a user
- **Example**: `budget:///users/507f1f77bcf86cd799439011/budgets`

## Available Tools

### get_user_by_email
- **Description**: Find a user's ID by their email address
- **Input**: `{ email: string }`
- **Output**: User ID or "User not found"
- **Example**: `get_user_by_email({ email: "user@example.com" })`

## Connecting an AI Agent

### Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on Mac or `%APPDATA%\Claude\claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "budgetApp": {
      "command": "node",
      "args": ["src/mcp-server.js"],
      "cwd": "c:\\Users\\pc\\Documents\\budgetApp\\server"
    }
  }
}
```

### VS Code / GitHub Copilot

Add to your VS Code settings:

```json
{
  "github.copilot.mcp.servers": {
    "budgetApp": {
      "command": "node",
      "args": ["src/mcp-server.js"],
      "cwd": "c:\\Users\\pc\\Documents\\budgetApp\\server"
    }
  }
}
```

### Cursor

Add to your Cursor MCP settings (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "budgetApp": {
      "command": "node",
      "args": ["src/mcp-server.js"],
      "cwd": "c:\\Users\\pc\\Documents\\budgetApp\\server"
    }
  }
}
```

## Example Agent Interactions

Once connected, you can ask your AI agent:

- "What's my current spending on dining this month?"
- "Am I on track with my entertainment budget?"
- "Show me my largest expenses from last week"
- "How much have I saved this month?"
- "What percentage of my income am I spending on rent?"

The agent will:
1. Use `get_user_by_email` to find your user ID
2. Access your transactions via `budget:///users/{userId}/transactions`
3. Access your budgets via `budget:///users/{userId}/budgets`
4. Analyze the data and provide insights

## Security Note

> **Important**: The MCP server has full access to your database. Only connect it to trusted AI agents. In production, you should:
> - Add authentication/authorization
> - Implement rate limiting
> - Add data filtering based on user permissions
> - Use environment-specific configurations

## Extending the Server

To add more capabilities:

1. **Add more resources**: Expose additional data (e.g., savings goals, recurring payments)
2. **Add more tools**: Allow the agent to perform actions (e.g., create transactions, update budgets)
3. **Add prompts**: Guide the agent's responses with predefined prompts
4. **Add caching**: Improve performance for frequently accessed data

See the [MCP TypeScript SDK documentation](https://github.com/modelcontextprotocol/typescript-sdk) for more details.
