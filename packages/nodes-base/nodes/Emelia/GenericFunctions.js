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
exports.emeliaApiTest = exports.loadResource = exports.emeliaApiRequest = exports.emeliaGraphqlRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an authenticated GraphQL request to Emelia.
 */
function emeliaGraphqlRequest(body = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield emeliaApiRequest.call(this, 'POST', '/graphql', body);
        if (response.errors) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), response);
        }
        return response;
    });
}
exports.emeliaGraphqlRequest = emeliaGraphqlRequest;
/**
 * Make an authenticated REST API request to Emelia, used for trigger node.
 */
function emeliaApiRequest(method, endpoint, body = {}, qs = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { apiKey } = yield this.getCredentials('emeliaApi');
        const options = {
            headers: {
                Authorization: apiKey,
            },
            method,
            body,
            qs,
            uri: `https://graphql.emelia.io${endpoint}`,
            json: true,
        };
        try {
            return yield this.helpers.request.call(this, options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.emeliaApiRequest = emeliaApiRequest;
/**
 * Load resources so that the user can select them easily.
 */
function loadResource(resource) {
    return __awaiter(this, void 0, void 0, function* () {
        const mapping = {
            campaign: {
                query: `
				query GetCampaigns {
					campaigns {
						_id
						name
					}
				}`,
                key: 'campaigns',
            },
            contactList: {
                query: `
			query GetContactLists {
				contact_lists {
					_id
					name
				}
			}`,
                key: 'contact_lists',
            },
        };
        const responseData = yield emeliaGraphqlRequest.call(this, { query: mapping[resource].query });
        return responseData.data[mapping[resource].key].map((campaign) => ({
            name: campaign.name,
            value: campaign._id,
        }));
    });
}
exports.loadResource = loadResource;
function emeliaApiTest(credential) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = credential.data;
        const body = {
            query: `
				query all_campaigns {
					all_campaigns {
						_id
						name
						status
						createdAt
						stats {
							mailsSent
						}
					}
				}`,
            operationName: 'all_campaigns',
        };
        const options = {
            headers: {
                Authorization: credentials === null || credentials === void 0 ? void 0 : credentials.apiKey,
            },
            method: 'POST',
            body,
            uri: `https://graphql.emelia.io/graphql`,
            json: true,
        };
        try {
            yield this.helpers.request(options);
        }
        catch (error) {
            return {
                status: 'Error',
                message: `Connection details not valid: ${error.message}`,
            };
        }
        return {
            status: 'OK',
            message: 'Authentication successful!',
        };
    });
}
exports.emeliaApiTest = emeliaApiTest;
