'use server';

import { prisma } from '@/lib/prisma';
import { AddressType } from '@/features/users/types/user';
import { UserFormFields } from '@/features/users/schemas/user-schema';
import { getUserInitials } from '@/features/users/utils/get-user-initials';
import { UserAddressFormFields } from '@/features/users/schemas/user-address-schema';
import { Prisma } from '@prisma/client';
import { ActionResponseStatus } from '@/actions/action-response';

export const addUser = async (userFormFields: UserFormFields) => {
    try {
        const { firstName, lastName, email } = userFormFields;

        const initials = firstName ? getUserInitials(firstName, lastName) : null;

        const user = await prisma.user.create({
            data: { firstName, lastName, email, initials },
        });

        return { status: ActionResponseStatus.SUCCESS, data: user };
    } catch (error) {
        console.error('Error adding user:', error instanceof Error ? error.stack : '');

        let errorMessage = 'Unable to add user at this time. Please try again later.';

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                const fieldName = error.meta?.target?.[0];
                if (fieldName === 'email') {
                    errorMessage = 'Email already exists. Please use a different email.';
                }
            }
        }

        return { status: ActionResponseStatus.FAILED, error: errorMessage };
    }
};

export const updateUser = async ({
    userId,
    userFormFields,
}: {
    userId: number;
    userFormFields: UserFormFields;
}) => {
    try {
        const { firstName, lastName, email } = userFormFields;

        const initials = firstName ? getUserInitials(firstName, lastName) : null;

        const user = await prisma.user.update({
            where: {
                id: userId,
            },
            data: { firstName, lastName, email, initials },
        });
        return { status: ActionResponseStatus.SUCCESS, data: user };
    } catch (error) {
        console.error('Error updating user:', error instanceof Error ? error.stack : '');

        let errorMessage = 'Unable to update user at this time. Please try again later.';

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                errorMessage = 'User with provided id does not exist.';
            } else if (error.code === 'P2002') {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                const fieldName = error.meta?.target?.[0];
                if (fieldName === 'email') {
                    errorMessage = 'Email already exists. Please use a different email.';
                }
            }
        }
        return { status: ActionResponseStatus.FAILED, error: errorMessage };
    }
};

export const deleteUser = async ({ userId }: { userId: number }) => {
    try {
        const user = await prisma.user.delete({
            where: {
                id: userId,
            },
        });
        return { status: ActionResponseStatus.SUCCESS, data: user };
    } catch (error) {
        console.error('Error deleting user:', error instanceof Error ? error.stack : '');

        let errorMessage = 'Unable to delete user at this time. Please try again later.';

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                errorMessage = 'User with provided id does not exist.';
            }
        }

        return { status: ActionResponseStatus.FAILED, error: errorMessage };
    }
};

export const addUserAddress = async ({
    userAddressFormFields,
    userId,
}: {
    userAddressFormFields: UserAddressFormFields;
    userId: number;
}) => {
    try {
        const address = await prisma.userAddress.create({
            data: { ...userAddressFormFields, validFrom: new Date(), userId },
        });

        return { status: ActionResponseStatus.SUCCESS, data: address };
    } catch (error) {
        console.error('Error adding address:', error instanceof Error ? error.stack : '');

        let errorMessage = 'Unable to add address at this time. Please try again later.';

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                errorMessage = 'THis address is not unique. Please use a different address.';
            }
        }

        return { status: ActionResponseStatus.FAILED, error: errorMessage };
    }
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
    try {
        const address = await prisma.userAddress.update({
            where: {
                userId_addressType_validFrom: {
                    userId,
                    addressType,
                    validFrom,
                },
            },
            data: { ...userAddressFormFields, validFrom: new Date() },
        });

        return { status: ActionResponseStatus.SUCCESS, data: address };
    } catch (error) {
        console.error('Error updating address:', error instanceof Error ? error.stack : '');

        let errorMessage = 'Unable to update address at this time. Please try again later.';

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                errorMessage = 'Address with provided id does not exist.';
            } else if (error.code === 'P2002') {
                errorMessage = 'THis address is not unique. Please use a different address.';
            }
        }

        return { status: ActionResponseStatus.FAILED, error: errorMessage };
    }
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
    try {
        const address = await prisma.userAddress.delete({
            where: {
                userId_addressType_validFrom: {
                    addressType,
                    validFrom,
                    userId,
                },
            },
        });

        return { status: ActionResponseStatus.SUCCESS, data: address };
    } catch (error) {
        console.error('Error deleting address:', error instanceof Error ? error.stack : '');

        let errorMessage = 'Unable to delete address at this time. Please try again later.';

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                errorMessage = 'Address with provided id does not exist.';
            }
        }

        return { status: ActionResponseStatus.FAILED, error: errorMessage };
    }
};
