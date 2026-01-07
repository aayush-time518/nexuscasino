import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Hardcoded fallback promotions data
const FALLBACK_PROMOTIONS = [
    {
        id: '1',
        title: 'Welcome Bonus',
        description: '100% Match up to $1000',
        bonusAmount: '$1000',
        wagerRequirement: '15x',
        expiryDate: '2025-12-31',
        eligibility: 'New Players',
        category: 'welcome',
        image: 'https://images.unsplash.com/photo-1605902711622-cfb43c4437b5',
        isFeatured: true,
        terms: 'Terms apply.'
    },
    {
        id: '2',
        title: 'Reload Bonus',
        description: '50% Match up to $500',
        bonusAmount: '$500',
        wagerRequirement: '20x',
        expiryDate: '2025-12-31',
        eligibility: 'All Players',
        category: 'reload',
        image: 'https://images.unsplash.com/photo-1561450098-bea23aa64db5',
        isFeatured: false,
        terms: 'Terms apply.'
    },
    {
        id: '3',
        title: 'Free Spins',
        description: '100 Free Spins on Starburst',
        bonusAmount: '100 Spins',
        wagerRequirement: '30x',
        expiryDate: '2025-12-31',
        eligibility: 'New Players',
        category: 'freespins',
        image: 'https://images.unsplash.com/photo-1577495508048-b63587924f3d',
        isFeatured: true,
        terms: 'Terms apply.'
    },
];

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

        return NextResponse.json(mappedPromotions.length > 0 ? mappedPromotions : FALLBACK_PROMOTIONS);
    } catch (error) {
        console.error('Error fetching promotions:', error);
        // Return fallback data on error
        return NextResponse.json(FALLBACK_PROMOTIONS);
    }
}
