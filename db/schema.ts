import { pgTable, text, timestamp, index, varchar } from 'drizzle-orm/pg-core'

export const links = pgTable(
  'links',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(), // Clerk user ID
    url: text('url').notNull(),
    shortCode: varchar('short_code', { length: 20 }).notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
    shortCodeIdx: index('short_code_idx').on(table.shortCode),
  })
)

// Inferred types for TypeScript
export type Link = typeof links.$inferSelect // For SELECT queries
export type NewLink = typeof links.$inferInsert // For INSERT operations
