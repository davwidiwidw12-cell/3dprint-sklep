import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Categories (Removed in new schema)
  // const categories = [
  //   { name: 'Wizytówki NFC', slug: 'wizytowki-nfc' },
  //   { name: 'Breloki 3D', slug: 'breloki-3d' },
  //   { name: 'Serca 3D – Prezenty', slug: 'serca-3d-prezenty' },
  //   { name: 'Produkty 3D', slug: 'produkty-3d' },
  // ]

  // for (const cat of categories) {
  //   await prisma.category.upsert({
  //     where: { slug: cat.slug },
  //     update: {},
  //     create: cat,
  //   })
  // }

  // Example Products
  // const heartCat = await prisma.category.findUnique({ where: { slug: 'serca-3d-prezenty' } })
  // const keychainCat = await prisma.category.findUnique({ where: { slug: 'breloki-3d' } })
  // const nfcCat = await prisma.category.findUnique({ where: { slug: 'wizytowki-nfc' } })

  // if (heartCat) {
    await prisma.product.upsert({
      where: { slug: 'duze-serce-kocham-cie' },
      update: {},
      create: {
        name: 'Duże Serce "Kocham Cię"',
        slug: 'duze-serce-kocham-cie',
        description: 'Wolnostojące, eleganckie serce 3D. Idealne na prezent.',
        basePrice: 40.00,
        hasMount: false,
        isLarge: true,
        // categoryId: heartCat.id,
        isActive: true,
      }
    })
  // }

  // if (keychainCat) {
    await prisma.product.upsert({
      where: { slug: 'brelok-serce' },
      update: {},
      create: {
        name: 'Brelok Serce',
        slug: 'brelok-serce',
        description: 'Mały brelok w kształcie serca z mocowaniem.',
        basePrice: 5.00,
        hasMount: true,
        isLarge: false,
        // categoryId: keychainCat.id,
        isActive: true,
        pricing: {
          create: [
            { minQuantity: 10, price: 4.50 },
            { minQuantity: 50, price: 4.00 },
          ]
        }
      }
    })
  // }
  
  // if (nfcCat) {
     await prisma.product.upsert({
      where: { slug: 'wizytowka-nfc-standard' },
      update: {},
      create: {
        name: 'Wizytówka NFC Standard',
        slug: 'wizytowka-nfc-standard',
        description: 'Nowoczesna wizytówka z chipem NFC.',
        basePrice: 8.00,
        hasMount: false,
        isLarge: false,
        // categoryId: nfcCat.id,
        isActive: true,
      }
    })
  // }

  console.log('Seed completed.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
