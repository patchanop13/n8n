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
exports.Build = void 0;
const n8n_core_1 = require("n8n-core");
const command_1 = require("@oclif/command");
const src_1 = require("../src");
class Build extends command_1.Command {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const { flags } = this.parse(Build);
            this.log('\nBuild credentials and nodes');
            this.log('=========================');
            try {
                const options = {};
                if (flags.destination) {
                    options.destinationFolder = flags.destination;
                }
                if (flags.watch) {
                    options.watch = true;
                }
                const outputDirectory = yield (0, src_1.buildFiles)(options);
                this.log(`The nodes got build and saved into the following folder:\n${outputDirectory}`);
            }
            catch (error) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
                this.log(`\nGOT ERROR: "${error.message}"`);
                this.log('====================================');
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
                this.log(error.stack);
            }
        });
    }
}
exports.Build = Build;
Build.description = 'Builds credentials and nodes and copies it to n8n custom extension folder';
Build.examples = [
    `$ n8n-node-dev build`,
    `$ n8n-node-dev build --destination ~/n8n-nodes`,
    `$ n8n-node-dev build --watch`,
];
Build.flags = {
    help: command_1.flags.help({ char: 'h' }),
    destination: command_1.flags.string({
        char: 'd',
        description: `The path to copy the compiles files to [default: ${n8n_core_1.UserSettings.getUserN8nFolderCustomExtensionPath()}]`,
    }),
    watch: command_1.flags.boolean({
        description: 'Starts in watch mode and automatically builds and copies file whenever they change',
    }),
};
