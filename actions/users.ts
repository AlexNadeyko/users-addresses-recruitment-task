'use server';

import { prisma } from '@/lib/prisma';
import { DEFAULT_PAGINATION_SIZE } from '@/lib/constants/pagination-size';
import { AddressType } from '@/features/users/types/user';

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

export const deleteUser = async ({ userId }: { userId: number }) => {
    await prisma.user.delete({
        where: {
            id: userId,
        },
    });
};

export const deleteUserAddress = async ({
    userId,
    addressType,
    validFrom,
}: {
    userId: number;
    addressType: AddressType;
    validFrom: string;
}) => {
    await prisma.userAddress.delete({
        where: {
            userId_addressType_validFrom: {
                addressType,
                // TODO:
                validFrom: validFrom.replace('T', ' ').replace('Z', ''),
                userId,
            },
        },
    });
};
