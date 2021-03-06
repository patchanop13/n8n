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
exports.WorkflowTrigger = void 0;
class WorkflowTrigger {
    constructor() {
        this.description = {
            displayName: 'Workflow Trigger',
            name: 'workflowTrigger',
            icon: 'fa:network-wired',
            group: ['trigger'],
            version: 1,
            description: 'Triggers based on various lifecycle events, like when a workflow is activated',
            eventTriggerDescription: '',
            mockManualExecution: true,
            activationMessage: 'Your workflow will now trigger executions on the event you have defined.',
            defaults: {
                name: 'Workflow Trigger',
                color: '#ff6d5a',
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
                    description: `Specifies under which conditions an execution should happen:
					<ul>
						<li><b>Active Workflow Updated</b>: Triggers when this workflow is updated</li>
						<li><b>Workflow Activated</b>: Triggers when this workflow is activated</li>
					</ul>`,
                    options: [
                        {
                            name: 'Active Workflow Updated',
                            value: 'update',
                            description: 'Triggers when this workflow is updated',
                        },
                        {
                            name: 'Workflow Activated',
                            value: 'activate',
                            description: 'Triggers when this workflow is activated',
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
                if (activationMode === 'activate') {
                    event = 'Workflow activated';
                }
                if (activationMode === 'update') {
                    event = 'Workflow updated';
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
exports.WorkflowTrigger = WorkflowTrigger;
