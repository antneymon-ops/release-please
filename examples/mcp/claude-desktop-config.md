# Claude Desktop Configuration for Avatar Platform MCP Server

This configuration file shows how to integrate the Avatar Creation Platform MCP server with Claude Desktop.

## Configuration

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "avatar-platform": {
      "command": "node",
      "args": [
        "/absolute/path/to/release-please/build/src/mcp/index.js"
      ],
      "env": {
        "API_KEY": "test-api-key-123"
      }
    }
  }
}
```

## Configuration File Location

### macOS
`~/Library/Application Support/Claude/claude_desktop_config.json`

### Windows
`%APPDATA%\Claude\claude_desktop_config.json`

### Linux
`~/.config/Claude/claude_desktop_config.json`

## Usage

Once configured, Claude Desktop will be able to:

1. **Create Avatars**: Ask Claude to create avatars with natural language
   - "Create a cyberpunk detective avatar"
   - "Make me a professional headshot avatar"

2. **Browse Resources**: Claude can access avatar templates and styles
   - "Show me available avatar templates"
   - "What avatar styles are supported?"

3. **Export Avatars**: Export created avatars to different platforms
   - "Export this avatar for Unity"
   - "Convert my avatar to VRChat format"

4. **Use Prompts**: Leverage pre-built prompt templates
   - "Create a game character for a fantasy RPG"
   - "Make a professional avatar for a software engineer"

## Example Conversations

### Creating an Avatar
```
You: "Create a stylized avatar of a brave warrior with glowing armor"
Claude: [Uses create_avatar tool]
Result: Created avatar with ID and preview URL
```

### Browsing Templates
```
You: "What avatar templates are available?"
Claude: [Reads avatar://templates resource]
Result: Shows list of professional, gaming, and anime templates
```

### Applying a Template
```
You: "Apply the professional template with custom blue suit"
Claude: [Uses apply_template tool]
Result: Creates customized avatar from template
```

## Advanced Configuration

### Custom API Key
Replace `test-api-key-123` with your actual API key for production use.

### Multiple Servers
You can configure multiple MCP servers:

```json
{
  "mcpServers": {
    "avatar-platform": {
      "command": "node",
      "args": ["path/to/avatar-mcp/index.js"]
    },
    "another-service": {
      "command": "node",
      "args": ["path/to/another-service/index.js"]
    }
  }
}
```

## Troubleshooting

### Server Not Connecting
- Verify the absolute path to `index.js` is correct
- Check that `node` is in your PATH
- Ensure the project has been compiled (`npm run compile`)

### Permission Errors
- Some tools require premium or pro tier
- Check the API key is valid
- Review permission settings in `src/mcp/server/auth/permissions.ts`

### Logging
To enable logging for debugging, set environment variable:
```json
{
  "env": {
    "DEBUG": "mcp:*"
  }
}
```
