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
exports.BinaryDataManager = void 0;
const Constants_1 = require("../Constants");
const FileSystem_1 = require("./FileSystem");
class BinaryDataManager {
    constructor(config) {
        this.binaryDataMode = config.mode;
        this.availableModes = config.availableModes.split(',');
        this.managers = {};
    }
    static init(config, mainManager = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (BinaryDataManager.instance) {
                throw new Error('Binary Data Manager already initialized');
            }
            BinaryDataManager.instance = new BinaryDataManager(config);
            if (BinaryDataManager.instance.availableModes.includes('filesystem')) {
                BinaryDataManager.instance.managers.filesystem = new FileSystem_1.BinaryDataFileSystem(config);
                yield BinaryDataManager.instance.managers.filesystem.init(mainManager);
            }
            return undefined;
        });
    }
    static getInstance() {
        if (!BinaryDataManager.instance) {
            throw new Error('Binary Data Manager not initialized');
        }
        return BinaryDataManager.instance;
    }
    storeBinaryData(binaryData, binaryBuffer, executionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const retBinaryData = binaryData;
            if (this.managers[this.binaryDataMode]) {
                return this.managers[this.binaryDataMode]
                    .storeBinaryData(binaryBuffer, executionId)
                    .then((filename) => {
                    retBinaryData.id = this.generateBinaryId(filename);
                    return retBinaryData;
                });
            }
            retBinaryData.data = binaryBuffer.toString(Constants_1.BINARY_ENCODING);
            return binaryData;
        });
    }
    retrieveBinaryData(binaryData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (binaryData.id) {
                return this.retrieveBinaryDataByIdentifier(binaryData.id);
            }
            return Buffer.from(binaryData.data, Constants_1.BINARY_ENCODING);
        });
    }
    retrieveBinaryDataByIdentifier(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const { mode, id } = this.splitBinaryModeFileId(identifier);
            if (this.managers[mode]) {
                return this.managers[mode].retrieveBinaryDataByIdentifier(id);
            }
            throw new Error('Storage mode used to store binary data not available');
        });
    }
    markDataForDeletionByExecutionId(executionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.managers[this.binaryDataMode]) {
                return this.managers[this.binaryDataMode].markDataForDeletionByExecutionId(executionId);
            }
            return Promise.resolve();
        });
    }
    persistBinaryDataForExecutionId(executionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.managers[this.binaryDataMode]) {
                return this.managers[this.binaryDataMode].persistBinaryDataForExecutionId(executionId);
            }
            return Promise.resolve();
        });
    }
    deleteBinaryDataByExecutionId(executionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.managers[this.binaryDataMode]) {
                return this.managers[this.binaryDataMode].deleteBinaryDataByExecutionId(executionId);
            }
            return Promise.resolve();
        });
    }
    duplicateBinaryData(inputData, executionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (inputData && this.managers[this.binaryDataMode]) {
                const returnInputData = inputData.map((executionDataArray) => __awaiter(this, void 0, void 0, function* () {
                    if (executionDataArray) {
                        return Promise.all(executionDataArray.map((executionData) => {
                            if (executionData.binary) {
                                return this.duplicateBinaryDataInExecData(executionData, executionId);
                            }
                            return executionData;
                        }));
                    }
                    return executionDataArray;
                }));
                return Promise.all(returnInputData);
            }
            return Promise.resolve(inputData);
        });
    }
    generateBinaryId(filename) {
        return `${this.binaryDataMode}:${filename}`;
    }
    splitBinaryModeFileId(fileId) {
        const [mode, id] = fileId.split(':');
        return { mode, id };
    }
    duplicateBinaryDataInExecData(executionData, executionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const binaryManager = this.managers[this.binaryDataMode];
            if (executionData.binary) {
                const binaryDataKeys = Object.keys(executionData.binary);
                const bdPromises = binaryDataKeys.map((key) => __awaiter(this, void 0, void 0, function* () {
                    if (!executionData.binary) {
                        return { key, newId: undefined };
                    }
                    const binaryDataId = executionData.binary[key].id;
                    if (!binaryDataId) {
                        return { key, newId: undefined };
                    }
                    return binaryManager === null || binaryManager === void 0 ? void 0 : binaryManager.duplicateBinaryDataByIdentifier(this.splitBinaryModeFileId(binaryDataId).id, executionId).then((filename) => ({
                        newId: this.generateBinaryId(filename),
                        key,
                    }));
                }));
                return Promise.all(bdPromises).then((b) => {
                    return b.reduce((acc, curr) => {
                        if (acc.binary && curr) {
                            acc.binary[curr.key].id = curr.newId;
                        }
                        return acc;
                    }, executionData);
                });
            }
            return executionData;
        });
    }
}
exports.BinaryDataManager = BinaryDataManager;
