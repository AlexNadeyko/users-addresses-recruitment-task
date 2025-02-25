import { AppDialog, AppDialogProps } from '@/lib/components/shared/app-dialog';
import { FormMode } from '@/lib/constants/form-mode';
import {
    UserAddressForm,
    UserAddressFormProps,
} from '@/features/users/components/user-address-form';

type UserAddressFormDialogProps = Pick<AppDialogProps, 'open' | 'onOpenChange'> &
    Pick<UserAddressFormProps, 'defaultValues' | 'isSubmitting' | 'onSubmit'> & {
        mode: FormMode;
    };

const MODE_CONFIGS: Record<FormMode, Pick<AppDialogProps, 'title' | 'buttonText'>> = {
    [FormMode.ADD]: { buttonText: 'Add', title: 'Add User Address' },
    [FormMode.UPDATE]: { buttonText: 'Edit', title: 'Edit User Address' },
};

export const UserAddressFormDialog = ({
    open,
    mode,
    defaultValues,
    isSubmitting,
    onSubmit,
    onOpenChange,
}: UserAddressFormDialogProps) => {
    const { title, buttonText } = MODE_CONFIGS[mode];

    return (
        <AppDialog open={open} title={title} onOpenChange={onOpenChange}>
            <div className="max-h-[600px] overflow-auto">
                <UserAddressForm
                    buttonText={buttonText}
                    defaultValues={defaultValues}
                    isSubmitting={isSubmitting}
                    onSubmit={onSubmit}
                />
            </div>
        </AppDialog>
    );
};
