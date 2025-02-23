'use client';

import { DataTable } from '@/lib/components/shared/data-table';
import { useTablePagination } from '@/lib/hooks/useTablePagination';
import { userAddressTableColumns } from '@/features/users/components/users-overview/user-address-table/user-address-table-columns';
import { useGetPaginatedUserAddresses } from '@/queries/users/useGetPaginatedUserAddresses';

type UserAddressTableProps = {
    userId?: number;
};

export const UserAddressTable = ({ userId }: UserAddressTableProps) => {
    const { paginationState, handlePaginationChange } = useTablePagination();

    const { pageIndex, pageSize } = paginationState;

    const { data: paginatedUserAddressesData } = useGetPaginatedUserAddresses({
        pageIndex,
        userId,
    });

    return (
        <DataTable
            columns={userAddressTableColumns}
            data={paginatedUserAddressesData?.data}
            rowCount={paginatedUserAddressesData?.totalCount}
            noResultsText={userId ? 'No addresses found' : 'Select a user to view their addresses'}
            pagination={{ pageIndex, pageSize }}
            onPaginationChange={handlePaginationChange}
        />
    );
};
