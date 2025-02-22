'use client';

import { useState } from 'react';

import { UserTableRecord } from '@/features/users/types/user';
import { UserTable } from './user-table/user-table';
import { TableLayout } from '@/lib/components/layout/table-layout';

export const UsersOverview = () => {
    const [selectedUserRowData, setSelectedUserRowDara] = useState<{
        user: UserTableRecord;
        rowId: string;
    } | null>(null);

    const handleUserClick = (user: UserTableRecord, rowId: string) => {
        setSelectedUserRowDara({ user, rowId });
    };

    const handleAddUserClick = () => {
        console.log('Add user clicked');
    };

    const handleAddUserAddressClick = () => {
        console.log('Add user clicked');
    };

    return (
        <>
            <TableLayout
                tableTitle="Users"
                buttonConfig={{ text: 'Add user', onClick: handleAddUserClick }}
            >
                <UserTable
                    selectedUserRowId={selectedUserRowData?.rowId}
                    onUserClick={handleUserClick}
                />
            </TableLayout>
        </>
    );
};
