# AI Chat Setup Guide 🤖

Your AI Financial Assistant is ready! Just need to add your Google Gemini API key.

## Step 1: Get Your Free Gemini API Key

1. **Go to:** https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click:** "Create API Key"
4. **Copy** the key (starts with `AIza...`)

**No credit card required!** ✅ Completely free!

## Step 2: Add API Key to Your App

1. Open `server/.env` file
2. Add this line:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
3. Replace `your_api_key_here` with your actual API key
4. Save the file

## Step 3: Restart the Server

```bash
# Stop the current server (Ctrl+C in the terminal)
# Then restart:
cd server
npm start
```

## Step 4: Test It!

1. Open your budget app: http://localhost:5173
2. Log in to your account
3. Go to the Dashboard
4. Look for the **purple robot button** 🤖 in the bottom-right corner
5. Click it to open the AI chat!

## Example Questions to Ask

Try these questions:

- "How much did I spend this month?"
- "Am I staying within my budget?"
- "What are my biggest expenses?"
- "How can I save more money?"
- "Show me my spending patterns"
- "Give me financial advice"

## Features

Your AI assistant can:
- ✅ Analyze your actual spending data
- ✅ Compare budget vs actual expenses
- ✅ Identify spending patterns
- ✅ Give personalized financial advice
- ✅ Answer questions in natural language
- ✅ Suggest ways to save money

## Troubleshooting

**If the chat doesn't work:**
1. Make sure you added the API key to `.env`
2. Restart the server
3. Check the browser console for errors
4. Make sure you're logged in

**If you see "API key not valid":**
- Double-check the key in `.env`
- Make sure there are no extra spaces
- Try creating a new API key

## Privacy & Security

- ✅ Your API key is stored securely on the server
- ✅ Your financial data never leaves your control
- ✅ Only you can access your AI insights
- ✅ Data is sent to Google Gemini only when you ask questions

## Free Tier Limits

Google Gemini free tier:
- 15 requests per minute
- 1,500 requests per day
- More than enough for personal use!

Enjoy your AI-powered budget assistant! 🎉
