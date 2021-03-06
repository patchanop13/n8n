"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const TelemetryHelpers_1 = require("../src/TelemetryHelpers");
describe('getDomainBase should return protocol plus domain', () => {
    test('in valid URLs', () => {
        for (const url of validUrls(numericId)) {
            const { full, protocolPlusDomain } = url;
            expect((0, TelemetryHelpers_1.getDomainBase)(full)).toBe(protocolPlusDomain);
        }
    });
    test('in malformed URLs', () => {
        for (const url of malformedUrls(numericId)) {
            const { full, protocolPlusDomain } = url;
            expect((0, TelemetryHelpers_1.getDomainBase)(full)).toBe(protocolPlusDomain);
        }
    });
});
describe('getDomainPath should return pathname, excluding query string', () => {
    describe('anonymizing strings containing at least one number', () => {
        test('in valid URLs', () => {
            for (const url of validUrls(alphanumericId)) {
                const { full, pathname } = url;
                expect((0, TelemetryHelpers_1.getDomainPath)(full)).toBe(pathname);
            }
        });
        test('in malformed URLs', () => {
            for (const url of malformedUrls(alphanumericId)) {
                const { full, pathname } = url;
                expect((0, TelemetryHelpers_1.getDomainPath)(full)).toBe(pathname);
            }
        });
    });
    describe('anonymizing UUIDs', () => {
        test('in valid URLs', () => {
            for (const url of uuidUrls(validUrls)) {
                const { full, pathname } = url;
                expect((0, TelemetryHelpers_1.getDomainPath)(full)).toBe(pathname);
            }
        });
        test('in malformed URLs', () => {
            for (const url of uuidUrls(malformedUrls)) {
                const { full, pathname } = url;
                expect((0, TelemetryHelpers_1.getDomainPath)(full)).toBe(pathname);
            }
        });
    });
    describe('anonymizing emails', () => {
        test('in valid URLs', () => {
            for (const url of validUrls(email)) {
                const { full, pathname } = url;
                expect((0, TelemetryHelpers_1.getDomainPath)(full)).toBe(pathname);
            }
        });
        test('in malformed URLs', () => {
            for (const url of malformedUrls(email)) {
                const { full, pathname } = url;
                expect((0, TelemetryHelpers_1.getDomainPath)(full)).toBe(pathname);
            }
        });
    });
});
function validUrls(idMaker, char = TelemetryHelpers_1.ANONYMIZATION_CHARACTER) {
    const firstId = idMaker();
    const secondId = idMaker();
    const firstIdObscured = char.repeat(firstId.length);
    const secondIdObscured = char.repeat(secondId.length);
    return [
        {
            full: `https://test.com/api/v1/users/${firstId}`,
            protocolPlusDomain: 'https://test.com',
            pathname: `/api/v1/users/${firstIdObscured}`,
        },
        {
            full: `https://test.com/api/v1/users/${firstId}/`,
            protocolPlusDomain: 'https://test.com',
            pathname: `/api/v1/users/${firstIdObscured}/`,
        },
        {
            full: `https://test.com/api/v1/users/${firstId}/posts/${secondId}`,
            protocolPlusDomain: 'https://test.com',
            pathname: `/api/v1/users/${firstIdObscured}/posts/${secondIdObscured}`,
        },
        {
            full: `https://test.com/api/v1/users/${firstId}/posts/${secondId}/`,
            protocolPlusDomain: 'https://test.com',
            pathname: `/api/v1/users/${firstIdObscured}/posts/${secondIdObscured}/`,
        },
        {
            full: `https://test.com/api/v1/users/${firstId}/posts/${secondId}/`,
            protocolPlusDomain: 'https://test.com',
            pathname: `/api/v1/users/${firstIdObscured}/posts/${secondIdObscured}/`,
        },
        {
            full: `https://test.com/api/v1/users?id=${firstId}`,
            protocolPlusDomain: 'https://test.com',
            pathname: '/api/v1/users',
        },
        {
            full: `https://test.com/api/v1/users?id=${firstId}&post=${secondId}`,
            protocolPlusDomain: 'https://test.com',
            pathname: '/api/v1/users',
        },
        {
            full: `https://test.com/api/v1/users/${firstId}/posts/${secondId}`,
            protocolPlusDomain: 'https://test.com',
            pathname: `/api/v1/users/${firstIdObscured}/posts/${secondIdObscured}`,
        },
    ];
}
function malformedUrls(idMaker, char = TelemetryHelpers_1.ANONYMIZATION_CHARACTER) {
    const firstId = idMaker();
    const secondId = idMaker();
    const firstIdObscured = char.repeat(firstId.length);
    const secondIdObscured = char.repeat(secondId.length);
    return [
        {
            full: `test.com/api/v1/users/${firstId}/posts/${secondId}/`,
            protocolPlusDomain: 'test.com',
            pathname: `/api/v1/users/${firstIdObscured}/posts/${secondIdObscured}/`,
        },
        {
            full: `htp://test.com/api/v1/users/${firstId}/posts/${secondId}/`,
            protocolPlusDomain: 'htp://test.com',
            pathname: `/api/v1/users/${firstIdObscured}/posts/${secondIdObscured}/`,
        },
        {
            full: `test.com/api/v1/users?id=${firstId}`,
            protocolPlusDomain: 'test.com',
            pathname: '/api/v1/users',
        },
        {
            full: `test.com/api/v1/users?id=${firstId}&post=${secondId}`,
            protocolPlusDomain: 'test.com',
            pathname: '/api/v1/users',
        },
    ];
}
const email = () => encodeURIComponent('test@test.com');
function uuidUrls(urlsMaker, baseName = 'test', namespaceUuid = (0, uuid_1.v4)()) {
    return [
        ...urlsMaker(() => (0, uuid_1.v5)(baseName, namespaceUuid)),
        ...urlsMaker(uuid_1.v4),
        ...urlsMaker(() => (0, uuid_1.v3)(baseName, namespaceUuid)),
        ...urlsMaker(uuid_1.v1),
    ];
}
function digit() {
    return Math.floor(Math.random() * 10);
}
function positiveDigit() {
    const d = digit();
    return d === 0 ? positiveDigit() : d;
}
function numericId(length = positiveDigit()) {
    return Array.from({ length }, digit).join('');
}
function alphanumericId() {
    return chooseRandomly([
        `john${numericId()}`,
        `title${numericId(1)}`,
        numericId(),
    ]);
}
const chooseRandomly = (array) => array[Math.floor(Math.random() * array.length)];
