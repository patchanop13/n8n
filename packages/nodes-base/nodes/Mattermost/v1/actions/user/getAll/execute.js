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
const n8n_workflow_1 = require("n8n-workflow");
const transport_1 = require("../../../transport");
const change_case_1 = require("change-case");
function getAll(index) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnAll = this.getNodeParameter('returnAll', index);
        const additionalFields = this.getNodeParameter('additionalFields', index);
        const qs = {};
        const requestMethod = 'GET';
        const endpoint = '/users';
        const body = {};
        if (additionalFields.inTeam) {
            qs.in_team = additionalFields.inTeam;
        }
        if (additionalFields.notInTeam) {
            qs.not_in_team = additionalFields.notInTeam;
        }
        if (additionalFields.inChannel) {
            qs.in_channel = additionalFields.inChannel;
        }
        if (additionalFields.notInChannel) {
            qs.not_in_channel = additionalFields.notInChannel;
        }
        if (additionalFields.sort) {
            qs.sort = (0, change_case_1.snakeCase)(additionalFields.sort);
        }
        const validRules = {
            inTeam: ['last_activity_at', 'created_at', 'username'],
            inChannel: ['status', 'username'],
        };
        if (additionalFields.sort) {
            if (additionalFields.inTeam !== undefined || additionalFields.inChannel !== undefined) {
                if (additionalFields.inTeam !== undefined
                    && !validRules.inTeam.includes((0, change_case_1.snakeCase)(additionalFields.sort))) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `When In Team is set the only valid values for sorting are ${validRules.inTeam.join(',')}`);
                }
                if (additionalFields.inChannel !== undefined
                    && !validRules.inChannel.includes((0, change_case_1.snakeCase)(additionalFields.sort))) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `When In Channel is set the only valid values for sorting are ${validRules.inChannel.join(',')}`);
                }
                if (additionalFields.inChannel === ''
                    && additionalFields.sort !== 'username') {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'When sort is different than username In Channel must be set');
                }
                if (additionalFields.inTeam === ''
                    && additionalFields.sort !== 'username') {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'When sort is different than username In Team must be set');
                }
            }
            else {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `When sort is defined either 'in team' or 'in channel' must be defined`);
            }
        }
        if (additionalFields.sort === 'username') {
            qs.sort = '';
        }
        if (returnAll === false) {
            qs.per_page = this.getNodeParameter('limit', index);
        }
        let responseData;
        if (returnAll) {
            responseData = yield transport_1.apiRequestAllItems.call(this, requestMethod, endpoint, body, qs);
        }
        else {
            responseData = yield transport_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
        }
        return this.helpers.returnJsonArray(responseData);
    });
}
exports.getAll = getAll;
