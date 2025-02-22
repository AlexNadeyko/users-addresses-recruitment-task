'use client';

import { DataTable } from '@/lib/components/shared/data-table';
import { useTablePagination } from '@/lib/hooks/useTablePagination';
import { userTableColumns } from './user-table-columns';
import { UserTableRecord } from '@/features/users/types/user';
import { useGetPaginatedUsers } from '@/queries/users/useGetPaginatedUsers';

type UserTableProps = {
    selectedUserRowId?: string;
    onUserClick: (user: UserTableRecord, rowId: string) => void;
};

export const UserTable = ({ selectedUserRowId, onUserClick }: UserTableProps) => {
    const { paginationState, handlePaginationChange } = useTablePagination();

    const { data: paginatedUsersData } = useGetPaginatedUsers({
        pageIndex: paginationState.pageIndex,
    });

    const { pageIndex, pageSize } = paginationState;

    return (
        <DataTable
            columns={userTableColumns}
            data={paginatedUsersData?.data}
            rowCount={paginatedUsersData?.totalCount}
            pagination={{ pageIndex, pageSize }}
            selectedRowId={selectedUserRowId}
            onRowClick={onUserClick}
            onPaginationChange={handlePaginationChange}
        />
    );
};
