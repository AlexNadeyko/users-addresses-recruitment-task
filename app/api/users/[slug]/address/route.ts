import { NextResponse } from 'next/server';

import { getPaginatedUserAddresses } from '@/actions/users';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page')) || 0;

    const slug = (await params).slug;
    const userId = Number(slug);

    const { totalCount, data } = await getPaginatedUserAddresses({ userId, page });

    return NextResponse.json({ totalCount, data });
}
