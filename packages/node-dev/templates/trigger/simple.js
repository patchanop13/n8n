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
exports.ClassNameReplace = void 0;
class ClassNameReplace {
    constructor() {
        this.description = {
            displayName: 'DisplayNameReplace',
            name: 'N8nNameReplace',
            group: ['trigger'],
            version: 1,
            description: 'NodeDescriptionReplace',
            defaults: {
                name: 'DisplayNameReplace',
                color: '#00FF00',
            },
            inputs: [],
            outputs: ['main'],
            properties: [
                // Node properties which the user gets displayed and
                // can change on the node.
                {
                    displayName: 'Interval',
                    name: 'interval',
                    type: 'number',
                    typeOptions: {
                        minValue: 1,
                    },
                    default: 1,
                    description: 'Every how many minutes the workflow should be triggered.',
                },
            ],
        };
    }
    trigger() {
        return __awaiter(this, void 0, void 0, function* () {
            const interval = this.getNodeParameter('interval', 1);
            if (interval <= 0) {
                throw new Error('The interval has to be set to at least 1 or higher!');
            }
            const executeTrigger = () => {
                // Every time the emit function gets called a new workflow
                // executions gets started with the provided entries.
                const entry = {
                    exampleKey: 'exampleData',
                };
                this.emit([this.helpers.returnJsonArray([entry])]);
            };
            // Sets an interval and triggers the workflow all n seconds
            // (depends on what the user selected on the node)
            const intervalValue = interval * 60 * 1000;
            const intervalObj = setInterval(executeTrigger, intervalValue);
            // The "closeFunction" function gets called by n8n whenever
            // the workflow gets deactivated and can so clean up.
            function closeFunction() {
                return __awaiter(this, void 0, void 0, function* () {
                    clearInterval(intervalObj);
                });
            }
            // The "manualTriggerFunction" function gets called by n8n
            // when a user is in the workflow editor and starts the
            // workflow manually. So the function has to make sure that
            // the emit() gets called with similar data like when it
            // would trigger by itself so that the user knows what data
            // to expect.
            function manualTriggerFunction() {
                return __awaiter(this, void 0, void 0, function* () {
                    executeTrigger();
                });
            }
            return {
                closeFunction,
                manualTriggerFunction,
            };
        });
    }
}
exports.ClassNameReplace = ClassNameReplace;
