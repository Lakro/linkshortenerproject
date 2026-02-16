# Component Guidelines - shadcn/ui

## shadcn/ui Configuration
- **Style**: New York
- **Base Color**: Neutral
- **Icons**: Lucide React
- **CSS Variables**: Enabled
- **RSC (React Server Components)**: Enabled

## Installing Components

### Using shadcn CLI
```bash
# Add a single component
npx shadcn@latest add button

# Add multiple components
npx shadcn@latest add button input card

# List available components
npx shadcn@latest
```

### Component Location
All shadcn/ui components are installed to:
```
components/
└── ui/
    ├── button.tsx
    ├── input.tsx
    ├── card.tsx
    └── ...
```

## Using shadcn/ui Components

### Button Component
```typescript
import { Button } from '@/components/ui/button'

// Variants
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">
  <IconComponent />
</Button>

// States
<Button disabled>Disabled</Button>
<Button asChild>
  <Link href="/dashboard">Dashboard</Link>
</Button>
```

### Input Component
```typescript
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

<div className="space-y-2">
  <Label htmlFor="url">URL</Label>
  <Input 
    id="url"
    type="url" 
    placeholder="https://example.com"
    required
  />
</div>
```

### Card Component
```typescript
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Link Statistics</CardTitle>
    <CardDescription>View your link performance</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Total clicks: 1,234</p>
  </CardContent>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>
```

### Form Components
```typescript
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'

// Complete form example
<form className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="url">Original URL</Label>
    <Input id="url" type="url" placeholder="https://example.com" />
  </div>
  
  <div className="space-y-2">
    <Label htmlFor="custom">Custom Short Code (optional)</Label>
    <Input id="custom" placeholder="my-link" />
  </div>
  
  <div className="space-y-2">
    <Label htmlFor="description">Description</Label>
    <Textarea id="description" placeholder="Optional description" />
  </div>
  
  <div className="flex items-center space-x-2">
    <Switch id="active" />
    <Label htmlFor="active">Active</Label>
  </div>
  
  <Button type="submit">Create Short Link</Button>
</form>
```

### Dialog Component
```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'

<Dialog>
  <DialogTrigger asChild>
    <Button>Create Link</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create Short Link</DialogTitle>
      <DialogDescription>
        Enter the URL you want to shorten
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-4">
      {/* Form content */}
    </div>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button type="submit">Create</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Dropdown Menu
```typescript
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreVertical className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <Edit className="mr-2 h-4 w-4" />
      Edit
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Copy className="mr-2 h-4 w-4" />
      Copy Link
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-red-600">
      <Trash className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Toast Notifications
```typescript
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'

function MyComponent() {
  const { toast } = useToast()
  
  return (
    <Button
      onClick={() => {
        toast({
          title: "Link Created",
          description: "Your short link has been created successfully.",
        })
      }}
    >
      Create Link
    </Button>
  )
}

// Error toast
toast({
  title: "Error",
  description: "Something went wrong. Please try again.",
  variant: "destructive",
})

// Success toast
toast({
  title: "Success",
  description: "Link deleted successfully.",
})
```

### Table Component
```typescript
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Short Code</TableHead>
      <TableHead>Original URL</TableHead>
      <TableHead>Clicks</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {links.map((link) => (
      <TableRow key={link.id}>
        <TableCell className="font-medium">{link.shortCode}</TableCell>
        <TableCell>{link.originalUrl}</TableCell>
        <TableCell>{link.clicks}</TableCell>
        <TableCell>
          <Button variant="ghost" size="sm">Edit</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## Creating Custom Components

### Component Structure
```typescript
// components/features/LinkCard.tsx
'use client' // Only if client interactivity needed

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Copy, Trash } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LinkCardProps {
  link: {
    id: string
    shortCode: string
    originalUrl: string
    clicks: number
  }
  onDelete?: (id: string) => void
  className?: string
}

export function LinkCard({ link, onDelete, className }: LinkCardProps) {
  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${link.shortCode}`
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl)
    // Show toast notification
  }
  
  return (
    <Card className={cn("transition-shadow hover:shadow-md", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">
              {shortUrl}
            </CardTitle>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {link.originalUrl}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600">
            {link.clicks} clicks
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <a href={link.originalUrl} target="_blank" rel="noopener">
                <ExternalLink className="mr-1 h-4 w-4" />
                Visit
              </a>
            </Button>
            {onDelete && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onDelete(link.id)}
              >
                <Trash className="mr-1 h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### Component Composition
Build features by composing smaller components:

```typescript
// components/features/LinksList.tsx
import { LinkCard } from './LinkCard'
import { EmptyState } from './EmptyState'

interface LinksListProps {
  links: Link[]
  onDelete: (id: string) => void
}

export function LinksList({ links, onDelete }: LinksListProps) {
  if (links.length === 0) {
    return <EmptyState message="No links yet. Create your first link!" />
  }
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} onDelete={onDelete} />
      ))}
    </div>
  )
}
```

## Icons with Lucide React

### Using Icons
```typescript
import { 
  Link as LinkIcon,
  Copy,
  Trash,
  Edit,
  BarChart,
  Settings,
  User,
  LogOut,
} from 'lucide-react'

// In components
<Button>
  <LinkIcon className="mr-2 h-4 w-4" />
  Create Link
</Button>

// Icon-only button
<Button variant="ghost" size="icon">
  <Settings className="h-5 w-5" />
</Button>

// With custom size
<BarChart className="h-6 w-6 text-neutral-600" />
```

### Common Icon Patterns
```typescript
// Menu item with icon
<DropdownMenuItem>
  <LogOut className="mr-2 h-4 w-4" />
  <span>Log out</span>
</DropdownMenuItem>

// Status indicator
<div className="flex items-center gap-2">
  <div className="h-2 w-2 rounded-full bg-green-500" />
  <span className="text-sm">Active</span>
</div>

// Loading state
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Loading...
</Button>
```

## Component Best Practices

### Do's
- ✅ Use shadcn/ui components as building blocks
- ✅ Compose complex components from simpler ones
- ✅ Accept `className` prop for custom styling
- ✅ Use `cn()` utility for conditional classes
- ✅ Extract reusable components to separate files
- ✅ Use TypeScript for all component props
- ✅ Use Lucide icons consistently
- ✅ Follow shadcn/ui naming conventions

### Don'ts
- ❌ Don't modify shadcn/ui component files directly (copy and customize instead)
- ❌ Don't create custom components for things shadcn/ui already provides
- ❌ Don't forget to make components responsive
- ❌ Don't hardcode component styles (use Tailwind classes)
- ❌ Don't mix different icon libraries
- ❌ Don't forget accessibility (labels, aria attributes)

## Accessibility

### Keyboard Navigation
```typescript
// Ensure focusable elements
<Button>Accessible Button</Button>

// Custom focus styles
<div 
  tabIndex={0}
  className="focus:outline-none focus:ring-2 focus:ring-neutral-400"
>
  Content
</div>
```

### Screen Reader Support
```typescript
// Use semantic HTML
<nav aria-label="Main navigation">
  {/* Navigation items */}
</nav>

// Add labels
<Button aria-label="Delete link">
  <Trash className="h-4 w-4" />
</Button>

// Describe interactive elements
<Input 
  aria-describedby="url-help"
  id="url"
/>
<p id="url-help" className="text-sm text-neutral-600">
  Enter the URL you want to shorten
</p>
```

### Form Accessibility
```typescript
// Always use labels
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" />
</div>

// Error states
<div>
  <Input 
    id="url" 
    aria-invalid={error ? "true" : "false"}
    aria-describedby={error ? "url-error" : undefined}
  />
  {error && (
    <p id="url-error" className="text-sm text-red-600">
      {error}
    </p>
  )}
</div>
```
