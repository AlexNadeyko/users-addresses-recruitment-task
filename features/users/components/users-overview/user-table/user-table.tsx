'use client';

import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';

import { DataTable } from '@/lib/components/shared/data-table';
import { useTablePagination } from '@/lib/hooks/useTablePagination';
import { useGetPaginatedUsers } from '@/queries/users/useGetPaginatedUsers';
import { ActionType, useTableActions } from '@/lib/hooks/useTableActions';
import { AppAlertDialog } from '@/lib/components/shared/app-alert-dialog';
import { User } from '@prisma/client';
import { addUser, deleteUser, updateUser } from '@/actions/users';
import { getUserTableColumns } from './user-table-columns';
import { queryClient } from '@/lib/providers/queryClient';
import { QueryKeys } from '@/queries/constants/query-keys';
import { UserFormDialog } from '@/features/users/components/user-form-dialog';
import { TableLayout } from '@/lib/components/layout/table-layout';
import { FormMode } from '@/lib/constants/form-mode';
import { UserFormFields } from '@/features/users/schemas/user-schema';

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
    const { paginationState, handlePaginationChange } = useTablePagination();

    const {
        currentTableAction,
        selectedTableItem,
        isSubmitting,
        setCurrentTableAction,
        setSelectedTableItem,
        setIsSubmitting,
        cancelTableAction,
    } = useTableActions<User>();

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
            setCurrentTableAction(ActionType.DELETE);
            setSelectedTableItem(user);
        },
        [setCurrentTableAction, setSelectedTableItem],
    );

    const handleUserEditClick = useCallback(
        (user: User) => {
            setCurrentTableAction(ActionType.UPDATE);
            setSelectedTableItem(user);
        },
        [setCurrentTableAction, setSelectedTableItem],
    );

    const handleAddUserClick = () => setCurrentTableAction(ActionType.ADD);

    const handleUserDelete = async () => {
        if (!selectedTableItem) {
            return;
        }
        try {
            setIsSubmitting(true);
            const { id } = selectedTableItem;

            await deleteUser({
                userId: id,
            });

            toast.success('The user was deleted');
            await refetchPaginatedUsers();
            await queryClient.invalidateQueries({
                queryKey: [QueryKeys.USERS, QueryKeys.USER_ADDRESSES],
            });
            cancelTableAction();
            resetSelectedForAddressOverviewUser();
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong while deleting the user');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddUserFormSubmit = async (values: UserFormFields) => {
        try {
            setIsSubmitting(true);
            await addUser(values);
            toast.success('The user was added');
            await refetchPaginatedUsers();
            await queryClient.invalidateQueries({
                queryKey: [QueryKeys.USERS],
            });
            cancelTableAction();
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong while adding the user');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateUserFormSubmit = async (values: UserFormFields) => {
        if (!selectedTableItem) {
            return;
        }
        try {
            setIsSubmitting(true);
            await updateUser({ userId: selectedTableItem.id, userFormFields: values });
            toast.success('The user was updated');
            await refetchPaginatedUsers();
            await queryClient.invalidateQueries({
                queryKey: [QueryKeys.USERS, pageIndex],
            });
            cancelTableAction();
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong while updating the user');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                onOpenChange={() => setCurrentTableAction(null)}
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
