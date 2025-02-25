'use client';

import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';

import { DataTable } from '@/lib/components/shared/data-table';
import { useTablePagination } from '@/lib/hooks/useTablePagination';
import { useGetPaginatedUserAddresses } from '@/queries/users/useGetPaginatedUserAddresses';
import { UserAddress } from '@prisma/client';
import { ActionType, useTableActions } from '@/lib/hooks/useTableActions';
import { AppAlertDialog } from '@/lib/components/shared/app-alert-dialog';
import { addUserAddress, deleteUserAddress, updateUserAddress } from '@/actions/users';
import { AddressType } from '@/features/users/types/user';
import { TableLayout } from '@/lib/components/layout/table-layout';
import { queryClient } from '@/lib/providers/queryClient';
import { QueryKeys } from '@/queries/constants/query-keys';
import { UserAddressFormDialog } from '@/features/users/components/user-address-form-dialog';
import { FormMode } from '@/lib/constants/form-mode';
import { UserAddressFormFields } from '@/features/users/schemas/user-address-schema';
import { getUserAddressTableColumns } from './user-address-table-columns';

type UserAddressTableProps = {
    userId?: number;
};

export const UserAddressTable = ({ userId }: UserAddressTableProps) => {
    const { paginationState, handlePaginationChange } = useTablePagination();

    const {
        currentTableAction,
        selectedTableItem,
        isSubmitting,
        setCurrentTableAction,
        setSelectedTableItem,
        setIsSubmitting,
        cancelTableAction,
    } = useTableActions<UserAddress>();

    const { pageIndex, pageSize } = paginationState;

    const {
        data: paginatedUserAddressesData,
        isLoading: isPaginatedUserAddressesLoading,
        refetch: refetchPaginatedUserAddresses,
    } = useGetPaginatedUserAddresses({
        pageIndex,
        userId,
    });

    const handleUserAddressDeleteClick = useCallback(
        (address: UserAddress) => {
            setCurrentTableAction(ActionType.DELETE);
            setSelectedTableItem(address);
        },
        [setCurrentTableAction, setSelectedTableItem],
    );

    const handleUserAddressEditClick = useCallback(
        (address: UserAddress) => {
            setCurrentTableAction(ActionType.UPDATE);
            setSelectedTableItem(address);
        },
        [setCurrentTableAction, setSelectedTableItem],
    );

    const handleAddUserAddressClick = () => setCurrentTableAction(ActionType.ADD);

    const handleUserAddressDelete = async () => {
        if (!selectedTableItem) {
            return;
        }
        try {
            setIsSubmitting(true);
            const { userId, addressType, validFrom } = selectedTableItem;
            await deleteUserAddress({
                addressType: addressType as AddressType,
                userId,
                validFrom,
            });
            toast.success('The address was deleted');
            await refetchPaginatedUserAddresses();
            await queryClient.invalidateQueries({
                queryKey: [QueryKeys.USER_ADDRESSES],
            });
            cancelTableAction();
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong while deleting the address');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddUserAddressFormSubmit = async (values: UserAddressFormFields) => {
        if (!userId) {
            return;
        }
        try {
            setIsSubmitting(true);
            await addUserAddress({
                userAddressFormFields: values,
                userId,
            });
            toast.success('The address was added');
            await refetchPaginatedUserAddresses();
            await queryClient.invalidateQueries({
                queryKey: [QueryKeys.USER_ADDRESSES],
            });
            cancelTableAction();
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong while adding the address');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateUserAddressFormSubmit = async (values: UserAddressFormFields) => {
        if (!userId || !selectedTableItem) {
            return;
        }
        try {
            setIsSubmitting(true);
            await updateUserAddress({
                userId,
                userAddressFormFields: values,
                validFrom: selectedTableItem.validFrom,
                addressType: selectedTableItem.addressType as AddressType,
            });
            toast.success('The address was updated');
            await refetchPaginatedUserAddresses();
            await queryClient.invalidateQueries({
                queryKey: [QueryKeys.USER_ADDRESSES, pageIndex],
            });
            cancelTableAction();
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong while updating the address');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                onOpenChange={() => setCurrentTableAction(null)}
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
