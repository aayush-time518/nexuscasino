import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Hardcoded fallback games data
const FALLBACK_GAMES = [
    {
        id: 1,
        title: 'Nexus Slots',
        provider: 'Nexus Gaming',
        imageUrl: 'https://images.pexels.com/photos/4553618/pexels-photo-4553618.jpeg',
        alt: 'Nexus Gaming exclusive slot machine',
        category: 'slots',
        isHot: true,
        hasDemo: true,
        isFavorite: false,
        isNew: false,
        jackpotAmount: null,
        playUrl: null,
        demoUrl: null,
    },
    {
        id: 2,
        title: 'Starburst',
        provider: 'NetEnt',
        imageUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_1606ed4d1-1765251175676.png',
        alt: 'Colorful cosmic slot game with bright stars and gems on purple space background',
        category: 'slots',
        isHot: true,
        hasDemo: true,
        isFavorite: true,
        isNew: false,
        jackpotAmount: null,
        playUrl: 'https://games.netent.com/video-slots/starburst/',
        demoUrl: 'https://games.netent.com/video-slots/starburst/',
    },
    {
        id: 3,
        title: 'Mega Fortune',
        provider: 'NetEnt',
        imageUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_1828fb25d-1764674107002.png',
        alt: 'Luxury progressive jackpot slot with golden yacht and champagne on blue ocean background',
        category: 'jackpot',
        isHot: false,
        hasDemo: false,
        isFavorite: false,
        isNew: false,
        jackpotAmount: 2456789,
        playUrl: 'https://games.netent.com/video-slots/mega-fortune/',
        demoUrl: null,
    },
    {
        id: 4,
        title: 'Live Blackjack',
        provider: 'Evolution Gaming',
        imageUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_1de78c3b8-1764864557865.png',
        alt: 'Professional dealer in black vest dealing cards at green felt blackjack table',
        category: 'live',
        isHot: true,
        hasDemo: false,
        isFavorite: false,
        isNew: false,
        jackpotAmount: null,
        playUrl: 'https://www.evolution.com/our-games/live-blackjack/',
        demoUrl: null,
    },
    {
        id: 5,
        title: 'Book of Dead',
        provider: "Play'n GO",
        imageUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_10b2013a0-1764674114124.png',
        alt: 'Ancient Egyptian themed slot with golden pharaoh mask and hieroglyphics on dark background',
        category: 'slots',
        isHot: false,
        hasDemo: true,
        isFavorite: true,
        isNew: false,
        jackpotAmount: null,
        playUrl: 'https://www.playngo.com/games/book-of-dead',
        demoUrl: 'https://www.playngo.com/games/book-of-dead',
    },
    {
        id: 6,
        title: "Gonzo's Quest",
        provider: 'NetEnt',
        imageUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_153c5dfd3-1764657156330.png',
        alt: 'Adventure slot game featuring explorer character with ancient Aztec temple ruins',
        category: 'slots',
        isHot: false,
        hasDemo: true,
        isFavorite: false,
        isNew: true,
        jackpotAmount: null,
        playUrl: 'https://games.netent.com/video-slots/gonzos-quest/',
        demoUrl: 'https://games.netent.com/video-slots/gonzos-quest/',
    },
    {
        id: 7,
        title: 'Roulette Live',
        provider: 'Evolution Gaming',
        imageUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_1c024ddd3-1764721991900.png',
        alt: 'Live roulette wheel spinning with professional dealer in elegant casino studio',
        category: 'live',
        isHot: false,
        hasDemo: false,
        isFavorite: false,
        isNew: false,
        jackpotAmount: null,
        playUrl: 'https://www.evolution.com/our-games/live-roulette/',
        demoUrl: null,
    },
    {
        id: 8,
        title: 'Divine Fortune',
        provider: 'NetEnt',
        imageUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_10b2013a0-1764674114124.png',
        alt: 'Greek mythology themed progressive jackpot slot with golden Pegasus and ancient columns',
        category: 'jackpot',
        isHot: false,
        hasDemo: true,
        isFavorite: false,
        isNew: false,
        jackpotAmount: 1234567,
        playUrl: 'https://games.netent.com/video-slots/divine-fortune/',
        demoUrl: 'https://games.netent.com/video-slots/divine-fortune/',
    },
    {
        id: 9,
        title: 'Baccarat Live',
        provider: 'Evolution Gaming',
        imageUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_196a43df9-1765615885505.png',
        alt: 'Elegant baccarat table with professional dealer and luxury casino interior background',
        category: 'table',
        isHot: false,
        hasDemo: false,
        isFavorite: false,
        isNew: false,
        jackpotAmount: null,
        playUrl: 'https://www.evolution.com/our-games/live-baccarat/',
        demoUrl: null,
    },
    {
        id: 10,
        title: 'Reactoonz',
        provider: "Play'n GO",
        imageUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_183e42f03-1766067611213.png',
        alt: 'Colorful alien themed slot game with cute cartoon creatures on cosmic grid background',
        category: 'slots',
        isHot: false,
        hasDemo: true,
        isFavorite: false,
        isNew: true,
        jackpotAmount: null,
        playUrl: 'https://www.playngo.com/games/reactoonz',
        demoUrl: 'https://www.playngo.com/games/reactoonz',
    },
    {
        id: 11,
        title: 'Mega Moolah',
        provider: 'Microgaming',
        imageUrl: 'https://images.unsplash.com/photo-1454627497732-c424266b7201',
        alt: 'Safari themed progressive jackpot slot with lion and African savanna landscape',
        category: 'jackpot',
        isHot: false,
        hasDemo: false,
        isFavorite: false,
        isNew: false,
        jackpotAmount: 987654,
        playUrl: 'https://www.microgaming.co.uk/games/mega-moolah',
        demoUrl: null,
    },
    {
        id: 12,
        title: 'Immortal Romance',
        provider: 'Microgaming',
        imageUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_19541e269-1765452489332.png',
        alt: 'Gothic vampire themed slot with mysterious characters on dark castle background',
        category: 'slots',
        isHot: true,
        hasDemo: true,
        isFavorite: false,
        isNew: false,
        jackpotAmount: null,
        playUrl: 'https://www.microgaming.co.uk/games/immortal-romance',
        demoUrl: 'https://www.microgaming.co.uk/games/immortal-romance',
    },
    {
        id: 13,
        title: 'Lightning Roulette',
        provider: 'Evolution Gaming',
        imageUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_1c5620a0a-1765300253846.png',
        alt: 'Electric roulette wheel with lightning effects and modern studio lighting',
        category: 'live',
        isHot: false,
        hasDemo: false,
        isFavorite: false,
        isNew: true,
        jackpotAmount: null,
        playUrl: 'https://www.evolution.com/our-games/lightning-roulette/',
        demoUrl: null,
    },
];

export async function GET() {
    try {
        const games = await prisma.game.findMany({
            orderBy: {
                isHot: 'desc', // Default sort order
            },
        });

        // If no games found, return hardcoded fallback
        if (!games || games.length === 0) {
            console.warn('No games found in database, using fallback data');
            const mappedFallback = FALLBACK_GAMES.map(game => ({
                ...game,
                image: game.imageUrl,
            }));
            return NextResponse.json(mappedFallback);
        }

        // Transform data to match frontend expectations if necessary
        // But we aligned the schema to match the frontend, so it should be close.
        // Note: The frontend expects 'image' but our schema has 'imageUrl'.
        // We should map it.
        const mappedGames = games.map(game => ({
            ...game,
            image: game.imageUrl,
        }));

        return NextResponse.json(mappedGames);
    } catch (error) {
        console.error('Error fetching games:', error);
        // Return hardcoded fallback data on error
        const mappedFallback = FALLBACK_GAMES.map(game => ({
            ...game,
            image: game.imageUrl,
        }));
        return NextResponse.json(mappedFallback);
    }
}
