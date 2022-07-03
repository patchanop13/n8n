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
exports.getEmployeeFields = exports.getDivisions = exports.getDepartments = exports.getEmployeeLocations = exports.getEmployeeDocumentCategories = exports.getCompanyFileCategories = exports.getTimeOffTypeID = void 0;
const transport_1 = require("../transport");
// Get all the available channels
function getTimeOffTypeID() {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        const body = {};
        const requestMethod = 'GET';
        const endPoint = 'meta/time_off/types';
        const response = yield transport_1.apiRequest.call(this, requestMethod, endPoint, body);
        const timeOffTypeIds = response.body.timeOffTypes;
        for (const item of timeOffTypeIds) {
            returnData.push({
                name: item.name,
                value: item.id,
            });
        }
        return returnData;
    });
}
exports.getTimeOffTypeID = getTimeOffTypeID;
function getCompanyFileCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        const body = {};
        const requestMethod = 'GET';
        const endPoint = 'files/view/';
        const response = yield transport_1.apiRequest.call(this, requestMethod, endPoint, body);
        const categories = response.categories;
        for (const category of categories) {
            returnData.push({
                name: category.name,
                value: category.id,
            });
        }
        returnData.sort(sort);
        return returnData;
    });
}
exports.getCompanyFileCategories = getCompanyFileCategories;
function getEmployeeDocumentCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        const body = {};
        const requestMethod = 'GET';
        const id = this.getCurrentNodeParameter('employeeId');
        const endPoint = `employees/${id}/files/view/`;
        const response = yield transport_1.apiRequest.call(this, requestMethod, endPoint, body);
        const categories = response.categories;
        for (const category of categories) {
            returnData.push({
                name: category.name,
                value: category.id,
            });
        }
        returnData.sort(sort);
        return returnData;
    });
}
exports.getEmployeeDocumentCategories = getEmployeeDocumentCategories;
function getEmployeeLocations() {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        const body = {};
        const requestMethod = 'GET';
        const endPoint = 'meta/lists/';
        //do not request all data? 
        const fields = yield transport_1.apiRequest.call(this, requestMethod, endPoint, body, {});
        const options = fields.filter(field => field.fieldId === 18)[0].options;
        for (const option of options) {
            returnData.push({
                name: option.name,
                value: option.id,
            });
        }
        returnData.sort(sort);
        return returnData;
    });
}
exports.getEmployeeLocations = getEmployeeLocations;
function getDepartments() {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        const body = {};
        const requestMethod = 'GET';
        const endPoint = 'meta/lists/';
        //do not request all data? 
        const fields = yield transport_1.apiRequest.call(this, requestMethod, endPoint, body, {});
        const options = fields.filter(field => field.fieldId === 4)[0].options;
        for (const option of options) {
            returnData.push({
                name: option.name,
                value: option.id,
            });
        }
        returnData.sort(sort);
        return returnData;
    });
}
exports.getDepartments = getDepartments;
function getDivisions() {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        const body = {};
        const requestMethod = 'GET';
        const endPoint = 'meta/lists/';
        //do not request all data? 
        const fields = yield transport_1.apiRequest.call(this, requestMethod, endPoint, body, {});
        const options = fields.filter(field => field.fieldId === 1355)[0].options;
        for (const option of options) {
            returnData.push({
                name: option.name,
                value: option.id,
            });
        }
        returnData.sort(sort);
        return returnData;
    });
}
exports.getDivisions = getDivisions;
function getEmployeeFields() {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        const body = {};
        const requestMethod = 'GET';
        const endPoint = 'employees/directory';
        const { fields } = yield transport_1.apiRequest.call(this, requestMethod, endPoint, body);
        for (const field of fields) {
            returnData.push({
                name: field.name || field.id,
                value: field.id,
            });
        }
        returnData.sort(sort);
        returnData.unshift({
            name: '[All]',
            value: 'all',
        });
        return returnData;
    });
}
exports.getEmployeeFields = getEmployeeFields;
//@ts-ignore
const sort = (a, b) => {
    if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
        return -1;
    }
    if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
        return 1;
    }
    return 0;
};
