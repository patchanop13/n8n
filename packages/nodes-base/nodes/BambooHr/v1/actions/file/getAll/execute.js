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
        const endpoint = 'files/view';
        //limit parameters
        const simplifyOutput = this.getNodeParameter('simplifyOutput', index);
        const returnAll = this.getNodeParameter('returnAll', 0, false);
        const limit = this.getNodeParameter('limit', 0, 0);
        //response
        const responseData = yield transport_1.apiRequest.call(this, requestMethod, endpoint, body);
        const onlyFilesArray = [];
        //return only files without categories
        if (simplifyOutput) {
            for (let i = 0; i < responseData.categories.length; i++) {
                if (responseData.categories[i].hasOwnProperty('files')) {
                    for (let j = 0; j < responseData.categories[i].files.length; j++) {
                        onlyFilesArray.push(responseData.categories[i].files[j]);
                    }
                }
            }
            if (!returnAll && onlyFilesArray.length > limit) {
                return this.helpers.returnJsonArray(onlyFilesArray.slice(0, limit));
            }
            else {
                return this.helpers.returnJsonArray(onlyFilesArray);
            }
        }
        //return limited result
        if (!returnAll && responseData.categories.length > limit) {
            return this.helpers.returnJsonArray(responseData.categories.slice(0, limit));
        }
        //return
        return this.helpers.returnJsonArray(responseData.categories);
    });
}
exports.getAll = getAll;
