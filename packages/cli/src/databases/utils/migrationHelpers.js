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
exports.runChunked = exports.chunkQuery = exports.logMigrationEnd = exports.logMigrationStart = exports.loadSurveyFromDisk = void 0;
/* eslint-disable no-await-in-loop */
const fs_1 = require("fs");
const n8n_core_1 = require("n8n-core");
const Logger_1 = require("../../Logger");
const PERSONALIZATION_SURVEY_FILENAME = 'personalizationSurvey.json';
function loadSurveyFromDisk() {
    const userSettingsPath = n8n_core_1.UserSettings.getUserN8nFolderPath();
    try {
        const filename = `${userSettingsPath}/${PERSONALIZATION_SURVEY_FILENAME}`;
        const surveyFile = (0, fs_1.readFileSync)(filename, 'utf-8');
        (0, fs_1.rmSync)(filename);
        const personalizationSurvey = JSON.parse(surveyFile);
        const kvPairs = Object.entries(personalizationSurvey);
        if (!kvPairs.length) {
            throw new Error('personalizationSurvey is empty');
        }
        else {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const emptyKeys = kvPairs.reduce((acc, [_key, value]) => {
                if (!value || (Array.isArray(value) && !value.length)) {
                    return acc + 1;
                }
                return acc;
            }, 0);
            if (emptyKeys === kvPairs.length) {
                throw new Error('incomplete personalizationSurvey');
            }
        }
        return surveyFile;
    }
    catch (error) {
        return null;
    }
}
exports.loadSurveyFromDisk = loadSurveyFromDisk;
let logFinishTimeout;
const disableLogging = process.argv[1].split('/').includes('jest');
function logMigrationStart(migrationName) {
    if (disableLogging)
        return;
    const logger = (0, Logger_1.getLogger)();
    if (!logFinishTimeout) {
        logger.warn('Migrations in progress, please do NOT stop the process.');
    }
    logger.debug(`Starting migration ${migrationName}`);
    clearTimeout(logFinishTimeout);
}
exports.logMigrationStart = logMigrationStart;
function logMigrationEnd(migrationName) {
    if (disableLogging)
        return;
    const logger = (0, Logger_1.getLogger)();
    logger.debug(`Finished migration ${migrationName}`);
    logFinishTimeout = setTimeout(() => {
        logger.warn('Migrations finished.');
    }, 100);
}
exports.logMigrationEnd = logMigrationEnd;
function chunkQuery(query, limit, offset = 0) {
    return `
			${query}
			LIMIT ${limit}
			OFFSET ${offset}
		`;
}
exports.chunkQuery = chunkQuery;
function runChunked(queryRunner, query, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
operation, limit = 100) {
    return __awaiter(this, void 0, void 0, function* () {
        let offset = 0;
        let chunkedQuery;
        let chunkedQueryResults;
        do {
            chunkedQuery = chunkQuery(query, limit, offset);
            chunkedQueryResults = (yield queryRunner.query(chunkedQuery));
            // pass a copy to prevent errors from mutation
            yield operation([...chunkedQueryResults]);
            offset += limit;
        } while (chunkedQueryResults.length === limit);
    });
}
exports.runChunked = runChunked;
