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
exports.deleteTag = exports.updateTag = exports.createTag = exports.getTags = void 0;
const helpers_1 = require("./helpers");
function getTags(context, withUsageCount = false) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, helpers_1.makeRestApiRequest)(context, 'GET', '/tags', { withUsageCount });
    });
}
exports.getTags = getTags;
function createTag(context, params) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, helpers_1.makeRestApiRequest)(context, 'POST', '/tags', params);
    });
}
exports.createTag = createTag;
function updateTag(context, id, params) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, helpers_1.makeRestApiRequest)(context, 'PATCH', `/tags/${id}`, params);
    });
}
exports.updateTag = updateTag;
function deleteTag(context, id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, helpers_1.makeRestApiRequest)(context, 'DELETE', `/tags/${id}`);
    });
}
exports.deleteTag = deleteTag;
