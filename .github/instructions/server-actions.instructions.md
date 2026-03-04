---
description: Read this before implementing or modifying any server actions. This file contains critical instructions for writing server actions correctly in this project.
---

# Server Actions Instructions

## Rules

- ALL data mutations must be done via server actions
- Server actions MUST be called from client components only
- Server action files MUST be named `actions.ts` and colocated in the same directory as the client component that calls them
- Server actions MUST have `'use server'` at the top of the file
- Server actions MUST **never throw errors** — always return an object with an `error` or `success` property instead

```typescript
// ✅ Correct
export async function createLink(input: CreateLinkInput) {
  try {
    // ...
    return { success: true }
  } catch {
    return { error: 'Something went wrong' }
  }
}

// ❌ Wrong
export async function createLink(input: CreateLinkInput) {
  throw new Error('Something went wrong')
}
```

## TypeScript Types

- ALL data passed to server actions must have explicit TypeScript types
- **NEVER** use `FormData` as a parameter type — define a typed object instead

```typescript
// ✅ Correct
type CreateLinkInput = {
  url: string
  shortCode: string
}

export async function createLink(input: CreateLinkInput) { ... }

// ❌ Wrong
export async function createLink(formData: FormData) { ... }
```

## Validation

- ALL inputs MUST be validated using **Zod** before any logic runs

```typescript
'use server'

import { z } from 'zod'

const schema = z.object({
  url: z.string().url(),
  shortCode: z.string().min(3).max(32),
})

export async function createLink(input: CreateLinkInput) {
  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    return { error: 'Invalid input' }
  }
  // ...
}
```

## Authentication

- ALL server actions MUST verify a logged-in user before any database operation

```typescript
import { auth } from '@clerk/nextjs/server'

export async function createLink(input: CreateLinkInput) {
  const { userId } = await auth()
  if (!userId) return { error: 'Unauthorized' }
  // ...
}
```

## Database Access

- NEVER use Drizzle queries directly inside server actions
- ALL database operations must go through helper functions in the `/data` directory

```typescript
// ✅ Correct — use helper from /data
import { insertLink } from '@/data/links'

export async function createLink(input: CreateLinkInput) {
  const { userId } = await auth()
  if (!userId) return { error: 'Unauthorized' }
  const parsed = schema.safeParse(input)
  if (!parsed.success) return { error: 'Invalid input' }
  await insertLink({ ...parsed.data, userId })
  return { success: true }
}

// ❌ Wrong — direct Drizzle usage in action
import { db } from '@/db'
import { links } from '@/db/schema'
await db.insert(links).values({ ... })
```

## File Structure Example

```
app/
  dashboard/
    page.tsx              ← Server Component (renders the page)
    LinkForm.tsx          ← Client Component ('use client')
    actions.ts            ← Server actions used by LinkForm.tsx
data/
  links.ts                ← Drizzle query helper functions
```

## Summary Checklist

Use this checklist to verify generated server action code before finalizing:

- [ ] File is named `actions.ts` and colocated with the client component that calls it
- [ ] File has `'use server'` at the top
- [ ] Server action is called from a client component (`'use client'`)
- [ ] Input parameter has an explicit TypeScript type (no `FormData`)
- [ ] Input is validated with Zod using `safeParse` before any logic
- [ ] Auth check (`userId`) is performed before any database operation
- [ ] Returns `{ error: '...' }` on failure — does **not** throw errors
- [ ] Returns `{ success: true }` (or relevant data) on success
- [ ] Database operations use helper functions from `/data` — no direct Drizzle queries
