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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workflowActivate = void 0;
const externalHooks_1 = require("@/components/mixins/externalHooks");
const workflowHelpers_1 = require("@/components/mixins/workflowHelpers");
const showMessage_1 = require("@/components/mixins/showMessage");
const vue_typed_mixins_1 = __importDefault(require("vue-typed-mixins"));
const constants_1 = require("@/constants");
exports.workflowActivate = (0, vue_typed_mixins_1.default)(externalHooks_1.externalHooks, workflowHelpers_1.workflowHelpers, showMessage_1.showMessage)
    .extend({
    data() {
        return {
            updatingWorkflowActivation: false,
        };
    },
    methods: {
        activateCurrentWorkflow(telemetrySource) {
            return __awaiter(this, void 0, void 0, function* () {
                const workflowId = this.$store.getters.workflowId;
                return this.updateWorkflowActivation(workflowId, true, telemetrySource);
            });
        },
        updateWorkflowActivation(workflowId, newActiveState, telemetrySource) {
            return __awaiter(this, void 0, void 0, function* () {
                this.updatingWorkflowActivation = true;
                const nodesIssuesExist = this.$store.getters.nodesIssuesExist;
                let currWorkflowId = workflowId;
                if (!currWorkflowId || currWorkflowId === constants_1.PLACEHOLDER_EMPTY_WORKFLOW_ID) {
                    const saved = yield this.saveCurrentWorkflow();
                    if (!saved) {
                        this.updatingWorkflowActivation = false;
                        return;
                    }
                    currWorkflowId = this.$store.getters.workflowId;
                }
                const isCurrentWorkflow = currWorkflowId === this.$store.getters['workflowId'];
                const activeWorkflows = this.$store.getters.getActiveWorkflows;
                const isWorkflowActive = activeWorkflows.includes(currWorkflowId);
                this.$telemetry.track('User set workflow active status', { workflow_id: currWorkflowId, is_active: newActiveState, previous_status: isWorkflowActive, ndv_input: telemetrySource === 'ndv' });
                try {
                    if (isWorkflowActive && newActiveState) {
                        this.$showMessage({
                            title: this.$locale.baseText('workflowActivator.workflowIsActive'),
                            type: 'success',
                        });
                        this.updatingWorkflowActivation = false;
                        return;
                    }
                    if (isCurrentWorkflow && nodesIssuesExist) {
                        this.$showMessage({
                            title: this.$locale.baseText('workflowActivator.showMessage.activeChangedNodesIssuesExistTrue.title'),
                            message: this.$locale.baseText('workflowActivator.showMessage.activeChangedNodesIssuesExistTrue.message'),
                            type: 'error',
                        });
                        this.updatingWorkflowActivation = false;
                        return;
                    }
                    yield this.updateWorkflow({ workflowId: currWorkflowId, active: newActiveState });
                }
                catch (error) {
                    const newStateName = newActiveState === true ? 'activated' : 'deactivated';
                    this.$showError(error, this.$locale.baseText('workflowActivator.showError.title', { interpolate: { newStateName } }) + ':');
                    this.updatingWorkflowActivation = false;
                    return;
                }
                const activationEventName = isCurrentWorkflow ? 'workflow.activeChangeCurrent' : 'workflow.activeChange';
                this.$externalHooks().run(activationEventName, { workflowId: currWorkflowId, active: newActiveState });
                this.$emit('workflowActiveChanged', { id: currWorkflowId, active: newActiveState });
                this.updatingWorkflowActivation = false;
                if (isCurrentWorkflow) {
                    if (newActiveState && window.localStorage.getItem(constants_1.LOCAL_STORAGE_ACTIVATION_FLAG) !== 'true') {
                        this.$store.dispatch('ui/openModal', constants_1.WORKFLOW_ACTIVE_MODAL_KEY);
                    }
                    else {
                        this.$store.dispatch('settings/fetchPromptsData');
                    }
                }
            });
        },
    },
});
