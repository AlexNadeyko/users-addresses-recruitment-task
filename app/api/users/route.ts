import { NextResponse } from 'next/server';

import { getPaginatedUsers } from '@/lib/actions/users';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get('page')) || 0;

    try {
        const paginatedUsersData = await getPaginatedUsers({ page });
        return NextResponse.json(paginatedUsersData);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 400 });
    }
}
