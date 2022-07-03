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
exports.isBelowOnboardingThreshold = exports.getSharedWorkflowIds = exports.whereClause = exports.replaceInvalidCredentials = exports.getStaticDataById = exports.saveStaticDataById = exports.saveStaticData = exports.getNeededNodeTypes = exports.getCredentialsDataByNodes = exports.getCredentialsDataWithParents = exports.getNodeTypeData = exports.getAllCredentalsTypeData = exports.getAllNodeTypeData = exports.executeErrorWorkflow = exports.isWorkflowIdValid = exports.getDataLastExecutedNodeData = void 0;
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
const typeorm_1 = require("typeorm");
const n8n_workflow_1 = require("n8n-workflow");
// eslint-disable-next-line import/no-cycle
const _1 = require(".");
const config_1 = __importDefault(require("../config"));
const UserManagementHelper_1 = require("./UserManagement/UserManagementHelper");
const ERROR_TRIGGER_TYPE = config_1.default.getEnv('nodes.errorTriggerType');
/**
 * Returns the data of the last executed node
 *
 * @export
 * @param {IRun} inputData
 * @returns {(ITaskData | undefined)}
 */
function getDataLastExecutedNodeData(inputData) {
    const { runData } = inputData.data.resultData;
    const { lastNodeExecuted } = inputData.data.resultData;
    if (lastNodeExecuted === undefined) {
        return undefined;
    }
    if (runData[lastNodeExecuted] === undefined) {
        return undefined;
    }
    return runData[lastNodeExecuted][runData[lastNodeExecuted].length - 1];
}
exports.getDataLastExecutedNodeData = getDataLastExecutedNodeData;
/**
 * Returns if the given id is a valid workflow id
 *
 * @param {(string | null | undefined)} id The id to check
 * @returns {boolean}
 * @memberof App
 */
function isWorkflowIdValid(id) {
    if (typeof id === 'string') {
        id = parseInt(id, 10);
    }
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(id)) {
        return false;
    }
    return true;
}
exports.isWorkflowIdValid = isWorkflowIdValid;
/**
 * Executes the error workflow
 *
 * @export
 * @param {string} workflowId The id of the error workflow
 * @param {IWorkflowErrorData} workflowErrorData The error data
 * @returns {Promise<void>}
 */
function executeErrorWorkflow(workflowId, workflowErrorData, runningUser) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // Wrap everything in try/catch to make sure that no errors bubble up and all get caught here
        try {
            let workflowData;
            if (workflowId.toString() !== ((_a = workflowErrorData.workflow.id) === null || _a === void 0 ? void 0 : _a.toString())) {
                // To make this code easier to understand, we split it in 2 parts:
                // 1) Fetch the owner of the errored workflows and then
                // 2) if now instance owner, then check if the user has access to the
                //    triggered workflow.
                const user = yield (0, UserManagementHelper_1.getWorkflowOwner)(workflowErrorData.workflow.id);
                if (user.globalRole.name === 'owner') {
                    workflowData = yield _1.Db.collections.Workflow.findOne({ id: Number(workflowId) });
                }
                else {
                    const sharedWorkflowData = yield _1.Db.collections.SharedWorkflow.findOne({
                        where: {
                            workflow: { id: workflowId },
                            user,
                        },
                        relations: ['workflow'],
                    });
                    if (sharedWorkflowData) {
                        workflowData = sharedWorkflowData.workflow;
                    }
                }
            }
            else {
                workflowData = yield _1.Db.collections.Workflow.findOne({ id: Number(workflowId) });
            }
            if (workflowData === undefined) {
                // The error workflow could not be found
                n8n_workflow_1.LoggerProxy.error(
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                `Calling Error Workflow for "${workflowErrorData.workflow.id}". Could not find error workflow "${workflowId}"`, { workflowId });
                return;
            }
            const user = yield (0, UserManagementHelper_1.getWorkflowOwner)(workflowId);
            if (user.id !== runningUser.id) {
                // The error workflow could not be found
                n8n_workflow_1.LoggerProxy.warn(`An attempt to execute workflow ID ${workflowId} as error workflow was blocked due to wrong permission`);
                return;
            }
            const executionMode = 'error';
            const nodeTypes = (0, _1.NodeTypes)();
            const workflowInstance = new n8n_workflow_1.Workflow({
                id: workflowId,
                name: workflowData.name,
                nodeTypes,
                nodes: workflowData.nodes,
                connections: workflowData.connections,
                active: workflowData.active,
                staticData: workflowData.staticData,
                settings: workflowData.settings,
            });
            let node;
            let workflowStartNode;
            for (const nodeName of Object.keys(workflowInstance.nodes)) {
                node = workflowInstance.nodes[nodeName];
                if (node.type === ERROR_TRIGGER_TYPE) {
                    workflowStartNode = node;
                }
            }
            if (workflowStartNode === undefined) {
                n8n_workflow_1.LoggerProxy.error(`Calling Error Workflow for "${workflowErrorData.workflow.id}". Could not find "${ERROR_TRIGGER_TYPE}" in workflow "${workflowId}"`);
                return;
            }
            // Can execute without webhook so go on
            // Initialize the data of the webhook node
            const nodeExecutionStack = [];
            nodeExecutionStack.push({
                node: workflowStartNode,
                data: {
                    main: [
                        [
                            {
                                json: workflowErrorData,
                            },
                        ],
                    ],
                },
                source: null,
            });
            const runExecutionData = {
                startData: {},
                resultData: {
                    runData: {},
                },
                executionData: {
                    contextData: {},
                    nodeExecutionStack,
                    waitingExecution: {},
                    waitingExecutionSource: {},
                },
            };
            const runData = {
                executionMode,
                executionData: runExecutionData,
                workflowData,
                userId: user.id,
            };
            const workflowRunner = new _1.WorkflowRunner();
            yield workflowRunner.run(runData);
        }
        catch (error) {
            n8n_workflow_1.LoggerProxy.error(`Calling Error Workflow for "${workflowErrorData.workflow.id}": "${error.message}"`, { workflowId: workflowErrorData.workflow.id });
        }
    });
}
exports.executeErrorWorkflow = executeErrorWorkflow;
/**
 * Returns all the defined NodeTypes
 *
 * @export
 * @returns {ITransferNodeTypes}
 */
function getAllNodeTypeData() {
    const nodeTypes = (0, _1.NodeTypes)();
    // Get the data of all thenode types that they
    // can be loaded again in the process
    const returnData = {};
    for (const nodeTypeName of Object.keys(nodeTypes.nodeTypes)) {
        if (nodeTypes.nodeTypes[nodeTypeName] === undefined) {
            throw new Error(`The NodeType "${nodeTypeName}" could not be found!`);
        }
        returnData[nodeTypeName] = {
            className: nodeTypes.nodeTypes[nodeTypeName].type.constructor.name,
            sourcePath: nodeTypes.nodeTypes[nodeTypeName].sourcePath,
        };
    }
    return returnData;
}
exports.getAllNodeTypeData = getAllNodeTypeData;
/**
 * Returns all the defined CredentialTypes
 *
 * @export
 * @returns {ICredentialsTypeData}
 */
function getAllCredentalsTypeData() {
    const credentialTypes = (0, _1.CredentialTypes)();
    // Get the data of all the credential types that they
    // can be loaded again in the subprocess
    const returnData = {};
    for (const credentialTypeName of Object.keys(credentialTypes.credentialTypes)) {
        if (credentialTypes.credentialTypes[credentialTypeName] === undefined) {
            throw new Error(`The CredentialType "${credentialTypeName}" could not be found!`);
        }
        returnData[credentialTypeName] = {
            className: credentialTypes.credentialTypes[credentialTypeName].type.constructor.name,
            sourcePath: credentialTypes.credentialTypes[credentialTypeName].sourcePath,
        };
    }
    return returnData;
}
exports.getAllCredentalsTypeData = getAllCredentalsTypeData;
/**
 * Returns the data of the node types that are needed
 * to execute the given nodes
 *
 * @export
 * @param {INode[]} nodes
 * @returns {ITransferNodeTypes}
 */
function getNodeTypeData(nodes) {
    const nodeTypes = (0, _1.NodeTypes)();
    // Check which node-types have to be loaded
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const neededNodeTypes = getNeededNodeTypes(nodes);
    // Get all the data of the needed node types that they
    // can be loaded again in the process
    const returnData = {};
    for (const nodeTypeName of neededNodeTypes) {
        if (nodeTypes.nodeTypes[nodeTypeName.type] === undefined) {
            throw new Error(`The NodeType "${nodeTypeName.type}" could not be found!`);
        }
        returnData[nodeTypeName.type] = {
            className: nodeTypes.nodeTypes[nodeTypeName.type].type.constructor.name,
            sourcePath: nodeTypes.nodeTypes[nodeTypeName.type].sourcePath,
        };
    }
    return returnData;
}
exports.getNodeTypeData = getNodeTypeData;
/**
 * Returns the credentials data of the given type and its parent types
 * it extends
 *
 * @export
 * @param {string} type The credential type to return data off
 * @returns {ICredentialsTypeData}
 */
function getCredentialsDataWithParents(type) {
    const credentialTypes = (0, _1.CredentialTypes)();
    const credentialType = credentialTypes.getByName(type);
    const credentialTypeData = {};
    credentialTypeData[type] = {
        className: credentialTypes.credentialTypes[type].type.constructor.name,
        sourcePath: credentialTypes.credentialTypes[type].sourcePath,
    };
    if (credentialType === undefined || credentialType.extends === undefined) {
        return credentialTypeData;
    }
    for (const typeName of credentialType.extends) {
        if (credentialTypeData[typeName] !== undefined) {
            continue;
        }
        credentialTypeData[typeName] = {
            className: credentialTypes.credentialTypes[typeName].type.constructor.name,
            sourcePath: credentialTypes.credentialTypes[typeName].sourcePath,
        };
        Object.assign(credentialTypeData, getCredentialsDataWithParents(typeName));
    }
    return credentialTypeData;
}
exports.getCredentialsDataWithParents = getCredentialsDataWithParents;
/**
 * Returns all the credentialTypes which are needed to resolve
 * the given workflow credentials
 *
 * @export
 * @param {IWorkflowCredentials} credentials The credentials which have to be able to be resolved
 * @returns {ICredentialsTypeData}
 */
function getCredentialsDataByNodes(nodes) {
    const credentialTypeData = {};
    for (const node of nodes) {
        const credentialsUsedByThisNode = node.credentials;
        if (credentialsUsedByThisNode) {
            // const credentialTypesUsedByThisNode = Object.keys(credentialsUsedByThisNode!);
            for (const credentialType of Object.keys(credentialsUsedByThisNode)) {
                if (credentialTypeData[credentialType] !== undefined) {
                    continue;
                }
                Object.assign(credentialTypeData, getCredentialsDataWithParents(credentialType));
            }
        }
    }
    return credentialTypeData;
}
exports.getCredentialsDataByNodes = getCredentialsDataByNodes;
/**
 * Returns the names of the NodeTypes which are are needed
 * to execute the gives nodes
 *
 * @export
 * @param {INode[]} nodes
 * @returns {string[]}
 */
function getNeededNodeTypes(nodes) {
    // Check which node-types have to be loaded
    const neededNodeTypes = [];
    for (const node of nodes) {
        if (neededNodeTypes.find((neededNodes) => node.type === neededNodes.type) === undefined) {
            neededNodeTypes.push({ type: node.type, version: node.typeVersion });
        }
    }
    return neededNodeTypes;
}
exports.getNeededNodeTypes = getNeededNodeTypes;
/**
 * Saves the static data if it changed
 *
 * @export
 * @param {Workflow} workflow
 * @returns {Promise <void>}
 */
function saveStaticData(workflow) {
    return __awaiter(this, void 0, void 0, function* () {
        if (workflow.staticData.__dataChanged === true) {
            // Static data of workflow changed and so has to be saved
            if (isWorkflowIdValid(workflow.id)) {
                // Workflow is saved so update in database
                try {
                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                    yield saveStaticDataById(workflow.id, workflow.staticData);
                    workflow.staticData.__dataChanged = false;
                }
                catch (e) {
                    n8n_workflow_1.LoggerProxy.error(`There was a problem saving the workflow with id "${workflow.id}" to save changed staticData: "${e.message}"`, { workflowId: workflow.id });
                }
            }
        }
    });
}
exports.saveStaticData = saveStaticData;
/**
 * Saves the given static data on workflow
 *
 * @export
 * @param {(string | number)} workflowId The id of the workflow to save data on
 * @param {IDataObject} newStaticData The static data to save
 * @returns {Promise<void>}
 */
function saveStaticDataById(workflowId, newStaticData) {
    return __awaiter(this, void 0, void 0, function* () {
        yield _1.Db.collections.Workflow.update(workflowId, {
            staticData: newStaticData,
        });
    });
}
exports.saveStaticDataById = saveStaticDataById;
/**
 * Returns the static data of workflow
 *
 * @export
 * @param {(string | number)} workflowId The id of the workflow to get static data of
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function getStaticDataById(workflowId) {
    return __awaiter(this, void 0, void 0, function* () {
        const workflowData = yield _1.Db.collections.Workflow.findOne(workflowId, {
            select: ['staticData'],
        });
        if (workflowData === undefined) {
            return {};
        }
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        return workflowData.staticData || {};
    });
}
exports.getStaticDataById = getStaticDataById;
// Checking if credentials of old format are in use and run a DB check if they might exist uniquely
function replaceInvalidCredentials(workflow) {
    return __awaiter(this, void 0, void 0, function* () {
        const { nodes } = workflow;
        if (!nodes)
            return workflow;
        // caching
        const credentialsByName = {};
        const credentialsById = {};
        // for loop to run DB fetches sequential and use cache to keep pressure off DB
        // trade-off: longer response time for less DB queries
        /* eslint-disable no-await-in-loop */
        for (const node of nodes) {
            if (!node.credentials || node.disabled) {
                continue;
            }
            // extract credentials types
            const allNodeCredentials = Object.entries(node.credentials);
            for (const [nodeCredentialType, nodeCredentials] of allNodeCredentials) {
                // Check if Node applies old credentials style
                if (typeof nodeCredentials === 'string' || nodeCredentials.id === null) {
                    const name = typeof nodeCredentials === 'string' ? nodeCredentials : nodeCredentials.name;
                    // init cache for type
                    if (!credentialsByName[nodeCredentialType]) {
                        credentialsByName[nodeCredentialType] = {};
                    }
                    if (credentialsByName[nodeCredentialType][name] === undefined) {
                        const credentials = yield _1.Db.collections.Credentials.find({
                            name,
                            type: nodeCredentialType,
                        });
                        // if credential name-type combination is unique, use it
                        if ((credentials === null || credentials === void 0 ? void 0 : credentials.length) === 1) {
                            credentialsByName[nodeCredentialType][name] = {
                                id: credentials[0].id.toString(),
                                name: credentials[0].name,
                            };
                            node.credentials[nodeCredentialType] = credentialsByName[nodeCredentialType][name];
                            continue;
                        }
                        // nothing found - add invalid credentials to cache to prevent further DB checks
                        credentialsByName[nodeCredentialType][name] = {
                            id: null,
                            name,
                        };
                    }
                    else {
                        // get credentials from cache
                        node.credentials[nodeCredentialType] = credentialsByName[nodeCredentialType][name];
                    }
                    continue;
                }
                // Node has credentials with an ID
                // init cache for type
                if (!credentialsById[nodeCredentialType]) {
                    credentialsById[nodeCredentialType] = {};
                }
                // check if credentials for ID-type are not yet cached
                if (credentialsById[nodeCredentialType][nodeCredentials.id] === undefined) {
                    // check first if ID-type combination exists
                    const credentials = yield _1.Db.collections.Credentials.findOne({
                        id: nodeCredentials.id,
                        type: nodeCredentialType,
                    });
                    if (credentials) {
                        credentialsById[nodeCredentialType][nodeCredentials.id] = {
                            id: credentials.id.toString(),
                            name: credentials.name,
                        };
                        node.credentials[nodeCredentialType] =
                            credentialsById[nodeCredentialType][nodeCredentials.id];
                        continue;
                    }
                    // no credentials found for ID, check if some exist for name
                    const credsByName = yield _1.Db.collections.Credentials.find({
                        name: nodeCredentials.name,
                        type: nodeCredentialType,
                    });
                    // if credential name-type combination is unique, take it
                    if ((credsByName === null || credsByName === void 0 ? void 0 : credsByName.length) === 1) {
                        // add found credential to cache
                        credentialsById[nodeCredentialType][credsByName[0].id] = {
                            id: credsByName[0].id.toString(),
                            name: credsByName[0].name,
                        };
                        node.credentials[nodeCredentialType] =
                            credentialsById[nodeCredentialType][credsByName[0].id];
                        continue;
                    }
                    // nothing found - add invalid credentials to cache to prevent further DB checks
                    credentialsById[nodeCredentialType][nodeCredentials.id] = nodeCredentials;
                    continue;
                }
                // get credentials from cache
                node.credentials[nodeCredentialType] =
                    credentialsById[nodeCredentialType][nodeCredentials.id];
            }
        }
        /* eslint-enable no-await-in-loop */
        return workflow;
    });
}
exports.replaceInvalidCredentials = replaceInvalidCredentials;
/**
 * Build a `where` clause for a TypeORM entity search,
 * checking for member access if the user is not an owner.
 */
function whereClause({ user, entityType, entityId = '', }) {
    const where = entityId ? { [entityType]: { id: entityId } } : {};
    // TODO: Decide if owner access should be restricted
    if (user.globalRole.name !== 'owner') {
        where.user = { id: user.id };
    }
    return where;
}
exports.whereClause = whereClause;
/**
 * Get the IDs of the workflows that have been shared with the user.
 */
function getSharedWorkflowIds(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const sharedWorkflows = yield _1.Db.collections.SharedWorkflow.find({
            relations: ['workflow'],
            where: whereClause({
                user,
                entityType: 'workflow',
            }),
        });
        return sharedWorkflows.map(({ workflow }) => workflow.id);
    });
}
exports.getSharedWorkflowIds = getSharedWorkflowIds;
/**
 * Check if user owns more than 15 workflows or more than 2 workflows with at least 2 nodes.
 * If user does, set flag in its settings.
 */
function isBelowOnboardingThreshold(user) {
    return __awaiter(this, void 0, void 0, function* () {
        let belowThreshold = true;
        const skippedTypes = ['n8n-nodes-base.start', 'n8n-nodes-base.stickyNote'];
        const workflowOwnerRole = yield _1.Db.collections.Role.findOne({
            name: 'owner',
            scope: 'workflow',
        });
        const ownedWorkflowsIds = yield _1.Db.collections.SharedWorkflow.find({
            user,
            role: workflowOwnerRole,
        }).then((ownedWorkflows) => ownedWorkflows.map((wf) => wf.workflowId));
        if (ownedWorkflowsIds.length > 15) {
            belowThreshold = false;
        }
        else {
            // just fetch workflows' nodes to keep memory footprint low
            const workflows = yield _1.Db.collections.Workflow.find({
                where: { id: (0, typeorm_1.In)(ownedWorkflowsIds) },
                select: ['nodes'],
            });
            // valid workflow: 2+ nodes without start node
            const validWorkflowCount = workflows.reduce((counter, workflow) => {
                if (counter <= 2 && workflow.nodes.length > 2) {
                    const nodes = workflow.nodes.filter((node) => !skippedTypes.includes(node.type));
                    if (nodes.length >= 2) {
                        return counter + 1;
                    }
                }
                return counter;
            }, 0);
            // more than 2 valid workflows required
            belowThreshold = validWorkflowCount <= 2;
        }
        // user is above threshold --> set flag in settings
        if (!belowThreshold) {
            void _1.Db.collections.User.update(user.id, { settings: { isOnboarded: true } });
        }
        return belowThreshold;
    });
}
exports.isBelowOnboardingThreshold = isBelowOnboardingThreshold;
