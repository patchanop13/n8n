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
exports.create = void 0;
const transport_1 = require("../../../transport");
const moment_1 = __importDefault(require("moment"));
const change_case_1 = require("change-case");
function create(index) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = {};
        const requestMethod = 'POST';
        const endpoint = 'employees';
        //body parameters
        body.firstName = this.getNodeParameter('firstName', index);
        body.lastName = this.getNodeParameter('lastName', index);
        const additionalFields = this.getNodeParameter('additionalFields', index);
        const synced = this.getNodeParameter('synced', index);
        if (synced) {
            Object.assign(body, { address: this.getNodeParameter('address.value', index, {}) });
            Object.assign(body, { payRate: this.getNodeParameter('payRate.value', index, {}) });
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
            Object.assign(body, { address: this.getNodeParameter('additionalFields.address.value', index, {}) });
            Object.assign(body, { payRate: this.getNodeParameter('additionalFields.payRate.value', index, {}) });
            delete additionalFields.address;
            delete additionalFields.payRate;
        }
        Object.assign(body, additionalFields);
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
        //response
        const responseData = yield transport_1.apiRequest.call(this, requestMethod, endpoint, body, {}, { resolveWithFullResponse: true });
        //obtain employeeID
        const rawEmployeeId = responseData.headers.location.lastIndexOf('/');
        const employeeId = responseData.headers.location.substring(rawEmployeeId + 1);
        //return
        return this.helpers.returnJsonArray({ id: employeeId });
    });
}
exports.create = create;
