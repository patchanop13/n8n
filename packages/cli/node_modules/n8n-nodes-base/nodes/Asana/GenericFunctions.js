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
exports.getTaskFields = exports.getColorOptions = exports.getWorkspaces = exports.asanaApiRequestAllItems = exports.asanaApiRequest = void 0;
const lodash_1 = require("lodash");
/**
 * Make an API request to Asana
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
function asanaApiRequest(method, endpoint, body, query, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationMethod = this.getNodeParameter('authentication', 0);
        const options = {
            headers: {},
            method,
            body: { data: body },
            qs: query,
            url: uri || `https://app.asana.com/api/1.0${endpoint}`,
            json: true,
        };
        const credentialType = authenticationMethod === 'accessToken' ? 'asanaApi' : 'asanaOAuth2Api';
        return this.helpers.requestWithAuthentication.call(this, credentialType, options);
    });
}
exports.asanaApiRequest = asanaApiRequest;
function asanaApiRequestAllItems(method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        let uri;
        query.limit = 100;
        do {
            responseData = yield asanaApiRequest.call(this, method, endpoint, body, query, uri);
            uri = (0, lodash_1.get)(responseData, 'next_page.uri');
            returnData.push.apply(returnData, responseData['data']);
        } while (responseData['next_page'] !== null);
        return returnData;
    });
}
exports.asanaApiRequestAllItems = asanaApiRequestAllItems;
function getWorkspaces() {
    return __awaiter(this, void 0, void 0, function* () {
        const endpoint = '/workspaces';
        const responseData = yield asanaApiRequestAllItems.call(this, 'GET', endpoint, {});
        const returnData = [];
        for (const workspaceData of responseData) {
            if (workspaceData.resource_type !== 'workspace') {
                // Not sure if for some reason also ever other resources
                // get returned but just in case filter them out
                continue;
            }
            returnData.push({
                name: workspaceData.name,
                value: workspaceData.gid,
            });
        }
        returnData.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
        return returnData;
    });
}
exports.getWorkspaces = getWorkspaces;
function getColorOptions() {
    return [
        'dark-blue',
        'dark-brown',
        'dark-green',
        'dark-orange',
        'dark-pink',
        'dark-purple',
        'dark-red',
        'dark-teal',
        'dark-warm-gray',
        'light-blue',
        'light-green',
        'light-orange',
        'light-pink',
        'light-purple',
        'light-red',
        'light-teal',
        'light-warm-gray',
        'light-yellow',
        'none',
    ].map(value => {
        return {
            name: value,
            value,
        };
    });
}
exports.getColorOptions = getColorOptions;
function getTaskFields() {
    return [
        '*',
        'GID',
        'Resource Type',
        'name',
        'Approval Status',
        'Assignee Status',
        'Completed',
        'Completed At',
        'Completed By',
        'Created At',
        'Dependencies',
        'Dependents',
        'Due At',
        'Due On',
        'External',
        'HTML Notes',
        'Liked',
        'Likes',
        'Memberships',
        'Modified At',
        'Notes',
        'Num Likes',
        'Resource Subtype',
        'Start On',
        'Assignee',
        'Custom Fields',
        'Followers',
        'Parent',
        'Permalink URL',
        'Projects',
        'Tags',
        'Workspace',
    ];
}
exports.getTaskFields = getTaskFields;
