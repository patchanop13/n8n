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
exports.WebflowTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class WebflowTrigger {
    constructor() {
        this.description = {
            displayName: 'Webflow Trigger',
            name: 'webflowTrigger',
            icon: 'file:webflow.svg',
            group: ['trigger'],
            version: 1,
            description: 'Handle Webflow events via webhooks',
            defaults: {
                name: 'Webflow Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'webflowApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'accessToken',
                            ],
                        },
                    },
                },
                {
                    name: 'webflowOAuth2Api',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'oAuth2',
                            ],
                        },
                    },
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
                    displayName: 'Authentication',
                    name: 'authentication',
                    type: 'options',
                    options: [
                        {
                            name: 'Access Token',
                            value: 'accessToken',
                        },
                        {
                            name: 'OAuth2',
                            value: 'oAuth2',
                        },
                    ],
                    default: 'accessToken',
                },
                {
                    displayName: 'Site Name or ID',
                    name: 'site',
                    type: 'options',
                    required: true,
                    default: '',
                    typeOptions: {
                        loadOptionsMethod: 'getSites',
                    },
                    description: 'Site that will trigger the events. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Event',
                    name: 'event',
                    type: 'options',
                    required: true,
                    options: [
                        {
                            name: 'Collection Item Created',
                            value: 'collection_item_created',
                        },
                        {
                            name: 'Collection Item Deleted',
                            value: 'collection_item_deleted',
                        },
                        {
                            name: 'Collection Item Updated',
                            value: 'collection_item_changed',
                        },
                        {
                            name: 'Ecomm Inventory Changed',
                            value: 'ecomm_inventory_changed',
                        },
                        {
                            name: 'Ecomm New Order',
                            value: 'ecomm_new_order',
                        },
                        {
                            name: 'Ecomm Order Changed',
                            value: 'ecomm_order_changed',
                        },
                        {
                            name: 'Form Submission',
                            value: 'form_submission',
                        },
                        {
                            name: 'Site Publish',
                            value: 'site_publish',
                        },
                    ],
                    default: 'form_submission',
                },
                // {
                // 	displayName: 'All collections',
                // 	name: 'allCollections',
                // 	type: 'boolean',
                // 	displayOptions: {
                // 		show: {
                // 			event: [
                // 				'collection_item_created',
                // 				'collection_item_changed',
                // 				'collection_item_deleted',
                // 			],
                // 		},
                // 	},
                // 	required: false,
                // 	default: true,
                // 	description: 'Receive events from all collections',
                // },
                // {
                // 	displayName: 'Collection',
                // 	name: 'collection',
                // 	type: 'options',
                // 	required: false,
                // 	default: '',
                // 	typeOptions: {
                // 		loadOptionsMethod: 'getCollections',
                // 		loadOptionsDependsOn: [
                // 			'site',
                // 		],
                // 	},
                // 	description: 'Collection that will trigger the events',
                // 	displayOptions: {
                // 		show: {
                // 			allCollections: [
                // 				false,
                // 			],
                // 		},
                // 	},
                // },
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the sites to display them to user so that he can
                // select them easily
                getSites() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const sites = yield GenericFunctions_1.webflowApiRequest.call(this, 'GET', '/sites');
                        for (const site of sites) {
                            const siteName = site.name;
                            const siteId = site._id;
                            returnData.push({
                                name: siteName,
                                value: siteId,
                            });
                        }
                        return returnData;
                    });
                },
                // async getCollections(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                // 	const returnData: INodePropertyOptions[] = [];
                // 	const siteId = this.getCurrentNodeParameter('site');
                // 	const collections = await webflowApiRequest.call(this, 'GET', `/sites/${siteId}/collections`);
                // 	for (const collection of collections) {
                // 		returnData.push({
                // 			name: collection.name,
                // 			value: collection._id,
                // 		});
                // 	}
                // 	return returnData;
                // },
            },
        };
        // @ts-ignore
        this.webhookMethods = {
            default: {
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const siteId = this.getNodeParameter('site');
                        if (webhookData.webhookId === undefined) {
                            return false;
                        }
                        const endpoint = `/sites/${siteId}/webhooks/${webhookData.webhookId}`;
                        try {
                            yield GenericFunctions_1.webflowApiRequest.call(this, 'GET', endpoint);
                        }
                        catch (error) {
                            return false;
                        }
                        return true;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        const siteId = this.getNodeParameter('site');
                        const event = this.getNodeParameter('event');
                        const endpoint = `/sites/${siteId}/webhooks`;
                        const body = {
                            site_id: siteId,
                            triggerType: event,
                            url: webhookUrl,
                        };
                        // if (event.startsWith('collection')) {
                        // 	const allCollections = this.getNodeParameter('allCollections') as boolean;
                        // 	if (allCollections === false) {
                        // 		body.filter = {
                        // 			'cid': this.getNodeParameter('collection') as string,
                        // 		};
                        // 	}
                        // }
                        const { _id } = yield GenericFunctions_1.webflowApiRequest.call(this, 'POST', endpoint, body);
                        webhookData.webhookId = _id;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        let responseData;
                        const webhookData = this.getWorkflowStaticData('node');
                        const siteId = this.getNodeParameter('site');
                        const endpoint = `/sites/${siteId}/webhooks/${webhookData.webhookId}`;
                        try {
                            responseData = yield GenericFunctions_1.webflowApiRequest.call(this, 'DELETE', endpoint);
                        }
                        catch (error) {
                            return false;
                        }
                        if (!responseData.deleted) {
                            return false;
                        }
                        delete webhookData.webhookId;
                        return true;
                    });
                },
            },
        };
    }
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            const req = this.getRequestObject();
            return {
                workflowData: [
                    this.helpers.returnJsonArray(req.body),
                ],
            };
        });
    }
}
exports.WebflowTrigger = WebflowTrigger;
