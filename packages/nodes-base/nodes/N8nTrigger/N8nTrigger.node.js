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
exports.N8nTrigger = void 0;
class N8nTrigger {
    constructor() {
        this.description = {
            displayName: 'n8n Trigger',
            name: 'n8nTrigger',
            icon: 'file:n8nTrigger.svg',
            group: ['trigger'],
            version: 1,
            description: 'Handle events from your n8n instance',
            eventTriggerDescription: '',
            mockManualExecution: true,
            defaults: {
                name: 'n8n Trigger',
            },
            inputs: [],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Events',
                    name: 'events',
                    type: 'multiOptions',
                    required: true,
                    default: [],
                    description: 'Specifies under which conditions an execution should happen: <b>Instance started</b>: Triggers when this n8n instance is started or re-started',
                    options: [
                        {
                            name: 'Instance Started',
                            value: 'init',
                            description: 'Triggers when this n8n instance is started or re-started',
                        },
                    ],
                },
            ],
        };
    }
    trigger() {
        return __awaiter(this, void 0, void 0, function* () {
            const events = this.getNodeParameter('events', []);
            const activationMode = this.getActivationMode();
            if (events.includes(activationMode)) {
                let event;
                if (activationMode === 'init') {
                    event = 'Instance started';
                }
                this.emit([
                    this.helpers.returnJsonArray([
                        { event, timestamp: (new Date()).toISOString(), workflow_id: this.getWorkflow().id },
                    ]),
                ]);
            }
            const self = this;
            function manualTriggerFunction() {
                return __awaiter(this, void 0, void 0, function* () {
                    self.emit([self.helpers.returnJsonArray([{ event: 'Manual execution', timestamp: (new Date()).toISOString(), workflow_id: self.getWorkflow().id }])]);
                });
            }
            return {
                manualTriggerFunction,
            };
        });
    }
}
exports.N8nTrigger = N8nTrigger;
