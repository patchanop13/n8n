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
exports.Peekalink = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class Peekalink {
    constructor() {
        this.description = {
            displayName: 'Peekalink',
            name: 'peekalink',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:peekalink.png',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"]',
            description: 'Consume the Peekalink API',
            defaults: {
                name: 'Peekalink',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'peekalinkApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Is Available',
                            value: 'isAvailable',
                            description: 'Check whether preview for a given link is available',
                        },
                        {
                            name: 'Preview',
                            value: 'preview',
                            description: 'Return the preview for a link',
                        },
                    ],
                    default: 'preview',
                },
                {
                    displayName: 'URL',
                    name: 'url',
                    type: 'string',
                    default: '',
                    required: true,
                },
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
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (operation === 'isAvailable') {
                        const url = this.getNodeParameter('url', i);
                        const body = {
                            link: url,
                        };
                        responseData = yield GenericFunctions_1.peekalinkApiRequest.call(this, 'POST', `/is-available/`, body);
                    }
                    if (operation === 'preview') {
                        const url = this.getNodeParameter('url', i);
                        const body = {
                            link: url,
                        };
                        responseData = yield GenericFunctions_1.peekalinkApiRequest.call(this, 'POST', `/`, body);
                    }
                    if (Array.isArray(responseData)) {
                        returnData.push.apply(returnData, responseData);
                    }
                    else {
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
exports.Peekalink = Peekalink;
