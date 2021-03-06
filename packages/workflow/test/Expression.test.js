"use strict";
/**
 * @jest-environment jsdom
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const Helpers = __importStar(require("./Helpers"));
const luxon_1 = require("luxon");
describe('Expression', () => {
    describe('getParameterValue()', () => {
        const nodeTypes = Helpers.NodeTypes();
        const workflow = new src_1.Workflow({ nodes: [
                {
                    name: 'node',
                    typeVersion: 1,
                    type: 'test.set',
                    position: [0, 0],
                    parameters: {}
                }
            ], connections: {}, active: false, nodeTypes });
        const expression = new src_1.Expression(workflow);
        const evaluate = (value) => expression.getParameterValue(value, null, 0, 0, 'node', [], 'manual', '', {});
        it('should not be able to use global built-ins from denylist', () => {
            expect(evaluate('={{document}}')).toEqual({});
            expect(evaluate('={{window}}')).toEqual({});
            expect(evaluate('={{Window}}')).toEqual({});
            expect(evaluate('={{globalThis}}')).toEqual({});
            expect(evaluate('={{self}}')).toEqual({});
            expect(evaluate('={{alert}}')).toEqual({});
            expect(evaluate('={{prompt}}')).toEqual({});
            expect(evaluate('={{confirm}}')).toEqual({});
            expect(evaluate('={{eval}}')).toEqual({});
            expect(evaluate('={{uneval}}')).toEqual({});
            expect(evaluate('={{setTimeout}}')).toEqual({});
            expect(evaluate('={{setInterval}}')).toEqual({});
            expect(evaluate('={{Function}}')).toEqual({});
            expect(evaluate('={{fetch}}')).toEqual({});
            expect(evaluate('={{XMLHttpRequest}}')).toEqual({});
            expect(evaluate('={{Promise}}')).toEqual({});
            expect(evaluate('={{Generator}}')).toEqual({});
            expect(evaluate('={{GeneratorFunction}}')).toEqual({});
            expect(evaluate('={{AsyncFunction}}')).toEqual({});
            expect(evaluate('={{AsyncGenerator}}')).toEqual({});
            expect(evaluate('={{AsyncGeneratorFunction}}')).toEqual({});
            expect(evaluate('={{WebAssembly}}')).toEqual({});
            expect(evaluate('={{Reflect}}')).toEqual({});
            expect(evaluate('={{Proxy}}')).toEqual({});
            expect(evaluate('={{constructor}}')).toEqual({});
            expect(evaluate('={{escape}}')).toEqual({});
            expect(evaluate('={{unescape}}')).toEqual({});
        });
        it('should be able to use global built-ins from allowlist', () => {
            expect(evaluate('={{new Date()}}')).toBeInstanceOf(Date);
            expect(evaluate('={{DateTime.now().toLocaleString()}}')).toEqual(luxon_1.DateTime.now().toLocaleString());
            expect(evaluate('={{Interval.after(new Date(), 100)}}')).toEqual(luxon_1.Interval.after(new Date(), 100));
            expect(evaluate('={{Duration.fromMillis(100)}}')).toEqual(luxon_1.Duration.fromMillis(100));
            expect(evaluate('={{new Object()}}')).toEqual(new Object());
            expect(evaluate('={{new Array()}}')).toEqual(new Array());
            expect(evaluate('={{new Int8Array()}}')).toEqual(new Int8Array());
            expect(evaluate('={{new Uint8Array()}}')).toEqual(new Uint8Array());
            expect(evaluate('={{new Uint8ClampedArray()}}')).toEqual(new Uint8ClampedArray());
            expect(evaluate('={{new Int16Array()}}')).toEqual(new Int16Array());
            expect(evaluate('={{new Uint16Array()}}')).toEqual(new Uint16Array());
            expect(evaluate('={{new Int32Array()}}')).toEqual(new Int32Array());
            expect(evaluate('={{new Uint32Array()}}')).toEqual(new Uint32Array());
            expect(evaluate('={{new Float32Array()}}')).toEqual(new Float32Array());
            expect(evaluate('={{new Float64Array()}}')).toEqual(new Float64Array());
            expect(evaluate('={{new BigInt64Array()}}')).toEqual(new BigInt64Array());
            expect(evaluate('={{new BigUint64Array()}}')).toEqual(new BigUint64Array());
            expect(evaluate('={{new Map()}}')).toEqual(new Map());
            expect(evaluate('={{new WeakMap()}}')).toEqual(new WeakMap());
            expect(evaluate('={{new Set()}}')).toEqual(new Set());
            expect(evaluate('={{new WeakSet()}}')).toEqual(new WeakSet());
            expect(evaluate('={{new Error()}}')).toEqual(new Error());
            expect(evaluate('={{new TypeError()}}')).toEqual(new TypeError());
            expect(evaluate('={{new SyntaxError()}}')).toEqual(new SyntaxError());
            expect(evaluate('={{new EvalError()}}')).toEqual(new EvalError());
            expect(evaluate('={{new RangeError()}}')).toEqual(new RangeError());
            expect(evaluate('={{new ReferenceError()}}')).toEqual(new ReferenceError());
            expect(evaluate('={{new URIError()}}')).toEqual(new URIError());
            expect(evaluate('={{Intl}}')).toEqual(Intl);
            expect(evaluate('={{new String()}}')).toEqual(new String());
            expect(evaluate('={{new RegExp(\'\')}}')).toEqual(new RegExp(''));
            expect(evaluate('={{Math}}')).toEqual(Math);
            expect(evaluate('={{new Number()}}')).toEqual(new Number());
            expect(evaluate('={{BigInt(\'1\')}}')).toEqual(BigInt('1'));
            expect(evaluate('={{Infinity}}')).toEqual(Infinity);
            expect(evaluate('={{NaN}}')).toEqual(NaN);
            expect(evaluate('={{isFinite(1)}}')).toEqual(isFinite(1));
            expect(evaluate('={{isNaN(1)}}')).toEqual(isNaN(1));
            expect(evaluate('={{parseFloat(\'1\')}}')).toEqual(parseFloat('1'));
            expect(evaluate('={{parseInt(\'1\', 10)}}')).toEqual(parseInt('1', 10));
            expect(evaluate('={{JSON.stringify({})}}')).toEqual(JSON.stringify({}));
            expect(evaluate('={{new ArrayBuffer(10)}}')).toEqual(new ArrayBuffer(10));
            expect(evaluate('={{new SharedArrayBuffer(10)}}')).toEqual(new SharedArrayBuffer(10));
            expect(evaluate('={{Atomics}}')).toEqual(Atomics);
            expect(evaluate('={{new DataView(new ArrayBuffer(1))}}')).toEqual(new DataView(new ArrayBuffer(1)));
            expect(evaluate('={{encodeURI(\'https://google.com\')}}')).toEqual(encodeURI('https://google.com'));
            expect(evaluate('={{encodeURIComponent(\'https://google.com\')}}')).toEqual(encodeURIComponent('https://google.com'));
            expect(evaluate('={{decodeURI(\'https://google.com\')}}')).toEqual(decodeURI('https://google.com'));
            expect(evaluate('={{decodeURIComponent(\'https://google.com\')}}')).toEqual(decodeURIComponent('https://google.com'));
            expect(evaluate('={{Boolean(1)}}')).toEqual(Boolean(1));
            expect(evaluate('={{Symbol(1).toString()}}')).toEqual(Symbol(1).toString());
        });
    });
});
