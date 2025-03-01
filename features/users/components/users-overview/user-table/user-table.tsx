'use client';

import { useMemo } from 'react';

import { DataTable } from '@/lib/components/shared/data-table/data-table';
import { ActionType } from '@/lib/hooks/useTableActions';
import { AppAlertDialog } from '@/lib/components/shared/app-alert-dialog';
import { User } from '@prisma/client';
import { UserFormDialog } from '@/features/users/components/user-form-dialog';
import { TableLayout } from '@/lib/components/layout/table-layout';
import { FormMode } from '@/lib/constants/form-mode';
import { getUserTableColumns } from './user-table-columns';
import { useUserTable } from './use-user-table';

type UserTableProps = {
    selectedUserRowId?: string;
    onUserClick: (user: User, rowId: string) => void;
    resetSelectedForAddressOverviewUser: () => void;
};

export const UserTable = ({
    selectedUserRowId,
    onUserClick,
    resetSelectedForAddressOverviewUser,
}: UserTableProps) => {
    const {
        paginationState,
        paginatedUsers,
        selectedTableItem,
        currentTableAction,
        isPaginatedUsersLoading,
        isSubmitting,
        handleUserEditClick,
        handleUserDeleteClick,
        cancelTableAction,
        handleUserDelete,
        handleAddUserFormSubmit,
        handleUpdateUserFormSubmit,
        handleAddUserClick,
        handlePaginationChange,
    } = useUserTable({ resetSelectedForAddressOverviewUser });

    const { pageIndex, pageSize } = paginationState;

    const columns = useMemo(
        () =>
            getUserTableColumns({
                onEditClick: handleUserEditClick,
                onDeleteClick: handleUserDeleteClick,
            }),
        [handleUserDeleteClick, handleUserEditClick],
    );

    return (
        <>
            <UserFormDialog
                mode={currentTableAction === ActionType.ADD ? FormMode.ADD : FormMode.UPDATE}
                open={
                    currentTableAction === ActionType.ADD ||
                    currentTableAction === ActionType.UPDATE
                }
                defaultValues={selectedTableItem || undefined}
                isSubmitting={isSubmitting}
                onOpenChange={cancelTableAction}
                onSubmit={
                    currentTableAction === ActionType.ADD
                        ? handleAddUserFormSubmit
                        : handleUpdateUserFormSubmit
                }
            />
            <AppAlertDialog
                open={currentTableAction === ActionType.DELETE}
                description={
                    'This action cannot be undone. This will permanently delete the user with their addresses..'
                }
                isSubmitting={isSubmitting}
                onContinueClick={handleUserDelete}
                onCancelClick={cancelTableAction}
            />
            <TableLayout
                tableTitle="Users"
                buttonConfig={{ text: 'Add user', onClick: handleAddUserClick }}
            >
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
            </TableLayout>
        </>
    );
};
