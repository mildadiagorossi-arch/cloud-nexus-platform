import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const nike = await prisma.vendor.upsert({
        where: { storeSlug: 'nike-official' },
        update: {},
        create: {
            name: 'Nike Official',
            storeSlug: 'nike-official',
            themeJson: JSON.stringify({
                primaryColor: '#111111',
                bannerUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070'
            })
        },
    });

    console.log({ nike });
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
