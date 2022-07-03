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
exports.pushbulletApiRequestAllItems = exports.pushbulletApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function pushbulletApiRequest(method, path, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            method,
            body,
            qs,
            uri: uri || `https://api.pushbullet.com/v2${path}`,
            json: true,
        };
        try {
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            if (Object.keys(option).length !== 0) {
                Object.assign(options, option);
            }
            //@ts-ignore
            return yield this.helpers.requestOAuth2.call(this, 'pushbulletOAuth2Api', options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.pushbulletApiRequest = pushbulletApiRequest;
function pushbulletApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        do {
            responseData = yield pushbulletApiRequest.call(this, method, endpoint, body, query);
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData.cursor !== undefined);
        return returnData;
    });
}
exports.pushbulletApiRequestAllItems = pushbulletApiRequestAllItems;
