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
exports.Segment = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const GroupDescription_1 = require("./GroupDescription");
const IdentifyDescription_1 = require("./IdentifyDescription");
const TrackDescription_1 = require("./TrackDescription");
const uuid_1 = require("uuid");
class Segment {
    constructor() {
        this.description = {
            displayName: 'Segment',
            name: 'segment',
            icon: 'file:segment.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ":" + $parameter["resource"]}}',
            description: 'Consume Segment API',
            defaults: {
                name: 'Segment',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'segmentApi',
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
                            name: 'Group',
                            value: 'group',
                            description: 'Group lets you associate an identified user with a group',
                        },
                        {
                            name: 'Identify',
                            value: 'identify',
                            description: 'Identify lets you tie a user to their actions',
                        },
                        {
                            name: 'Track',
                            value: 'track',
                            description: 'Track lets you record events',
                        },
                    ],
                    default: 'identify',
                },
                ...GroupDescription_1.groupOperations,
                ...GroupDescription_1.groupFields,
                ...IdentifyDescription_1.identifyOperations,
                ...TrackDescription_1.trackOperations,
                ...IdentifyDescription_1.identifyFields,
                ...TrackDescription_1.trackFields,
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const length = items.length;
            const qs = {};
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'group') {
                        //https://segment.com/docs/connections/sources/catalog/libraries/server/http-api/#group
                        if (operation === 'add') {
                            const userId = this.getNodeParameter('userId', i);
                            const groupId = this.getNodeParameter('groupId', i);
                            const traits = this.getNodeParameter('traits', i).traitsUi;
                            const context = this.getNodeParameter('context', i).contextUi;
                            const integrations = this.getNodeParameter('integrations', i).integrationsUi;
                            const body = {
                                groupId,
                                traits: {
                                    company: {},
                                    address: {},
                                },
                                context: {
                                    app: {},
                                    campaign: {},
                                    device: {},
                                },
                                integrations: {},
                            };
                            if (userId) {
                                body.userId = userId;
                            }
                            else {
                                body.anonymousId = (0, uuid_1.v4)();
                            }
                            if (traits) {
                                if (traits && traits.length !== 0) {
                                    for (const trait of traits) {
                                        body.traits[trait.key] = trait.value;
                                    }
                                }
                            }
                            if (context) {
                                if (context.active) {
                                    body.context.active = context.active;
                                }
                                if (context.ip) {
                                    body.context.ip = context.ip;
                                }
                                if (context.locate) {
                                    body.context.locate = context.locate;
                                }
                                if (context.page) {
                                    body.context.page = context.page;
                                }
                                if (context.timezone) {
                                    body.context.timezone = context.timezone;
                                }
                                if (context.timezone) {
                                    body.context.timezone = context.timezone;
                                }
                                if (context.app) {
                                    const app = context.app.appUi;
                                    if (app) {
                                        if (app.name) {
                                            //@ts-ignore
                                            body.context.app.name = app.name;
                                        }
                                        if (app.version) {
                                            //@ts-ignore
                                            body.context.app.version = app.version;
                                        }
                                        if (app.build) {
                                            //@ts-ignore
                                            body.context.app.build = app.build;
                                        }
                                    }
                                }
                                if (context.campaign) {
                                    const campaign = context.campaign.campaignUi;
                                    if (campaign) {
                                        if (campaign.name) {
                                            //@ts-ignore
                                            body.context.campaign.name = campaign.name;
                                        }
                                        if (campaign.source) {
                                            //@ts-ignore
                                            body.context.campaign.source = campaign.source;
                                        }
                                        if (campaign.medium) {
                                            //@ts-ignore
                                            body.context.campaign.medium = campaign.medium;
                                        }
                                        if (campaign.term) {
                                            //@ts-ignore
                                            body.context.campaign.term = campaign.term;
                                        }
                                        if (campaign.content) {
                                            //@ts-ignore
                                            body.context.campaign.content = campaign.content;
                                        }
                                    }
                                }
                                if (context.device) {
                                    const device = context.device.deviceUi;
                                    if (device) {
                                        if (device.id) {
                                            //@ts-ignore
                                            body.context.device.id = device.id;
                                        }
                                        if (device.manufacturer) {
                                            //@ts-ignore
                                            body.context.device.manufacturer = device.manufacturer;
                                        }
                                        if (device.model) {
                                            //@ts-ignore
                                            body.context.device.model = device.model;
                                        }
                                        if (device.type) {
                                            //@ts-ignore
                                            body.context.device.type = device.type;
                                        }
                                        if (device.version) {
                                            //@ts-ignore
                                            body.context.device.version = device.version;
                                        }
                                    }
                                }
                            }
                            if (integrations) {
                                if (integrations.all) {
                                    body.integrations.all = integrations.all;
                                }
                                if (integrations.salesforce) {
                                    body.integrations.salesforce = integrations.salesforce;
                                }
                            }
                            responseData = yield GenericFunctions_1.segmentApiRequest.call(this, 'POST', '/group', body);
                        }
                    }
                    if (resource === 'identify') {
                        //https://segment.com/docs/connections/sources/catalog/libraries/server/http-api/#identify
                        if (operation === 'create') {
                            const userId = this.getNodeParameter('userId', i);
                            const context = this.getNodeParameter('context', i).contextUi;
                            const traits = this.getNodeParameter('traits', i).traitsUi;
                            const integrations = this.getNodeParameter('integrations', i).integrationsUi;
                            const body = {
                                context: {
                                    app: {},
                                    campaign: {},
                                    device: {},
                                },
                                traits: {},
                                integrations: {},
                            };
                            if (userId) {
                                body.userId = userId;
                            }
                            else {
                                body.anonymousId = (0, uuid_1.v4)();
                            }
                            if (context) {
                                if (context.active) {
                                    body.context.active = context.active;
                                }
                                if (context.ip) {
                                    body.context.ip = context.ip;
                                }
                                if (context.locate) {
                                    body.context.locate = context.locate;
                                }
                                if (context.page) {
                                    body.context.page = context.page;
                                }
                                if (context.timezone) {
                                    body.context.timezone = context.timezone;
                                }
                                if (context.timezone) {
                                    body.context.timezone = context.timezone;
                                }
                                if (context.app) {
                                    const app = context.app.appUi;
                                    if (app) {
                                        if (app.name) {
                                            //@ts-ignore
                                            body.context.app.name = app.name;
                                        }
                                        if (app.version) {
                                            //@ts-ignore
                                            body.context.app.version = app.version;
                                        }
                                        if (app.build) {
                                            //@ts-ignore
                                            body.context.app.build = app.build;
                                        }
                                    }
                                }
                                if (context.campaign) {
                                    const campaign = context.campaign.campaignUi;
                                    if (campaign) {
                                        if (campaign.name) {
                                            //@ts-ignore
                                            body.context.campaign.name = campaign.name;
                                        }
                                        if (campaign.source) {
                                            //@ts-ignore
                                            body.context.campaign.source = campaign.source;
                                        }
                                        if (campaign.medium) {
                                            //@ts-ignore
                                            body.context.campaign.medium = campaign.medium;
                                        }
                                        if (campaign.term) {
                                            //@ts-ignore
                                            body.context.campaign.term = campaign.term;
                                        }
                                        if (campaign.content) {
                                            //@ts-ignore
                                            body.context.campaign.content = campaign.content;
                                        }
                                    }
                                }
                                if (context.device) {
                                    const device = context.device.deviceUi;
                                    if (device) {
                                        if (device.id) {
                                            //@ts-ignore
                                            body.context.device.id = device.id;
                                        }
                                        if (device.manufacturer) {
                                            //@ts-ignore
                                            body.context.device.manufacturer = device.manufacturer;
                                        }
                                        if (device.model) {
                                            //@ts-ignore
                                            body.context.device.model = device.model;
                                        }
                                        if (device.type) {
                                            //@ts-ignore
                                            body.context.device.type = device.type;
                                        }
                                        if (device.version) {
                                            //@ts-ignore
                                            body.context.device.version = device.version;
                                        }
                                    }
                                }
                            }
                            if (integrations) {
                                if (integrations.all) {
                                    body.integrations.all = integrations.all;
                                }
                                if (integrations.salesforce) {
                                    body.integrations.salesforce = integrations.salesforce;
                                }
                            }
                            if (traits) {
                                if (traits && traits.length !== 0) {
                                    for (const trait of traits) {
                                        body.traits[trait.key] = trait.value;
                                    }
                                }
                            }
                            responseData = yield GenericFunctions_1.segmentApiRequest.call(this, 'POST', '/identify', body);
                        }
                    }
                    if (resource === 'track') {
                        //https://segment.com/docs/connections/sources/catalog/libraries/server/http-api/#track
                        if (operation === 'event') {
                            const userId = this.getNodeParameter('userId', i);
                            const event = this.getNodeParameter('event', i);
                            const context = this.getNodeParameter('context', i).contextUi;
                            const integrations = this.getNodeParameter('integrations', i).integrationsUi;
                            const properties = this.getNodeParameter('properties', i).propertiesUi;
                            const body = {
                                event,
                                traits: {},
                                context: {
                                    app: {},
                                    campaign: {},
                                    device: {},
                                },
                                integrations: {},
                                properties: {},
                            };
                            if (userId) {
                                body.userId = userId;
                            }
                            else {
                                body.anonymousId = (0, uuid_1.v4)();
                            }
                            if (context) {
                                if (context.active) {
                                    body.context.active = context.active;
                                }
                                if (context.ip) {
                                    body.context.ip = context.ip;
                                }
                                if (context.locate) {
                                    body.context.locate = context.locate;
                                }
                                if (context.page) {
                                    body.context.page = context.page;
                                }
                                if (context.timezone) {
                                    body.context.timezone = context.timezone;
                                }
                                if (context.timezone) {
                                    body.context.timezone = context.timezone;
                                }
                                if (context.app) {
                                    const app = context.app.appUi;
                                    if (app) {
                                        if (app.name) {
                                            //@ts-ignore
                                            body.context.app.name = app.name;
                                        }
                                        if (app.version) {
                                            //@ts-ignore
                                            body.context.app.version = app.version;
                                        }
                                        if (app.build) {
                                            //@ts-ignore
                                            body.context.app.build = app.build;
                                        }
                                    }
                                }
                                if (context.campaign) {
                                    const campaign = context.campaign.campaignUi;
                                    if (campaign) {
                                        if (campaign.name) {
                                            //@ts-ignore
                                            body.context.campaign.name = campaign.name;
                                        }
                                        if (campaign.source) {
                                            //@ts-ignore
                                            body.context.campaign.source = campaign.source;
                                        }
                                        if (campaign.medium) {
                                            //@ts-ignore
                                            body.context.campaign.medium = campaign.medium;
                                        }
                                        if (campaign.term) {
                                            //@ts-ignore
                                            body.context.campaign.term = campaign.term;
                                        }
                                        if (campaign.content) {
                                            //@ts-ignore
                                            body.context.campaign.content = campaign.content;
                                        }
                                    }
                                }
                                if (context.device) {
                                    const device = context.device.deviceUi;
                                    if (device) {
                                        if (device.id) {
                                            //@ts-ignore
                                            body.context.device.id = device.id;
                                        }
                                        if (device.manufacturer) {
                                            //@ts-ignore
                                            body.context.device.manufacturer = device.manufacturer;
                                        }
                                        if (device.model) {
                                            //@ts-ignore
                                            body.context.device.model = device.model;
                                        }
                                        if (device.type) {
                                            //@ts-ignore
                                            body.context.device.type = device.type;
                                        }
                                        if (device.version) {
                                            //@ts-ignore
                                            body.context.device.version = device.version;
                                        }
                                    }
                                }
                            }
                            if (integrations) {
                                if (integrations.all) {
                                    body.integrations.all = integrations.all;
                                }
                                if (integrations.salesforce) {
                                    body.integrations.salesforce = integrations.salesforce;
                                }
                            }
                            if (properties) {
                                if (properties && properties.length !== 0) {
                                    for (const property of properties) {
                                        body.properties[property.key] = property.value;
                                    }
                                }
                            }
                            responseData = yield GenericFunctions_1.segmentApiRequest.call(this, 'POST', '/track', body);
                        }
                        //https://segment.com/docs/connections/sources/catalog/libraries/server/http-api/#page
                        if (operation === 'page') {
                            const userId = this.getNodeParameter('userId', i);
                            const name = this.getNodeParameter('name', i);
                            const context = this.getNodeParameter('context', i).contextUi;
                            const integrations = this.getNodeParameter('integrations', i).integrationsUi;
                            const properties = this.getNodeParameter('properties', i).propertiesUi;
                            const body = {
                                name,
                                traits: {},
                                context: {
                                    app: {},
                                    campaign: {},
                                    device: {},
                                },
                                integrations: {},
                                properties: {},
                            };
                            if (userId) {
                                body.userId = userId;
                            }
                            else {
                                body.anonymousId = (0, uuid_1.v4)();
                            }
                            if (context) {
                                if (context.active) {
                                    body.context.active = context.active;
                                }
                                if (context.ip) {
                                    body.context.ip = context.ip;
                                }
                                if (context.locate) {
                                    body.context.locate = context.locate;
                                }
                                if (context.page) {
                                    body.context.page = context.page;
                                }
                                if (context.timezone) {
                                    body.context.timezone = context.timezone;
                                }
                                if (context.timezone) {
                                    body.context.timezone = context.timezone;
                                }
                                if (context.app) {
                                    const app = context.app.appUi;
                                    if (app) {
                                        if (app.name) {
                                            //@ts-ignore
                                            body.context.app.name = app.name;
                                        }
                                        if (app.version) {
                                            //@ts-ignore
                                            body.context.app.version = app.version;
                                        }
                                        if (app.build) {
                                            //@ts-ignore
                                            body.context.app.build = app.build;
                                        }
                                    }
                                }
                                if (context.campaign) {
                                    const campaign = context.campaign.campaignUi;
                                    if (campaign) {
                                        if (campaign.name) {
                                            //@ts-ignore
                                            body.context.campaign.name = campaign.name;
                                        }
                                        if (campaign.source) {
                                            //@ts-ignore
                                            body.context.campaign.source = campaign.source;
                                        }
                                        if (campaign.medium) {
                                            //@ts-ignore
                                            body.context.campaign.medium = campaign.medium;
                                        }
                                        if (campaign.term) {
                                            //@ts-ignore
                                            body.context.campaign.term = campaign.term;
                                        }
                                        if (campaign.content) {
                                            //@ts-ignore
                                            body.context.campaign.content = campaign.content;
                                        }
                                    }
                                }
                                if (context.device) {
                                    const device = context.device.deviceUi;
                                    if (device) {
                                        if (device.id) {
                                            //@ts-ignore
                                            body.context.device.id = device.id;
                                        }
                                        if (device.manufacturer) {
                                            //@ts-ignore
                                            body.context.device.manufacturer = device.manufacturer;
                                        }
                                        if (device.model) {
                                            //@ts-ignore
                                            body.context.device.model = device.model;
                                        }
                                        if (device.type) {
                                            //@ts-ignore
                                            body.context.device.type = device.type;
                                        }
                                        if (device.version) {
                                            //@ts-ignore
                                            body.context.device.version = device.version;
                                        }
                                    }
                                }
                            }
                            if (integrations) {
                                if (integrations.all) {
                                    body.integrations.all = integrations.all;
                                }
                                if (integrations.salesforce) {
                                    body.integrations.salesforce = integrations.salesforce;
                                }
                            }
                            if (properties) {
                                if (properties && properties.length !== 0) {
                                    for (const property of properties) {
                                        body.properties[property.key] = property.value;
                                    }
                                }
                            }
                            responseData = yield GenericFunctions_1.segmentApiRequest.call(this, 'POST', '/page', body);
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
                if (Array.isArray(responseData)) {
                    returnData.push.apply(returnData, responseData);
                }
                else {
                    returnData.push(responseData);
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.Segment = Segment;
