import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'player@nexusgaming.com' }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const loyalty = await prisma.loyaltyPoint.findUnique({
            where: { userId: user.id },
        });

        if (!loyalty) {
            // Return default if not found
            return NextResponse.json({
                points: 0,
                tier: 'Bronze',
                tierLevel: 1
            });
        }

        return NextResponse.json(loyalty);
    } catch (error) {
        console.error('Error fetching loyalty points:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
