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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getId = exports.populate = exports.setCount = exports.formatResults = exports.formatFeed = exports.formatSearch = exports.toUnixEpoch = exports.extractErrorDescription = exports.parseXml = exports.splunkApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const xml2js_1 = require("xml2js");
function splunkApiRequest(method, endpoint, body = {}, qs = {}) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { authToken, baseUrl, allowUnauthorizedCerts, } = yield this.getCredentials('splunkApi');
        const options = {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method,
            form: body,
            qs,
            uri: `${baseUrl}${endpoint}`,
            json: true,
            rejectUnauthorized: !allowUnauthorizedCerts,
            useQuerystring: true, // serialize roles array as `roles=A&roles=B`
        };
        if (!Object.keys(body).length) {
            delete options.body;
        }
        if (!Object.keys(qs).length) {
            delete options.qs;
        }
        try {
            return yield this.helpers.request(options).then(parseXml);
        }
        catch (error) {
            if (((_a = error === null || error === void 0 ? void 0 : error.cause) === null || _a === void 0 ? void 0 : _a.code) === 'ECONNREFUSED') {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), Object.assign(Object.assign({}, error), { code: 401 }));
            }
            const rawError = yield parseXml(error.error);
            error = extractErrorDescription(rawError);
            if ('fatal' in error) {
                error = { error: error.fatal };
            }
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.splunkApiRequest = splunkApiRequest;
// ----------------------------------------
//                 utils
// ----------------------------------------
function parseXml(xml) {
    return new Promise((resolve, reject) => {
        (0, xml2js_1.parseString)(xml, { explicitArray: false }, (error, result) => {
            error ? reject(error) : resolve(result);
        });
    });
}
exports.parseXml = parseXml;
function extractErrorDescription(rawError) {
    var _a;
    const messages = (_a = rawError.response) === null || _a === void 0 ? void 0 : _a.messages;
    return messages
        ? { [messages.msg.$.type.toLowerCase()]: messages.msg._ }
        : rawError;
}
exports.extractErrorDescription = extractErrorDescription;
function toUnixEpoch(timestamp) {
    return Date.parse(timestamp) / 1000;
}
exports.toUnixEpoch = toUnixEpoch;
// ----------------------------------------
//            search formatting
// ----------------------------------------
function formatSearch(responseData) {
    const { entry: entries } = responseData;
    if (!entries)
        return [];
    return Array.isArray(entries)
        ? entries.map(formatEntry)
        : [formatEntry(entries)];
}
exports.formatSearch = formatSearch;
// ----------------------------------------
//            feed formatting
// ----------------------------------------
function formatFeed(responseData) {
    const { entry: entries } = responseData.feed;
    if (!entries)
        return [];
    return Array.isArray(entries)
        ? entries.map(formatEntry)
        : [formatEntry(entries)];
}
exports.formatFeed = formatFeed;
// ----------------------------------------
//            result formatting
// ----------------------------------------
function formatResults(responseData) {
    const results = responseData.results.result;
    if (!results)
        return [];
    return Array.isArray(results)
        ? results.map(r => formatResult(r.field))
        : [formatResult(results.field)];
}
exports.formatResults = formatResults;
/* tslint:disable: no-any */
function formatResult(field) {
    return field.reduce((acc, cur) => {
        acc = Object.assign(Object.assign({}, acc), compactResult(cur));
        return acc;
    }, {});
}
function compactResult(splunkObject) {
    var _a, _b, _c;
    if (typeof splunkObject !== 'object') {
        return {};
    }
    if (Array.isArray(splunkObject === null || splunkObject === void 0 ? void 0 : splunkObject.value) &&
        ((_a = splunkObject === null || splunkObject === void 0 ? void 0 : splunkObject.value[0]) === null || _a === void 0 ? void 0 : _a.text)) {
        return {
            [splunkObject.$.k]: splunkObject.value
                .map((v) => v.text)
                .join(','),
        };
    }
    if (!((_b = splunkObject === null || splunkObject === void 0 ? void 0 : splunkObject.$) === null || _b === void 0 ? void 0 : _b.k) || !((_c = splunkObject === null || splunkObject === void 0 ? void 0 : splunkObject.value) === null || _c === void 0 ? void 0 : _c.text)) {
        return {};
    }
    return {
        [splunkObject.$.k]: splunkObject.value.text,
    };
}
// ----------------------------------------
//            entry formatting
// ----------------------------------------
function formatEntry(entry) {
    const { content, link } = entry, rest = __rest(entry, ["content", "link"]);
    const formattedEntry = Object.assign(Object.assign({}, rest), formatEntryContent(content));
    if (formattedEntry.id) {
        formattedEntry.entryUrl = formattedEntry.id;
        formattedEntry.id = formattedEntry.id.split('/').pop();
    }
    return formattedEntry;
}
function formatEntryContent(content) {
    return content['s:dict']['s:key'].reduce((acc, cur) => {
        acc = Object.assign(Object.assign({}, acc), compactEntryContent(cur));
        return acc;
    }, {});
}
function compactEntryContent(splunkObject) {
    if (typeof splunkObject !== 'object') {
        return {};
    }
    if (Array.isArray(splunkObject)) {
        return splunkObject.reduce((acc, cur) => {
            acc = Object.assign(Object.assign({}, acc), compactEntryContent(cur));
            return acc;
        }, {});
    }
    if (splunkObject['s:dict']) {
        const obj = splunkObject['s:dict']['s:key'];
        return { [splunkObject.$.name]: compactEntryContent(obj) };
    }
    if (splunkObject['s:list']) {
        const items = splunkObject['s:list']['s:item'];
        return { [splunkObject.$.name]: items };
    }
    if (splunkObject._) {
        return {
            [splunkObject.$.name]: splunkObject._,
        };
    }
    return {
        [splunkObject.$.name]: '',
    };
}
// ----------------------------------------
//             param loaders
// ----------------------------------------
/**
 * Set count of entries to retrieve.
 */
function setCount(qs) {
    qs.count = this.getNodeParameter('returnAll', 0)
        ? 0
        : this.getNodeParameter('limit', 0);
}
exports.setCount = setCount;
function populate(source, destination) {
    if (Object.keys(source).length) {
        Object.assign(destination, source);
    }
}
exports.populate = populate;
/**
 * Retrieve an ID, with tolerance when contained in an endpoint.
 * The field `id` in Splunk API responses is a full link.
 */
function getId(i, idType, endpoint) {
    const id = this.getNodeParameter(idType, i);
    return id.includes(endpoint)
        ? id.split(endpoint).pop()
        : id;
}
exports.getId = getId;
