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
exports.MicrosoftGraphSecurity = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const descriptions_1 = require("./descriptions");
class MicrosoftGraphSecurity {
    constructor() {
        this.description = {
            displayName: 'Microsoft Graph Security',
            name: 'microsoftGraphSecurity',
            icon: 'file:microsoftGraph.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the Microsoft Graph Security API',
            defaults: {
                name: 'Microsoft Graph Security',
                color: '#0078d4',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'microsoftGraphSecurityOAuth2Api',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Secure Score',
                            value: 'secureScore',
                        },
                        {
                            name: 'Secure Score Control Profile',
                            value: 'secureScoreControlProfile',
                        },
                    ],
                    default: 'secureScore',
                },
                ...descriptions_1.secureScoreOperations,
                ...descriptions_1.secureScoreFields,
                ...descriptions_1.secureScoreControlProfileOperations,
                ...descriptions_1.secureScoreControlProfileFields,
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let responseData;
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'secureScore') {
                        // **********************************************************************
                        //                              secureScore
                        // **********************************************************************
                        if (operation === 'get') {
                            // ----------------------------------------
                            //             secureScore: get
                            // ----------------------------------------
                            // https://docs.microsoft.com/en-us/graph/api/securescore-get
                            const secureScoreId = this.getNodeParameter('secureScoreId', i);
                            responseData = yield GenericFunctions_1.msGraphSecurityApiRequest.call(this, 'GET', `/secureScores/${secureScoreId}`);
                            delete responseData['@odata.context'];
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //           secureScore: getAll
                            // ----------------------------------------
                            // https://docs.microsoft.com/en-us/graph/api/security-list-securescores
                            const qs = {};
                            const { filter, includeControlScores, } = this.getNodeParameter('filters', i);
                            if (filter) {
                                qs.$filter = (0, GenericFunctions_1.tolerateDoubleQuotes)(filter);
                            }
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            if (!returnAll) {
                                qs.$count = true;
                                qs.$top = this.getNodeParameter('limit', 0);
                            }
                            responseData = (yield GenericFunctions_1.msGraphSecurityApiRequest
                                .call(this, 'GET', '/secureScores', {}, qs)
                                .then(response => response.value));
                            if (!includeControlScores) {
                                responseData = responseData.map((_a) => {
                                    var { controlScores } = _a, rest = __rest(_a, ["controlScores"]);
                                    return rest;
                                });
                            }
                        }
                    }
                    else if (resource === 'secureScoreControlProfile') {
                        // **********************************************************************
                        //                       secureScoreControlProfile
                        // **********************************************************************
                        if (operation === 'get') {
                            // ----------------------------------------
                            //      secureScoreControlProfile: get
                            // ----------------------------------------
                            // https://docs.microsoft.com/en-us/graph/api/securescorecontrolprofile-get
                            const secureScoreControlProfileId = this.getNodeParameter('secureScoreControlProfileId', i);
                            const endpoint = `/secureScoreControlProfiles/${secureScoreControlProfileId}`;
                            responseData = yield GenericFunctions_1.msGraphSecurityApiRequest.call(this, 'GET', endpoint);
                            delete responseData['@odata.context'];
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //    secureScoreControlProfile: getAll
                            // ----------------------------------------
                            // https://docs.microsoft.com/en-us/graph/api/security-list-securescorecontrolprofiles
                            const qs = {};
                            const { filter } = this.getNodeParameter('filters', i);
                            if (filter) {
                                qs.$filter = (0, GenericFunctions_1.tolerateDoubleQuotes)(filter);
                            }
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            if (!returnAll) {
                                qs.$count = true;
                                qs.$top = this.getNodeParameter('limit', 0);
                            }
                            responseData = yield GenericFunctions_1.msGraphSecurityApiRequest
                                .call(this, 'GET', '/secureScoreControlProfiles', {}, qs)
                                .then(response => response.value);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //    secureScoreControlProfile: update
                            // ----------------------------------------
                            // https://docs.microsoft.com/en-us/graph/api/securescorecontrolprofile-update
                            const body = {
                                vendorInformation: {
                                    provider: this.getNodeParameter('provider', i),
                                    vendor: this.getNodeParameter('vendor', i),
                                },
                            };
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if (!Object.keys(updateFields).length) {
                                GenericFunctions_1.throwOnEmptyUpdate.call(this);
                            }
                            if (Object.keys(updateFields).length) {
                                Object.assign(body, updateFields);
                            }
                            const id = this.getNodeParameter('secureScoreControlProfileId', i);
                            const endpoint = `/secureScoreControlProfiles/${id}`;
                            const headers = { Prefer: 'return=representation' };
                            responseData = yield GenericFunctions_1.msGraphSecurityApiRequest.call(this, 'PATCH', endpoint, body, {}, headers);
                            delete responseData['@odata.context'];
                        }
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ error: error.message });
                        continue;
                    }
                    throw error;
                }
                Array.isArray(responseData)
                    ? returnData.push(...responseData)
                    : returnData.push(responseData);
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.MicrosoftGraphSecurity = MicrosoftGraphSecurity;
