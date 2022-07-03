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
exports.openThesaurusApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function openThesaurusApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let options = {
                headers: {
                    'User-Agent': 'https://n8n.io',
                },
                method,
                qs,
                body,
                uri: uri || `https://www.openthesaurus.de${resource}`,
                json: true,
            };
            options = Object.assign({}, options, option);
            options.qs.format = 'application/json';
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.openThesaurusApiRequest = openThesaurusApiRequest;
