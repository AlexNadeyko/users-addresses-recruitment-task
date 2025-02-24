'use client';

import { useState } from 'react';

import { UserTable } from './user-table/user-table';
import { TableLayout } from '@/lib/components/layout/table-layout';
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

    const handleAddUserAddressClick = () => {
        console.log('Add user clicked');
    };

    const handleUserReset = () => setSelectedUserRowDara(null);

    return (
        <>
            <UserTable
                selectedUserRowId={selectedUserRowData?.rowId}
                onUserClick={handleUserClick}
                resetSelectedForAddressOverviewUser={handleUserReset}
            />
            <TableLayout
                tableTitle="User Addresses"
                buttonConfig={{ text: 'Add address', onClick: handleAddUserAddressClick }}
            >
                <UserAddressTable userId={selectedUserRowData?.user.id} />
            </TableLayout>
        </>
    );
};
