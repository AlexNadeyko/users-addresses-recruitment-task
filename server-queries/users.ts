import { prisma } from '@/lib/prisma';
import { DEFAULT_PAGINATION_SIZE } from '@/lib/constants/pagination-size';
import { Prisma } from '@prisma/client';

export const getPaginatedUsers = async ({ page }: { page: number }) => {
    try {
        const [totalCount, data] = await prisma.$transaction([
            prisma.user.count(),
            prisma.user.findMany({
                skip: page * DEFAULT_PAGINATION_SIZE,
                take: DEFAULT_PAGINATION_SIZE,
            }),
        ]);
        return { totalCount, data };
    } catch (error) {
        console.error('Error fetching paginated users:', error);
        throw new Error('Unable to fetch users at this time. Please try again later.');
    }
};

export const getPaginatedUserAddresses = async ({
    page,
    userId,
}: {
    page: number;
    userId: number;
}) => {
    try {
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
    } catch (error) {
        console.error('Error fetching paginated user addresses:', error);

        let errorMessage = 'Unable to fetch user addresses at this time. Please try again later.';

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                errorMessage = 'User with provided id does not exist.';
            }
        }

        throw new Error(errorMessage);
    }
};
