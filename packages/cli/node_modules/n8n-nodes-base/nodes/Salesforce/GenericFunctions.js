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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValue = exports.getQuery = exports.getDefaultFields = exports.getConditions = exports.sortOptions = exports.salesforceApiRequestAllItems = exports.salesforceApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const n8n_workflow_2 = require("n8n-workflow");
function salesforceApiRequest(method, endpoint, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationMethod = this.getNodeParameter('authentication', 0, 'oAuth2');
        try {
            if (authenticationMethod === 'jwt') {
                // https://help.salesforce.com/articleView?id=remoteaccess_oauth_jwt_flow.htm&type=5
                const credentialsType = 'salesforceJwtApi';
                const credentials = yield this.getCredentials(credentialsType);
                const response = yield getAccessToken.call(this, credentials);
                const { instance_url, access_token } = response;
                const options = getOptions.call(this, method, (uri || endpoint), body, qs, instance_url);
                n8n_workflow_2.LoggerProxy.debug(`Authentication for "Salesforce" node is using "jwt". Invoking URI ${options.uri}`);
                options.headers.Authorization = `Bearer ${access_token}`;
                Object.assign(options, option);
                //@ts-ignore
                return yield this.helpers.request(options);
            }
            else {
                // https://help.salesforce.com/articleView?id=remoteaccess_oauth_web_server_flow.htm&type=5
                const credentialsType = 'salesforceOAuth2Api';
                const credentials = yield this.getCredentials(credentialsType);
                const options = getOptions.call(this, method, (uri || endpoint), body, qs, credentials.oauthTokenData.instance_url);
                n8n_workflow_2.LoggerProxy.debug(`Authentication for "Salesforce" node is using "OAuth2". Invoking URI ${options.uri}`);
                Object.assign(options, option);
                //@ts-ignore
                return yield this.helpers.requestOAuth2.call(this, credentialsType, options);
            }
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.salesforceApiRequest = salesforceApiRequest;
function salesforceApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        let uri;
        do {
            responseData = yield salesforceApiRequest.call(this, method, endpoint, body, query, uri);
            uri = `${endpoint}/${(_b = (_a = responseData.nextRecordsUrl) === null || _a === void 0 ? void 0 : _a.split('/')) === null || _b === void 0 ? void 0 : _b.pop()}`;
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData.nextRecordsUrl !== undefined &&
            responseData.nextRecordsUrl !== null);
        return returnData;
    });
}
exports.salesforceApiRequestAllItems = salesforceApiRequestAllItems;
/**
 * Sorts the given options alphabetically
 *
 * @export
 * @param {INodePropertyOptions[]} options
 * @returns {INodePropertyOptions[]}
 */
function sortOptions(options) {
    options.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });
}
exports.sortOptions = sortOptions;
function getOptions(method, endpoint, body, qs, instanceUrl) {
    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method,
        body,
        qs,
        uri: `${instanceUrl}/services/data/v39.0${endpoint}`,
        json: true,
    };
    if (!Object.keys(options.body).length) {
        delete options.body;
    }
    //@ts-ignore
    return options;
}
function getAccessToken(credentials) {
    const now = (0, moment_timezone_1.default)().unix();
    const authUrl = credentials.environment === 'sandbox' ? 'https://test.salesforce.com' : 'https://login.salesforce.com';
    const signature = jsonwebtoken_1.default.sign({
        'iss': credentials.clientId,
        'sub': credentials.username,
        'aud': authUrl,
        'exp': now + 3 * 60,
    }, credentials.privateKey, {
        algorithm: 'RS256',
        header: {
            'alg': 'RS256',
        },
    });
    const options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        form: {
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: signature,
        },
        uri: `${authUrl}/services/oauth2/token`,
        json: true,
    };
    //@ts-ignore
    return this.helpers.request(options);
}
function getConditions(options) {
    const conditions = (options.conditionsUi || {}).conditionValues;
    let data = undefined;
    if (Array.isArray(conditions) && conditions.length !== 0) {
        data = conditions.map((condition) => `${condition.field} ${(condition.operation) === 'equal' ? '=' : condition.operation} ${getValue(condition.value)}`);
        data = `WHERE ${data.join(' AND ')}`;
    }
    return data;
}
exports.getConditions = getConditions;
function getDefaultFields(sobject) {
    return {
        'Account': 'id,name,type',
        'Lead': 'id,company,firstname,lastname,street,postalCode,city,email,status',
        'Contact': 'id,firstname,lastname,email',
        'Opportunity': 'id,accountId,amount,probability,type',
        'Case': 'id,accountId,contactId,priority,status,subject,type',
        'Task': 'id,subject,status,priority',
        'Attachment': 'id,name',
        'User': 'id,name,email',
    }[sobject];
}
exports.getDefaultFields = getDefaultFields;
function getQuery(options, sobject, returnAll, limit = 0) {
    const fields = [];
    if (options.fields) {
        // options.fields is comma separated in standard Salesforce objects and array in custom Salesforce objects -- handle both cases
        if (typeof options.fields === 'string') {
            fields.push.apply(fields, options.fields.split(','));
        }
        else {
            fields.push.apply(fields, options.fields);
        }
    }
    else {
        fields.push.apply(fields, (getDefaultFields(sobject) || 'id').split(','));
    }
    const conditions = getConditions(options);
    let query = `SELECT ${fields.join(',')} FROM ${sobject} ${(conditions ? conditions : '')}`;
    if (returnAll === false) {
        query = `SELECT ${fields.join(',')} FROM ${sobject} ${(conditions ? conditions : '')} LIMIT ${limit}`;
    }
    return query;
}
exports.getQuery = getQuery;
function getValue(value) {
    if ((0, moment_timezone_1.default)(value).isValid()) {
        return value;
    }
    else if (typeof value === 'string') {
        return `'${value}'`;
    }
    else {
        return value;
    }
}
exports.getValue = getValue;
