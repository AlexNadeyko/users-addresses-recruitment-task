import { UserStatus } from '@/features/users/types/user';
import { BadgeVariant } from '@/lib/components/ui/badge';

export const USERS_STATUS_LABELS: Record<UserStatus, string> = {
    [UserStatus.ACTIVE]: 'Active',
    [UserStatus.INACTIVE]: 'Inactive',
};

export const USERS_STATUS_BADGE_VARIANTS: Record<
    UserStatus,
    Extract<BadgeVariant, 'default' | 'destructive'>
> = {
    [UserStatus.ACTIVE]: 'default',
    [UserStatus.INACTIVE]: 'destructive',
};
