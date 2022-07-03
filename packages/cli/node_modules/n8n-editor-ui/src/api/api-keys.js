"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApiKey = exports.createApiKey = exports.getApiKey = void 0;
const helpers_1 = require("@/api/helpers");
function getApiKey(context) {
    return (0, helpers_1.makeRestApiRequest)(context, 'GET', '/me/api-key');
}
exports.getApiKey = getApiKey;
function createApiKey(context) {
    return (0, helpers_1.makeRestApiRequest)(context, 'POST', '/me/api-key');
}
exports.createApiKey = createApiKey;
function deleteApiKey(context) {
    return (0, helpers_1.makeRestApiRequest)(context, 'DELETE', '/me/api-key');
}
exports.deleteApiKey = deleteApiKey;
