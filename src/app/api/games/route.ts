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

        // If no games found, return empty array (frontend will handle empty state)
        if (!games || games.length === 0) {
            console.warn('No games found in database');
            return NextResponse.json([]);
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
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error ? error.stack : undefined;
        console.error('Error details:', { errorMessage, errorStack });
        
        // Return empty array instead of error for better UX
        // Frontend can handle empty state gracefully
        return NextResponse.json([]);
    }
}
