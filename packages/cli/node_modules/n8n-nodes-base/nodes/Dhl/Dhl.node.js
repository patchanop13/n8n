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
exports.Dhl = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class Dhl {
    constructor() {
        this.description = {
            displayName: 'DHL',
            name: 'dhl',
            icon: 'file:dhl.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume DHL API',
            defaults: {
                name: 'DHL',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'dhlApi',
                    required: true,
                    testedBy: 'dhlApiCredentialTest',
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    noDataExpression: true,
                    type: 'hidden',
                    options: [
                        {
                            name: 'Shipment',
                            value: 'shipment',
                        },
                    ],
                    default: 'shipment',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'shipment',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get Tracking Details',
                            value: 'get',
                        },
                    ],
                    default: 'get',
                },
                {
                    displayName: 'Tracking Number',
                    name: 'trackingNumber',
                    type: 'string',
                    required: true,
                    default: '',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: `Recipient's Postal Code`,
                            name: 'recipientPostalCode',
                            type: 'string',
                            default: '',
                            description: 'DHL will return more detailed information on the shipment when you provide the Recipient\'s Postal Code - it acts as a verification step',
                        },
                    ],
                },
            ],
        };
        this.methods = {
            credentialTest: {
                dhlApiCredentialTest(credential) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield GenericFunctions_1.validateCredentials.call(this, credential.data);
                        }
                        catch (error) {
                            if (error.statusCode === 401) {
                                return {
                                    status: 'Error',
                                    message: 'The API Key included in the request is invalid',
                                };
                            }
                        }
                        return {
                            status: 'OK',
                            message: 'Connection successful!',
                        };
                    });
                },
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            let qs = {};
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'shipment') {
                        if (operation === 'get') {
                            const trackingNumber = this.getNodeParameter('trackingNumber', i);
                            const options = this.getNodeParameter('options', i);
                            qs = {
                                trackingNumber,
                            };
                            Object.assign(qs, options);
                            responseData = yield GenericFunctions_1.dhlApiRequest.call(this, 'GET', `/track/shipments`, {}, qs);
                            returnData.push(...responseData.shipments);
                        }
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ error: error.description });
                        continue;
                    }
                    throw error;
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Dhl = Dhl;
