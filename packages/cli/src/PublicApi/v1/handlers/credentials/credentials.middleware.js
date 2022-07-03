"use strict";
/* eslint-disable @typescript-eslint/no-invalid-void-type */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validCredentialsProperties = exports.validCredentialType = void 0;
const jsonschema_1 = require("jsonschema");
const __1 = require("../../../..");
const credentials_service_1 = require("./credentials.service");
const validCredentialType = (req, res, next) => {
    try {
        (0, __1.CredentialTypes)().getByName(req.body.type);
    }
    catch (_) {
        return res.status(400).json({ message: 'req.body.type is not a known type' });
    }
    return next();
};
exports.validCredentialType = validCredentialType;
const validCredentialsProperties = (req, res, next) => {
    const { type, data } = req.body;
    const properties = new __1.CredentialsHelper('')
        .getCredentialsProperties(type)
        .filter((property) => property.type !== 'hidden');
    const schema = (0, credentials_service_1.toJsonSchema)(properties);
    const { valid, errors } = (0, jsonschema_1.validate)(data, schema, { nestedErrors: true });
    if (!valid) {
        return res.status(400).json({
            message: errors.map((error) => `request.body.data ${error.message}`).join(','),
        });
    }
    return next();
};
exports.validCredentialsProperties = validCredentialsProperties;
