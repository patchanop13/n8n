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
exports.Kitemaker = void 0;
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("./GenericFunctions");
const queries_1 = require("./queries");
const mutations_1 = require("./mutations");
class Kitemaker {
    constructor() {
        this.description = {
            displayName: 'Kitemaker',
            name: 'kitemaker',
            icon: 'file:kitemaker.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
            description: 'Consume the Kitemaker GraphQL API',
            defaults: {
                name: 'Kitemaker',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'kitemakerApi',
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
                            name: 'Organization',
                            value: 'organization',
                        },
                        {
                            name: 'Space',
                            value: 'space',
                        },
                        {
                            name: 'User',
                            value: 'user',
                        },
                        {
                            name: 'Work Item',
                            value: 'workItem',
                        },
                    ],
                    default: 'workItem',
                    required: true,
                },
                ...descriptions_1.organizationOperations,
                ...descriptions_1.spaceOperations,
                ...descriptions_1.spaceFields,
                ...descriptions_1.userOperations,
                ...descriptions_1.userFields,
                ...descriptions_1.workItemOperations,
                ...descriptions_1.workItemFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getLabels() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const responseData = yield GenericFunctions_1.kitemakerRequest.call(this, { query: queries_1.getLabels });
                        const { data: { organization: { spaces } } } = responseData;
                        return (0, GenericFunctions_1.createLoadOptions)(spaces[0].labels);
                    });
                },
                getSpaces() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const responseData = yield GenericFunctions_1.kitemakerRequest.call(this, { query: queries_1.getSpaces });
                        const { data: { organization: { spaces } } } = responseData;
                        return (0, GenericFunctions_1.createLoadOptions)(spaces);
                    });
                },
                getStatuses() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const spaceId = this.getNodeParameter('spaceId', 0);
                        if (!spaceId.length) {
                            throw new Error('Please choose a space to set for the work item to create.');
                        }
                        const responseData = yield GenericFunctions_1.kitemakerRequest.call(this, { query: queries_1.getStatuses });
                        const { data: { organization: { spaces } } } = responseData;
                        const space = spaces.find((e) => e.id === spaceId);
                        return (0, GenericFunctions_1.createLoadOptions)(space.statuses);
                    });
                },
                getUsers() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const responseData = yield GenericFunctions_1.kitemakerRequest.call(this, { query: queries_1.getUsers });
                        const { data: { organization: { users } } } = responseData;
                        return (0, GenericFunctions_1.createLoadOptions)(users);
                    });
                },
                getWorkItems() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const spaceId = this.getNodeParameter('spaceId', 0);
                        const responseData = yield GenericFunctions_1.kitemakerRequest.call(this, {
                            query: queries_1.getWorkItems,
                            variables: { spaceId },
                        });
                        const { data: { workItems: { workItems } } } = responseData;
                        return (0, GenericFunctions_1.createLoadOptions)(workItems);
                    });
                },
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let responseData;
            const returnData = [];
            // https://github.com/kitemakerhq/docs/blob/main/kitemaker.graphql
            for (let i = 0; i < items.length; i++) {
                if (resource === 'organization') {
                    // *********************************************************************
                    //                           organization
                    // *********************************************************************
                    if (operation === 'get') {
                        // ----------------------------------
                        //         organization: get
                        // ----------------------------------
                        responseData = yield GenericFunctions_1.kitemakerRequest.call(this, {
                            query: queries_1.getOrganization,
                        });
                        returnData.push(responseData.data.organization);
                    }
                }
                else if (resource === 'space') {
                    // *********************************************************************
                    //                             space
                    // *********************************************************************
                    if (operation === 'getAll') {
                        // ----------------------------------
                        //          space: getAll
                        // ----------------------------------
                        const allItems = yield GenericFunctions_1.kitemakerRequestAllItems.call(this, {
                            query: queries_1.getAllSpaces,
                            variables: {},
                        });
                        returnData.push(...allItems);
                    }
                }
                else if (resource === 'user') {
                    // *********************************************************************
                    //                             user
                    // *********************************************************************
                    if (operation === 'getAll') {
                        // ----------------------------------
                        //          user: getAll
                        // ----------------------------------
                        const allItems = yield GenericFunctions_1.kitemakerRequestAllItems.call(this, {
                            query: queries_1.getAllUsers,
                            variables: {},
                        });
                        returnData.push(...allItems);
                    }
                }
                else if (resource === 'workItem') {
                    // *********************************************************************
                    //                             workItem
                    // *********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------
                        //         workItem: create
                        // ----------------------------------
                        const input = {
                            title: this.getNodeParameter('title', i),
                            statusId: this.getNodeParameter('statusId', i),
                        };
                        if (!input.statusId.length) {
                            throw new Error('Please enter a status to set for the work item to create.');
                        }
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(input, additionalFields);
                        }
                        responseData = yield GenericFunctions_1.kitemakerRequest.call(this, {
                            query: mutations_1.createWorkItem,
                            variables: { input },
                        });
                        returnData.push(responseData.data.createWorkItem.workItem);
                    }
                    else if (operation === 'get') {
                        // ----------------------------------
                        //         workItem: get
                        // ----------------------------------
                        const workItemId = this.getNodeParameter('workItemId', i);
                        responseData = yield GenericFunctions_1.kitemakerRequest.call(this, {
                            query: queries_1.getWorkItem,
                            variables: { workItemId },
                        });
                        returnData.push(responseData.data.workItem);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------
                        //         workItem: getAll
                        // ----------------------------------
                        const allItems = yield GenericFunctions_1.kitemakerRequestAllItems.call(this, {
                            query: queries_1.getAllWorkItems,
                            variables: {
                                spaceId: this.getNodeParameter('spaceId', i),
                            },
                        });
                        returnData.push(...allItems);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------
                        //         workItem: update
                        // ----------------------------------
                        const input = {
                            id: this.getNodeParameter('workItemId', i),
                        };
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (!Object.keys(updateFields).length) {
                            throw new Error('Please enter at least one field to update for the work item.');
                        }
                        Object.assign(input, updateFields);
                        responseData = yield GenericFunctions_1.kitemakerRequest.call(this, {
                            query: mutations_1.editWorkItem,
                            variables: { input },
                        });
                        returnData.push(responseData.data.editWorkItem.workItem);
                    }
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Kitemaker = Kitemaker;
