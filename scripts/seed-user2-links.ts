import 'dotenv/config'
import { db } from '../db'
import { links } from '../db/schema'
import { nanoid } from 'nanoid'

async function seedUser2Links() {
  const userId = 'user_3AHzWG3JgOQlthXTL4mDPSHHsUa'
  
  const exampleLinks = [
    { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', shortCode: 'youtube-v' },
    { url: 'https://stackoverflow.com/questions/tagged/typescript', shortCode: 'so-ts' },
    { url: 'https://medium.com/@example/web-development-trends', shortCode: 'medium-wd' },
    { url: 'https://dev.to/t/javascript', shortCode: 'devto-js' },
    { url: 'https://www.npmjs.com/package/react', shortCode: 'npm-react' },
    { url: 'https://fonts.google.com/', shortCode: 'g-fonts' },
    { url: 'https://colorhunt.co/', shortCode: 'colors-hq' },
    { url: 'https://www.figma.com/community', shortCode: 'figma-com' },
    { url: 'https://roadmap.sh/frontend', shortCode: 'roadmap-fe' },
    { url: 'https://caniuse.com/', shortCode: 'caniuse' },
  ]

  console.log('🌱 Starting to seed links for user 2...')

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

    console.log('\n🎉 Successfully inserted 10 example links for user 2!')
  } catch (error) {
    console.error('❌ Error seeding links:', error)
    throw error
  }
}

seedUser2Links()
  .then(() => {
    console.log('✅ Seed completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  })
