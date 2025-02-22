import { PropsWithChildren } from 'react';

import { Button } from '@/lib/components/ui/button';

type TableLayoutProps = {
    tableTitle?: string;
    buttonConfig?: { text: string; onClick: () => void };
} & PropsWithChildren;

export const TableLayout = ({ tableTitle, buttonConfig, children }: TableLayoutProps) => {
    const header =
        tableTitle || buttonConfig ? (
            <div className="flex justify-between mb-1 px-1">
                {tableTitle && <h3 className="text-lg">{tableTitle}</h3>}
                {buttonConfig && (
                    <Button onClick={buttonConfig.onClick}>{buttonConfig.text}</Button>
                )}
            </div>
        ) : null;

    return (
        <div>
            {header}
            {children}
        </div>
    );
};
