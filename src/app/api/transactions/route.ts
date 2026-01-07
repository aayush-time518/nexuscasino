import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // In a real app, verify user session here.
        // For now, we fetch transactions for the seed user 'player@nexusgaming.com'.
        const user = await prisma.user.findUnique({
            where: { email: 'player@nexusgaming.com' }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const transactions = await prisma.transaction.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        });

        // Map to frontend interface
        const mappedTransactions = transactions.map(t => ({
            id: t.id,
            type: t.type,
            amount: t.amount,
            status: t.status,
            method: t.paymentMethod,
            date: t.createdAt.toLocaleDateString('en-US'),
            // Add other fields as needed by frontend
            description: t.description,
            transactionRef: t.transactionRef
        }));

        return NextResponse.json(mappedTransactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
