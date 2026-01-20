import { ResultStatus } from "./resultCode";

type ExtensionType = {
    field: string | null;
    message: string;
};

export type ResultType<T = null> = {
    status: ResultStatus;
    errorMessage?: string;
    extensions: ExtensionType[];
    data: T;
};
