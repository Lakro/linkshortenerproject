# UI Components with shadcn/ui

## Overview
This project uses **shadcn/ui** (New York style) exclusively for all UI components. All interface elements must be built using shadcn/ui components—no custom UI components should be created.

## Core Principles

### 🎨 shadcn/ui Only
- **Exclusive UI Library**: Use shadcn/ui for all interface elements
- **No Custom Components**: NEVER create custom UI components from scratch
- **Composition Over Creation**: Combine shadcn components to build complex UIs
- **New York Style**: All components follow the New York aesthetic variant

### 🚫 Strict Rules
> **NEVER** create custom buttons, inputs, cards, dialogs, or any other UI primitives. **ALWAYS** use the corresponding shadcn/ui component.

## Configuration

### shadcn/ui Setup
The project is configured with:
```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide"
}
```

### Installing Components
Before using a shadcn component, ensure it's installed:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add table
```

## Component Categories

### Forms

#### Basic Form with Input
```typescript
'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LinkForm() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url">URL to shorten</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://example.com/very-long-url"
          required
        />
      </div>
      <Button type="submit">Shorten Link</Button>
    </form>
  )
}
```

#### Form with React Hook Form
```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL' }),
  customSlug: z.string().optional(),
})

export function AdvancedLinkForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      customSlug: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Original URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormDescription>
                The URL you want to shorten
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create Short Link</Button>
      </form>
    </Form>
  )
}
```

### Cards & Layouts

#### Basic Card
```typescript
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function StatsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Clicks</CardTitle>
        <CardDescription>Last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">1,234</p>
      </CardContent>
    </Card>
  )
}
```

#### Card with Footer
```typescript
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function LinkCard({ link }: { link: { shortCode: string; url: string } }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate">{link.url}</CardTitle>
        <CardDescription>Short: /{link.shortCode}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Click to copy short link
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">View Stats</Button>
        <Button>Copy Link</Button>
      </CardFooter>
    </Card>
  )
}
```

### Data Tables

#### Simple Table
```typescript
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function LinksTable({ links }: { links: Array<{ shortCode: string; url: string; clicks: number }> }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Short Code</TableHead>
          <TableHead>Original URL</TableHead>
          <TableHead className="text-right">Clicks</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {links.map((link) => (
          <TableRow key={link.shortCode}>
            <TableCell className="font-medium">{link.shortCode}</TableCell>
            <TableCell className="truncate max-w-md">{link.url}</TableCell>
            <TableCell className="text-right">{link.clicks}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

#### Table with Actions
```typescript
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { MoreHorizontal } from 'lucide-react'

export function LinksTableWithActions({ links }: { links: Array<{ id: string; shortCode: string; url: string }> }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Short Code</TableHead>
          <TableHead>URL</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {links.map((link) => (
          <TableRow key={link.id}>
            <TableCell>{link.shortCode}</TableCell>
            <TableCell className="truncate max-w-md">{link.url}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>Copy link</DropdownMenuItem>
                  <DropdownMenuItem>View analytics</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

### Dialogs & Modals

#### Confirmation Dialog
```typescript
'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

export function DeleteLinkDialog({ onConfirm }: { onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            shortened link.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

#### Form Dialog
```typescript
'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function CreateLinkDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create New Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Short Link</DialogTitle>
          <DialogDescription>
            Enter the URL you want to shorten
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">Custom Slug (optional)</Label>
            <Input
              id="slug"
              placeholder="my-link"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create Link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### Buttons & Navigation

#### Button Variants
```typescript
import { Button } from '@/components/ui/button'

export function ButtonExample() {
  return (
    <div className="flex gap-2">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  )
}
```

#### Buttons with Icons
```typescript
import { Button } from '@/components/ui/button'
import { Link2, Copy, Trash2 } from 'lucide-react'

export function IconButtons() {
  return (
    <div className="flex gap-2">
      <Button>
        <Link2 className="mr-2 h-4 w-4" />
        Create Link
      </Button>
      <Button variant="outline" size="icon">
        <Copy className="h-4 w-4" />
      </Button>
      <Button variant="destructive" size="sm">
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
  )
}
```

### Loading States & Feedback

#### Skeleton Loading
```typescript
import { Skeleton } from '@/components/ui/skeleton'

export function LinkCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-8 w-1/4" />
    </div>
  )
}
```

#### Toast Notifications
```typescript
'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export function CopyLinkButton({ link }: { link: string }) {
  const { toast } = useToast()

  const handleCopy = () => {
    navigator.clipboard.writeText(link)
    toast({
      title: 'Link copied!',
      description: 'The short link has been copied to your clipboard.',
    })
  }

  return <Button onClick={handleCopy}>Copy Link</Button>
}
```

## Common Patterns

### Responsive Grid Layout
```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Links</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">24</p>
        </CardContent>
      </Card>
      {/* More cards */}
    </div>
  )
}
```

### Conditional Styling with cn()
```typescript
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function StatusButton({ isActive }: { isActive: boolean }) {
  return (
    <Button
      className={cn(
        'w-full',
        isActive && 'bg-green-500 hover:bg-green-600'
      )}
    >
      {isActive ? 'Active' : 'Inactive'}
    </Button>
  )
}
```

### Empty States
```typescript
import { Button } from '@/components/ui/button'
import { Link2 } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Link2 className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold">No links yet</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Get started by creating your first short link
      </p>
      <Button>Create Link</Button>
    </div>
  )
}
```

## Common Components Reference

### Essential Components
- **Button**: `@/components/ui/button`
- **Input**: `@/components/ui/input`
- **Label**: `@/components/ui/label`
- **Card**: `@/components/ui/card`
- **Form**: `@/components/ui/form`
- **Table**: `@/components/ui/table`
- **Dialog**: `@/components/ui/dialog`
- **Alert Dialog**: `@/components/ui/alert-dialog`
- **Dropdown Menu**: `@/components/ui/dropdown-menu`
- **Toast**: `@/components/ui/toast` + `@/hooks/use-toast`
- **Skeleton**: `@/components/ui/skeleton`
- **Badge**: `@/components/ui/badge`
- **Tabs**: `@/components/ui/tabs`
- **Select**: `@/components/ui/select`
- **Checkbox**: `@/components/ui/checkbox`
- **Switch**: `@/components/ui/switch`

### Icons (Lucide React)
```typescript
import { Link2, Copy, Trash2, MoreHorizontal, Check, X } from 'lucide-react'
```

## Best Practices

### ✅ Do's
- **Always** use shadcn/ui components for UI elements
- **Compose** complex interfaces from multiple shadcn components
- **Use** the `cn()` utility for conditional styling
- **Leverage** built-in variants (button variants, card styles, etc.)
- **Import** components from `@/components/ui/*`
- **Use** Lucide React icons for all iconography
- **Follow** the New York style conventions
- **Implement** proper loading states with Skeleton components
- **Provide** user feedback with Toast notifications

### ❌ Don'ts
- **Never** create custom button, input, or card components
- **Never** style HTML elements (like `<button>`, `<input>`) directly
- **Never** use other UI libraries alongside shadcn/ui
- **Never** create custom modal/dialog components
- **Never** bypass shadcn components "for simple use cases"
- **Avoid** inline styles—use Tailwind classes instead
- **Avoid** creating wrapper components that just pass props to shadcn components

## Troubleshooting

### Component Not Found
If a shadcn component doesn't exist:
```bash
npx shadcn@latest add [component-name]
```

### Styling Not Applied
- Ensure Tailwind CSS is properly configured
- Check that `globals.css` imports shadcn styles
- Verify `cn()` utility is used for conditional classes

### TypeScript Errors
- Ensure `tsx: true` in `components.json`
- Check component imports use correct paths
- Verify type definitions are installed

## Migration from Custom Components

If you encounter custom UI components in the codebase:
1. Identify the equivalent shadcn/ui component
2. Replace the custom component with the shadcn version
3. Migrate any custom logic (event handlers, state) to the new component
4. Update imports throughout the codebase
5. Remove the custom component file

---

**Remember**: When in doubt, check the [shadcn/ui documentation](https://ui.shadcn.com) for component examples and usage patterns. Every UI need has a shadcn solution.
