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
exports.throwOnEmptyFilter = exports.throwOnEmptyUpdate = exports.adjustAccounts = exports.adjustAttendees = exports.loadResource = exports.handleListing = exports.freshworksCrmApiRequestAllItems = exports.getAllItemsViewId = exports.freshworksCrmApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const lodash_1 = require("lodash");
function freshworksCrmApiRequest(method, endpoint, body = {}, qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { apiKey, domain } = yield this.getCredentials('freshworksCrmApi');
        const options = {
            headers: {
                Authorization: `Token token=${apiKey}`,
            },
            method,
            body,
            qs,
            uri: `https://${domain}.myfreshworks.com/crm/sales/api${endpoint}`,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.body;
        }
        if (!Object.keys(qs).length) {
            delete options.qs;
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.freshworksCrmApiRequest = freshworksCrmApiRequest;
function getAllItemsViewId({ fromLoadOptions } = { fromLoadOptions: false }) {
    return __awaiter(this, void 0, void 0, function* () {
        let resource = this.getNodeParameter('resource', 0);
        let keyword = 'All';
        if (resource === 'account' || fromLoadOptions) {
            resource = 'sales_account'; // adjust resource to endpoint
        }
        if (resource === 'deal') {
            keyword = 'My Deals'; // no 'All Deals' available
        }
        const response = yield freshworksCrmApiRequest.call(this, 'GET', `/${resource}s/filters`);
        const view = response.filters.find(v => v.name.includes(keyword));
        if (!view) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Failed to get all items view');
        }
        return view.id.toString();
    });
}
exports.getAllItemsViewId = getAllItemsViewId;
function freshworksCrmApiRequestAllItems(method, endpoint, body = {}, qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let response; // tslint:disable-line: no-any
        qs.page = 1;
        do {
            response = yield freshworksCrmApiRequest.call(this, method, endpoint, body, qs);
            const key = Object.keys(response)[0];
            returnData.push(...response[key]);
            qs.page++;
        } while (response.meta.total_pages && qs.page <= response.meta.total_pages);
        return returnData;
    });
}
exports.freshworksCrmApiRequestAllItems = freshworksCrmApiRequestAllItems;
function handleListing(method, endpoint, body = {}, qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnAll = this.getNodeParameter('returnAll', 0);
        if (returnAll) {
            return yield freshworksCrmApiRequestAllItems.call(this, method, endpoint, body, qs);
        }
        const responseData = yield freshworksCrmApiRequestAllItems.call(this, method, endpoint, body, qs);
        const limit = this.getNodeParameter('limit', 0);
        if (limit)
            return responseData.slice(0, limit);
        return responseData;
    });
}
exports.handleListing = handleListing;
/**
 * Load resources for options, except users.
 *
 * See: https://developers.freshworks.com/crm/api/#admin_configuration
 */
function loadResource(resource) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield freshworksCrmApiRequest.call(this, 'GET', `/selector/${resource}`);
        const key = Object.keys(response)[0];
        return response[key].map(({ name, id }) => ({ name, value: id }));
    });
}
exports.loadResource = loadResource;
function adjustAttendees(attendees) {
    return attendees.map((attendee) => {
        if (attendee.type === 'contact') {
            return {
                attendee_type: 'Contact',
                attendee_id: attendee.contactId.toString(),
            };
        }
        else if (attendee.type === 'user') {
            return {
                attendee_type: 'FdMultitenant::User',
                attendee_id: attendee.userId.toString(),
            };
        }
    });
}
exports.adjustAttendees = adjustAttendees;
// /**
//  * Adjust attendee data from n8n UI to the format expected by Freshworks CRM API.
//  */
// export function adjustAttendees(additionalFields: IDataObject & Attendees) {
// 	if (!additionalFields?.appointment_attendees_attributes) return additionalFields;
// 	return {
// 		...omit(additionalFields, ['appointment_attendees_attributes']),
// 		appointment_attendees_attributes: additionalFields.appointment_attendees_attributes.map(attendeeId => {
// 			return { type: 'user', id: attendeeId };
// 		}),
// 	};
// }
/**
 * Adjust account data from n8n UI to the format expected by Freshworks CRM API.
 */
function adjustAccounts(additionalFields) {
    if (!(additionalFields === null || additionalFields === void 0 ? void 0 : additionalFields.sales_accounts))
        return additionalFields;
    const adjusted = additionalFields.sales_accounts.map(accountId => {
        return { id: accountId, is_primary: false };
    });
    adjusted[0].is_primary = true;
    return Object.assign(Object.assign({}, (0, lodash_1.omit)(additionalFields, ['sales_accounts'])), { sales_accounts: adjusted });
}
exports.adjustAccounts = adjustAccounts;
function throwOnEmptyUpdate(resource) {
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}.`);
}
exports.throwOnEmptyUpdate = throwOnEmptyUpdate;
function throwOnEmptyFilter() {
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please select at least one filter.`);
}
exports.throwOnEmptyFilter = throwOnEmptyFilter;
