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
exports.updateCustomer = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const transport_1 = require("../../../transport");
function updateCustomer(index) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = this.getNodeParameter('customerId', index);
        const { address, businessName, email, firstName, getSms, invoiceCcEmails, lastName, noEmail, notes, notificationEmail, phone, referredBy } = this.getNodeParameter('updateFields', index);
        const qs = {};
        const requestMethod = 'PUT';
        const endpoint = `customers/${id}`;
        let body = {};
        let addressData = address;
        if (addressData) {
            addressData = addressData['addressFields'];
            addressData.address_2 = addressData.address2;
        }
        body = Object.assign(Object.assign({}, addressData), { business_name: businessName, email, firstname: firstName, get_sms: getSms, invoice_cc_emails: (invoiceCcEmails || []).join(','), lastname: lastName, no_email: noEmail, notes, notification_email: notificationEmail, phone, referred_by: referredBy });
        let responseData;
        responseData = yield transport_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
        if (!responseData.customer) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), responseData, { httpCode: '404', message: 'Customer ID not found' });
        }
        return this.helpers.returnJsonArray(responseData.customer);
    });
}
exports.updateCustomer = updateCustomer;
