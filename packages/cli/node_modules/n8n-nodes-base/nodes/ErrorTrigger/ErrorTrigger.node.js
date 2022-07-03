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
exports.ErrorTrigger = void 0;
class ErrorTrigger {
    constructor() {
        this.description = {
            displayName: 'Error Trigger',
            name: 'errorTrigger',
            icon: 'fa:bug',
            group: ['trigger'],
            version: 1,
            description: 'Triggers the workflow when another workflow has an error',
            eventTriggerDescription: '',
            mockManualExecution: true,
            maxNodes: 1,
            defaults: {
                name: 'Error Trigger',
                color: '#0000FF',
            },
            inputs: [],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'This node will trigger when there is an error in another workflow, as long as that workflow is set up to do so. <a href="https://docs.n8n.io/integrations/core-nodes/n8n-nodes-base.errortrigger" target="_blank">More info<a>',
                    name: 'notice',
                    type: 'notice',
                    default: '',
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const mode = this.getMode();
            if (mode === 'manual' && items.length === 1 && Object.keys(items[0].json).length === 0 && items[0].binary === undefined) {
                // If we are in manual mode and no input data got provided we return
                // example data to allow to develope and test errorWorkflows easily
                const restApiUrl = this.getRestApiUrl();
                const urlParts = restApiUrl.split('/');
                urlParts.pop();
                urlParts.push('execution');
                const id = 231;
                items[0].json = {
                    execution: {
                        id,
                        url: `${urlParts.join('/')}/${id}`,
                        retryOf: '34',
                        error: {
                            message: 'Example Error Message',
                            stack: 'Stacktrace',
                        },
                        lastNodeExecuted: 'Node With Error',
                        mode: 'manual',
                    },
                    workflow: {
                        id: '1',
                        name: 'Example Workflow',
                    },
                };
            }
            return this.prepareOutputData(items);
        });
    }
}
exports.ErrorTrigger = ErrorTrigger;
