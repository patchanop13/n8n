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
exports.buildFiles = exports.createCustomTsconfig = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const child_process_1 = require("child_process");
const promises_1 = require("fs/promises");
const fs_1 = require("fs");
const path_1 = require("path");
const tmp_promise_1 = require("tmp-promise");
const util_1 = require("util");
const n8n_core_1 = require("n8n-core");
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
const copyfiles = require('copyfiles');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fsReadFileAsync = (0, util_1.promisify)(promises_1.readFile);
const fsWriteAsync = (0, util_1.promisify)(fs_1.write);
/**
 * Create a custom tsconfig file as tsc currently has no way to define a base
 * directory:
 * https://github.com/Microsoft/TypeScript/issues/25430
 *
 * @export
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function createCustomTsconfig() {
    return __awaiter(this, void 0, void 0, function* () {
        // Get path to simple tsconfig file which should be used for build
        const tsconfigPath = (0, path_1.join)(__dirname, '../../src/tsconfig-build.json');
        // Read the tsconfi file
        const tsConfigString = yield (0, promises_1.readFile)(tsconfigPath, { encoding: 'utf8' });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const tsConfig = JSON.parse(tsConfigString);
        // Set absolute include paths
        const newIncludeFiles = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const includeFile of tsConfig.include) {
            newIncludeFiles.push((0, path_1.join)(process.cwd(), includeFile));
        }
        tsConfig.include = newIncludeFiles;
        // Write new custom tsconfig file
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { fd, path, cleanup } = yield (0, tmp_promise_1.file)();
        yield fsWriteAsync(fd, Buffer.from(JSON.stringify(tsConfig, null, 2), 'utf8'));
        return {
            path,
            cleanup,
        };
    });
}
exports.createCustomTsconfig = createCustomTsconfig;
/**
 * Builds and copies credentials and nodes
 *
 * @export
 * @param {IBuildOptions} [options] Options to overwrite default behaviour
 * @returns {Promise<string>}
 */
function buildFiles(options) {
    return __awaiter(this, void 0, void 0, function* () {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing, no-param-reassign
        options = options || {};
        let typescriptPath;
        // Check for OS to designate correct tsc path
        if (process.platform === 'win32') {
            typescriptPath = '../../node_modules/TypeScript/lib/tsc';
        }
        else {
            typescriptPath = '../../node_modules/.bin/tsc';
        }
        const tscPath = (0, path_1.join)(__dirname, typescriptPath);
        const tsconfigData = yield createCustomTsconfig();
        const outputDirectory = 
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        options.destinationFolder || n8n_core_1.UserSettings.getUserN8nFolderCustomExtensionPath();
        // Supply a node base path so that it finds n8n-core and n8n-workflow
        const nodeModulesPath = (0, path_1.join)(__dirname, '../../node_modules/');
        let buildCommand = `${tscPath} --p ${tsconfigData.path} --outDir ${outputDirectory} --rootDir ${process.cwd()} --baseUrl ${nodeModulesPath}`;
        if (options.watch === true) {
            buildCommand += ' --watch';
        }
        let buildProcess;
        try {
            buildProcess = (0, child_process_1.spawn)('node', buildCommand.split(' '), {
                windowsVerbatimArguments: true,
                cwd: process.cwd(),
            });
            // Forward the output of the child process to the main one
            // that the user can see what is happening
            // @ts-ignore
            buildProcess.stdout.pipe(process.stdout);
            // @ts-ignore
            buildProcess.stderr.pipe(process.stderr);
            // Make sure that the child process gets also always terminated
            // when the main process does
            process.on('exit', () => {
                buildProcess.kill();
            });
        }
        catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            let errorMessage = error.message;
            if (error.stdout !== undefined) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                errorMessage = `${errorMessage}\nGot following output:\n${error.stdout}`;
            }
            // Remove the tmp tsconfig file
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            tsconfigData.cleanup();
            throw new Error(errorMessage);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise((resolve, reject) => {
            ['*.png', '*.node.json'].forEach((filenamePattern) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                copyfiles([(0, path_1.join)(process.cwd(), `./${filenamePattern}`), outputDirectory], { up: true }, () => resolve(outputDirectory));
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            buildProcess.on('exit', (code) => {
                // Remove the tmp tsconfig file
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                tsconfigData.cleanup();
            });
        });
    });
}
exports.buildFiles = buildFiles;
