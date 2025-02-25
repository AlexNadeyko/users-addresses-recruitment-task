'use client';

import { useState } from 'react';

import { UserTable } from './user-table/user-table';
import { UserAddressTable } from '@/features/users/components/users-overview/user-address-table/user-address-table';
import { User } from '@prisma/client';

export const UsersOverview = () => {
    const [selectedUserRowData, setSelectedUserRowDara] = useState<{
        user: User;
        rowId: string;
    } | null>(null);

    const handleUserClick = (user: User, rowId: string) => {
        setSelectedUserRowDara({ user, rowId });
    };

    const handleUserReset = () => setSelectedUserRowDara(null);

    return (
        <div className="flex flex-col gap-4">
            <UserTable
                selectedUserRowId={selectedUserRowData?.rowId}
                onUserClick={handleUserClick}
                resetSelectedForAddressOverviewUser={handleUserReset}
            />
            <UserAddressTable userId={selectedUserRowData?.user.id} />
        </div>
    );
};
