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
exports.search = void 0;
const transport_1 = require("../../../transport");
function search(index) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = {};
        const qs = {};
        const requestMethod = 'POST';
        const teamId = this.getNodeParameter('teamId', index);
        const returnAll = this.getNodeParameter('returnAll', 0);
        const endpoint = `teams/${teamId}/channels/search`;
        body.term = this.getNodeParameter('term', index);
        let responseData = yield transport_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
        if (!returnAll) {
            const limit = this.getNodeParameter('limit', 0);
            responseData = responseData.slice(0, limit);
        }
        return this.helpers.returnJsonArray(responseData);
    });
}
exports.search = search;
