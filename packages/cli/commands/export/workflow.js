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
exports.ExportWorkflowsCommand = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-console */
const command_1 = require("@oclif/command");
const n8n_workflow_1 = require("n8n-workflow");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Logger_1 = require("../../src/Logger");
const src_1 = require("../../src");
class ExportWorkflowsCommand extends command_1.Command {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = (0, Logger_1.getLogger)();
            n8n_workflow_1.LoggerProxy.init(logger);
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const { flags } = this.parse(ExportWorkflowsCommand);
            if (flags.backup) {
                flags.all = true;
                flags.pretty = true;
                flags.separate = true;
            }
            if (!flags.all && !flags.id) {
                console.info(`Either option "--all" or "--id" have to be set!`);
                return;
            }
            if (flags.all && flags.id) {
                console.info(`You should either use "--all" or "--id" but never both!`);
                return;
            }
            if (flags.separate) {
                try {
                    if (!flags.output) {
                        console.info(`You must inform an output directory via --output when using --separate`);
                        return;
                    }
                    if (fs_1.default.existsSync(flags.output)) {
                        if (!fs_1.default.lstatSync(flags.output).isDirectory()) {
                            console.info(`The paramenter --output must be a directory`);
                            return;
                        }
                    }
                    else {
                        fs_1.default.mkdirSync(flags.output, { recursive: true });
                    }
                }
                catch (e) {
                    console.error('Aborting execution as a filesystem error has been encountered while creating the output directory. See log messages for details.');
                    logger.error('\nFILESYSTEM ERROR');
                    logger.info('====================================');
                    logger.error(e.message);
                    logger.error(e.stack);
                    this.exit(1);
                }
            }
            else if (flags.output) {
                if (fs_1.default.existsSync(flags.output)) {
                    if (fs_1.default.lstatSync(flags.output).isDirectory()) {
                        console.info(`The paramenter --output must be a writeble file`);
                        return;
                    }
                }
            }
            try {
                yield src_1.Db.init();
                const findQuery = {};
                if (flags.id) {
                    findQuery.id = flags.id;
                }
                const workflows = yield src_1.Db.collections.Workflow.find({
                    where: findQuery,
                    relations: ['tags'],
                });
                if (workflows.length === 0) {
                    throw new Error('No workflows found with specified filters.');
                }
                if (flags.separate) {
                    let fileContents;
                    let i;
                    for (i = 0; i < workflows.length; i++) {
                        fileContents = JSON.stringify(workflows[i], null, flags.pretty ? 2 : undefined);
                        const filename = `${
                        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-non-null-assertion
                        (flags.output.endsWith(path_1.default.sep) ? flags.output : flags.output + path_1.default.sep) +
                            workflows[i].id}.json`;
                        fs_1.default.writeFileSync(filename, fileContents);
                    }
                    console.info(`Successfully exported ${i} workflows.`);
                }
                else {
                    const fileContents = JSON.stringify(workflows, null, flags.pretty ? 2 : undefined);
                    if (flags.output) {
                        fs_1.default.writeFileSync(flags.output, fileContents);
                        console.info(`Successfully exported ${workflows.length} ${workflows.length === 1 ? 'workflow.' : 'workflows.'}`);
                    }
                    else {
                        console.info(fileContents);
                    }
                }
                // Force exit as process won't exit using MySQL or Postgres.
                process.exit(0);
            }
            catch (error) {
                console.error('Error exporting workflows. See log messages for details.');
                logger.error(error.message);
                this.exit(1);
            }
        });
    }
}
exports.ExportWorkflowsCommand = ExportWorkflowsCommand;
ExportWorkflowsCommand.description = 'Export workflows';
ExportWorkflowsCommand.examples = [
    `$ n8n export:workflow --all`,
    `$ n8n export:workflow --id=5 --output=file.json`,
    `$ n8n export:workflow --all --output=backups/latest/`,
    `$ n8n export:workflow --backup --output=backups/latest/`,
];
ExportWorkflowsCommand.flags = {
    help: command_1.flags.help({ char: 'h' }),
    all: command_1.flags.boolean({
        description: 'Export all workflows',
    }),
    backup: command_1.flags.boolean({
        description: 'Sets --all --pretty --separate for simple backups. Only --output has to be set additionally.',
    }),
    id: command_1.flags.string({
        description: 'The ID of the workflow to export',
    }),
    output: command_1.flags.string({
        char: 'o',
        description: 'Output file name or directory if using separate files',
    }),
    pretty: command_1.flags.boolean({
        description: 'Format the output in an easier to read fashion',
    }),
    separate: command_1.flags.boolean({
        description: 'Exports one file per workflow (useful for versioning). Must inform a directory via --output.',
    }),
};
