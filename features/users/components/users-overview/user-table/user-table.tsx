'use client';

import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { DataTable } from '@/lib/components/shared/data-table';
import { useTablePagination } from '@/lib/hooks/useTablePagination';
import { useGetPaginatedUsers } from '@/queries/users/useGetPaginatedUsers';
import { ActionType, useTableActions } from '@/lib/hooks/useTableActions';
import { AppAlertDialog } from '@/lib/components/shared/app-alert-dialog';
import { User } from '@prisma/client';
import { deleteUser } from '@/actions/users';
import { getUserTableColumns } from './user-table-columns';
import { queryClient } from '@/lib/providers/queryClient';
import { QueryKeys } from '@/queries/constants/query-keys';

type UserTableProps = {
    selectedUserRowId?: string;
    onUserClick: (user: User, rowId: string) => void;
    resetUser: () => void;
};

export const UserTable = ({ selectedUserRowId, onUserClick, resetUser }: UserTableProps) => {
    const { paginationState, handlePaginationChange } = useTablePagination();

    const { actionData, setActionData, resetActionData } = useTableActions<User>();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { pageIndex, pageSize } = paginationState;

    const {
        data: paginatedUsers,
        isLoading: isPaginatedUsersLoading,
        refetch: refetchPaginatedUsers,
    } = useGetPaginatedUsers({
        pageIndex,
    });

    const handleUserDeleteClick = useCallback(
        (user: User) => {
            setActionData({ data: user, type: ActionType.DELETE });
        },
        [setActionData],
    );

    const handleUserDelete = async () => {
        if (!actionData?.data) {
            return;
        }
        try {
            setIsSubmitting(true);
            const { id } = actionData.data;

            await deleteUser({
                userId: id,
            });

            toast.success('The user was deleted');
            await refetchPaginatedUsers();
            await queryClient.invalidateQueries({
                queryKey: [QueryKeys.USERS, QueryKeys.USER_ADDRESSES],
            });
            resetActionData();
            resetUser();
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong while deleting the user');
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns = useMemo(
        () => getUserTableColumns(handleUserDeleteClick),
        [handleUserDeleteClick],
    );

    return (
        <>
            <AppAlertDialog
                open={actionData?.type === ActionType.DELETE}
                description={
                    'This action cannot be undone. This will permanently delete the user with their addresses..'
                }
                isSubmitting={isSubmitting}
                onContinueClick={handleUserDelete}
                onCancelClick={resetActionData}
            />
            <DataTable
                columns={columns}
                data={paginatedUsers?.data}
                rowCount={paginatedUsers?.totalCount}
                pagination={{ pageIndex, pageSize }}
                selectedRowId={selectedUserRowId}
                noResultsText={isPaginatedUsersLoading ? 'Loading...' : 'No users found'}
                onRowClick={onUserClick}
                onPaginationChange={handlePaginationChange}
            />
        </>
    );
};
