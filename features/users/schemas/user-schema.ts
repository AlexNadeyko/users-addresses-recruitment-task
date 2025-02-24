import { z } from 'zod';

import { FORM_VALIDATION_MESSAGES } from '@/lib/constants/form-validation-messages';

export const UserSchema = z.object({
    firstName: z.string().nullable(),
    lastName: z
        .string()
        .min(1, 'Last name is required')
        .max(100, FORM_VALIDATION_MESSAGES.ONE_HUNDRED_CHARACTERS_FIELD_LIMIT),
    email: z
        .string()
        .email('Invalid email address')
        .max(100, FORM_VALIDATION_MESSAGES.ONE_HUNDRED_CHARACTERS_FIELD_LIMIT),
});

export type UserFormFields = z.infer<typeof UserSchema>;
