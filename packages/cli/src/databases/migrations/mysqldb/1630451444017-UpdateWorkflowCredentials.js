"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.UpdateWorkflowCredentials1630451444017 = void 0;
const config = __importStar(require("../../../../config"));
const migrationHelpers_1 = require("../../utils/migrationHelpers");
// replacing the credentials in workflows and execution
// `nodeType: name` changes to `nodeType: { id, name }`
class UpdateWorkflowCredentials1630451444017 {
    constructor() {
        this.name = 'UpdateWorkflowCredentials1630451444017';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const tablePrefix = config.getEnv('database.tablePrefix');
            const credentialsEntities = yield queryRunner.query(`
			SELECT id, name, type
			FROM ${tablePrefix}credentials_entity
		`);
            const workflowsQuery = `
			SELECT id, nodes
			FROM ${tablePrefix}workflow_entity
		`;
            // @ts-ignore
            yield (0, migrationHelpers_1.runChunked)(queryRunner, workflowsQuery, (workflows) => {
                workflows.forEach((workflow) => __awaiter(this, void 0, void 0, function* () {
                    const nodes = workflow.nodes;
                    let credentialsUpdated = false;
                    // @ts-ignore
                    nodes.forEach((node) => {
                        if (node.credentials) {
                            const allNodeCredentials = Object.entries(node.credentials);
                            for (const [type, name] of allNodeCredentials) {
                                if (typeof name === 'string') {
                                    const matchingCredentials = credentialsEntities.find(
                                    // @ts-ignore
                                    (credentials) => credentials.name === name && credentials.type === type);
                                    node.credentials[type] = { id: (matchingCredentials === null || matchingCredentials === void 0 ? void 0 : matchingCredentials.id.toString()) || null, name };
                                    credentialsUpdated = true;
                                }
                            }
                        }
                    });
                    if (credentialsUpdated) {
                        const [updateQuery, updateParams] = queryRunner.connection.driver.escapeQueryWithParameters(`
								UPDATE ${tablePrefix}workflow_entity
								SET nodes = :nodes
								WHERE id = '${workflow.id}'
							`, { nodes: JSON.stringify(nodes) }, {});
                        queryRunner.query(updateQuery, updateParams);
                    }
                }));
            });
            const waitingExecutionsQuery = `
			SELECT id, workflowData
			FROM ${tablePrefix}execution_entity
			WHERE waitTill IS NOT NULL AND finished = 0
		`;
            // @ts-ignore
            yield (0, migrationHelpers_1.runChunked)(queryRunner, waitingExecutionsQuery, (waitingExecutions) => {
                waitingExecutions.forEach((execution) => __awaiter(this, void 0, void 0, function* () {
                    const data = execution.workflowData;
                    let credentialsUpdated = false;
                    // @ts-ignore
                    data.nodes.forEach((node) => {
                        if (node.credentials) {
                            const allNodeCredentials = Object.entries(node.credentials);
                            for (const [type, name] of allNodeCredentials) {
                                if (typeof name === 'string') {
                                    const matchingCredentials = credentialsEntities.find(
                                    // @ts-ignore
                                    (credentials) => credentials.name === name && credentials.type === type);
                                    node.credentials[type] = { id: (matchingCredentials === null || matchingCredentials === void 0 ? void 0 : matchingCredentials.id.toString()) || null, name };
                                    credentialsUpdated = true;
                                }
                            }
                        }
                    });
                    if (credentialsUpdated) {
                        const [updateQuery, updateParams] = queryRunner.connection.driver.escapeQueryWithParameters(`
								UPDATE ${tablePrefix}execution_entity
								SET workflowData = :data
								WHERE id = '${execution.id}'
							`, { data: JSON.stringify(data) }, {});
                        queryRunner.query(updateQuery, updateParams);
                    }
                }));
            });
            const retryableExecutions = yield queryRunner.query(`
			SELECT id, workflowData
			FROM ${tablePrefix}execution_entity
			WHERE waitTill IS NULL AND finished = 0 AND mode != 'retry'
			ORDER BY startedAt DESC
			LIMIT 200
		`);
            // @ts-ignore
            retryableExecutions.forEach((execution) => __awaiter(this, void 0, void 0, function* () {
                const data = execution.workflowData;
                let credentialsUpdated = false;
                // @ts-ignore
                data.nodes.forEach((node) => {
                    if (node.credentials) {
                        const allNodeCredentials = Object.entries(node.credentials);
                        for (const [type, name] of allNodeCredentials) {
                            if (typeof name === 'string') {
                                const matchingCredentials = credentialsEntities.find(
                                // @ts-ignore
                                (credentials) => credentials.name === name && credentials.type === type);
                                node.credentials[type] = { id: (matchingCredentials === null || matchingCredentials === void 0 ? void 0 : matchingCredentials.id.toString()) || null, name };
                                credentialsUpdated = true;
                            }
                        }
                    }
                });
                if (credentialsUpdated) {
                    const [updateQuery, updateParams] = queryRunner.connection.driver.escapeQueryWithParameters(`
						UPDATE ${tablePrefix}execution_entity
						SET workflowData = :data
						WHERE id = '${execution.id}'
					`, { data: JSON.stringify(data) }, {});
                    queryRunner.query(updateQuery, updateParams);
                }
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const tablePrefix = config.getEnv('database.tablePrefix');
            const credentialsEntities = yield queryRunner.query(`
			SELECT id, name, type
			FROM ${tablePrefix}credentials_entity
		`);
            const workflowsQuery = `
			SELECT id, nodes
			FROM ${tablePrefix}workflow_entity
		`;
            // @ts-ignore
            yield (0, migrationHelpers_1.runChunked)(queryRunner, workflowsQuery, (workflows) => {
                workflows.forEach((workflow) => __awaiter(this, void 0, void 0, function* () {
                    const nodes = workflow.nodes;
                    let credentialsUpdated = false;
                    // @ts-ignore
                    nodes.forEach((node) => {
                        if (node.credentials) {
                            const allNodeCredentials = Object.entries(node.credentials);
                            for (const [type, creds] of allNodeCredentials) {
                                if (typeof creds === 'object') {
                                    const matchingCredentials = credentialsEntities.find(
                                    // @ts-ignore
                                    (credentials) => credentials.id === creds.id && credentials.type === type);
                                    if (matchingCredentials) {
                                        node.credentials[type] = matchingCredentials.name;
                                    }
                                    else {
                                        // @ts-ignore
                                        node.credentials[type] = creds.name;
                                    }
                                    credentialsUpdated = true;
                                }
                            }
                        }
                    });
                    if (credentialsUpdated) {
                        const [updateQuery, updateParams] = queryRunner.connection.driver.escapeQueryWithParameters(`
								UPDATE ${tablePrefix}workflow_entity
								SET nodes = :nodes
								WHERE id = '${workflow.id}'
							`, { nodes: JSON.stringify(nodes) }, {});
                        queryRunner.query(updateQuery, updateParams);
                    }
                }));
            });
            const waitingExecutionsQuery = `
			SELECT id, workflowData
			FROM ${tablePrefix}execution_entity
			WHERE waitTill IS NOT NULL AND finished = 0
		`;
            // @ts-ignore
            yield (0, migrationHelpers_1.runChunked)(queryRunner, waitingExecutionsQuery, (waitingExecutions) => {
                waitingExecutions.forEach((execution) => __awaiter(this, void 0, void 0, function* () {
                    const data = execution.workflowData;
                    let credentialsUpdated = false;
                    // @ts-ignore
                    data.nodes.forEach((node) => {
                        if (node.credentials) {
                            const allNodeCredentials = Object.entries(node.credentials);
                            for (const [type, creds] of allNodeCredentials) {
                                if (typeof creds === 'object') {
                                    // @ts-ignore
                                    const matchingCredentials = credentialsEntities.find(
                                    // @ts-ignore
                                    (credentials) => credentials.id === creds.id && credentials.type === type);
                                    if (matchingCredentials) {
                                        node.credentials[type] = matchingCredentials.name;
                                    }
                                    else {
                                        // @ts-ignore
                                        node.credentials[type] = creds.name;
                                    }
                                    credentialsUpdated = true;
                                }
                            }
                        }
                    });
                    if (credentialsUpdated) {
                        const [updateQuery, updateParams] = queryRunner.connection.driver.escapeQueryWithParameters(`
								UPDATE ${tablePrefix}execution_entity
								SET workflowData = :data
								WHERE id = '${execution.id}'
							`, { data: JSON.stringify(data) }, {});
                        queryRunner.query(updateQuery, updateParams);
                    }
                }));
            });
            const retryableExecutions = yield queryRunner.query(`
			SELECT id, workflowData
			FROM ${tablePrefix}execution_entity
			WHERE waitTill IS NULL AND finished = 0 AND mode != 'retry'
			ORDER BY startedAt DESC
			LIMIT 200
		`);
            // @ts-ignore
            retryableExecutions.forEach((execution) => __awaiter(this, void 0, void 0, function* () {
                const data = execution.workflowData;
                let credentialsUpdated = false;
                // @ts-ignore
                data.nodes.forEach((node) => {
                    if (node.credentials) {
                        const allNodeCredentials = Object.entries(node.credentials);
                        for (const [type, creds] of allNodeCredentials) {
                            if (typeof creds === 'object') {
                                // @ts-ignore
                                const matchingCredentials = credentialsEntities.find(
                                // @ts-ignore
                                (credentials) => credentials.id === creds.id && credentials.type === type);
                                if (matchingCredentials) {
                                    node.credentials[type] = matchingCredentials.name;
                                }
                                else {
                                    // @ts-ignore
                                    node.credentials[type] = creds.name;
                                }
                                credentialsUpdated = true;
                            }
                        }
                    }
                });
                if (credentialsUpdated) {
                    const [updateQuery, updateParams] = queryRunner.connection.driver.escapeQueryWithParameters(`
						UPDATE ${tablePrefix}execution_entity
						SET workflowData = :data
						WHERE id = '${execution.id}'
					`, { data: JSON.stringify(data) }, {});
                    queryRunner.query(updateQuery, updateParams);
                }
            }));
        });
    }
}
exports.UpdateWorkflowCredentials1630451444017 = UpdateWorkflowCredentials1630451444017;
