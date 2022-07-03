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
exports.getEvents = exports.lemlistApiRequestAllItems = exports.lemlistApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const change_case_1 = require("change-case");
/**
 * Make an authenticated API request to Lemlist.
 */
function lemlistApiRequest(method, endpoint, body = {}, qs = {}, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { apiKey } = yield this.getCredentials('lemlistApi');
        const encodedApiKey = Buffer.from(':' + apiKey).toString('base64');
        const options = {
            headers: {
                'user-agent': 'n8n',
                'Authorization': `Basic ${encodedApiKey}`,
            },
            method,
            uri: `https://api.lemlist.com/api${endpoint}`,
            qs,
            body,
            json: true,
        };
        if (!Object.keys(body).length) {
            delete options.body;
        }
        if (!Object.keys(qs).length) {
            delete options.qs;
        }
        if (Object.keys(option)) {
            Object.assign(options, option);
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.lemlistApiRequest = lemlistApiRequest;
/**
 * Make an authenticated API request to Lemlist and return all results.
 */
function lemlistApiRequestAllItems(method, endpoint) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        const qs = {};
        qs.limit = 100;
        qs.offset = 0;
        do {
            responseData = yield lemlistApiRequest.call(this, method, endpoint, {}, qs);
            returnData.push(...responseData);
            qs.offset += qs.limit;
        } while (responseData.length !== 0);
        return returnData;
    });
}
exports.lemlistApiRequestAllItems = lemlistApiRequestAllItems;
function getEvents() {
    const events = [
        '*',
        'emailsBounced',
        'emailsClicked',
        'emailsFailed',
        'emailsInterested',
        'emailsNotInterested',
        'emailsOpened',
        'emailsReplied',
        'emailsSendFailed',
        'emailsSent',
        'emailsUnsubscribed',
    ];
    return events.map((event) => ({ name: (event === '*') ? '*' : (0, change_case_1.capitalCase)(event), value: event }));
}
exports.getEvents = getEvents;
