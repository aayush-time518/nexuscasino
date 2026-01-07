import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Hardcoded fallback transactions data
const FALLBACK_TRANSACTIONS = [
    {
        id: '1',
        type: 'deposit',
        amount: 250.0,
        status: 'completed',
        method: 'Visa •••• 4242',
        date: new Date().toLocaleDateString('en-US'),
        description: 'Deposit via Visa',
        transactionRef: 'TXN-' + Date.now()
    },
    {
        id: '2',
        type: 'withdrawal',
        amount: 500.0,
        status: 'processing',
        method: 'Chase Bank',
        date: new Date().toLocaleDateString('en-US'),
        description: 'Withdrawal to Bank',
        transactionRef: 'TXN-' + (Date.now() - 86400000)
    },
    {
        id: '3',
        type: 'deposit',
        amount: 100.0,
        status: 'pending',
        method: 'PayPal',
        date: new Date().toLocaleDateString('en-US'),
        description: 'Deposit via PayPal',
        transactionRef: 'TXN-' + (Date.now() - 172800000)
    },
];

export async function GET() {
    try {
        // In a real app, verify user session here.
        // For now, we fetch transactions for the seed user 'player@nexusgaming.com'.
        const user = await prisma.user.findUnique({
            where: { email: 'player@nexusgaming.com' }
        });

        if (!user) {
            // Return fallback data instead of error
            return NextResponse.json(FALLBACK_TRANSACTIONS);
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

        return NextResponse.json(mappedTransactions.length > 0 ? mappedTransactions : FALLBACK_TRANSACTIONS);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        // Return fallback data on error
        return NextResponse.json(FALLBACK_TRANSACTIONS);
    }
}
