import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/lib/components/ui/form';
import { FormInput } from '@/lib/components/shared/form-input';
import { ActionButton } from '@/lib/components/shared/action-button';
import {
    UserAddressFormFields,
    UserAddressSchema,
} from '@/features/users/schemas/user-address-schema';
import { AddressType } from '@/features/users/types/user';
import { FormSelect } from '@/lib/components/shared/form-select';
import { USER_ADDRESS_TYPE_OPTIONS } from '@/features/users/constants/user-address-type-options';

export type UserAddressFormProps = {
    buttonText?: string;
    defaultValues?: UserAddressFormFields;
    isSubmitting?: boolean;
    onSubmit: (data: UserAddressFormFields) => void;
};

const DEFAULT_FORM_VALUES: UserAddressFormFields = {
    city: '',
    street: '',
    addressType: AddressType.HOME,
    buildingNumber: '',
    countryCode: '',
    postCode: '',
};

export const UserAddressForm = ({
    buttonText,
    defaultValues = DEFAULT_FORM_VALUES,
    isSubmitting,
    onSubmit,
}: UserAddressFormProps) => {
    const form = useForm<UserAddressFormFields>({
        resolver: zodResolver(UserAddressSchema),
        defaultValues,
    });

    const [city, street, buildingNumber, countryCode, postCode] = useWatch({
        control: form.control,
        name: ['city', 'street', 'buildingNumber', 'countryCode', 'postCode'],
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormSelect
                    control={form.control}
                    name="addressType"
                    label="Address type"
                    options={USER_ADDRESS_TYPE_OPTIONS}
                />
                <FormInput control={form.control} name="street" label="Street" />
                <FormInput control={form.control} name="buildingNumber" label="Building number" />
                <FormInput control={form.control} name="postCode" label="Post code" />
                <FormInput control={form.control} name="city" label="City" />
                <FormInput control={form.control} name="countryCode" label="Country code" />
                <div>
                    <span>Address: </span>
                    <p>{`${street} ${buildingNumber}`}</p>
                    <p>{`${postCode} ${city}`}</p>
                    <p>{countryCode}</p>
                </div>
                <ActionButton type="submit" isSubmitting={isSubmitting}>
                    {buttonText}
                </ActionButton>
            </form>
        </Form>
    );
};
