import { PropsWithChildren } from 'react';

import { Button } from '@/lib/components/ui/button';

type TableLayoutProps = {
    tableTitle?: string;
    buttonConfig?: { text: string; disabled?: boolean; onClick: () => void };
} & PropsWithChildren;

export const TableLayout = ({ tableTitle, buttonConfig, children }: TableLayoutProps) => {
    const header =
        tableTitle || buttonConfig ? (
            <div className="flex justify-between mb-1 px-1">
                {tableTitle && <h3 className="text-lg font-semibold">{tableTitle}</h3>}
                {buttonConfig && (
                    <Button disabled={buttonConfig.disabled} onClick={buttonConfig.onClick}>
                        {buttonConfig.text}
                    </Button>
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
