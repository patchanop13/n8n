"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionDescription = void 0;
const file = __importStar(require("./file"));
const employee = __importStar(require("./employee"));
const employeeDocument = __importStar(require("./employeeDocument"));
const companyReport = __importStar(require("./companyReport"));
exports.versionDescription = {
    credentials: [
        {
            name: 'bambooHrApi',
            required: true,
            testedBy: 'bambooHrApiCredentialTest',
        },
    ],
    defaults: {
        name: 'BambooHR',
    },
    description: 'Consume BambooHR API',
    displayName: 'BambooHR',
    group: ['transform'],
    // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
    icon: 'file:bambooHr.png',
    inputs: ['main'],
    name: 'bambooHr',
    outputs: ['main'],
    properties: [
        {
            displayName: 'Resource',
            name: 'resource',
            type: 'options',
            noDataExpression: true,
            options: [
                {
                    name: 'Company Report',
                    value: 'companyReport',
                },
                {
                    name: 'Employee',
                    value: 'employee',
                },
                {
                    name: 'Employee Document',
                    value: 'employeeDocument',
                },
                {
                    name: 'File',
                    value: 'file',
                },
            ],
            default: 'employee',
        },
        ...employee.descriptions,
        ...employeeDocument.descriptions,
        ...file.descriptions,
        ...companyReport.descriptions,
    ],
    subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
    version: 1,
};
