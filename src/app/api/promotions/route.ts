import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const promotions = await prisma.promotion.findMany({
            orderBy: { createdAt: 'desc' },
        });

        // Map to frontend interface if needed
        const mappedPromotions = promotions.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            bonusAmount: p.bonusAmount,
            wagerRequirement: p.wagerRequirement,
            expiryDate: p.expiryDate,
            eligibility: p.eligibility,
            category: p.category,
            image: p.imageUrl, // Map imageUrl to image
            isFeatured: p.isFeatured,
            terms: p.terms
        }));

        return NextResponse.json(mappedPromotions);
    } catch (error) {
        console.error('Error fetching promotions:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
