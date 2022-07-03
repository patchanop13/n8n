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
exports.HaloPSA = void 0;
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("./GenericFunctions");
class HaloPSA {
    constructor() {
        this.description = {
            displayName: 'HaloPSA',
            name: 'haloPSA',
            icon: 'file:halopsa.svg',
            group: ['input'],
            version: 1,
            description: 'Consume HaloPSA API',
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            defaults: {
                name: 'HaloPSA',
                color: '#fd314e',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'haloPSAApi',
                    required: true,
                    testedBy: 'haloPSAApiCredentialTest',
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
                            name: 'Client',
                            value: 'client',
                        },
                        {
                            name: 'Site',
                            value: 'site',
                        },
                        {
                            name: 'Ticket',
                            value: 'ticket',
                        },
                        {
                            name: 'User',
                            value: 'user',
                        },
                    ],
                    default: 'client',
                    required: true,
                },
                ...descriptions_1.clientOperations,
                ...descriptions_1.clientFields,
                ...descriptions_1.ticketOperations,
                ...descriptions_1.ticketFields,
                ...descriptions_1.siteOperations,
                ...descriptions_1.siteFields,
                ...descriptions_1.userOperations,
                ...descriptions_1.userFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getHaloPSASites() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const tokens = yield GenericFunctions_1.getAccessTokens.call(this);
                        const response = (yield GenericFunctions_1.haloPSAApiRequestAllItems.call(this, 'sites', 'GET', '/site', tokens.access_token));
                        const options = response.map((site) => {
                            return {
                                name: site.clientsite_name,
                                value: site.id,
                            };
                        });
                        return options.sort((a, b) => a.name.localeCompare(b.name));
                    });
                },
                getHaloPSAClients() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const tokens = yield GenericFunctions_1.getAccessTokens.call(this);
                        const response = (yield GenericFunctions_1.haloPSAApiRequestAllItems.call(this, 'clients', 'GET', '/Client', tokens.access_token));
                        const options = response.map((client) => {
                            return {
                                name: client.name,
                                value: client.id,
                            };
                        });
                        return options.sort((a, b) => a.name.localeCompare(b.name));
                    });
                },
                getHaloPSATicketsTypes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const tokens = yield GenericFunctions_1.getAccessTokens.call(this);
                        const response = (yield GenericFunctions_1.haloPSAApiRequest.call(this, 'GET', `/TicketType`, tokens.access_token, {}));
                        const options = response.map((ticket) => {
                            return {
                                name: ticket.name,
                                value: ticket.id,
                            };
                        });
                        return options
                            .filter((ticket) => {
                            if (
                            // folowing types throws error 400 - "CODE:APP03/2 Please select the CAB members to approve"
                            ticket.name.includes('Request') ||
                                ticket.name.includes('Offboarding') ||
                                ticket.name.includes('Onboarding') ||
                                ticket.name.includes('Other Hardware') ||
                                ticket.name.includes('Software Change')) {
                                return false;
                            }
                            return true;
                        })
                            .sort((a, b) => a.name.localeCompare(b.name));
                    });
                },
                getHaloPSAAgents() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const tokens = yield GenericFunctions_1.getAccessTokens.call(this);
                        const response = (yield GenericFunctions_1.haloPSAApiRequest.call(this, 'GET', `/agent`, tokens.access_token, {}));
                        const options = response.map((agent) => {
                            return {
                                name: agent.name,
                                value: agent.id,
                            };
                        });
                        return options.sort((a, b) => a.name.localeCompare(b.name));
                    });
                },
            },
            credentialTest: {
                haloPSAApiCredentialTest(credential) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield GenericFunctions_1.validateCredentials.call(this, credential.data);
                        }
                        catch (error) {
                            return {
                                status: 'Error',
                                message: error.message,
                            };
                        }
                        return {
                            status: 'OK',
                            message: 'Connection successful!',
                        };
                    });
                },
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            let responseData;
            const tokens = yield GenericFunctions_1.getAccessTokens.call(this);
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            //====================================================================
            //                        Main Loop
            //====================================================================
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'client') {
                        const simplifiedOutput = ['id', 'name', 'notes', 'is_vip', 'website'];
                        if (operation === 'create') {
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const name = this.getNodeParameter('clientName', i);
                            const body = Object.assign({ name }, additionalFields);
                            responseData = yield GenericFunctions_1.haloPSAApiRequest.call(this, 'POST', '/client', tokens.access_token, [body]);
                        }
                        if (operation === 'delete') {
                            const clientId = this.getNodeParameter('clientId', i);
                            // const reasign = this.getNodeParameter('reasign', i) as boolean;
                            // if (reasign) {
                            // 	const reasigmentCliendId = this.getNodeParameter('reasigmentCliendId', i) as string;
                            // 	await reasignTickets.call(this, clientId, reasigmentCliendId, tokens.access_token);
                            // }
                            responseData = yield GenericFunctions_1.haloPSAApiRequest.call(this, 'DELETE', `/client/${clientId}`, tokens.access_token);
                        }
                        if (operation === 'get') {
                            const clientId = this.getNodeParameter('clientId', i);
                            const simplify = this.getNodeParameter('simplify', i);
                            let response;
                            response = yield GenericFunctions_1.haloPSAApiRequest.call(this, 'GET', `/client/${clientId}`, tokens.access_token);
                            responseData = simplify
                                ? (0, GenericFunctions_1.simplifyHaloPSAGetOutput)([response], simplifiedOutput)
                                : response;
                        }
                        if (operation === 'getAll') {
                            const filters = this.getNodeParameter('filters', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const simplify = this.getNodeParameter('simplify', i);
                            const qs = {};
                            let response;
                            Object.assign(qs, filters, (0, GenericFunctions_1.qsSetStatus)(filters.activeStatus));
                            if (returnAll) {
                                response = yield GenericFunctions_1.haloPSAApiRequestAllItems.call(this, 'clients', 'GET', `/client`, tokens.access_token, {}, qs);
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                qs.count = limit;
                                const { clients } = yield GenericFunctions_1.haloPSAApiRequest.call(this, 'GET', `/client`, tokens.access_token, {}, qs);
                                response = clients;
                            }
                            responseData = simplify
                                ? (0, GenericFunctions_1.simplifyHaloPSAGetOutput)(response, simplifiedOutput)
                                : response;
                        }
                        if (operation === 'update') {
                            const clientId = this.getNodeParameter('clientId', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = Object.assign({ id: clientId }, updateFields);
                            responseData = yield GenericFunctions_1.haloPSAApiRequest.call(this, 'POST', '/client', tokens.access_token, [body]);
                        }
                    }
                    if (resource === 'site') {
                        const simplifiedOutput = [
                            'id',
                            'name',
                            'client_id',
                            'maincontact_name',
                            'notes',
                            'phonenumber',
                        ];
                        if (operation === 'create') {
                            const name = this.getNodeParameter('siteName', i);
                            const clientId = this.getNodeParameter('clientId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = Object.assign({ name, client_id: clientId }, additionalFields);
                            responseData = yield GenericFunctions_1.haloPSAApiRequest.call(this, 'POST', '/site', tokens.access_token, [body]);
                        }
                        if (operation === 'delete') {
                            const siteId = this.getNodeParameter('siteId', i);
                            responseData = yield GenericFunctions_1.haloPSAApiRequest.call(this, 'DELETE', `/site/${siteId}`, tokens.access_token);
                        }
                        if (operation === 'get') {
                            const siteId = this.getNodeParameter('siteId', i);
                            const simplify = this.getNodeParameter('simplify', i);
                            let response;
                            response = yield GenericFunctions_1.haloPSAApiRequest.call(this, 'GET', `/site/${siteId}`, tokens.access_token);
                            responseData = simplify
                                ? (0, GenericFunctions_1.simplifyHaloPSAGetOutput)([response], simplifiedOutput)
                                : response;
                        }
                        if (operation === 'getAll') {
                            const filters = this.getNodeParameter('filters', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const simplify = this.getNodeParameter('simplify', i);
                            const qs = {};
                            let response;
                            Object.assign(qs, filters, (0, GenericFunctions_1.qsSetStatus)(filters.activeStatus));
                            if (returnAll) {
                                response = yield GenericFunctions_1.haloPSAApiRequestAllItems.call(this, 'sites', 'GET', `/site`, tokens.access_token, {}, qs);
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                qs.count = limit;
                                const { sites } = yield GenericFunctions_1.haloPSAApiRequest.call(this, 'GET', `/site`, tokens.access_token, {}, qs);
                                response = sites;
                            }
                            responseData = simplify
                                ? (0, GenericFunctions_1.simplifyHaloPSAGetOutput)(response, simplifiedOutput)
                                : response;
                        }
                        if (operation === 'update') {
                            const siteId = this.getNodeParameter('siteId', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = Object.assign({ id: siteId }, updateFields);
                            responseData = yield GenericFunctions_1.haloPSAApiRequest.call(this, 'POST', '/site', tokens.access_token, [body]);
                        }
                    }
                    if (resource === 'ticket') {
                        const simplifiedOutput = [
                            'id',
                            'summary',
                            'details',
                            'agent_id',
                            'startdate',
                            'targetdate',
                        ];
                        if (operation === 'create') {
                            const summary = this.getNodeParameter('summary', i);
                            const details = this.getNodeParameter('details', i);
                            const ticketType = this.getNodeParameter('ticketType', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = Object.assign({ tickettype_id: ticketType, summary,
                                details }, additionalFields);
                            responseData = yield GenericFunctions_1.haloPSAApiRequest.call(this, 'POST', '/tickets', tokens.access_token, [body]);
                        }
                        if (operation === 'delete') {
                            const ticketId = this.getNodeParameter('ticketId', i);
                            responseData = yield GenericFunctions_1.haloPSAApiRequest.call(this, 'DELETE', `/tickets/${ticketId}`, tokens.access_token);
                        }
                        if (operation === 'get') {
                            const ticketId = this.getNodeParameter('ticketId', i);
                            const simplify = this.getNodeParameter('simplify', i);
                            let response;
                            response = yield GenericFunctions_1.haloPSAApiRequest.call(this, 'GET', `/tickets/${ticketId}`, tokens.access_token);
                            responseData = simplify
                                ? (0, GenericFunctions_1.simplifyHaloPSAGetOutput)([response], simplifiedOutput)
                                : response;
                        }
                        if (operation === 'getAll') {
                            const filters = this.getNodeParameter('filters', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const simplify = this.getNodeParameter('simplify', i);
                            const qs = {};
                            let response;
                            Object.assign(qs, filters, (0, GenericFunctions_1.qsSetStatus)(filters.activeStatus));
                            if (returnAll) {
                                response = yield GenericFunctions_1.haloPSAApiRequestAllItems.call(this, 'tickets', 'GET', `/tickets`, tokens.access_token, {}, qs);
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                qs.count = limit;
                                const { tickets } = yield GenericFunctions_1.haloPSAApiRequest.call(this, 'GET', `/tickets`, tokens.access_token, {}, qs);
                                response = tickets;
                            }
                            responseData = simplify
                                ? (0, GenericFunctions_1.simplifyHaloPSAGetOutput)(response, simplifiedOutput)
                                : response;
                        }
                        if (operation === 'update') {
                            const ticketId = this.getNodeParameter('ticketId', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = Object.assign({ id: ticketId }, updateFields);
                            responseData = yield GenericFunctions_1.haloPSAApiRequest.call(this, 'POST', '/tickets', tokens.access_token, [body]);
                        }
                    }
                    if (resource === 'user') {
                        const simplifiedOutput = [
                            'id',
                            'name',
                            'site_id',
                            'emailaddress',
                            'notes',
                            'surname',
                            'inactive',
                        ];
                        if (operation === 'create') {
                            const name = this.getNodeParameter('userName', i);
                            const siteId = this.getNodeParameter('siteId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = Object.assign({ name, site_id: siteId }, additionalFields);
                            responseData = yield GenericFunctions_1.haloPSAApiRequest.call(this, 'POST', '/users', tokens.access_token, [body]);
                        }
                        if (operation === 'delete') {
                            const userId = this.getNodeParameter('userId', i);
                            responseData = yield GenericFunctions_1.haloPSAApiRequest.call(this, 'DELETE', `/users/${userId}`, tokens.access_token);
                        }
                        if (operation === 'get') {
                            const userId = this.getNodeParameter('userId', i);
                            const simplify = this.getNodeParameter('simplify', i);
                            let response;
                            response = yield GenericFunctions_1.haloPSAApiRequest.call(this, 'GET', `/users/${userId}`, tokens.access_token);
                            responseData = simplify
                                ? (0, GenericFunctions_1.simplifyHaloPSAGetOutput)([response], simplifiedOutput)
                                : response;
                        }
                        if (operation === 'getAll') {
                            const filters = this.getNodeParameter('filters', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const simplify = this.getNodeParameter('simplify', i);
                            const qs = {};
                            let response;
                            Object.assign(qs, filters, (0, GenericFunctions_1.qsSetStatus)(filters.activeStatus));
                            if (returnAll) {
                                response = yield GenericFunctions_1.haloPSAApiRequestAllItems.call(this, 'users', 'GET', `/users`, tokens.access_token, {}, qs);
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                qs.count = limit;
                                const { users } = yield GenericFunctions_1.haloPSAApiRequest.call(this, 'GET', `/users`, tokens.access_token, {}, qs);
                                response = users;
                            }
                            responseData = simplify
                                ? (0, GenericFunctions_1.simplifyHaloPSAGetOutput)(response, simplifiedOutput)
                                : response;
                        }
                        if (operation === 'update') {
                            const userId = this.getNodeParameter('userId', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = Object.assign({ id: userId }, updateFields);
                            responseData = yield GenericFunctions_1.haloPSAApiRequest.call(this, 'POST', '/users', tokens.access_token, [body]);
                        }
                    }
                    if (Array.isArray(responseData)) {
                        returnData.push.apply(returnData, responseData);
                    }
                    else if (responseData !== undefined) {
                        returnData.push(responseData);
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ error: error.message });
                        continue;
                    }
                    throw error;
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.HaloPSA = HaloPSA;
