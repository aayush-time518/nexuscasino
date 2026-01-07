import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create default user
    const user = await prisma.user.upsert({
        where: { email: 'player@nexusgaming.com' },
        update: {},
        create: {
            email: 'player@nexusgaming.com',
            fullName: 'John Doe',
            verified: true,
            verificationStatus: 'verified',
            balance: 1000.0,
            pendingWithdrawals: 0.0,
            activeBonus: 50.0
        },
    });

    console.log({ user });

    // Create games
    const games = [
        {
            title: 'Nexus Slots',
            provider: 'Nexus Gaming',
            imageUrl: 'https://images.pexels.com/photos/4553618/pexels-photo-4553618.jpeg',
            alt: 'Nexus Gaming exclusive slot machine',
            category: 'slots',
            isHot: true,
            hasDemo: true,
            isFavorite: false,
            // No playUrl or demoUrl means it opens internally
        },
        {
            title: 'Starburst',
            provider: 'NetEnt',
            imageUrl:
                'https://img.rocket.new/generatedImages/rocket_gen_img_1606ed4d1-1765251175676.png',
            alt: 'Colorful cosmic slot game with bright stars and gems on purple space background',
            category: 'slots',
            isHot: true,
            hasDemo: true,
            isFavorite: true,
            playUrl: 'https://games.netent.com/video-slots/starburst/',
            demoUrl: 'https://games.netent.com/video-slots/starburst/',
        },
        {
            title: 'Mega Fortune',
            provider: 'NetEnt',
            imageUrl:
                'https://img.rocket.new/generatedImages/rocket_gen_img_1828fb25d-1764674107002.png',
            alt: 'Luxury progressive jackpot slot with golden yacht and champagne on blue ocean background',
            category: 'jackpot',
            jackpotAmount: 2456789,
            hasDemo: false,
            playUrl: 'https://games.netent.com/video-slots/mega-fortune/',
        },
        {
            title: 'Live Blackjack',
            provider: 'Evolution Gaming',
            imageUrl:
                'https://img.rocket.new/generatedImages/rocket_gen_img_1de78c3b8-1764864557865.png',
            alt: 'Professional dealer in black vest dealing cards at green felt blackjack table',
            category: 'live',
            isHot: true,
            hasDemo: false,
            playUrl: 'https://www.evolution.com/our-games/live-blackjack/',
        },
        {
            title: 'Book of Dead',
            provider: "Play'n GO",
            imageUrl:
                'https://img.rocket.new/generatedImages/rocket_gen_img_10b2013a0-1764674114124.png',
            alt: 'Ancient Egyptian themed slot with golden pharaoh mask and hieroglyphics on dark background',
            category: 'slots',
            hasDemo: true,
            isFavorite: true,
            playUrl: 'https://www.playngo.com/games/book-of-dead',
            demoUrl: 'https://www.playngo.com/games/book-of-dead',
        },
        {
            title: "Gonzo's Quest",
            provider: 'NetEnt',
            imageUrl:
                'https://img.rocket.new/generatedImages/rocket_gen_img_153c5dfd3-1764657156330.png',
            alt: 'Adventure slot game featuring explorer character with ancient Aztec temple ruins',
            category: 'slots',
            isNew: true,
            hasDemo: true,
            playUrl: 'https://games.netent.com/video-slots/gonzos-quest/',
            demoUrl: 'https://games.netent.com/video-slots/gonzos-quest/',
        },
        {
            title: 'Roulette Live',
            provider: 'Evolution Gaming',
            imageUrl:
                'https://img.rocket.new/generatedImages/rocket_gen_img_1c024ddd3-1764721991900.png',
            alt: 'Live roulette wheel spinning with professional dealer in elegant casino studio',
            category: 'live',
            hasDemo: false,
            playUrl: 'https://www.evolution.com/our-games/live-roulette/',
        },
        {
            title: 'Divine Fortune',
            provider: 'NetEnt',
            imageUrl:
                'https://img.rocket.new/generatedImages/rocket_gen_img_10b2013a0-1764674114124.png',
            alt: 'Greek mythology themed progressive jackpot slot with golden Pegasus and ancient columns',
            category: 'jackpot',
            jackpotAmount: 1234567,
            hasDemo: true,
            playUrl: 'https://games.netent.com/video-slots/divine-fortune/',
            demoUrl: 'https://games.netent.com/video-slots/divine-fortune/',
        },
        {
            title: 'Baccarat Live',
            provider: 'Evolution Gaming',
            imageUrl:
                'https://img.rocket.new/generatedImages/rocket_gen_img_196a43df9-1765615885505.png',
            alt: 'Elegant baccarat table with professional dealer and luxury casino interior background',
            category: 'table',
            hasDemo: false,
            playUrl: 'https://www.evolution.com/our-games/live-baccarat/',
        },
        {
            title: 'Reactoonz',
            provider: "Play'n GO",
            imageUrl:
                'https://img.rocket.new/generatedImages/rocket_gen_img_183e42f03-1766067611213.png',
            alt: 'Colorful alien themed slot game with cute cartoon creatures on cosmic grid background',
            category: 'slots',
            isNew: true,
            hasDemo: true,
            playUrl: 'https://www.playngo.com/games/reactoonz',
            demoUrl: 'https://www.playngo.com/games/reactoonz',
        },
        {
            title: 'Mega Moolah',
            provider: 'Microgaming',
            imageUrl: 'https://images.unsplash.com/photo-1454627497732-c424266b7201',
            alt: 'Safari themed progressive jackpot slot with lion and African savanna landscape',
            category: 'jackpot',
            jackpotAmount: 987654,
            hasDemo: false,
            playUrl: 'https://www.microgaming.co.uk/games/mega-moolah',
        },
        {
            title: 'Immortal Romance',
            provider: 'Microgaming',
            imageUrl:
                'https://img.rocket.new/generatedImages/rocket_gen_img_19541e269-1765452489332.png',
            alt: 'Gothic vampire themed slot with mysterious characters on dark castle background',
            category: 'slots',
            isHot: true,
            hasDemo: true,
            playUrl: 'https://www.microgaming.co.uk/games/immortal-romance',
            demoUrl: 'https://www.microgaming.co.uk/games/immortal-romance',
        },
        {
            title: 'Lightning Roulette',
            provider: 'Evolution Gaming',
            imageUrl:
                'https://img.rocket.new/generatedImages/rocket_gen_img_1c5620a0a-1765300253846.png',
            alt: 'Electric roulette wheel with lightning effects and modern studio lighting',
            category: 'live',
            isNew: true,
            hasDemo: false,
            playUrl: 'https://www.evolution.com/our-games/lightning-roulette/',
        },
    ];

    for (const game of games) {
        await prisma.game.create({
            data: game,
        });
    }

    // Create Payment Methods
    const paymentMethods = [
        {
            userId: user.id,
            type: 'card',
            name: 'Visa ending in 4242',
            last4: '4242',
            expiryDate: '12/25',
            isVerified: true,
            isDefault: true,
            brand: 'Visa',
        },
        {
            userId: user.id,
            type: 'card',
            name: 'Mastercard ending in 8888',
            last4: '8888',
            expiryDate: '06/26',
            isVerified: true,
            isDefault: false,
            brand: 'Mastercard',
        },
    ];

    for (const pm of paymentMethods) {
        await prisma.paymentMethod.create({ data: pm });
    }

    // Create Transactions
    const transactions = [
        {
            userId: user.id,
            type: 'deposit',
            amount: 250.0,
            status: 'completed',
            paymentMethod: 'Visa •••• 4242',
            description: 'Deposit via Visa',
        },
        {
            userId: user.id,
            type: 'withdrawal',
            amount: 500.0,
            status: 'processing',
            paymentMethod: 'Chase Bank',
            description: 'Withdrawal to Bank',
        },
        {
            userId: user.id,
            type: 'deposit',
            amount: 100.0,
            status: 'pending',
            paymentMethod: 'PayPal',
            description: 'Deposit via PayPal',
        },
    ];

    for (const t of transactions) {
        await prisma.transaction.create({ data: t });
    }

    // Create Promotions
    const promotions = [
        {
            title: 'Welcome Bonus',
            description: '100% Match up to $1000',
            bonusAmount: '$1000',
            wagerRequirement: '15x',
            expiryDate: '2025-12-31',
            eligibility: 'New Players',
            category: 'welcome',
            imageUrl: 'https://images.unsplash.com/photo-1605902711622-cfb43c4437b5',
            isFeatured: true,
            terms: 'Terms apply.',
        }
    ];

    for (const p of promotions) {
        await prisma.promotion.create({ data: p });
    }

    // Create Loyalty Points
    await prisma.loyaltyPoint.upsert({
        where: { userId: user.id },
        update: {},
        create: {
            userId: user.id,
            points: 1250,
            tier: 'Silver',
            tierLevel: 2,
        },
    });

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
