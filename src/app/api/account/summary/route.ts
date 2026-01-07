import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // In a real app, get user ID from session
        const email = 'player@nexusgaming.com';

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                balance: true,
                pendingWithdrawals: true,
                activeBonus: true
            }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching account summary:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
