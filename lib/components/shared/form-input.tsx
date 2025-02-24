import { HTMLInputTypeAttribute } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/lib/components/ui/form';
import { Input } from '@/lib/components/ui/input';

type FormInputProps<FormFieldsValues extends FieldValues> = {
    control: Control<FormFieldsValues, any>;
    name: Path<FormFieldsValues>;
    type?: HTMLInputTypeAttribute;
    label: string;
    optional?: boolean;
    disabled?: boolean;
    defaultDisabledCursor?: boolean;
    placeholder?: string;
    suffix?: string;
};

export const FormInput = <FormFieldsValues extends FieldValues>({
    control,
    name,
    type,
    label,
    disabled,
    defaultDisabledCursor,
    placeholder,
    suffix,
}: FormInputProps<FormFieldsValues>) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel
                // TODO:
                // optional={optional}
                >
                    {label}
                </FormLabel>
                <FormControl>
                    <div className="relative">
                        <Input
                            type={type}
                            placeholder={placeholder}
                            disabled={disabled}
                            className={cn({
                                'disabled:cursor-default': defaultDisabledCursor,
                            })}
                            {...field}
                        />
                        <span className="font-bold absolute right-4 top-4">{suffix}</span>
                    </div>
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);
