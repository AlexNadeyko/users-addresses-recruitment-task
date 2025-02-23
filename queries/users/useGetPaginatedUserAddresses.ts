import { useQuery } from '@tanstack/react-query';

import { QueryKeys } from '@/queries/constants/query-keys';
import { FIVE_MINS_IN_MILLIS } from '@/queries/constants/stale-time';

async function fetchPaginatedUserAddresses({ page, userId }: { page: number; userId: number }) {
    const res = await fetch(`/api/users/${userId}/address?page=${page}`, { method: 'GET' });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
}

type GetPaginatedUserAddressesProps = {
    pageIndex: number;
    userId?: number;
};

export const useGetPaginatedUserAddresses = ({
    pageIndex,
    userId,
}: GetPaginatedUserAddressesProps) =>
    useQuery({
        queryKey: [QueryKeys.USER_ADDRESSES, pageIndex, userId],
        queryFn: () => fetchPaginatedUserAddresses({ page: pageIndex, userId: userId as number }),
        staleTime: FIVE_MINS_IN_MILLIS,
        enabled: !!userId,
    });
