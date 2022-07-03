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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expression = void 0;
/* eslint-disable id-denylist */
// @ts-ignore
const tmpl = __importStar(require("@n8n_io/riot-tmpl"));
const luxon_1 = require("luxon");
// eslint-disable-next-line import/no-cycle
const _1 = require(".");
// @ts-ignore
// Set it to use double curly brackets instead of single ones
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
tmpl.brackets.set('{{ }}');
// Make sure that error get forwarded
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
tmpl.tmpl.errorHandler = (error) => {
    if (error instanceof _1.ExpressionError) {
        if (error.context.failExecution) {
            throw error;
        }
    }
};
class Expression {
    constructor(workflow) {
        this.workflow = workflow;
    }
    /**
     * Converts an object to a string in a way to make it clear that
     * the value comes from an object
     *
     * @param {object} value
     * @returns {string}
     * @memberof Workflow
     */
    convertObjectValueToString(value) {
        const typeName = Array.isArray(value) ? 'Array' : 'Object';
        return `[${typeName}: ${JSON.stringify(value)}]`;
    }
    /**
     * Resolves the paramter value.  If it is an expression it will execute it and
     * return the result. For everything simply the supplied value will be returned.
     *
     * @param {NodeParameterValue} parameterValue
     * @param {(IRunExecutionData | null)} runExecutionData
     * @param {number} runIndex
     * @param {number} itemIndex
     * @param {string} activeNodeName
     * @param {INodeExecutionData[]} connectionInputData
     * @param {boolean} [returnObjectAsString=false]
     * @returns {(NodeParameterValue | INodeParameters | NodeParameterValue[] | INodeParameters[])}
     * @memberof Workflow
     */
    resolveSimpleParameterValue(parameterValue, siblingParameters, runExecutionData, runIndex, itemIndex, activeNodeName, connectionInputData, mode, timezone, additionalKeys, executeData, returnObjectAsString = false, selfData = {}) {
        // Check if it is an expression
        if (typeof parameterValue !== 'string' || parameterValue.charAt(0) !== '=') {
            // Is no expression so return value
            return parameterValue;
        }
        // Is an expression
        // Remove the equal sign
        // eslint-disable-next-line no-param-reassign
        parameterValue = parameterValue.substr(1);
        // Generate a data proxy which allows to query workflow data
        const dataProxy = new _1.WorkflowDataProxy(this.workflow, runExecutionData, runIndex, itemIndex, activeNodeName, connectionInputData, siblingParameters, mode, timezone, additionalKeys, executeData, -1, selfData);
        const data = dataProxy.getDataProxy();
        // Support only a subset of process properties
        // @ts-ignore
        data.process = {
            arch: process.arch,
            env: process.env,
            platform: process.platform,
            pid: process.pid,
            ppid: process.ppid,
            release: process.release,
            version: process.pid,
            versions: process.versions,
        };
        /**
         * Denylist
         */
        // @ts-ignore
        data.document = {};
        data.global = {};
        data.window = {};
        data.Window = {};
        data.this = {};
        data.globalThis = {};
        data.self = {};
        // Alerts
        data.alert = {};
        data.prompt = {};
        data.confirm = {};
        // Prevent Remote Code Execution
        data.eval = {};
        data.uneval = {};
        data.setTimeout = {};
        data.setInterval = {};
        data.Function = {};
        // Prevent requests
        data.fetch = {};
        data.XMLHttpRequest = {};
        // Prevent control abstraction
        data.Promise = {};
        data.Generator = {};
        data.GeneratorFunction = {};
        data.AsyncFunction = {};
        data.AsyncGenerator = {};
        data.AsyncGeneratorFunction = {};
        // Prevent WASM
        data.WebAssembly = {};
        // Prevent Reflection
        data.Reflect = {};
        data.Proxy = {};
        // @ts-ignore
        data.constructor = {};
        // Deprecated
        data.escape = {};
        data.unescape = {};
        /**
         * Allowlist
         */
        // Dates
        data.Date = Date;
        data.DateTime = luxon_1.DateTime;
        data.Interval = luxon_1.Interval;
        data.Duration = luxon_1.Duration;
        // Objects
        data.Object = Object;
        // Arrays
        data.Array = Array;
        data.Int8Array = Int8Array;
        data.Uint8Array = Uint8Array;
        data.Uint8ClampedArray = Uint8ClampedArray;
        data.Int16Array = Int16Array;
        data.Uint16Array = Uint16Array;
        data.Int32Array = Int32Array;
        data.Uint32Array = Uint32Array;
        data.Float32Array = Float32Array;
        data.Float64Array = Float64Array;
        data.BigInt64Array = typeof BigInt64Array !== 'undefined' ? BigInt64Array : {};
        data.BigUint64Array = typeof BigUint64Array !== 'undefined' ? BigUint64Array : {};
        // Collections
        data.Map = typeof Map !== 'undefined' ? Map : {};
        data.WeakMap = typeof WeakMap !== 'undefined' ? WeakMap : {};
        data.Set = typeof Set !== 'undefined' ? Set : {};
        data.WeakSet = typeof WeakSet !== 'undefined' ? WeakSet : {};
        // Errors
        data.Error = Error;
        data.TypeError = TypeError;
        data.SyntaxError = SyntaxError;
        data.EvalError = EvalError;
        data.RangeError = RangeError;
        data.ReferenceError = ReferenceError;
        data.URIError = URIError;
        // Internationalization
        data.Intl = typeof Intl !== 'undefined' ? Intl : {};
        // Text
        data.String = String;
        data.RegExp = RegExp;
        // Math
        data.Math = Math;
        data.Number = Number;
        data.BigInt = typeof BigInt !== 'undefined' ? BigInt : {};
        data.Infinity = Infinity;
        data.NaN = NaN;
        data.isFinite = Number.isFinite;
        data.isNaN = Number.isNaN;
        data.parseFloat = parseFloat;
        data.parseInt = parseInt;
        // Structured data
        data.JSON = JSON;
        data.ArrayBuffer = typeof ArrayBuffer !== 'undefined' ? ArrayBuffer : {};
        data.SharedArrayBuffer = typeof SharedArrayBuffer !== 'undefined' ? SharedArrayBuffer : {};
        data.Atomics = typeof Atomics !== 'undefined' ? Atomics : {};
        data.DataView = typeof DataView !== 'undefined' ? DataView : {};
        data.encodeURI = encodeURI;
        data.encodeURIComponent = encodeURIComponent;
        data.decodeURI = decodeURI;
        data.decodeURIComponent = decodeURIComponent;
        // Other
        data.Boolean = Boolean;
        data.Symbol = Symbol;
        // Execute the expression
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let returnValue;
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            returnValue = tmpl.tmpl(parameterValue, data);
        }
        catch (error) {
            if (error instanceof _1.ExpressionError) {
                // Ignore all errors except if they are ExpressionErrors and they are supposed
                // to fail the execution
                if (error.context.failExecution) {
                    throw error;
                }
            }
        }
        if (typeof returnValue === 'function') {
            throw new Error('Expression resolved to a function. Please add "()"');
        }
        else if (returnValue !== null && typeof returnValue === 'object') {
            if (returnObjectAsString) {
                return this.convertObjectValueToString(returnValue);
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return returnValue;
    }
    /**
     * Resolves value of parameter. But does not work for workflow-data.
     *
     * @param {INode} node
     * @param {(string | undefined)} parameterValue
     * @param {string} [defaultValue]
     * @returns {(string | undefined)}
     * @memberof Workflow
     */
    getSimpleParameterValue(node, parameterValue, mode, timezone, additionalKeys, executeData, defaultValue) {
        if (parameterValue === undefined) {
            // Value is not set so return the default
            return defaultValue;
        }
        // Get the value of the node (can be an expression)
        const runIndex = 0;
        const itemIndex = 0;
        const connectionInputData = [];
        const runData = {
            resultData: {
                runData: {},
            },
        };
        return this.getParameterValue(parameterValue, runData, runIndex, itemIndex, node.name, connectionInputData, mode, timezone, additionalKeys, executeData);
    }
    /**
     * Resolves value of complex parameter. But does not work for workflow-data.
     *
     * @param {INode} node
     * @param {(NodeParameterValue | INodeParameters | NodeParameterValue[] | INodeParameters[])} parameterValue
     * @param {(NodeParameterValue | INodeParameters | NodeParameterValue[] | INodeParameters[] | undefined)} [defaultValue]
     * @returns {(NodeParameterValue | INodeParameters | NodeParameterValue[] | INodeParameters[] | undefined)}
     * @memberof Workflow
     */
    getComplexParameterValue(node, parameterValue, mode, timezone, additionalKeys, executeData, defaultValue = undefined, selfData = {}) {
        if (parameterValue === undefined) {
            // Value is not set so return the default
            return defaultValue;
        }
        // Get the value of the node (can be an expression)
        const runIndex = 0;
        const itemIndex = 0;
        const connectionInputData = [];
        const runData = {
            resultData: {
                runData: {},
            },
        };
        // Resolve the "outer" main values
        const returnData = this.getParameterValue(parameterValue, runData, runIndex, itemIndex, node.name, connectionInputData, mode, timezone, additionalKeys, executeData, false, selfData);
        // Resolve the "inner" values
        return this.getParameterValue(returnData, runData, runIndex, itemIndex, node.name, connectionInputData, mode, timezone, additionalKeys, executeData, false, selfData);
    }
    /**
     * Returns the resolved node parameter value. If it is an expression it will execute it and
     * return the result. If the value to resolve is an array or object it will do the same
     * for all of the items and values.
     *
     * @param {(NodeParameterValue | INodeParameters | NodeParameterValue[] | INodeParameters[])} parameterValue
     * @param {(IRunExecutionData | null)} runExecutionData
     * @param {number} runIndex
     * @param {number} itemIndex
     * @param {string} activeNodeName
     * @param {INodeExecutionData[]} connectionInputData
     * @param {boolean} [returnObjectAsString=false]
     * @returns {(NodeParameterValue | INodeParameters | NodeParameterValue[] | INodeParameters[])}
     * @memberof Workflow
     */
    getParameterValue(parameterValue, runExecutionData, runIndex, itemIndex, activeNodeName, connectionInputData, mode, timezone, additionalKeys, executeData, returnObjectAsString = false, selfData = {}) {
        // Helper function which returns true when the parameter is a complex one or array
        const isComplexParameter = (value) => {
            return typeof value === 'object';
        };
        // Helper function which resolves a parameter value depending on if it is simply or not
        const resolveParameterValue = (value, siblingParameters) => {
            if (isComplexParameter(value)) {
                return this.getParameterValue(value, runExecutionData, runIndex, itemIndex, activeNodeName, connectionInputData, mode, timezone, additionalKeys, executeData, returnObjectAsString, selfData);
            }
            return this.resolveSimpleParameterValue(value, siblingParameters, runExecutionData, runIndex, itemIndex, activeNodeName, connectionInputData, mode, timezone, additionalKeys, executeData, returnObjectAsString, selfData);
        };
        // Check if it value is a simple one that we can get it resolved directly
        if (!isComplexParameter(parameterValue)) {
            return this.resolveSimpleParameterValue(parameterValue, {}, runExecutionData, runIndex, itemIndex, activeNodeName, connectionInputData, mode, timezone, additionalKeys, executeData, returnObjectAsString, selfData);
        }
        // The parameter value is complex so resolve depending on type
        if (Array.isArray(parameterValue)) {
            // Data is an array
            const returnData = [];
            // eslint-disable-next-line no-restricted-syntax
            for (const item of parameterValue) {
                returnData.push(resolveParameterValue(item, {}));
            }
            if (returnObjectAsString && typeof returnData === 'object') {
                return this.convertObjectValueToString(returnData);
            }
            return returnData;
        }
        if (parameterValue === null || parameterValue === undefined) {
            return parameterValue;
        }
        // Data is an object
        const returnData = {};
        // eslint-disable-next-line no-restricted-syntax
        for (const key of Object.keys(parameterValue)) {
            returnData[key] = resolveParameterValue(parameterValue[key], parameterValue);
        }
        if (returnObjectAsString && typeof returnData === 'object') {
            return this.convertObjectValueToString(returnData);
        }
        return returnData;
    }
}
exports.Expression = Expression;
