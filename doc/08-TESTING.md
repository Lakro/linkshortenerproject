# Testing & Code Quality Guidelines

## Testing Philosophy
- Write tests for critical functionality
- Prioritize integration tests over unit tests
- Test user-facing behavior, not implementation details
- Maintain high test coverage for core features

## Testing Stack (To Be Configured)
Recommended testing tools for this project:
- **Vitest** - Fast unit testing framework
- **React Testing Library** - React component testing
- **Playwright** - End-to-end testing
- **MSW (Mock Service Worker)** - API mocking

## Unit Testing

### Test File Structure
```
src/
├── components/
│   ├── LinkForm.tsx
│   └── LinkForm.test.tsx
├── lib/
│   ├── utils.ts
│   └── utils.test.ts
└── app/
    ├── actions.ts
    └── actions.test.ts
```

### Writing Unit Tests
```typescript
// lib/utils.test.ts
import { describe, it, expect } from 'vitest'
import { generateShortCode, isValidUrl } from './utils'

describe('generateShortCode', () => {
  it('should generate a short code of specified length', () => {
    const code = generateShortCode(6)
    expect(code).toHaveLength(6)
  })
  
  it('should generate unique codes', () => {
    const code1 = generateShortCode()
    const code2 = generateShortCode()
    expect(code1).not.toBe(code2)
  })
  
  it('should only contain alphanumeric characters', () => {
    const code = generateShortCode()
    expect(code).toMatch(/^[a-zA-Z0-9]+$/)
  })
})

describe('isValidUrl', () => {
  it('should return true for valid URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true)
    expect(isValidUrl('http://example.com/path')).toBe(true)
  })
  
  it('should return false for invalid URLs', () => {
    expect(isValidUrl('not-a-url')).toBe(false)
    expect(isValidUrl('ftp://example.com')).toBe(false)
    expect(isValidUrl('')).toBe(false)
  })
})
```

## Component Testing

### Testing React Components
```typescript
// components/LinkForm.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LinkForm } from './LinkForm'

describe('LinkForm', () => {
  it('should render form fields', () => {
    render(<LinkForm />)
    
    expect(screen.getByLabelText(/url/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /shorten/i })).toBeInTheDocument()
  })
  
  it('should show validation error for invalid URL', async () => {
    render(<LinkForm />)
    
    const input = screen.getByLabelText(/url/i)
    const button = screen.getByRole('button', { name: /shorten/i })
    
    fireEvent.change(input, { target: { value: 'invalid-url' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/invalid url/i)).toBeInTheDocument()
    })
  })
  
  it('should call onSuccess when link is created', async () => {
    const onSuccess = vi.fn()
    render(<LinkForm onSuccess={onSuccess} />)
    
    const input = screen.getByLabelText(/url/i)
    const button = screen.getByRole('button', { name: /shorten/i })
    
    fireEvent.change(input, { target: { value: 'https://example.com' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(expect.any(String))
    })
  })
})
```

### Testing Server Components
```typescript
// app/dashboard/page.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import DashboardPage from './page'
import { getLinks } from '@/lib/queries'

vi.mock('@/lib/queries', () => ({
  getLinks: vi.fn(),
}))

describe('DashboardPage', () => {
  it('should display links', async () => {
    const mockLinks = [
      { id: '1', shortCode: 'abc123', originalUrl: 'https://example.com', clicks: 10 },
      { id: '2', shortCode: 'def456', originalUrl: 'https://test.com', clicks: 5 },
    ]
    
    vi.mocked(getLinks).mockResolvedValue(mockLinks)
    
    const { container } = render(await DashboardPage())
    
    expect(screen.getByText('abc123')).toBeInTheDocument()
    expect(screen.getByText('def456')).toBeInTheDocument()
  })
  
  it('should display empty state when no links', async () => {
    vi.mocked(getLinks).mockResolvedValue([])
    
    render(await DashboardPage())
    
    expect(screen.getByText(/no links yet/i)).toBeInTheDocument()
  })
})
```

## Integration Testing

### Testing Server Actions
```typescript
// app/actions.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { createLink, deleteLink } from './actions'
import { db } from '@/db'
import { links } from '@/db/schema'

describe('createLink', () => {
  beforeEach(async () => {
    // Clean up database
    await db.delete(links)
  })
  
  it('should create a new link', async () => {
    const formData = new FormData()
    formData.set('url', 'https://example.com')
    
    const result = await createLink(formData)
    
    expect(result.success).toBe(true)
    expect(result.shortCode).toBeDefined()
    
    // Verify in database
    const link = await db.query.links.findFirst({
      where: eq(links.shortCode, result.shortCode!),
    })
    expect(link).toBeDefined()
    expect(link?.originalUrl).toBe('https://example.com')
  })
  
  it('should return error for invalid URL', async () => {
    const formData = new FormData()
    formData.set('url', 'invalid-url')
    
    const result = await createLink(formData)
    
    expect(result.success).toBe(false)
    expect(result.error).toBe('Invalid URL')
  })
  
  it('should handle duplicate short codes', async () => {
    // Create first link
    const formData = new FormData()
    formData.set('url', 'https://example.com')
    formData.set('customCode', 'my-link')
    
    await createLink(formData)
    
    // Try to create duplicate
    const result = await createLink(formData)
    
    expect(result.success).toBe(false)
    expect(result.error).toContain('already exists')
  })
})
```

## E2E Testing

### Playwright Tests
```typescript
// tests/e2e/link-creation.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Link Creation', () => {
  test('should create a short link', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Click create button
    await page.click('text=Create Link')
    
    // Fill form
    await page.fill('input[name="url"]', 'https://example.com')
    await page.fill('input[name="title"]', 'Example Site')
    
    // Submit
    await page.click('button[type="submit"]')
    
    // Verify success message
    await expect(page.locator('text=Link created successfully')).toBeVisible()
    
    // Verify link appears in list
    await expect(page.locator('text=example.com')).toBeVisible()
  })
  
  test('should copy short link to clipboard', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    
    await page.goto('/dashboard')
    
    // Click copy button
    await page.click('[aria-label="Copy link"]')
    
    // Verify toast
    await expect(page.locator('text=Copied to clipboard')).toBeVisible()
    
    // Verify clipboard content
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboardText).toContain('http')
  })
})
```

## Code Quality Tools

### ESLint
```javascript
// eslint.config.mjs
import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Custom rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
]);
```

### TypeScript Strict Mode
Ensure `tsconfig.json` has strict settings:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Prettier (Optional)
```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

## Test Coverage

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run E2E tests
npm run test:e2e
```

### Coverage Goals
- **Critical paths**: 90%+ coverage
- **UI components**: 80%+ coverage
- **Utilities**: 95%+ coverage
- **Overall project**: 80%+ coverage

## Best Practices

### Do's
- ✅ Write tests for all critical functionality
- ✅ Test user behavior, not implementation
- ✅ Use descriptive test names
- ✅ Mock external dependencies (API calls, database)
- ✅ Keep tests independent and isolated
- ✅ Test edge cases and error scenarios
- ✅ Run tests before committing
- ✅ Maintain tests alongside code changes

### Don'ts
- ❌ Don't test third-party libraries
- ❌ Don't test framework internals
- ❌ Don't write flaky tests
- ❌ Don't skip tests to make CI pass
- ❌ Don't commit commented-out tests
- ❌ Don't test implementation details
- ❌ Don't ignore test failures

## Code Review Checklist

### Before Creating PR
- [ ] All tests pass locally
- [ ] No ESLint errors or warnings
- [ ] No TypeScript errors
- [ ] Code formatted consistently
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] Environment variables not committed
- [ ] Tested in both light and dark mode
- [ ] Tested responsive design
- [ ] Added tests for new features

### During Code Review
- [ ] Code is readable and maintainable
- [ ] Follows project coding standards
- [ ] No security vulnerabilities
- [ ] Proper error handling
- [ ] Efficient database queries
- [ ] No performance regressions
- [ ] Accessibility considerations
- [ ] Documentation updated if needed

## Debugging

### Next.js Debugging
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 9229,
      "console": "integratedTerminal"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Database Debugging
```typescript
// Enable Drizzle query logging
import { drizzle } from 'drizzle-orm/neon-serverless'

export const db = drizzle(pool, {
  logger: process.env.NODE_ENV === 'development',
})
```

### Performance Monitoring
```typescript
// Use Next.js built-in analytics
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```
