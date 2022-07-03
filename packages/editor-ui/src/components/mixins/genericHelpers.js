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
exports.genericHelpers = void 0;
const showMessage_1 = require("@/components/mixins/showMessage");
const constants_1 = require("@/constants");
const lodash_1 = require("lodash");
const vue_typed_mixins_1 = __importDefault(require("vue-typed-mixins"));
exports.genericHelpers = (0, vue_typed_mixins_1.default)(showMessage_1.showMessage).extend({
    data() {
        return {
            loadingService: null,
            debouncedFunctions: [], // tslint:disable-line:no-any
        };
    },
    computed: {
        isReadOnly() {
            return ![constants_1.VIEWS.WORKFLOW, constants_1.VIEWS.NEW_WORKFLOW].includes(this.$route.name);
        },
    },
    methods: {
        displayTimer(msPassed, showMs = false) {
            if (msPassed < 60000) {
                if (showMs === false) {
                    return `${Math.floor(msPassed / 1000)} ${this.$locale.baseText('genericHelpers.sec')}`;
                }
                return `${msPassed / 1000} ${this.$locale.baseText('genericHelpers.sec')}`;
            }
            const secondsPassed = Math.floor(msPassed / 1000);
            const minutesPassed = Math.floor(secondsPassed / 60);
            const secondsLeft = (secondsPassed - (minutesPassed * 60)).toString().padStart(2, '0');
            return `${minutesPassed}:${secondsLeft} ${this.$locale.baseText('genericHelpers.min')}`;
        },
        editAllowedCheck() {
            if (this.isReadOnly) {
                this.$showMessage({
                    // title: 'Workflow can not be changed!',
                    title: this.$locale.baseText('genericHelpers.showMessage.title'),
                    message: this.$locale.baseText('genericHelpers.showMessage.message'),
                    type: 'error',
                    duration: 0,
                });
                return false;
            }
            return true;
        },
        startLoading(text) {
            if (this.loadingService !== null) {
                return;
            }
            // @ts-ignore
            this.loadingService = this.$loading({
                lock: true,
                text: text || this.$locale.baseText('genericHelpers.loading'),
                spinner: 'el-icon-loading',
                background: 'rgba(255, 255, 255, 0.8)',
            });
        },
        setLoadingText(text) {
            this.loadingService.text = text;
        },
        stopLoading() {
            if (this.loadingService !== null) {
                this.loadingService.close();
                this.loadingService = null;
            }
        },
        callDebounced(...inputParameters) {
            return __awaiter(this, void 0, void 0, function* () {
                const functionName = inputParameters.shift();
                const { trailing, debounceTime } = inputParameters.shift();
                // @ts-ignore
                if (this.debouncedFunctions[functionName] === undefined) {
                    // @ts-ignore
                    this.debouncedFunctions[functionName] = (0, lodash_1.debounce)(this[functionName], debounceTime, trailing ? { trailing } : { leading: true });
                }
                // @ts-ignore
                yield this.debouncedFunctions[functionName].apply(this, inputParameters);
            });
        },
    },
});
