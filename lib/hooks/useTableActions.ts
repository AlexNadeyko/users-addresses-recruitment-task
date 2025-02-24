import { useState } from 'react';

export enum ActionType {
    DELETE = 'DELETE',
    UPDATE = 'UPDATE',
    ADD = 'ADD',
}

export const useTableActions = <TableItem>() => {
    const [currentTableAction, setCurrentTableAction] = useState<ActionType | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedTableItem, setSelectedTableItem] = useState<TableItem | null>(null);

    const cancelTableAction = () => {
        setCurrentTableAction(null);
        setSelectedTableItem(null);
    };

    return {
        currentTableAction,
        selectedTableItem,
        isSubmitting,
        setCurrentTableAction,
        setSelectedTableItem,
        setIsSubmitting,
        cancelTableAction,
        //
        // actionData,
        // setActionData,
        // resetActionData,
    };
};
