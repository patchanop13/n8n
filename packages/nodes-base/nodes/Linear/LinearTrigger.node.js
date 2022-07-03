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
exports.LinearTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class LinearTrigger {
    constructor() {
        this.description = {
            displayName: 'Linear Trigger',
            name: 'linearTrigger',
            icon: 'file:linear.svg',
            group: ['trigger'],
            version: 1,
            subtitle: '={{$parameter["triggerOn"]}}',
            description: 'Starts the workflow when Linear events occur',
            defaults: {
                name: 'Linear Trigger',
                color: '#D9DCF8',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'linearApi',
                    required: true,
                    testedBy: 'linearApiTest',
                },
            ],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'POST',
                    responseMode: 'onReceived',
                    path: 'webhook',
                },
            ],
            properties: [
                {
                    displayName: 'Team Name or ID',
                    name: 'teamId',
                    type: 'options',
                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
                    typeOptions: {
                        loadOptionsMethod: 'getTeams',
                    },
                    default: '',
                },
                {
                    displayName: 'Listen to Resources',
                    name: 'resources',
                    type: 'multiOptions',
                    options: [
                        {
                            name: 'Comment Reaction',
                            value: 'reaction',
                        },
                        {
                            name: 'Cycle',
                            value: 'cycle',
                        },
                        /* It's still on Alpha stage
                        {
                            name: 'Issue Attachment',
                            value: 'attachment',
                        },*/
                        {
                            name: 'Issue',
                            value: 'issue',
                        },
                        {
                            name: 'Issue Comment',
                            value: 'comment',
                        },
                        {
                            name: 'Issue Label',
                            value: 'issueLabel',
                        },
                        {
                            name: 'Project',
                            value: 'project',
                        },
                    ],
                    default: [],
                    required: true,
                },
            ],
        };
        this.methods = {
            loadOptions: {
                getTeams() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const body = {
                            query: `query Teams {
							 teams {
								nodes {
									id
									name
								}
							}
						}`,
                        };
                        const { data: { teams: { nodes } } } = yield GenericFunctions_1.linearApiRequest.call(this, body);
                        for (const node of nodes) {
                            returnData.push({
                                name: node.name,
                                value: node.id,
                            });
                        }
                        return returnData;
                    });
                },
            },
        };
        //@ts-ignore (because of request)
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        const teamId = this.getNodeParameter('teamId');
                        const body = {
                            query: `query {
							 webhooks {
									nodes {
										id
										url
										enabled
										team {
											id
											name
										}
									}
							}
						}`,
                        };
                        // Check all the webhooks which exist already if it is identical to the
                        // one that is supposed to get created.
                        const { data: { webhooks: { nodes } } } = yield GenericFunctions_1.linearApiRequest.call(this, body);
                        for (const node of nodes) {
                            if (node.url === webhookUrl &&
                                node.team.id === teamId &&
                                node.enabled === true) {
                                webhookData.webhookId = node.id;
                                return true;
                            }
                        }
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const teamId = this.getNodeParameter('teamId');
                        const resources = this.getNodeParameter('resources');
                        const body = {
                            query: `
						mutation webhookCreate($url: String!, $teamId: String!, $resources: [String!]!) {
							webhookCreate(
								input: {
									url: $url
									teamId: $teamId
									resourceTypes: $resources
								}
							) {
								success
								webhook {
									id
									enabled
								}
							}
						}`,
                            variables: {
                                url: webhookUrl,
                                teamId,
                                resources: resources.map(GenericFunctions_1.capitalizeFirstLetter),
                            },
                        };
                        const { data: { webhookCreate: { success, webhook: { id } } } } = yield GenericFunctions_1.linearApiRequest.call(this, body);
                        if (!success) {
                            return false;
                        }
                        webhookData.webhookId = id;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        if (webhookData.webhookId !== undefined) {
                            const body = {
                                query: `
							mutation webhookDelete($id: String!){
								webhookDelete(
									id: $id
								) {
									success
								}
							}`,
                                variables: {
                                    id: webhookData.webhookId,
                                },
                            };
                            try {
                                yield GenericFunctions_1.linearApiRequest.call(this, body);
                            }
                            catch (error) {
                                return false;
                            }
                            // Remove from the static workflow data so that it is clear
                            // that no webhooks are registred anymore
                            delete webhookData.webhookId;
                        }
                        return true;
                    });
                },
            },
        };
    }
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            const bodyData = this.getBodyData();
            return {
                workflowData: [
                    this.helpers.returnJsonArray(bodyData),
                ],
            };
        });
    }
}
exports.LinearTrigger = LinearTrigger;
