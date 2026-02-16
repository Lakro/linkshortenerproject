# Project Overview - Link Shortener

## Purpose
This is a full-stack link shortener application built with modern web technologies. The application allows users to create shortened URLs, track analytics, and manage their links.

## Tech Stack

### Core Framework
- **Next.js 16.1.6** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript 5** - Type-safe JavaScript

### Database & ORM
- **Drizzle ORM 0.45.1** - Type-safe SQL ORM
- **Neon Database** - Serverless Postgres database
- **drizzle-kit** - Database migrations and introspection

### Authentication
- **Clerk** - User authentication and management

### UI & Styling
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library (New York style)
- **Lucide React** - Icon library
- **class-variance-authority** - Component variant management
- **tailwind-merge & clsx** - Class name utilities

### Development Tools
- **ESLint** - Code linting with Next.js config
- **tsx** - TypeScript execution
- **PostCSS** - CSS processing

## Project Goals
- Create a performant, type-safe link shortening service
- Provide excellent user experience with modern UI components
- Maintain clean, maintainable, and scalable code
- Follow industry best practices for Next.js and TypeScript development

## Key Features (Planned/In Development)
- URL shortening and custom alias support
- User authentication via Clerk
- Link analytics and tracking
- Dashboard for link management
- Dark mode support
- Responsive design

## Development Environment
- **Package Manager**: npm
- **Node.js**: Latest LTS version recommended
- **OS Compatibility**: Cross-platform (Windows, macOS, Linux)

## Quick Start Commands
```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Environment Requirements
Ensure the following environment variables are configured:
- Clerk authentication keys
- Neon database connection string
- Any additional API keys as needed

See `.env.example` for complete list (if available).
