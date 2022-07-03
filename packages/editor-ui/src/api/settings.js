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
exports.submitValueSurvey = exports.submitContactInfo = exports.getPromptsData = exports.getSettings = void 0;
const helpers_1 = require("./helpers");
const constants_1 = require("@/constants");
function getSettings(context) {
    return (0, helpers_1.makeRestApiRequest)(context, 'GET', '/settings');
}
exports.getSettings = getSettings;
function getPromptsData(instanceId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, helpers_1.get)(constants_1.N8N_IO_BASE_URL, '/prompts', {}, { 'n8n-instance-id': instanceId, 'n8n-user-id': userId });
    });
}
exports.getPromptsData = getPromptsData;
function submitContactInfo(instanceId, userId, email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, helpers_1.post)(constants_1.N8N_IO_BASE_URL, '/prompt', { email }, { 'n8n-instance-id': instanceId, 'n8n-user-id': userId });
    });
}
exports.submitContactInfo = submitContactInfo;
function submitValueSurvey(instanceId, userId, params) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, helpers_1.post)(constants_1.N8N_IO_BASE_URL, '/value-survey', params, { 'n8n-instance-id': instanceId, 'n8n-user-id': userId });
    });
}
exports.submitValueSurvey = submitValueSurvey;
