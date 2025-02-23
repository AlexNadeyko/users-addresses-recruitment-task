import { Button } from '@/lib/components/ui/button';

export type ActionButtonProps = {
    isSubmitting?: boolean;
    disabled?: boolean;
    children?: React.ReactNode;
};

export const ActionButton = ({
    isSubmitting,
    disabled,
    children,
    ...restProps
}: ActionButtonProps) => {
    return (
        <Button disabled={disabled || isSubmitting} {...restProps}>
            {isSubmitting ? 'Submitting' : children}
        </Button>
    );
};
