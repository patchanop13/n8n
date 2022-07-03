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
exports.getCustomers = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const transport_1 = require("../transport");
// Get all the available channels
function getCustomers() {
    return __awaiter(this, void 0, void 0, function* () {
        const endpoint = 'customers';
        const responseData = yield transport_1.apiRequestAllItems.call(this, 'GET', endpoint, {});
        if (responseData === undefined) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No data got returned');
        }
        const returnData = [];
        for (const data of responseData) {
            returnData.push({
                name: data.fullname,
                value: data.id,
            });
        }
        returnData.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
        return returnData;
    });
}
exports.getCustomers = getCustomers;
