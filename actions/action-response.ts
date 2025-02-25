export enum ActionResponseStatus {
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}

export type ActionResponse<DataType, ErrorType> = {
    status: ActionResponseStatus;
    data?: DataType;
    error?: ErrorType;
};
