import { Button } from '@/lib/components/ui/button';
import { Table } from '@tanstack/table-core';

type DataTablePaginationProps<TableData> = {
    table: Table<TableData>;
};

export const DataTablePagination = <TableData,>({ table }: DataTablePaginationProps<TableData>) => {
    const totalCount = table.getRowCount();

    return (
        <div className="flex justify-between items-center">
            {totalCount ? (
                <div className="text-sm font-medium text-zinc-700">Total count: {totalCount}</div>
            ) : null}

            <div className="flex justify-end items-center gap-4">
                {table.getRowModel().rows?.length ? (
                    <>
                        <div className="text-sm font-medium">
                            Page {table.getState().pagination.pageIndex + 1} of{' '}
                            {table.getPageCount()}
                        </div>
                    </>
                ) : null}
                <div className="space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};
