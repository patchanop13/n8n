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
exports.updateTicket = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const transport_1 = require("../../../transport");
function updateTicket(index) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = this.getNodeParameter('ticketId', index);
        const { assetId, customerId, dueDate, issueType, status, subject, ticketType, contactId } = this.getNodeParameter('updateFields', index);
        const qs = {};
        const requestMethod = 'PUT';
        const endpoint = `tickets/${id}`;
        let body = {};
        body = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (assetId && { asset_id: assetId })), (customerId && { customer_id: customerId })), (dueDate && { due_date: dueDate })), (issueType && { problem_type: issueType })), (status && { status })), (subject && { subject })), (ticketType && { ticket_type: ticketType })), (contactId && { contact_id: contactId }));
        if (!Object.keys(body).length) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At least one update fields has to be defined');
        }
        let responseData;
        responseData = yield transport_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
        return this.helpers.returnJsonArray(responseData.ticket);
    });
}
exports.updateTicket = updateTicket;
