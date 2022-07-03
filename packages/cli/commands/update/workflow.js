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
exports.UpdateWorkflowCommand = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-console */
const command_1 = require("@oclif/command");
const n8n_workflow_1 = require("n8n-workflow");
const src_1 = require("../../src");
const Logger_1 = require("../../src/Logger");
class UpdateWorkflowCommand extends command_1.Command {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = (0, Logger_1.getLogger)();
            n8n_workflow_1.LoggerProxy.init(logger);
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const { flags } = this.parse(UpdateWorkflowCommand);
            if (!flags.all && !flags.id) {
                console.info(`Either option "--all" or "--id" have to be set!`);
                return;
            }
            if (flags.all && flags.id) {
                console.info(`Either something else on top should be "--all" or "--id" can be set never both!`);
                return;
            }
            const updateQuery = {};
            if (flags.active === undefined) {
                console.info(`No update flag like "--active=true" has been set!`);
                return;
            }
            if (!['false', 'true'].includes(flags.active)) {
                console.info(`Valid values for flag "--active" are only "false" or "true"!`);
                return;
            }
            updateQuery.active = flags.active === 'true';
            try {
                yield src_1.Db.init();
                const findQuery = {};
                if (flags.id) {
                    console.info(`Deactivating workflow with ID: ${flags.id}`);
                    findQuery.id = flags.id;
                }
                else {
                    console.info('Deactivating all workflows');
                    findQuery.active = true;
                }
                yield src_1.Db.collections.Workflow.update(findQuery, updateQuery);
                console.info('Done');
            }
            catch (e) {
                console.error('Error updating database. See log messages for details.');
                logger.error('\nGOT ERROR');
                logger.info('====================================');
                logger.error(e.message);
                logger.error(e.stack);
                this.exit(1);
            }
            this.exit();
        });
    }
}
exports.UpdateWorkflowCommand = UpdateWorkflowCommand;
UpdateWorkflowCommand.description = 'Update workflows';
UpdateWorkflowCommand.examples = [
    `$ n8n update:workflow --all --active=false`,
    `$ n8n update:workflow --id=5 --active=true`,
];
UpdateWorkflowCommand.flags = {
    help: command_1.flags.help({ char: 'h' }),
    active: command_1.flags.string({
        description: 'Active state the workflow/s should be set to',
    }),
    all: command_1.flags.boolean({
        description: 'Operate on all workflows',
    }),
    id: command_1.flags.string({
        description: 'The ID of the workflow to operate on',
    }),
};
