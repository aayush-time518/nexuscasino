import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Hardcoded demo account credentials
const DEMO_ACCOUNT = {
    email: 'player@nexusgaming.com',
    password: 'Casino123',
    user: {
        id: 'demo-user-id',
        email: 'player@nexusgaming.com',
        full_name: 'John Doe',
        verified: true,
    }
};

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Check demo account first (works even if Prisma fails)
        if (email === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password) {
            return NextResponse.json({
                access_token: 'mock_access_token_' + Date.now(),
                user: DEMO_ACCOUNT.user,
            });
        }

        // Try to find user in database
        try {
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                return NextResponse.json(
                    { message: 'Invalid credentials' },
                    { status: 401 }
                );
            }

            // In a real app, you would hash and compare passwords.
            // For this migration, we are keeping the simple check from the original code
            // but verifying the user exists in the DB.
            if (password !== 'Casino123') {
                return NextResponse.json(
                    { message: 'Invalid credentials' },
                    { status: 401 }
                );
            }

            // Return success response with user data
            // In a real app, you would generate a JWT token here
            return NextResponse.json({
                access_token: 'mock_access_token_' + Date.now(),
                user: {
                    id: user.id,
                    email: user.email,
                    full_name: user.fullName,
                    verified: user.verified,
                },
            });
        } catch (dbError) {
            // If database fails, still allow demo account login
            console.error('Database error during login:', dbError);
            
            // Only allow demo account if database fails
            if (email === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password) {
                return NextResponse.json({
                    access_token: 'mock_access_token_' + Date.now(),
                    user: DEMO_ACCOUNT.user,
                });
            }
            
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Login error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        // Even on unexpected errors, allow demo account as fallback
        const { email, password } = await request.json().catch(() => ({ email: '', password: '' }));
        if (email === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password) {
            return NextResponse.json({
                access_token: 'mock_access_token_' + Date.now(),
                user: DEMO_ACCOUNT.user,
            });
        }
        
        return NextResponse.json(
            { message: 'Internal server error', error: errorMessage },
            { status: 500 }
        );
    }
}
