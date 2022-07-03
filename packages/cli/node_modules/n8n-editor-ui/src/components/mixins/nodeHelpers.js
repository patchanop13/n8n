"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeHelpers = void 0;
const constants_1 = require("@/constants");
const n8n_workflow_1 = require("n8n-workflow");
const restApi_1 = require("@/components/mixins/restApi");
const lodash_1 = require("lodash");
const vue_typed_mixins_1 = __importDefault(require("vue-typed-mixins"));
const vuex_1 = require("vuex");
exports.nodeHelpers = (0, vue_typed_mixins_1.default)(restApi_1.restApi)
    .extend({
    computed: Object.assign({}, (0, vuex_1.mapGetters)('credentials', ['getCredentialTypeByName', 'getCredentialsByType'])),
    methods: {
        hasProxyAuth(node) {
            return Object.keys(node.parameters).includes('nodeCredentialType');
        },
        isCustomApiCallSelected(nodeValues) {
            const { parameters } = nodeValues;
            if (!isObjectLiteral(parameters))
                return false;
            return (parameters.resource !== undefined && parameters.resource.includes(constants_1.CUSTOM_API_CALL_KEY) ||
                parameters.operation !== undefined && parameters.operation.includes(constants_1.CUSTOM_API_CALL_KEY));
        },
        // Returns the parameter value
        getParameterValue(nodeValues, parameterName, path) {
            return (0, lodash_1.get)(nodeValues, path ? path + '.' + parameterName : parameterName);
        },
        // Returns if the given parameter should be displayed or not
        displayParameter(nodeValues, parameter, path, node) {
            return n8n_workflow_1.NodeHelpers.displayParameterPath(nodeValues, parameter, path, node);
        },
        // Returns all the issues of the node
        getNodeIssues(nodeType, node, ignoreIssues) {
            let nodeIssues = null;
            ignoreIssues = ignoreIssues || [];
            if (node.disabled === true) {
                // Ignore issues on disabled nodes
                return null;
            }
            if (nodeType === null) {
                // Node type is not known
                if (!ignoreIssues.includes('typeUnknown')) {
                    nodeIssues = {
                        typeUnknown: true,
                    };
                }
            }
            else {
                // Node type is known
                // Add potential parameter issues
                if (!ignoreIssues.includes('parameters')) {
                    nodeIssues = n8n_workflow_1.NodeHelpers.getNodeParametersIssues(nodeType.properties, node);
                }
                if (!ignoreIssues.includes('credentials')) {
                    // Add potential credential issues
                    const nodeCredentialIssues = this.getNodeCredentialIssues(node, nodeType);
                    if (nodeIssues === null) {
                        nodeIssues = nodeCredentialIssues;
                    }
                    else {
                        n8n_workflow_1.NodeHelpers.mergeIssues(nodeIssues, nodeCredentialIssues);
                    }
                }
            }
            if (this.hasNodeExecutionIssues(node) === true && !ignoreIssues.includes('execution')) {
                if (nodeIssues === null) {
                    nodeIssues = {};
                }
                nodeIssues.execution = true;
            }
            return nodeIssues;
        },
        // Set the status on all the nodes which produced an error so that it can be
        // displayed in the node-view
        hasNodeExecutionIssues(node) {
            const workflowResultData = this.$store.getters.getWorkflowRunData;
            if (workflowResultData === null || !workflowResultData.hasOwnProperty(node.name)) {
                return false;
            }
            for (const taskData of workflowResultData[node.name]) {
                if (taskData.error !== undefined) {
                    return true;
                }
            }
            return false;
        },
        reportUnsetCredential(credentialType) {
            return {
                credentials: {
                    [credentialType.name]: [
                        this.$locale.baseText('nodeHelpers.credentialsUnset', {
                            interpolate: {
                                credentialType: credentialType.displayName,
                            },
                        }),
                    ],
                },
            };
        },
        // Updates the execution issues.
        updateNodesExecutionIssues() {
            const nodes = this.$store.getters.allNodes;
            for (const node of nodes) {
                this.$store.commit('setNodeIssue', {
                    node: node.name,
                    type: 'execution',
                    value: this.hasNodeExecutionIssues(node) ? true : null,
                });
            }
        },
        // Updates the credential-issues of the node
        updateNodeCredentialIssues(node) {
            const fullNodeIssues = this.getNodeCredentialIssues(node);
            let newIssues = null;
            if (fullNodeIssues !== null) {
                newIssues = fullNodeIssues.credentials;
            }
            this.$store.commit('setNodeIssue', {
                node: node.name,
                type: 'credentials',
                value: newIssues,
            });
        },
        // Updates the parameter-issues of the node
        updateNodeParameterIssues(node, nodeType) {
            if (nodeType === undefined) {
                nodeType = this.$store.getters.nodeType(node.type, node.typeVersion);
            }
            if (nodeType === null) {
                // Could not find nodeType so can not update issues
                return;
            }
            // All data got updated everywhere so update now the issues
            const fullNodeIssues = n8n_workflow_1.NodeHelpers.getNodeParametersIssues(nodeType.properties, node);
            let newIssues = null;
            if (fullNodeIssues !== null) {
                newIssues = fullNodeIssues.parameters;
            }
            this.$store.commit('setNodeIssue', {
                node: node.name,
                type: 'parameters',
                value: newIssues,
            });
        },
        // Returns all the credential-issues of the node
        getNodeCredentialIssues(node, nodeType) {
            if (node.disabled === true) {
                // Node is disabled
                return null;
            }
            if (nodeType === undefined) {
                nodeType = this.$store.getters.nodeType(node.type, node.typeVersion);
            }
            if (nodeType === null || nodeType.credentials === undefined) {
                // Node does not need any credentials or nodeType could not be found
                return null;
            }
            if (nodeType.credentials === undefined) {
                // No credentials defined for node type
                return null;
            }
            const foundIssues = {};
            let userCredentials;
            let credentialType;
            let credentialDisplayName;
            let selectedCredentials;
            const { authentication, genericAuthType, nodeCredentialType, } = node.parameters;
            if (authentication === 'genericCredentialType' &&
                genericAuthType !== '' &&
                selectedCredsAreUnusable(node, genericAuthType)) {
                const credential = this.getCredentialTypeByName(genericAuthType);
                return this.reportUnsetCredential(credential);
            }
            if (this.hasProxyAuth(node) &&
                authentication === 'predefinedCredentialType' &&
                nodeCredentialType !== '' &&
                node.credentials !== undefined) {
                const stored = this.getCredentialsByType(nodeCredentialType);
                if (selectedCredsDoNotExist(node, nodeCredentialType, stored)) {
                    const credential = this.getCredentialTypeByName(nodeCredentialType);
                    return this.reportUnsetCredential(credential);
                }
            }
            if (this.hasProxyAuth(node) &&
                authentication === 'predefinedCredentialType' &&
                nodeCredentialType !== '' &&
                selectedCredsAreUnusable(node, nodeCredentialType)) {
                const credential = this.getCredentialTypeByName(nodeCredentialType);
                return this.reportUnsetCredential(credential);
            }
            for (const credentialTypeDescription of nodeType.credentials) {
                // Check if credentials should be displayed else ignore
                if (this.displayParameter(node.parameters, credentialTypeDescription, '', node) !== true) {
                    continue;
                }
                // Get the display name of the credential type
                credentialType = this.$store.getters['credentials/getCredentialTypeByName'](credentialTypeDescription.name);
                if (credentialType === null) {
                    credentialDisplayName = credentialTypeDescription.name;
                }
                else {
                    credentialDisplayName = credentialType.displayName;
                }
                if (node.credentials === undefined || node.credentials[credentialTypeDescription.name] === undefined) {
                    // Credentials are not set
                    if (credentialTypeDescription.required === true) {
                        foundIssues[credentialTypeDescription.name] = [`Credentials for "${credentialDisplayName}" are not set.`];
                    }
                }
                else {
                    // If they are set check if the value is valid
                    selectedCredentials = node.credentials[credentialTypeDescription.name];
                    if (typeof selectedCredentials === 'string') {
                        selectedCredentials = {
                            id: null,
                            name: selectedCredentials,
                        };
                    }
                    userCredentials = this.$store.getters['credentials/getCredentialsByType'](credentialTypeDescription.name);
                    if (userCredentials === null) {
                        userCredentials = [];
                    }
                    if (selectedCredentials.id) {
                        const idMatch = userCredentials.find((credentialData) => credentialData.id === selectedCredentials.id);
                        if (idMatch) {
                            continue;
                        }
                    }
                    const nameMatches = userCredentials.filter((credentialData) => credentialData.name === selectedCredentials.name);
                    if (nameMatches.length > 1) {
                        foundIssues[credentialTypeDescription.name] = [`Credentials with name "${selectedCredentials.name}" exist for "${credentialDisplayName}"`, "Credentials are not clearly identified. Please select the correct credentials."];
                        continue;
                    }
                    if (nameMatches.length === 0) {
                        foundIssues[credentialTypeDescription.name] = [`Credentials with name "${selectedCredentials.name}" do not exist for "${credentialDisplayName}".`, "You can create credentials with the exact name and then they get auto-selected on refresh."];
                    }
                }
            }
            // TODO: Could later check also if the node has access to the credentials
            if (Object.keys(foundIssues).length === 0) {
                return null;
            }
            return {
                credentials: foundIssues,
            };
        },
        // Updates the node credential issues
        updateNodesCredentialsIssues() {
            const nodes = this.$store.getters.allNodes;
            let issues;
            for (const node of nodes) {
                issues = this.getNodeCredentialIssues(node);
                this.$store.commit('setNodeIssue', {
                    node: node.name,
                    type: 'credentials',
                    value: issues === null ? null : issues.credentials,
                });
            }
        },
        getNodeInputData(node, runIndex = 0, outputIndex = 0) {
            if (node === null) {
                return [];
            }
            if (this.$store.getters.getWorkflowExecution === null) {
                return [];
            }
            const executionData = this.$store.getters.getWorkflowExecution.data;
            if (!executionData || !executionData.resultData) { // unknown status
                return [];
            }
            const runData = executionData.resultData.runData;
            if (runData === null || runData[node.name] === undefined ||
                !runData[node.name][runIndex].data ||
                runData[node.name][runIndex].data === undefined) {
                return [];
            }
            return this.getMainInputData(runData[node.name][runIndex].data, outputIndex);
        },
        // Returns the data of the main input
        getMainInputData(connectionsData, outputIndex) {
            if (!connectionsData || !connectionsData.hasOwnProperty('main') || connectionsData.main === undefined || connectionsData.main.length < outputIndex || connectionsData.main[outputIndex] === null) {
                return [];
            }
            return connectionsData.main[outputIndex];
        },
        // Returns all the binary data of all the entries
        getBinaryData(workflowRunData, node, runIndex, outputIndex) {
            if (node === null) {
                return [];
            }
            const runData = workflowRunData;
            if (runData === null || !runData[node] || !runData[node][runIndex] ||
                !runData[node][runIndex].data) {
                return [];
            }
            const inputData = this.getMainInputData(runData[node][runIndex].data, outputIndex);
            const returnData = [];
            for (let i = 0; i < inputData.length; i++) {
                if (inputData[i].hasOwnProperty('binary') && inputData[i].binary !== undefined) {
                    returnData.push(inputData[i].binary);
                }
            }
            return returnData;
        },
        disableNodes(nodes) {
            for (const node of nodes) {
                // Toggle disabled flag
                const updateInformation = {
                    name: node.name,
                    properties: {
                        disabled: !node.disabled,
                    },
                };
                this.$telemetry.track('User set node enabled status', { node_type: node.type, is_enabled: node.disabled, workflow_id: this.$store.getters.workflowId });
                this.$store.commit('updateNodeProperties', updateInformation);
                this.$store.commit('clearNodeExecutionData', node.name);
                this.updateNodeParameterIssues(node);
                this.updateNodeCredentialIssues(node);
            }
        },
        // @ts-ignore
        getNodeSubtitle(data, nodeType, workflow) {
            if (!data) {
                return undefined;
            }
            if (data.notesInFlow) {
                return data.notes;
            }
            if (nodeType !== null && nodeType.subtitle !== undefined) {
                return workflow.expression.getSimpleParameterValue(data, nodeType.subtitle, 'internal', constants_1.PLACEHOLDER_FILLED_AT_EXECUTION_TIME);
            }
            if (data.parameters.operation !== undefined) {
                const operation = data.parameters.operation;
                if (nodeType === null) {
                    return operation;
                }
                const operationData = nodeType.properties.find((property) => {
                    return property.name === 'operation';
                });
                if (operationData === undefined) {
                    return operation;
                }
                if (operationData.options === undefined) {
                    return operation;
                }
                const optionData = operationData.options.find((option) => {
                    return option.value === data.parameters.operation;
                });
                if (optionData === undefined) {
                    return operation;
                }
                return optionData.name;
            }
            return undefined;
        },
    },
});
/**
 * Whether the node has no selected credentials, or none of the node's
 * selected credentials are of the specified type.
 */
function selectedCredsAreUnusable(node, credentialType) {
    return node.credentials === undefined || Object.keys(node.credentials).includes(credentialType) === false;
}
/**
 * Whether the node's selected credentials of the specified type
 * can no longer be found in the database.
 */
function selectedCredsDoNotExist(node, nodeCredentialType, storedCredsByType) {
    if (!node.credentials || !storedCredsByType)
        return false;
    const selectedCredsByType = node.credentials[nodeCredentialType];
    if (!selectedCredsByType)
        return false;
    return !storedCredsByType.find((c) => c.id === selectedCredsByType.id);
}
function isObjectLiteral(maybeObject) {
    return typeof maybeObject === 'object' && maybeObject !== null && !Array.isArray(maybeObject);
}
