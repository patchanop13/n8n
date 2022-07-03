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
exports.create = void 0;
const transport_1 = require("../../../transport");
function create(index) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = {};
        const qs = {};
        const requestMethod = 'POST';
        const endpoint = 'channels';
        const type = this.getNodeParameter('type', index);
        body.team_id = this.getNodeParameter('teamId', index);
        body.display_name = this.getNodeParameter('displayName', index);
        body.name = this.getNodeParameter('channel', index);
        body.type = type === 'public' ? 'O' : 'P';
        const responseData = yield transport_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
        return this.helpers.returnJsonArray(responseData);
    });
}
exports.create = create;
