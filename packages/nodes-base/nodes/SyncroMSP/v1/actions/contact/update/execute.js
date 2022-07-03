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
exports.updateContact = void 0;
const transport_1 = require("../../../transport");
function updateContact(index) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = this.getNodeParameter('contactId', index);
        const { address, customerId, email, name, notes, phone } = this.getNodeParameter('updateFields', index);
        const qs = {};
        const requestMethod = 'PUT';
        const endpoint = `contacts/${id}`;
        let body = {};
        let addressData = address;
        if (addressData) {
            addressData = addressData['addressFields'];
            addressData.address1 = addressData.address;
        }
        body = Object.assign(Object.assign({}, addressData), { contact_id: id, customer_id: customerId, email,
            name,
            notes,
            phone });
        let responseData;
        responseData = yield transport_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
        return this.helpers.returnJsonArray(responseData);
    });
}
exports.updateContact = updateContact;
