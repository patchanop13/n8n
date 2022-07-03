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
exports.MongoDb = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const mongo_node_options_1 = require("./mongo.node.options");
const mongodb_1 = require("mongodb");
const mongo_node_utils_1 = require("./mongo.node.utils");
class MongoDb {
    constructor() {
        this.description = mongo_node_options_1.nodeDescription;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const { database, connectionString } = (0, mongo_node_utils_1.validateAndResolveMongoCredentials)(this, yield this.getCredentials('mongoDb'));
            const client = yield mongodb_1.MongoClient.connect(connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            const mdb = client.db(database);
            let returnItems = [];
            const items = this.getInputData();
            const operation = this.getNodeParameter('operation', 0);
            if (operation === 'aggregate') {
                // ----------------------------------
                //         aggregate
                // ----------------------------------
                try {
                    const queryParameter = JSON.parse(this.getNodeParameter('query', 0));
                    if (queryParameter._id && typeof queryParameter._id === 'string') {
                        queryParameter._id = new mongodb_1.ObjectID(queryParameter._id);
                    }
                    const query = mdb
                        .collection(this.getNodeParameter('collection', 0))
                        .aggregate(queryParameter);
                    const queryResult = yield query.toArray();
                    returnItems = this.helpers.returnJsonArray(queryResult);
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnItems = this.helpers.returnJsonArray({ error: error.message });
                    }
                    else {
                        throw error;
                    }
                }
            }
            else if (operation === 'delete') {
                // ----------------------------------
                //         delete
                // ----------------------------------
                try {
                    const { deletedCount } = yield mdb
                        .collection(this.getNodeParameter('collection', 0))
                        .deleteMany(JSON.parse(this.getNodeParameter('query', 0)));
                    returnItems = this.helpers.returnJsonArray([{ deletedCount }]);
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnItems = this.helpers.returnJsonArray({ error: error.message });
                    }
                    else {
                        throw error;
                    }
                }
            }
            else if (operation === 'find') {
                // ----------------------------------
                //         find
                // ----------------------------------
                try {
                    const queryParameter = JSON.parse(this.getNodeParameter('query', 0));
                    if (queryParameter._id && typeof queryParameter._id === 'string') {
                        queryParameter._id = new mongodb_1.ObjectID(queryParameter._id);
                    }
                    let query = mdb
                        .collection(this.getNodeParameter('collection', 0))
                        .find(queryParameter);
                    const options = this.getNodeParameter('options', 0);
                    const limit = options.limit;
                    const skip = options.skip;
                    const sort = options.sort && JSON.parse(options.sort);
                    if (skip > 0) {
                        query = query.skip(skip);
                    }
                    if (limit > 0) {
                        query = query.limit(limit);
                    }
                    if (sort && Object.keys(sort).length !== 0 && sort.constructor === Object) {
                        query = query.sort(sort);
                    }
                    const queryResult = yield query.toArray();
                    returnItems = this.helpers.returnJsonArray(queryResult);
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnItems = this.helpers.returnJsonArray({ error: error.message });
                    }
                    else {
                        throw error;
                    }
                }
            }
            else if (operation === 'insert') {
                // ----------------------------------
                //         insert
                // ----------------------------------
                try {
                    // Prepare the data to insert and copy it to be returned
                    const fields = this.getNodeParameter('fields', 0)
                        .split(',')
                        .map(f => f.trim())
                        .filter(f => !!f);
                    const options = this.getNodeParameter('options', 0);
                    const insertItems = (0, mongo_node_utils_1.getItemCopy)(items, fields);
                    if (options.dateFields && !options.useDotNotation) {
                        (0, mongo_node_utils_1.handleDateFields)(insertItems, options.dateFields);
                    }
                    else if (options.dateFields && options.useDotNotation) {
                        (0, mongo_node_utils_1.handleDateFieldsWithDotNotation)(insertItems, options.dateFields);
                    }
                    const { insertedIds } = yield mdb
                        .collection(this.getNodeParameter('collection', 0))
                        .insertMany(insertItems);
                    // Add the id to the data
                    for (const i of Object.keys(insertedIds)) {
                        returnItems.push({
                            json: Object.assign(Object.assign({}, insertItems[parseInt(i, 10)]), { id: insertedIds[parseInt(i, 10)] }),
                        });
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnItems = this.helpers.returnJsonArray({ error: error.message });
                    }
                    else {
                        throw error;
                    }
                }
            }
            else if (operation === 'update') {
                // ----------------------------------
                //         update
                // ----------------------------------
                const fields = this.getNodeParameter('fields', 0)
                    .split(',')
                    .map(f => f.trim())
                    .filter(f => !!f);
                const options = this.getNodeParameter('options', 0);
                let updateKey = this.getNodeParameter('updateKey', 0);
                updateKey = updateKey.trim();
                const updateOptions = this.getNodeParameter('upsert', 0)
                    ? { upsert: true } : undefined;
                if (!fields.includes(updateKey)) {
                    fields.push(updateKey);
                }
                // Prepare the data to update and copy it to be returned
                const updateItems = (0, mongo_node_utils_1.getItemCopy)(items, fields);
                if (options.dateFields && !options.useDotNotation) {
                    (0, mongo_node_utils_1.handleDateFields)(updateItems, options.dateFields);
                }
                else if (options.dateFields && options.useDotNotation) {
                    (0, mongo_node_utils_1.handleDateFieldsWithDotNotation)(updateItems, options.dateFields);
                }
                for (const item of updateItems) {
                    try {
                        if (item[updateKey] === undefined) {
                            continue;
                        }
                        const filter = {};
                        filter[updateKey] = item[updateKey];
                        if (updateKey === '_id') {
                            filter[updateKey] = new mongodb_1.ObjectID(filter[updateKey]);
                            delete item['_id'];
                        }
                        yield mdb
                            .collection(this.getNodeParameter('collection', 0))
                            .updateOne(filter, { $set: item }, updateOptions);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            item.json = { error: error.message };
                            continue;
                        }
                        throw error;
                    }
                }
                returnItems = this.helpers.returnJsonArray(updateItems);
            }
            else {
                if (this.continueOnFail()) {
                    returnItems = this.helpers.returnJsonArray({ json: { error: `The operation "${operation}" is not supported!` } });
                }
                else {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not supported!`);
                }
            }
            client.close();
            return this.prepareOutputData(returnItems);
        });
    }
}
exports.MongoDb = MongoDb;
