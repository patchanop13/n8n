"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomName = exports.randomEmail = exports.randomInvalidPassword = exports.randomValidPassword = exports.randomApiKey = exports.randomString = void 0;
const crypto_1 = require("crypto");
const User_1 = require("../../../src/databases/entities/User");
/**
 * Create a random alphanumeric string of random length between two limits, both inclusive.
 * Limits should be even numbers (round down otherwise).
 */
function randomString(min, max) {
    const randomInteger = Math.floor(Math.random() * (max - min) + min) + 1;
    return (0, crypto_1.randomBytes)(randomInteger / 2).toString('hex');
}
exports.randomString = randomString;
function randomApiKey() {
    return `n8n_api_${(0, crypto_1.randomBytes)(20).toString('hex')}`;
}
exports.randomApiKey = randomApiKey;
const chooseRandomly = (array) => array[Math.floor(Math.random() * array.length)];
const randomDigit = () => Math.floor(Math.random() * 10);
const randomUppercaseLetter = () => chooseRandomly('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
const randomValidPassword = () => randomString(User_1.MIN_PASSWORD_LENGTH, User_1.MAX_PASSWORD_LENGTH - 2) +
    randomUppercaseLetter() +
    randomDigit();
exports.randomValidPassword = randomValidPassword;
const randomInvalidPassword = () => chooseRandomly([
    randomString(1, User_1.MIN_PASSWORD_LENGTH - 1),
    randomString(User_1.MAX_PASSWORD_LENGTH + 2, User_1.MAX_PASSWORD_LENGTH + 100),
    'abcdefgh',
    'abcdefg1',
    'abcdefgA',
    'abcdefA',
    'abcdef1',
    'abcdeA1',
    'abcdefg', // invalid length, no number, no uppercase
]);
exports.randomInvalidPassword = randomInvalidPassword;
const randomEmail = () => `${(0, exports.randomName)()}@${(0, exports.randomName)()}.${randomTopLevelDomain()}`;
exports.randomEmail = randomEmail;
const POPULAR_TOP_LEVEL_DOMAINS = ['com', 'org', 'net', 'io', 'edu'];
const randomTopLevelDomain = () => chooseRandomly(POPULAR_TOP_LEVEL_DOMAINS);
const randomName = () => randomString(4, 8);
exports.randomName = randomName;
