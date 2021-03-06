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
exports.ActionNetwork = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const descriptions_1 = require("./descriptions");
class ActionNetwork {
    constructor() {
        this.description = {
            displayName: 'Action Network',
            name: 'actionNetwork',
            icon: 'file:actionNetwork.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
            description: 'Consume the Action Network API',
            defaults: {
                name: 'Action Network',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'actionNetworkApi',
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
                            name: 'Attendance',
                            value: 'attendance',
                        },
                        {
                            name: 'Event',
                            value: 'event',
                        },
                        {
                            name: 'Person',
                            value: 'person',
                        },
                        {
                            name: 'Person Tag',
                            value: 'personTag',
                        },
                        {
                            name: 'Petition',
                            value: 'petition',
                        },
                        {
                            name: 'Signature',
                            value: 'signature',
                        },
                        {
                            name: 'Tag',
                            value: 'tag',
                        },
                    ],
                    default: 'attendance',
                },
                ...descriptions_1.attendanceOperations,
                ...descriptions_1.attendanceFields,
                ...descriptions_1.eventOperations,
                ...descriptions_1.eventFields,
                ...descriptions_1.personOperations,
                ...descriptions_1.personFields,
                ...descriptions_1.petitionOperations,
                ...descriptions_1.petitionFields,
                ...descriptions_1.signatureOperations,
                ...descriptions_1.signatureFields,
                ...descriptions_1.tagOperations,
                ...descriptions_1.tagFields,
                ...descriptions_1.personTagOperations,
                ...descriptions_1.personTagFields,
            ],
        };
        this.methods = {
            loadOptions: GenericFunctions_1.resourceLoaders,
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let response;
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'attendance') {
                        // **********************************************************************
                        //                               attendance
                        // **********************************************************************
                        // https://actionnetwork.org/docs/v2/attendances
                        if (operation === 'create') {
                            // ----------------------------------------
                            //            attendance: create
                            // ----------------------------------------
                            const personId = this.getNodeParameter('personId', i);
                            const eventId = this.getNodeParameter('eventId', i);
                            const body = (0, GenericFunctions_1.makeOsdiLink)(personId);
                            const endpoint = `/events/${eventId}/attendances`;
                            response = yield GenericFunctions_1.actionNetworkApiRequest.call(this, 'POST', endpoint, body);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //             attendance: get
                            // ----------------------------------------
                            const eventId = this.getNodeParameter('eventId', i);
                            const attendanceId = this.getNodeParameter('attendanceId', i);
                            const endpoint = `/events/${eventId}/attendances/${attendanceId}`;
                            response = yield GenericFunctions_1.actionNetworkApiRequest.call(this, 'GET', endpoint);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //            attendance: getAll
                            // ----------------------------------------
                            const eventId = this.getNodeParameter('eventId', i);
                            const endpoint = `/events/${eventId}/attendances`;
                            response = yield GenericFunctions_1.handleListing.call(this, 'GET', endpoint);
                        }
                    }
                    else if (resource === 'event') {
                        // **********************************************************************
                        //                                 event
                        // **********************************************************************
                        // https://actionnetwork.org/docs/v2/events
                        if (operation === 'create') {
                            // ----------------------------------------
                            //              event: create
                            // ----------------------------------------
                            const body = {
                                origin_system: this.getNodeParameter('originSystem', i),
                                title: this.getNodeParameter('title', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                Object.assign(body, (0, GenericFunctions_1.adjustEventPayload)(additionalFields));
                            }
                            response = yield GenericFunctions_1.actionNetworkApiRequest.call(this, 'POST', '/events', body);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //                event: get
                            // ----------------------------------------
                            const eventId = this.getNodeParameter('eventId', i);
                            response = yield GenericFunctions_1.actionNetworkApiRequest.call(this, 'GET', `/events/${eventId}`);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //              event: getAll
                            // ----------------------------------------
                            response = yield GenericFunctions_1.handleListing.call(this, 'GET', '/events');
                        }
                    }
                    else if (resource === 'person') {
                        // **********************************************************************
                        //                                 person
                        // **********************************************************************
                        // https://actionnetwork.org/docs/v2/people
                        if (operation === 'create') {
                            // ----------------------------------------
                            //              person: create
                            // ----------------------------------------
                            const emailAddresses = this.getNodeParameter('email_addresses', i);
                            const body = {
                                person: {
                                    email_addresses: [emailAddresses.email_addresses_fields], // only one accepted by API
                                },
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                Object.assign(body.person, (0, GenericFunctions_1.adjustPersonPayload)(additionalFields));
                            }
                            response = yield GenericFunctions_1.actionNetworkApiRequest.call(this, 'POST', '/people', body);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //               person: get
                            // ----------------------------------------
                            const personId = this.getNodeParameter('personId', i);
                            response = (yield GenericFunctions_1.actionNetworkApiRequest.call(this, 'GET', `/people/${personId}`));
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //              person: getAll
                            // ----------------------------------------
                            response = (yield GenericFunctions_1.handleListing.call(this, 'GET', '/people'));
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //              person: update
                            // ----------------------------------------
                            const personId = this.getNodeParameter('personId', i);
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if (Object.keys(updateFields).length) {
                                Object.assign(body, (0, GenericFunctions_1.adjustPersonPayload)(updateFields));
                            }
                            else {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}.`);
                            }
                            response = yield GenericFunctions_1.actionNetworkApiRequest.call(this, 'PUT', `/people/${personId}`, body);
                        }
                    }
                    else if (resource === 'petition') {
                        // **********************************************************************
                        //                                petition
                        // **********************************************************************
                        // https://actionnetwork.org/docs/v2/petitions
                        if (operation === 'create') {
                            // ----------------------------------------
                            //             petition: create
                            // ----------------------------------------
                            const body = {
                                origin_system: this.getNodeParameter('originSystem', i),
                                title: this.getNodeParameter('title', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                Object.assign(body, (0, GenericFunctions_1.adjustPetitionPayload)(additionalFields));
                            }
                            response = yield GenericFunctions_1.actionNetworkApiRequest.call(this, 'POST', '/petitions', body);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //              petition: get
                            // ----------------------------------------
                            const petitionId = this.getNodeParameter('petitionId', i);
                            const endpoint = `/petitions/${petitionId}`;
                            response = yield GenericFunctions_1.actionNetworkApiRequest.call(this, 'GET', endpoint);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //             petition: getAll
                            // ----------------------------------------
                            response = yield GenericFunctions_1.handleListing.call(this, 'GET', '/petitions');
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //             petition: update
                            // ----------------------------------------
                            const petitionId = this.getNodeParameter('petitionId', i);
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if (Object.keys(updateFields).length) {
                                Object.assign(body, (0, GenericFunctions_1.adjustPetitionPayload)(updateFields));
                            }
                            else {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}.`);
                            }
                            response = yield GenericFunctions_1.actionNetworkApiRequest.call(this, 'PUT', `/petitions/${petitionId}`, body);
                        }
                    }
                    else if (resource === 'signature') {
                        // **********************************************************************
                        //                               signature
                        // **********************************************************************
                        // https://actionnetwork.org/docs/v2/signatures
                        if (operation === 'create') {
                            // ----------------------------------------
                            //            signature: create
                            // ----------------------------------------
                            const personId = this.getNodeParameter('personId', i);
                            const petitionId = this.getNodeParameter('petitionId', i);
                            const body = (0, GenericFunctions_1.makeOsdiLink)(personId);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                Object.assign(body, additionalFields);
                            }
                            const endpoint = `/petitions/${petitionId}/signatures`;
                            response = yield GenericFunctions_1.actionNetworkApiRequest.call(this, 'POST', endpoint, body);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //              signature: get
                            // ----------------------------------------
                            const petitionId = this.getNodeParameter('petitionId', i);
                            const signatureId = this.getNodeParameter('signatureId', i);
                            const endpoint = `/petitions/${petitionId}/signatures/${signatureId}`;
                            response = yield GenericFunctions_1.actionNetworkApiRequest.call(this, 'GET', endpoint);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //            signature: getAll
                            // ----------------------------------------
                            const petitionId = this.getNodeParameter('petitionId', i);
                            const endpoint = `/petitions/${petitionId}/signatures`;
                            response = yield GenericFunctions_1.handleListing.call(this, 'GET', endpoint);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //            signature: update
                            // ----------------------------------------
                            const petitionId = this.getNodeParameter('petitionId', i);
                            const signatureId = this.getNodeParameter('signatureId', i);
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if (Object.keys(updateFields).length) {
                                Object.assign(body, updateFields);
                            }
                            else {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Please enter at least one field to update for the ${resource}.`);
                            }
                            const endpoint = `/petitions/${petitionId}/signatures/${signatureId}`;
                            response = yield GenericFunctions_1.actionNetworkApiRequest.call(this, 'PUT', endpoint, body);
                        }
                    }
                    else if (resource === 'tag') {
                        // **********************************************************************
                        //                                  tag
                        // **********************************************************************
                        // https://actionnetwork.org/docs/v2/tags
                        if (operation === 'create') {
                            // ----------------------------------------
                            //               tag: create
                            // ----------------------------------------
                            const body = {
                                name: this.getNodeParameter('name', i),
                            };
                            response = yield GenericFunctions_1.actionNetworkApiRequest.call(this, 'POST', '/tags', body);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //                 tag: get
                            // ----------------------------------------
                            const tagId = this.getNodeParameter('tagId', i);
                            response = yield GenericFunctions_1.actionNetworkApiRequest.call(this, 'GET', `/tags/${tagId}`);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //               tag: getAll
                            // ----------------------------------------
                            response = yield GenericFunctions_1.handleListing.call(this, 'GET', '/tags');
                        }
                    }
                    else if (resource === 'personTag') {
                        // **********************************************************************
                        //                                personTag
                        // **********************************************************************
                        // https://actionnetwork.org/docs/v2/taggings
                        if (operation === 'add') {
                            // ----------------------------------------
                            //             personTag: add
                            // ----------------------------------------
                            const personId = this.getNodeParameter('personId', i);
                            const tagId = this.getNodeParameter('tagId', i);
                            const body = (0, GenericFunctions_1.makeOsdiLink)(personId);
                            const endpoint = `/tags/${tagId}/taggings`;
                            response = yield GenericFunctions_1.actionNetworkApiRequest.call(this, 'POST', endpoint, body);
                        }
                        else if (operation === 'remove') {
                            // ----------------------------------------
                            //             personTag: remove
                            // ----------------------------------------
                            const tagId = this.getNodeParameter('tagId', i);
                            const taggingId = this.getNodeParameter('taggingId', i);
                            const endpoint = `/tags/${tagId}/taggings/${taggingId}`;
                            response = yield GenericFunctions_1.actionNetworkApiRequest.call(this, 'DELETE', endpoint);
                        }
                    }
                    const simplify = this.getNodeParameter('simple', i, false);
                    if (simplify) {
                        response = operation === 'getAll'
                            ? response.map((i) => (0, GenericFunctions_1.simplifyResponse)(i, resource))
                            : (0, GenericFunctions_1.simplifyResponse)(response, resource);
                    }
                    Array.isArray(response)
                        ? returnData.push(...response)
                        : returnData.push(response);
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
exports.ActionNetwork = ActionNetwork;
