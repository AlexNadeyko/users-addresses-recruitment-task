import { AlertDialogProps } from '@radix-ui/react-alert-dialog';

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/lib/components/ui/alert-dialog';
import { ActionButton, ActionButtonProps } from '@/lib/components/shared/action-button';

type AppAlertDialogProps = Pick<AlertDialogProps, 'open'> &
    Pick<ActionButtonProps, 'isSubmitting'> & {
        onCancelClick?: () => void;
        onContinueClick?: () => void;
        description?: string;
    };

export const AppAlertDialog = ({
    open,
    description,
    isSubmitting,
    onContinueClick,
    onCancelClick,
}: AppAlertDialogProps) => {
    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancelClick}>Cancel</AlertDialogCancel>
                    <ActionButton
                        isSubmitting={isSubmitting}
                        className={'bg-red-600'}
                        onClick={onContinueClick}
                    >
                        Continue
                    </ActionButton>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
