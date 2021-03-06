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
exports.N8nTrainingCustomerDatastore = void 0;
const data = [
    {
        id: '23423532',
        name: 'Jay Gatsby',
        email: 'gatsby@west-egg.com',
        notes: 'Keeps asking about a green light??',
        country: 'US',
        created: '1925-04-10',
    },
    {
        id: '23423533',
        name: 'José Arcadio Buendía',
        email: 'jab@macondo.co',
        notes: 'Lots of people named after him. Very confusing',
        country: 'CO',
        created: '1967-05-05',
    },
    {
        id: '23423534',
        name: 'Max Sendak',
        email: 'info@in-and-out-of-weeks.org',
        notes: 'Keeps rolling his terrible eyes',
        country: 'US',
        created: '1963-04-09',
    },
    {
        id: '23423535',
        name: 'Zaphod Beeblebrox',
        email: 'captain@heartofgold.com',
        notes: 'Felt like I was talking to more than one person',
        country: null,
        created: '1979-10-12',
    },
    {
        id: '23423536',
        name: 'Edmund Pevensie',
        email: 'edmund@narnia.gov',
        notes: 'Passionate sailor',
        country: 'UK',
        created: '1950-10-16',
    },
];
class N8nTrainingCustomerDatastore {
    constructor() {
        this.description = {
            displayName: 'Customer Datastore (n8n training)',
            name: 'n8nTrainingCustomerDatastore',
            icon: 'file:n8nTrainingCustomerDatastore.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'Dummy node used for n8n training',
            defaults: {
                name: 'Customer Datastore',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Get One Person',
                            value: 'getOnePerson',
                        },
                        {
                            name: 'Get All People',
                            value: 'getAllPeople',
                        },
                    ],
                    default: 'getOnePerson',
                },
                {
                    displayName: 'Return All',
                    name: 'returnAll',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            operation: [
                                'getAllPeople',
                            ],
                        },
                    },
                    default: false,
                    description: 'Whether to return all results or only up to a given limit',
                },
                {
                    displayName: 'Limit',
                    name: 'limit',
                    type: 'number',
                    displayOptions: {
                        show: {
                            operation: [
                                'getAllPeople',
                            ],
                            returnAll: [
                                false,
                            ],
                        },
                    },
                    typeOptions: {
                        minValue: 1,
                        maxValue: 10,
                    },
                    default: 5,
                    description: 'Max number of results to return',
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const length = items.length;
            const operation = this.getNodeParameter('operation', 0);
            let responseData;
            for (let i = 0; i < length; i++) {
                if (operation === 'getOnePerson') {
                    responseData = data[0];
                }
                if (operation === 'getAllPeople') {
                    const returnAll = this.getNodeParameter('returnAll', i);
                    if (returnAll === true) {
                        responseData = data;
                    }
                    else {
                        const limit = this.getNodeParameter('limit', i);
                        responseData = data.slice(0, limit);
                    }
                }
                if (Array.isArray(responseData)) {
                    returnData.push.apply(returnData, responseData);
                }
                else if (responseData !== undefined) {
                    returnData.push(responseData);
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.N8nTrainingCustomerDatastore = N8nTrainingCustomerDatastore;
