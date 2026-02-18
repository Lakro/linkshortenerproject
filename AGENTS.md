# Agent Instructions - Link Shortener Project

## 🚨 CRITICAL - STOP AND READ THIS FIRST 🚨

### ⛔ MANDATORY: READ DOCUMENTATION BEFORE ANY CODE GENERATION ⛔

**YOU MUST READ THE RELEVANT DOCUMENTATION FILES IN `/doc/` BEFORE WRITING OR UPDATING ANY CODE.**

**THIS IS A BLOCKING REQUIREMENT. FAILURE TO COMPLY WILL RESULT IN INCORRECT CODE.**

### ⚠️ IMPORTANT RULES:
1. ✋ **STOP** - Do NOT write code immediately
2. 📖 **READ** - Read the ENTIRE relevant documentation file in `/doc/`
3. 🧠 **UNDERSTAND** - Comprehend the patterns and rules
4. ✅ **THEN** - Write code following those exact patterns

**DO NOT SKIP READING THE DOCS.**  
**DO NOT ASSUME YOU KNOW THE PATTERNS.**  
**DO NOT GENERATE CODE BASED ON GENERAL KNOWLEDGE.**  
**ALWAYS READ THE PROJECT-SPECIFIC INSTRUCTIONS FIRST.**

## Overview
This document provides comprehensive coding standards and guidelines for LLM agents working on this Link Shortener project. These instructions ensure consistent, high-quality code that follows industry best practices.

## Project Information
- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript 5
- **Database**: Drizzle ORM with Neon PostgreSQL
- **Authentication**: Clerk
- **UI**: shadcn/ui (New York style) + Tailwind CSS v4
- **Icons**: Lucide React
- **Fonts**: Geist (sans-serif) and Geist Mono (monospace) - loaded locally via `geist` package

## Documentation Structure

### 🔴 CRITICAL WORKFLOW - FOLLOW THIS EXACTLY 🔴

**Before writing ANY code, you MUST:**

1. **IDENTIFY** - Determine which aspect of the project you're working on (auth, UI, database, etc.)
2. **READ** - Open and read the ENTIRE relevant documentation file in `/doc/`
3. **UNDERSTAND** - Study the patterns, examples, and rules completely
4. **IMPLEMENT** - ONLY THEN write code following those exact patterns

### 🚫 NEVER DO THIS:
- ❌ Generate code based on general Next.js knowledge
- ❌ Assume you know the project patterns
- ❌ Skip reading the documentation files
- ❌ Skim or partially read the docs
- ❌ Write code first and check docs later

### ✅ ALWAYS DO THIS:
- ✅ Read the COMPLETE relevant documentation file BEFORE writing ANY code
- ✅ Follow the exact patterns shown in the documentation
- ✅ Reference the examples in the docs
- ✅ Verify your code matches the documented patterns

---

### 📚 Available Documentation Files

All detailed agent instructions are organized in the `/doc` directory. Each file contains specific guidelines and examples:

- **[01-AUTHENTICATION.md](doc/01-AUTHENTICATION.md)** - Clerk authentication, route protection, and user management  
  → **MUST READ BEFORE** any auth code, protected routes, or user management
  
- **[02-UI-COMPONENTS.md](doc/02-UI-COMPONENTS.md)** - shadcn/ui components, forms, tables, cards, and layouts  
  → **MUST READ BEFORE** any UI components, forms, or styling code

---

### 🎯 How to Determine Which File to Read

**Working on Authentication/Users?** → Read `01-AUTHENTICATION.md`  
**Working on UI/Components/Forms?** → Read `02-UI-COMPONENTS.md`  
**Working on Database?** → Read database documentation (when available)  
**Not sure?** → Read ALL relevant files, better safe than sorry!


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

### ⚠️ STEP 0: READ THE DOCUMENTATION FIRST
**Before doing ANY of the steps below, READ the relevant `/doc/` files!**

Do NOT proceed to step 1 until you have:
- ✅ Identified which documentation files are relevant
- ✅ Read those files completely from start to finish
- ✅ Understood the patterns and examples

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

### For Authentication & User Management
→ See [01-AUTHENTICATION.md](doc/01-AUTHENTICATION.md)

### For UI Components, Forms, Tables & Layouts
→ See [02-UI-COMPONENTS.md](doc/02-UI-COMPONENTS.md)

## Checklist for New Features

Use this checklist when implementing new features:

- [ ] **🔴 READ RELEVANT DOCUMENTATION in `/doc/` FIRST** (BLOCKING - DO NOT PROCEED WITHOUT THIS)
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

> **📖 READ DOCS FIRST - ALWAYS**: Before writing ANY code, read the complete relevant documentation file in `/doc/`. This is not optional. This is not negotiable. This is MANDATORY.

> **Quality over Speed**: Take time to write clean, maintainable, type-safe code that follows these guidelines. Future developers (and future you) will thank you.

> **When in Doubt**: Refer to the detailed documentation in `/doc/` directory. Each file contains comprehensive examples and best practices. When you're certain, still refer to them to confirm.

> **Consistency is Key**: Follow existing patterns in the codebase. When adding new patterns, document them for others.

---

## 🔴 FINAL REMINDER 🔴

**If you take away ONE thing from this document, let it be this:**

### NEVER GENERATE CODE WITHOUT READING THE RELEVANT `/doc/` FILES FIRST

The documentation files contain:
- ✅ Project-specific patterns and conventions
- ✅ Exact code examples to follow
- ✅ Common pitfalls to avoid
- ✅ Best practices for this specific project

**Your general knowledge of Next.js, React, or TypeScript is NOT enough.**  
**This project has SPECIFIC patterns that you MUST follow.**  
**Those patterns are documented in `/doc/`.**  
**READ THEM FIRST. EVERY TIME.**

---

**Last Updated**: February 2026  
**Version**: 1.0.0  
**Maintained By**: Development Team
