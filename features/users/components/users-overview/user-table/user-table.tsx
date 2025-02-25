'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';

import { DataTable } from '@/lib/components/shared/data-table/data-table';
import { useTablePagination } from '@/lib/hooks/useTablePagination';
import { useGetPaginatedUsers } from '@/data/client-queries/users/useGetPaginatedUsers';
import { ActionType, useTableActions } from '@/lib/hooks/useTableActions';
import { AppAlertDialog } from '@/lib/components/shared/app-alert-dialog';
import { User } from '@prisma/client';
import { addUser, deleteUser, updateUser } from '@/data/actions/users';
import { getUserTableColumns } from './user-table-columns';
import { queryClient } from '@/lib/providers/queryClient';
import { QueryKeys } from '@/data/client-queries/constants/query-keys';
import { UserFormDialog } from '@/features/users/components/user-form-dialog';
import { TableLayout } from '@/lib/components/layout/table-layout';
import { FormMode } from '@/lib/constants/form-mode';
import { UserFormFields } from '@/features/users/schemas/user-schema';
import { ActionResponseStatus } from '@/data/actions/action-response';

type UserTableProps = {
    selectedUserRowId?: string;
    onUserClick: (user: User, rowId: string) => void;
    resetSelectedForAddressOverviewUser: () => void;
};

// TODO: to move logic to a hook
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
        error: paginatedUsersError,
    } = useGetPaginatedUsers({
        pageIndex,
    });

    useEffect(() => {
        if (paginatedUsersError) {
            toast.error(paginatedUsersError.message || 'Something went wrong while fetching users');
        }
    }, [paginatedUsersError]);

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

            const { status, error } = await deleteUser({
                userId: id,
            });

            if (status === ActionResponseStatus.SUCCESS) {
                toast.success('The user was deleted');
                await refetchPaginatedUsers();
                await queryClient.invalidateQueries({
                    queryKey: [QueryKeys.USERS, QueryKeys.USER_ADDRESSES],
                });
                cancelTableAction();
                resetSelectedForAddressOverviewUser();
                return;
            }

            toast.error(error);
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

            const { status, error } = await addUser(values);

            if (status === ActionResponseStatus.SUCCESS) {
                toast.success('The user was added');
                await refetchPaginatedUsers();
                await queryClient.invalidateQueries({
                    queryKey: [QueryKeys.USERS],
                });
                cancelTableAction();
                return;
            }

            toast.error(error);
        } catch (error) {
            console.error(error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Something went wrong while adding the user',
            );
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

            const { status, error } = await updateUser({
                userId: selectedTableItem.id,
                userFormFields: values,
            });

            if (status === ActionResponseStatus.SUCCESS) {
                toast.success('The user was updated');
                await refetchPaginatedUsers();
                cancelTableAction();
                return;
            }

            toast.error(error);
        } catch (error) {
            console.error(error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Something went wrong while updating the user',
            );
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
