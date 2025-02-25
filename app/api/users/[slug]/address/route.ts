import { NextResponse } from 'next/server';

import { getPaginatedUserAddresses } from '@/data/server-queries/users';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get('page')) || 0;

        const slug = (await params).slug;
        const userId = Number(slug);

        const { totalCount, data } = await getPaginatedUserAddresses({ userId, page });

        return NextResponse.json({ totalCount, data });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 },
        );
    }
}
