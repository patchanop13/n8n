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
exports.PhilipsHue = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const LightDescription_1 = require("./LightDescription");
class PhilipsHue {
    constructor() {
        this.description = {
            displayName: 'Philips Hue',
            name: 'philipsHue',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:philipshue.png',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Philips Hue API',
            defaults: {
                name: 'Philips Hue',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'philipsHueOAuth2Api',
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
                            name: 'Light',
                            value: 'light',
                        },
                    ],
                    default: 'light',
                },
                ...LightDescription_1.lightOperations,
                ...LightDescription_1.lightFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the lights to display them to user so that he can
                // select them easily
                getLights() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const user = yield GenericFunctions_1.getUser.call(this);
                        const lights = yield GenericFunctions_1.philipsHueApiRequest.call(this, 'GET', `/api/${user}/lights`);
                        const groups = yield GenericFunctions_1.philipsHueApiRequest.call(this, 'GET', `/api/${user}/groups`);
                        for (const light of Object.keys(lights)) {
                            let lightName = lights[light].name;
                            const lightId = light;
                            for (const groupId of Object.keys(groups)) {
                                if (groups[groupId].type === 'Room' && groups[groupId].lights.includes(lightId)) {
                                    lightName = `${groups[groupId].name}: ${lightName}`;
                                }
                            }
                            returnData.push({
                                name: lightName,
                                value: lightId,
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
                if (resource === 'light') {
                    if (operation === 'update') {
                        const lightId = this.getNodeParameter('lightId', i);
                        const on = this.getNodeParameter('on', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const body = {
                            on,
                        };
                        if (additionalFields.transitiontime) {
                            additionalFields.transitiontime = (additionalFields.transitiontime * 100);
                        }
                        if (additionalFields.xy) {
                            additionalFields.xy = additionalFields.xy.split(',').map((e) => parseFloat(e));
                        }
                        if (additionalFields.xy_inc) {
                            additionalFields.xy_inc = additionalFields.xy_inc.split(',').map((e) => parseFloat(e));
                        }
                        Object.assign(body, additionalFields);
                        const user = yield GenericFunctions_1.getUser.call(this);
                        const data = yield GenericFunctions_1.philipsHueApiRequest.call(this, 'PUT', `/api/${user}/lights/${lightId}/state`, body);
                        responseData = {};
                        for (const response of data) {
                            Object.assign(responseData, response.success);
                        }
                    }
                    if (operation === 'delete') {
                        const lightId = this.getNodeParameter('lightId', i);
                        const user = yield GenericFunctions_1.getUser.call(this);
                        responseData = yield GenericFunctions_1.philipsHueApiRequest.call(this, 'DELETE', `/api/${user}/lights/${lightId}`);
                    }
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const user = yield GenericFunctions_1.getUser.call(this);
                        const lights = yield GenericFunctions_1.philipsHueApiRequest.call(this, 'GET', `/api/${user}/lights`);
                        responseData = Object.values(lights);
                        if (!returnAll) {
                            const limit = this.getNodeParameter('limit', i);
                            responseData = responseData.splice(0, limit);
                        }
                    }
                    if (operation === 'get') {
                        const lightId = this.getNodeParameter('lightId', i);
                        const user = yield GenericFunctions_1.getUser.call(this);
                        responseData = yield GenericFunctions_1.philipsHueApiRequest.call(this, 'GET', `/api/${user}/lights/${lightId}`);
                    }
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
exports.PhilipsHue = PhilipsHue;
