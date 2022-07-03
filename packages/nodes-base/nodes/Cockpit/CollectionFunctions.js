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
exports.getAllCollectionNames = exports.getAllCollectionEntries = exports.createCollectionEntry = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
function createCollectionEntry(resourceName, data, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = {
            data,
        };
        if (id) {
            body.data = Object.assign({ _id: id }, body.data);
        }
        return GenericFunctions_1.cockpitApiRequest.call(this, 'post', `/collections/save/${resourceName}`, body);
    });
}
exports.createCollectionEntry = createCollectionEntry;
function getAllCollectionEntries(resourceName, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = {};
        if (options.fields) {
            const fields = options.fields.split(',').map(field => field.trim());
            const bodyFields = {
                _id: false,
            };
            for (const field of fields) {
                bodyFields[field] = true;
            }
            body.fields = bodyFields;
        }
        if (options.filter) {
            body.filter = JSON.parse(options.filter.toString());
        }
        if (options.limit) {
            body.limit = options.limit;
        }
        if (options.skip) {
            body.skip = options.skip;
        }
        if (options.sort) {
            body.sort = JSON.parse(options.sort.toString());
        }
        if (options.populate) {
            body.populate = options.populate;
        }
        body.simple = true;
        if (options.rawData) {
            body.simple = !options.rawData;
        }
        if (options.language) {
            body.lang = options.language;
        }
        return GenericFunctions_1.cockpitApiRequest.call(this, 'post', `/collections/get/${resourceName}`, body);
    });
}
exports.getAllCollectionEntries = getAllCollectionEntries;
function getAllCollectionNames() {
    return __awaiter(this, void 0, void 0, function* () {
        return GenericFunctions_1.cockpitApiRequest.call(this, 'GET', `/collections/listCollections`, {});
    });
}
exports.getAllCollectionNames = getAllCollectionNames;
