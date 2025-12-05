# AI Agent Setup Guide for Budget App

## Step 1: Install Claude Desktop

1. Go to https://claude.ai/download
2. Download Claude Desktop for Windows
3. Install the application
4. Sign in with your Anthropic account (create one if needed - it's free!)

## Step 2: Configure the MCP Server

I've created the configuration file for you. You need to:

1. Open File Explorer
2. Press `Win + R` and type: `%APPDATA%\Claude`
3. If the folder doesn't exist, create it
4. Copy the file `claude_desktop_config.json` (from this directory) into that folder

## Step 3: Start the MCP Server

Open a terminal and run:

```bash
cd C:\Users\pc\Documents\budgetApp\server
npm run mcp
```

Keep this terminal open - the MCP server needs to be running for Claude to access your data.

## Step 4: Restart Claude Desktop

Close and reopen Claude Desktop to load the new configuration.

## Step 5: Test It!

In Claude Desktop, try asking:

- "Can you see my budget app data?"
- "What's my email address from the budget app?"
- "Show me my recent transactions"
- "What budgets do I have?"

## Troubleshooting

**If Claude can't connect:**
1. Make sure the MCP server is running (`npm run mcp`)
2. Check that MongoDB is connected
3. Restart Claude Desktop
4. Check the configuration file path is correct

**If you see errors:**
- The MCP server terminal will show any errors
- Make sure the path in the config matches your actual project location

## What You Can Ask Claude

Once connected, you can ask Claude to:

✅ Analyze your spending patterns
✅ Check if you're on track with budgets
✅ Find your largest expenses
✅ Calculate savings
✅ Give financial advice based on your data
✅ Identify spending trends

## Example Questions

- "How much did I spend on groceries this month?"
- "Am I staying within my budget?"
- "What are my top 5 expenses?"
- "Can you help me create a savings plan?"
- "Show me where I'm overspending"

Enjoy your AI-powered budget assistant! 🤖💰
