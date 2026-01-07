import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const games = await prisma.game.findMany({
            orderBy: {
                isHot: 'desc', // Default sort order
            },
        });

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
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
