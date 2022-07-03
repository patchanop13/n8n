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
exports.Execute = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-console */
const fs_1 = require("fs");
const command_1 = require("@oclif/command");
const n8n_core_1 = require("n8n-core");
const n8n_workflow_1 = require("n8n-workflow");
const src_1 = require("../src");
const Logger_1 = require("../src/Logger");
const config_1 = __importDefault(require("../config"));
const UserManagementHelper_1 = require("../src/UserManagement/UserManagementHelper");
class Execute extends command_1.Command {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = (0, Logger_1.getLogger)();
            n8n_workflow_1.LoggerProxy.init(logger);
            const binaryDataConfig = config_1.default.getEnv('binaryDataManager');
            yield n8n_core_1.BinaryDataManager.init(binaryDataConfig, true);
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const { flags } = this.parse(Execute);
            // Start directly with the init of the database to improve startup time
            const startDbInitPromise = src_1.Db.init();
            // Load all node and credential types
            const loadNodesAndCredentials = (0, src_1.LoadNodesAndCredentials)();
            const loadNodesAndCredentialsPromise = loadNodesAndCredentials.init();
            if (!flags.id && !flags.file) {
                console.info(`Either option "--id" or "--file" have to be set!`);
                return;
            }
            if (flags.id && flags.file) {
                console.info(`Either "id" or "file" can be set never both!`);
                return;
            }
            let workflowId;
            let workflowData;
            if (flags.file) {
                // Path to workflow is given
                try {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    workflowData = JSON.parse(yield fs_1.promises.readFile(flags.file, 'utf8'));
                }
                catch (error) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    if (error.code === 'ENOENT') {
                        console.info(`The file "${flags.file}" could not be found.`);
                        return;
                    }
                    throw error;
                }
                // Do a basic check if the data in the file looks right
                // TODO: Later check with the help of TypeScript data if it is valid or not
                if (workflowData === undefined ||
                    workflowData.nodes === undefined ||
                    workflowData.connections === undefined) {
                    console.info(`The file "${flags.file}" does not contain valid workflow data.`);
                    return;
                }
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                workflowId = workflowData.id ? workflowData.id.toString() : n8n_core_1.PLACEHOLDER_EMPTY_WORKFLOW_ID;
            }
            // Wait till the database is ready
            yield startDbInitPromise;
            if (flags.id) {
                // Id of workflow is given
                workflowId = flags.id;
                workflowData = yield src_1.Db.collections.Workflow.findOne(workflowId);
                if (workflowData === undefined) {
                    console.info(`The workflow with the id "${workflowId}" does not exist.`);
                    process.exit(1);
                }
            }
            // Make sure the settings exist
            yield n8n_core_1.UserSettings.prepareUserSettings();
            // Wait till the n8n-packages have been read
            yield loadNodesAndCredentialsPromise;
            // Load the credentials overwrites if any exist
            const credentialsOverwrites = (0, src_1.CredentialsOverwrites)();
            yield credentialsOverwrites.init();
            // Load all external hooks
            const externalHooks = (0, src_1.ExternalHooks)();
            yield externalHooks.init();
            // Add the found types to an instance other parts of the application can use
            const nodeTypes = (0, src_1.NodeTypes)();
            yield nodeTypes.init(loadNodesAndCredentials.nodeTypes);
            const credentialTypes = (0, src_1.CredentialTypes)();
            yield credentialTypes.init(loadNodesAndCredentials.credentialTypes);
            const instanceId = yield n8n_core_1.UserSettings.getInstanceId();
            const { cli } = yield src_1.GenericHelpers.getVersions();
            src_1.InternalHooksManager.init(instanceId, cli, nodeTypes);
            if (!src_1.WorkflowHelpers.isWorkflowIdValid(workflowId)) {
                workflowId = undefined;
            }
            // Check if the workflow contains the required "Start" node
            // "requiredNodeTypes" are also defined in editor-ui/views/NodeView.vue
            const requiredNodeTypes = ['n8n-nodes-base.start'];
            let startNode;
            // eslint-disable-next-line no-restricted-syntax, @typescript-eslint/no-non-null-assertion
            for (const node of workflowData.nodes) {
                if (requiredNodeTypes.includes(node.type)) {
                    startNode = node;
                    break;
                }
            }
            if (startNode === undefined) {
                // If the workflow does not contain a start-node we can not know what
                // should be executed and with which data to start.
                console.info(`The workflow does not contain a "Start" node. So it can not be executed.`);
                // eslint-disable-next-line consistent-return
                return Promise.resolve();
            }
            try {
                const user = yield (0, UserManagementHelper_1.getInstanceOwner)();
                const runData = {
                    executionMode: 'cli',
                    startNodes: [startNode.name],
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    workflowData: workflowData,
                    userId: user.id,
                };
                const workflowRunner = new src_1.WorkflowRunner();
                const executionId = yield workflowRunner.run(runData);
                const activeExecutions = src_1.ActiveExecutions.getInstance();
                const data = yield activeExecutions.getPostExecutePromise(executionId);
                if (data === undefined) {
                    throw new Error('Workflow did not return any data!');
                }
                if (data.data.resultData.error) {
                    console.info('Execution was NOT successful. See log message for details.');
                    logger.info('Execution error:');
                    logger.info('====================================');
                    logger.info(JSON.stringify(data, null, 2));
                    const { error } = data.data.resultData;
                    // eslint-disable-next-line @typescript-eslint/no-throw-literal
                    throw Object.assign(Object.assign({}, error), { stack: error.stack });
                }
                if (flags.rawOutput === undefined) {
                    this.log('Execution was successful:');
                    this.log('====================================');
                }
                this.log(JSON.stringify(data, null, 2));
            }
            catch (e) {
                console.error('Error executing workflow. See log messages for details.');
                logger.error('\nExecution error:');
                logger.info('====================================');
                logger.error(e.message);
                logger.error(e.stack);
                this.exit(1);
            }
            this.exit();
        });
    }
}
exports.Execute = Execute;
Execute.description = '\nExecutes a given workflow';
Execute.examples = [`$ n8n execute --id=5`, `$ n8n execute --file=workflow.json`];
Execute.flags = {
    help: command_1.flags.help({ char: 'h' }),
    file: command_1.flags.string({
        description: 'path to a workflow file to execute',
    }),
    id: command_1.flags.string({
        description: 'id of the workflow to execute',
    }),
    rawOutput: command_1.flags.boolean({
        description: 'Outputs only JSON data, with no other text',
    }),
};
