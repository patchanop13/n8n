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
exports.getHomeAssistantServices = exports.getHomeAssistantEntities = exports.homeAssistantApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
function homeAssistantApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('homeAssistantApi');
        let options = {
            headers: {
                Authorization: `Bearer ${credentials.accessToken}`,
            },
            method,
            qs,
            body,
            uri: uri !== null && uri !== void 0 ? uri : `${credentials.ssl === true ? 'https' : 'http'}://${credentials.host}:${credentials.port}/api${resource}`,
            json: true,
        };
        options = Object.assign({}, options, option);
        if (Object.keys(options.body).length === 0) {
            delete options.body;
        }
        try {
            if (this.helpers.request) {
                return yield this.helpers.request(options);
            }
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.homeAssistantApiRequest = homeAssistantApiRequest;
function getHomeAssistantEntities(domain = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        const entities = yield homeAssistantApiRequest.call(this, 'GET', '/states');
        for (const entity of entities) {
            const entityId = entity.entity_id;
            if (domain === '' || domain && entityId.startsWith(domain)) {
                const entityName = entity.attributes.friendly_name || entityId;
                returnData.push({
                    name: entityName,
                    value: entityId,
                });
            }
        }
        return returnData;
    });
}
exports.getHomeAssistantEntities = getHomeAssistantEntities;
function getHomeAssistantServices(domain = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        const services = yield homeAssistantApiRequest.call(this, 'GET', '/services');
        if (domain === '') {
            // If no domain specified return domains
            const domains = services.map(({ domain }) => domain).sort();
            returnData.push(...domains.map((service) => ({ name: service, value: service })));
            return returnData;
        }
        else {
            // If we have a domain, return all relevant services
            const domainServices = services.filter((service) => service.domain === domain);
            for (const domainService of domainServices) {
                for (const [serviceID, value] of Object.entries(domainService.services)) {
                    const serviceProperties = value;
                    const serviceName = serviceProperties.description || serviceID;
                    returnData.push({
                        name: serviceName,
                        value: serviceID,
                    });
                }
            }
        }
        return returnData;
    });
}
exports.getHomeAssistantServices = getHomeAssistantServices;
