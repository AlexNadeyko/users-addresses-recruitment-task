import { useState } from 'react';

export enum ActionType {
    DELETE = 'DELETE',
    UPDATE = 'UPDATE',
}

export const useTableActions = <ActionData>() => {
    const [actionData, setActionData] = useState<{ data: ActionData; type: ActionType } | null>(
        null,
    );

    const resetActionData = () => setActionData(null);

    return {
        actionData,
        setActionData,
        resetActionData,
    };
};
