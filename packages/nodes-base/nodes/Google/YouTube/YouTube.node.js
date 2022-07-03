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
exports.YouTube = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const ChannelDescription_1 = require("./ChannelDescription");
const PlaylistDescription_1 = require("./PlaylistDescription");
const PlaylistItemDescription_1 = require("./PlaylistItemDescription");
const VideoDescription_1 = require("./VideoDescription");
const VideoCategoryDescription_1 = require("./VideoCategoryDescription");
const CountryCodes_1 = require("./CountryCodes");
class YouTube {
    constructor() {
        this.description = {
            displayName: 'YouTube',
            name: 'youTube',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:youTube.png',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume YouTube API',
            defaults: {
                name: 'YouTube',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'youTubeOAuth2Api',
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
                            name: 'Channel',
                            value: 'channel',
                        },
                        {
                            name: 'Playlist',
                            value: 'playlist',
                        },
                        {
                            name: 'Playlist Item',
                            value: 'playlistItem',
                        },
                        {
                            name: 'Video',
                            value: 'video',
                        },
                        {
                            name: 'Video Category',
                            value: 'videoCategory',
                        },
                    ],
                    default: 'channel',
                },
                ...ChannelDescription_1.channelOperations,
                ...ChannelDescription_1.channelFields,
                ...PlaylistDescription_1.playlistOperations,
                ...PlaylistDescription_1.playlistFields,
                ...PlaylistItemDescription_1.playlistItemOperations,
                ...PlaylistItemDescription_1.playlistItemFields,
                ...VideoDescription_1.videoOperations,
                ...VideoDescription_1.videoFields,
                ...VideoCategoryDescription_1.videoCategoryOperations,
                ...VideoCategoryDescription_1.videoCategoryFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the languages to display them to user so that he can
                // select them easily
                getLanguages() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const languages = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'items', 'GET', '/youtube/v3/i18nLanguages');
                        for (const language of languages) {
                            const languageName = language.id.toUpperCase();
                            const languageId = language.id;
                            returnData.push({
                                name: languageName,
                                value: languageId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the countries codes to display them to user so that he can
                // select them easily
                getCountriesCodes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        for (const countryCode of CountryCodes_1.countriesCodes) {
                            const countryCodeName = `${countryCode.name} - ${countryCode.alpha2}`;
                            const countryCodeId = countryCode.alpha2;
                            returnData.push({
                                name: countryCodeName,
                                value: countryCodeId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the video categories to display them to user so that he can
                // select them easily
                getVideoCategories() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const countryCode = this.getCurrentNodeParameter('regionCode');
                        const returnData = [];
                        const qs = {};
                        qs.regionCode = countryCode;
                        qs.part = 'snippet';
                        const categories = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'items', 'GET', '/youtube/v3/videoCategories', {}, qs);
                        for (const category of categories) {
                            const categoryName = category.snippet.title;
                            const categoryId = category.id;
                            returnData.push({
                                name: categoryName,
                                value: categoryId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the playlists to display them to user so that he can
                // select them easily
                getPlaylists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const qs = {};
                        qs.part = 'snippet';
                        qs.mine = true;
                        const playlists = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'items', 'GET', '/youtube/v3/playlists', {}, qs);
                        for (const playlist of playlists) {
                            const playlistName = playlist.snippet.title;
                            const playlistId = playlist.id;
                            returnData.push({
                                name: playlistName,
                                value: playlistId,
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
            const qs = {};
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'channel') {
                        if (operation === 'get') {
                            //https://developers.google.com/youtube/v3/docs/channels/list
                            let part = this.getNodeParameter('part', i);
                            const channelId = this.getNodeParameter('channelId', i);
                            if (part.includes('*')) {
                                part = [
                                    'brandingSettings',
                                    'contentDetails',
                                    'contentOwnerDetails',
                                    'id',
                                    'localizations',
                                    'snippet',
                                    'statistics',
                                    'status',
                                    'topicDetails',
                                ];
                            }
                            qs.part = part.join(',');
                            qs.id = channelId;
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/youtube/v3/channels`, {}, qs);
                            responseData = responseData.items;
                        }
                        //https://developers.google.com/youtube/v3/docs/channels/list
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            let part = this.getNodeParameter('part', i);
                            const options = this.getNodeParameter('options', i);
                            const filters = this.getNodeParameter('filters', i);
                            if (part.includes('*')) {
                                part = [
                                    'brandingSettings',
                                    'contentDetails',
                                    'contentOwnerDetails',
                                    'id',
                                    'localizations',
                                    'snippet',
                                    'statistics',
                                    'status',
                                    'topicDetails',
                                ];
                            }
                            qs.part = part.join(',');
                            Object.assign(qs, options, filters);
                            qs.mine = true;
                            if (qs.categoryId || qs.forUsername || qs.id || qs.managedByMe) {
                                delete qs.mine;
                            }
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'items', 'GET', `/youtube/v3/channels`, {}, qs);
                            }
                            else {
                                qs.maxResults = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/youtube/v3/channels`, {}, qs);
                                responseData = responseData.items;
                            }
                        }
                        //https://developers.google.com/youtube/v3/docs/channels/update
                        if (operation === 'update') {
                            const channelId = this.getNodeParameter('channelId', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const body = {
                                id: channelId,
                                brandingSettings: {
                                    channel: {},
                                    image: {},
                                },
                            };
                            qs.part = 'brandingSettings';
                            if (updateFields.onBehalfOfContentOwner) {
                                qs.onBehalfOfContentOwner = updateFields.onBehalfOfContentOwner;
                            }
                            if (updateFields.brandingSettingsUi) {
                                const channelSettingsValues = updateFields.brandingSettingsUi.channelSettingsValues;
                                const channelSettings = {};
                                if (channelSettingsValues === null || channelSettingsValues === void 0 ? void 0 : channelSettingsValues.channel) {
                                    const channelSettingsOptions = channelSettingsValues.channel;
                                    if (channelSettingsOptions.country) {
                                        channelSettings.country = channelSettingsOptions.country;
                                    }
                                    if (channelSettingsOptions.description) {
                                        channelSettings.description = channelSettingsOptions.description;
                                    }
                                    if (channelSettingsOptions.defaultLanguage) {
                                        channelSettings.defaultLanguage = channelSettingsOptions.defaultLanguage;
                                    }
                                    if (channelSettingsOptions.defaultTab) {
                                        channelSettings.defaultTab = channelSettingsOptions.defaultTab;
                                    }
                                    if (channelSettingsOptions.featuredChannelsTitle) {
                                        channelSettings.featuredChannelsTitle = channelSettingsOptions.featuredChannelsTitle;
                                    }
                                    if (channelSettingsOptions.featuredChannelsUrls) {
                                        channelSettings.featuredChannelsUrls = channelSettingsOptions.featuredChannelsUrls;
                                    }
                                    if (channelSettingsOptions.keywords) {
                                        channelSettings.keywords = channelSettingsOptions.keywords;
                                    }
                                    if (channelSettingsOptions.moderateComments) {
                                        channelSettings.moderateComments = channelSettingsOptions.moderateComments;
                                    }
                                    if (channelSettingsOptions.profileColor) {
                                        channelSettings.profileColor = channelSettingsOptions.profileColor;
                                    }
                                    if (channelSettingsOptions.profileColor) {
                                        channelSettings.profileColor = channelSettingsOptions.profileColor;
                                    }
                                    if (channelSettingsOptions.showRelatedChannels) {
                                        channelSettings.showRelatedChannels = channelSettingsOptions.showRelatedChannels;
                                    }
                                    if (channelSettingsOptions.showBrowseView) {
                                        channelSettings.showBrowseView = channelSettingsOptions.showBrowseView;
                                    }
                                    if (channelSettingsOptions.trackingAnalyticsAccountId) {
                                        channelSettings.trackingAnalyticsAccountId = channelSettingsOptions.trackingAnalyticsAccountId;
                                    }
                                    if (channelSettingsOptions.unsubscribedTrailer) {
                                        channelSettings.unsubscribedTrailer = channelSettingsOptions.unsubscribedTrailer;
                                    }
                                }
                                const imageSettingsValues = updateFields.brandingSettingsUi.imageSettingsValues;
                                const imageSettings = {};
                                if (imageSettingsValues === null || imageSettingsValues === void 0 ? void 0 : imageSettingsValues.image) {
                                    const imageSettingsOptions = imageSettings.image;
                                    if (imageSettingsOptions.bannerExternalUrl) {
                                        imageSettings.bannerExternalUrl = imageSettingsOptions.bannerExternalUrl;
                                    }
                                    if (imageSettingsOptions.trackingImageUrl) {
                                        imageSettings.trackingImageUrl = imageSettingsOptions.trackingImageUrl;
                                    }
                                    if (imageSettingsOptions.watchIconImageUrl) {
                                        imageSettings.watchIconImageUrl = imageSettingsOptions.watchIconImageUrl;
                                    }
                                }
                                //@ts-ignore
                                body.brandingSettings.channel = channelSettings;
                                //@ts-ignore
                                body.brandingSettings.image = imageSettings;
                            }
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'PUT', '/youtube/v3/channels', body, qs);
                        }
                        //https://developers.google.com/youtube/v3/docs/channelBanners/insert
                        if (operation === 'uploadBanner') {
                            const channelId = this.getNodeParameter('channelId', i);
                            const binaryProperty = this.getNodeParameter('binaryProperty', i);
                            let mimeType;
                            // Is binary file to upload
                            const item = items[i];
                            if (item.binary === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                            }
                            if (item.binary[binaryProperty] === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${binaryProperty}" does not exists on item!`);
                            }
                            if (item.binary[binaryProperty].mimeType) {
                                mimeType = item.binary[binaryProperty].mimeType;
                            }
                            const body = yield this.helpers.getBinaryDataBuffer(i, binaryProperty);
                            const requestOptions = {
                                headers: {
                                    'Content-Type': mimeType,
                                },
                                json: false,
                            };
                            const response = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', '/upload/youtube/v3/channelBanners/insert', body, qs, undefined, requestOptions);
                            const { url } = JSON.parse(response);
                            qs.part = 'brandingSettings';
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'PUT', `/youtube/v3/channels`, {
                                id: channelId,
                                brandingSettings: {
                                    image: {
                                        bannerExternalUrl: url,
                                    },
                                },
                            }, qs);
                        }
                    }
                    if (resource === 'playlist') {
                        //https://developers.google.com/youtube/v3/docs/playlists/list
                        if (operation === 'get') {
                            let part = this.getNodeParameter('part', i);
                            const playlistId = this.getNodeParameter('playlistId', i);
                            const options = this.getNodeParameter('options', i);
                            if (part.includes('*')) {
                                part = [
                                    'contentDetails',
                                    'id',
                                    'localizations',
                                    'player',
                                    'snippet',
                                    'status',
                                ];
                            }
                            qs.part = part.join(',');
                            qs.id = playlistId;
                            Object.assign(qs, options);
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/youtube/v3/playlists`, {}, qs);
                            responseData = responseData.items;
                        }
                        //https://developers.google.com/youtube/v3/docs/playlists/list
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            let part = this.getNodeParameter('part', i);
                            const options = this.getNodeParameter('options', i);
                            const filters = this.getNodeParameter('filters', i);
                            if (part.includes('*')) {
                                part = [
                                    'contentDetails',
                                    'id',
                                    'localizations',
                                    'player',
                                    'snippet',
                                    'status',
                                ];
                            }
                            qs.part = part.join(',');
                            Object.assign(qs, options, filters);
                            qs.mine = true;
                            if (qs.channelId || qs.id) {
                                delete qs.mine;
                            }
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'items', 'GET', `/youtube/v3/playlists`, {}, qs);
                            }
                            else {
                                qs.maxResults = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/youtube/v3/playlists`, {}, qs);
                                responseData = responseData.items;
                            }
                        }
                        //https://developers.google.com/youtube/v3/docs/playlists/insert
                        if (operation === 'create') {
                            const title = this.getNodeParameter('title', i);
                            const options = this.getNodeParameter('options', i);
                            qs.part = 'snippet';
                            const body = {
                                snippet: {
                                    title,
                                },
                            };
                            if (options.tags) {
                                //@ts-ignore
                                body.snippet.tags = options.tags.split(',');
                            }
                            if (options.description) {
                                //@ts-ignore
                                body.snippet.privacyStatus = options.privacyStatus;
                            }
                            if (options.defaultLanguage) {
                                //@ts-ignore
                                body.snippet.defaultLanguage = options.defaultLanguage;
                            }
                            if (options.onBehalfOfContentOwner) {
                                qs.onBehalfOfContentOwner = options.onBehalfOfContentOwner;
                            }
                            if (options.onBehalfOfContentOwnerChannel) {
                                qs.onBehalfOfContentOwnerChannel = options.onBehalfOfContentOwnerChannel;
                            }
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', '/youtube/v3/playlists', body, qs);
                        }
                        //https://developers.google.com/youtube/v3/docs/playlists/update
                        if (operation === 'update') {
                            const playlistId = this.getNodeParameter('playlistId', i);
                            const title = this.getNodeParameter('title', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            qs.part = 'snippet, status';
                            const body = {
                                id: playlistId,
                                snippet: {
                                    title,
                                },
                                status: {},
                            };
                            if (updateFields.tags) {
                                //@ts-ignore
                                body.snippet.tags = updateFields.tags.split(',');
                            }
                            if (updateFields.privacyStatus) {
                                //@ts-ignore
                                body.status.privacyStatus = updateFields.privacyStatus;
                            }
                            if (updateFields.description) {
                                //@ts-ignore
                                body.snippet.description = updateFields.description;
                            }
                            if (updateFields.defaultLanguage) {
                                //@ts-ignore
                                body.snippet.defaultLanguage = updateFields.defaultLanguage;
                            }
                            if (updateFields.onBehalfOfContentOwner) {
                                qs.onBehalfOfContentOwner = updateFields.onBehalfOfContentOwner;
                            }
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'PUT', '/youtube/v3/playlists', body, qs);
                        }
                        //https://developers.google.com/youtube/v3/docs/playlists/delete
                        if (operation === 'delete') {
                            const playlistId = this.getNodeParameter('playlistId', i);
                            const options = this.getNodeParameter('options', i);
                            const body = {
                                id: playlistId,
                            };
                            if (options.onBehalfOfContentOwner) {
                                qs.onBehalfOfContentOwner = options.onBehalfOfContentOwner;
                            }
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'DELETE', '/youtube/v3/playlists', body);
                            responseData = { success: true };
                        }
                    }
                    if (resource === 'playlistItem') {
                        //https://developers.google.com/youtube/v3/docs/playlistItems/list
                        if (operation === 'get') {
                            let part = this.getNodeParameter('part', i);
                            const playlistItemId = this.getNodeParameter('playlistItemId', i);
                            const options = this.getNodeParameter('options', i);
                            if (part.includes('*')) {
                                part = [
                                    'contentDetails',
                                    'id',
                                    'snippet',
                                    'status',
                                ];
                            }
                            qs.part = part.join(',');
                            qs.id = playlistItemId;
                            Object.assign(qs, options);
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/youtube/v3/playlistItems`, {}, qs);
                            responseData = responseData.items;
                        }
                        //https://developers.google.com/youtube/v3/docs/playlistItems/list
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            let part = this.getNodeParameter('part', i);
                            const options = this.getNodeParameter('options', i);
                            const playlistId = this.getNodeParameter('playlistId', i);
                            //const filters = this.getNodeParameter('filters', i) as IDataObject;
                            if (part.includes('*')) {
                                part = [
                                    'contentDetails',
                                    'id',
                                    'snippet',
                                    'status',
                                ];
                            }
                            qs.playlistId = playlistId;
                            qs.part = part.join(',');
                            Object.assign(qs, options);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'items', 'GET', `/youtube/v3/playlistItems`, {}, qs);
                            }
                            else {
                                qs.maxResults = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/youtube/v3/playlistItems`, {}, qs);
                                responseData = responseData.items;
                            }
                        }
                        //https://developers.google.com/youtube/v3/docs/playlistItems/insert
                        if (operation === 'add') {
                            const playlistId = this.getNodeParameter('playlistId', i);
                            const videoId = this.getNodeParameter('videoId', i);
                            const options = this.getNodeParameter('options', i);
                            qs.part = 'snippet, contentDetails';
                            const body = {
                                snippet: {
                                    playlistId,
                                    resourceId: {
                                        kind: 'youtube#video',
                                        videoId,
                                    },
                                },
                                contentDetails: {},
                            };
                            if (options.position) {
                                //@ts-ignore
                                body.snippet.position = options.position;
                            }
                            if (options.note) {
                                //@ts-ignore
                                body.contentDetails.note = options.note;
                            }
                            if (options.startAt) {
                                //@ts-ignore
                                body.contentDetails.startAt = options.startAt;
                            }
                            if (options.endAt) {
                                //@ts-ignore
                                body.contentDetails.endAt = options.endAt;
                            }
                            if (options.onBehalfOfContentOwner) {
                                qs.onBehalfOfContentOwner = options.onBehalfOfContentOwner;
                            }
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', '/youtube/v3/playlistItems', body, qs);
                        }
                        //https://developers.google.com/youtube/v3/docs/playlistItems/delete
                        if (operation === 'delete') {
                            const playlistItemId = this.getNodeParameter('playlistItemId', i);
                            const options = this.getNodeParameter('options', i);
                            const body = {
                                id: playlistItemId,
                            };
                            if (options.onBehalfOfContentOwner) {
                                qs.onBehalfOfContentOwner = options.onBehalfOfContentOwner;
                            }
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'DELETE', '/youtube/v3/playlistItems', body);
                            responseData = { success: true };
                        }
                    }
                    if (resource === 'video') {
                        //https://developers.google.com/youtube/v3/docs/search/list
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const options = this.getNodeParameter('options', i);
                            const filters = this.getNodeParameter('filters', i);
                            qs.part = 'snippet';
                            qs.type = 'video';
                            qs.forMine = true;
                            Object.assign(qs, options, filters);
                            if (Object.keys(filters).length > 0) {
                                delete qs.forMine;
                            }
                            if (qs.relatedToVideoId && qs.forDeveloper !== undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `When using the parameter 'related to video' the parameter 'for developer' cannot be set`);
                            }
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'items', 'GET', `/youtube/v3/search`, {}, qs);
                            }
                            else {
                                qs.maxResults = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/youtube/v3/search`, {}, qs);
                                responseData = responseData.items;
                            }
                        }
                        //https://developers.google.com/youtube/v3/docs/videos/list?hl=en
                        if (operation === 'get') {
                            let part = this.getNodeParameter('part', i);
                            const videoId = this.getNodeParameter('videoId', i);
                            const options = this.getNodeParameter('options', i);
                            if (part.includes('*')) {
                                part = [
                                    'contentDetails',
                                    'id',
                                    'liveStreamingDetails',
                                    'localizations',
                                    'player',
                                    'recordingDetails',
                                    'snippet',
                                    'statistics',
                                    'status',
                                    'topicDetails',
                                ];
                            }
                            qs.part = part.join(',');
                            qs.id = videoId;
                            Object.assign(qs, options);
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/youtube/v3/videos`, {}, qs);
                            responseData = responseData.items;
                        }
                        //https://developers.google.com/youtube/v3/guides/uploading_a_video?hl=en
                        if (operation === 'upload') {
                            const title = this.getNodeParameter('title', i);
                            const categoryId = this.getNodeParameter('categoryId', i);
                            const options = this.getNodeParameter('options', i);
                            const binaryProperty = this.getNodeParameter('binaryProperty', i);
                            let mimeType;
                            // Is binary file to upload
                            const item = items[i];
                            if (item.binary === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                            }
                            if (item.binary[binaryProperty] === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${binaryProperty}" does not exists on item!`);
                            }
                            if (item.binary[binaryProperty].mimeType) {
                                mimeType = item.binary[binaryProperty].mimeType;
                            }
                            const body = yield this.helpers.getBinaryDataBuffer(i, binaryProperty);
                            const requestOptions = {
                                headers: {
                                    'Content-Type': mimeType,
                                },
                                json: false,
                            };
                            const response = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', '/upload/youtube/v3/videos', body, qs, undefined, requestOptions);
                            const { id } = JSON.parse(response);
                            qs.part = 'snippet, status, recordingDetails';
                            const data = {
                                id,
                                snippet: {
                                    title,
                                    categoryId,
                                },
                                status: {},
                                recordingDetails: {},
                            };
                            if (options.description) {
                                //@ts-ignore
                                data.snippet.description = options.description;
                            }
                            if (options.privacyStatus) {
                                //@ts-ignore
                                data.status.privacyStatus = options.privacyStatus;
                            }
                            if (options.tags) {
                                //@ts-ignore
                                data.snippet.tags = options.tags.split(',');
                            }
                            if (options.embeddable) {
                                //@ts-ignore
                                data.status.embeddable = options.embeddable;
                            }
                            if (options.publicStatsViewable) {
                                //@ts-ignore
                                data.status.publicStatsViewable = options.publicStatsViewable;
                            }
                            if (options.publishAt) {
                                //@ts-ignore
                                data.status.publishAt = options.publishAt;
                            }
                            if (options.recordingDate) {
                                //@ts-ignore
                                data.recordingDetails.recordingDate = options.recordingDate;
                            }
                            if (options.selfDeclaredMadeForKids) {
                                //@ts-ignore
                                data.status.selfDeclaredMadeForKids = options.selfDeclaredMadeForKids;
                            }
                            if (options.license) {
                                //@ts-ignore
                                data.status.license = options.license;
                            }
                            if (options.defaultLanguage) {
                                //@ts-ignore
                                data.snippet.defaultLanguage = options.defaultLanguage;
                            }
                            if (options.notifySubscribers) {
                                qs.notifySubscribers = options.notifySubscribers;
                                delete options.notifySubscribers;
                            }
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'PUT', `/youtube/v3/videos`, data, qs);
                        }
                        //https://developers.google.com/youtube/v3/docs/playlists/update
                        if (operation === 'update') {
                            const id = this.getNodeParameter('videoId', i);
                            const title = this.getNodeParameter('title', i);
                            const categoryId = this.getNodeParameter('categoryId', i);
                            const updateFields = this.getNodeParameter('updateFields', i);
                            qs.part = 'snippet, status, recordingDetails';
                            const body = {
                                id,
                                snippet: {
                                    title,
                                    categoryId,
                                },
                                status: {},
                                recordingDetails: {},
                            };
                            if (updateFields.description) {
                                //@ts-ignore
                                body.snippet.description = updateFields.description;
                            }
                            if (updateFields.privacyStatus) {
                                //@ts-ignore
                                body.status.privacyStatus = updateFields.privacyStatus;
                            }
                            if (updateFields.tags) {
                                //@ts-ignore
                                body.snippet.tags = updateFields.tags.split(',');
                            }
                            if (updateFields.embeddable) {
                                //@ts-ignore
                                body.status.embeddable = updateFields.embeddable;
                            }
                            if (updateFields.publicStatsViewable) {
                                //@ts-ignore
                                body.status.publicStatsViewable = updateFields.publicStatsViewable;
                            }
                            if (updateFields.publishAt) {
                                //@ts-ignore
                                body.status.publishAt = updateFields.publishAt;
                            }
                            if (updateFields.selfDeclaredMadeForKids) {
                                //@ts-ignore
                                body.status.selfDeclaredMadeForKids = updateFields.selfDeclaredMadeForKids;
                            }
                            if (updateFields.recordingDate) {
                                //@ts-ignore
                                body.recordingDetails.recordingDate = updateFields.recordingDate;
                            }
                            if (updateFields.license) {
                                //@ts-ignore
                                body.status.license = updateFields.license;
                            }
                            if (updateFields.defaultLanguage) {
                                //@ts-ignore
                                body.snippet.defaultLanguage = updateFields.defaultLanguage;
                            }
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'PUT', '/youtube/v3/videos', body, qs);
                        }
                        //https://developers.google.com/youtube/v3/docs/videos/delete?hl=en
                        if (operation === 'delete') {
                            const videoId = this.getNodeParameter('videoId', i);
                            const options = this.getNodeParameter('options', i);
                            const body = {
                                id: videoId,
                            };
                            if (options.onBehalfOfContentOwner) {
                                qs.onBehalfOfContentOwner = options.onBehalfOfContentOwner;
                            }
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'DELETE', '/youtube/v3/videos', body);
                            responseData = { success: true };
                        }
                        //https://developers.google.com/youtube/v3/docs/videos/rate?hl=en
                        if (operation === 'rate') {
                            const videoId = this.getNodeParameter('videoId', i);
                            const rating = this.getNodeParameter('rating', i);
                            const body = {
                                id: videoId,
                                rating,
                            };
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', '/youtube/v3/videos/rate', body);
                            responseData = { success: true };
                        }
                    }
                    if (resource === 'videoCategory') {
                        //https://developers.google.com/youtube/v3/docs/videoCategories/list
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const regionCode = this.getNodeParameter('regionCode', i);
                            qs.regionCode = regionCode;
                            qs.part = 'snippet';
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/youtube/v3/videoCategories`, {}, qs);
                            responseData = responseData.items;
                            if (returnAll === false) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.splice(0, limit);
                            }
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
            }
            if (Array.isArray(responseData)) {
                returnData.push.apply(returnData, responseData);
            }
            else if (responseData !== undefined) {
                returnData.push(responseData);
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.YouTube = YouTube;
