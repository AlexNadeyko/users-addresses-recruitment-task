import { getUserInitials } from '@/features/users/utils/get-user-initials';

type PersonInitialsProps = {
    firstName?: string | null;
    lastName: string;
};

export const PersonInitials = ({ firstName, lastName }: PersonInitialsProps) => (
    <div>
        <span>Initials: </span>
        <span>{firstName && lastName ? getUserInitials(firstName, lastName) : '-'}</span>
    </div>
);
