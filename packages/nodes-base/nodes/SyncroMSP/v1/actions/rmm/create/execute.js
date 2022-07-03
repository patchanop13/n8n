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
exports.addAlert = void 0;
const transport_1 = require("../../../transport");
function addAlert(index) {
    return __awaiter(this, void 0, void 0, function* () {
        const customerId = this.getNodeParameter('customerId', index);
        const assetId = this.getNodeParameter('assetId', index);
        const description = this.getNodeParameter('description', index);
        const additionalFields = this.getNodeParameter('additionalFields', index);
        const qs = {};
        const requestMethod = 'POST';
        const endpoint = 'rmm_alerts';
        let body = {};
        if (additionalFields) {
            body = additionalFields;
        }
        body.customer_id = customerId;
        body.asset_id = assetId;
        body.description = description;
        let responseData;
        responseData = yield transport_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
        return this.helpers.returnJsonArray(responseData.alert);
    });
}
exports.addAlert = addAlert;
