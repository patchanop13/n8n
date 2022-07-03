"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const vue_1 = __importDefault(require("vue"));
const vuex_1 = __importDefault(require("vuex"));
const constants_1 = require("@/constants");
const credentials_1 = __importDefault(require("./modules/credentials"));
const settings_1 = __importDefault(require("./modules/settings"));
const tags_1 = __importDefault(require("./modules/tags"));
const ui_1 = __importDefault(require("./modules/ui"));
const users_1 = __importDefault(require("./modules/users"));
const workflows_1 = __importDefault(require("./modules/workflows"));
const versions_1 = __importDefault(require("./modules/versions"));
const templates_1 = __importDefault(require("./modules/templates"));
vue_1.default.use(vuex_1.default);
const state = {
    activeExecutions: [],
    activeWorkflows: [],
    activeActions: [],
    activeNode: null,
    activeCredentialType: null,
    // @ts-ignore
    baseUrl: process.env.VUE_APP_URL_BASE_API ? process.env.VUE_APP_URL_BASE_API : (window.BASE_PATH === '/%BASE_PATH%/' ? '/' : window.BASE_PATH),
    defaultLocale: 'en',
    endpointWebhook: 'webhook',
    endpointWebhookTest: 'webhook-test',
    executionId: null,
    executingNode: '',
    executionWaitingForWebhook: false,
    pushConnectionActive: true,
    saveDataErrorExecution: 'all',
    saveDataSuccessExecution: 'all',
    saveManualExecutions: false,
    timezone: 'America/New_York',
    stateIsDirty: false,
    executionTimeout: -1,
    maxExecutionTimeout: Number.MAX_SAFE_INTEGER,
    versionCli: '0.0.0',
    oauthCallbackUrls: {},
    n8nMetadata: {},
    workflowExecutionData: null,
    lastSelectedNode: null,
    lastSelectedNodeOutputIndex: null,
    nodeIndex: [],
    nodeTypes: [],
    nodeViewOffsetPosition: [0, 0],
    nodeViewMoveInProgress: false,
    selectedNodes: [],
    sessionId: Math.random().toString(36).substring(2, 15),
    urlBaseWebhook: 'http://localhost:5678/',
    workflow: {
        id: constants_1.PLACEHOLDER_EMPTY_WORKFLOW_ID,
        name: '',
        active: false,
        createdAt: -1,
        updatedAt: -1,
        connections: {},
        nodes: [],
        settings: {},
        tags: [],
    },
    sidebarMenuItems: [],
    instanceId: '',
    nodeMetadata: {},
};
const modules = {
    credentials: credentials_1.default,
    tags: tags_1.default,
    settings: settings_1.default,
    templates: templates_1.default,
    workflows: workflows_1.default,
    versions: versions_1.default,
    users: users_1.default,
    ui: ui_1.default,
};
exports.store = new vuex_1.default.Store({
    strict: process.env.NODE_ENV !== 'production',
    modules,
    state,
    mutations: {
        // Active Actions
        addActiveAction(state, action) {
            if (!state.activeActions.includes(action)) {
                state.activeActions.push(action);
            }
        },
        removeActiveAction(state, action) {
            const actionIndex = state.activeActions.indexOf(action);
            if (actionIndex !== -1) {
                state.activeActions.splice(actionIndex, 1);
            }
        },
        // Active Executions
        addActiveExecution(state, newActiveExecution) {
            // Check if the execution exists already
            const activeExecution = state.activeExecutions.find(execution => {
                return execution.id === newActiveExecution.id;
            });
            if (activeExecution !== undefined) {
                // Exists already so no need to add it again
                if (activeExecution.workflowName === undefined) {
                    activeExecution.workflowName = newActiveExecution.workflowName;
                }
                return;
            }
            state.activeExecutions.unshift(newActiveExecution);
        },
        finishActiveExecution(state, finishedActiveExecution) {
            // Find the execution to set to finished
            const activeExecution = state.activeExecutions.find(execution => {
                return execution.id === finishedActiveExecution.executionId;
            });
            if (activeExecution === undefined) {
                // The execution could not be found
                return;
            }
            if (finishedActiveExecution.executionId !== undefined) {
                vue_1.default.set(activeExecution, 'id', finishedActiveExecution.executionId);
            }
            vue_1.default.set(activeExecution, 'finished', finishedActiveExecution.data.finished);
            vue_1.default.set(activeExecution, 'stoppedAt', finishedActiveExecution.data.stoppedAt);
        },
        setActiveExecutions(state, newActiveExecutions) {
            vue_1.default.set(state, 'activeExecutions', newActiveExecutions);
        },
        // Active Workflows
        setActiveWorkflows(state, newActiveWorkflows) {
            state.activeWorkflows = newActiveWorkflows;
        },
        setWorkflowActive(state, workflowId) {
            state.stateIsDirty = false;
            const index = state.activeWorkflows.indexOf(workflowId);
            if (index === -1) {
                state.activeWorkflows.push(workflowId);
            }
        },
        setWorkflowInactive(state, workflowId) {
            const index = state.activeWorkflows.indexOf(workflowId);
            if (index !== -1) {
                state.activeWorkflows.splice(index, 1);
            }
        },
        // Set state condition dirty or not
        // ** Dirty: if current workflow state has been synchronized with database AKA has it been saved
        setStateDirty(state, dirty) {
            state.stateIsDirty = dirty;
        },
        // Selected Nodes
        addSelectedNode(state, node) {
            state.selectedNodes.push(node);
        },
        removeNodeFromSelection(state, node) {
            let index;
            for (index in state.selectedNodes) {
                if (state.selectedNodes[index].name === node.name) {
                    state.selectedNodes.splice(parseInt(index, 10), 1);
                    break;
                }
            }
        },
        resetSelectedNodes(state) {
            vue_1.default.set(state, 'selectedNodes', []);
        },
        // Active
        setActive(state, newActive) {
            state.workflow.active = newActive;
        },
        // Connections
        addConnection(state, data) {
            if (data.connection.length !== 2) {
                // All connections need two entries
                // TODO: Check if there is an error or whatever that is supposed to be returned
                return;
            }
            if (data.setStateDirty === true) {
                state.stateIsDirty = true;
            }
            const sourceData = data.connection[0];
            const destinationData = data.connection[1];
            // Check if source node and type exist already and if not add them
            if (!state.workflow.connections.hasOwnProperty(sourceData.node)) {
                vue_1.default.set(state.workflow.connections, sourceData.node, {});
            }
            if (!state.workflow.connections[sourceData.node].hasOwnProperty(sourceData.type)) {
                vue_1.default.set(state.workflow.connections[sourceData.node], sourceData.type, []);
            }
            if (state.workflow.connections[sourceData.node][sourceData.type].length < (sourceData.index + 1)) {
                for (let i = state.workflow.connections[sourceData.node][sourceData.type].length; i <= sourceData.index; i++) {
                    state.workflow.connections[sourceData.node][sourceData.type].push([]);
                }
            }
            // Check if the same connection exists already
            const checkProperties = ['index', 'node', 'type'];
            let propertyName;
            let connectionExists = false;
            connectionLoop: for (const existingConnection of state.workflow.connections[sourceData.node][sourceData.type][sourceData.index]) {
                for (propertyName of checkProperties) {
                    if (existingConnection[propertyName] !== destinationData[propertyName]) { // tslint:disable-line:no-any
                        continue connectionLoop;
                    }
                }
                connectionExists = true;
                break;
            }
            // Add the new connection if it does not exist already
            if (connectionExists === false) {
                state.workflow.connections[sourceData.node][sourceData.type][sourceData.index].push(destinationData);
            }
        },
        removeConnection(state, data) {
            const sourceData = data.connection[0];
            const destinationData = data.connection[1];
            if (!state.workflow.connections.hasOwnProperty(sourceData.node)) {
                return;
            }
            if (!state.workflow.connections[sourceData.node].hasOwnProperty(sourceData.type)) {
                return;
            }
            if (state.workflow.connections[sourceData.node][sourceData.type].length < (sourceData.index + 1)) {
                return;
            }
            state.stateIsDirty = true;
            const connections = state.workflow.connections[sourceData.node][sourceData.type][sourceData.index];
            for (const index in connections) {
                if (connections[index].node === destinationData.node && connections[index].type === destinationData.type && connections[index].index === destinationData.index) {
                    // Found the connection to remove
                    connections.splice(parseInt(index, 10), 1);
                }
            }
        },
        removeAllConnections(state, data) {
            if (data && data.setStateDirty === true) {
                state.stateIsDirty = true;
            }
            state.workflow.connections = {};
        },
        removeAllNodeConnection(state, node) {
            state.stateIsDirty = true;
            // Remove all source connections
            if (state.workflow.connections.hasOwnProperty(node.name)) {
                delete state.workflow.connections[node.name];
            }
            // Remove all destination connections
            const indexesToRemove = [];
            let sourceNode, type, sourceIndex, connectionIndex, connectionData;
            for (sourceNode of Object.keys(state.workflow.connections)) {
                for (type of Object.keys(state.workflow.connections[sourceNode])) {
                    for (sourceIndex of Object.keys(state.workflow.connections[sourceNode][type])) {
                        indexesToRemove.length = 0;
                        for (connectionIndex of Object.keys(state.workflow.connections[sourceNode][type][parseInt(sourceIndex, 10)])) {
                            connectionData = state.workflow.connections[sourceNode][type][parseInt(sourceIndex, 10)][parseInt(connectionIndex, 10)];
                            if (connectionData.node === node.name) {
                                indexesToRemove.push(connectionIndex);
                            }
                        }
                        indexesToRemove.forEach((index) => {
                            state.workflow.connections[sourceNode][type][parseInt(sourceIndex, 10)].splice(parseInt(index, 10), 1);
                        });
                    }
                }
            }
        },
        renameNodeSelectedAndExecution(state, nameData) {
            state.stateIsDirty = true;
            // If node has any WorkflowResultData rename also that one that the data
            // does still get displayed also after node got renamed
            if (state.workflowExecutionData !== null && state.workflowExecutionData.data.resultData.runData.hasOwnProperty(nameData.old)) {
                state.workflowExecutionData.data.resultData.runData[nameData.new] = state.workflowExecutionData.data.resultData.runData[nameData.old];
                delete state.workflowExecutionData.data.resultData.runData[nameData.old];
            }
            // In case the renamed node was last selected set it also there with the new name
            if (state.lastSelectedNode === nameData.old) {
                state.lastSelectedNode = nameData.new;
            }
            vue_1.default.set(state.nodeMetadata, nameData.new, state.nodeMetadata[nameData.old]);
            vue_1.default.delete(state.nodeMetadata, nameData.old);
        },
        resetAllNodesIssues(state) {
            state.workflow.nodes.forEach((node) => {
                node.issues = undefined;
            });
            return true;
        },
        setNodeIssue(state, nodeIssueData) {
            const node = state.workflow.nodes.find(node => {
                return node.name === nodeIssueData.node;
            });
            if (!node) {
                return false;
            }
            if (nodeIssueData.value === null) {
                // Remove the value if one exists
                if (node.issues === undefined || node.issues[nodeIssueData.type] === undefined) {
                    // No values for type exist so nothing has to get removed
                    return true;
                }
                // @ts-ignore
                vue_1.default.delete(node.issues, nodeIssueData.type);
            }
            else {
                if (node.issues === undefined) {
                    vue_1.default.set(node, 'issues', {});
                }
                // Set/Overwrite the value
                vue_1.default.set(node.issues, nodeIssueData.type, nodeIssueData.value);
            }
            return true;
        },
        // Id
        setWorkflowId(state, id) {
            state.workflow.id = id;
        },
        // Name
        setWorkflowName(state, data) {
            if (data.setStateDirty === true) {
                state.stateIsDirty = true;
            }
            state.workflow.name = data.newName;
        },
        // replace invalid credentials in workflow
        replaceInvalidWorkflowCredentials(state, { credentials, invalid, type }) {
            state.workflow.nodes.forEach((node) => {
                if (!node.credentials || !node.credentials[type]) {
                    return;
                }
                const nodeCredentials = node.credentials[type];
                if (typeof nodeCredentials === 'string' && nodeCredentials === invalid.name) {
                    node.credentials[type] = credentials;
                    return;
                }
                if (nodeCredentials.id === null) {
                    if (nodeCredentials.name === invalid.name) {
                        node.credentials[type] = credentials;
                    }
                    return;
                }
                if (nodeCredentials.id === invalid.id) {
                    node.credentials[type] = credentials;
                }
            });
        },
        // Nodes
        addNode(state, nodeData) {
            if (!nodeData.hasOwnProperty('name')) {
                // All nodes have to have a name
                // TODO: Check if there is an error or whatever that is supposed to be returned
                return;
            }
            state.workflow.nodes.push(nodeData);
        },
        removeNode(state, node) {
            vue_1.default.delete(state.nodeMetadata, node.name);
            for (let i = 0; i < state.workflow.nodes.length; i++) {
                if (state.workflow.nodes[i].name === node.name) {
                    state.workflow.nodes.splice(i, 1);
                    state.stateIsDirty = true;
                    return;
                }
            }
        },
        removeAllNodes(state, data) {
            if (data.setStateDirty === true) {
                state.stateIsDirty = true;
            }
            state.workflow.nodes.splice(0, state.workflow.nodes.length);
            state.nodeMetadata = {};
        },
        updateNodeProperties(state, updateInformation) {
            // Find the node that should be updated
            const node = state.workflow.nodes.find(node => {
                return node.name === updateInformation.name;
            });
            if (node) {
                for (const key of Object.keys(updateInformation.properties)) {
                    state.stateIsDirty = true;
                    vue_1.default.set(node, key, updateInformation.properties[key]);
                }
            }
        },
        setNodeValue(state, updateInformation) {
            // Find the node that should be updated
            const node = state.workflow.nodes.find(node => {
                return node.name === updateInformation.name;
            });
            if (node === undefined || node === null) {
                throw new Error(`Node with the name "${updateInformation.name}" could not be found to set parameter.`);
            }
            state.stateIsDirty = true;
            vue_1.default.set(node, updateInformation.key, updateInformation.value);
        },
        setNodeParameters(state, updateInformation) {
            // Find the node that should be updated
            const node = state.workflow.nodes.find(node => {
                return node.name === updateInformation.name;
            });
            if (node === undefined || node === null) {
                throw new Error(`Node with the name "${updateInformation.name}" could not be found to set parameter.`);
            }
            state.stateIsDirty = true;
            vue_1.default.set(node, 'parameters', updateInformation.value);
            if (!state.nodeMetadata[node.name]) {
                vue_1.default.set(state.nodeMetadata, node.name, {});
            }
            vue_1.default.set(state.nodeMetadata[node.name], 'parametersLastUpdatedAt', Date.now());
        },
        // Node-Index
        addToNodeIndex(state, nodeName) {
            state.nodeIndex.push(nodeName);
        },
        setNodeIndex(state, newData) {
            state.nodeIndex[newData.index] = newData.name;
        },
        resetNodeIndex(state) {
            vue_1.default.set(state, 'nodeIndex', []);
        },
        // Node-View
        setNodeViewMoveInProgress(state, value) {
            state.nodeViewMoveInProgress = value;
        },
        setNodeViewOffsetPosition(state, data) {
            state.nodeViewOffsetPosition = data.newOffset;
        },
        // Node-Types
        setNodeTypes(state, nodeTypes) {
            vue_1.default.set(state, 'nodeTypes', nodeTypes);
        },
        // Active Execution
        setExecutingNode(state, executingNode) {
            state.executingNode = executingNode;
        },
        setExecutionWaitingForWebhook(state, newWaiting) {
            state.executionWaitingForWebhook = newWaiting;
        },
        setActiveExecutionId(state, executionId) {
            state.executionId = executionId;
        },
        // Push Connection
        setPushConnectionActive(state, newActive) {
            state.pushConnectionActive = newActive;
        },
        // Webhooks
        setUrlBaseWebhook(state, urlBaseWebhook) {
            vue_1.default.set(state, 'urlBaseWebhook', urlBaseWebhook);
        },
        setEndpointWebhook(state, endpointWebhook) {
            vue_1.default.set(state, 'endpointWebhook', endpointWebhook);
        },
        setEndpointWebhookTest(state, endpointWebhookTest) {
            vue_1.default.set(state, 'endpointWebhookTest', endpointWebhookTest);
        },
        setSaveDataErrorExecution(state, newValue) {
            vue_1.default.set(state, 'saveDataErrorExecution', newValue);
        },
        setSaveDataSuccessExecution(state, newValue) {
            vue_1.default.set(state, 'saveDataSuccessExecution', newValue);
        },
        setSaveManualExecutions(state, saveManualExecutions) {
            vue_1.default.set(state, 'saveManualExecutions', saveManualExecutions);
        },
        setTimezone(state, timezone) {
            vue_1.default.set(state, 'timezone', timezone);
        },
        setExecutionTimeout(state, executionTimeout) {
            vue_1.default.set(state, 'executionTimeout', executionTimeout);
        },
        setMaxExecutionTimeout(state, maxExecutionTimeout) {
            vue_1.default.set(state, 'maxExecutionTimeout', maxExecutionTimeout);
        },
        setVersionCli(state, version) {
            vue_1.default.set(state, 'versionCli', version);
        },
        setInstanceId(state, instanceId) {
            vue_1.default.set(state, 'instanceId', instanceId);
        },
        setOauthCallbackUrls(state, urls) {
            vue_1.default.set(state, 'oauthCallbackUrls', urls);
        },
        setN8nMetadata(state, metadata) {
            vue_1.default.set(state, 'n8nMetadata', metadata);
        },
        setDefaultLocale(state, locale) {
            vue_1.default.set(state, 'defaultLocale', locale);
        },
        setActiveNode(state, nodeName) {
            state.activeNode = nodeName;
        },
        setActiveCredentialType(state, activeCredentialType) {
            state.activeCredentialType = activeCredentialType;
        },
        setLastSelectedNode(state, nodeName) {
            state.lastSelectedNode = nodeName;
        },
        setLastSelectedNodeOutputIndex(state, outputIndex) {
            state.lastSelectedNodeOutputIndex = outputIndex;
        },
        setWorkflowExecutionData(state, workflowResultData) {
            state.workflowExecutionData = workflowResultData;
        },
        addNodeExecutionData(state, pushData) {
            if (state.workflowExecutionData === null) {
                throw new Error('The "workflowExecutionData" is not initialized!');
            }
            if (state.workflowExecutionData.data.resultData.runData[pushData.nodeName] === undefined) {
                vue_1.default.set(state.workflowExecutionData.data.resultData.runData, pushData.nodeName, []);
            }
            state.workflowExecutionData.data.resultData.runData[pushData.nodeName].push(pushData.data);
        },
        clearNodeExecutionData(state, nodeName) {
            if (state.workflowExecutionData === null) {
                return;
            }
            vue_1.default.delete(state.workflowExecutionData.data.resultData.runData, nodeName);
        },
        setWorkflowSettings(state, workflowSettings) {
            vue_1.default.set(state.workflow, 'settings', workflowSettings);
        },
        setWorkflowTagIds(state, tags) {
            vue_1.default.set(state.workflow, 'tags', tags);
        },
        addWorkflowTagIds(state, tags) {
            vue_1.default.set(state.workflow, 'tags', [...new Set([...(state.workflow.tags || []), ...tags])]);
        },
        removeWorkflowTagId(state, tagId) {
            const tags = state.workflow.tags;
            const updated = tags.filter((id) => id !== tagId);
            vue_1.default.set(state.workflow, 'tags', updated);
        },
        // Workflow
        setWorkflow(state, workflow) {
            vue_1.default.set(state, 'workflow', workflow);
            if (!state.workflow.hasOwnProperty('active')) {
                vue_1.default.set(state.workflow, 'active', false);
            }
            if (!state.workflow.hasOwnProperty('connections')) {
                vue_1.default.set(state.workflow, 'connections', {});
            }
            if (!state.workflow.hasOwnProperty('createdAt')) {
                vue_1.default.set(state.workflow, 'createdAt', -1);
            }
            if (!state.workflow.hasOwnProperty('updatedAt')) {
                vue_1.default.set(state.workflow, 'updatedAt', -1);
            }
            if (!state.workflow.hasOwnProperty('id')) {
                vue_1.default.set(state.workflow, 'id', constants_1.PLACEHOLDER_EMPTY_WORKFLOW_ID);
            }
            if (!state.workflow.hasOwnProperty('nodes')) {
                vue_1.default.set(state.workflow, 'nodes', []);
            }
            if (!state.workflow.hasOwnProperty('settings')) {
                vue_1.default.set(state.workflow, 'settings', {});
            }
        },
        updateNodeTypes(state, nodeTypes) {
            const oldNodesToKeep = state.nodeTypes.filter(node => !nodeTypes.find(n => n.name === node.name && n.version.toString() === node.version.toString()));
            const newNodesState = [...oldNodesToKeep, ...nodeTypes];
            vue_1.default.set(state, 'nodeTypes', newNodesState);
            state.nodeTypes = newNodesState;
        },
        addSidebarMenuItems(state, menuItems) {
            const updated = state.sidebarMenuItems.concat(menuItems);
            vue_1.default.set(state, 'sidebarMenuItems', updated);
        },
    },
    getters: {
        executedNode: (state) => {
            return state.workflowExecutionData ? state.workflowExecutionData.executedNode : undefined;
        },
        activeCredentialType: (state) => {
            return state.activeCredentialType;
        },
        isActionActive: (state) => (action) => {
            return state.activeActions.includes(action);
        },
        isNewWorkflow: (state) => {
            return state.workflow.id === constants_1.PLACEHOLDER_EMPTY_WORKFLOW_ID;
        },
        currentWorkflowHasWebhookNode: (state) => {
            return !!state.workflow.nodes.find((node) => !!node.webhookId);
        },
        getActiveExecutions: (state) => {
            return state.activeExecutions;
        },
        getParametersLastUpdated: (state) => {
            return (nodeName) => state.nodeMetadata[nodeName] && state.nodeMetadata[nodeName].parametersLastUpdatedAt;
        },
        getBaseUrl: (state) => {
            return state.baseUrl;
        },
        getRestUrl: (state) => {
            let endpoint = 'rest';
            if (process.env.VUE_APP_ENDPOINT_REST) {
                endpoint = process.env.VUE_APP_ENDPOINT_REST;
            }
            return `${state.baseUrl}${endpoint}`;
        },
        getRestApiContext(state) {
            let endpoint = 'rest';
            if (process.env.VUE_APP_ENDPOINT_REST) {
                endpoint = process.env.VUE_APP_ENDPOINT_REST;
            }
            return {
                baseUrl: `${state.baseUrl}${endpoint}`,
                sessionId: state.sessionId,
            };
        },
        getWebhookBaseUrl: (state) => {
            return state.urlBaseWebhook;
        },
        getWebhookUrl: (state) => {
            return `${state.urlBaseWebhook}${state.endpointWebhook}`;
        },
        getWebhookTestUrl: (state) => {
            return `${state.urlBaseWebhook}${state.endpointWebhookTest}`;
        },
        getStateIsDirty: (state) => {
            return state.stateIsDirty;
        },
        instanceId: (state) => {
            return state.instanceId;
        },
        saveDataErrorExecution: (state) => {
            return state.saveDataErrorExecution;
        },
        saveDataSuccessExecution: (state) => {
            return state.saveDataSuccessExecution;
        },
        saveManualExecutions: (state) => {
            return state.saveManualExecutions;
        },
        timezone: (state) => {
            return state.timezone;
        },
        executionTimeout: (state) => {
            return state.executionTimeout;
        },
        maxExecutionTimeout: (state) => {
            return state.maxExecutionTimeout;
        },
        versionCli: (state) => {
            return state.versionCli;
        },
        oauthCallbackUrls: (state) => {
            return state.oauthCallbackUrls;
        },
        n8nMetadata: (state) => {
            return state.n8nMetadata;
        },
        defaultLocale: (state) => {
            return state.defaultLocale;
        },
        // Push Connection
        pushConnectionActive: (state) => {
            return state.pushConnectionActive;
        },
        sessionId: (state) => {
            return state.sessionId;
        },
        // Active Workflows
        getActiveWorkflows: (state) => {
            return state.activeWorkflows;
        },
        workflowTriggerNodes: (state, getters) => {
            return state.workflow.nodes.filter(node => {
                const nodeType = getters.nodeType(node.type, node.typeVersion);
                return nodeType && nodeType.group.includes('trigger');
            });
        },
        // Node-Index
        getNodeIndex: (state) => (nodeName) => {
            return state.nodeIndex.indexOf(nodeName);
        },
        getNodeNameByIndex: (state) => (index) => {
            return state.nodeIndex[index];
        },
        getNodeViewOffsetPosition: (state) => {
            return state.nodeViewOffsetPosition;
        },
        isNodeViewMoveInProgress: (state) => {
            return state.nodeViewMoveInProgress;
        },
        // Selected Nodes
        getSelectedNodes: (state) => {
            return state.selectedNodes;
        },
        isNodeSelected: (state) => (nodeName) => {
            let index;
            for (index in state.selectedNodes) {
                if (state.selectedNodes[index].name === nodeName) {
                    return true;
                }
            }
            return false;
        },
        isActive: (state) => {
            return state.workflow.active;
        },
        allConnections: (state) => {
            return state.workflow.connections;
        },
        outgoingConnectionsByNodeName: (state) => (nodeName) => {
            if (state.workflow.connections.hasOwnProperty(nodeName)) {
                return state.workflow.connections[nodeName];
            }
            return {};
        },
        allNodes: (state) => {
            return state.workflow.nodes;
        },
        nodesByName: (state) => {
            return state.workflow.nodes.reduce((accu, node) => {
                accu[node.name] = node;
                return accu;
            }, {});
        },
        getNodeByName: (state, getters) => (nodeName) => {
            return getters.nodesByName[nodeName] || null;
        },
        nodesIssuesExist: (state) => {
            for (const node of state.workflow.nodes) {
                if (node.issues === undefined || Object.keys(node.issues).length === 0) {
                    continue;
                }
                return true;
            }
            return false;
        },
        allNodeTypes: (state) => {
            return state.nodeTypes;
        },
        /**
         * Getter for node default names ending with a number: `'S3'`, `'Magento 2'`, etc.
         */
        nativelyNumberSuffixedDefaults: (_, getters) => {
            const { allNodeTypes } = getters;
            return allNodeTypes.reduce((acc, cur) => {
                if (/\d$/.test(cur.defaults.name))
                    acc.push(cur.defaults.name);
                return acc;
            }, []);
        },
        nodeType: (state, getters) => (nodeType, version) => {
            const foundType = state.nodeTypes.find(typeData => {
                const typeVersion = Array.isArray(typeData.version)
                    ? typeData.version
                    : [typeData.version];
                return typeData.name === nodeType && typeVersion.includes(version || typeData.defaultVersion || constants_1.DEFAULT_NODETYPE_VERSION);
            });
            if (foundType === undefined) {
                return null;
            }
            return foundType;
        },
        activeNode: (state, getters) => {
            return getters.getNodeByName(state.activeNode);
        },
        lastSelectedNode: (state, getters) => {
            return getters.getNodeByName(state.lastSelectedNode);
        },
        lastSelectedNodeOutputIndex: (state, getters) => {
            return state.lastSelectedNodeOutputIndex;
        },
        // Active Execution
        executingNode: (state) => {
            return state.executingNode;
        },
        activeExecutionId: (state) => {
            return state.executionId;
        },
        executionWaitingForWebhook: (state) => {
            return state.executionWaitingForWebhook;
        },
        workflowName: (state) => {
            return state.workflow.name;
        },
        workflowId: (state) => {
            return state.workflow.id;
        },
        workflowSettings: (state) => {
            if (state.workflow.settings === undefined) {
                return {};
            }
            return state.workflow.settings;
        },
        workflowTags: (state) => {
            return state.workflow.tags;
        },
        // Workflow Result Data
        getWorkflowExecution: (state) => {
            return state.workflowExecutionData;
        },
        getWorkflowRunData: (state) => {
            if (!state.workflowExecutionData || !state.workflowExecutionData.data || !state.workflowExecutionData.data.resultData) {
                return null;
            }
            return state.workflowExecutionData.data.resultData.runData;
        },
        getWorkflowResultDataByNodeName: (state, getters) => (nodeName) => {
            const workflowRunData = getters.getWorkflowRunData;
            if (workflowRunData === null) {
                return null;
            }
            if (!workflowRunData.hasOwnProperty(nodeName)) {
                return null;
            }
            return workflowRunData[nodeName];
        },
        sidebarMenuItems: (state) => {
            return state.sidebarMenuItems;
        },
    },
});
