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
exports.getAllSingletonNames = exports.getSingleton = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
function getSingleton(resourceName) {
    return __awaiter(this, void 0, void 0, function* () {
        return GenericFunctions_1.cockpitApiRequest.call(this, 'get', `/singletons/get/${resourceName}`);
    });
}
exports.getSingleton = getSingleton;
function getAllSingletonNames() {
    return __awaiter(this, void 0, void 0, function* () {
        return GenericFunctions_1.cockpitApiRequest.call(this, 'GET', `/singletons/listSingletons`, {});
    });
}
exports.getAllSingletonNames = getAllSingletonNames;
