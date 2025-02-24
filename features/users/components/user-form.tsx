import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/lib/components/ui/form';
import { FormInput } from '@/lib/components/shared/form-input';
import { UserFormFields, UserSchema } from '@/features/users/schemas/user-schema';
import { ActionButton } from '@/lib/components/shared/action-button';
import { getUserInitials } from '@/features/users/utils/get-use-initials';

export type UserFormProps = {
    buttonText?: string;
    defaultValues?: UserFormFields;
    isSubmitting?: boolean;
    onSubmit: (data: UserFormFields) => void;
};

const DEFAULT_FORM_VALUES: UserFormFields = { firstName: '', lastName: '', email: '' };

export const UserForm = ({
    buttonText,
    defaultValues = DEFAULT_FORM_VALUES,
    isSubmitting,
    onSubmit,
}: UserFormProps) => {
    const form = useForm<UserFormFields>({
        resolver: zodResolver(UserSchema),
        defaultValues,
    });

    const [firstName, lastName] = useWatch({
        control: form.control,
        name: ['firstName', 'lastName'],
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormInput control={form.control} name="firstName" label="First name" />
                <FormInput control={form.control} name="lastName" label="Last name" />
                <div>
                    <span>Initials: </span>
                    <span>{getUserInitials(firstName, lastName)}</span>
                </div>
                <FormInput control={form.control} name="email" label="Email" />
                <ActionButton type="submit" isSubmitting={isSubmitting}>
                    {buttonText}
                </ActionButton>
            </form>
        </Form>
    );
};
