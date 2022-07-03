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
exports.createTicket = void 0;
const transport_1 = require("../../../transport");
function createTicket(index) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = this.getNodeParameter('customerId', index);
        const subject = this.getNodeParameter('subject', index);
        const { assetId, dueDate, issueType, status, contactId } = this.getNodeParameter('additionalFields', index);
        const qs = {};
        const requestMethod = 'POST';
        const endpoint = 'tickets';
        let body = {};
        body = {
            asset_id: assetId,
            //due_date: dueDate,
            problem_type: issueType,
            status,
            contact_id: contactId,
        };
        body.customer_id = id;
        body.subject = subject;
        let responseData;
        responseData = yield transport_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
        return this.helpers.returnJsonArray(responseData.ticket);
    });
}
exports.createTicket = createTicket;
