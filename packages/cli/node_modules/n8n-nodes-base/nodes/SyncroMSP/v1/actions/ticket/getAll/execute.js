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
exports.getAll = void 0;
const transport_1 = require("../../../transport");
function getAll(index) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnAll = this.getNodeParameter('returnAll', index);
        const filters = this.getNodeParameter('filters', index);
        let qs = {};
        const requestMethod = 'GET';
        const endpoint = 'tickets';
        const body = {};
        if (filters) {
            qs = filters;
        }
        if (returnAll === false) {
            qs.per_page = this.getNodeParameter('limit', index);
        }
        let responseData;
        if (returnAll) {
            responseData = yield transport_1.apiRequestAllItems.call(this, requestMethod, endpoint, body, qs);
            return this.helpers.returnJsonArray(responseData);
        }
        else {
            responseData = yield transport_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
            return this.helpers.returnJsonArray(responseData.tickets);
        }
    });
}
exports.getAll = getAll;
