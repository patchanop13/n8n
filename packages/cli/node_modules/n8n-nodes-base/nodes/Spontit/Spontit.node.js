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
exports.Spontit = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const PushDescription_1 = require("./PushDescription");
const moment_1 = __importDefault(require("moment"));
class Spontit {
    constructor() {
        this.description = {
            displayName: 'Spontit',
            name: 'spontit',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:spontit.png',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Spontit API',
            defaults: {
                name: 'Spontit',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'spontitApi',
                    required: true,
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
                            name: 'Push',
                            value: 'push',
                        },
                    ],
                    default: 'push',
                },
                ...PushDescription_1.pushOperations,
                ...PushDescription_1.pushFields,
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const timezone = this.getTimezone();
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'push') {
                        if (operation === 'create') {
                            const content = this.getNodeParameter('content', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                content,
                            };
                            Object.assign(body, additionalFields);
                            if (body.pushToFollowers) {
                                body.pushToFollowers = body.pushToFollowers.split(',');
                            }
                            if (body.pushToPhoneNumbers) {
                                body.pushToPhoneNumbers = body.pushToPhoneNumbers.split(',');
                            }
                            if (body.pushToEmails) {
                                body.pushToEmails = body.pushToEmails.split(',');
                            }
                            if (body.schedule) {
                                body.scheduled = moment_1.default.tz(body.schedule, timezone).unix();
                            }
                            if (body.expirationStamp) {
                                body.expirationStamp = moment_1.default.tz(body.expirationStamp, timezone).unix();
                            }
                            responseData = yield GenericFunctions_1.spontitApiRequest.call(this, 'POST', '/push', body);
                            responseData = responseData.data;
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
exports.Spontit = Spontit;
