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
exports.postEphemeral = void 0;
const transport_1 = require("../../../transport");
function postEphemeral(index) {
    return __awaiter(this, void 0, void 0, function* () {
        const qs = {};
        const requestMethod = 'POST';
        const endpoint = `posts/ephemeral`;
        const body = {
            user_id: this.getNodeParameter('userId', index),
            post: {
                channel_id: this.getNodeParameter('channelId', index),
                message: this.getNodeParameter('message', index),
            },
        };
        const responseData = yield transport_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
        return this.helpers.returnJsonArray(responseData);
    });
}
exports.postEphemeral = postEphemeral;
