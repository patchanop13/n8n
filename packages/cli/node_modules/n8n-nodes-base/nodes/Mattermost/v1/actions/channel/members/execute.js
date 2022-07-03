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
exports.members = void 0;
const transport_1 = require("../../../transport");
function members(index) {
    return __awaiter(this, void 0, void 0, function* () {
        const channelId = this.getNodeParameter('channelId', index);
        const returnAll = this.getNodeParameter('returnAll', index);
        const resolveData = this.getNodeParameter('resolveData', index);
        const limit = this.getNodeParameter('limit', index, 0);
        const body = {};
        const qs = {};
        const requestMethod = 'GET';
        const endpoint = `channels/${channelId}/members`;
        if (returnAll === false) {
            qs.per_page = this.getNodeParameter('limit', index);
        }
        let responseData;
        if (returnAll) {
            responseData = yield transport_1.apiRequestAllItems.call(this, requestMethod, endpoint, body, qs);
        }
        else {
            responseData = yield transport_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
            if (limit) {
                responseData = responseData.slice(0, limit);
            }
            if (resolveData) {
                const userIds = [];
                for (const data of responseData) {
                    userIds.push(data.user_id);
                }
                if (userIds.length > 0) {
                    responseData = yield transport_1.apiRequest.call(this, 'POST', 'users/ids', userIds, qs);
                }
            }
        }
        return this.helpers.returnJsonArray(responseData);
    });
}
exports.members = members;
