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
exports.externalHooks = exports.runExternalHook = void 0;
const vue_1 = __importDefault(require("vue"));
function runExternalHook(eventName, store, metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        if (!window.n8nExternalHooks) {
            return;
        }
        const [resource, operator] = eventName.split('.');
        // @ts-ignore
        if (window.n8nExternalHooks[resource] && window.n8nExternalHooks[resource][operator]) {
            // @ts-ignore
            const hookMethods = window.n8nExternalHooks[resource][operator];
            for (const hookmethod of hookMethods) {
                yield hookmethod(store, metadata);
            }
        }
    });
}
exports.runExternalHook = runExternalHook;
exports.externalHooks = vue_1.default.extend({
    methods: {
        $externalHooks() {
            return {
                run: (eventName, metadata) => __awaiter(this, void 0, void 0, function* () {
                    yield runExternalHook.call(this, eventName, this.$store, metadata);
                }),
            };
        },
    },
});
