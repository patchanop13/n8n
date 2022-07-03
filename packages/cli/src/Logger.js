"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogger = exports.Logger = void 0;
const util_1 = require("util");
const winston_1 = __importDefault(require("winston"));
const callsites_1 = __importDefault(require("callsites"));
const path_1 = require("path");
const config_1 = __importDefault(require("../config"));
class Logger {
    constructor() {
        const level = config_1.default.getEnv('logs.level');
        const output = config_1.default
            .getEnv('logs.output')
            .split(',')
            .map((output) => output.trim());
        this.logger = winston_1.default.createLogger({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            level,
            silent: level === 'silent',
        });
        if (output.includes('console')) {
            let format;
            if (['debug', 'verbose'].includes(level)) {
                format = winston_1.default.format.combine(winston_1.default.format.metadata(), winston_1.default.format.timestamp(), winston_1.default.format.colorize({ all: true }), 
                // eslint-disable-next-line @typescript-eslint/no-shadow
                winston_1.default.format.printf(({ level, message, timestamp, metadata }) => {
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    return `${timestamp} | ${level.padEnd(18)} | ${message}${Object.keys(metadata).length ? ` ${JSON.stringify((0, util_1.inspect)(metadata))}` : ''}`;
                }));
            }
            else {
                format = winston_1.default.format.printf(({ message }) => message);
            }
            this.logger.add(new winston_1.default.transports.Console({
                format,
            }));
        }
        if (output.includes('file')) {
            const fileLogFormat = winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.metadata(), winston_1.default.format.json());
            this.logger.add(new winston_1.default.transports.File({
                filename: config_1.default.getEnv('logs.file.location'),
                format: fileLogFormat,
                maxsize: config_1.default.getEnv('logs.file.fileSizeMax') * 1048576,
                maxFiles: config_1.default.getEnv('logs.file.fileCountMax'),
            }));
        }
    }
    log(type, message, meta = {}) {
        const callsite = (0, callsites_1.default)();
        // We are using the third array element as the structure is as follows:
        // [0]: this file
        // [1]: Should be LoggerProxy
        // [2]: Should point to the caller.
        // Note: getting line number is useless because at this point
        // We are in runtime, so it means we are looking at compiled js files
        const logDetails = {};
        if (callsite[2] !== undefined) {
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            logDetails.file = (0, path_1.basename)(callsite[2].getFileName() || '');
            const functionName = callsite[2].getFunctionName();
            if (functionName) {
                logDetails.function = functionName;
            }
        }
        this.logger.log(type, message, Object.assign(Object.assign({}, meta), logDetails));
    }
    // Convenience methods below
    debug(message, meta = {}) {
        this.log('debug', message, meta);
    }
    info(message, meta = {}) {
        this.log('info', message, meta);
    }
    error(message, meta = {}) {
        this.log('error', message, meta);
    }
    verbose(message, meta = {}) {
        this.log('verbose', message, meta);
    }
    warn(message, meta = {}) {
        this.log('warn', message, meta);
    }
}
exports.Logger = Logger;
let activeLoggerInstance;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function getLogger() {
    if (activeLoggerInstance === undefined) {
        activeLoggerInstance = new Logger();
    }
    return activeLoggerInstance;
}
exports.getLogger = getLogger;
