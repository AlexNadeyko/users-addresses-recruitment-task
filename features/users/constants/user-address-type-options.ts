import { Option } from '@/lib/types/option';
import { AddressType } from '@/features/users/types/user';
import { USER_ADDRESS_TYPE_LABEL } from '@/features/users/constants/user-address-type-label';

export const USER_ADDRESS_TYPE_OPTIONS: Option<AddressType>[] = [
    { value: AddressType.HOME, label: USER_ADDRESS_TYPE_LABEL[AddressType.HOME] },
    { value: AddressType.INVOICE, label: USER_ADDRESS_TYPE_LABEL[AddressType.INVOICE] },
    { value: AddressType.POST, label: USER_ADDRESS_TYPE_LABEL[AddressType.POST] },
    { value: AddressType.WORK, label: USER_ADDRESS_TYPE_LABEL[AddressType.WORK] },
];
