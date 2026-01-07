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

        const paymentMethods = await prisma.paymentMethod.findMany({
            where: { userId: user.id },
            orderBy: { isDefault: 'desc' },
        });

        return NextResponse.json(paymentMethods);
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
