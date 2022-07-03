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
exports.get = void 0;
const transport_1 = require("../../../transport");
function get(index) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = {};
        const requestMethod = 'GET';
        //meta data
        const id = this.getNodeParameter('employeeId', index);
        //query parameters
        let fields = this.getNodeParameter('options.fields', index, ['all']);
        if (fields.includes('all')) {
            const { fields: allFields } = yield transport_1.apiRequest.call(this, requestMethod, 'employees/directory', body);
            fields = allFields.map((field) => field.id);
        }
        //endpoint
        const endpoint = `employees/${id}?fields=${fields}`;
        //response
        const responseData = yield transport_1.apiRequest.call(this, requestMethod, endpoint, body);
        //return
        return this.helpers.returnJsonArray(responseData);
    });
}
exports.get = get;
