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
exports.deleteDatapoint = exports.updateDatapoint = exports.getAllDatapoints = exports.createDatapoint = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
function createDatapoint(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('beeminderApi');
        const endpoint = `/users/${credentials.user}/goals/${data.goalName}/datapoints.json`;
        return yield GenericFunctions_1.beeminderApiRequest.call(this, 'POST', endpoint, data);
    });
}
exports.createDatapoint = createDatapoint;
function getAllDatapoints(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('beeminderApi');
        const endpoint = `/users/${credentials.user}/goals/${data.goalName}/datapoints.json`;
        if (data.count !== undefined) {
            return GenericFunctions_1.beeminderApiRequest.call(this, 'GET', endpoint, {}, data);
        }
        return yield GenericFunctions_1.beeminderApiRequestAllItems.call(this, 'GET', endpoint, {}, data);
    });
}
exports.getAllDatapoints = getAllDatapoints;
function updateDatapoint(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('beeminderApi');
        const endpoint = `/users/${credentials.user}/goals/${data.goalName}/datapoints/${data.datapointId}.json`;
        return yield GenericFunctions_1.beeminderApiRequest.call(this, 'PUT', endpoint, data);
    });
}
exports.updateDatapoint = updateDatapoint;
function deleteDatapoint(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('beeminderApi');
        const endpoint = `/users/${credentials.user}/goals/${data.goalName}/datapoints/${data.datapointId}.json`;
        return yield GenericFunctions_1.beeminderApiRequest.call(this, 'DELETE', endpoint);
    });
}
exports.deleteDatapoint = deleteDatapoint;
