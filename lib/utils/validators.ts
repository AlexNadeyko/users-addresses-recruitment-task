export const isZipCode = (value: string) => /^\d{2}-\d{3}$/.test(value);

export const isCountryCode = (value: string) => /^[A-Z]{3}$/.test(value);
