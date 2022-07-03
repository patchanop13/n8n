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
exports.workflowHelpers = void 0;
const constants_1 = require("@/constants");
const n8n_workflow_1 = require("n8n-workflow");
const externalHooks_1 = require("@/components/mixins/externalHooks");
const restApi_1 = require("@/components/mixins/restApi");
const nodeHelpers_1 = require("@/components/mixins/nodeHelpers");
const showMessage_1 = require("@/components/mixins/showMessage");
const lodash_1 = require("lodash");
const vue_typed_mixins_1 = __importDefault(require("vue-typed-mixins"));
const uuid_1 = require("uuid");
exports.workflowHelpers = (0, vue_typed_mixins_1.default)(externalHooks_1.externalHooks, nodeHelpers_1.nodeHelpers, restApi_1.restApi, showMessage_1.showMessage)
    .extend({
    methods: {
        executeData(parentNode, currentNode, inputName, runIndex) {
            const executeData = {
                node: {},
                data: {},
                source: null,
            };
            if (parentNode.length) {
                // Add the input data to be able to also resolve the short expression format
                // which does not use the node name
                const parentNodeName = parentNode[0];
                const workflowRunData = this.$store.getters.getWorkflowRunData;
                if (workflowRunData === null) {
                    return executeData;
                }
                if (!workflowRunData[parentNodeName] ||
                    workflowRunData[parentNodeName].length <= runIndex ||
                    !workflowRunData[parentNodeName][runIndex].hasOwnProperty('data') ||
                    workflowRunData[parentNodeName][runIndex].data === undefined ||
                    !workflowRunData[parentNodeName][runIndex].data.hasOwnProperty(inputName)) {
                    executeData.data = {};
                }
                else {
                    executeData.data = workflowRunData[parentNodeName][runIndex].data;
                    if (workflowRunData[currentNode] && workflowRunData[currentNode][runIndex]) {
                        executeData.source = {
                            [inputName]: workflowRunData[currentNode][runIndex].source,
                        };
                    }
                    else {
                        // The curent node did not get executed in UI yet so build data manually
                        executeData.source = {
                            [inputName]: [
                                {
                                    previousNode: parentNodeName,
                                },
                            ],
                        };
                    }
                }
            }
            return executeData;
        },
        // Returns connectionInputData to be able to execute an expression.
        connectionInputData(parentNode, currentNode, inputName, runIndex, nodeConnection = { sourceIndex: 0, destinationIndex: 0 }) {
            let connectionInputData = null;
            const executeData = this.executeData(parentNode, currentNode, inputName, runIndex);
            if (parentNode.length) {
                if (!Object.keys(executeData.data).length || executeData.data[inputName].length <= nodeConnection.sourceIndex) {
                    connectionInputData = [];
                }
                else {
                    connectionInputData = executeData.data[inputName][nodeConnection.sourceIndex];
                    if (connectionInputData !== null) {
                        // Update the pairedItem information on items
                        connectionInputData = connectionInputData.map((item, itemIndex) => {
                            return Object.assign(Object.assign({}, item), { pairedItem: {
                                    item: itemIndex,
                                    input: nodeConnection.destinationIndex,
                                } });
                        });
                    }
                }
            }
            return connectionInputData;
        },
        // Returns a shallow copy of the nodes which means that all the data on the lower
        // levels still only gets referenced but the top level object is a different one.
        // This has the advantage that it is very fast and does not cause problems with vuex
        // when the workflow replaces the node-parameters.
        getNodes() {
            const nodes = this.$store.getters.allNodes;
            const returnNodes = [];
            for (const node of nodes) {
                returnNodes.push(Object.assign({}, node));
            }
            return returnNodes;
        },
        // Returns data about nodeTypes which ahve a "maxNodes" limit set.
        // For each such type does it return how high the limit is, how many
        // already exist and the name of this nodes.
        getNodeTypesMaxCount() {
            const nodes = this.$store.getters.allNodes;
            const returnData = {};
            const nodeTypes = this.$store.getters.allNodeTypes;
            for (const nodeType of nodeTypes) {
                if (nodeType.maxNodes !== undefined) {
                    returnData[nodeType.name] = {
                        exist: 0,
                        max: nodeType.maxNodes,
                        nodeNames: [],
                    };
                }
            }
            for (const node of nodes) {
                if (returnData[node.type] !== undefined) {
                    returnData[node.type].exist += 1;
                    returnData[node.type].nodeNames.push(node.name);
                }
            }
            return returnData;
        },
        // Returns how many nodes of the given type currently exist
        getNodeTypeCount(nodeType) {
            const nodes = this.$store.getters.allNodes;
            let count = 0;
            for (const node of nodes) {
                if (node.type === nodeType) {
                    count++;
                }
            }
            return count;
        },
        // Checks if everything in the workflow is complete and ready to be executed
        checkReadyForExecution(workflow, lastNodeName) {
            let node;
            let nodeType;
            let nodeIssues = null;
            const workflowIssues = {};
            let checkNodes = Object.keys(workflow.nodes);
            if (lastNodeName) {
                checkNodes = workflow.getParentNodes(lastNodeName);
                checkNodes.push(lastNodeName);
            }
            else {
                // As webhook nodes always take presidence check first
                // if there are any
                let checkWebhook = [];
                for (const nodeName of Object.keys(workflow.nodes)) {
                    if (workflow.nodes[nodeName].disabled !== true && workflow.nodes[nodeName].type === constants_1.WEBHOOK_NODE_TYPE) {
                        checkWebhook = [nodeName, ...checkWebhook, ...workflow.getChildNodes(nodeName)];
                    }
                }
                if (checkWebhook.length) {
                    checkNodes = checkWebhook;
                }
                else {
                    // If no webhook nodes got found try to find another trigger node
                    const startNode = workflow.getStartNode();
                    if (startNode !== undefined) {
                        checkNodes = workflow.getChildNodes(startNode.name);
                        checkNodes.push(startNode.name);
                    }
                }
            }
            for (const nodeName of checkNodes) {
                nodeIssues = null;
                node = workflow.nodes[nodeName];
                if (node.disabled === true) {
                    // Ignore issues on disabled nodes
                    continue;
                }
                nodeType = workflow.nodeTypes.getByNameAndVersion(node.type, node.typeVersion);
                if (nodeType === undefined) {
                    // Node type is not known
                    nodeIssues = {
                        typeUnknown: true,
                    };
                }
                else {
                    nodeIssues = this.getNodeIssues(nodeType.description, node, ['execution']);
                }
                if (nodeIssues !== null) {
                    workflowIssues[node.name] = nodeIssues;
                }
            }
            if (Object.keys(workflowIssues).length === 0) {
                return null;
            }
            return workflowIssues;
        },
        // Returns a workflow instance.
        getWorkflow(nodes, connections, copyData) {
            nodes = nodes || this.getNodes();
            connections = connections || this.$store.getters.allConnections;
            const nodeTypes = {
                nodeTypes: {},
                init: (nodeTypes) => __awaiter(this, void 0, void 0, function* () { }),
                getAll: () => {
                    // Does not get used in Workflow so no need to return it
                    return [];
                },
                getByNameAndVersion: (nodeType, version) => {
                    const nodeTypeDescription = this.$store.getters.nodeType(nodeType, version);
                    if (nodeTypeDescription === null) {
                        return undefined;
                    }
                    return {
                        description: nodeTypeDescription,
                        // As we do not have the trigger/poll functions available in the frontend
                        // we use the information available to figure out what are trigger nodes
                        // @ts-ignore
                        trigger: ![constants_1.ERROR_TRIGGER_NODE_TYPE, constants_1.START_NODE_TYPE].includes(nodeType) && nodeTypeDescription.inputs.length === 0 && !nodeTypeDescription.webhooks || undefined,
                    };
                },
            };
            let workflowId = this.$store.getters.workflowId;
            if (workflowId === constants_1.PLACEHOLDER_EMPTY_WORKFLOW_ID) {
                workflowId = undefined;
            }
            const workflowName = this.$store.getters.workflowName;
            if (copyData === true) {
                return new n8n_workflow_1.Workflow({ id: workflowId, name: workflowName, nodes: JSON.parse(JSON.stringify(nodes)), connections: JSON.parse(JSON.stringify(connections)), active: false, nodeTypes, settings: this.$store.getters.workflowSettings });
            }
            else {
                return new n8n_workflow_1.Workflow({ id: workflowId, name: workflowName, nodes, connections, active: false, nodeTypes, settings: this.$store.getters.workflowSettings });
            }
        },
        // Returns the currently loaded workflow as JSON.
        getWorkflowDataToSave() {
            const workflowNodes = this.$store.getters.allNodes;
            const workflowConnections = this.$store.getters.allConnections;
            let nodeData;
            const nodes = [];
            for (let nodeIndex = 0; nodeIndex < workflowNodes.length; nodeIndex++) {
                try {
                    // @ts-ignore
                    nodeData = this.getNodeDataToSave(workflowNodes[nodeIndex]);
                }
                catch (e) {
                    return Promise.reject(e);
                }
                nodes.push(nodeData);
            }
            const data = {
                name: this.$store.getters.workflowName,
                nodes,
                connections: workflowConnections,
                active: this.$store.getters.isActive,
                settings: this.$store.getters.workflowSettings,
                tags: this.$store.getters.workflowTags,
            };
            const workflowId = this.$store.getters.workflowId;
            if (workflowId !== constants_1.PLACEHOLDER_EMPTY_WORKFLOW_ID) {
                data.id = workflowId;
            }
            return Promise.resolve(data);
        },
        // Returns all node-types
        getNodeDataToSave(node) {
            const skipKeys = [
                'color',
                'continueOnFail',
                'credentials',
                'disabled',
                'issues',
                'notes',
                'parameters',
                'status',
            ];
            // @ts-ignore
            const nodeData = {
                parameters: {},
            };
            for (const key in node) {
                if (key.charAt(0) !== '_' && skipKeys.indexOf(key) === -1) {
                    // @ts-ignore
                    nodeData[key] = node[key];
                }
            }
            // Get the data of the node type that we can get the default values
            // TODO: Later also has to care about the node-type-version as defaults could be different
            const nodeType = this.$store.getters.nodeType(node.type, node.typeVersion);
            if (nodeType !== null) {
                // Node-Type is known so we can save the parameters correctly
                const nodeParameters = n8n_workflow_1.NodeHelpers.getNodeParameters(nodeType.properties, node.parameters, false, false, node);
                nodeData.parameters = nodeParameters !== null ? nodeParameters : {};
                // Add the node credentials if there are some set and if they should be displayed
                if (node.credentials !== undefined && nodeType.credentials !== undefined) {
                    const saveCredenetials = {};
                    for (const nodeCredentialTypeName of Object.keys(node.credentials)) {
                        if (this.hasProxyAuth(node) || Object.keys(node.parameters).includes('genericAuthType')) {
                            saveCredenetials[nodeCredentialTypeName] = node.credentials[nodeCredentialTypeName];
                            continue;
                        }
                        const credentialTypeDescription = nodeType.credentials
                            // filter out credentials with same name in different node versions
                            .filter((c) => this.displayParameter(node.parameters, c, '', node))
                            .find((c) => c.name === nodeCredentialTypeName);
                        if (credentialTypeDescription === undefined) {
                            // Credential type is not know so do not save
                            continue;
                        }
                        if (this.displayParameter(node.parameters, credentialTypeDescription, '', node) === false) {
                            // Credential should not be displayed so do also not save
                            continue;
                        }
                        saveCredenetials[nodeCredentialTypeName] = node.credentials[nodeCredentialTypeName];
                    }
                    // Set credential property only if it has content
                    if (Object.keys(saveCredenetials).length !== 0) {
                        nodeData.credentials = saveCredenetials;
                    }
                }
            }
            else {
                // Node-Type is not known so save the data as it is
                nodeData.credentials = node.credentials;
                nodeData.parameters = node.parameters;
                if (nodeData.color !== undefined) {
                    nodeData.color = node.color;
                }
            }
            // Save the disabled property and continueOnFail only when is set
            if (node.disabled === true) {
                nodeData.disabled = true;
            }
            if (node.continueOnFail === true) {
                nodeData.continueOnFail = true;
            }
            // Save the notes only if when they contain data
            if (![undefined, ''].includes(node.notes)) {
                nodeData.notes = node.notes;
            }
            return nodeData;
        },
        getWebhookExpressionValue(webhookData, key) {
            if (webhookData[key] === undefined) {
                return 'empty';
            }
            try {
                return this.resolveExpression(webhookData[key]);
            }
            catch (e) {
                return this.$locale.baseText('nodeWebhooks.invalidExpression');
            }
        },
        getWebhookUrl(webhookData, node, showUrlFor) {
            if (webhookData.restartWebhook === true) {
                return '$resumeWebhookUrl';
            }
            let baseUrl = this.$store.getters.getWebhookUrl;
            if (showUrlFor === 'test') {
                baseUrl = this.$store.getters.getWebhookTestUrl;
            }
            const workflowId = this.$store.getters.workflowId;
            const path = this.getWebhookExpressionValue(webhookData, 'path');
            const isFullPath = this.getWebhookExpressionValue(webhookData, 'isFullPath') || false;
            return n8n_workflow_1.NodeHelpers.getNodeWebhookUrl(baseUrl, workflowId, node, path, isFullPath);
        },
        resolveParameter(parameter) {
            const itemIndex = 0;
            const inputName = 'main';
            const activeNode = this.$store.getters.activeNode;
            const workflow = this.getWorkflow();
            const parentNode = workflow.getParentNodes(activeNode.name, inputName, 1);
            const executionData = this.$store.getters.getWorkflowExecution;
            const workflowRunData = this.$store.getters.getWorkflowRunData;
            let runIndexParent = 0;
            if (workflowRunData !== null && parentNode.length) {
                runIndexParent = workflowRunData[parentNode[0]].length - 1;
            }
            const nodeConnection = workflow.getNodeConnectionIndexes(activeNode.name, parentNode[0]);
            let connectionInputData = this.connectionInputData(parentNode, activeNode.name, inputName, runIndexParent, nodeConnection);
            let runExecutionData;
            if (executionData === null) {
                runExecutionData = {
                    resultData: {
                        runData: {},
                    },
                };
            }
            else {
                runExecutionData = executionData.data;
            }
            if (connectionInputData === null) {
                connectionInputData = [];
            }
            const additionalKeys = {
                $executionId: constants_1.PLACEHOLDER_FILLED_AT_EXECUTION_TIME,
                $resumeWebhookUrl: constants_1.PLACEHOLDER_FILLED_AT_EXECUTION_TIME,
            };
            let runIndexCurrent = 0;
            if (workflowRunData !== null && workflowRunData[activeNode.name]) {
                runIndexCurrent = workflowRunData[activeNode.name].length - 1;
            }
            const executeData = this.executeData(parentNode, activeNode.name, inputName, runIndexCurrent);
            return workflow.expression.getParameterValue(parameter, runExecutionData, runIndexCurrent, itemIndex, activeNode.name, connectionInputData, 'manual', this.$store.getters.timezone, additionalKeys, executeData, false);
        },
        resolveExpression(expression, siblingParameters = {}) {
            const parameters = Object.assign({ '__xxxxxxx__': expression }, siblingParameters);
            const returnData = this.resolveParameter(parameters);
            if (typeof returnData['__xxxxxxx__'] === 'object') {
                const workflow = this.getWorkflow();
                return workflow.expression.convertObjectValueToString(returnData['__xxxxxxx__']);
            }
            return returnData['__xxxxxxx__'];
        },
        updateWorkflow({ workflowId, active }) {
            return __awaiter(this, void 0, void 0, function* () {
                let data = {};
                const isCurrentWorkflow = workflowId === this.$store.getters.workflowId;
                if (isCurrentWorkflow) {
                    data = yield this.getWorkflowDataToSave();
                }
                if (active !== undefined) {
                    data.active = active;
                }
                const workflow = yield this.restApi().updateWorkflow(workflowId, data);
                if (isCurrentWorkflow) {
                    this.$store.commit('setActive', !!workflow.active);
                    this.$store.commit('setStateDirty', false);
                }
                if (workflow.active) {
                    this.$store.commit('setWorkflowActive', workflowId);
                }
                else {
                    this.$store.commit('setWorkflowInactive', workflowId);
                }
            });
        },
        saveCurrentWorkflow({ name, tags } = {}, redirect = true) {
            return __awaiter(this, void 0, void 0, function* () {
                const currentWorkflow = this.$route.params.name;
                if (!currentWorkflow) {
                    return this.saveAsNewWorkflow({ name, tags }, redirect);
                }
                // Workflow exists already so update it
                try {
                    this.$store.commit('addActiveAction', 'workflowSaving');
                    const workflowDataRequest = yield this.getWorkflowDataToSave();
                    if (name) {
                        workflowDataRequest.name = name.trim();
                    }
                    if (tags) {
                        workflowDataRequest.tags = tags;
                    }
                    const workflowData = yield this.restApi().updateWorkflow(currentWorkflow, workflowDataRequest);
                    if (name) {
                        this.$store.commit('setWorkflowName', { newName: workflowData.name });
                    }
                    if (tags) {
                        const createdTags = (workflowData.tags || []);
                        const tagIds = createdTags.map((tag) => tag.id);
                        this.$store.commit('setWorkflowTagIds', tagIds);
                    }
                    this.$store.commit('setStateDirty', false);
                    this.$store.commit('removeActiveAction', 'workflowSaving');
                    this.$externalHooks().run('workflow.afterUpdate', { workflowData });
                    return true;
                }
                catch (error) {
                    this.$store.commit('removeActiveAction', 'workflowSaving');
                    this.$showMessage({
                        title: this.$locale.baseText('workflowHelpers.showMessage.title'),
                        message: error.message,
                        type: 'error',
                    });
                    return false;
                }
            });
        },
        saveAsNewWorkflow({ name, tags, resetWebhookUrls, openInNewWindow } = {}, redirect = true) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    this.$store.commit('addActiveAction', 'workflowSaving');
                    const workflowDataRequest = yield this.getWorkflowDataToSave();
                    // make sure that the new ones are not active
                    workflowDataRequest.active = false;
                    const changedNodes = {};
                    if (resetWebhookUrls) {
                        workflowDataRequest.nodes = workflowDataRequest.nodes.map(node => {
                            if (node.webhookId) {
                                node.webhookId = (0, uuid_1.v4)();
                                changedNodes[node.name] = node.webhookId;
                            }
                            return node;
                        });
                    }
                    if (name) {
                        workflowDataRequest.name = name.trim();
                    }
                    if (tags) {
                        workflowDataRequest.tags = tags;
                    }
                    const workflowData = yield this.restApi().createNewWorkflow(workflowDataRequest);
                    if (openInNewWindow) {
                        const routeData = this.$router.resolve({ name: constants_1.VIEWS.WORKFLOW, params: { name: workflowData.id } });
                        window.open(routeData.href, '_blank');
                        this.$store.commit('removeActiveAction', 'workflowSaving');
                        return true;
                    }
                    this.$store.commit('setActive', workflowData.active || false);
                    this.$store.commit('setWorkflowId', workflowData.id);
                    this.$store.commit('setWorkflowName', { newName: workflowData.name, setStateDirty: false });
                    this.$store.commit('setWorkflowSettings', workflowData.settings || {});
                    this.$store.commit('setStateDirty', false);
                    Object.keys(changedNodes).forEach((nodeName) => {
                        const changes = {
                            key: 'webhookId',
                            value: changedNodes[nodeName],
                            name: nodeName,
                        };
                        this.$store.commit('setNodeValue', changes);
                    });
                    const createdTags = (workflowData.tags || []);
                    const tagIds = createdTags.map((tag) => tag.id);
                    this.$store.commit('setWorkflowTagIds', tagIds);
                    const templateId = this.$route.query.templateId;
                    if (templateId) {
                        this.$telemetry.track('User saved new workflow from template', {
                            template_id: templateId,
                            workflow_id: workflowData.id,
                            wf_template_repo_session_id: this.$store.getters['templates/previousSessionId'],
                        });
                    }
                    if (redirect) {
                        this.$router.push({
                            name: constants_1.VIEWS.WORKFLOW,
                            params: { name: workflowData.id, action: 'workflowSave' },
                        });
                    }
                    this.$store.commit('removeActiveAction', 'workflowSaving');
                    this.$store.commit('setStateDirty', false);
                    this.$externalHooks().run('workflow.afterUpdate', { workflowData });
                    return true;
                }
                catch (e) {
                    this.$store.commit('removeActiveAction', 'workflowSaving');
                    this.$showMessage({
                        title: this.$locale.baseText('workflowHelpers.showMessage.title'),
                        message: e.message,
                        type: 'error',
                    });
                    return false;
                }
            });
        },
        // Updates the position of all the nodes that the top-left node
        // is at the given position
        updateNodePositions(workflowData, position) {
            if (workflowData.nodes === undefined) {
                return;
            }
            // Find most top-left node
            const minPosition = [99999999, 99999999];
            for (const node of workflowData.nodes) {
                if (node.position[1] < minPosition[1]) {
                    minPosition[0] = node.position[0];
                    minPosition[1] = node.position[1];
                }
                else if (node.position[1] === minPosition[1]) {
                    if (node.position[0] < minPosition[0]) {
                        minPosition[0] = node.position[0];
                        minPosition[1] = node.position[1];
                    }
                }
            }
            // Update the position on all nodes so that the
            // most top-left one is at given position
            const offsetPosition = [position[0] - minPosition[0], position[1] - minPosition[1]];
            for (const node of workflowData.nodes) {
                node.position[0] += offsetPosition[0];
                node.position[1] += offsetPosition[1];
            }
        },
        dataHasChanged(id) {
            return __awaiter(this, void 0, void 0, function* () {
                const currentData = yield this.getWorkflowDataToSave();
                const data = yield this.restApi().getWorkflow(id);
                if (data !== undefined) {
                    const x = {
                        nodes: data.nodes,
                        connections: data.connections,
                        settings: data.settings,
                        name: data.name,
                    };
                    const y = {
                        nodes: currentData.nodes,
                        connections: currentData.connections,
                        settings: currentData.settings,
                        name: currentData.name,
                    };
                    return !(0, lodash_1.isEqual)(x, y);
                }
                return true;
            });
        },
    },
});
