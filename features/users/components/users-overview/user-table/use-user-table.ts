import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

import { useTablePagination } from '@/lib/hooks/useTablePagination';
import { ActionType, useTableActions } from '@/lib/hooks/useTableActions';
import { User } from '@prisma/client';
import { useGetPaginatedUsers } from '@/data/client-queries/users/useGetPaginatedUsers';
import { addUser, deleteUser, updateUser } from '@/data/actions/users';
import { ActionResponseStatus } from '@/data/actions/action-response';
import { queryClient } from '@/lib/providers/queryClient';
import { QueryKeys } from '@/data/client-queries/constants/query-keys';
import { UserFormFields } from '@/features/users/schemas/user-schema';

type UserTableHookProps = {
    resetSelectedForAddressOverviewUser: () => void;
};

export const useUserTable = ({ resetSelectedForAddressOverviewUser }: UserTableHookProps) => {
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

    const {
        data: paginatedUsers,
        isLoading: isPaginatedUsersLoading,
        refetch: refetchPaginatedUsers,
        error: paginatedUsersError,
    } = useGetPaginatedUsers({
        pageIndex: paginationState.pageIndex,
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

    return {
        paginationState,
        handlePaginationChange,
        currentTableAction,
        selectedTableItem,
        isSubmitting,
        paginatedUsers,
        isPaginatedUsersLoading,
        handleUserDeleteClick,
        handleUserEditClick,
        handleAddUserClick,
        handleUserDelete,
        handleAddUserFormSubmit,
        handleUpdateUserFormSubmit,
        cancelTableAction,
    };
};
