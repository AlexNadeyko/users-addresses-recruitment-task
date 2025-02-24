import { Button, ButtonProps } from '@/lib/components/ui/button';

export type ActionButtonProps = Pick<
    ButtonProps,
    'disabled' | 'children' | 'type' | 'className' | 'onClick'
> & {
    isSubmitting?: boolean;
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
