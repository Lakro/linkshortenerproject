import 'dotenv/config'
import { db } from '../db'
import { links } from '../db/schema'
import { nanoid } from 'nanoid'

async function seedExampleLinks() {
  const userId = 'user_39muGGbHjuaOt6ll2so3UuE2c8y'
  
  const exampleLinks = [
    { url: 'https://github.com/facebook/react', shortCode: 'react-gh' },
    { url: 'https://nextjs.org/docs', shortCode: 'next-docs' },
    { url: 'https://tailwindcss.com/docs/installation', shortCode: 'tw-install' },
    { url: 'https://www.typescriptlang.org/docs/', shortCode: 'ts-docs' },
    { url: 'https://drizzle.team/docs/overview', shortCode: 'drizzle-ov' },
    { url: 'https://ui.shadcn.com/docs', shortCode: 'shadcn-ui' },
    { url: 'https://clerk.com/docs/quickstarts/nextjs', shortCode: 'clerk-next' },
    { url: 'https://vercel.com/docs', shortCode: 'vercel-doc' },
    { url: 'https://neon.tech/docs/introduction', shortCode: 'neon-intro' },
    { url: 'https://lucide.dev/icons/', shortCode: 'lucide-ico' },
  ]

  console.log('🌱 Starting to seed example links...')

  try {
    for (const link of exampleLinks) {
      await db.insert(links).values({
        id: nanoid(),
        userId,
        url: link.url,
        shortCode: link.shortCode,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      console.log(`✅ Inserted: ${link.shortCode} -> ${link.url}`)
    }

    console.log('\n🎉 Successfully inserted 10 example links!')
  } catch (error) {
    console.error('❌ Error seeding links:', error)
    throw error
  }
}

seedExampleLinks()
  .then(() => {
    console.log('✅ Seed completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  })
