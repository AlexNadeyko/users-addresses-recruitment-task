import { User } from '@prisma/client';

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export type UserTableRecord = Pick<
    User,
    'id' | 'firstName' | 'lastName' | 'status' | 'email' | 'initials'
>;
