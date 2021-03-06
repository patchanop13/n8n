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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAutomaticSecret = exports.getInputTextProperties = exports.getTextBlockProperties = exports.getActionInheritedProperties = exports.getAttachemnts = exports.mapResource = exports.getEvents = exports.webexApiRequestAllItems = exports.webexApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const lodash_1 = require("lodash");
const crypto_1 = require("crypto");
function webexApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let options = {
            method,
            body,
            qs,
            uri: uri || `https://webexapis.com/v1${resource}`,
            json: true,
        };
        try {
            if (Object.keys(option).length !== 0) {
                options = Object.assign({}, options, option);
            }
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            if (Object.keys(qs).length === 0) {
                delete options.qs;
            }
            //@ts-ignore
            return yield this.helpers.requestOAuth2.call(this, 'ciscoWebexOAuth2Api', options, { tokenType: 'Bearer' });
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.webexApiRequest = webexApiRequest;
function webexApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        let uri;
        query.max = 100;
        do {
            responseData = yield webexApiRequest.call(this, method, endpoint, body, query, uri, Object.assign({ resolveWithFullResponse: true }, options));
            if (responseData.headers.link) {
                uri = responseData.headers['link'].split(';')[0].replace('<', '').replace('>', '');
            }
            returnData.push.apply(returnData, responseData.body[propertyName]);
        } while (responseData.headers['link'] !== undefined &&
            responseData.headers['link'].includes('rel="next"'));
        return returnData;
    });
}
exports.webexApiRequestAllItems = webexApiRequestAllItems;
function getEvents() {
    const resourceEvents = {
        'attachmentAction': ['created', 'deleted', 'updated', '*'],
        'membership': ['created', 'deleted', 'updated', '*'],
        'message': ['created', 'deleted', 'updated', '*'],
        'room': ['created', 'deleted', 'updated', '*'],
        'meeting': ['created', 'deleted', 'updated', 'started', 'ended', '*'],
        'recording': ['created', 'deleted', 'updated', '*'],
        'telephonyCall': ['created', 'deleted', 'updated'],
        '*': ['created', 'updated', 'deleted', '*'],
    };
    const elements = [];
    for (const resource of Object.keys(resourceEvents)) {
        elements.push({
            displayName: 'Event',
            name: 'event',
            type: 'options',
            displayOptions: {
                show: {
                    resource: [
                        (resource === '*') ? 'all' : resource,
                    ],
                },
            },
            options: resourceEvents[resource].map((event) => ({ value: (event === '*' ? 'all' : event), name: (0, lodash_1.upperFirst)(event) })),
            default: '',
            required: true,
        });
    }
    return elements;
}
exports.getEvents = getEvents;
function mapResource(event) {
    return {
        'attachmentAction': 'attachmentActions',
        'membership': 'memberships',
        'message': 'messages',
        'room': 'rooms',
        'meeting': 'meetings',
        'recording': 'recordings',
        'telephonyCall': 'telephony_calls',
        'all': 'all',
    }[event];
}
exports.mapResource = mapResource;
function getAttachemnts(attachements) {
    const _attachments = [];
    for (const attachment of attachements) {
        const body = [];
        const actions = [];
        for (const element of (attachment === null || attachment === void 0 ? void 0 : attachment.elementsUi).elementValues || []) {
            // tslint:disable-next-line: no-any
            const _a = element, { type } = _a, rest = __rest(_a, ["type"]);
            if (type.startsWith('input')) {
                body.push(Object.assign({ type: `Input.${(0, lodash_1.upperFirst)(type.replace('input', ''))}` }, removeEmptyProperties(rest)));
            }
            else {
                body.push(Object.assign({ type: (0, lodash_1.upperFirst)(type) }, removeEmptyProperties(rest)));
            }
        }
        for (const action of (attachment === null || attachment === void 0 ? void 0 : attachment.actionsUi).actionValues || []) {
            // tslint:disable-next-line: no-any
            const _b = action, { type } = _b, rest = __rest(_b, ["type"]);
            actions.push(Object.assign({ type: `Action.${(0, lodash_1.upperFirst)(type)}` }, removeEmptyProperties(rest)));
        }
        _attachments.push({
            contentType: 'application/vnd.microsoft.card.adaptive',
            content: {
                $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
                type: 'AdaptiveCard',
                version: '1.2',
                body,
                actions,
            },
        });
    }
    return _attachments;
}
exports.getAttachemnts = getAttachemnts;
function getActionInheritedProperties() {
    return [
        {
            displayName: 'Title',
            name: 'title',
            type: 'string',
            default: '',
            required: true,
            description: 'Label for button or link that represents this action',
        },
        {
            displayName: 'Icon URL',
            name: 'iconUrl',
            type: 'string',
            default: '',
            description: 'Optional icon to be shown on the action in conjunction with the title. Supports data URI in version 1.2+.',
        },
        {
            displayName: 'Style',
            name: 'style',
            type: 'options',
            options: [
                {
                    name: 'Default',
                    value: 'default',
                },
                {
                    name: 'Positive',
                    value: 'positive',
                },
                {
                    name: 'Destructive',
                    value: 'destructive',
                },
            ],
            default: 'default',
            description: 'Controls the style of an Action, which influences how the action is displayed, spoken, etc',
        },
    ];
}
exports.getActionInheritedProperties = getActionInheritedProperties;
function getTextBlockProperties() {
    return [
        {
            displayName: 'Text',
            name: 'text',
            type: 'string',
            default: '',
            displayOptions: {
                show: {
                    type: [
                        'textBlock',
                    ],
                },
            },
            required: true,
            description: 'Text to display. A subset of markdown is supported (https://aka.ms/ACTextFeatures).',
        },
        {
            displayName: 'Color',
            name: 'color',
            type: 'options',
            displayOptions: {
                show: {
                    type: [
                        'textBlock',
                    ],
                },
            },
            options: [
                {
                    name: 'Accent',
                    value: 'accent',
                },
                {
                    name: 'Attention',
                    value: 'attention',
                },
                {
                    name: 'Dark',
                    value: 'dark',
                },
                {
                    name: 'Default',
                    value: 'default',
                },
                {
                    name: 'Good',
                    value: 'good',
                },
                {
                    name: 'Light',
                    value: 'light',
                },
                {
                    name: 'Warning',
                    value: 'warning',
                },
            ],
            default: 'default',
            description: 'Color of the TextBlock element',
        },
        {
            displayName: 'Font Type',
            name: 'fontType',
            type: 'options',
            displayOptions: {
                show: {
                    type: [
                        'textBlock',
                    ],
                },
            },
            options: [
                {
                    name: 'Default',
                    value: 'default',
                },
                {
                    name: 'Monospace',
                    value: 'monospace',
                },
            ],
            default: 'default',
            description: 'Type of font to use for rendering',
        },
        {
            displayName: 'Horizontal Alignment',
            name: 'horizontalAlignment',
            type: 'options',
            displayOptions: {
                show: {
                    type: [
                        'textBlock',
                    ],
                },
            },
            options: [
                {
                    name: 'Left',
                    value: 'left',
                },
                {
                    name: 'Center',
                    value: 'center',
                },
                {
                    name: 'Right',
                    value: 'right',
                },
            ],
            default: 'left',
            description: 'Controls the horizontal text alignment',
        },
        {
            displayName: 'Is Subtle',
            name: 'isSubtle',
            type: 'boolean',
            displayOptions: {
                show: {
                    type: [
                        'textBlock',
                    ],
                },
            },
            default: false,
            description: 'Whether to display text slightly toned down to appear less prominent',
        },
        {
            displayName: 'Max Lines',
            name: 'maxLines',
            type: 'number',
            displayOptions: {
                show: {
                    type: [
                        'textBlock',
                    ],
                },
            },
            default: 1,
            description: 'Specifies the maximum number of lines to display',
        },
        {
            displayName: 'Size',
            name: 'size',
            type: 'options',
            displayOptions: {
                show: {
                    type: [
                        'textBlock',
                    ],
                },
            },
            options: [
                {
                    name: 'Default',
                    value: 'default',
                },
                {
                    name: 'Extra Large',
                    value: 'extraLarge',
                },
                {
                    name: 'Large',
                    value: 'large',
                },
                {
                    name: 'Medium',
                    value: 'medium',
                },
                {
                    name: 'Small',
                    value: 'small',
                },
            ],
            default: 'default',
            description: 'Controls size of text',
        },
        {
            displayName: 'Weight',
            name: 'weight',
            type: 'options',
            displayOptions: {
                show: {
                    type: [
                        'textBlock',
                    ],
                },
            },
            options: [
                {
                    name: 'Default',
                    value: 'default',
                },
                {
                    name: 'Lighter',
                    value: 'lighter',
                },
                {
                    name: 'Bolder',
                    value: 'bolder',
                },
            ],
            default: 'default',
            description: 'Controls the weight of TextBlock elements',
        },
        {
            displayName: 'Wrap',
            name: 'wrap',
            type: 'boolean',
            displayOptions: {
                show: {
                    type: [
                        'textBlock',
                    ],
                },
            },
            default: true,
            description: 'Whether to allow text to wrap. Otherwise, text is clipped.',
        },
        {
            displayName: 'Height',
            name: 'height',
            type: 'options',
            displayOptions: {
                show: {
                    type: [
                        'textBlock',
                    ],
                },
            },
            options: [
                {
                    name: 'Auto',
                    value: 'auto',
                },
                {
                    name: 'Stretch',
                    value: 'stretch',
                },
            ],
            default: 'auto',
            description: 'Specifies the height of the element',
        },
        {
            displayName: 'Separator',
            name: 'separator',
            type: 'boolean',
            default: false,
            displayOptions: {
                show: {
                    type: [
                        'textBlock',
                    ],
                },
            },
            description: 'Whether to draw a separating line at the top of the element',
        },
        {
            displayName: 'Spacing',
            name: 'spacing',
            type: 'options',
            displayOptions: {
                show: {
                    type: [
                        'textBlock',
                    ],
                },
            },
            options: [
                {
                    name: 'Default',
                    value: 'default',
                },
                {
                    name: 'Extra Large',
                    value: 'extraLarge',
                },
                {
                    name: 'Large',
                    value: 'large',
                },
                {
                    name: 'Medium',
                    value: 'medium',
                },
                {
                    name: 'None',
                    value: 'none',
                },
                {
                    name: 'Padding',
                    value: 'padding',
                },
                {
                    name: 'Small',
                    value: 'small',
                },
            ],
            default: 'default',
            description: 'Controls the amount of spacing between this element and the preceding element',
        },
        {
            displayName: 'ID',
            name: 'id',
            type: 'string',
            displayOptions: {
                show: {
                    type: [
                        'textBlock',
                    ],
                },
            },
            default: '',
            description: 'A unique identifier associated with the item',
        },
        {
            displayName: 'Is Visible',
            name: 'isVisible',
            type: 'boolean',
            displayOptions: {
                show: {
                    type: [
                        'textBlock',
                    ],
                },
            },
            default: true,
            description: 'Whether this item will be removed from the visual trees',
        },
    ];
}
exports.getTextBlockProperties = getTextBlockProperties;
function getInputTextProperties() {
    return [
        {
            displayName: 'ID',
            name: 'id',
            type: 'string',
            required: true,
            displayOptions: {
                show: {
                    type: [
                        'inputText',
                    ],
                },
            },
            default: '',
            description: 'Unique identifier for the value. Used to identify collected input when the Submit action is performed.',
        },
        {
            displayName: 'Is Multiline',
            name: 'isMultiline',
            type: 'boolean',
            displayOptions: {
                show: {
                    type: [
                        'inputText',
                    ],
                },
            },
            default: false,
            description: 'Whether to allow multiple lines of input',
        },
        {
            displayName: 'Max Length',
            name: 'maxLength',
            type: 'number',
            displayOptions: {
                show: {
                    type: [
                        'inputText',
                    ],
                },
            },
            default: 1,
            description: 'Hint of maximum length characters to collect (may be ignored by some clients)',
        },
        {
            displayName: 'Placeholder',
            name: 'placeholder',
            type: 'string',
            displayOptions: {
                show: {
                    type: [
                        'inputText',
                    ],
                },
            },
            default: '',
            description: 'Description of the input desired. Displayed when no text has been input.',
        },
        {
            displayName: 'Regex',
            name: 'regex',
            type: 'string',
            displayOptions: {
                show: {
                    type: [
                        'inputText',
                    ],
                },
            },
            default: '',
            description: 'Regular expression indicating the required format of this text input',
        },
        {
            displayName: 'Style',
            name: 'style',
            type: 'options',
            displayOptions: {
                show: {
                    type: [
                        'inputText',
                    ],
                },
            },
            options: [
                {
                    name: 'Text',
                    value: 'text',
                },
                {
                    name: 'Tel',
                    value: 'tel',
                },
                {
                    name: 'URL',
                    value: 'url',
                },
                {
                    name: 'Email',
                    value: 'email',
                },
            ],
            default: 'text',
            description: 'Style hint for text input',
        },
        {
            displayName: 'Value',
            name: 'value',
            type: 'string',
            displayOptions: {
                show: {
                    type: [
                        'inputText',
                    ],
                },
            },
            default: '',
            description: 'The initial value for this field',
        },
    ];
}
exports.getInputTextProperties = getInputTextProperties;
// tslint:disable-next-line: no-any
function removeEmptyProperties(rest) {
    return Object.keys(rest)
        .filter((k) => rest[k] !== '')
        .reduce((a, k) => (Object.assign(Object.assign({}, a), { [k]: rest[k] })), {});
}
function getAutomaticSecret(credentials) {
    const data = `${credentials.clientId},${credentials.clientSecret}`;
    return (0, crypto_1.createHash)('md5').update(data).digest('hex');
}
exports.getAutomaticSecret = getAutomaticSecret;
