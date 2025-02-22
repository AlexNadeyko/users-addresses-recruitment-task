import { useState } from 'react';

import { DEFAULT_PAGINATION_SIZE } from '@/lib/constants/pagination-size';

export const useTablePagination = () => {
    const [paginationState, setPaginationState] = useState({
        pageSize: DEFAULT_PAGINATION_SIZE,
        pageIndex: 0,
    });

    return {
        paginationState,
        handlePaginationChange: setPaginationState,
    };
};
