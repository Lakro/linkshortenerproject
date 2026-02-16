# Styling Guidelines - Tailwind CSS & shadcn/ui

## Tailwind CSS Version
- **Tailwind CSS v4** - Latest version with new features
- PostCSS integration for processing
- Configuration in `postcss.config.mjs`

## Styling Philosophy
- **Utility-First**: Use Tailwind utility classes
- **Component Consistency**: Follow shadcn/ui patterns
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Support light and dark themes

## Tailwind Configuration

### Theme Colors
Base color: **Neutral** (as configured in components.json)
```typescript
// Use Tailwind's neutral color palette
bg-neutral-50    // Light backgrounds
bg-neutral-900   // Dark backgrounds
text-neutral-950 // Dark text
text-neutral-50  // Light text
```

### CSS Variables
The project uses CSS variables for theming:
```css
/* app/globals.css */
@theme {
  --color-background: /* light mode background */
  --color-foreground: /* light mode text */
}

.dark {
  --color-background: /* dark mode background */
  --color-foreground: /* dark mode text */
}
```

## Writing Styles

### Use Utility Classes
```tsx
// ✅ Good - Tailwind utilities
<div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm dark:bg-neutral-900">
  <h3 className="text-lg font-semibold">Link Title</h3>
  <Button variant="ghost" size="sm">Delete</Button>
</div>

// ❌ Bad - Custom CSS
<div className="custom-card">
  <h3 className="custom-title">Link Title</h3>
  <Button>Delete</Button>
</div>
```

### Use the `cn()` Utility
Always use the `cn()` helper for conditional classes:

```typescript
import { cn } from '@/lib/utils'

// ✅ Good
<div className={cn(
  "rounded-lg p-4",
  isActive && "bg-blue-50 border-blue-500",
  isDisabled && "opacity-50 cursor-not-allowed"
)}>
  Content
</div>

// ❌ Bad - String concatenation
<div className={`rounded-lg p-4 ${isActive ? 'bg-blue-50' : ''}`}>
  Content
</div>
```

### Responsive Design
Mobile-first approach with breakpoint prefixes:

```tsx
// ✅ Good - Mobile first, then tablet, desktop
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {/* Cards */}
</div>

<h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
  Title
</h1>

// Breakpoints:
// sm: 640px  - Small devices
// md: 768px  - Tablets
// lg: 1024px - Laptops
// xl: 1280px - Desktops
// 2xl: 1536px - Large screens
```

### Dark Mode
Use `dark:` prefix for dark mode styles:

```tsx
// ✅ Good
<div className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50">
  <p className="text-neutral-600 dark:text-neutral-400">
    Description text
  </p>
</div>

// Always provide dark mode variants for:
// - Background colors
// - Text colors
// - Border colors
// - Shadow effects
```

## Layout Patterns

### Flexbox Layouts
```tsx
// Horizontal layout with spacing
<div className="flex items-center gap-4">
  <Icon />
  <span>Text</span>
</div>

// Vertical layout
<div className="flex flex-col gap-2">
  <h2>Title</h2>
  <p>Description</p>
</div>

// Space between
<div className="flex items-center justify-between">
  <h3>Title</h3>
  <Button>Action</Button>
</div>

// Center content
<div className="flex min-h-screen items-center justify-center">
  <LoginForm />
</div>
```

### Grid Layouts
```tsx
// Card grid
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

// Dashboard layout
<div className="grid gap-4 md:grid-cols-[240px_1fr]">
  <Sidebar />
  <main>{children}</main>
</div>
```

### Container Patterns
```tsx
// Page container
<div className="container mx-auto px-4 py-8">
  {/* Page content */}
</div>

// Max-width container
<div className="mx-auto max-w-2xl">
  {/* Centered content with max width */}
</div>

// Full-width sections
<section className="w-full bg-neutral-50 py-12 dark:bg-neutral-900">
  <div className="container mx-auto">
    {/* Section content */}
  </div>
</section>
```

## Typography

### Headings
```tsx
<h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
  Main Heading
</h1>

<h2 className="text-3xl font-semibold tracking-tight">
  Section Heading
</h2>

<h3 className="text-2xl font-semibold">
  Subsection
</h3>

<h4 className="text-xl font-medium">
  Card Title
</h4>
```

### Body Text
```tsx
<p className="text-base leading-7 text-neutral-600 dark:text-neutral-400">
  Regular paragraph text with good line height for readability.
</p>

<p className="text-sm text-neutral-500 dark:text-neutral-500">
  Secondary or helper text
</p>

<span className="text-xs text-neutral-400">
  Metadata or timestamps
</span>
```

### Text Utilities
```tsx
// Truncate text
<p className="truncate">Very long text that will be truncated...</p>

// Line clamp (show max 2 lines)
<p className="line-clamp-2">
  Long text that will be limited to 2 lines...
</p>

// Text alignment
<p className="text-left sm:text-center lg:text-right">
  Responsive text alignment
</p>
```

## Spacing System

### Consistent Spacing
Use Tailwind's spacing scale (0.25rem increments):
```tsx
// Padding
p-2   // 0.5rem (8px)
p-4   // 1rem (16px)
p-6   // 1.5rem (24px)
p-8   // 2rem (32px)

// Margin
m-4   // 1rem
mt-8  // margin-top: 2rem
mb-6  // margin-bottom: 1.5rem

// Gap (for flexbox/grid)
gap-2  // 0.5rem
gap-4  // 1rem
gap-6  // 1.5rem
```

### Component Spacing Pattern
```tsx
// ✅ Good - Consistent spacing
<Card className="p-6">
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Title</h3>
    <p className="text-sm text-neutral-600">Description</p>
    <div className="flex gap-2">
      <Button>Action 1</Button>
      <Button variant="outline">Action 2</Button>
    </div>
  </div>
</Card>
```

## Colors

### Semantic Colors
```tsx
// Success
<div className="bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-400">
  Success message
</div>

// Error
<div className="bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-400">
  Error message
</div>

// Warning
<div className="bg-yellow-50 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-400">
  Warning message
</div>

// Info
<div className="bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-400">
  Info message
</div>
```

### Neutral Colors (Primary Palette)
```tsx
// Backgrounds
bg-neutral-50    // Light background
bg-neutral-100   // Subtle background
bg-neutral-900   // Dark background
bg-neutral-950   // Darker background

// Text
text-neutral-950 // Primary text (light mode)
text-neutral-50  // Primary text (dark mode)
text-neutral-600 // Secondary text (light mode)
text-neutral-400 // Secondary text (dark mode)

// Borders
border-neutral-200 // Light mode borders
border-neutral-800 // Dark mode borders
```

## Animations & Transitions

### Hover Effects
```tsx
// ✅ Good - Subtle hover effects
<button className="transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
  Hover me
</button>

<a className="transition-opacity hover:opacity-70">
  Link
</a>

// Scale on hover
<div className="transition-transform hover:scale-105">
  Card
</div>
```

### Loading States
```tsx
// Spinner animation
<div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />

// Pulse animation
<div className="animate-pulse">Loading...</div>

// Skeleton loader
<div className="h-4 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
```

## Accessibility

### Focus States
```tsx
// ✅ Good - Visible focus ring
<button className="rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2">
  Accessible Button
</button>

<input className="rounded-md border px-3 py-2 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400" />
```

### Screen Reader Only Content
```tsx
<span className="sr-only">
  Screen reader only text for accessibility
</span>
```

## Component-Specific Styles

### Cards
```tsx
<div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
  {/* Card content */}
</div>
```

### Forms
```tsx
<div className="space-y-4">
  <div className="space-y-2">
    <label className="text-sm font-medium">
      Label
    </label>
    <input 
      className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
      type="text" 
    />
  </div>
</div>
```

### Buttons (use shadcn/ui Button component)
```tsx
import { Button } from '@/components/ui/button'

<Button variant="default">Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
<Button variant="ghost">Tertiary Action</Button>
<Button variant="destructive">Delete</Button>
```

## Best Practices

### Do's
- ✅ Use Tailwind utilities for all styling
- ✅ Use `cn()` for conditional classes
- ✅ Provide dark mode variants
- ✅ Use semantic color names
- ✅ Follow mobile-first responsive design
- ✅ Use consistent spacing scale
- ✅ Add focus states for accessibility
- ✅ Use Tailwind's built-in animations

### Don'ts
- ❌ Don't use inline styles
- ❌ Don't create custom CSS unless absolutely necessary
- ❌ Don't use arbitrary values excessively (e.g., `w-[347px]`)
- ❌ Don't forget dark mode variants
- ❌ Don't use too many different spacing values
- ❌ Don't ignore accessibility (focus states, semantic HTML)
