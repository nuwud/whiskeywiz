# WhiskeyWiz

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/nuwud/whiskeywiz.git
cd whiskeywiz
```

2. Run setup script:
```bash
npm run setup
```

3. Start development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build production version
- `npm run check`: Run all checks (lint, types, MCP)
- `npm run deploy`: Deploy to Firebase
- `npm run mcp:status`: Check MCP services status

## MCP Services

This project uses Model Context Protocol (MCP) servers for:
- GitHub (version control)
- Firebase (backend)
- Filesystem (local operations)
- Puppeteer (testing)

Check services status with:
```bash
npm run mcp:status
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
# ... other variables
```

## Deployment

Deploy to Firebase:
```bash
npm run deploy
```
