"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable no-console */
const convict_1 = __importDefault(require("convict"));
const dotenv_1 = __importDefault(require("dotenv"));
const schema_1 = require("./schema");
dotenv_1.default.config();
const config = (0, convict_1.default)(schema_1.schema);
config.getEnv = config.get;
// Overwrite default configuration with settings which got defined in
// optional configuration files
if (process.env.N8N_CONFIG_FILES !== undefined) {
    const configFiles = process.env.N8N_CONFIG_FILES.split(',');
    if (process.env.NODE_ENV !== 'test') {
        console.log(`\nLoading configuration overwrites from:\n - ${configFiles.join('\n - ')}\n`);
    }
    config.loadFile(configFiles);
}
config.validate({
    allowed: 'strict',
});
module.exports = config;
