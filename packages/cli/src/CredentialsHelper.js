"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
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
exports.createCredentiasFromCredentialsEntity = exports.getCredentialWithoutUser = exports.getCredentialForUser = exports.whereClause = exports.CredentialsHelper = void 0;
const n8n_core_1 = require("n8n-core");
// eslint-disable-next-line import/no-extraneous-dependencies
const lodash_1 = require("lodash");
const n8n_nodes_base_1 = require("n8n-nodes-base");
const n8n_workflow_1 = require("n8n-workflow");
// eslint-disable-next-line import/no-cycle
const _1 = require(".");
const mockNodeTypes = {
    nodeTypes: {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    init: (nodeTypes) => __awaiter(void 0, void 0, void 0, function* () { }),
    getAll() {
        // @ts-ignore
        return Object.values(this.nodeTypes).map((data) => data.type);
    },
    getByNameAndVersion(nodeType, version) {
        if (this.nodeTypes[nodeType] === undefined) {
            return undefined;
        }
        return n8n_workflow_1.NodeHelpers.getVersionedNodeType(this.nodeTypes[nodeType].type, version);
    },
};
class CredentialsHelper extends n8n_workflow_1.ICredentialsHelper {
    constructor() {
        super(...arguments);
        this.credentialTypes = (0, _1.CredentialTypes)();
    }
    /**
     * Add the required authentication information to the request
     */
    authenticate(credentials, typeName, incomingRequestOptions, workflow, node, defaultTimezone) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestOptions = incomingRequestOptions;
            const credentialType = this.credentialTypes.getByName(typeName);
            if (credentialType.authenticate) {
                if (typeof credentialType.authenticate === 'function') {
                    // Special authentication function is defined
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    return credentialType.authenticate(credentials, requestOptions);
                }
                if (typeof credentialType.authenticate === 'object') {
                    // Predefined authentication method
                    let keyResolved;
                    let valueResolved;
                    const { authenticate } = credentialType;
                    if (requestOptions.headers === undefined) {
                        requestOptions.headers = {};
                    }
                    if (authenticate.type === 'generic') {
                        Object.entries(authenticate.properties).forEach(([outerKey, outerValue]) => {
                            Object.entries(outerValue).forEach(([key, value]) => {
                                keyResolved = this.resolveValue(key, { $credentials: credentials }, workflow, node, defaultTimezone);
                                valueResolved = this.resolveValue(value, { $credentials: credentials }, workflow, node, defaultTimezone);
                                // @ts-ignore
                                if (!requestOptions[outerKey]) {
                                    // @ts-ignore
                                    requestOptions[outerKey] = {};
                                }
                                // @ts-ignore
                                requestOptions[outerKey][keyResolved] = valueResolved;
                            });
                        });
                    }
                }
            }
            return requestOptions;
        });
    }
    /**
     * Resolves the given value in case it is an expression
     */
    resolveValue(parameterValue, additionalKeys, workflow, node, defaultTimezone) {
        if (parameterValue.charAt(0) !== '=') {
            return parameterValue;
        }
        const returnValue = workflow.expression.getSimpleParameterValue(node, parameterValue, 'internal', defaultTimezone, additionalKeys, undefined, '');
        if (!returnValue) {
            return '';
        }
        return returnValue.toString();
    }
    /**
     * Returns all parent types of the given credential type
     */
    getParentTypes(typeName) {
        const credentialType = this.credentialTypes.getByName(typeName);
        if (credentialType === undefined || credentialType.extends === undefined) {
            return [];
        }
        let types = [];
        credentialType.extends.forEach((type) => {
            types = [...types, type, ...this.getParentTypes(type)];
        });
        return types;
    }
    /**
     * Returns the credentials instance
     *
     * @param {INodeCredentialsDetails} nodeCredential id and name to return instance of
     * @param {string} type Type of the credential to return instance of
     * @returns {Credentials}
     * @memberof CredentialsHelper
     */
    getCredentials(nodeCredential, type, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!nodeCredential.id) {
                throw new Error(`Credential "${nodeCredential.name}" of type "${type}" has no ID.`);
            }
            const credential = userId
                ? yield _1.Db.collections.SharedCredentials.findOneOrFail({
                    relations: ['credentials'],
                    where: { credentials: { id: nodeCredential.id, type }, user: { id: userId } },
                }).then((shared) => shared.credentials)
                : yield _1.Db.collections.Credentials.findOneOrFail({ id: nodeCredential.id, type });
            if (!credential) {
                throw new Error(`Credential with ID "${nodeCredential.id}" does not exist for type "${type}".`);
            }
            return new n8n_core_1.Credentials({ id: credential.id.toString(), name: credential.name }, credential.type, credential.nodesAccess, credential.data);
        });
    }
    /**
     * Returns all the properties of the credentials with the given name
     *
     * @param {string} type The name of the type to return credentials off
     * @returns {INodeProperties[]}
     * @memberof CredentialsHelper
     */
    getCredentialsProperties(type) {
        const credentialTypeData = this.credentialTypes.getByName(type);
        if (credentialTypeData === undefined) {
            throw new Error(`The credentials of type "${type}" are not known.`);
        }
        if (credentialTypeData.extends === undefined) {
            return credentialTypeData.properties;
        }
        const combineProperties = [];
        for (const credentialsTypeName of credentialTypeData.extends) {
            const mergeCredentialProperties = this.getCredentialsProperties(credentialsTypeName);
            n8n_workflow_1.NodeHelpers.mergeNodeProperties(combineProperties, mergeCredentialProperties);
        }
        // The properties defined on the parent credentials take presidence
        n8n_workflow_1.NodeHelpers.mergeNodeProperties(combineProperties, credentialTypeData.properties);
        return combineProperties;
    }
    /**
     * Returns the decrypted credential data with applied overwrites
     *
     * @param {INodeCredentialsDetails} nodeCredentials id and name to return instance of
     * @param {string} type Type of the credentials to return data of
     * @param {boolean} [raw] Return the data as supplied without defaults or overwrites
     * @returns {ICredentialDataDecryptedObject}
     * @memberof CredentialsHelper
     */
    getDecrypted(nodeCredentials, type, mode, defaultTimezone, raw, expressionResolveValues) {
        return __awaiter(this, void 0, void 0, function* () {
            const credentials = yield this.getCredentials(nodeCredentials, type);
            const decryptedDataOriginal = credentials.getData(this.encryptionKey);
            if (raw === true) {
                return decryptedDataOriginal;
            }
            return this.applyDefaultsAndOverwrites(decryptedDataOriginal, type, mode, defaultTimezone, expressionResolveValues);
        });
    }
    /**
     * Applies credential default data and overwrites
     *
     * @param {ICredentialDataDecryptedObject} decryptedDataOriginal The credential data to overwrite data on
     * @param {string} type  Type of the credentials to overwrite data of
     * @returns {ICredentialDataDecryptedObject}
     * @memberof CredentialsHelper
     */
    applyDefaultsAndOverwrites(decryptedDataOriginal, type, mode, defaultTimezone, expressionResolveValues) {
        const credentialsProperties = this.getCredentialsProperties(type);
        // Add the default credential values
        let decryptedData = n8n_workflow_1.NodeHelpers.getNodeParameters(credentialsProperties, decryptedDataOriginal, true, false, null);
        if (decryptedDataOriginal.oauthTokenData !== undefined) {
            // The OAuth data gets removed as it is not defined specifically as a parameter
            // on the credentials so add it back in case it was set
            decryptedData.oauthTokenData = decryptedDataOriginal.oauthTokenData;
        }
        if (expressionResolveValues) {
            const timezone = expressionResolveValues.workflow.settings.timezone || defaultTimezone;
            try {
                decryptedData = expressionResolveValues.workflow.expression.getParameterValue(decryptedData, expressionResolveValues.runExecutionData, expressionResolveValues.runIndex, expressionResolveValues.itemIndex, expressionResolveValues.node.name, expressionResolveValues.connectionInputData, mode, timezone, {}, undefined, false, decryptedData);
            }
            catch (e) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                e.message += ' [Error resolving credentials]';
                throw e;
            }
        }
        else {
            const node = {
                name: '',
                typeVersion: 1,
                type: 'mock',
                position: [0, 0],
                parameters: {},
            };
            const workflow = new n8n_workflow_1.Workflow({
                nodes: [node],
                connections: {},
                active: false,
                nodeTypes: mockNodeTypes,
            });
            // Resolve expressions if any are set
            decryptedData = workflow.expression.getComplexParameterValue(node, decryptedData, mode, defaultTimezone, {}, undefined, undefined, decryptedData);
        }
        // Load and apply the credentials overwrites if any exist
        const credentialsOverwrites = (0, _1.CredentialsOverwrites)();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return credentialsOverwrites.applyOverwrite(type, decryptedData);
    }
    /**
     * Updates credentials in the database
     *
     * @param {string} name Name of the credentials to set data of
     * @param {string} type Type of the credentials to set data of
     * @param {ICredentialDataDecryptedObject} data The data to set
     * @returns {Promise<void>}
     * @memberof CredentialsHelper
     */
    updateCredentials(nodeCredentials, type, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line @typescript-eslint/await-thenable
            const credentials = yield this.getCredentials(nodeCredentials, type);
            if (!_1.Db.isInitialized) {
                // The first time executeWorkflow gets called the Database has
                // to get initialized first
                yield _1.Db.init();
            }
            credentials.setData(data, this.encryptionKey);
            const newCredentialsData = credentials.getDataToSave();
            // Add special database related data
            newCredentialsData.updatedAt = new Date();
            // Save the credentials in DB
            const findQuery = {
                id: credentials.id,
                type,
            };
            yield _1.Db.collections.Credentials.update(findQuery, newCredentialsData);
        });
    }
    getCredentialTestFunction(credentialType, nodeToTestWith) {
        var _a, _b, _c, _d, _e;
        const nodeTypes = (0, _1.NodeTypes)();
        const allNodes = nodeTypes.getAll();
        // Check all the nodes one by one if they have a test function defined
        for (let i = 0; i < allNodes.length; i++) {
            const node = allNodes[i];
            if (nodeToTestWith && node.description.name !== nodeToTestWith) {
                // eslint-disable-next-line no-continue
                continue;
            }
            // Always set to an array even if node is not versioned to not having
            // to duplicate the logic
            const allNodeTypes = [];
            if (node instanceof n8n_nodes_base_1.NodeVersionedType) {
                // Node is versioned
                allNodeTypes.push(...Object.values(node.nodeVersions));
            }
            else {
                // Node is not versioned
                allNodeTypes.push(node);
            }
            // Check each of the node versions for credential tests
            for (const nodeType of allNodeTypes) {
                // Check each of teh credentials
                for (const credential of (_a = nodeType.description.credentials) !== null && _a !== void 0 ? _a : []) {
                    if (credential.name === credentialType && !!credential.testedBy) {
                        if (typeof credential.testedBy === 'string') {
                            if (Object.prototype.hasOwnProperty.call(node, 'nodeVersions')) {
                                // The node is versioned. So check all versions for test function
                                // starting with the latest
                                const versions = Object.keys(node.nodeVersions)
                                    .sort()
                                    .reverse();
                                for (const version of versions) {
                                    const versionedNode = node.nodeVersions[parseInt(version, 10)];
                                    if (((_b = versionedNode.methods) === null || _b === void 0 ? void 0 : _b.credentialTest) &&
                                        ((_c = versionedNode.methods) === null || _c === void 0 ? void 0 : _c.credentialTest[credential.testedBy])) {
                                        return (_d = versionedNode.methods) === null || _d === void 0 ? void 0 : _d.credentialTest[credential.testedBy];
                                    }
                                }
                            }
                            // Test is defined as string which links to a functoin
                            return (_e = node.methods) === null || _e === void 0 ? void 0 : _e.credentialTest[credential.testedBy];
                        }
                        // Test is defined as JSON with a defintion for the request to make
                        return {
                            nodeType,
                            testRequest: credential.testedBy,
                        };
                    }
                }
            }
        }
        // Check if test is defined on credentials
        const type = this.credentialTypes.getByName(credentialType);
        if (type.test) {
            return {
                testRequest: type.test,
            };
        }
        return undefined;
    }
    testCredentials(user, credentialType, credentialsDecrypted, nodeToTestWith) {
        return __awaiter(this, void 0, void 0, function* () {
            const credentialTestFunction = this.getCredentialTestFunction(credentialType, nodeToTestWith);
            if (credentialTestFunction === undefined) {
                return Promise.resolve({
                    status: 'Error',
                    message: 'No testing function found for this credential.',
                });
            }
            if (typeof credentialTestFunction === 'function') {
                // The credentials get tested via a function that is defined on the node
                const credentialTestFunctions = n8n_core_1.NodeExecuteFunctions.getCredentialTestFunctions();
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                return credentialTestFunction.call(credentialTestFunctions, credentialsDecrypted);
            }
            // Credentials get tested via request instructions
            // TODO: Temp worfklows get created at multiple locations (for example also LoadNodeParameterOptions),
            //       check if some of them are identical enough that it can be combined
            let nodeType;
            if (credentialTestFunction.nodeType) {
                nodeType = credentialTestFunction.nodeType;
            }
            else {
                const nodeTypes = (0, _1.NodeTypes)();
                nodeType = nodeTypes.getByNameAndVersion('n8n-nodes-base.noOp');
            }
            const node = {
                parameters: {},
                name: 'Temp-Node',
                type: nodeType.description.name,
                typeVersion: Array.isArray(nodeType.description.version)
                    ? nodeType.description.version.slice(-1)[0]
                    : nodeType.description.version,
                position: [0, 0],
            };
            const workflowData = {
                nodes: [node],
                connections: {},
            };
            const nodeTypeCopy = {
                description: Object.assign(Object.assign({}, nodeType.description), { credentials: [
                        {
                            name: credentialType,
                            required: true,
                        },
                    ], properties: [
                        {
                            displayName: 'Temp',
                            name: 'temp',
                            type: 'string',
                            routing: {
                                request: credentialTestFunction.testRequest.request,
                            },
                            default: '',
                        },
                    ] }),
            };
            const nodeTypes = Object.assign(Object.assign({}, mockNodeTypes), { nodeTypes: {
                    [nodeTypeCopy.description.name]: {
                        sourcePath: '',
                        type: nodeTypeCopy,
                    },
                } });
            const workflow = new n8n_workflow_1.Workflow({
                nodes: workflowData.nodes,
                connections: workflowData.connections,
                active: false,
                nodeTypes,
            });
            const mode = 'internal';
            const runIndex = 0;
            const inputData = {
                main: [[{ json: {} }]],
            };
            const connectionInputData = [];
            const runExecutionData = {
                resultData: {
                    runData: {},
                },
            };
            const additionalData = yield _1.WorkflowExecuteAdditionalData.getBase(user.id, node.parameters);
            const routingNode = new n8n_workflow_1.RoutingNode(workflow, node, connectionInputData, runExecutionData !== null && runExecutionData !== void 0 ? runExecutionData : null, additionalData, mode);
            let response;
            try {
                response = yield routingNode.runNode(inputData, runIndex, nodeTypeCopy, { node, data: {}, source: null }, n8n_core_1.NodeExecuteFunctions, credentialsDecrypted);
            }
            catch (error) {
                // Do not fail any requests to allow custom error messages and
                // make logic easier
                if (error.cause.response) {
                    const errorResponseData = {
                        statusCode: error.cause.response.status,
                        statusMessage: error.cause.response.statusText,
                    };
                    if (credentialTestFunction.testRequest.rules) {
                        // Special testing rules are defined so check all in order
                        for (const rule of credentialTestFunction.testRequest.rules) {
                            if (rule.type === 'responseCode') {
                                if (errorResponseData.statusCode === rule.properties.value) {
                                    return {
                                        status: 'Error',
                                        message: rule.properties.message,
                                    };
                                }
                            }
                        }
                    }
                    if (errorResponseData.statusCode < 199 || errorResponseData.statusCode > 299) {
                        // All requests with response codes that are not 2xx are treated by default as failed
                        return {
                            status: 'Error',
                            message: 
                            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                            errorResponseData.statusMessage ||
                                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                `Received HTTP status code: ${errorResponseData.statusCode}`,
                        };
                    }
                }
                n8n_workflow_1.LoggerProxy.debug('Credential test failed', error);
                return {
                    status: 'Error',
                    message: error.message.toString(),
                };
            }
            if (credentialTestFunction.testRequest.rules &&
                Array.isArray(credentialTestFunction.testRequest.rules)) {
                // Special testing rules are defined so check all in order
                for (const rule of credentialTestFunction.testRequest.rules) {
                    if (rule.type === 'responseSuccessBody') {
                        const responseData = response[0][0].json;
                        if ((0, lodash_1.get)(responseData, rule.properties.key) === rule.properties.value) {
                            return {
                                status: 'Error',
                                message: rule.properties.message,
                            };
                        }
                    }
                }
            }
            return {
                status: 'OK',
                message: 'Connection successful!',
            };
        });
    }
}
exports.CredentialsHelper = CredentialsHelper;
/**
 * Build a `where` clause for a `find()` or `findOne()` operation
 * in the `shared_workflow` or `shared_credentials` tables.
 */
function whereClause({ user, entityType, entityId = '', }) {
    const where = entityId ? { [entityType]: { id: entityId } } : {};
    if (user.globalRole.name !== 'owner') {
        where.user = { id: user.id };
    }
    return where;
}
exports.whereClause = whereClause;
/**
 * Get a credential if it has been shared with a user.
 */
function getCredentialForUser(credentialId, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const sharedCredential = yield _1.Db.collections.SharedCredentials.findOne({
            relations: ['credentials'],
            where: whereClause({
                user,
                entityType: 'credentials',
                entityId: credentialId,
            }),
        });
        if (!sharedCredential)
            return null;
        return sharedCredential.credentials;
    });
}
exports.getCredentialForUser = getCredentialForUser;
/**
 * Get a credential without user check
 */
function getCredentialWithoutUser(credentialId) {
    return __awaiter(this, void 0, void 0, function* () {
        const credential = yield _1.Db.collections.Credentials.findOne(credentialId);
        return credential;
    });
}
exports.getCredentialWithoutUser = getCredentialWithoutUser;
function createCredentiasFromCredentialsEntity(credential, encrypt = false) {
    const { id, name, type, nodesAccess, data } = credential;
    if (encrypt) {
        return new n8n_core_1.Credentials({ id: null, name }, type, nodesAccess);
    }
    return new n8n_core_1.Credentials({ id: id.toString(), name }, type, nodesAccess, data);
}
exports.createCredentiasFromCredentialsEntity = createCredentiasFromCredentialsEntity;
