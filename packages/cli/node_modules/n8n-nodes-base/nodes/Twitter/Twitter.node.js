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
exports.Twitter = void 0;
const DirectMessageDescription_1 = require("./DirectMessageDescription");
const TweetDescription_1 = require("./TweetDescription");
const GenericFunctions_1 = require("./GenericFunctions");
const ISO6391 = require('iso-639-1');
class Twitter {
    constructor() {
        this.description = {
            displayName: 'Twitter',
            name: 'twitter',
            icon: 'file:twitter.svg',
            group: ['input', 'output'],
            version: 1,
            description: 'Consume Twitter API',
            subtitle: '={{$parameter["operation"] + ":" + $parameter["resource"]}}',
            defaults: {
                name: 'Twitter',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'twitterOAuth1Api',
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
                            name: 'Direct Message',
                            value: 'directMessage',
                        },
                        {
                            name: 'Tweet',
                            value: 'tweet',
                        },
                    ],
                    default: 'tweet',
                },
                // DIRECT MESSAGE
                ...DirectMessageDescription_1.directMessageOperations,
                ...DirectMessageDescription_1.directMessageFields,
                // TWEET
                ...TweetDescription_1.tweetOperations,
                ...TweetDescription_1.tweetFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available languages to display them to user so that he can
                // select them easily
                getLanguages() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const languages = ISO6391.getAllNames();
                        for (const language of languages) {
                            const languageName = language;
                            const languageId = ISO6391.getCode(language);
                            returnData.push({
                                name: languageName,
                                value: languageId,
                            });
                        }
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
            const length = items.length;
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'directMessage') {
                        //https://developer.twitter.com/en/docs/twitter-api/v1/direct-messages/sending-and-receiving/api-reference/new-event
                        if (operation === 'create') {
                            const userId = this.getNodeParameter('userId', i);
                            const text = this.getNodeParameter('text', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                type: 'message_create',
                                message_create: {
                                    target: {
                                        recipient_id: userId,
                                    },
                                    message_data: {
                                        text,
                                        attachment: {},
                                    },
                                },
                            };
                            if (additionalFields.attachment) {
                                const attachment = additionalFields.attachment;
                                const attachmentProperties = attachment.split(',').map((propertyName) => {
                                    return propertyName.trim();
                                });
                                const medias = yield GenericFunctions_1.uploadAttachments.call(this, attachmentProperties, items, i);
                                //@ts-ignore
                                body.message_create.message_data.attachment = { type: 'media', media: { id: medias[0].media_id_string } };
                            }
                            else {
                                //@ts-ignore
                                delete body.message_create.message_data.attachment;
                            }
                            responseData = yield GenericFunctions_1.twitterApiRequest.call(this, 'POST', '/direct_messages/events/new.json', { event: body });
                            responseData = responseData.event;
                        }
                    }
                    if (resource === 'tweet') {
                        // https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-statuses-update
                        if (operation === 'create') {
                            const text = this.getNodeParameter('text', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                status: text,
                            };
                            if (additionalFields.inReplyToStatusId) {
                                body.in_reply_to_status_id = additionalFields.inReplyToStatusId;
                                body.auto_populate_reply_metadata = true;
                            }
                            if (additionalFields.attachments) {
                                const attachments = additionalFields.attachments;
                                const attachmentProperties = attachments.split(',').map((propertyName) => {
                                    return propertyName.trim();
                                });
                                const medias = yield GenericFunctions_1.uploadAttachments.call(this, attachmentProperties, items, i);
                                body.media_ids = medias.map((media) => media.media_id_string).join(',');
                            }
                            if (additionalFields.possiblySensitive) {
                                body.possibly_sensitive = additionalFields.possiblySensitive;
                            }
                            if (additionalFields.displayCoordinates) {
                                body.display_coordinates = additionalFields.displayCoordinates;
                            }
                            if (additionalFields.locationFieldsUi) {
                                const locationUi = additionalFields.locationFieldsUi;
                                if (locationUi.locationFieldsValues) {
                                    const values = locationUi.locationFieldsValues;
                                    body.lat = parseFloat(values.latitude);
                                    body.long = parseFloat(values.longitude);
                                }
                            }
                            responseData = yield GenericFunctions_1.twitterApiRequest.call(this, 'POST', '/statuses/update.json', {}, body);
                        }
                        // https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/post-statuses-destroy-id
                        if (operation === 'delete') {
                            const tweetId = this.getNodeParameter('tweetId', i);
                            responseData = yield GenericFunctions_1.twitterApiRequest.call(this, 'POST', `/statuses/destroy/${tweetId}.json`, {}, {});
                        }
                        // https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets
                        if (operation === 'search') {
                            const q = this.getNodeParameter('searchText', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const qs = {
                                q,
                            };
                            if (additionalFields.includeEntities) {
                                qs.include_entities = additionalFields.includeEntities;
                            }
                            if (additionalFields.resultType) {
                                qs.response_type = additionalFields.resultType;
                            }
                            if (additionalFields.until) {
                                qs.until = additionalFields.until;
                            }
                            if (additionalFields.lang) {
                                qs.lang = additionalFields.lang;
                            }
                            if (additionalFields.locationFieldsUi) {
                                const locationUi = additionalFields.locationFieldsUi;
                                if (locationUi.locationFieldsValues) {
                                    const values = locationUi.locationFieldsValues;
                                    qs.geocode = `${values.latitude},${values.longitude},${values.distance}${values.radius}`;
                                }
                            }
                            qs.tweet_mode = additionalFields.tweetMode || 'compat';
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.twitterApiRequestAllItems.call(this, 'statuses', 'GET', '/search/tweets.json', {}, qs);
                            }
                            else {
                                qs.count = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.twitterApiRequest.call(this, 'GET', '/search/tweets.json', {}, qs);
                                responseData = responseData.statuses;
                            }
                        }
                        //https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/post-favorites-create
                        if (operation === 'like') {
                            const tweetId = this.getNodeParameter('tweetId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const qs = {
                                id: tweetId,
                            };
                            if (additionalFields.includeEntities) {
                                qs.include_entities = additionalFields.includeEntities;
                            }
                            responseData = yield GenericFunctions_1.twitterApiRequest.call(this, 'POST', '/favorites/create.json', {}, qs);
                        }
                        //https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/post-statuses-retweet-id
                        if (operation === 'retweet') {
                            const tweetId = this.getNodeParameter('tweetId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const qs = {
                                id: tweetId,
                            };
                            if (additionalFields.trimUser) {
                                qs.trim_user = additionalFields.trimUser;
                            }
                            responseData = yield GenericFunctions_1.twitterApiRequest.call(this, 'POST', `/statuses/retweet/${tweetId}.json`, {}, qs);
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
exports.Twitter = Twitter;
