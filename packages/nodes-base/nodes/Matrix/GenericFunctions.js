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
exports.handleMatrixCall = exports.matrixApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const uuid_1 = require("uuid");
function matrixApiRequest(method, resource, body = {}, query = {}, headers = undefined, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let options = {
            method,
            headers: headers || {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body,
            qs: query,
            uri: '',
            json: true,
        };
        options = Object.assign({}, options, option);
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        if (Object.keys(query).length === 0) {
            delete options.qs;
        }
        try {
            let response; // tslint:disable-line:no-any
            const credentials = yield this.getCredentials('matrixApi');
            //@ts-ignore
            options.uri = `${credentials.homeserverUrl}/_matrix/${option.overridePrefix || 'client'}/r0${resource}`;
            options.headers.Authorization = `Bearer ${credentials.accessToken}`;
            //@ts-ignore
            response = yield this.helpers.request(options);
            // When working with images, the request cannot be JSON (it's raw binary data)
            // But the output is JSON so we have to parse it manually.
            //@ts-ignore
            return options.overridePrefix === 'media' ? JSON.parse(response) : response;
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.matrixApiRequest = matrixApiRequest;
function handleMatrixCall(item, index, resource, operation) {
    return __awaiter(this, void 0, void 0, function* () {
        if (resource === 'account') {
            if (operation === 'me') {
                return yield matrixApiRequest.call(this, 'GET', '/account/whoami');
            }
        }
        else if (resource === 'room') {
            if (operation === 'create') {
                const name = this.getNodeParameter('roomName', index);
                const preset = this.getNodeParameter('preset', index);
                const roomAlias = this.getNodeParameter('roomAlias', index);
                const body = {
                    name,
                    preset,
                };
                if (roomAlias) {
                    body.room_alias_name = roomAlias;
                }
                return yield matrixApiRequest.call(this, 'POST', `/createRoom`, body);
            }
            else if (operation === 'join') {
                const roomIdOrAlias = this.getNodeParameter('roomIdOrAlias', index);
                return yield matrixApiRequest.call(this, 'POST', `/rooms/${roomIdOrAlias}/join`);
            }
            else if (operation === 'leave') {
                const roomId = this.getNodeParameter('roomId', index);
                return yield matrixApiRequest.call(this, 'POST', `/rooms/${roomId}/leave`);
            }
            else if (operation === 'invite') {
                const roomId = this.getNodeParameter('roomId', index);
                const userId = this.getNodeParameter('userId', index);
                const body = {
                    user_id: userId,
                };
                return yield matrixApiRequest.call(this, 'POST', `/rooms/${roomId}/invite`, body);
            }
            else if (operation === 'kick') {
                const roomId = this.getNodeParameter('roomId', index);
                const userId = this.getNodeParameter('userId', index);
                const reason = this.getNodeParameter('reason', index);
                const body = {
                    user_id: userId,
                    reason,
                };
                return yield matrixApiRequest.call(this, 'POST', `/rooms/${roomId}/kick`, body);
            }
        }
        else if (resource === 'message') {
            if (operation === 'create') {
                const roomId = this.getNodeParameter('roomId', index);
                const text = this.getNodeParameter('text', index, '');
                const messageType = this.getNodeParameter('messageType', index);
                const messageFormat = this.getNodeParameter('messageFormat', index);
                const body = {
                    msgtype: messageType,
                    body: text,
                };
                if (messageFormat === 'org.matrix.custom.html') {
                    const fallbackText = this.getNodeParameter('fallbackText', index, '');
                    body.format = messageFormat;
                    body.formatted_body = text;
                    body.body = fallbackText;
                }
                const messageId = (0, uuid_1.v4)();
                return yield matrixApiRequest.call(this, 'PUT', `/rooms/${roomId}/send/m.room.message/${messageId}`, body);
            }
            else if (operation === 'getAll') {
                const roomId = this.getNodeParameter('roomId', index);
                const returnAll = this.getNodeParameter('returnAll', index);
                const otherOptions = this.getNodeParameter('otherOptions', index);
                const returnData = [];
                if (returnAll) {
                    let responseData;
                    let from;
                    do {
                        const qs = {
                            dir: 'b',
                            from,
                        };
                        if (otherOptions.filter) {
                            qs.filter = otherOptions.filter;
                        }
                        responseData = yield matrixApiRequest.call(this, 'GET', `/rooms/${roomId}/messages`, {}, qs);
                        returnData.push.apply(returnData, responseData.chunk);
                        from = responseData.end;
                    } while (responseData.chunk.length > 0);
                }
                else {
                    const limit = this.getNodeParameter('limit', index);
                    const qs = {
                        dir: 'b',
                        limit,
                    };
                    if (otherOptions.filter) {
                        qs.filter = otherOptions.filter;
                    }
                    const responseData = yield matrixApiRequest.call(this, 'GET', `/rooms/${roomId}/messages`, {}, qs);
                    returnData.push.apply(returnData, responseData.chunk);
                }
                return returnData;
            }
        }
        else if (resource === 'event') {
            if (operation === 'get') {
                const roomId = this.getNodeParameter('roomId', index);
                const eventId = this.getNodeParameter('eventId', index);
                return yield matrixApiRequest.call(this, 'GET', `/rooms/${roomId}/event/${eventId}`);
            }
        }
        else if (resource === 'media') {
            if (operation === 'upload') {
                const roomId = this.getNodeParameter('roomId', index);
                const mediaType = this.getNodeParameter('mediaType', index);
                const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index);
                let body;
                const qs = {};
                const headers = {};
                let filename;
                if (item.binary === undefined
                    //@ts-ignore
                    || item.binary[binaryPropertyName] === undefined) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${binaryPropertyName}" does not exists on item!`);
                }
                // @ts-ignore
                qs.filename = item.binary[binaryPropertyName].fileName;
                //@ts-ignore
                filename = item.binary[binaryPropertyName].fileName;
                body = yield this.helpers.getBinaryDataBuffer(index, binaryPropertyName);
                //@ts-ignore
                headers['Content-Type'] = item.binary[binaryPropertyName].mimeType;
                headers['accept'] = 'application/json,text/*;q=0.99';
                const uploadRequestResult = yield matrixApiRequest.call(this, 'POST', `/upload`, body, qs, headers, {
                    overridePrefix: 'media',
                    json: false,
                });
                body = {
                    msgtype: `m.${mediaType}`,
                    body: filename,
                    url: uploadRequestResult.content_uri,
                };
                const messageId = (0, uuid_1.v4)();
                return yield matrixApiRequest.call(this, 'PUT', `/rooms/${roomId}/send/m.room.message/${messageId}`, body);
            }
        }
        else if (resource === 'roomMember') {
            if (operation === 'getAll') {
                const roomId = this.getNodeParameter('roomId', index);
                const filters = this.getNodeParameter('filters', index);
                const qs = {
                    membership: filters.membership ? filters.membership : '',
                    not_membership: filters.notMembership ? filters.notMembership : '',
                };
                const roomMembersResponse = yield matrixApiRequest.call(this, 'GET', `/rooms/${roomId}/members`, {}, qs);
                return roomMembersResponse.chunk;
            }
        }
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Not implemented yet');
    });
}
exports.handleMatrixCall = handleMatrixCall;
