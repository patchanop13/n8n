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
exports.resourceLoaders = exports.onfleetApiRequestAllItems = exports.onfleetApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
function onfleetApiRequest(method, resource, body = {}, // tslint:disable-line:no-any
qs, // tslint:disable-line:no-any
uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('onfleetApi');
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'n8n-onfleet',
            },
            auth: {
                user: credentials.apiKey,
                pass: '',
            },
            method,
            body,
            qs,
            uri: uri || `https://onfleet.com/api/v2/${resource}`,
            json: true,
        };
        try {
            //@ts-ignore
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.onfleetApiRequest = onfleetApiRequest;
function onfleetApiRequestAllItems(propertyName, method, endpoint, 
// tslint:disable-next-line: no-any
body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        do {
            responseData = yield onfleetApiRequest.call(this, method, endpoint, body, query);
            query.lastId = responseData['lastId'];
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData['lastId'] !== undefined);
        return returnData;
    });
}
exports.onfleetApiRequestAllItems = onfleetApiRequestAllItems;
exports.resourceLoaders = {
    getTeams() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teams = yield onfleetApiRequest.call(this, 'GET', 'teams');
                return teams.map(({ name = '', id: value = '' }) => ({ name, value }));
            }
            catch (error) {
                return [];
            }
        });
    },
    getWorkers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const workers = yield onfleetApiRequest.call(this, 'GET', 'workers');
                return workers.map(({ name = '', id: value = '' }) => ({ name, value }));
            }
            catch (error) {
                return [];
            }
        });
    },
    getAdmins() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admins = yield onfleetApiRequest.call(this, 'GET', 'admins');
                return admins.map(({ name = '', id: value = '' }) => ({ name, value }));
            }
            catch (error) {
                return [];
            }
        });
    },
    getHubs() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hubs = yield onfleetApiRequest.call(this, 'GET', 'hubs');
                return hubs.map(({ name = '', id: value = '' }) => ({ name, value }));
            }
            catch (error) {
                return [];
            }
        });
    },
    getTimezones() {
        return __awaiter(this, void 0, void 0, function* () {
            const returnData = [];
            for (const timezone of moment_timezone_1.default.tz.names()) {
                returnData.push({
                    name: timezone,
                    value: timezone,
                });
            }
            return returnData;
        });
    },
};
