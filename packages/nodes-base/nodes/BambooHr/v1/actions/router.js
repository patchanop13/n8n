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
exports.router = void 0;
const employee = __importStar(require("./employee"));
const employeeDocument = __importStar(require("./employeeDocument"));
const file = __importStar(require("./file"));
const companyReport = __importStar(require("./companyReport"));
function router() {
    return __awaiter(this, void 0, void 0, function* () {
        const items = this.getInputData();
        const operationResult = [];
        for (let i = 0; i < items.length; i++) {
            const resource = this.getNodeParameter('resource', i);
            const operation = this.getNodeParameter('operation', i);
            const bamboohr = {
                resource,
                operation,
            };
            if (bamboohr.operation === 'delete') {
                //@ts-ignore
                bamboohr.operation = 'del';
            }
            try {
                if (bamboohr.resource === 'employee') {
                    operationResult.push(...yield employee[bamboohr.operation].execute.call(this, i));
                }
                else if (bamboohr.resource === 'employeeDocument') {
                    //@ts-ignore
                    operationResult.push(...yield employeeDocument[bamboohr.operation].execute.call(this, i));
                }
                else if (bamboohr.resource === 'file') {
                    //@ts-ignore
                    operationResult.push(...yield file[bamboohr.operation].execute.call(this, i));
                }
                else if (bamboohr.resource === 'companyReport') {
                    //@ts-ignore
                    operationResult.push(...yield companyReport[bamboohr.operation].execute.call(this, i));
                }
            }
            catch (err) {
                if (this.continueOnFail()) {
                    operationResult.push({ json: this.getInputData(i)[0].json, error: err });
                }
                else {
                    throw err;
                }
            }
        }
        return operationResult;
    });
}
exports.router = router;
