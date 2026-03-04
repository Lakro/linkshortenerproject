import { db } from '@/db'
import { links } from '@/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import type { Link, NewLink } from '@/db/schema'
import { nanoid } from 'nanoid'

export async function getUserLinks(userId: string): Promise<Link[]> {
  return db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.createdAt))
}

export async function insertLink(data: Omit<NewLink, 'id'>): Promise<Link> {
  const [link] = await db
    .insert(links)
    .values({ ...data, id: nanoid() })
    .returning()
  return link
}

export async function deleteLinkById(id: string, userId: string): Promise<void> {
  await db
    .delete(links)
    .where(and(eq(links.id, id), eq(links.userId, userId)))
}

export async function updateLinkById(
  id: string,
  userId: string,
  data: { url: string; shortCode: string }
): Promise<Link> {
  const [link] = await db
    .update(links)
    .set({ url: data.url, shortCode: data.shortCode, updatedAt: new Date() })
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning()
  return link
}

export async function getLinkByShortCode(shortCode: string): Promise<Link | null> {
  const [link] = await db
    .select()
    .from(links)
    .where(eq(links.shortCode, shortCode))
    .limit(1)
  return link ?? null
}
