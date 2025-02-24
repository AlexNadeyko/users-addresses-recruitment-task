import { PropsWithChildren } from 'react';
import { DialogProps } from '@radix-ui/react-dialog';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/lib/components/ui/dialog';

export type AppDialogProps = Pick<DialogProps, 'open' | 'onOpenChange'> &
    PropsWithChildren & {
        title?: string;
        buttonText?: string;
    };

export const AppDialog = ({ open, title, children, onOpenChange }: AppDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
};
