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
exports.ImportWorkflowsCommand = void 0;
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const command_1 = require("@oclif/command");
const n8n_workflow_1 = require("n8n-workflow");
const fs_1 = __importDefault(require("fs"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const n8n_core_1 = require("n8n-core");
const typeorm_1 = require("typeorm");
const Logger_1 = require("../../src/Logger");
const src_1 = require("../../src");
const SharedWorkflow_1 = require("../../src/databases/entities/SharedWorkflow");
const WorkflowEntity_1 = require("../../src/databases/entities/WorkflowEntity");
const TagHelpers_1 = require("../../src/TagHelpers");
const FIX_INSTRUCTION = 'Please fix the database by running ./packages/cli/bin/n8n user-management:reset';
function assertHasWorkflowsToImport(workflows) {
    if (!Array.isArray(workflows)) {
        throw new Error('File does not seem to contain workflows. Make sure the workflows are contained in an array.');
    }
    for (const workflow of workflows) {
        if (typeof workflow !== 'object' ||
            !Object.prototype.hasOwnProperty.call(workflow, 'nodes') ||
            !Object.prototype.hasOwnProperty.call(workflow, 'connections')) {
            throw new Error('File does not seem to contain valid workflows.');
        }
    }
}
class ImportWorkflowsCommand extends command_1.Command {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = (0, Logger_1.getLogger)();
            n8n_workflow_1.LoggerProxy.init(logger);
            const { flags } = this.parse(ImportWorkflowsCommand);
            if (!flags.input) {
                console.info('An input file or directory with --input must be provided');
                return;
            }
            if (flags.separate) {
                if (fs_1.default.existsSync(flags.input)) {
                    if (!fs_1.default.lstatSync(flags.input).isDirectory()) {
                        console.info('The argument to --input must be a directory');
                        return;
                    }
                }
            }
            try {
                yield src_1.Db.init();
                yield this.initOwnerWorkflowRole();
                const user = flags.userId ? yield this.getAssignee(flags.userId) : yield this.getOwner();
                // Make sure the settings exist
                yield n8n_core_1.UserSettings.prepareUserSettings();
                const credentials = yield src_1.Db.collections.Credentials.find();
                const tags = yield src_1.Db.collections.Tag.find();
                let totalImported = 0;
                if (flags.separate) {
                    let { input: inputPath } = flags;
                    if (process.platform === 'win32') {
                        inputPath = inputPath.replace(/\\/g, '/');
                    }
                    inputPath = inputPath.replace(/\/$/g, '');
                    const files = yield (0, fast_glob_1.default)(`${inputPath}/*.json`);
                    totalImported = files.length;
                    yield (0, typeorm_1.getConnection)().transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                        this.transactionManager = transactionManager;
                        for (const file of files) {
                            const workflow = JSON.parse(fs_1.default.readFileSync(file, { encoding: 'utf8' }));
                            if (credentials.length > 0) {
                                workflow.nodes.forEach((node) => {
                                    this.transformCredentials(node, credentials);
                                });
                            }
                            if (Object.prototype.hasOwnProperty.call(workflow, 'tags')) {
                                yield (0, TagHelpers_1.setTagsForImport)(transactionManager, workflow, tags);
                            }
                            yield this.storeWorkflow(workflow, user);
                        }
                    }));
                    this.reportSuccess(totalImported);
                    process.exit();
                }
                const workflows = JSON.parse(fs_1.default.readFileSync(flags.input, { encoding: 'utf8' }));
                assertHasWorkflowsToImport(workflows);
                totalImported = workflows.length;
                yield (0, typeorm_1.getConnection)().transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                    this.transactionManager = transactionManager;
                    for (const workflow of workflows) {
                        if (credentials.length > 0) {
                            workflow.nodes.forEach((node) => {
                                this.transformCredentials(node, credentials);
                            });
                        }
                        if (Object.prototype.hasOwnProperty.call(workflow, 'tags')) {
                            yield (0, TagHelpers_1.setTagsForImport)(transactionManager, workflow, tags);
                        }
                        yield this.storeWorkflow(workflow, user);
                    }
                }));
                this.reportSuccess(totalImported);
                process.exit();
            }
            catch (error) {
                console.error('An error occurred while importing workflows. See log messages for details.');
                if (error instanceof Error)
                    logger.error(error.message);
                this.exit(1);
            }
        });
    }
    reportSuccess(total) {
        console.info(`Successfully imported ${total} ${total === 1 ? 'workflow.' : 'workflows.'}`);
    }
    initOwnerWorkflowRole() {
        return __awaiter(this, void 0, void 0, function* () {
            const ownerWorkflowRole = yield src_1.Db.collections.Role.findOne({
                where: { name: 'owner', scope: 'workflow' },
            });
            if (!ownerWorkflowRole) {
                throw new Error(`Failed to find owner workflow role. ${FIX_INSTRUCTION}`);
            }
            this.ownerWorkflowRole = ownerWorkflowRole;
        });
    }
    storeWorkflow(workflow, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newWorkflow = new WorkflowEntity_1.WorkflowEntity();
            Object.assign(newWorkflow, workflow);
            const savedWorkflow = yield this.transactionManager.save(newWorkflow);
            const newSharedWorkflow = new SharedWorkflow_1.SharedWorkflow();
            Object.assign(newSharedWorkflow, {
                workflow: savedWorkflow,
                user,
                role: this.ownerWorkflowRole,
            });
            yield this.transactionManager.save(newSharedWorkflow);
        });
    }
    getOwner() {
        return __awaiter(this, void 0, void 0, function* () {
            const ownerGlobalRole = yield src_1.Db.collections.Role.findOne({
                where: { name: 'owner', scope: 'global' },
            });
            const owner = yield src_1.Db.collections.User.findOne({ globalRole: ownerGlobalRole });
            if (!owner) {
                throw new Error(`Failed to find owner. ${FIX_INSTRUCTION}`);
            }
            return owner;
        });
    }
    getAssignee(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield src_1.Db.collections.User.findOne(userId);
            if (!user) {
                throw new Error(`Failed to find user with ID ${userId}`);
            }
            return user;
        });
    }
    transformCredentials(node, credentialsEntities) {
        if (node.credentials) {
            const allNodeCredentials = Object.entries(node.credentials);
            for (const [type, name] of allNodeCredentials) {
                if (typeof name === 'string') {
                    const nodeCredentials = {
                        id: null,
                        name,
                    };
                    const matchingCredentials = credentialsEntities.filter((credentials) => credentials.name === name && credentials.type === type);
                    if (matchingCredentials.length === 1) {
                        nodeCredentials.id = matchingCredentials[0].id.toString();
                    }
                    // eslint-disable-next-line no-param-reassign
                    node.credentials[type] = nodeCredentials;
                }
            }
        }
    }
}
exports.ImportWorkflowsCommand = ImportWorkflowsCommand;
ImportWorkflowsCommand.description = 'Import workflows';
ImportWorkflowsCommand.examples = [
    '$ n8n import:workflow --input=file.json',
    '$ n8n import:workflow --separate --input=backups/latest/',
    '$ n8n import:workflow --input=file.json --userId=1d64c3d2-85fe-4a83-a649-e446b07b3aae',
    '$ n8n import:workflow --separate --input=backups/latest/ --userId=1d64c3d2-85fe-4a83-a649-e446b07b3aae',
];
ImportWorkflowsCommand.flags = {
    help: command_1.flags.help({ char: 'h' }),
    input: command_1.flags.string({
        char: 'i',
        description: 'Input file name or directory if --separate is used',
    }),
    separate: command_1.flags.boolean({
        description: 'Imports *.json files from directory provided by --input',
    }),
    userId: command_1.flags.string({
        description: 'The ID of the user to assign the imported workflows to',
    }),
};
