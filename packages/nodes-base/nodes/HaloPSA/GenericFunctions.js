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
exports.validateCredentials = exports.qsSetStatus = exports.simplifyHaloPSAGetOutput = exports.haloPSAApiRequestAllItems = exports.haloPSAApiRequest = exports.getAccessTokens = void 0;
const n8n_workflow_1 = require("n8n-workflow");
// API Requests ---------------------------------------------------------------------
function getAccessTokens() {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('haloPSAApi');
        const options = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            form: {
                client_id: credentials.client_id,
                client_secret: credentials.client_secret,
                grant_type: 'client_credentials',
                scope: credentials.scope,
            },
            uri: getAuthUrl(credentials),
            json: true,
        };
        try {
            const tokens = yield this.helpers.request(options);
            return tokens;
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.getAccessTokens = getAccessTokens;
function haloPSAApiRequest(method, resource, accessToken, body = {}, qs = {}, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const resourceApiUrl = (yield this.getCredentials('haloPSAApi'))
            .resourceApiUrl;
        try {
            let options = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'User-Agent': 'https://n8n.io',
                    Connection: 'keep-alive',
                    Accept: '*/*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Content-Type': 'application/json',
                },
                method,
                qs,
                body,
                uri: `${resourceApiUrl}${resource}`,
                json: true,
            };
            options = Object.assign({}, options, option);
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            const result = yield this.helpers.request(options);
            if (method === 'DELETE' && result.id) {
                return { success: true };
            }
            return result;
        }
        catch (error) {
            const message = error.message;
            if (method === 'DELETE' || 'GET' || ('UPDATE' && message)) {
                let newErrorMessage;
                if (message.includes('400')) {
                    console.log(message);
                    newErrorMessage = JSON.parse(message.split(' - ')[1]);
                    error.message = `For field ID, ${newErrorMessage.id || newErrorMessage['[0].id']}`;
                }
                if (message.includes('403')) {
                    error.message = `You don\'t have permissions to ${method.toLowerCase()} ${resource
                        .split('/')[1]
                        .toLowerCase()}.`;
                }
            }
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.haloPSAApiRequest = haloPSAApiRequest;
// export async function reasignTickets(
// 	this:
// 		| IHookFunctions
// 		| IExecuteFunctions
// 		| IExecuteSingleFunctions
// 		| ILoadOptionsFunctions
// 		| IPollFunctions,
// 	clientId: string,
// 	reasigmentCliendId: string,
// 	accessToken: string,
// ): Promise<any> {
// 	const response = (await haloPSAApiRequest.call(
// 		this,
// 		'GET',
// 		`/tickets`,
// 		accessToken,
// 		{},
// 		{ client_id: reasigmentCliendId },
// 	)) as IDataObject;
// 	const { tickets } = response;
// 	console.log((tickets as IDataObject[]).map(t => t.id));
// 	const body: IDataObject = {
// 		id: clientId,
// 		client_id: reasigmentCliendId,
// 	};
// 	for (const ticket of (tickets as IDataObject[])) {
// 		console.log(ticket.id);
// 		await haloPSAApiRequest.call(this, 'DELETE', `/tickets/${ticket.id}`, accessToken);
// 	}
// }
function haloPSAApiRequestAllItems(propertyName, method, endpoint, accessToken, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.page_size = 100;
        query.page_no = 1;
        query.pageinate = true;
        do {
            responseData = (yield haloPSAApiRequest.call(this, method, endpoint, accessToken, body, query));
            returnData.push.apply(returnData, responseData[propertyName]);
            query.page_no++;
            //@ts-ignore
        } while (returnData.length < responseData.record_count);
        return returnData;
    });
}
exports.haloPSAApiRequestAllItems = haloPSAApiRequestAllItems;
// Utilities ------------------------------------------------------------------------
function getAuthUrl(credentials) {
    return credentials.hostingType === 'on-premise'
        ? `${credentials.appUrl}/auth/token`
        : `${credentials.authUrl}/token?tenant=${credentials.tenant}`;
}
function simplifyHaloPSAGetOutput(response, fieldsList) {
    const output = [];
    for (const item of response) {
        const simplifiedItem = {};
        Object.keys(item).forEach((key) => {
            if (fieldsList.includes(key)) {
                simplifiedItem[key] = item[key];
            }
        });
        output.push(simplifiedItem);
    }
    return output;
}
exports.simplifyHaloPSAGetOutput = simplifyHaloPSAGetOutput;
function qsSetStatus(status) {
    if (!status)
        return {};
    const qs = {};
    if (status === 'all') {
        qs['includeinactive'] = true;
        qs['includeactive'] = true;
    }
    else if (status === 'active') {
        qs['includeinactive'] = false;
        qs['includeactive'] = true;
    }
    else {
        qs['includeinactive'] = true;
        qs['includeactive'] = false;
    }
    return qs;
}
exports.qsSetStatus = qsSetStatus;
// Validation -----------------------------------------------------------------------
function validateCredentials(decryptedCredentials) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = decryptedCredentials;
        const options = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            form: {
                client_id: credentials.client_id,
                client_secret: credentials.client_secret,
                grant_type: 'client_credentials',
                scope: credentials.scope,
            },
            uri: getAuthUrl(credentials),
            json: true,
        };
        return (yield this.helpers.request(options));
    });
}
exports.validateCredentials = validateCredentials;
