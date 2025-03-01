'use client';

import { useMemo } from 'react';

import { ActionType } from '@/lib/hooks/useTableActions';
import { AppAlertDialog } from '@/lib/components/shared/app-alert-dialog';
import { TableLayout } from '@/lib/components/layout/table-layout';
import { UserAddressFormDialog } from '@/features/users/components/user-address-form-dialog';
import { FormMode } from '@/lib/constants/form-mode';
import { DataTable } from '@/lib/components/shared/data-table/data-table';
import { UserAddressFormFields } from '@/features/users/schemas/user-address-schema';
import { getUserAddressTableColumns } from './user-address-table-columns';
import { useUserAddressTable } from './use-user-address-table';

type UserAddressTableProps = {
    userId?: number;
};

export const UserAddressTable = ({ userId }: UserAddressTableProps) => {
    const {
        paginatedUserAddressesData,
        paginationState: { pageIndex, pageSize },
        selectedTableItem,
        currentTableAction,
        isPaginatedUserAddressesLoading,
        isSubmitting,
        cancelTableAction,
        handleUserAddressDeleteClick,
        handleUserAddressEditClick,
        handleUpdateUserAddressFormSubmit,
        handleAddUserAddressClick,
        handleAddUserAddressFormSubmit,
        handleUserAddressDelete,
        handlePaginationChange,
    } = useUserAddressTable({ userId });

    const columns = useMemo(
        () =>
            getUserAddressTableColumns({
                onDeleteClick: handleUserAddressDeleteClick,
                onEditClick: handleUserAddressEditClick,
            }),
        [handleUserAddressDeleteClick, handleUserAddressEditClick],
    );

    const noResultsText = useMemo(() => {
        if (isPaginatedUserAddressesLoading) {
            return 'Loading...';
        }
        if (userId) {
            return 'No addresses found';
        }

        return 'Select a user to view their addresses';
    }, [isPaginatedUserAddressesLoading, userId]);

    return (
        <>
            <UserAddressFormDialog
                mode={currentTableAction === ActionType.ADD ? FormMode.ADD : FormMode.UPDATE}
                open={
                    currentTableAction === ActionType.ADD ||
                    currentTableAction === ActionType.UPDATE
                }
                defaultValues={(selectedTableItem as UserAddressFormFields) || undefined}
                isSubmitting={isSubmitting}
                onOpenChange={cancelTableAction}
                onSubmit={
                    currentTableAction === ActionType.ADD
                        ? handleAddUserAddressFormSubmit
                        : handleUpdateUserAddressFormSubmit
                }
            />
            <AppAlertDialog
                open={currentTableAction === ActionType.DELETE}
                description={
                    'This action cannot be undone. This will permanently delete the address.'
                }
                isSubmitting={isSubmitting}
                onContinueClick={handleUserAddressDelete}
                onCancelClick={cancelTableAction}
            />
            <TableLayout
                tableTitle="User Addresses"
                buttonConfig={{
                    text: 'Add address',
                    disabled: !userId,
                    onClick: handleAddUserAddressClick,
                }}
            >
                <DataTable
                    columns={columns}
                    data={paginatedUserAddressesData?.data}
                    rowCount={paginatedUserAddressesData?.totalCount}
                    noResultsText={noResultsText}
                    pagination={{ pageIndex, pageSize }}
                    onPaginationChange={handlePaginationChange}
                />
            </TableLayout>
        </>
    );
};
