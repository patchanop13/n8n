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
exports.DbRevertMigrationCommand = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-console */
const command_1 = require("@oclif/command");
const typeorm_1 = require("typeorm");
const n8n_workflow_1 = require("n8n-workflow");
const Logger_1 = require("../../src/Logger");
const src_1 = require("../../src");
class DbRevertMigrationCommand extends command_1.Command {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = (0, Logger_1.getLogger)();
            n8n_workflow_1.LoggerProxy.init(logger);
            // eslint-disable-next-line @typescript-eslint/no-shadow, @typescript-eslint/no-unused-vars
            const { flags } = this.parse(DbRevertMigrationCommand);
            let connection;
            try {
                yield src_1.Db.init();
                connection = src_1.Db.collections.Credentials.manager.connection;
                if (!connection) {
                    throw new Error(`No database connection available.`);
                }
                const connectionOptions = Object.assign(connection.options, {
                    subscribers: [],
                    synchronize: false,
                    migrationsRun: false,
                    dropSchema: false,
                    logging: ['query', 'error', 'schema'],
                });
                // close connection in order to reconnect with updated options
                yield connection.close();
                connection = yield (0, typeorm_1.createConnection)(connectionOptions);
                yield connection.undoLastMigration();
                yield connection.close();
            }
            catch (error) {
                if (connection)
                    yield connection.close();
                console.error('Error reverting last migration. See log messages for details.');
                logger.error(error.message);
                this.exit(1);
            }
            this.exit();
        });
    }
}
exports.DbRevertMigrationCommand = DbRevertMigrationCommand;
DbRevertMigrationCommand.description = 'Revert last database migration';
DbRevertMigrationCommand.examples = ['$ n8n db:revert'];
DbRevertMigrationCommand.flags = {
    help: command_1.flags.help({ char: 'h' }),
};
