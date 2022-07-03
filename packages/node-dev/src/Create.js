"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.createTemplate = void 0;
const fs = __importStar(require("fs"));
const replace_in_file_1 = require("replace-in-file");
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
const { promisify } = require('util');
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const fsCopyFile = promisify(fs.copyFile);
/**
 * Creates a new credentials or node
 *
 * @export
 * @param {string} sourceFilePath The path to the source template file
 * @param {string} destinationFilePath The path the write the new file to
 * @param {object} replaceValues The values to replace in the template file
 * @returns {Promise<void>}
 */
function createTemplate(sourceFilePath, destinationFilePath, replaceValues) {
    return __awaiter(this, void 0, void 0, function* () {
        // Copy the file to then replace the values in it
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        yield fsCopyFile(sourceFilePath, destinationFilePath);
        // Replace the variables in the template file
        const options = {
            files: [destinationFilePath],
            from: [],
            to: [],
        };
        options.from = Object.keys(replaceValues).map((key) => {
            return new RegExp(key, 'g');
        });
        options.to = Object.values(replaceValues);
        yield (0, replace_in_file_1.replaceInFile)(options);
    });
}
exports.createTemplate = createTemplate;
