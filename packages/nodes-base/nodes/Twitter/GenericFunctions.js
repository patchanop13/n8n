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
exports.uploadAttachments = exports.chunks = exports.twitterApiRequestAllItems = exports.twitterApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function twitterApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let options = {
            method,
            body,
            qs,
            url: uri || `https://api.twitter.com/1.1${resource}`,
            json: true,
        };
        try {
            if (Object.keys(option).length !== 0) {
                options = Object.assign({}, options, option);
            }
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            if (Object.keys(qs).length === 0) {
                delete options.qs;
            }
            //@ts-ignore
            return yield this.helpers.requestOAuth1.call(this, 'twitterOAuth1Api', options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.twitterApiRequest = twitterApiRequest;
function twitterApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.count = 100;
        do {
            responseData = yield twitterApiRequest.call(this, method, endpoint, body, query);
            query.since_id = responseData.search_metadata.max_id;
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData.search_metadata &&
            responseData.search_metadata.next_results);
        return returnData;
    });
}
exports.twitterApiRequestAllItems = twitterApiRequestAllItems;
function chunks(buffer, chunkSize) {
    const result = [];
    const len = buffer.length;
    let i = 0;
    while (i < len) {
        result.push(buffer.slice(i, i += chunkSize));
    }
    return result;
}
exports.chunks = chunks;
function uploadAttachments(binaryProperties, items, i) {
    return __awaiter(this, void 0, void 0, function* () {
        const uploadUri = 'https://upload.twitter.com/1.1/media/upload.json';
        const media = [];
        for (const binaryPropertyName of binaryProperties) {
            const binaryData = items[i].binary;
            if (binaryData === undefined) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data set. So file can not be written!');
            }
            if (!binaryData[binaryPropertyName]) {
                continue;
            }
            let attachmentBody = {};
            let response = {};
            const dataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
            const isAnimatedWebp = (dataBuffer.toString().indexOf('ANMF') !== -1);
            const isImage = binaryData[binaryPropertyName].mimeType.includes('image');
            if (isImage && isAnimatedWebp) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Animated .webp images are not supported use .gif instead');
            }
            if (isImage) {
                const attachmentBody = {
                    media_data: binaryData[binaryPropertyName].data,
                };
                response = yield twitterApiRequest.call(this, 'POST', '', {}, {}, uploadUri, { form: attachmentBody });
                media.push(response);
            }
            else {
                // https://developer.twitter.com/en/docs/media/upload-media/api-reference/post-media-upload-init
                const dataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                attachmentBody = {
                    command: 'INIT',
                    total_bytes: dataBuffer.byteLength,
                    media_type: binaryData[binaryPropertyName].mimeType,
                };
                response = yield twitterApiRequest.call(this, 'POST', '', {}, {}, uploadUri, { form: attachmentBody });
                const mediaId = response.media_id_string;
                // break the data on 5mb chunks (max size that can be uploaded at once)
                const binaryParts = chunks(dataBuffer, 5242880);
                let index = 0;
                for (const binaryPart of binaryParts) {
                    //https://developer.twitter.com/en/docs/media/upload-media/api-reference/post-media-upload-append
                    attachmentBody = {
                        name: binaryData[binaryPropertyName].fileName,
                        command: 'APPEND',
                        media_id: mediaId,
                        media_data: Buffer.from(binaryPart).toString('base64'),
                        segment_index: index,
                    };
                    response = yield twitterApiRequest.call(this, 'POST', '', {}, {}, uploadUri, { form: attachmentBody });
                    index++;
                }
                //https://developer.twitter.com/en/docs/media/upload-media/api-reference/post-media-upload-finalize
                attachmentBody = {
                    command: 'FINALIZE',
                    media_id: mediaId,
                };
                response = yield twitterApiRequest.call(this, 'POST', '', {}, {}, uploadUri, { form: attachmentBody });
                // data has not been uploaded yet, so wait for it to be ready
                if (response.processing_info) {
                    const { check_after_secs } = response.processing_info;
                    yield new Promise((resolve, reject) => {
                        setTimeout(() => {
                            // @ts-ignore
                            resolve();
                        }, check_after_secs * 1000);
                    });
                }
                media.push(response);
            }
            return media;
        }
    });
}
exports.uploadAttachments = uploadAttachments;
