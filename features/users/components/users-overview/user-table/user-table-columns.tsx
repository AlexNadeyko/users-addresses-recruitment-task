'use client';

import { ColumnDef } from '@tanstack/table-core';
import { MoreHorizontal } from 'lucide-react';

import { User } from '@prisma/client';
import { Badge } from '@/lib/components/ui/badge';
import {
    USERS_STATUS_BADGE_VARIANTS,
    USERS_STATUS_LABELS,
} from '@/features/users/constants/user-status';
import { UserStatus } from '@/features/users/types/user';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/lib/components/ui/dropdown-menu';
import { Button } from '@/lib/components/ui/button';

export const getUserTableColumns: ({
    onEditClick,
    onDeleteClick,
}: {
    onEditClick: (user: User, rowId: string) => void;
    onDeleteClick: (user: User, rowId: string) => void;
}) => ColumnDef<User>[] = ({ onEditClick, onDeleteClick }) => [
    {
        accessorKey: 'firstName',
        header: 'First Name',
    },
    {
        accessorKey: 'lastName',
        header: 'Last Name',
    },
    {
        accessorKey: 'initials',
        header: 'Initials',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue<UserStatus>('status');
            return (
                <Badge variant={USERS_STATUS_BADGE_VARIANTS[status]}>
                    {USERS_STATUS_LABELS[status]}
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const user = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditClick(user, row.id)}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => onDeleteClick(user, row.id)}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
