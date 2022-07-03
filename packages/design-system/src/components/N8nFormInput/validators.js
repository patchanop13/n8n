"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidationError = exports.VALIDATORS = exports.emailRegex = void 0;
exports.emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
exports.VALIDATORS = {
    REQUIRED: {
        validate: (value) => {
            if (typeof value === 'string' && !!value.trim()) {
                return false;
            }
            if (typeof value === 'number' || typeof value === 'boolean') {
                return false;
            }
            return {
                messageKey: 'formInput.validator.fieldRequired',
            };
        },
    },
    MIN_LENGTH: {
        validate: (value, config) => {
            if (typeof value === 'string' && value.length < config.minimum) {
                return {
                    messageKey: 'formInput.validator.minCharactersRequired',
                    options: config,
                };
            }
            return false;
        },
    },
    MAX_LENGTH: {
        validate: (value, config) => {
            if (typeof value === 'string' && value.length > config.maximum) {
                return {
                    messageKey: 'formInput.validator.maxCharactersRequired',
                    options: config,
                };
            }
            return false;
        },
    },
    CONTAINS_NUMBER: {
        validate: (value, config) => {
            if (typeof value !== 'string') {
                return false;
            }
            const numberCount = (value.match(/\d/g) || []).length;
            if (numberCount < config.minimum) {
                return {
                    messageKey: 'formInput.validator.numbersRequired',
                    options: config,
                };
            }
            return false;
        },
    },
    VALID_EMAIL: {
        validate: (value) => {
            if (!exports.emailRegex.test(String(value).trim().toLowerCase())) {
                return {
                    messageKey: 'formInput.validator.validEmailRequired',
                };
            }
            return false;
        },
    },
    CONTAINS_UPPERCASE: {
        validate: (value, config) => {
            if (typeof value !== 'string') {
                return false;
            }
            const uppercaseCount = (value.match(/[A-Z]/g) || []).length;
            if (uppercaseCount < config.minimum) {
                return {
                    messageKey: 'formInput.validator.uppercaseCharsRequired',
                    options: config,
                };
            }
            return false;
        },
    },
    DEFAULT_PASSWORD_RULES: {
        rules: [
            {
                rules: [
                    { name: 'MIN_LENGTH', config: { minimum: 8 } },
                    { name: 'CONTAINS_NUMBER', config: { minimum: 1 } },
                    { name: 'CONTAINS_UPPERCASE', config: { minimum: 1 } },
                ],
                defaultError: {
                    messageKey: 'formInput.validator.defaultPasswordRequirements',
                },
            },
            { name: 'MAX_LENGTH', config: { maximum: 64 } },
        ],
    },
};
const getValidationError = (value, // tslint:disable-line:no-any
validators, validator, config) => {
    if (validator.hasOwnProperty('rules')) {
        const rules = validator.rules;
        for (let i = 0; i < rules.length; i++) {
            if (rules[i].hasOwnProperty('rules')) {
                const error = (0, exports.getValidationError)(value, validators, rules[i], config);
                if (error) {
                    return error;
                }
            }
            if (rules[i].hasOwnProperty('name')) {
                const rule = rules[i]; // tslint:disable-line:no-any
                if (!validators[rule.name]) {
                    continue;
                }
                const error = (0, exports.getValidationError)(value, validators, validators[rule.name], rule.config);
                if (error && validator.defaultError !== undefined) {
                    // @ts-ignore
                    return validator.defaultError;
                }
                else if (error) {
                    return error;
                }
            }
        }
    }
    else if (validator.hasOwnProperty('validate')) {
        return validator.validate(value, config);
    }
    return false;
};
exports.getValidationError = getValidationError;
