import { NextResponse } from 'next/server';

import { getPaginatedUsers } from '@/server-queries/users';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const page = Number(searchParams.get('page')) || 0;

        const paginatedUsersData = await getPaginatedUsers({ page });

        return NextResponse.json(paginatedUsersData);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 },
        );
    }
}
