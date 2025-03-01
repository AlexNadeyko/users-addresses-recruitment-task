import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

import { useTablePagination } from '@/lib/hooks/useTablePagination';
import { ActionType, useTableActions } from '@/lib/hooks/useTableActions';
import { UserAddress } from '@prisma/client';
import { useGetPaginatedUserAddresses } from '@/data/client-queries/users/useGetPaginatedUserAddresses';
import { addUserAddress, deleteUserAddress, updateUserAddress } from '@/data/actions/users';
import { AddressType } from '@/features/users/types/user';
import { ActionResponseStatus } from '@/data/actions/action-response';
import { queryClient } from '@/lib/providers/queryClient';
import { QueryKeys } from '@/data/client-queries/constants/query-keys';
import { UserAddressFormFields } from '@/features/users/schemas/user-address-schema';

type UserAddressHookTableProps = {
    userId?: number;
};

export const useUserAddressTable = ({ userId }: UserAddressHookTableProps) => {
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

    const {
        data: paginatedUserAddressesData,
        isLoading: isPaginatedUserAddressesLoading,
        refetch: refetchPaginatedUserAddresses,
        error: paginatedUserAddressesError,
    } = useGetPaginatedUserAddresses({
        pageIndex: paginationState.pageIndex,
        userId,
    });

    useEffect(() => {
        if (paginatedUserAddressesError) {
            toast.error(
                paginatedUserAddressesError.message ||
                    'Something went wrong while fetching user addresses',
            );
        }
    }, [paginatedUserAddressesError]);

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

            const { status, error } = await deleteUserAddress({
                addressType: addressType as AddressType,
                userId,
                validFrom,
            });

            if (status === ActionResponseStatus.SUCCESS) {
                toast.success('The address was deleted');
                await refetchPaginatedUserAddresses();
                await queryClient.invalidateQueries({
                    queryKey: [QueryKeys.USER_ADDRESSES],
                });
                cancelTableAction();
                return;
            }

            toast.error(error);
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

            const { status, error } = await addUserAddress({
                userAddressFormFields: values,
                userId,
            });

            if (status === ActionResponseStatus.SUCCESS) {
                toast.success('The address was added');
                await refetchPaginatedUserAddresses();
                await queryClient.invalidateQueries({
                    queryKey: [QueryKeys.USER_ADDRESSES],
                });
                cancelTableAction();
                return;
            }

            toast.error(error);
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

            const { status, error } = await updateUserAddress({
                userId,
                userAddressFormFields: values,
                validFrom: selectedTableItem.validFrom,
                addressType: selectedTableItem.addressType as AddressType,
            });

            if (status === ActionResponseStatus.SUCCESS) {
                toast.success('The address was updated');
                await refetchPaginatedUserAddresses();
                cancelTableAction();
                return;
            }

            toast.error(error);
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong while updating the address');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        paginationState,
        handlePaginationChange,
        currentTableAction,
        selectedTableItem,
        isSubmitting,
        cancelTableAction,
        handleUserAddressDeleteClick,
        handleUserAddressEditClick,
        handleAddUserAddressClick,
        handleUserAddressDelete,
        handleAddUserAddressFormSubmit,
        handleUpdateUserAddressFormSubmit,
        isPaginatedUserAddressesLoading,
        paginatedUserAddressesData,
        refetchPaginatedUserAddresses,
    };
};
