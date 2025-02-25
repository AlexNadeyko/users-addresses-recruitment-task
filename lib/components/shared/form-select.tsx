import { HTMLInputTypeAttribute, useMemo } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/lib/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/lib/components/ui/select';
import { Option } from '@/lib/types/option';

type FormSelectProps<FormFieldsValues extends FieldValues> = {
    control: Control<FormFieldsValues, unknown>;
    name: Path<FormFieldsValues>;
    type?: HTMLInputTypeAttribute;
    label: string;
    options: Option<string>[];
};

export const FormSelect = <FormFieldsValues extends FieldValues>({
    control,
    name,
    label,
    options,
}: FormSelectProps<FormFieldsValues>) => {
    const selectItems = useMemo(
        () =>
            options.map((option) => {
                const { value, label } = option;
                return (
                    <SelectItem key={value} value={value}>
                        {label}
                    </SelectItem>
                );
            }),
        [options],
    );

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Select {...field} onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>{selectItems}</SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
