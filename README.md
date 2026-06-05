# Capiltopr - AI Web Builder Platform

A production-ready AI Web Builder platform that enables users to generate complete applications from prompts using configurable AI providers.

## Features

### AI Configuration System
- Support for multiple AI providers (Gemini, OpenAI, Anthropic, DeepSeek, OpenRouter, Custom)
- User-configurable API keys and models
- Flexible model parameters (temperature, max tokens)

### Workspace System
- Unlimited projects
- Auto-save functionality
- Project history and version control
- File and folder management
- Multi-workspace support

### Collaboration
- Real-time collaboration with Socket.io
- Role-based access control (Owner, Admin, Editor, Viewer)
- Shared workspaces
- Multiple users per project

### Code Editor
- Monaco Editor integration
- Syntax highlighting
- Multiple tabs
- Live preview
- Terminal panel

### GitHub Integration
- Secure token storage
- Create and manage repositories
- Push/pull code
- Commit history
- Branch support

### Deployment
- Vercel integration
- Netlify integration
- Cloudflare Pages support
- Deployment logs and history
- Custom domain support

### Authentication
- Email login
- Google OAuth
- GitHub OAuth

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Monaco Editor
- Socket.io Client

### Backend
- Node.js
- Express
- PostgreSQL
- Socket.io
- Cloudflare R2 (Storage)

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- Cloudflare R2 account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/d0f9ab221/Capiltopr.git
cd Capiltopr
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp packages/backend/.env.example packages/backend/.env
cp packages/frontend/.env.example packages/frontend/.env
```

4. Configure environment variables with your credentials.

5. Run database migrations:
```bash
npm run db:migrate
```

6. Start development servers:
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`
Backend will be available at `http://localhost:3001`

## Documentation

See the `docs/` directory for detailed documentation on:
- API endpoints
- Database schema
- Authentication flow
- AI provider configuration
- Deployment guides

## License

MIT
