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
exports.getWorkflowTemplate = exports.getTemplateById = exports.getCollectionById = exports.getWorkflows = exports.getCollections = exports.getCategories = exports.testHealthEndpoint = void 0;
const helpers_1 = require("./helpers");
function stringifyArray(arr) {
    return arr.join(',');
}
function testHealthEndpoint(apiEndpoint) {
    return (0, helpers_1.get)(apiEndpoint, '/health');
}
exports.testHealthEndpoint = testHealthEndpoint;
function getCategories(apiEndpoint, headers) {
    return (0, helpers_1.get)(apiEndpoint, '/templates/categories', undefined, headers);
}
exports.getCategories = getCategories;
function getCollections(apiEndpoint, query, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, helpers_1.get)(apiEndpoint, '/templates/collections', { category: stringifyArray(query.categories || []), search: query.search }, headers);
    });
}
exports.getCollections = getCollections;
function getWorkflows(apiEndpoint, query, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, helpers_1.get)(apiEndpoint, '/templates/workflows', { skip: query.skip, rows: query.limit, category: stringifyArray(query.categories), search: query.search }, headers);
    });
}
exports.getWorkflows = getWorkflows;
function getCollectionById(apiEndpoint, collectionId, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, helpers_1.get)(apiEndpoint, `/templates/collections/${collectionId}`, undefined, headers);
    });
}
exports.getCollectionById = getCollectionById;
function getTemplateById(apiEndpoint, templateId, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, helpers_1.get)(apiEndpoint, `/templates/workflows/${templateId}`, undefined, headers);
    });
}
exports.getTemplateById = getTemplateById;
function getWorkflowTemplate(apiEndpoint, templateId, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, helpers_1.get)(apiEndpoint, `/workflows/templates/${templateId}`, undefined, headers);
    });
}
exports.getWorkflowTemplate = getWorkflowTemplate;
