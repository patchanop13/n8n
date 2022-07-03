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
exports.SplitInBatches = void 0;
class SplitInBatches {
    constructor() {
        this.description = {
            displayName: 'Split In Batches',
            name: 'splitInBatches',
            icon: 'fa:th-large',
            group: ['organization'],
            version: 1,
            description: 'Split data into batches and iterate over each batch',
            defaults: {
                name: 'SplitInBatches',
                color: '#007755',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'You may not need this node — n8n nodes automatically run once for each input item. <a href="https://docs.n8n.io/getting-started/key-concepts/looping.html#using-loops-in-n8n" target="_blank">More info</a>',
                    name: 'splitInBatchesNotice',
                    type: 'notice',
                    default: '',
                },
                {
                    displayName: 'Batch Size',
                    name: 'batchSize',
                    type: 'number',
                    typeOptions: {
                        minValue: 1,
                    },
                    default: 10,
                    description: 'The number of items to return with each call',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'Reset',
                            name: 'reset',
                            type: 'boolean',
                            default: false,
                            description: 'Whether the node will be reset and so with the current input-data newly initialized',
                        },
                    ],
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the input data and create a new array so that we can remove
            // items without a problem
            const items = this.getInputData().slice();
            const nodeContext = this.getContext('node');
            const batchSize = this.getNodeParameter('batchSize', 0);
            const returnItems = [];
            const options = this.getNodeParameter('options', 0, {});
            if (nodeContext.items === undefined || options.reset === true) {
                // Is the first time the node runs
                nodeContext.currentRunIndex = 0;
                nodeContext.maxRunIndex = Math.ceil(items.length / batchSize);
                // Get the items which should be returned
                returnItems.push.apply(returnItems, items.splice(0, batchSize));
                // Set the other items to be saved in the context to return at later runs
                nodeContext.items = items;
            }
            else {
                // The node has been called before. So return the next batch of items.
                nodeContext.currentRunIndex += 1;
                returnItems.push.apply(returnItems, nodeContext.items.splice(0, batchSize));
            }
            nodeContext.noItemsLeft = nodeContext.items.length === 0;
            if (returnItems.length === 0) {
                // No data left to return so stop execution of the branch
                return null;
            }
            returnItems.map((item, index) => {
                item.pairedItem = {
                    item: index,
                };
            });
            return this.prepareOutputData(returnItems);
        });
    }
}
exports.SplitInBatches = SplitInBatches;
