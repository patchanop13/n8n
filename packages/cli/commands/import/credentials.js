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
exports.ImportCredentialsCommand = void 0;
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-console */
const command_1 = require("@oclif/command");
const n8n_core_1 = require("n8n-core");
const n8n_workflow_1 = require("n8n-workflow");
const fs_1 = __importDefault(require("fs"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const path_1 = __importDefault(require("path"));
const typeorm_1 = require("typeorm");
const Logger_1 = require("../../src/Logger");
const src_1 = require("../../src");
const SharedCredentials_1 = require("../../src/databases/entities/SharedCredentials");
const CredentialsEntity_1 = require("../../src/databases/entities/CredentialsEntity");
const FIX_INSTRUCTION = 'Please fix the database by running ./packages/cli/bin/n8n user-management:reset';
class ImportCredentialsCommand extends command_1.Command {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = (0, Logger_1.getLogger)();
            n8n_workflow_1.LoggerProxy.init(logger);
            const { flags } = this.parse(ImportCredentialsCommand);
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
            let totalImported = 0;
            try {
                yield src_1.Db.init();
                yield this.initOwnerCredentialRole();
                const user = flags.userId ? yield this.getAssignee(flags.userId) : yield this.getOwner();
                // Make sure the settings exist
                yield n8n_core_1.UserSettings.prepareUserSettings();
                const encryptionKey = yield n8n_core_1.UserSettings.getEncryptionKey();
                if (flags.separate) {
                    const files = yield (0, fast_glob_1.default)(`${flags.input.endsWith(path_1.default.sep) ? flags.input : flags.input + path_1.default.sep}*.json`);
                    totalImported = files.length;
                    yield (0, typeorm_1.getConnection)().transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                        this.transactionManager = transactionManager;
                        for (const file of files) {
                            const credential = JSON.parse(fs_1.default.readFileSync(file, { encoding: 'utf8' }));
                            if (typeof credential.data === 'object') {
                                // plain data / decrypted input. Should be encrypted first.
                                n8n_core_1.Credentials.prototype.setData.call(credential, credential.data, encryptionKey);
                            }
                            yield this.storeCredential(credential, user);
                        }
                    }));
                    this.reportSuccess(totalImported);
                    process.exit();
                }
                const credentials = JSON.parse(fs_1.default.readFileSync(flags.input, { encoding: 'utf8' }));
                totalImported = credentials.length;
                if (!Array.isArray(credentials)) {
                    throw new Error('File does not seem to contain credentials. Make sure the credentials are contained in an array.');
                }
                yield (0, typeorm_1.getConnection)().transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                    this.transactionManager = transactionManager;
                    for (const credential of credentials) {
                        if (typeof credential.data === 'object') {
                            // plain data / decrypted input. Should be encrypted first.
                            n8n_core_1.Credentials.prototype.setData.call(credential, credential.data, encryptionKey);
                        }
                        yield this.storeCredential(credential, user);
                    }
                }));
                this.reportSuccess(totalImported);
                process.exit();
            }
            catch (error) {
                console.error('An error occurred while importing credentials. See log messages for details.');
                if (error instanceof Error)
                    logger.error(error.message);
                this.exit(1);
            }
        });
    }
    reportSuccess(total) {
        console.info(`Successfully imported ${total} ${total === 1 ? 'credential.' : 'credentials.'}`);
    }
    initOwnerCredentialRole() {
        return __awaiter(this, void 0, void 0, function* () {
            const ownerCredentialRole = yield src_1.Db.collections.Role.findOne({
                where: { name: 'owner', scope: 'credential' },
            });
            if (!ownerCredentialRole) {
                throw new Error(`Failed to find owner credential role. ${FIX_INSTRUCTION}`);
            }
            this.ownerCredentialRole = ownerCredentialRole;
        });
    }
    storeCredential(credential, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCredential = new CredentialsEntity_1.CredentialsEntity();
            Object.assign(newCredential, credential);
            const savedCredential = yield this.transactionManager.save(newCredential);
            const newSharedCredential = new SharedCredentials_1.SharedCredentials();
            Object.assign(newSharedCredential, {
                credentials: savedCredential,
                user,
                role: this.ownerCredentialRole,
            });
            yield this.transactionManager.save(newSharedCredential);
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
}
exports.ImportCredentialsCommand = ImportCredentialsCommand;
ImportCredentialsCommand.description = 'Import credentials';
ImportCredentialsCommand.examples = [
    '$ n8n import:credentials --input=file.json',
    '$ n8n import:credentials --separate --input=backups/latest/',
    '$ n8n import:credentials --input=file.json --userId=1d64c3d2-85fe-4a83-a649-e446b07b3aae',
    '$ n8n import:credentials --separate --input=backups/latest/ --userId=1d64c3d2-85fe-4a83-a649-e446b07b3aae',
];
ImportCredentialsCommand.flags = {
    help: command_1.flags.help({ char: 'h' }),
    input: command_1.flags.string({
        char: 'i',
        description: 'Input file name or directory if --separate is used',
    }),
    separate: command_1.flags.boolean({
        description: 'Imports *.json files from directory provided by --input',
    }),
    userId: command_1.flags.string({
        description: 'The ID of the user to assign the imported credentials to',
    }),
};
