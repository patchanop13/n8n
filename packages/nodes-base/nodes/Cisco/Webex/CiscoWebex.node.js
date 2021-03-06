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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CiscoWebex = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const descriptions_1 = require("./descriptions");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class CiscoWebex {
    constructor() {
        this.description = {
            displayName: 'Webex by Cisco',
            name: 'ciscoWebex',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:ciscoWebex.png',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the Cisco Webex API',
            defaults: {
                name: 'Webex',
            },
            credentials: [
                {
                    name: 'ciscoWebexOAuth2Api',
                    required: true,
                },
            ],
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Meeting',
                            value: 'meeting',
                        },
                        // {
                        // 	name: 'Meeeting Transcript',
                        // 	value: 'meetingTranscript',
                        // },
                        {
                            name: 'Message',
                            value: 'message',
                        },
                    ],
                    default: 'message',
                },
                ...descriptions_1.meetingOperations,
                ...descriptions_1.meetingFields,
                // ...meetingTranscriptOperations,
                // ...meetingTranscriptFields,
                ...descriptions_1.messageOperations,
                ...descriptions_1.messageFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getRooms() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const rooms = yield GenericFunctions_1.webexApiRequestAllItems.call(this, 'items', 'GET', '/rooms');
                        for (const room of rooms) {
                            returnData.push({
                                name: room.title,
                                value: room.id,
                            });
                        }
                        return returnData;
                    });
                },
                getSites() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const sites = yield GenericFunctions_1.webexApiRequestAllItems.call(this, 'sites', 'GET', '/meetingPreferences/sites');
                        for (const site of sites) {
                            returnData.push({
                                name: site.siteUrl,
                                value: site.siteUrl,
                            });
                        }
                        return returnData;
                    });
                },
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const timezone = this.getTimezone();
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let responseData;
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'message') {
                        // **********************************************************************
                        //                                message
                        // **********************************************************************
                        if (operation === 'create') {
                            // ----------------------------------------
                            //             message: create
                            // ----------------------------------------
                            // https://developer.webex.com/docs/api/v1/messages/create-a-message
                            const destination = this.getNodeParameter('destination', i);
                            const file = this.getNodeParameter('additionalFields.fileUi.fileValue', i, {});
                            const markdown = this.getNodeParameter('additionalFields.markdown', i, '');
                            const body = {};
                            if (destination === 'room') {
                                body['roomId'] = this.getNodeParameter('roomId', i);
                            }
                            if (destination === 'person') {
                                const specifyPersonBy = this.getNodeParameter('specifyPersonBy', 0);
                                if (specifyPersonBy === 'id') {
                                    body['toPersonId'] = this.getNodeParameter('toPersonId', i);
                                }
                                else {
                                    body['toPersonEmail'] = this.getNodeParameter('toPersonEmail', i);
                                }
                            }
                            if (markdown) {
                                body['markdown'] = markdown;
                            }
                            body['text'] = this.getNodeParameter('text', i);
                            body.attachments = (0, GenericFunctions_1.getAttachemnts)(this.getNodeParameter('additionalFields.attachmentsUi.attachmentValues', i, []));
                            if (Object.keys(file).length) {
                                const isBinaryData = file.fileLocation === 'binaryData' ? true : false;
                                if (isBinaryData) {
                                    if (!items[i].binary) {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                                    }
                                    const binaryPropertyName = file.binaryPropertyName;
                                    const binaryData = items[i].binary[binaryPropertyName];
                                    const binaryDataBuffer = yield this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                                    const formData = {
                                        files: {
                                            value: binaryDataBuffer,
                                            options: {
                                                filename: binaryData.fileName,
                                                contentType: binaryData.mimeType,
                                            },
                                        },
                                    };
                                    Object.assign(body, formData);
                                }
                                else {
                                    const url = file.url;
                                    Object.assign(body, { files: url });
                                }
                            }
                            if (file.fileLocation === 'binaryData') {
                                responseData = yield GenericFunctions_1.webexApiRequest.call(this, 'POST', '/messages', {}, {}, undefined, { formData: body });
                            }
                            else {
                                responseData = yield GenericFunctions_1.webexApiRequest.call(this, 'POST', '/messages', body);
                            }
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //             message: delete
                            // ----------------------------------------
                            // https://developer.webex.com/docs/api/v1/messages/delete-a-message
                            const messageId = this.getNodeParameter('messageId', i);
                            const endpoint = `/messages/${messageId}`;
                            responseData = yield GenericFunctions_1.webexApiRequest.call(this, 'DELETE', endpoint);
                            responseData = { success: true };
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //               message: get
                            // ----------------------------------------
                            // https://developer.webex.com/docs/api/v1/messages/get-message-details
                            const messageId = this.getNodeParameter('messageId', i);
                            const endpoint = `/messages/${messageId}`;
                            responseData = yield GenericFunctions_1.webexApiRequest.call(this, 'GET', endpoint);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //             message: getAll
                            // ----------------------------------------
                            // https://developer.webex.com/docs/api/v1/messages/list-messages
                            const qs = {
                                roomId: this.getNodeParameter('roomId', i),
                            };
                            const filters = this.getNodeParameter('filters', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (Object.keys(filters).length) {
                                Object.assign(qs, filters);
                            }
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.webexApiRequestAllItems.call(this, 'items', 'GET', '/messages', {}, qs);
                            }
                            else {
                                qs.max = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.webexApiRequest.call(this, 'GET', '/messages', {}, qs);
                                responseData = responseData.items;
                            }
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //             message: update
                            // ----------------------------------------
                            // https://developer.webex.com/docs/api/v1/messages/edit-a-message
                            const messageId = this.getNodeParameter('messageId', i);
                            const markdown = this.getNodeParameter('markdown', i);
                            const endpoint = `/messages/${messageId}`;
                            responseData = yield GenericFunctions_1.webexApiRequest.call(this, 'GET', endpoint);
                            const body = {
                                roomId: responseData.roomId,
                            };
                            if (markdown === true) {
                                body['markdown'] = this.getNodeParameter('markdownText', i);
                            }
                            else {
                                body['text'] = this.getNodeParameter('text', i);
                            }
                            responseData = yield GenericFunctions_1.webexApiRequest.call(this, 'PUT', endpoint, body);
                        }
                    }
                    if (resource === 'meeting') {
                        if (operation === 'create') {
                            const title = this.getNodeParameter('title', i);
                            const start = this.getNodeParameter('start', i);
                            const end = this.getNodeParameter('end', i);
                            const invitees = this.getNodeParameter('additionalFields.inviteesUi.inviteeValues', i, []);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = Object.assign({ title, start: moment_timezone_1.default.tz(start, timezone).format(), end: moment_timezone_1.default.tz(end, timezone).format() }, additionalFields);
                            if (body.requireRegistrationInfo) {
                                body['registration'] = body.requireRegistrationInfo
                                    .reduce((obj, value) => Object.assign(obj, { [`${value}`]: true }), {});
                                delete body.requireRegistrationInfo;
                            }
                            if (invitees) {
                                body['invitees'] = invitees;
                                delete body.inviteesUi;
                            }
                            responseData = yield GenericFunctions_1.webexApiRequest.call(this, 'POST', '/meetings', body);
                        }
                        if (operation === 'delete') {
                            const meetingId = this.getNodeParameter('meetingId', i);
                            const options = this.getNodeParameter('options', i);
                            const qs = Object.assign({}, options);
                            responseData = yield GenericFunctions_1.webexApiRequest.call(this, 'DELETE', `/meetings/${meetingId}`, {}, qs);
                            responseData = { success: true };
                        }
                        if (operation === 'get') {
                            const meetingId = this.getNodeParameter('meetingId', i);
                            const options = this.getNodeParameter('options', i);
                            let headers = {};
                            const qs = Object.assign({}, options);
                            if (options.passsword) {
                                headers = {
                                    passsword: options.passsword,
                                };
                            }
                            responseData = yield GenericFunctions_1.webexApiRequest.call(this, 'GET', `/meetings/${meetingId}`, {}, qs, undefined, { headers });
                        }
                        if (operation === 'getAll') {
                            const filters = this.getNodeParameter('filters', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const qs = Object.assign({}, filters);
                            if (qs.from) {
                                qs.from = (0, moment_timezone_1.default)(qs.from).utc(true).format();
                            }
                            if (qs.to) {
                                qs.to = (0, moment_timezone_1.default)(qs.to).utc(true).format();
                            }
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.webexApiRequestAllItems.call(this, 'items', 'GET', '/meetings', {}, qs);
                                returnData.push(...responseData);
                            }
                            else {
                                qs.max = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.webexApiRequest.call(this, 'GET', '/meetings', {}, qs);
                                responseData = responseData.items;
                            }
                        }
                        if (operation === 'update') {
                            const meetingId = this.getNodeParameter('meetingId', i);
                            const invitees = this.getNodeParameter('updateFields.inviteesUi.inviteeValues', i, []);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const { title, password, start, end, } = yield GenericFunctions_1.webexApiRequest.call(this, 'GET', `/meetings/${meetingId}`);
                            const body = Object.assign({}, updateFields);
                            if (body.requireRegistrationInfo) {
                                body['registration'] = body.requireRegistrationInfo
                                    .reduce((obj, value) => Object.assign(obj, { [`${value}`]: true }), {});
                                delete body.requireRegistrationInfo;
                            }
                            if (invitees.length) {
                                body['invitees'] = invitees;
                            }
                            if (body.start) {
                                body.start = moment_timezone_1.default.tz(updateFields.start, timezone).format();
                            }
                            else {
                                body.start = start;
                            }
                            if (body.end) {
                                body.end = moment_timezone_1.default.tz(updateFields.end, timezone).format();
                            }
                            else {
                                body.end = end;
                            }
                            if (!body.title) {
                                body.title = title;
                            }
                            if (!body.password) {
                                body.password = password;
                            }
                            responseData = yield GenericFunctions_1.webexApiRequest.call(this, 'PUT', `/meetings/${meetingId}`, body);
                        }
                    }
                    if (Array.isArray(responseData)) {
                        returnData.push.apply(returnData, responseData);
                    }
                    else if (responseData !== undefined) {
                        returnData.push(responseData);
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ error: error.toString() });
                        continue;
                    }
                    throw error;
                }
            }
            // if (resource === 'meetingTranscript') {
            // 	if (operation === 'download') {
            // 		for (let i = 0; i < items.length; i++) {
            // 			const transcriptId = this.getNodeParameter('transcriptId', i) as string;
            // 			const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
            // 			const meetingId = this.getNodeParameter('meetingId', i) as string;
            // 			const options = this.getNodeParameter('options', i) as IDataObject;
            // 			const qs: IDataObject = {
            // 				meetingId,
            // 				...options,
            // 			};
            // 			const transcription = await webexApiRequest.call(this, 'GET', `/meetingTranscripts/${transcriptId}/download`, {}, qs);
            // 			responseData = {
            // 				json: {},
            // 				binary: {
            // 					[binaryPropertyName]: {
            // 						data: Buffer.from(transcription, BINARY_ENCODING),
            // 						//contentType:
            // 						//FILE
            // 					}
            // 				}
            // 			}
            // 		}
            // 	}
            // 	if (operation === 'getAll') {
            // 		for (let i = 0; i < items.length; i++) {
            // 			try {
            // 				const meetingId = this.getNodeParameter('meetingId', i) as string;
            // 				const filters = this.getNodeParameter('filters', i) as IDataObject;
            // 				const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            // 				const qs: IDataObject = {
            // 					meetingId,
            // 					...filters,
            // 				};
            // 				if (returnAll === true) {
            // 					responseData = await webexApiRequestAllItems.call(this, 'items', 'GET', '/meetingTranscripts', {}, qs);
            // 					returnData.push(...responseData);
            // 				} else {
            // 					qs.max = this.getNodeParameter('limit', i) as number;
            // 					responseData = await webexApiRequest.call(this, 'GET', '/meetingTranscripts', {}, qs);
            // 					returnData.push(...responseData.items);
            // 				}
            // 			} catch (error) {
            // 				if (this.continueOnFail()) {
            // 					returnData.push({
            // 						error: error.message,
            // 					});
            // 				}
            // 			}
            // 		}
            // 	}
            // }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.CiscoWebex = CiscoWebex;
