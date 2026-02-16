# Agent Instructions - Link Shortener Project

## Overview
This document provides comprehensive coding standards and guidelines for LLM agents working on this Link Shortener project. These instructions ensure consistent, high-quality code that follows industry best practices.

## Project Information
- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript 5
- **Database**: Drizzle ORM with Neon PostgreSQL
- **Authentication**: Clerk
- **UI**: shadcn/ui (New York style) + Tailwind CSS v4
- **Icons**: Lucide React

## Documentation Structure

All detailed agent instructions are organized in the `/doc` directory:

### 📖 Core Documentation

1. **[00-OVERVIEW.md](doc/00-OVERVIEW.md)**
   - Project purpose and goals
   - Complete tech stack breakdown
   - Quick start commands
   - Environment setup

2. **[01-ARCHITECTURE.md](doc/01-ARCHITECTURE.md)**
   - Folder structure and organization
   - Next.js App Router conventions
   - Component organization patterns
   - Path aliases and imports
   - Naming conventions

3. **[02-TYPESCRIPT.md](doc/02-TYPESCRIPT.md)**
   - TypeScript configuration (strict mode)
   - Type definition patterns
   - Type guards and utility types
   - React-specific types
   - Error handling with types
   - Common pitfalls to avoid

4. **[03-REACT-NEXTJS.md](doc/03-REACT-NEXTJS.md)**
   - Server vs Client Components
   - Server Actions best practices
   - Data fetching patterns
   - Metadata and SEO
   - Performance optimization
   - Error boundaries and loading states

5. **[04-STYLING.md](doc/04-STYLING.md)**
   - Tailwind CSS v4 conventions
   - `cn()` utility usage
   - Responsive design patterns
   - Dark mode implementation
   - Layout patterns (Flexbox, Grid)
   - Color system and spacing

6. **[05-DATABASE.md](doc/05-DATABASE.md)**
   - Drizzle ORM schema definitions
   - Query patterns and best practices
   - Relations and joins
   - Migrations workflow
   - Type safety with database
   - Performance optimization

7. **[06-COMPONENTS.md](doc/06-COMPONENTS.md)**
   - shadcn/ui component usage
   - Custom component creation
   - Component composition patterns
   - Lucide React icons
   - Accessibility guidelines
   - Component best practices

8. **[07-GIT.md](doc/07-GIT.md)**
   - Branch naming conventions
   - Commit message format (Conventional Commits)
   - Pull request guidelines
   - Git workflow
   - Security best practices

9. **[08-TESTING.md](doc/08-TESTING.md)**
   - Testing strategy and philosophy
   - Unit, integration, and E2E testing
   - Code quality tools (ESLint, TypeScript)
   - Code review checklist
   - Debugging techniques

## Quick Reference

### Project Commands
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
```

### Common Patterns

#### Imports
```typescript
import { Button } from '@/components/ui/button'
import { db } from '@/db'
import { links } from '@/db/schema'
import { cn } from '@/lib/utils'
```

#### Server Component with Data Fetching
```typescript
// app/dashboard/page.tsx
import { db } from '@/db'
import { links } from '@/db/schema'

export default async function DashboardPage() {
  const userLinks = await db.query.links.findMany()
  return <div>{/* Render links */}</div>
}
```

#### Client Component with State
```typescript
// components/LinkForm.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function LinkForm() {
  const [url, setUrl] = useState('')
  // Component logic
}
```

#### Server Action
```typescript
// app/actions.ts
'use server'

import { db } from '@/db'
import { links } from '@/db/schema'

export async function createLink(formData: FormData) {
  const url = formData.get('url') as string
  // Validation and database logic
  return { success: true, shortCode: 'abc123' }
}
```

#### Styling with Tailwind
```typescript
<div className={cn(
  "rounded-lg border bg-white p-6 shadow-sm",
  "dark:bg-neutral-900 dark:border-neutral-800",
  isActive && "border-blue-500"
)}>
  Content
</div>
```

## Key Principles

### 🎯 Code Quality
- **Type Safety**: Use TypeScript strictly, no `any` types
- **Component Design**: Server Components by default, Client Components when needed
- **Composition**: Build complex features from simple, reusable components
- **Performance**: Optimize images, use dynamic imports, implement proper caching

### 🎨 User Experience
- **Responsive**: Mobile-first design with Tailwind breakpoints
- **Accessible**: Proper ARIA labels, keyboard navigation, focus states
- **Dark Mode**: Support both light and dark themes
- **Loading States**: Provide feedback during async operations

### 🔒 Security
- **Environment Variables**: Never commit secrets
- **Input Validation**: Validate all user inputs
- **SQL Injection**: Use Drizzle ORM (never raw SQL)
- **Authentication**: Leverage Clerk for secure auth

### 📊 Database
- **Type-Safe Queries**: Use Drizzle ORM exclusively
- **Relations**: Define relations for complex queries
- **Migrations**: Version control schema changes
- **Performance**: Add indexes for frequently queried columns

### ✅ Testing
- **Coverage**: Aim for 80%+ coverage on critical paths
- **Types of Tests**: Unit, integration, and E2E tests
- **Test Behavior**: Test user-facing features, not implementation
- **CI/CD**: All tests must pass before merging

### 📝 Git Workflow
- **Branches**: `feature/`, `fix/`, `refactor/` prefixes
- **Commits**: Conventional Commits format
- **PRs**: Small, focused pull requests with clear descriptions
- **Code Review**: Required before merging to main

## When Building Features

### 1. Plan the Architecture
- Determine if components should be Server or Client Components
- Design the database schema and relations
- Plan the data flow (Server Actions, queries)

### 2. Implement with Standards
- Follow TypeScript strict typing
- Use shadcn/ui components as building blocks
- Apply Tailwind CSS for styling with `cn()` utility
- Implement proper error handling and loading states

### 3. Ensure Quality
- Write tests for critical functionality
- Verify accessibility (keyboard nav, ARIA labels)
- Test on multiple screen sizes and themes
- Review code against guidelines

### 4. Document and Deploy
- Write clear commit messages
- Update documentation if needed
- Create detailed pull requests
- Ensure all CI checks pass

## Important Files

### Configuration Files
- `tsconfig.json` - TypeScript configuration (strict mode)
- `next.config.ts` - Next.js configuration
- `drizzle.config.ts` - Database configuration
- `components.json` - shadcn/ui settings
- `eslint.config.mjs` - Linting rules
- `tailwind.config.ts` - Tailwind CSS setup (if exists)

### Core Directories
- `app/` - Next.js App Router (pages, layouts, API routes)
- `components/` - React components
- `db/` - Database schemas and client
- `lib/` - Utility functions
- `doc/` - Agent instructions and documentation

## Getting Help

### For Architecture Questions
→ See [01-ARCHITECTURE.md](doc/01-ARCHITECTURE.md)

### For TypeScript Issues
→ See [02-TYPESCRIPT.md](doc/02-TYPESCRIPT.md)

### For React/Next.js Patterns
→ See [03-REACT-NEXTJS.md](doc/03-REACT-NEXTJS.md)

### For Styling Questions
→ See [04-STYLING.md](doc/04-STYLING.md)

### For Database Operations
→ See [05-DATABASE.md](doc/05-DATABASE.md)

### For Component Development
→ See [06-COMPONENTS.md](doc/06-COMPONENTS.md)

### For Git/Version Control
→ See [07-GIT.md](doc/07-GIT.md)

### For Testing
→ See [08-TESTING.md](doc/08-TESTING.md)

## Checklist for New Features

Use this checklist when implementing new features:

- [ ] Feature planned according to architecture guidelines
- [ ] TypeScript types defined (no `any` types)
- [ ] Server/Client components chosen appropriately
- [ ] Database schema updated with migrations
- [ ] UI components use shadcn/ui + Tailwind CSS
- [ ] Dark mode support implemented
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Accessibility considerations (ARIA, keyboard nav)
- [ ] Error handling and validation
- [ ] Loading states for async operations
- [ ] Tests written for critical paths
- [ ] ESLint passes with no errors
- [ ] TypeScript compiles with no errors
- [ ] Commit messages follow Conventional Commits
- [ ] Pull request created with description
- [ ] Code reviewed and approved

## Remember

> **Quality over Speed**: Take time to write clean, maintainable, type-safe code that follows these guidelines. Future developers (and future you) will thank you.

> **When in Doubt**: Refer to the detailed documentation in `/doc/` directory. Each file contains comprehensive examples and best practices.

> **Consistency is Key**: Follow existing patterns in the codebase. When adding new patterns, document them for others.

---

**Last Updated**: February 2026  
**Version**: 1.0.0  
**Maintained By**: Development Team
