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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const transport_1 = require("../../../transport");
const moment_1 = __importDefault(require("moment"));
const change_case_1 = require("change-case");
function update(index) {
    return __awaiter(this, void 0, void 0, function* () {
        let body = {};
        const requestMethod = 'POST';
        //meta data
        const id = this.getNodeParameter('employeeId', index);
        //endpoint
        const endpoint = `employees/${id}`;
        //body parameters
        body = this.getNodeParameter('updateFields', index);
        const updateFields = this.getNodeParameter('updateFields', index);
        const synced = this.getNodeParameter('synced', index);
        if (synced) {
            Object.assign(body, { address: this.getNodeParameter('address.value', index, {}) });
            Object.assign(body, { payRate: this.getNodeParameter('payRate.value', index, {}) });
            body.firstName = this.getNodeParameter('firstName', index);
            body.lastName = this.getNodeParameter('lastName', index);
            body.department = this.getNodeParameter('department', index);
            body.dateOfBirth = this.getNodeParameter('dateOfBirth', index);
            body.division = this.getNodeParameter('division', index);
            body.employeeNumber = this.getNodeParameter('employeeNumber', index);
            body.exempt = this.getNodeParameter('exempt', index);
            body.gender = this.getNodeParameter('gender', index);
            body.hireDate = this.getNodeParameter('hireDate', index);
            body.location = this.getNodeParameter('location', index);
            body.maritalStatus = this.getNodeParameter('maritalStatus', index);
            body.mobilePhone = this.getNodeParameter('mobilePhone', index);
            body.paidPer = this.getNodeParameter('paidPer', index);
            body.payType = this.getNodeParameter('payType', index);
            body.preferredName = this.getNodeParameter('preferredName', index);
            body.ssn = this.getNodeParameter('ssn', index);
        }
        else {
            if (!Object.keys(updateFields).length) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At least one fields must be updated');
            }
            Object.assign(body, { address: this.getNodeParameter('updateFields.address.value', index, {}) });
            Object.assign(body, { payRate: this.getNodeParameter('updateFields.payRate.value', index, {}) });
            delete updateFields.address;
            delete updateFields.payRate;
        }
        Object.assign(body, updateFields);
        if (body.gender) {
            body.gender = (0, change_case_1.capitalCase)(body.gender);
        }
        if (body.dateOfBirth) {
            body.dateOfBirth = (0, moment_1.default)(body.dateOfBirth).format('YYYY-MM-DD');
        }
        if (body.exempt) {
            body.exempt = (0, change_case_1.capitalCase)(body.exempt);
        }
        if (body.hireDate) {
            body.hireDate = (0, moment_1.default)(body.hireDate).format('YYYY-MM-DD');
        }
        if (body.maritalStatus) {
            body.maritalStatus = (0, change_case_1.capitalCase)(body.maritalStatus);
        }
        if (body.payType) {
            body.payType = (0, change_case_1.capitalCase)(body.payType);
        }
        if (body.paidPer) {
            body.paidPer = (0, change_case_1.capitalCase)(body.paidPer);
        }
        if (!Object.keys(body.payRate).length) {
            delete body.payRate;
        }
        yield transport_1.apiRequest.call(this, requestMethod, endpoint, body);
        //return
        return this.helpers.returnJsonArray({ success: true });
    });
}
exports.update = update;
