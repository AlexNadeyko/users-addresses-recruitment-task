import { AppDialog, AppDialogProps } from '@/lib/components/shared/app-dialog';
import { UserForm, UserFormProps } from '@/features/users/components/user-form';
import { FormMode } from '@/lib/constants/form-mode';

type UserFormDialogProps = Pick<AppDialogProps, 'open' | 'onOpenChange'> &
    Pick<UserFormProps, 'defaultValues' | 'isSubmitting' | 'onSubmit'> & {
        mode: FormMode;
    };

const MODE_CONFIGS: Record<FormMode, Pick<AppDialogProps, 'title' | 'buttonText'>> = {
    [FormMode.ADD]: { buttonText: 'Add', title: 'Add User' },
    [FormMode.UPDATE]: { buttonText: 'Edit', title: 'Edit User' },
};

export const UserFormDialog = ({
    open,
    mode,
    defaultValues,
    isSubmitting,
    onSubmit,
    onOpenChange,
}: UserFormDialogProps) => {
    const { title, buttonText } = MODE_CONFIGS[mode];

    return (
        <AppDialog open={open} title={title} onOpenChange={onOpenChange}>
            <UserForm
                buttonText={buttonText}
                defaultValues={defaultValues}
                isSubmitting={isSubmitting}
                onSubmit={onSubmit}
            />
        </AppDialog>
    );
};
