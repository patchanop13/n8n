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
exports.transformBinReponse = exports.buildRequestURL = exports.buildBinTestURL = exports.buildBinAPIURL = void 0;
const n8n_workflow_1 = require("n8n-workflow");
// Regular expressions used to extract binId from parameter value
const BIN_ID_REGEX = /\b\d{13}-\d{13}\b/g;
/**
 * Creates correctly-formatted PostBin API URL based on the entered binId.
 * This function makes sure binId is in the expected format by parsing it
 * from current node parameter value.
 *
 * @export
 * @param {IExecuteSingleFunctions} this
 * @param {IHttpRequestOptions} requestOptions
 * @returns {Promise<IHttpRequestOptions>} requestOptions
 */
function buildBinAPIURL(requestOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const binId = parseBinId(this);
        // Assemble the PostBin API URL and put it back to requestOptions
        requestOptions.url = `/developers/postbin/api/bin/${binId}`;
        return requestOptions;
    });
}
exports.buildBinAPIURL = buildBinAPIURL;
/**
 * Creates correctly-formatted PostBin Bin test URL based on the entered binId.
 * This function makes sure binId is in the expected format by parsing it
 * from current node parameter value.
 *
 * @export
 * @param {IExecuteSingleFunctions} this
 * @param {IHttpRequestOptions} requestOptions
 * @returns {Promise<IHttpRequestOptions>} requestOptions
 */
function buildBinTestURL(requestOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const binId = parseBinId(this);
        // Assemble the PostBin API URL and put it back to requestOptions
        requestOptions.url = `/developers/postbin/${binId}`;
        return requestOptions;
    });
}
exports.buildBinTestURL = buildBinTestURL;
/**
 * Creates correctly-formatted PostBin API URL based on the entered binId and reqId.
 * This function makes sure binId is in the expected format by parsing it
 * from current node parameter value.
 *
 * @export
 * @param {IExecuteSingleFunctions} this
 * @param {IHttpRequestOptions} requestOptions
 * @returns {Promise<IHttpRequestOptions>} requestOptions
 */
function buildRequestURL(requestOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqId = this.getNodeParameter('requestId', 'shift');
        const binId = parseBinId(this);
        requestOptions.url = `/developers/postbin/api/bin/${binId}/req/${reqId}`;
        return requestOptions;
    });
}
exports.buildRequestURL = buildRequestURL;
/**
 * Extracts the PostBin Bin Id from the specified string.
 * This method should be able to extract bin Id from the
 * PostBin URL or from the string in the following format:
 * `Bin '<binId>'.`
 *
 * @param {IExecuteSingleFunctions} this
 * @param {IHttpRequestOptions} requestOptions
 * @returns {Promise<IHttpRequestOptions>} requestOptions
 */
function parseBinId(context) {
    const binId = context.getNodeParameter('binId');
    // Test if the Bin id is in the expected format
    BIN_ID_REGEX.lastIndex = 0;
    const idMatch = BIN_ID_REGEX.exec(binId);
    // Return what is matched
    if (idMatch) {
        return idMatch[0];
    }
    // If it's not recognized, error out
    throw new n8n_workflow_1.NodeApiError(context.getNode(), {}, {
        message: 'Bin ID format is not valid',
        description: 'Please check the provided Bin ID and try again.',
        parseXml: false,
    });
}
/**
 * Converts the bin response data and adds additional properties
 *
 * @param {IExecuteSingleFunctions} this
 * @param {INodeExecutionData} items[]
 * @param {IN8nHttpFullResponse} response
 * @returns {Promise<INodeExecutionData[]>}
 */
function transformBinReponse(items, response) {
    return __awaiter(this, void 0, void 0, function* () {
        items.forEach(item => item.json = {
            'binId': item.json.binId,
            'nowTimestamp': item.json.now,
            'nowIso': new Date(item.json.now).toISOString(),
            'expiresTimestamp': item.json.expires,
            'expiresIso': new Date(item.json.expires).toISOString(),
            'requestUrl': 'https://www.toptal.com/developers/postbin/' + item.json.binId,
            'viewUrl': 'https://www.toptal.com/developers/postbin/b/' + item.json.binId,
        });
        return items;
    });
}
exports.transformBinReponse = transformBinReponse;
