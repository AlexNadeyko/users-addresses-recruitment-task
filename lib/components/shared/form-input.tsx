import { HTMLInputTypeAttribute } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/lib/components/ui/form';
import { Input } from '@/lib/components/ui/input';

type FormInputProps<FormFieldsValues extends FieldValues> = {
    control: Control<FormFieldsValues, unknown>;
    name: Path<FormFieldsValues>;
    type?: HTMLInputTypeAttribute;
    label: string;
    placeholder?: string;
};

export const FormInput = <FormFieldsValues extends FieldValues>({
    control,
    name,
    type,
    label,
    placeholder,
}: FormInputProps<FormFieldsValues>) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <div className="relative">
                        <Input type={type} placeholder={placeholder} {...field} />
                    </div>
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);
