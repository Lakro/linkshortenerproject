import { db } from '@/db'
import { links } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import type { Link } from '@/db/schema'

export async function getUserLinks(userId: string): Promise<Link[]> {
  return db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.createdAt))
}
