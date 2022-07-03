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
exports.LinkedIn = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const PostDescription_1 = require("./PostDescription");
class LinkedIn {
    constructor() {
        // eslint-disable-next-line n8n-nodes-base/node-class-description-missing-subtitle
        this.description = {
            displayName: 'LinkedIn',
            name: 'linkedIn',
            icon: 'file:linkedin.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume LinkedIn API',
            defaults: {
                name: 'LinkedIn',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'linkedInOAuth2Api',
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
                            name: 'Post',
                            value: 'post',
                        },
                    ],
                    default: 'post',
                },
                //POST
                ...PostDescription_1.postOperations,
                ...PostDescription_1.postFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get Person URN which has to be used with other LinkedIn API Requests
                // https://docs.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin
                getPersonUrn() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const person = yield GenericFunctions_1.linkedInApiRequest.call(this, 'GET', '/me', {});
                        returnData.push({ name: `${person.localizedFirstName} ${person.localizedLastName}`, value: person.id });
                        return returnData;
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
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let body = {}; // tslint:disable-line:no-any
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'post') {
                        if (operation === 'create') {
                            const text = this.getNodeParameter('text', i);
                            const shareMediaCategory = this.getNodeParameter('shareMediaCategory', i);
                            const postAs = this.getNodeParameter('postAs', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            let authorUrn = '';
                            let visibility = 'PUBLIC';
                            if (postAs === 'person') {
                                const personUrn = this.getNodeParameter('person', i);
                                // Only if posting as a person can user decide if post visible by public or connections
                                visibility = additionalFields.visibility || 'PUBLIC';
                                authorUrn = `urn:li:person:${personUrn}`;
                            }
                            else {
                                const organizationUrn = this.getNodeParameter('organization', i);
                                authorUrn = `urn:li:organization:${organizationUrn}`;
                            }
                            let description = '';
                            let title = '';
                            let originalUrl = '';
                            if (shareMediaCategory === 'IMAGE') {
                                if (additionalFields.description) {
                                    description = additionalFields.description;
                                }
                                if (additionalFields.title) {
                                    title = additionalFields.title;
                                }
                                // Send a REQUEST to prepare a register of a media image file
                                const registerRequest = {
                                    registerUploadRequest: {
                                        recipes: [
                                            'urn:li:digitalmediaRecipe:feedshare-image',
                                        ],
                                        owner: authorUrn,
                                        serviceRelationships: [
                                            {
                                                relationshipType: 'OWNER',
                                                identifier: 'urn:li:userGeneratedContent',
                                            },
                                        ],
                                    },
                                };
                                const registerObject = yield GenericFunctions_1.linkedInApiRequest.call(this, 'POST', '/assets?action=registerUpload', registerRequest);
                                // Response provides a specific upload URL that is used to upload the binary image file
                                const uploadUrl = registerObject.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
                                const asset = registerObject.value.asset;
                                // Prepare binary file upload
                                const item = items[i];
                                if (item.binary === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                                }
                                const propertyNameUpload = this.getNodeParameter('binaryPropertyName', i);
                                if (item.binary[propertyNameUpload] === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${propertyNameUpload}" does not exists on item!`);
                                }
                                // Buffer binary data
                                const buffer = yield this.helpers.getBinaryDataBuffer(i, propertyNameUpload);
                                // Upload image
                                yield GenericFunctions_1.linkedInApiRequest.call(this, 'POST', uploadUrl, buffer, true);
                                body = {
                                    author: authorUrn,
                                    lifecycleState: 'PUBLISHED',
                                    specificContent: {
                                        'com.linkedin.ugc.ShareContent': {
                                            shareCommentary: {
                                                text,
                                            },
                                            shareMediaCategory: 'IMAGE',
                                            media: [
                                                {
                                                    status: 'READY',
                                                    description: {
                                                        text: description,
                                                    },
                                                    media: asset,
                                                    title: {
                                                        text: title,
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    visibility: {
                                        'com.linkedin.ugc.MemberNetworkVisibility': visibility,
                                    },
                                };
                            }
                            else if (shareMediaCategory === 'ARTICLE') {
                                const additionalFields = this.getNodeParameter('additionalFields', i);
                                if (additionalFields.description) {
                                    description = additionalFields.description;
                                }
                                if (additionalFields.title) {
                                    title = additionalFields.title;
                                }
                                if (additionalFields.originalUrl) {
                                    originalUrl = additionalFields.originalUrl;
                                }
                                body = {
                                    author: `${authorUrn}`,
                                    lifecycleState: 'PUBLISHED',
                                    specificContent: {
                                        'com.linkedin.ugc.ShareContent': {
                                            shareCommentary: {
                                                text,
                                            },
                                            shareMediaCategory,
                                            media: [
                                                {
                                                    status: 'READY',
                                                    description: {
                                                        text: description,
                                                    },
                                                    originalUrl,
                                                    title: {
                                                        text: title,
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    visibility: {
                                        'com.linkedin.ugc.MemberNetworkVisibility': visibility,
                                    },
                                };
                                if (description === '') {
                                    delete body.specificContent['com.linkedin.ugc.ShareContent'].media[0].description;
                                }
                                if (title === '') {
                                    delete body.specificContent['com.linkedin.ugc.ShareContent'].media[0].title;
                                }
                            }
                            else {
                                body = {
                                    author: authorUrn,
                                    lifecycleState: 'PUBLISHED',
                                    specificContent: {
                                        'com.linkedin.ugc.ShareContent': {
                                            shareCommentary: {
                                                text,
                                            },
                                            shareMediaCategory,
                                        },
                                    },
                                    visibility: {
                                        'com.linkedin.ugc.MemberNetworkVisibility': visibility,
                                    },
                                };
                            }
                            const endpoint = '/ugcPosts';
                            responseData = yield GenericFunctions_1.linkedInApiRequest.call(this, 'POST', endpoint, body);
                        }
                    }
                    if (Array.isArray(responseData)) {
                        returnData.push.apply(returnData, responseData);
                    }
                    else {
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
exports.LinkedIn = LinkedIn;
