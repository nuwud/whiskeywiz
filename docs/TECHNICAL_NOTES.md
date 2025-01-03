# Whiskey Wiz Technical Notes

## Routing Structure
- `/admin` - Admin interface
- `/player` - Player home
- `/quarter/:id` - Specific quarter games (e.g. /quarter/0124 for Q1 2024)
- `/login` - Login page
- `/register` - Registration page

## MCP GitHub Requirements

When using MCP for GitHub operations:

1. File Operations
   ```json
   {
     "path": "path/to/file",
     "repo": "whiskeywiz",
     "owner": "nuwud",
     "branch": "main",
     "content": {
       "content": "file content",
       "encoding": "utf-8"
     },
     "message": "commit message"
   }
   ```

2. Required Parameters
   - `path`: File path in repo
   - `repo`: Repository name
   - `owner`: Repository owner
   - `branch`: Target branch
   - `content`: File content with encoding
   - `message`: Commit message

## Development Notes

1. Admin Interface
   - Uses lazy loading
   - Requires auth guard
   - Manages quarterly games

2. Quarter Components
   - Dynamically loaded
   - Unique URL per quarter
   - Format: MMYY (e.g., 0124)

3. Shopify Integration
   - Web components
   - Embedded in store pages
   - Uses custom elements

## Firebase Configuration
- SPA routing enabled
- CORS headers set
- Cache control configured

## Next Steps
1. Verify admin navigation
2. Test quarter routing
3. Validate Shopify integration

Last Updated: 2024-01-03