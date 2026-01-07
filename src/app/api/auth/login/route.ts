import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find user by email
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
    } catch (error) {
        console.error('Login error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { message: 'Internal server error', error: errorMessage },
            { status: 500 }
        );
    }
}
