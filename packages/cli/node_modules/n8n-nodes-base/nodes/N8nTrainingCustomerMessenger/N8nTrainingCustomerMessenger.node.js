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
exports.N8nTrainingCustomerMessenger = void 0;
class N8nTrainingCustomerMessenger {
    constructor() {
        this.description = {
            displayName: 'Customer Messenger (n8n training)',
            name: 'n8nTrainingCustomerMessenger',
            icon: 'file:n8nTrainingCustomerMessenger.svg',
            group: ['transform'],
            version: 1,
            description: 'Dummy node used for n8n training',
            defaults: {
                name: 'Customer Messenger',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Customer ID',
                    name: 'customerId',
                    type: 'string',
                    required: true,
                    default: '',
                },
                {
                    displayName: 'Message',
                    name: 'message',
                    type: 'string',
                    required: true,
                    typeOptions: {
                        rows: 4,
                    },
                    default: '',
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
            for (let i = 0; i < length; i++) {
                const customerId = this.getNodeParameter('customerId', i);
                const message = this.getNodeParameter('message', i);
                responseData = { output: `Sent message to customer ${customerId}:  ${message}` };
                returnData.push(responseData);
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.N8nTrainingCustomerMessenger = N8nTrainingCustomerMessenger;
