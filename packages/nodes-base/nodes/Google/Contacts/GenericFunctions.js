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
exports.cleanData = exports.allFields = exports.googleApiRequestAllItems = exports.googleApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function googleApiRequest(method, resource, body = {}, qs = {}, uri, headers = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method,
            body,
            qs,
            uri: uri || `https://people.googleapis.com/v1${resource}`,
            json: true,
        };
        try {
            if (Object.keys(headers).length !== 0) {
                options.headers = Object.assign({}, options.headers, headers);
            }
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            //@ts-ignore
            return yield this.helpers.requestOAuth2.call(this, 'googleContactsOAuth2Api', options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.googleApiRequest = googleApiRequest;
function googleApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.pageSize = 100;
        do {
            responseData = yield googleApiRequest.call(this, method, endpoint, body, query);
            query.pageToken = responseData['nextPageToken'];
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData['nextPageToken'] !== undefined &&
            responseData['nextPageToken'] !== '');
        return returnData;
    });
}
exports.googleApiRequestAllItems = googleApiRequestAllItems;
exports.allFields = [
    'addresses',
    'biographies',
    'birthdays',
    'coverPhotos',
    'emailAddresses',
    'events',
    'genders',
    'imClients',
    'interests',
    'locales',
    'memberships',
    'metadata',
    'names',
    'nicknames',
    'occupations',
    'organizations',
    'phoneNumbers',
    'photos',
    'relations',
    'residences',
    'sipAddresses',
    'skills',
    'urls',
    'userDefined',
];
function cleanData(responseData) {
    const fields = ['emailAddresses', 'phoneNumbers', 'relations', 'events', 'addresses'];
    const newResponseData = [];
    if (!Array.isArray(responseData)) {
        responseData = [responseData];
    }
    for (let y = 0; y < responseData.length; y++) {
        const object = {}; // tslint:disable-line:no-any
        for (const key of Object.keys(responseData[y])) {
            if (key === 'metadata') {
                continue;
            }
            if (key === 'photos') {
                responseData[y][key] = responseData[y][key].map(((photo) => photo.url));
            }
            if (key === 'names') {
                delete responseData[y][key][0].metadata;
                responseData[y][key] = responseData[y][key][0];
            }
            if (key === 'memberships') {
                for (let i = 0; i < responseData[y][key].length; i++) {
                    responseData[y][key][i] = responseData[y][key][i].metadata.source.id;
                }
            }
            if (key === 'birthdays') {
                for (let i = 0; i < responseData[y][key].length; i++) {
                    const { year, month, day } = responseData[y][key][i].date;
                    responseData[y][key][i] = `${month}/${day}/${year}`;
                }
                responseData[y][key] = responseData[y][key][0];
            }
            if (key === 'userDefined' || key === 'organizations' || key === 'biographies') {
                for (let i = 0; i < responseData[y][key].length; i++) {
                    delete responseData[y][key][i].metadata;
                }
            }
            if (fields.includes(key)) {
                const value = {}; // tslint:disable-line:no-any
                for (const data of responseData[y][key]) {
                    let result;
                    if (value[data.type] === undefined) {
                        value[data.type] = [];
                    }
                    if (key === 'relations') {
                        result = data.person;
                    }
                    else if (key === 'events') {
                        const { year, month, day } = data.date;
                        result = `${month}/${day}/${year}`;
                    }
                    else if (key === 'addresses') {
                        delete data.metadata;
                        result = data;
                    }
                    else {
                        result = data.value;
                    }
                    value[data.type].push(result);
                    delete data.type;
                }
                if (Object.keys(value).length > 0) {
                    object[key] = value;
                }
            }
            else {
                object[key] = responseData[y][key];
            }
        }
        newResponseData.push(object);
    }
    return newResponseData;
}
exports.cleanData = cleanData;
