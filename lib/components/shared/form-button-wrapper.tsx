import { PropsWithChildren } from 'react';

export const FormButtonWrapper = ({ children }: PropsWithChildren) => (
    <div className="flex justify-end">{children}</div>
);
