'use client';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    TableOptions,
    useReactTable,
} from '@tanstack/react-table';
import classNames from 'classnames';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/lib/components/ui/table';
import { PaginationState } from '@/lib/types/pagination';
import { DataTablePagination } from '@/lib/components/shared/data-table/data-table-pagination';

type DataTableProps<TData, TValue> = {
    columns?: ColumnDef<TData, TValue>[];
    data?: TData[];
    pagination?: PaginationState;
    selectedRowId?: string;
    onRowClick?: (record: TData, rowId: string) => void;
    noResultsText?: string;
} & Pick<TableOptions<TData>, 'onPaginationChange' | 'rowCount'>;

export const DataTable = <TData, TValue>({
    columns,
    data,
    rowCount,
    pagination,
    selectedRowId,
    noResultsText = 'No results.',
    onRowClick,
    onPaginationChange,
}: DataTableProps<TData, TValue>) => {
    const table = useReactTable({
        data: data || [],
        columns: columns || [],
        manualPagination: true,
        onPaginationChange,
        state: { pagination },
        rowCount,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    className={classNames({
                                        'cursor-pointer': onRowClick,
                                        'bg-gray-200 hover:bg-gray-300': selectedRowId === row.id,
                                    })}
                                    onClick={
                                        onRowClick
                                            ? () => onRowClick(row.original, row.id)
                                            : undefined
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns?.length} className="h-24 text-center">
                                    {noResultsText}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
};
