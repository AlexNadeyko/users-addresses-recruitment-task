import { z } from 'zod';

import { FORM_VALIDATION_MESSAGES } from '@/lib/constants/form-validation-messages';
import { AddressType } from '@/features/users/types/user';
import { isCountryCode, isZipCode } from '@/lib/utils/validators';

export const UserAddressSchema = z.object({
    addressType: z.nativeEnum(AddressType, {
        message: "Expected 'HOME' | 'INVOICE' | 'POST' | 'WORK'",
    }),
    postCode: z
        .string()
        .min(1, 'Last name is required')
        .refine(isZipCode, FORM_VALIDATION_MESSAGES.INVALID_ZIP_CODE_FIELD),
    city: z
        .string()
        .min(1, 'Last name is required')
        .max(60, FORM_VALIDATION_MESSAGES.SIXTY_CHARACTERS_FIELD_LIMIT),
    countryCode: z
        .string()
        .min(1, 'Country code is required')
        .refine(isCountryCode, FORM_VALIDATION_MESSAGES.INVALID_COUNTRY_CODE_FIELD),
    street: z
        .string()
        .min(1, 'Street is required')
        .max(100, FORM_VALIDATION_MESSAGES.ONE_HUNDRED_CHARACTERS_FIELD_LIMIT),
    buildingNumber: z
        .string()
        .min(1, 'Building number is required')
        .max(60, FORM_VALIDATION_MESSAGES.SIXTY_CHARACTERS_FIELD_LIMIT),
});

export type UserAddressFormFields = z.infer<typeof UserAddressSchema>;
