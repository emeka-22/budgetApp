import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

console.error("Imports successful!");

const server = new McpServer({
    name: "Test Server",
    version: "1.0.0",
});

console.error("Server created!");

const transport = new StdioServerTransport();
await server.connect(transport);

console.error("Server connected!");
