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
exports.Mailcheck = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class Mailcheck {
    constructor() {
        this.description = {
            displayName: 'Mailcheck',
            name: 'mailcheck',
            icon: 'file:mailcheck.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Mailcheck API',
            defaults: {
                name: 'Mailcheck',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'mailcheckApi',
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
                            name: 'Email',
                            value: 'email',
                        },
                    ],
                    default: 'email',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'email',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Check',
                            value: 'check',
                        },
                    ],
                    default: 'check',
                },
                {
                    displayName: 'Email',
                    name: 'email',
                    type: 'string',
                    placeholder: 'name@email.com',
                    displayOptions: {
                        show: {
                            resource: [
                                'email',
                            ],
                            operation: [
                                'check',
                            ],
                        },
                    },
                    default: '',
                    description: 'Email address to check',
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const length = items.length;
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'email') {
                        if (operation === 'check') {
                            const email = this.getNodeParameter('email', i);
                            responseData = yield GenericFunctions_1.mailCheckApiRequest.call(this, 'POST', '/singleEmail:check', { email });
                        }
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ error: error.message });
                        continue;
                    }
                    throw error;
                }
                if (Array.isArray(responseData)) {
                    returnData.push.apply(returnData, responseData);
                }
                else {
                    returnData.push(responseData);
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Mailcheck = Mailcheck;
