import { useQuery } from '@tanstack/react-query';

import { QueryKeys } from '@/client-queries/constants/query-keys';
import { FIVE_MINS_IN_MILLIS } from '@/client-queries/constants/stale-time';

async function fetchPaginatedUsers({ page }: { page: number }) {
    const res = await fetch(`/api/users?page=${page}`, { method: 'GET' });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch users');
    }
    return res.json();
}

type UsersProps = {
    pageIndex: number;
};

export const useGetPaginatedUsers = ({ pageIndex }: UsersProps) =>
    useQuery({
        queryKey: [QueryKeys.USERS, pageIndex],
        queryFn: () => fetchPaginatedUsers({ page: pageIndex }),
        staleTime: FIVE_MINS_IN_MILLIS,
    });
