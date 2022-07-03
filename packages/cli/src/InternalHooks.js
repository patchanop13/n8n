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
exports.InternalHooksClass = void 0;
/* eslint-disable import/no-cycle */
const n8n_core_1 = require("n8n-core");
const n8n_workflow_1 = require("n8n-workflow");
const change_case_1 = require("change-case");
class InternalHooksClass {
    constructor(telemetry, versionCli, nodeTypes) {
        this.telemetry = telemetry;
        this.versionCli = versionCli;
        this.nodeTypes = nodeTypes;
    }
    onServerStarted(diagnosticInfo, earliestWorkflowCreatedAt) {
        return __awaiter(this, void 0, void 0, function* () {
            const info = {
                version_cli: diagnosticInfo.versionCli,
                db_type: diagnosticInfo.databaseType,
                n8n_version_notifications_enabled: diagnosticInfo.notificationsEnabled,
                n8n_disable_production_main_process: diagnosticInfo.disableProductionWebhooksOnMainProcess,
                n8n_basic_auth_active: diagnosticInfo.basicAuthActive,
                system_info: diagnosticInfo.systemInfo,
                execution_variables: diagnosticInfo.executionVariables,
                n8n_deployment_type: diagnosticInfo.deploymentType,
                n8n_binary_data_mode: diagnosticInfo.binaryDataMode,
                n8n_multi_user_allowed: diagnosticInfo.n8n_multi_user_allowed,
                smtp_set_up: diagnosticInfo.smtp_set_up,
            };
            return Promise.all([
                this.telemetry.identify(info),
                this.telemetry.track('Instance started', Object.assign(Object.assign({}, info), { earliest_workflow_created: earliestWorkflowCreatedAt })),
            ]);
        });
    }
    onPersonalizationSurveySubmitted(userId, answers) {
        return __awaiter(this, void 0, void 0, function* () {
            const camelCaseKeys = Object.keys(answers);
            const personalizationSurveyData = { user_id: userId };
            camelCaseKeys.forEach((camelCaseKey) => {
                personalizationSurveyData[(0, change_case_1.snakeCase)(camelCaseKey)] = answers[camelCaseKey];
            });
            return this.telemetry.track('User responded to personalization questions', personalizationSurveyData);
        });
    }
    onWorkflowCreated(userId, workflow, publicApi) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nodeGraph } = n8n_workflow_1.TelemetryHelpers.generateNodesGraph(workflow, this.nodeTypes);
            return this.telemetry.track('User created workflow', {
                user_id: userId,
                workflow_id: workflow.id,
                node_graph: nodeGraph,
                node_graph_string: JSON.stringify(nodeGraph),
                public_api: publicApi,
            });
        });
    }
    onWorkflowDeleted(userId, workflowId, publicApi) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.telemetry.track('User deleted workflow', {
                user_id: userId,
                workflow_id: workflowId,
                public_api: publicApi,
            });
        });
    }
    onWorkflowSaved(userId, workflow, publicApi) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { nodeGraph } = n8n_workflow_1.TelemetryHelpers.generateNodesGraph(workflow, this.nodeTypes);
            const notesCount = Object.keys(nodeGraph.notes).length;
            const overlappingCount = Object.values(nodeGraph.notes).filter((note) => note.overlapping).length;
            return this.telemetry.track('User saved workflow', {
                user_id: userId,
                workflow_id: workflow.id,
                node_graph: nodeGraph,
                node_graph_string: JSON.stringify(nodeGraph),
                notes_count_overlapping: overlappingCount,
                notes_count_non_overlapping: notesCount - overlappingCount,
                version_cli: this.versionCli,
                num_tags: (_b = (_a = workflow.tags) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0,
                public_api: publicApi,
            });
        });
    }
    onWorkflowPostExecute(executionId, workflow, runData, userId) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [Promise.resolve()];
            const properties = {
                workflow_id: workflow.id,
                is_manual: false,
                version_cli: this.versionCli,
            };
            if (userId) {
                properties.user_id = userId;
            }
            if (runData !== undefined) {
                properties.execution_mode = runData.mode;
                properties.success = !!runData.finished;
                properties.is_manual = runData.mode === 'manual';
                let nodeGraphResult;
                if (!properties.success && (runData === null || runData === void 0 ? void 0 : runData.data.resultData.error)) {
                    properties.error_message = runData === null || runData === void 0 ? void 0 : runData.data.resultData.error.message;
                    let errorNodeName = (_a = runData === null || runData === void 0 ? void 0 : runData.data.resultData.error.node) === null || _a === void 0 ? void 0 : _a.name;
                    properties.error_node_type = (_b = runData === null || runData === void 0 ? void 0 : runData.data.resultData.error.node) === null || _b === void 0 ? void 0 : _b.type;
                    if (runData.data.resultData.lastNodeExecuted) {
                        const lastNode = n8n_workflow_1.TelemetryHelpers.getNodeTypeForName(workflow, runData.data.resultData.lastNodeExecuted);
                        if (lastNode !== undefined) {
                            properties.error_node_type = lastNode.type;
                            errorNodeName = lastNode.name;
                        }
                    }
                    if (properties.is_manual) {
                        nodeGraphResult = n8n_workflow_1.TelemetryHelpers.generateNodesGraph(workflow, this.nodeTypes);
                        properties.node_graph = nodeGraphResult.nodeGraph;
                        properties.node_graph_string = JSON.stringify(nodeGraphResult.nodeGraph);
                        if (errorNodeName) {
                            properties.error_node_id = nodeGraphResult.nameIndices[errorNodeName];
                        }
                    }
                }
                if (properties.is_manual) {
                    if (!nodeGraphResult) {
                        nodeGraphResult = n8n_workflow_1.TelemetryHelpers.generateNodesGraph(workflow, this.nodeTypes);
                    }
                    const manualExecEventProperties = {
                        workflow_id: workflow.id,
                        status: properties.success ? 'success' : 'failed',
                        error_message: properties.error_message,
                        error_node_type: properties.error_node_type,
                        node_graph: properties.node_graph,
                        node_graph_string: properties.node_graph_string,
                        error_node_id: properties.error_node_id,
                    };
                    if (!manualExecEventProperties.node_graph) {
                        nodeGraphResult = n8n_workflow_1.TelemetryHelpers.generateNodesGraph(workflow, this.nodeTypes);
                        manualExecEventProperties.node_graph = nodeGraphResult.nodeGraph;
                        manualExecEventProperties.node_graph_string = JSON.stringify(manualExecEventProperties.node_graph);
                    }
                    if ((_c = runData.data.startData) === null || _c === void 0 ? void 0 : _c.destinationNode) {
                        promises.push(this.telemetry.track('Manual node exec finished', Object.assign(Object.assign({}, manualExecEventProperties), { node_type: (_e = n8n_workflow_1.TelemetryHelpers.getNodeTypeForName(workflow, (_d = runData.data.startData) === null || _d === void 0 ? void 0 : _d.destinationNode)) === null || _e === void 0 ? void 0 : _e.type, node_id: nodeGraphResult.nameIndices[(_f = runData.data.startData) === null || _f === void 0 ? void 0 : _f.destinationNode] })));
                    }
                    else {
                        promises.push(this.telemetry.track('Manual workflow exec finished', manualExecEventProperties));
                    }
                }
            }
            return Promise.all([
                ...promises,
                n8n_core_1.BinaryDataManager.getInstance().persistBinaryDataForExecutionId(executionId),
                this.telemetry.trackWorkflowExecution(properties),
            ]).then(() => { });
        });
    }
    onN8nStop() {
        return __awaiter(this, void 0, void 0, function* () {
            const timeoutPromise = new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 3000);
            });
            return Promise.race([timeoutPromise, this.telemetry.trackN8nStop()]);
        });
    }
    onUserDeletion(userId, userDeletionData, publicApi) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.telemetry.track('User deleted user', Object.assign(Object.assign({}, userDeletionData), { user_id: userId, public_api: publicApi }));
        });
    }
    onUserInvite(userInviteData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.telemetry.track('User invited new user', userInviteData);
        });
    }
    onUserReinvite(userReinviteData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.telemetry.track('User resent new user invite email', userReinviteData);
        });
    }
    onUserRetrievedUser(userRetrievedData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.telemetry.track('User retrieved user', userRetrievedData);
        });
    }
    onUserRetrievedAllUsers(userRetrievedData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.telemetry.track('User retrieved all users', userRetrievedData);
        });
    }
    onUserRetrievedExecution(userRetrievedData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.telemetry.track('User retrieved execution', userRetrievedData);
        });
    }
    onUserRetrievedAllExecutions(userRetrievedData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.telemetry.track('User retrieved all executions', userRetrievedData);
        });
    }
    onUserRetrievedWorkflow(userRetrievedData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.telemetry.track('User retrieved workflow', userRetrievedData);
        });
    }
    onUserRetrievedAllWorkflows(userRetrievedData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.telemetry.track('User retrieved all workflows', userRetrievedData);
        });
    }
    onUserUpdate(userUpdateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.telemetry.track('User changed personal settings', userUpdateData);
        });
    }
    onUserInviteEmailClick(userInviteClickData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.telemetry.track('User clicked invite link from email', userInviteClickData);
        });
    }
    onUserPasswordResetEmailClick(userPasswordResetData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.telemetry.track('User clicked password reset link from email', userPasswordResetData);
        });
    }
    onUserTransactionalEmail(userTransactionalEmailData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.telemetry.track('Instance sent transacptional email to user', userTransactionalEmailData);
        });
    }
    onUserInvokedApi(userInvokedApiData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.telemetry.track('User invoked API', userInvokedApiData);
        });
    }
    onApiKeyDeleted(apiKeyDeletedData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.telemetry.track('API key deleted', apiKeyDeletedData);
        });
    }
    onApiKeyCreated(apiKeyCreatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.telemetry.track('API key created', apiKeyCreatedData);
        });
    }
    onUserPasswordResetRequestClick(userPasswordResetData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.telemetry.track('User requested password reset while logged out', userPasswordResetData);
        });
    }
    onInstanceOwnerSetup(instanceOwnerSetupData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.telemetry.track('Owner finished instance setup', instanceOwnerSetupData);
        });
    }
    onUserSignup(userSignupData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.telemetry.track('User signed up', userSignupData);
        });
    }
    onEmailFailed(failedEmailData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.telemetry.track('Instance failed to send transactional email to user', failedEmailData);
        });
    }
}
exports.InternalHooksClass = InternalHooksClass;
