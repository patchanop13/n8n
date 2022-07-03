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
exports.cleanData = exports.mindeeApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function mindeeApiRequest(method, path, body = {}, qs = {}, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const resource = this.getNodeParameter('resource', 0);
        let credentials;
        if (resource === 'receipt') {
            credentials = yield this.getCredentials('mindeeReceiptApi');
        }
        else {
            credentials = yield this.getCredentials('mindeeInvoiceApi');
        }
        const options = {
            headers: {
                'X-Inferuser-Token': credentials.apiKey,
            },
            method,
            body,
            qs,
            uri: `https://api.mindee.net/products${path}`,
            json: true,
        };
        try {
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            if (Object.keys(qs).length === 0) {
                delete options.qs;
            }
            if (Object.keys(option).length !== 0) {
                Object.assign(options, option);
            }
            //@ts-ignore
            return yield this.helpers.request.call(this, options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.mindeeApiRequest = mindeeApiRequest;
function cleanData(predictions) {
    const newData = {};
    for (const key of Object.keys(predictions[0])) {
        const data = predictions[0][key];
        if (key === 'taxes' && data.length) {
            newData[key] = {
                amount: data[0].amount,
                rate: data[0].rate,
            };
        }
        else if (key === 'locale') {
            //@ts-ignore
            newData['currency'] = data.currency;
            //@ts-ignore
            newData['locale'] = data.value;
        }
        else {
            //@ts-ignore
            newData[key] = data.value || data.name || data.raw || data.degrees || data.amount || data.iban;
        }
    }
    return newData;
}
exports.cleanData = cleanData;
