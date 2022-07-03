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
exports.eventExists = exports.convertTriggerObjectToStringArray = exports.postmarkApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function postmarkApiRequest(method, endpoint, body = {}, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('postmarkApi');
        let options = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Postmark-Server-Token': credentials.serverToken,
            },
            method,
            body,
            uri: 'https://api.postmarkapp.com' + endpoint,
            json: true,
        };
        if (body === {}) {
            delete options.body;
        }
        options = Object.assign({}, options, option);
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.postmarkApiRequest = postmarkApiRequest;
// tslint:disable-next-line: no-any
function convertTriggerObjectToStringArray(webhookObject) {
    const triggers = webhookObject.Triggers;
    const webhookEvents = [];
    // Translate Webhook trigger settings to string array
    if (triggers.Open.Enabled) {
        webhookEvents.push('open');
    }
    if (triggers.Open.PostFirstOpenOnly) {
        webhookEvents.push('firstOpen');
    }
    if (triggers.Click.Enabled) {
        webhookEvents.push('click');
    }
    if (triggers.Delivery.Enabled) {
        webhookEvents.push('delivery');
    }
    if (triggers.Bounce.Enabled) {
        webhookEvents.push('bounce');
    }
    if (triggers.Bounce.IncludeContent) {
        webhookEvents.push('includeContent');
    }
    if (triggers.SpamComplaint.Enabled) {
        webhookEvents.push('spamComplaint');
    }
    if (triggers.SpamComplaint.IncludeContent) {
        if (!webhookEvents.includes('IncludeContent')) {
            webhookEvents.push('includeContent');
        }
    }
    if (triggers.SubscriptionChange.Enabled) {
        webhookEvents.push('subscriptionChange');
    }
    return webhookEvents;
}
exports.convertTriggerObjectToStringArray = convertTriggerObjectToStringArray;
function eventExists(currentEvents, webhookEvents) {
    for (const currentEvent of currentEvents) {
        if (!webhookEvents.includes(currentEvent)) {
            return false;
        }
    }
    return true;
}
exports.eventExists = eventExists;
