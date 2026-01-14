import {ResultStatus} from "./resultCode";
import {HttpStatuses} from "../types/http-statuses";


export const resultCodeToHttpException = (resultCode: ResultStatus): number => {
    switch (resultCode) {
        case ResultStatus.BadRequest:
            return HttpStatuses.BadRequest;
        case ResultStatus.Forbidden:
            return HttpStatuses.Forbidden;
        case ResultStatus.Unauthorized:
            return HttpStatuses.Unauthorized
        default:
            return HttpStatuses.InternalServerError;
    }
};
