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
import { AddressType } from '@/features/users/types/user';
import { Badge } from '@/lib/components/ui/badge';
import { USER_ADDRESS_TYPE_LABEL } from '@/features/users/constants/user-address-type-label';

export const getUserAddressTableColumns: ({
    onEditClick,
    onDeleteClick,
}: {
    onDeleteClick: (address: UserAddress, rowId: string) => void;
    onEditClick: (user: UserAddress, rowId: string) => void;
}) => ColumnDef<UserAddress>[] = ({ onDeleteClick, onEditClick }) => [
    {
        accessorKey: 'addressType',
        header: 'Address Type',
        cell: ({ row }) => {
            const addressType = row.getValue<AddressType>('addressType');
            return <Badge>{USER_ADDRESS_TYPE_LABEL[addressType]}</Badge>;
        },
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
                        <DropdownMenuItem onClick={() => onEditClick(address, row.id)}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => onDeleteClick(address, row.id)}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
