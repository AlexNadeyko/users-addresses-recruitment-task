import { Address } from '@/lib/types/address';

type AddressPreviewProps = {
    address: Address;
};

export const AddressPreview = ({ address }: AddressPreviewProps) => {
    const { city, street, buildingNumber, countryCode, postCode } = address;

    return (
        <div>
            <span>Address: </span>
            <p>{`${street} ${buildingNumber}`}</p>
            <p>{`${postCode} ${city}`}</p>
            <p>{countryCode}</p>
        </div>
    );
};
