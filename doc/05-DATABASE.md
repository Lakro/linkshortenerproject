# Database Guidelines - Drizzle ORM & Neon

## Database Stack
- **Drizzle ORM v0.45.1** - Type-safe SQL ORM
- **Neon Database** - Serverless Postgres
- **drizzle-kit** - Migrations and introspection

## Database Configuration

### Connection Setup
```typescript
// db/index.ts
import { drizzle } from 'drizzle-orm/neon-serverless'
import { Pool } from '@neondatabase/serverless'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const db = drizzle(pool)
```

### Drizzle Config
```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

## Schema Definition

### Table Schemas
Define all schemas in `db/schema.ts`:

```typescript
import { pgTable, text, timestamp, integer, boolean, uuid } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ✅ Good - Complete schema definition
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const links = pgTable('links', {
  id: uuid('id').defaultRandom().primaryKey(),
  shortCode: text('short_code').notNull().unique(),
  originalUrl: text('original_url').notNull(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title'),
  description: text('description'),
  clicks: integer('clicks').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const clicks = pgTable('clicks', {
  id: uuid('id').defaultRandom().primaryKey(),
  linkId: uuid('link_id').notNull().references(() => links.id, { onDelete: 'cascade' }),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  country: text('country'),
  city: text('city'),
  clickedAt: timestamp('clicked_at').defaultNow().notNull(),
})
```

### Relations
Define relations for better type inference:

```typescript
export const usersRelations = relations(users, ({ many }) => ({
  links: many(links),
}))

export const linksRelations = relations(links, ({ one, many }) => ({
  user: one(users, {
    fields: [links.userId],
    references: [users.id],
  }),
  clicks: many(clicks),
}))

export const clicksRelations = relations(clicks, ({ one }) => ({
  link: one(links, {
    fields: [clicks.linkId],
    references: [links.id],
  }),
}))
```

## Data Types

### Column Types
```typescript
// Text fields
text('column_name')                    // VARCHAR
text('column_name', { length: 255 })  // VARCHAR(255)

// Numeric fields
integer('column_name')                 // INTEGER
bigint('column_name', { mode: 'number' }) // BIGINT
serial('column_name')                  // SERIAL

// UUID
uuid('column_name')                    // UUID
uuid('id').defaultRandom()             // UUID with default random

// Boolean
boolean('column_name')                 // BOOLEAN

// Timestamps
timestamp('column_name')               // TIMESTAMP
timestamp('created_at').defaultNow()   // With default now()

// JSON
json('column_name')                    // JSON
jsonb('column_name')                   // JSONB (preferred)
```

### Constraints
```typescript
// Primary key
.primaryKey()

// Not null
.notNull()

// Unique
.unique()

// Default values
.default(value)
.defaultNow()
.defaultRandom()

// Foreign keys
.references(() => otherTable.id, { onDelete: 'cascade' })
.references(() => otherTable.id, { onDelete: 'set null' })
.references(() => otherTable.id, { onDelete: 'restrict' })
```

## Queries

### Select Queries
```typescript
import { db } from '@/db'
import { links, users } from '@/db/schema'
import { eq, desc, and, or, like, gte, lte } from 'drizzle-orm'

// ✅ Good - Basic select
const allLinks = await db.select().from(links)

// Select specific columns
const linkPreviews = await db
  .select({
    shortCode: links.shortCode,
    originalUrl: links.originalUrl,
    clicks: links.clicks,
  })
  .from(links)

// With where clause
const userLinks = await db
  .select()
  .from(links)
  .where(eq(links.userId, userId))

// Multiple conditions
const activeLinks = await db
  .select()
  .from(links)
  .where(
    and(
      eq(links.userId, userId),
      eq(links.isActive, true)
    )
  )

// OR conditions
const searchLinks = await db
  .select()
  .from(links)
  .where(
    or(
      like(links.title, `%${query}%`),
      like(links.originalUrl, `%${query}%`)
    )
  )

// Ordering
const sortedLinks = await db
  .select()
  .from(links)
  .orderBy(desc(links.createdAt))

// Limit and offset
const paginatedLinks = await db
  .select()
  .from(links)
  .limit(10)
  .offset(20)
```

### Relational Queries
Use Drizzle's relational query API for better DX:

```typescript
// ✅ Good - Relational query with joins
const linksWithUser = await db.query.links.findMany({
  where: eq(links.isActive, true),
  with: {
    user: true,
    clicks: {
      orderBy: desc(clicks.clickedAt),
      limit: 10,
    },
  },
  orderBy: desc(links.createdAt),
})

// Find one
const link = await db.query.links.findFirst({
  where: eq(links.shortCode, shortCode),
  with: {
    user: {
      columns: {
        id: true,
        name: true,
        email: true,
      },
    },
  },
})
```

### Insert Queries
```typescript
// ✅ Good - Single insert
const [newLink] = await db
  .insert(links)
  .values({
    shortCode: 'abc123',
    originalUrl: 'https://example.com',
    userId: 'user_123',
  })
  .returning()

// Multiple inserts
const newLinks = await db
  .insert(links)
  .values([
    { shortCode: 'abc1', originalUrl: 'https://example.com/1', userId },
    { shortCode: 'abc2', originalUrl: 'https://example.com/2', userId },
  ])
  .returning()

// With conflict handling (upsert)
const link = await db
  .insert(links)
  .values({
    shortCode: 'abc123',
    originalUrl: 'https://example.com',
    userId,
  })
  .onConflictDoUpdate({
    target: links.shortCode,
    set: {
      originalUrl: 'https://updated-example.com',
      updatedAt: new Date(),
    },
  })
  .returning()
```

### Update Queries
```typescript
// ✅ Good - Update with where clause
await db
  .update(links)
  .set({
    clicks: links.clicks + 1,
    updatedAt: new Date(),
  })
  .where(eq(links.id, linkId))

// Update multiple fields
await db
  .update(links)
  .set({
    title: 'New Title',
    description: 'New Description',
    updatedAt: new Date(),
  })
  .where(eq(links.id, linkId))

// Update with returning
const [updatedLink] = await db
  .update(links)
  .set({ isActive: false })
  .where(eq(links.id, linkId))
  .returning()
```

### Delete Queries
```typescript
// ✅ Good - Delete with where clause
await db
  .delete(links)
  .where(eq(links.id, linkId))

// Delete with returning
const [deletedLink] = await db
  .delete(links)
  .where(eq(links.id, linkId))
  .returning()

// Soft delete (preferred)
await db
  .update(links)
  .set({ isActive: false, updatedAt: new Date() })
  .where(eq(links.id, linkId))
```

### Aggregations
```typescript
import { sql, count, sum, avg } from 'drizzle-orm'

// Count
const linkCount = await db
  .select({ count: count() })
  .from(links)
  .where(eq(links.userId, userId))

// Sum
const totalClicks = await db
  .select({ total: sum(links.clicks) })
  .from(links)
  .where(eq(links.userId, userId))

// Group by
const clicksByLink = await db
  .select({
    linkId: clicks.linkId,
    count: count(),
  })
  .from(clicks)
  .groupBy(clicks.linkId)
```

## Migrations

### Creating Migrations
```bash
# Generate migration from schema changes
npm run drizzle-kit generate

# Apply migrations
npm run drizzle-kit migrate

# Push schema changes directly (development only)
npm run drizzle-kit push
```

### Migration Files
```typescript
// drizzle/0001_initial.sql
CREATE TABLE "users" (
  "id" text PRIMARY KEY NOT NULL,
  "email" text NOT NULL UNIQUE,
  "name" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "links" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "short_code" text NOT NULL UNIQUE,
  "original_url" text NOT NULL,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "clicks" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
```

## Best Practices

### Type Safety
```typescript
// ✅ Good - TypeScript inference works
const link = await db.query.links.findFirst({
  where: eq(links.id, linkId)
})
// link is typed as Link | undefined

// ✅ Good - Using InferModel
import { InferModel } from 'drizzle-orm'

type Link = InferModel<typeof links>
type NewLink = InferModel<typeof links, 'insert'>

function createLink(data: NewLink): Promise<Link> {
  return db.insert(links).values(data).returning()
}
```

### Error Handling
```typescript
// ✅ Good - Handle database errors
try {
  await db.insert(links).values({ shortCode, originalUrl, userId })
} catch (error) {
  if (error.code === '23505') { // Unique violation
    throw new Error('Short code already exists')
  }
  throw error
}
```

### Transactions
```typescript
// ✅ Good - Use transactions for related operations
import { db } from '@/db'

await db.transaction(async (tx) => {
  const [link] = await tx
    .insert(links)
    .values({ shortCode, originalUrl, userId })
    .returning()
  
  await tx.insert(clicks).values({
    linkId: link.id,
    ipAddress,
    userAgent,
  })
})
```

### Prepared Statements
```typescript
// ✅ Good - For repeated queries
const getLinkByCode = db
  .select()
  .from(links)
  .where(eq(links.shortCode, sql.placeholder('code')))
  .prepare('get_link_by_code')

const link = await getLinkByCode.execute({ code: 'abc123' })
```

### Performance
```typescript
// ✅ Good - Select only needed columns
const linkCodes = await db
  .select({ shortCode: links.shortCode })
  .from(links)

// ✅ Good - Use indexes (define in schema)
export const links = pgTable('links', {
  // columns...
}, (table) => ({
  shortCodeIdx: index('short_code_idx').on(table.shortCode),
  userIdIdx: index('user_id_idx').on(table.userId),
}))

// ✅ Good - Batch operations
await db.insert(links).values(arrayOfLinks) // Better than individual inserts
```

## Do's and Don'ts

### Do's
- ✅ Define all schemas in `db/schema.ts`
- ✅ Use TypeScript types inferred from schema
- ✅ Use relations for complex queries
- ✅ Use transactions for related operations
- ✅ Add proper indexes for query performance
- ✅ Use `.returning()` to get inserted/updated data
- ✅ Handle unique constraint violations
- ✅ Use prepared statements for repeated queries

### Don'ts
- ❌ Don't use raw SQL unless absolutely necessary
- ❌ Don't forget to add `onDelete: 'cascade'` for foreign keys
- ❌ Don't select all columns when you only need a few
- ❌ Don't forget to add timestamps (createdAt, updatedAt)
- ❌ Don't expose database errors directly to users
- ❌ Don't forget to validate data before inserting
- ❌ Don't use `any` type for database queries
