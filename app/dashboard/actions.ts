'use server'

import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { insertLink, deleteLinkById, updateLinkById } from '@/data/links'

const createLinkSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL' }),
  shortCode: z
    .string()
    .min(3, { message: 'Custom alias must be at least 3 characters' })
    .max(20, { message: 'Custom alias must be at most 20 characters' })
    .regex(/^[a-zA-Z0-9-_]+$/, {
      message: 'Custom alias may only contain letters, numbers, hyphens and underscores',
    })
    .optional()
    .or(z.literal('')),
})

export type CreateLinkInput = z.infer<typeof createLinkSchema>

export async function createLink(input: CreateLinkInput) {
  const { userId } = await auth()
  if (!userId) return { error: 'Unauthorized' }

  const parsed = createLinkSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }

  const shortCode =
    parsed.data.shortCode && parsed.data.shortCode.length > 0
      ? parsed.data.shortCode
      : nanoid(7)

  try {
    const link = await insertLink({ url: parsed.data.url, shortCode, userId })
    return { success: true, link }
  } catch (err) {
    const message = err instanceof Error ? err.message : ''
    if (message.includes('unique') || message.includes('duplicate')) {
      return { error: 'That custom alias is already taken. Please choose another.' }
    }
    return { error: 'Something went wrong. Please try again.' }
  }
}

const deleteLinkSchema = z.object({
  id: z.string().min(1),
})

export type DeleteLinkInput = z.infer<typeof deleteLinkSchema>

export async function deleteLink(input: DeleteLinkInput) {
  const { userId } = await auth()
  if (!userId) return { error: 'Unauthorized' }

  const parsed = deleteLinkSchema.safeParse(input)
  if (!parsed.success) return { error: 'Invalid input' }

  try {
    await deleteLinkById(parsed.data.id, userId)
    return { success: true }
  } catch {
    return { error: 'Something went wrong. Please try again.' }
  }
}

const updateLinkSchema = z.object({
  id: z.string().min(1),
  url: z.string().url({ message: 'Please enter a valid URL' }),
  shortCode: z
    .string()
    .min(3, { message: 'Custom alias must be at least 3 characters' })
    .max(20, { message: 'Custom alias must be at most 20 characters' })
    .regex(/^[a-zA-Z0-9-_]+$/, {
      message: 'Custom alias may only contain letters, numbers, hyphens and underscores',
    }),
})

export type UpdateLinkInput = z.infer<typeof updateLinkSchema>

export async function updateLink(input: UpdateLinkInput) {
  const { userId } = await auth()
  if (!userId) return { error: 'Unauthorized' }

  const parsed = updateLinkSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }

  try {
    const link = await updateLinkById(parsed.data.id, userId, {
      url: parsed.data.url,
      shortCode: parsed.data.shortCode,
    })
    return { success: true, link }
  } catch (err) {
    const message = err instanceof Error ? err.message : ''
    if (message.includes('unique') || message.includes('duplicate')) {
      return { error: 'That custom alias is already taken. Please choose another.' }
    }
    return { error: 'Something went wrong. Please try again.' }
  }
}
