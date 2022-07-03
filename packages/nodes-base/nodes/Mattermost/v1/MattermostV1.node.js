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
exports.MattermostV1 = void 0;
const versionDescription_1 = require("./actions/versionDescription");
const methods_1 = require("./methods");
const router_1 = require("./actions/router");
class MattermostV1 {
    constructor(baseDescription) {
        this.methods = { loadOptions: methods_1.loadOptions };
        this.description = Object.assign(Object.assign({}, baseDescription), versionDescription_1.versionDescription);
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield router_1.router.call(this);
        });
    }
}
exports.MattermostV1 = MattermostV1;
