export const getUserInitials = (firstName: string | null, lastName: string) =>
    firstName ? `${firstName[0] || ''}${lastName[0] || ''}` : null;
