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
exports.Line = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const NotificationDescription_1 = require("./NotificationDescription");
class Line {
    constructor() {
        this.description = {
            displayName: 'Line',
            name: 'line',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:line.png',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Line API',
            defaults: {
                name: 'Line',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'lineNotifyOAuth2Api',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'notification',
                            ],
                        },
                    },
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Notification',
                            value: 'notification',
                        },
                    ],
                    default: 'notification',
                },
                ...NotificationDescription_1.notificationOperations,
                ...NotificationDescription_1.notificationFields,
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const length = items.length;
            const qs = {};
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'notification') {
                        //https://notify-bot.line.me/doc/en/
                        if (operation === 'send') {
                            const message = this.getNodeParameter('message', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                message,
                            };
                            Object.assign(body, additionalFields);
                            if (body.hasOwnProperty('notificationDisabled')) {
                                body.notificationDisabled = (body.notificationDisabled) ? 'true' : 'false';
                            }
                            if (body.stickerUi) {
                                const sticker = body.stickerUi.stickerValue;
                                if (sticker) {
                                    body.stickerId = sticker.stickerId;
                                    body.stickerPackageId = sticker.stickerPackageId;
                                }
                                delete body.stickerUi;
                            }
                            if (body.imageUi) {
                                const image = body.imageUi.imageValue;
                                if (image && image.binaryData === true) {
                                    if (items[i].binary === undefined) {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                                    }
                                    //@ts-ignore
                                    if (items[i].binary[image.binaryProperty] === undefined) {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${image.binaryProperty}" does not exists on item!`);
                                    }
                                    const binaryData = items[i].binary[image.binaryProperty];
                                    const binaryDataBuffer = yield this.helpers.getBinaryDataBuffer(i, image.binaryProperty);
                                    body.imageFile = {
                                        value: binaryDataBuffer,
                                        options: {
                                            filename: binaryData.fileName,
                                        },
                                    };
                                }
                                else {
                                    body.imageFullsize = image.imageFullsize;
                                    body.imageThumbnail = image.imageThumbnail;
                                }
                                delete body.imageUi;
                            }
                            responseData = yield GenericFunctions_1.lineApiRequest.call(this, 'POST', '', {}, {}, 'https://notify-api.line.me/api/notify', { formData: body });
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
                        returnData.push({ error: error.message });
                        continue;
                    }
                    throw error;
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Line = Line;
