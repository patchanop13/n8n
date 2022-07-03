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
exports.upload = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const transport_1 = require("../../../transport");
function upload(index) {
    return __awaiter(this, void 0, void 0, function* () {
        let body = {};
        const requestMethod = 'POST';
        const items = this.getInputData();
        const category = this.getNodeParameter('categoryId', index);
        const share = this.getNodeParameter('options.share', index, true);
        if (items[index].binary === undefined) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
        }
        const propertyNameUpload = this.getNodeParameter('binaryPropertyName', index);
        if (items[index].binary[propertyNameUpload] === undefined) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${propertyNameUpload}" does not exists on item!`);
        }
        const item = items[index].binary;
        const binaryData = item[propertyNameUpload];
        const binaryDataBuffer = yield this.helpers.getBinaryDataBuffer(index, propertyNameUpload);
        body = {
            json: false,
            formData: {
                file: {
                    value: binaryDataBuffer,
                    options: {
                        filename: binaryData.fileName,
                        contentType: binaryData.mimeType,
                    },
                },
                fileName: binaryData.fileName,
                category,
            },
            resolveWithFullResponse: true,
        };
        Object.assign(body.formData, (share) ? { share: 'yes' } : { share: 'no' });
        //endpoint
        const endpoint = `files`;
        const { headers } = yield transport_1.apiRequest.call(this, requestMethod, endpoint, {}, {}, body);
        return this.helpers.returnJsonArray({ fileId: headers.location.split('/').pop() });
    });
}
exports.upload = upload;
