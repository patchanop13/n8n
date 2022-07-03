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
exports.RundeckApi = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class RundeckApi {
    constructor(executeFunctions) {
        this.executeFunctions = executeFunctions;
    }
    request(method, endpoint, body, query) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                headers: {
                    'user-agent': 'n8n',
                    'X-Rundeck-Auth-Token': (_a = this.credentials) === null || _a === void 0 ? void 0 : _a.token,
                },
                rejectUnauthorized: false,
                method,
                qs: query,
                uri: ((_b = this.credentials) === null || _b === void 0 ? void 0 : _b.url) + endpoint,
                body,
                json: true,
            };
            try {
                return yield this.executeFunctions.helpers.request(options);
            }
            catch (error) {
                throw new n8n_workflow_1.NodeApiError(this.executeFunctions.getNode(), error);
            }
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const credentials = yield this.executeFunctions.getCredentials('rundeckApi');
            if (credentials === undefined) {
                throw new n8n_workflow_1.NodeOperationError(this.executeFunctions.getNode(), 'No credentials got returned!');
            }
            this.credentials = credentials;
        });
    }
    executeJob(jobId, args) {
        let params = '';
        if (args) {
            for (const arg of args) {
                params += '-' + arg.name + ' ' + arg.value + ' ';
            }
        }
        const body = {
            argString: params,
        };
        return this.request('POST', `/api/14/job/${jobId}/run`, body, {});
    }
    getJobMetadata(jobId) {
        return this.request('GET', `/api/18/job/${jobId}/info`, {}, {});
    }
}
exports.RundeckApi = RundeckApi;
