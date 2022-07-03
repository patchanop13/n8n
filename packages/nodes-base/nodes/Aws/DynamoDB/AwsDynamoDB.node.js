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
exports.AwsDynamoDB = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const ItemDescription_1 = require("./ItemDescription");
const utils_1 = require("./utils");
class AwsDynamoDB {
    constructor() {
        this.description = {
            displayName: 'AWS DynamoDB',
            name: 'awsDynamoDb',
            icon: 'file:dynamodb.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the AWS DynamoDB API',
            defaults: {
                name: 'AWS DynamoDB',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'aws',
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
                            name: 'Item',
                            value: 'item',
                        },
                    ],
                    default: 'item',
                },
                ...ItemDescription_1.itemOperations,
                ...ItemDescription_1.itemFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getTables() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const headers = {
                            'Content-Type': 'application/x-amz-json-1.0',
                            'X-Amz-Target': 'DynamoDB_20120810.ListTables',
                        };
                        const responseData = yield GenericFunctions_1.awsApiRequest.call(this, 'dynamodb', 'POST', '/', {}, headers);
                        return responseData.TableNames.map((table) => ({ name: table, value: table }));
                    });
                },
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let responseData;
            const returnData = [];
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'item') {
                        if (operation === 'upsert') {
                            // ----------------------------------
                            //             upsert
                            // ----------------------------------
                            // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html
                            const eavUi = this.getNodeParameter('additionalFields.eavUi.eavValues', i, []);
                            const conditionExpession = this.getNodeParameter('conditionExpression', i, '');
                            const eanUi = this.getNodeParameter('additionalFields.eanUi.eanValues', i, []);
                            const body = {
                                TableName: this.getNodeParameter('tableName', i),
                            };
                            const expressionAttributeValues = (0, utils_1.adjustExpressionAttributeValues)(eavUi);
                            if (Object.keys(expressionAttributeValues).length) {
                                body.ExpressionAttributeValues = expressionAttributeValues;
                            }
                            const expressionAttributeName = (0, utils_1.adjustExpressionAttributeName)(eanUi);
                            if (Object.keys(expressionAttributeName).length) {
                                body.expressionAttributeNames = expressionAttributeName;
                            }
                            if (conditionExpession) {
                                body.ConditionExpression = conditionExpession;
                            }
                            const dataToSend = this.getNodeParameter('dataToSend', 0);
                            const item = {};
                            if (dataToSend === 'autoMapInputData') {
                                const incomingKeys = Object.keys(items[i].json);
                                const rawInputsToIgnore = this.getNodeParameter('inputsToIgnore', i);
                                const inputsToIgnore = rawInputsToIgnore.split(',').map(c => c.trim());
                                for (const key of incomingKeys) {
                                    if (inputsToIgnore.includes(key))
                                        continue;
                                    item[key] = items[i].json[key];
                                }
                                body.Item = (0, utils_1.adjustPutItem)(item);
                            }
                            else {
                                const fields = this.getNodeParameter('fieldsUi.fieldValues', i, []);
                                fields.forEach(({ fieldId, fieldValue }) => item[fieldId] = fieldValue);
                                body.Item = (0, utils_1.adjustPutItem)(item);
                            }
                            const headers = {
                                'Content-Type': 'application/x-amz-json-1.0',
                                'X-Amz-Target': 'DynamoDB_20120810.PutItem',
                            };
                            responseData = yield GenericFunctions_1.awsApiRequest.call(this, 'dynamodb', 'POST', '/', body, headers);
                            responseData = item;
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //              delete
                            // ----------------------------------
                            // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html
                            // tslint:disable-next-line: no-any
                            const body = {
                                TableName: this.getNodeParameter('tableName', i),
                                Key: {},
                                ReturnValues: this.getNodeParameter('returnValues', 0),
                            };
                            const eavUi = this.getNodeParameter('additionalFields.eavUi.eavValues', i, []);
                            const eanUi = this.getNodeParameter('additionalFields.eanUi.eanValues', i, []);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const simple = this.getNodeParameter('simple', 0, false);
                            const items = this.getNodeParameter('keysUi.keyValues', i, []);
                            for (const item of items) {
                                let value = item.value;
                                // All data has to get send as string even numbers
                                // @ts-ignore
                                value = ![null, undefined].includes(value) ? value === null || value === void 0 ? void 0 : value.toString() : '';
                                body.Key[item.key] = { [item.type]: value };
                            }
                            const expressionAttributeValues = (0, utils_1.adjustExpressionAttributeValues)(eavUi);
                            if (Object.keys(expressionAttributeValues).length) {
                                body.ExpressionAttributeValues = expressionAttributeValues;
                            }
                            const expressionAttributeName = (0, utils_1.adjustExpressionAttributeName)(eanUi);
                            if (Object.keys(expressionAttributeName).length) {
                                body.expressionAttributeNames = expressionAttributeName;
                            }
                            const headers = {
                                'Content-Type': 'application/x-amz-json-1.0',
                                'X-Amz-Target': 'DynamoDB_20120810.DeleteItem',
                            };
                            if (additionalFields.conditionExpression) {
                                body.ConditionExpression = additionalFields.conditionExpression;
                            }
                            responseData = yield GenericFunctions_1.awsApiRequest.call(this, 'dynamodb', 'POST', '/', body, headers);
                            if (!Object.keys(responseData).length) {
                                responseData = { success: true };
                            }
                            else if (simple === true) {
                                responseData = (0, utils_1.decodeItem)(responseData.Attributes);
                            }
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //              get
                            // ----------------------------------
                            // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html
                            const tableName = this.getNodeParameter('tableName', 0);
                            const simple = this.getNodeParameter('simple', 0, false);
                            const select = this.getNodeParameter('select', 0);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const eanUi = this.getNodeParameter('additionalFields.eanUi.eanValues', i, []);
                            // tslint:disable-next-line: no-any
                            const body = {
                                TableName: tableName,
                                Key: {},
                                Select: select,
                            };
                            Object.assign(body, additionalFields);
                            const expressionAttributeName = (0, utils_1.adjustExpressionAttributeName)(eanUi);
                            if (Object.keys(expressionAttributeName).length) {
                                body.expressionAttributeNames = expressionAttributeName;
                            }
                            if (additionalFields.readType) {
                                body.ConsistentRead = additionalFields.readType === 'stronglyConsistentRead';
                            }
                            if (additionalFields.projectionExpression) {
                                body.ProjectionExpression = additionalFields.projectionExpression;
                            }
                            const items = this.getNodeParameter('keysUi.keyValues', i, []);
                            for (const item of items) {
                                let value = item.value;
                                // All data has to get send as string even numbers
                                // @ts-ignore
                                value = ![null, undefined].includes(value) ? value === null || value === void 0 ? void 0 : value.toString() : '';
                                body.Key[item.key] = { [item.type]: value };
                            }
                            const headers = {
                                'X-Amz-Target': 'DynamoDB_20120810.GetItem',
                                'Content-Type': 'application/x-amz-json-1.0',
                            };
                            responseData = yield GenericFunctions_1.awsApiRequest.call(this, 'dynamodb', 'POST', '/', body, headers);
                            responseData = responseData.Item;
                            if (simple && responseData) {
                                responseData = (0, utils_1.decodeItem)(responseData);
                            }
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //             getAll
                            // ----------------------------------
                            // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html
                            const eavUi = this.getNodeParameter('eavUi.eavValues', i, []);
                            const simple = this.getNodeParameter('simple', 0, false);
                            const select = this.getNodeParameter('select', 0);
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            const scan = this.getNodeParameter('scan', 0);
                            const eanUi = this.getNodeParameter('additionalFields.eanUi.eanValues', i, []);
                            const body = {
                                TableName: this.getNodeParameter('tableName', i),
                                ExpressionAttributeValues: (0, utils_1.adjustExpressionAttributeValues)(eavUi),
                            };
                            if (scan === true) {
                                body['FilterExpression'] = this.getNodeParameter('filterExpression', i);
                            }
                            else {
                                body['KeyConditionExpression'] = this.getNodeParameter('keyConditionExpression', i);
                            }
                            const { indexName, projectionExpression, filterExpression, } = this.getNodeParameter('options', i);
                            const expressionAttributeName = (0, utils_1.adjustExpressionAttributeName)(eanUi);
                            if (Object.keys(expressionAttributeName).length) {
                                body.ExpressionAttributeNames = expressionAttributeName;
                            }
                            if (indexName) {
                                body.IndexName = indexName;
                            }
                            if (projectionExpression && select !== 'COUNT') {
                                body.ProjectionExpression = projectionExpression;
                            }
                            if (filterExpression) {
                                body.FilterExpression = filterExpression;
                            }
                            if (select) {
                                body.Select = select;
                            }
                            const headers = {
                                'Content-Type': 'application/json',
                                'X-Amz-Target': (scan) ? 'DynamoDB_20120810.Scan' : 'DynamoDB_20120810.Query',
                            };
                            if (returnAll === true && select !== 'COUNT') {
                                responseData = yield GenericFunctions_1.awsApiRequestAllItems.call(this, 'dynamodb', 'POST', '/', body, headers);
                            }
                            else {
                                body.Limit = this.getNodeParameter('limit', 0, 1);
                                responseData = yield GenericFunctions_1.awsApiRequest.call(this, 'dynamodb', 'POST', '/', body, headers);
                                if (select !== 'COUNT') {
                                    responseData = responseData.Items;
                                }
                            }
                            if (simple === true) {
                                responseData = responseData.map(utils_1.simplify);
                            }
                        }
                        Array.isArray(responseData)
                            ? returnData.push(...responseData)
                            : returnData.push(responseData);
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
exports.AwsDynamoDB = AwsDynamoDB;
