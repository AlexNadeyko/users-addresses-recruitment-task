'use server';

import { prisma } from '@/lib/prisma';
import { DEFAULT_PAGINATION_SIZE } from '@/lib/constants/pagination-size';
import { AddressType } from '@/features/users/types/user';
import { UserFormFields } from '@/features/users/schemas/user-schema';
import { getUserInitials } from '@/features/users/utils/get-user-initials';
import { UserAddressFormFields } from '@/features/users/schemas/user-address-schema';

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

export const addUser = async (userFormFields: UserFormFields) => {
    const { firstName, lastName, email } = userFormFields;
    await prisma.user.create({
        data: { firstName, lastName, email, initials: getUserInitials(firstName, lastName) },
    });
};

export const updateUser = async ({
    userId,
    userFormFields,
}: {
    userId: number;
    userFormFields: UserFormFields;
}) => {
    const { firstName, lastName, email } = userFormFields;
    await prisma.user.update({
        where: {
            id: userId,
        },
        data: { firstName, lastName, email, initials: getUserInitials(firstName, lastName) },
    });
};

export const deleteUser = async ({ userId }: { userId: number }) => {
    await prisma.user.delete({
        where: {
            id: userId,
        },
    });
};

export const addUserAddress = async ({
    userAddressFormFields,
    userId,
}: {
    userAddressFormFields: UserAddressFormFields;
    userId: number;
}) => {
    await prisma.userAddress.create({
        data: { ...userAddressFormFields, validFrom: new Date(), userId },
    });
};

export const updateUserAddress = async ({
    userId,
    userAddressFormFields,
    validFrom,
    addressType,
}: {
    userId: number;
    userAddressFormFields: UserAddressFormFields;
    validFrom: Date;
    addressType: AddressType;
}) => {
    await prisma.userAddress.update({
        where: {
            userId_addressType_validFrom: {
                userId,
                addressType,
                validFrom,
            },
        },
        data: { ...userAddressFormFields, validFrom: new Date() },
    });
};

export const deleteUserAddress = async ({
    userId,
    addressType,
    validFrom,
}: {
    userId: number;
    addressType: AddressType;
    validFrom: Date;
}) => {
    await prisma.userAddress.delete({
        where: {
            userId_addressType_validFrom: {
                addressType,
                validFrom,
                userId,
            },
        },
    });
};
