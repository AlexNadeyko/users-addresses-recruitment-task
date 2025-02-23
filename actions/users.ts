import { prisma } from '@/lib/prisma';
import { DEFAULT_PAGINATION_SIZE } from '@/lib/constants/pagination-size';

export const getPaginatedUsers = async ({ page }: { page: number }) => {
    const [totalCount, data] = await prisma.$transaction([
        prisma.user.count(),
        prisma.user.findMany({
            skip: page * DEFAULT_PAGINATION_SIZE,
            take: DEFAULT_PAGINATION_SIZE,
        }),
    ]);
    return { totalCount, data };
};

export const getPaginatedUserAddresses = async ({
    page,
    userId,
}: {
    page: number;
    userId: number;
}) => {
    const [totalCount, data] = await prisma.$transaction([
        prisma.userAddress.count({
            where: {
                userId,
            },
        }),
        prisma.userAddress.findMany({
            skip: page * DEFAULT_PAGINATION_SIZE,
            take: DEFAULT_PAGINATION_SIZE,
            where: {
                userId,
            },
        }),
    ]);

    return { totalCount, data };
};
