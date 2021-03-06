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
exports.deriveUid = exports.tolerateTrailingSlash = exports.throwOnEmptyUpdate = exports.grafanaApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function grafanaApiRequest(method, endpoint, body = {}, qs = {}) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __awaiter(this, void 0, void 0, function* () {
        const { apiKey, baseUrl: rawBaseUrl, } = yield this.getCredentials('grafanaApi');
        const baseUrl = tolerateTrailingSlash(rawBaseUrl);
        const options = {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            method,
            body,
            qs,
            uri: `${baseUrl}/api${endpoint}`,
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
            if (((_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) === 'Team member not found') {
                error.response.data.message += '. Are you sure the user is a member of this team?';
            }
            if (((_d = (_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) === 'Team not found') {
                error.response.data.message += ' with the provided ID';
            }
            if (((_f = (_e = error === null || error === void 0 ? void 0 : error.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.message) === 'A dashboard with the same name in the folder already exists') {
                error.response.data.message = 'A dashboard with the same name already exists in the selected folder';
            }
            if (((_h = (_g = error === null || error === void 0 ? void 0 : error.response) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.message) === 'Team name taken') {
                error.response.data.message = 'This team name is already taken. Please choose a new one.';
            }
            if ((error === null || error === void 0 ? void 0 : error.code) === 'ECONNREFUSED') {
                error.message = 'Invalid credentials or error in establishing connection with given credentials';
            }
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.grafanaApiRequest = grafanaApiRequest;
function throwOnEmptyUpdate(resource, updateFields) {
    if (!Object.keys(updateFields).length) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}.`);
    }
}
exports.throwOnEmptyUpdate = throwOnEmptyUpdate;
function tolerateTrailingSlash(baseUrl) {
    return baseUrl.endsWith('/')
        ? baseUrl.substr(0, baseUrl.length - 1)
        : baseUrl;
}
exports.tolerateTrailingSlash = tolerateTrailingSlash;
function deriveUid(uidOrUrl) {
    if (!uidOrUrl.startsWith('http'))
        return uidOrUrl;
    const urlSegments = uidOrUrl.split('/');
    const uid = urlSegments[urlSegments.indexOf('d') + 1];
    if (!uid) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Failed to derive UID from URL');
    }
    return uid;
}
exports.deriveUid = deriveUid;
