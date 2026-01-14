import {ResultStatus} from "./resultCode";
import {HttpStatuses} from "../types/http-statuses";


export const resultCodeToHttpException = (resultCode: ResultStatus): number => {
    switch (resultCode) {
        case ResultStatus.NotFound:
            return HttpStatuses.NotFound
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
// if (result.status !== ResultStatus.Success) {
//     return res.status(resultCodeToHttpException(result.status)).send(result.extensions);
// }