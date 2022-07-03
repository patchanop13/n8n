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
exports.BinaryDataFileSystem = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const PREFIX_METAFILE = 'binarymeta';
const PREFIX_PERSISTED_METAFILE = 'persistedmeta';
class BinaryDataFileSystem {
    constructor(config) {
        this.storagePath = config.localStoragePath;
        this.binaryDataTTL = config.binaryDataTTL;
        this.persistedBinaryDataTTL = config.persistedBinaryDataTTL;
    }
    init(startPurger = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (startPurger) {
                setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    yield this.deleteMarkedFiles();
                }), this.binaryDataTTL * 30000);
                setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    yield this.deleteMarkedPersistedFiles();
                }), this.persistedBinaryDataTTL * 30000);
            }
            return fs_1.promises
                .readdir(this.storagePath)
                .catch(() => __awaiter(this, void 0, void 0, function* () { return fs_1.promises.mkdir(this.storagePath, { recursive: true }); }))
                .then(() => __awaiter(this, void 0, void 0, function* () { return fs_1.promises.readdir(this.getBinaryDataMetaPath()); }))
                .catch(() => __awaiter(this, void 0, void 0, function* () { return fs_1.promises.mkdir(this.getBinaryDataMetaPath(), { recursive: true }); }))
                .then(() => __awaiter(this, void 0, void 0, function* () { return fs_1.promises.readdir(this.getBinaryDataPersistMetaPath()); }))
                .catch(() => __awaiter(this, void 0, void 0, function* () { return fs_1.promises.mkdir(this.getBinaryDataPersistMetaPath(), { recursive: true }); }))
                .then(() => __awaiter(this, void 0, void 0, function* () { return this.deleteMarkedFiles(); }))
                .then(() => __awaiter(this, void 0, void 0, function* () { return this.deleteMarkedPersistedFiles(); }))
                .then(() => { });
        });
    }
    storeBinaryData(binaryBuffer, executionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const binaryDataId = this.generateFileName(executionId);
            return this.addBinaryIdToPersistMeta(executionId, binaryDataId).then(() => __awaiter(this, void 0, void 0, function* () { return this.saveToLocalStorage(binaryBuffer, binaryDataId).then(() => binaryDataId); }));
        });
    }
    retrieveBinaryDataByIdentifier(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.retrieveFromLocalStorage(identifier);
        });
    }
    markDataForDeletionByExecutionId(executionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tt = new Date(new Date().getTime() + this.binaryDataTTL * 60000);
            return fs_1.promises.writeFile(path_1.default.join(this.getBinaryDataMetaPath(), `${PREFIX_METAFILE}_${executionId}_${tt.valueOf()}`), '');
        });
    }
    deleteMarkedFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.deleteMarkedFilesByMeta(this.getBinaryDataMetaPath(), PREFIX_METAFILE);
        });
    }
    deleteMarkedPersistedFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.deleteMarkedFilesByMeta(this.getBinaryDataPersistMetaPath(), PREFIX_PERSISTED_METAFILE);
        });
    }
    addBinaryIdToPersistMeta(executionId, identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTime = new Date().getTime();
            const timeAtNextHour = currentTime + 3600000 - (currentTime % 3600000);
            const timeoutTime = timeAtNextHour + this.persistedBinaryDataTTL * 60000;
            const filePath = path_1.default.join(this.getBinaryDataPersistMetaPath(), `${PREFIX_PERSISTED_METAFILE}_${executionId}_${timeoutTime}`);
            return fs_1.promises
                .readFile(filePath)
                .catch(() => __awaiter(this, void 0, void 0, function* () { return fs_1.promises.writeFile(filePath, identifier); }))
                .then(() => { });
        });
    }
    deleteMarkedFilesByMeta(metaPath, filePrefix) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTimeValue = new Date().valueOf();
            const metaFileNames = yield fs_1.promises.readdir(metaPath);
            const execsAdded = {};
            const proms = metaFileNames.reduce((prev, curr) => {
                const [prefix, executionId, ts] = curr.split('_');
                if (prefix !== filePrefix) {
                    return prev;
                }
                const execTimestamp = parseInt(ts, 10);
                if (execTimestamp < currentTimeValue) {
                    if (execsAdded[executionId]) {
                        // do not delete data, only meta file
                        prev.push(this.deleteMetaFileByPath(path_1.default.join(metaPath, curr)));
                        return prev;
                    }
                    execsAdded[executionId] = 1;
                    prev.push(this.deleteBinaryDataByExecutionId(executionId).then(() => __awaiter(this, void 0, void 0, function* () { return this.deleteMetaFileByPath(path_1.default.join(metaPath, curr)); })));
                }
                return prev;
            }, [Promise.resolve()]);
            return Promise.all(proms).then(() => { });
        });
    }
    duplicateBinaryDataByIdentifier(binaryDataId, prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBinaryDataId = this.generateFileName(prefix);
            return fs_1.promises
                .copyFile(path_1.default.join(this.storagePath, binaryDataId), path_1.default.join(this.storagePath, newBinaryDataId))
                .then(() => newBinaryDataId);
        });
    }
    deleteBinaryDataByExecutionId(executionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const regex = new RegExp(`${executionId}_*`);
            const filenames = yield fs_1.promises.readdir(path_1.default.join(this.storagePath));
            const proms = filenames.reduce((allProms, filename) => {
                if (regex.test(filename)) {
                    allProms.push(fs_1.promises.rm(path_1.default.join(this.storagePath, filename)));
                }
                return allProms;
            }, [Promise.resolve()]);
            return Promise.all(proms).then(() => __awaiter(this, void 0, void 0, function* () { return Promise.resolve(); }));
        });
    }
    deleteBinaryDataByIdentifier(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.deleteFromLocalStorage(identifier);
        });
    }
    persistBinaryDataForExecutionId(executionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return fs_1.promises.readdir(this.getBinaryDataPersistMetaPath()).then((metafiles) => __awaiter(this, void 0, void 0, function* () {
                const proms = metafiles.reduce((prev, curr) => {
                    if (curr.startsWith(`${PREFIX_PERSISTED_METAFILE}_${executionId}_`)) {
                        prev.push(fs_1.promises.rm(path_1.default.join(this.getBinaryDataPersistMetaPath(), curr)));
                        return prev;
                    }
                    return prev;
                }, [Promise.resolve()]);
                return Promise.all(proms).then(() => { });
            }));
        });
    }
    generateFileName(prefix) {
        return `${prefix}_${(0, uuid_1.v4)()}`;
    }
    getBinaryDataMetaPath() {
        return path_1.default.join(this.storagePath, 'meta');
    }
    getBinaryDataPersistMetaPath() {
        return path_1.default.join(this.storagePath, 'persistMeta');
    }
    deleteMetaFileByPath(metafilePath) {
        return __awaiter(this, void 0, void 0, function* () {
            return fs_1.promises.rm(metafilePath);
        });
    }
    deleteFromLocalStorage(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            return fs_1.promises.rm(path_1.default.join(this.storagePath, identifier));
        });
    }
    saveToLocalStorage(data, identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs_1.promises.writeFile(path_1.default.join(this.storagePath, identifier), data);
        });
    }
    retrieveFromLocalStorage(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path_1.default.join(this.storagePath, identifier);
            try {
                return yield fs_1.promises.readFile(filePath);
            }
            catch (e) {
                throw new Error(`Error finding file: ${filePath}`);
            }
        });
    }
}
exports.BinaryDataFileSystem = BinaryDataFileSystem;
