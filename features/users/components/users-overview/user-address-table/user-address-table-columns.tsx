'use client';

import { ColumnDef } from '@tanstack/table-core';
import { MoreHorizontal } from 'lucide-react';

import { UserAddress } from '@prisma/client';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/lib/components/ui/dropdown-menu';
import { Button } from '@/lib/components/ui/button';

export type UserAddressTable = Pick<
    UserAddress,
    'addressType' | 'street' | 'city' | 'buildingNumber' | 'countryCode' | 'postCode'
>;

export const userAddressTableColumns: ColumnDef<UserAddressTable>[] = [
    {
        accessorKey: 'addressType',
        header: 'Address Type',
    },
    {
        accessorKey: 'countryCode',
        header: 'Country Code',
    },
    {
        accessorKey: 'city',
        header: 'City',
    },
    {
        accessorKey: 'street',
        header: 'Street',
    },
    {
        accessorKey: 'buildingNumber',
        header: 'Building Number',
    },
    {
        accessorKey: 'postCode',
        header: 'Post Code',
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const address = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => console.log(address.addressType)}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => console.log(address.addressType)}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
