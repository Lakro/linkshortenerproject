# Authentication with Clerk

## ⚠️ CRITICAL: READ BEFORE CODING
**YOU MUST READ AND UNDERSTAND THIS ENTIRE DOCUMENT BEFORE WRITING OR UPDATING ANY AUTHENTICATION-RELATED CODE.**

Failure to follow these instructions will result in incorrect implementation that violates the project's authentication architecture.

## Overview
This project uses **Clerk** exclusively for all authentication and user management. No other authentication methods should be implemented.

## Core Principles

### 🔐 Clerk-Only Authentication
- **Exclusive Provider**: Use Clerk for all auth operations
- **No Custom Auth**: Do not implement custom login/signup flows
- **Clerk Components**: Use Clerk's built-in UI components
- **Session Management**: Leverage Clerk's session handling

## Configuration

### Environment Variables
```bash
# Required Clerk environment variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk route configuration
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### Clerk Provider Setup
Wrap the application with `ClerkProvider` in the root layout:

```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

## Route Protection

### Protected Routes
The `/dashboard` route and all dashboard subroutes MUST require authentication.

**CRITICAL**: When a user is not authenticated and tries to access `/dashboard`, redirect them to the **homepage (`/`)**, NOT to `/sign-in`. This is because authentication is ALWAYS done via modals triggered from buttons, never through full-page routes.

```typescript
// app/dashboard/layout.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/') // ⚠️ ALWAYS redirect to homepage, NEVER to /sign-in
  }

  return <>{children}</>
}
```

**Why redirect to `/` and not `/sign-in`?**
- Sign in/sign up pages exist ONLY to support Clerk's modal redirects
- Users should NEVER be sent directly to these pages
- The homepage provides Sign In/Sign Up buttons that open modals
- This ensures a consistent, modal-based authentication flow

### Homepage Redirect
If a user is logged in and tries to access the homepage (`/`), redirect them to `/dashboard`:

```typescript
// app/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const { userId } = await auth()
  
  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div>
      {/* Homepage content for non-authenticated users */}
    </div>
  )
}
```

## Sign In / Sign Up

### ⚠️ MODAL-ONLY AUTHENTICATION
**CRITICAL RULE**: Users MUST sign in and sign up ONLY through modals. They should NEVER be redirected to `/sign-in` or `/sign-up` pages directly.

### Modal Implementation
Sign in and sign up pages exist ONLY to support Clerk's modal system. Users access authentication by clicking buttons that open modals, NOT by visiting these pages directly:

```typescript
// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-xl"
          }
        }}
      />
    </div>
  )
}
```

```typescript
// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-xl"
          }
        }}
      />
    </div>
  )
}
```

### Triggering Sign In/Up Modals
Use Clerk's built-in components or methods to trigger modals:

```typescript
'use client'

import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

export function AuthButtons() {
  return (
    <div className="flex gap-4">
      <SignInButton mode="modal">
        <Button variant="outline">Sign In</Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button>Sign Up</Button>
      </SignUpButton>
    </div>
  )
}
```

## User Information

### Accessing User Data in Server Components
```typescript
import { currentUser } from '@clerk/nextjs/server'

export default async function ProfilePage() {
  const user = await currentUser()
  
  if (!user) return null

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <p>Email: {user.emailAddresses[0].emailAddress}</p>
    </div>
  )
}
```

### Accessing User Data in Client Components
```typescript
'use client'

import { useUser } from '@clerk/nextjs'

export function UserProfile() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) return <div>Loading...</div>
  if (!user) return null

  return (
    <div>
      <p>{user.firstName} {user.lastName}</p>
      <p>{user.emailAddresses[0].emailAddress}</p>
    </div>
  )
}
```

### Getting User ID
```typescript
// Server Component
import { auth } from '@clerk/nextjs/server'

export default async function MyPage() {
  const { userId } = await auth()
  // Use userId for database queries
}

// Server Action
'use server'

import { auth } from '@clerk/nextjs/server'

export async function myAction() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  // Proceed with action
}
```

## User Menu & Sign Out

### User Button Component
Use Clerk's `UserButton` for a complete user menu:

```typescript
'use client'

import { UserButton } from '@clerk/nextjs'

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex items-center justify-between py-4">
        <h1>My App</h1>
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-10 h-10"
            }
          }}
        />
      </div>
    </header>
  )
}
```

### Custom Sign Out Button
```typescript
'use client'

import { useClerk } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

export function SignOutButton() {
  const { signOut } = useClerk()

  return (
    <Button 
      variant="ghost" 
      onClick={() => signOut({ redirectUrl: '/' })}
    >
      Sign Out
    </Button>
  )
}
```

## Middleware for Route Protection

### Optional: Clerk Middleware
For additional route protection, use Clerk's middleware:

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/links(.*)'
])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

## Database Integration

### Storing User ID
Store Clerk's `userId` in your database for relations:

```typescript
// db/schema.ts
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const links = pgTable('links', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(), // Clerk user ID
  url: text('url').notNull(),
  shortCode: text('short_code').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

### Querying User's Data
```typescript
// app/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { links } from '@/db/schema'
import { eq } from 'drizzle-orm'

export default async function DashboardPage() {
  const { userId } = await auth()
  
  // Note: If /dashboard has a layout.tsx with auth protection,
  // this check is redundant. But if needed, it's included here for completeness.
  // Auth protection should be in layout.tsx which redirects to '/'
  
  if (!userId) {
    // This shouldn't happen if dashboard/layout.tsx is protecting the route
    return null
  }

  const userLinks = await db.query.links.findMany({
    where: eq(links.userId, userId),
    orderBy: (links, { desc }) => [desc(links.createdAt)]
  })

  return <div>{/* Render user's links */}</div>
}
```

## Styling & Theming

### Customizing Clerk Components
Match Clerk's appearance to your app's design:

```typescript
import { SignIn } from '@clerk/nextjs'

<SignIn 
  appearance={{
    layout: {
      socialButtonsPlacement: 'bottom',
      socialButtonsVariant: 'iconButton',
    },
    variables: {
      colorPrimary: '#3b82f6', // blue-500
      colorBackground: '#ffffff',
      colorText: '#0a0a0a',
      borderRadius: '0.5rem',
    },
    elements: {
      card: 'shadow-xl border border-neutral-200',
      formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
      footerActionLink: 'text-blue-600 hover:text-blue-700',
    }
  }}
/>
```

### Dark Mode Support
```typescript
<ClerkProvider
  appearance={{
    baseTheme: [/* light theme */, /* dark theme */],
  }}
>
  {children}
</ClerkProvider>
```

## Best Practices

### ✅ Do's
- Always use `await auth()` for server-side user checks
- Use `useUser()` hook for client-side user data
- Protect all dashboard routes with authentication checks
- Redirect logged-in users from homepage to dashboard
- Use modal mode for sign in/up flows
- Store only Clerk's `userId` in your database
- Use Clerk's built-in components when possible

### ❌ Don'ts
- Don't implement custom authentication logic
- Don't use any auth provider other than Clerk
- Don't store passwords or sensitive auth data
- Don't create custom login forms
- Don't bypass Clerk's session management
- Don't expose auth routes without protection
- Don't forget to check authentication in API routes

## Checklist for Auth Implementation

- [ ] Clerk environment variables configured
- [ ] `ClerkProvider` wrapping root layout
- [ ] `/dashboard` routes protected (redirect if not authenticated)
- [ ] Homepage redirects to `/dashboard` if authenticated
- [ ] Sign in/up pages created with modal support
- [ ] `SignInButton` and `SignUpButton` use `mode="modal"`
- [ ] User menu with `UserButton` or custom sign out
- [ ] Database schema includes `userId` field
- [ ] Queries filter by authenticated user's ID
- [ ] Middleware configured (if needed)
- [ ] Clerk components styled to match app theme

## Common Patterns

### Protecting a Server Action
```typescript
'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { links } from '@/db/schema'

export async function createLink(url: string) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const result = await db.insert(links).values({
    userId,
    url,
    shortCode: generateShortCode(),
  })

  return result
}
```

### Conditional Rendering Based on Auth
```typescript
'use client'

import { useAuth } from '@clerk/nextjs'
import { AuthButtons } from './auth-buttons'
import { UserButton } from '@clerk/nextjs'

export function NavBar() {
  const { isSignedIn } = useAuth()

  return (
    <nav>
      {isSignedIn ? (
        <UserButton afterSignOutUrl="/" />
      ) : (
        <AuthButtons />
      )}
    </nav>
  )
}
```

---

**Remember**: Clerk handles all authentication complexities. Never implement custom auth logic—use Clerk's provided methods and components exclusively.
