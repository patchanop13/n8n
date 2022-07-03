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
        const body = {};
        const requestMethod = 'GET';
        const endpoint = 'employees/directory';
        //limit parameters
        const returnAll = this.getNodeParameter('returnAll', 0, false);
        const limit = this.getNodeParameter('limit', 0, 0);
        //response
        const responseData = yield transport_1.apiRequest.call(this, requestMethod, endpoint, body);
        //return limited result
        if (!returnAll && responseData.employees.length > limit) {
            return this.helpers.returnJsonArray(responseData.employees.slice(0, limit));
        }
        //return all result
        return this.helpers.returnJsonArray(responseData.employees);
    });
}
exports.getAll = getAll;
