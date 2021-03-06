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
exports.campaignFieldsMetadata = exports.validateJSON = exports.mailchimpApiRequestAllItems = exports.mailchimpApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function mailchimpApiRequest(endpoint, method, body = {}, qs = {}, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationMethod = this.getNodeParameter('authentication', 0);
        const host = 'api.mailchimp.com/3.0';
        const options = {
            headers: {
                'Accept': 'application/json',
            },
            method,
            qs,
            body,
            url: ``,
            json: true,
        };
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        try {
            if (authenticationMethod === 'apiKey') {
                const credentials = yield this.getCredentials('mailchimpApi');
                options.headers = Object.assign({}, headers, { Authorization: `apikey ${credentials.apiKey}` });
                if (!credentials.apiKey.includes('-')) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'The API key is not valid!');
                }
                const datacenter = credentials.apiKey.split('-').pop();
                options.url = `https://${datacenter}.${host}${endpoint}`;
                return yield this.helpers.request(options);
            }
            else {
                const credentials = yield this.getCredentials('mailchimpOAuth2Api');
                const { api_endpoint } = yield getMetadata.call(this, credentials.oauthTokenData);
                options.url = `${api_endpoint}/3.0${endpoint}`;
                //@ts-ignore
                return yield this.helpers.requestOAuth2.call(this, 'mailchimpOAuth2Api', options, { tokenType: 'Bearer' });
            }
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.mailchimpApiRequest = mailchimpApiRequest;
function mailchimpApiRequestAllItems(endpoint, method, propertyName, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.offset = 0;
        query.count = 500;
        do {
            responseData = yield mailchimpApiRequest.call(this, endpoint, method, body, query);
            returnData.push.apply(returnData, responseData[propertyName]);
            query.offset += query.count;
        } while (responseData[propertyName] && responseData[propertyName].length !== 0);
        return returnData;
    });
}
exports.mailchimpApiRequestAllItems = mailchimpApiRequestAllItems;
function validateJSON(json) {
    let result;
    try {
        result = JSON.parse(json);
    }
    catch (exception) {
        result = '';
    }
    return result;
}
exports.validateJSON = validateJSON;
function getMetadata(oauthTokenData) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('mailchimpOAuth2Api');
        const options = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `OAuth ${oauthTokenData.access_token}`,
            },
            method: 'GET',
            url: credentials.metadataUrl,
            json: true,
        };
        return this.helpers.request(options);
    });
}
exports.campaignFieldsMetadata = [
    '*',
    'campaigns.id',
    'campaigns.web_id',
    'campaigns.type',
    'campaigns.create_time',
    'campaigns.archive_url',
    'campaigns.long_archive_url',
    'campaigns.status',
    'campaigns.emails_sent',
    'campaigns.send_time',
    'campaigns.content_type',
    'campaigns.needs_block_refresh',
    'campaigns.resendable',
    'campaigns.recipients',
    'campaigns.recipients.list_id',
    'campaigns.recipients.list_is_active',
    'campaigns.recipients.list_name',
    'campaigns.recipients.segment_text',
    'campaigns.recipients.recipient_count',
    'campaigns.settings',
    'campaigns.settings.subject_line',
    'campaigns.settings.preview_text',
    'campaigns.settings.title',
    'campaigns.settings.from_name',
    'campaigns.settings.reply_to',
    'campaigns.settings.use_conversation',
    'campaigns.settings.to_name',
    'campaigns.settings.folder_id',
    'campaigns.settings.authenticate',
    'campaigns.settings.auto_footer',
    'campaigns.settings.inline_css',
    'campaigns.settings.auto_tweet',
    'campaigns.settings.fb_comments',
    'campaigns.settings.timewarp',
    'campaigns.settings.template_id',
    'campaigns.settings.drag_and_drop',
    'campaigns.tracking',
    'campaigns.tracking.opens',
    'campaigns.tracking.html_clicks',
    'campaigns.tracking.text_clicks',
    'campaigns.tracking.goal_tracking',
    'campaigns.tracking.ecomm360',
    'campaigns.tracking.google_analytics',
    'campaigns.tracking.clicktale',
    'campaigns.report_summary',
    'campaigns.report_summary.opens',
    'campaigns.report_summary.unique_opens',
    'campaigns.report_summary.open_rate',
    'campaigns.report_summary.clicks',
    'campaigns.report_summary.subscriber_clicks',
    'campaigns.report_summary.click_rate',
    'campaigns.report_summary.click_rate.ecommerce',
    'campaigns.report_summary.click_rate.ecommerce.total_orders',
    'campaigns.report_summary.click_rate.ecommerce.total_spent',
    'campaigns.report_summary.click_rate.ecommerce.total_revenue',
    'campaigns.report_summary.delivery_status.enabled',
    'campaigns._links',
];
