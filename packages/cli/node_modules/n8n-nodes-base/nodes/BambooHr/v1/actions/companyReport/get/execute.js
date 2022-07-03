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
        const items = this.getInputData();
        //meta data
        const reportId = this.getNodeParameter('reportId', index);
        const format = this.getNodeParameter('format', 0);
        const fd = this.getNodeParameter('options.fd', index, true);
        //endpoint
        const endpoint = `reports/${reportId}/?format=${format}&fd=${fd}`;
        if (format === 'JSON') {
            const responseData = yield transport_1.apiRequest.call(this, requestMethod, endpoint, body, {}, { resolveWithFullResponse: true });
            return this.helpers.returnJsonArray(responseData.body);
        }
        const output = this.getNodeParameter('output', index);
        const response = yield transport_1.apiRequest.call(this, requestMethod, endpoint, body, {}, { encoding: null, json: false, resolveWithFullResponse: true });
        let mimeType = response.headers['content-type'];
        mimeType = mimeType ? mimeType.split(';').find(value => value.includes('/')) : undefined;
        const contentDisposition = response.headers['content-disposition'];
        const fileNameRegex = /(?<=filename=").*\b/;
        const match = fileNameRegex.exec(contentDisposition);
        let fileName = '';
        // file name was found
        if (match !== null) {
            fileName = match[0];
        }
        const newItem = {
            json: items[index].json,
            binary: {},
        };
        if (items[index].binary !== undefined) {
            // Create a shallow copy of the binary data so that the old
            // data references which do not get changed still stay behind
            // but the incoming data does not get changed.
            Object.assign(newItem.binary, items[index].binary);
        }
        newItem.binary = {
            [output]: yield this.helpers.prepareBinaryData(response.body, fileName, mimeType),
        };
        return this.prepareOutputData(newItem);
    });
}
exports.get = get;
