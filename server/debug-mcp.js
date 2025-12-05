const fs = require('fs');
const path = require('path');

const sdkPath = path.resolve('node_modules/@modelcontextprotocol/sdk');
console.log('SDK Path:', sdkPath);

function listFiles(dir) {
    try {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                listFiles(fullPath);
            } else {
                if (file.endsWith('.js')) {
                    console.log('Checking:', fullPath);
                    try {
                        const mod = require(fullPath);
                        if (mod.McpServer) {
                            console.log('FOUND McpServer in:', fullPath);
                        }
                        if (mod.StdioServerTransport) {
                            console.log('FOUND StdioServerTransport in:', fullPath);
                        }
                    } catch (e) {
                        // ignore
                    }
                }
            }
        });
    } catch (e) {
        console.error('Error listing dir:', dir, e.message);
    }
}

listFiles(path.join(sdkPath, 'dist/cjs'));
