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
exports.Cockpit = void 0;
const CollectionDescription_1 = require("./CollectionDescription");
const CollectionFunctions_1 = require("./CollectionFunctions");
const FormDescription_1 = require("./FormDescription");
const FormFunctions_1 = require("./FormFunctions");
const GenericFunctions_1 = require("./GenericFunctions");
const SingletonDescription_1 = require("./SingletonDescription");
const SingletonFunctions_1 = require("./SingletonFunctions");
class Cockpit {
    constructor() {
        this.description = {
            displayName: 'Cockpit',
            name: 'cockpit',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:cockpit.png',
            group: ['output'],
            version: 1,
            subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
            description: 'Consume Cockpit API',
            defaults: {
                name: 'Cockpit',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'cockpitApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    default: 'collection',
                    options: [
                        {
                            name: 'Collection',
                            value: 'collection',
                        },
                        {
                            name: 'Form',
                            value: 'form',
                        },
                        {
                            name: 'Singleton',
                            value: 'singleton',
                        },
                    ],
                },
                ...CollectionDescription_1.collectionOperations,
                ...CollectionDescription_1.collectionFields,
                ...FormDescription_1.formOperations,
                ...FormDescription_1.formFields,
                ...SingletonDescription_1.singletonOperations,
                ...SingletonDescription_1.singletonFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getCollections() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const collections = yield CollectionFunctions_1.getAllCollectionNames.call(this);
                        return collections.map(itemName => {
                            return {
                                name: itemName,
                                value: itemName,
                            };
                        });
                    });
                },
                getSingletons() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const singletons = yield SingletonFunctions_1.getAllSingletonNames.call(this);
                        return singletons.map(itemName => {
                            return {
                                name: itemName,
                                value: itemName,
                            };
                        });
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
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let responseData;
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'collection') {
                        const collectionName = this.getNodeParameter('collection', i);
                        if (operation === 'create') {
                            const data = GenericFunctions_1.createDataFromParameters.call(this, i);
                            responseData = yield CollectionFunctions_1.createCollectionEntry.call(this, collectionName, data);
                        }
                        else if (operation === 'getAll') {
                            const options = this.getNodeParameter('options', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            if (!returnAll) {
                                options.limit = this.getNodeParameter('limit', i);
                            }
                            responseData = yield CollectionFunctions_1.getAllCollectionEntries.call(this, collectionName, options);
                        }
                        else if (operation === 'update') {
                            const id = this.getNodeParameter('id', i);
                            const data = GenericFunctions_1.createDataFromParameters.call(this, i);
                            responseData = yield CollectionFunctions_1.createCollectionEntry.call(this, collectionName, data, id);
                        }
                    }
                    else if (resource === 'form') {
                        const formName = this.getNodeParameter('form', i);
                        if (operation === 'submit') {
                            const form = GenericFunctions_1.createDataFromParameters.call(this, i);
                            responseData = yield FormFunctions_1.submitForm.call(this, formName, form);
                        }
                    }
                    else if (resource === 'singleton') {
                        const singletonName = this.getNodeParameter('singleton', i);
                        if (operation === 'get') {
                            responseData = yield SingletonFunctions_1.getSingleton.call(this, singletonName);
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
exports.Cockpit = Cockpit;
