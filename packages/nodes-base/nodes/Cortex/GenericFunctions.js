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
exports.prepareParameters = exports.splitTags = exports.getEntityLabel = exports.cortexApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const moment_1 = __importDefault(require("moment"));
function cortexApiRequest(method, resource, body = {}, query = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('cortexApi');
        let options = {
            headers: {},
            method,
            qs: query,
            uri: uri || `${credentials.host}/api${resource}`,
            body,
            json: true,
        };
        if (Object.keys(option).length !== 0) {
            options = Object.assign({}, options, option);
        }
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        if (Object.keys(query).length === 0) {
            delete options.qs;
        }
        try {
            return yield this.helpers.requestWithAuthentication.call(this, 'cortexApi', options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.cortexApiRequest = cortexApiRequest;
function getEntityLabel(entity) {
    let label = '';
    switch (entity._type) {
        case 'case':
            label = `#${entity.caseId} ${entity.title}`;
            break;
        case 'case_artifact':
            //@ts-ignore
            label = `[${entity.dataType}] ${entity.data ? entity.data : (entity.attachment.name)}`;
            break;
        case 'alert':
            label = `[${entity.source}:${entity.sourceRef}] ${entity.title}`;
            break;
        case 'case_task_log':
            label = `${entity.message} from ${entity.createdBy}`;
            break;
        case 'case_task':
            label = `${entity.title} (${entity.status})`;
            break;
        case 'job':
            label = `${entity.analyzerName} (${entity.status})`;
            break;
        default:
            break;
    }
    return label;
}
exports.getEntityLabel = getEntityLabel;
function splitTags(tags) {
    return tags.split(',').filter(tag => tag !== ' ' && tag);
}
exports.splitTags = splitTags;
function prepareParameters(values) {
    const response = {};
    for (const key in values) {
        if (values[key] !== undefined && values[key] !== null && values[key] !== '') {
            if ((0, moment_1.default)(values[key], moment_1.default.ISO_8601).isValid()) {
                response[key] = Date.parse(values[key]);
            }
            else if (key === 'tags') {
                response[key] = splitTags(values[key]);
            }
            else {
                response[key] = values[key];
            }
        }
    }
    return response;
}
exports.prepareParameters = prepareParameters;
