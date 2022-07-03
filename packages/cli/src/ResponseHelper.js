"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unflattenExecutionData = exports.flattenExecutionData = exports.send = exports.sendErrorResponse = exports.sendSuccessResponse = exports.jwtAuthAuthorizationError = exports.basicAuthAuthorizationError = exports.ResponseError = void 0;
const flatted_1 = require("flatted");
/**
 * Special Error which allows to return also an error code and http status code
 *
 * @export
 * @class ResponseError
 * @extends {Error}
 */
class ResponseError extends Error {
    /**
     * Creates an instance of ResponseError.
     * @param {string} message The error message
     * @param {number} [errorCode] The error code which can be used by frontend to identify the actual error
     * @param {number} [httpStatusCode] The HTTP status code the response should have
     * @param {string} [hint] The error hint to provide a context (webhook related)
     * @memberof ResponseError
     */
    constructor(message, errorCode, httpStatusCode, hint) {
        super(message);
        this.name = 'ResponseError';
        if (errorCode) {
            this.errorCode = errorCode;
        }
        if (httpStatusCode) {
            this.httpStatusCode = httpStatusCode;
        }
        if (hint) {
            this.hint = hint;
        }
    }
}
exports.ResponseError = ResponseError;
function basicAuthAuthorizationError(resp, realm, message) {
    resp.statusCode = 401;
    resp.setHeader('WWW-Authenticate', `Basic realm="${realm}"`);
    resp.json({ code: resp.statusCode, message });
}
exports.basicAuthAuthorizationError = basicAuthAuthorizationError;
function jwtAuthAuthorizationError(resp, message) {
    resp.statusCode = 403;
    resp.json({ code: resp.statusCode, message });
}
exports.jwtAuthAuthorizationError = jwtAuthAuthorizationError;
function sendSuccessResponse(res, data, raw, responseCode, responseHeader) {
    if (responseCode !== undefined) {
        res.status(responseCode);
    }
    if (responseHeader) {
        res.header(responseHeader);
    }
    if (raw === true) {
        if (typeof data === 'string') {
            res.send(data);
        }
        else {
            res.json(data);
        }
    }
    else {
        res.json({
            data,
        });
    }
}
exports.sendSuccessResponse = sendSuccessResponse;
function sendErrorResponse(res, error) {
    let httpStatusCode = 500;
    if (error.httpStatusCode) {
        httpStatusCode = error.httpStatusCode;
    }
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        console.error('ERROR RESPONSE');
        console.error(error);
    }
    const response = {
        code: 0,
        message: 'Unknown error',
        hint: '',
    };
    if (error.name === 'NodeApiError') {
        Object.assign(response, error);
    }
    if (error.errorCode) {
        response.code = error.errorCode;
    }
    if (error.message) {
        response.message = error.message;
    }
    if (error.hint) {
        response.hint = error.hint;
    }
    if (error.stack && process.env.NODE_ENV !== 'production') {
        // @ts-ignore
        response.stack = error.stack;
    }
    res.status(httpStatusCode).json(response);
}
exports.sendErrorResponse = sendErrorResponse;
const isUniqueConstraintError = (error) => ['unique', 'duplicate'].some((s) => error.message.toLowerCase().includes(s));
/**
 * A helper function which does not just allow to return Promises it also makes sure that
 * all the responses have the same format
 *
 *
 * @export
 * @param {(req: Request, res: Response) => Promise<any>} processFunction The actual function to process the request
 * @returns
 */
function send(processFunction, raw = false) {
    // eslint-disable-next-line consistent-return
    return (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield processFunction(req, res);
            sendSuccessResponse(res, data, raw);
        }
        catch (error) {
            if (error instanceof Error && isUniqueConstraintError(error)) {
                error.message = 'There is already an entry with this name';
            }
            sendErrorResponse(res, error);
        }
    });
}
exports.send = send;
/**
 * Flattens the Execution data.
 * As it contains a lot of references which normally would be saved as duplicate data
 * with regular JSON.stringify it gets flattened which keeps the references in place.
 *
 * @export
 * @param {IExecutionDb} fullExecutionData The data to flatten
 * @returns {IExecutionFlatted}
 */
function flattenExecutionData(fullExecutionData) {
    // Flatten the data
    const returnData = {
        data: (0, flatted_1.stringify)(fullExecutionData.data),
        mode: fullExecutionData.mode,
        // @ts-ignore
        waitTill: fullExecutionData.waitTill,
        startedAt: fullExecutionData.startedAt,
        stoppedAt: fullExecutionData.stoppedAt,
        finished: fullExecutionData.finished ? fullExecutionData.finished : false,
        workflowId: fullExecutionData.workflowId,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        workflowData: fullExecutionData.workflowData,
    };
    if (fullExecutionData.id !== undefined) {
        returnData.id = fullExecutionData.id.toString();
    }
    if (fullExecutionData.retryOf !== undefined) {
        returnData.retryOf = fullExecutionData.retryOf.toString();
    }
    if (fullExecutionData.retrySuccessId !== undefined) {
        returnData.retrySuccessId = fullExecutionData.retrySuccessId.toString();
    }
    return returnData;
}
exports.flattenExecutionData = flattenExecutionData;
/**
 * Unflattens the Execution data.
 *
 * @export
 * @param {IExecutionFlattedDb} fullExecutionData The data to unflatten
 * @returns {IExecutionResponse}
 */
function unflattenExecutionData(fullExecutionData) {
    const returnData = {
        id: fullExecutionData.id.toString(),
        workflowData: fullExecutionData.workflowData,
        data: (0, flatted_1.parse)(fullExecutionData.data),
        mode: fullExecutionData.mode,
        waitTill: fullExecutionData.waitTill ? fullExecutionData.waitTill : undefined,
        startedAt: fullExecutionData.startedAt,
        stoppedAt: fullExecutionData.stoppedAt,
        finished: fullExecutionData.finished ? fullExecutionData.finished : false,
        workflowId: fullExecutionData.workflowId,
    };
    return returnData;
}
exports.unflattenExecutionData = unflattenExecutionData;
