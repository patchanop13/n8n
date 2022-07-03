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
exports.getCredentialTranslationPath = exports.getNodeTranslationPath = void 0;
const path_1 = require("path");
const promises_1 = require("fs/promises");
const ALLOWED_VERSIONED_DIRNAME_LENGTH = [2, 3]; // e.g. v1, v10
function isVersionedDirname(dirent) {
    if (!dirent.isDirectory())
        return false;
    return (ALLOWED_VERSIONED_DIRNAME_LENGTH.includes(dirent.name.length) &&
        dirent.name.toLowerCase().startsWith('v'));
}
function getMaxVersion(from) {
    return __awaiter(this, void 0, void 0, function* () {
        const entries = yield (0, promises_1.readdir)(from, { withFileTypes: true });
        const dirnames = entries.reduce((acc, cur) => {
            if (isVersionedDirname(cur))
                acc.push(cur.name);
            return acc;
        }, []);
        if (!dirnames.length)
            return null;
        return Math.max(...dirnames.map((d) => parseInt(d.charAt(1), 10)));
    });
}
/**
 * Get the full path to a node translation file in `/dist`.
 */
function getNodeTranslationPath({ nodeSourcePath, longNodeType, locale, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const nodeDir = (0, path_1.dirname)(nodeSourcePath);
        const maxVersion = yield getMaxVersion(nodeDir);
        const nodeType = longNodeType.replace('n8n-nodes-base.', '');
        return maxVersion
            ? (0, path_1.join)(nodeDir, `v${maxVersion}`, 'translations', locale, `${nodeType}.json`)
            : (0, path_1.join)(nodeDir, 'translations', locale, `${nodeType}.json`);
    });
}
exports.getNodeTranslationPath = getNodeTranslationPath;
/**
 * Get the full path to a credential translation file in `/dist`.
 */
function getCredentialTranslationPath({ locale, credentialType, }) {
    const packagesPath = (0, path_1.join)(__dirname, '..', '..', '..');
    const credsPath = (0, path_1.join)(packagesPath, 'nodes-base', 'dist', 'credentials');
    return (0, path_1.join)(credsPath, 'translations', locale, `${credentialType}.json`);
}
exports.getCredentialTranslationPath = getCredentialTranslationPath;
