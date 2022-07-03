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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addHeaders = exports.addCredentialTranslation = exports.addNodeTranslation = exports.loadLanguage = exports.I18nClass = exports.I18nPlugin = void 0;
const axios_1 = __importDefault(require("axios"));
const vue_i18n_1 = __importDefault(require("vue-i18n"));
const vue_1 = __importDefault(require("vue"));
const utils_1 = require("./utils");
const n8n_design_system_1 = require("n8n-design-system");
const en_json_1 = __importDefault(require("./locales/en.json"));
vue_1.default.use(vue_i18n_1.default);
n8n_design_system_1.locale.use('en');
function I18nPlugin(vue, store) {
    const i18n = new I18nClass(store);
    Object.defineProperty(vue, '$locale', {
        get() { return i18n; },
    });
    Object.defineProperty(vue.prototype, '$locale', {
        get() { return i18n; },
    });
}
exports.I18nPlugin = I18nPlugin;
class I18nClass {
    constructor(store) {
        this.$store = store;
    }
    get i18n() {
        return i18nInstance;
    }
    // ----------------------------------
    //         helper methods
    // ----------------------------------
    exists(key) {
        return this.i18n.te(key);
    }
    shortNodeType(longNodeType) {
        return longNodeType.replace('n8n-nodes-base.', '');
    }
    // ----------------------------------
    //        render methods
    // ----------------------------------
    /**
     * Render a string of base text, i.e. a string with a fixed path to the localized value. Optionally allows for [interpolation](https://kazupon.github.io/vue-i18n/guide/formatting.html#named-formatting) when the localized value contains a string between curly braces.
     */
    baseText(key, options) {
        if (options && options.adjustToNumber) {
            return this.i18n.tc(key, options.adjustToNumber, options && options.interpolate).toString();
        }
        return this.i18n.t(key, options && options.interpolate).toString();
    }
    /**
     * Render a string of dynamic text, i.e. a string with a constructed path to the localized value.
     */
    dynamicRender({ key, fallback }) {
        return this.i18n.te(key) ? this.i18n.t(key).toString() : fallback;
    }
    /**
     * Render a string of header text (a node's name and description),
     * used variously in the nodes panel, under the node icon, etc.
     */
    headerText(arg) {
        return this.dynamicRender(arg);
    }
    /**
     * Namespace for methods to render text in the credentials details modal.
     */
    credText() {
        const credentialType = this.$store.getters.activeCredentialType;
        const credentialPrefix = `n8n-nodes-base.credentials.${credentialType}`;
        const context = this;
        return {
            /**
             * Display name for a top-level param.
             */
            inputLabelDisplayName({ name: parameterName, displayName }) {
                if (['clientId', 'clientSecret'].includes(parameterName)) {
                    return context.dynamicRender({
                        key: `_reusableDynamicText.oauth2.${parameterName}`,
                        fallback: displayName,
                    });
                }
                return context.dynamicRender({
                    key: `${credentialPrefix}.${parameterName}.displayName`,
                    fallback: displayName,
                });
            },
            /**
             * Hint for a top-level param.
             */
            hint({ name: parameterName, hint }) {
                return context.dynamicRender({
                    key: `${credentialPrefix}.${parameterName}.hint`,
                    fallback: hint,
                });
            },
            /**
             * Description (tooltip text) for an input label param.
             */
            inputLabelDescription({ name: parameterName, description }) {
                return context.dynamicRender({
                    key: `${credentialPrefix}.${parameterName}.description`,
                    fallback: description,
                });
            },
            /**
             * Display name for an option inside an `options` or `multiOptions` param.
             */
            optionsOptionDisplayName({ name: parameterName }, { value: optionName, name: displayName }) {
                return context.dynamicRender({
                    key: `${credentialPrefix}.${parameterName}.options.${optionName}.displayName`,
                    fallback: displayName,
                });
            },
            /**
             * Description for an option inside an `options` or `multiOptions` param.
             */
            optionsOptionDescription({ name: parameterName }, { value: optionName, description }) {
                return context.dynamicRender({
                    key: `${credentialPrefix}.${parameterName}.options.${optionName}.description`,
                    fallback: description,
                });
            },
            /**
             * Placeholder for a `string` param.
             */
            placeholder({ name: parameterName, placeholder }) {
                return context.dynamicRender({
                    key: `${credentialPrefix}.${parameterName}.placeholder`,
                    fallback: placeholder,
                });
            },
        };
    }
    /**
     * Namespace for methods to render text in the node details view,
     * except for `eventTriggerDescription`.
     */
    nodeText() {
        const activeNode = this.$store.getters.activeNode;
        const nodeType = activeNode ? this.shortNodeType(activeNode.type) : ''; // unused in eventTriggerDescription
        const initialKey = `n8n-nodes-base.nodes.${nodeType}.nodeView`;
        const context = this;
        return {
            /**
             * Display name for an input label, whether top-level or nested.
             */
            inputLabelDisplayName(parameter, path) {
                const middleKey = (0, utils_1.deriveMiddleKey)(path, parameter);
                return context.dynamicRender({
                    key: `${initialKey}.${middleKey}.displayName`,
                    fallback: parameter.displayName,
                });
            },
            /**
             * Description (tooltip text) for an input label, whether top-level or nested.
             */
            inputLabelDescription(parameter, path) {
                const middleKey = (0, utils_1.deriveMiddleKey)(path, parameter);
                return context.dynamicRender({
                    key: `${initialKey}.${middleKey}.description`,
                    fallback: parameter.description,
                });
            },
            /**
             * Hint for an input, whether top-level or nested.
             */
            hint(parameter, path) {
                const middleKey = (0, utils_1.deriveMiddleKey)(path, parameter);
                return context.dynamicRender({
                    key: `${initialKey}.${middleKey}.hint`,
                    fallback: parameter.hint,
                });
            },
            /**
             * Placeholder for an input label or `collection` or `fixedCollection` param,
             * whether top-level or nested.
             * - For an input label, the placeholder is unselectable greyed-out sample text.
             * - For a `collection` or `fixedCollection`, the placeholder is the button text.
             */
            placeholder(parameter, path) {
                let middleKey = parameter.name;
                if ((0, utils_1.isNestedInCollectionLike)(path)) {
                    const pathSegments = (0, utils_1.normalize)(path).split('.');
                    middleKey = (0, utils_1.insertOptionsAndValues)(pathSegments).join('.');
                }
                return context.dynamicRender({
                    key: `${initialKey}.${middleKey}.placeholder`,
                    fallback: parameter.placeholder,
                });
            },
            /**
             * Display name for an option inside an `options` or `multiOptions` param,
             * whether top-level or nested.
             */
            optionsOptionDisplayName(parameter, { value: optionName, name: displayName }, path) {
                let middleKey = parameter.name;
                if ((0, utils_1.isNestedInCollectionLike)(path)) {
                    const pathSegments = (0, utils_1.normalize)(path).split('.');
                    middleKey = (0, utils_1.insertOptionsAndValues)(pathSegments).join('.');
                }
                return context.dynamicRender({
                    key: `${initialKey}.${middleKey}.options.${optionName}.displayName`,
                    fallback: displayName,
                });
            },
            /**
             * Description for an option inside an `options` or `multiOptions` param,
             * whether top-level or nested.
             */
            optionsOptionDescription(parameter, { value: optionName, description }, path) {
                let middleKey = parameter.name;
                if ((0, utils_1.isNestedInCollectionLike)(path)) {
                    const pathSegments = (0, utils_1.normalize)(path).split('.');
                    middleKey = (0, utils_1.insertOptionsAndValues)(pathSegments).join('.');
                }
                return context.dynamicRender({
                    key: `${initialKey}.${middleKey}.options.${optionName}.description`,
                    fallback: description,
                });
            },
            /**
             * Display name for an option in the dropdown menu of a `collection` or
             * fixedCollection` param. No nesting support since `collection` cannot
             * be nested in a `collection` or in a `fixedCollection`.
             */
            collectionOptionDisplayName(parameter, { name: optionName, displayName }, path) {
                let middleKey = parameter.name;
                if ((0, utils_1.isNestedInCollectionLike)(path)) {
                    const pathSegments = (0, utils_1.normalize)(path).split('.');
                    middleKey = (0, utils_1.insertOptionsAndValues)(pathSegments).join('.');
                }
                return context.dynamicRender({
                    key: `${initialKey}.${middleKey}.options.${optionName}.displayName`,
                    fallback: displayName,
                });
            },
            /**
             * Text for a button to add another option inside a `collection` or
             * `fixedCollection` param having `multipleValues: true`.
             */
            multipleValueButtonText({ name: parameterName, typeOptions: { multipleValueButtonText } }) {
                return context.dynamicRender({
                    key: `${initialKey}.${parameterName}.multipleValueButtonText`,
                    fallback: multipleValueButtonText,
                });
            },
            eventTriggerDescription(nodeType, eventTriggerDescription) {
                return context.dynamicRender({
                    key: `n8n-nodes-base.nodes.${nodeType}.nodeView.eventTriggerDescription`,
                    fallback: eventTriggerDescription,
                });
            },
        };
    }
}
exports.I18nClass = I18nClass;
const i18nInstance = new vue_i18n_1.default({
    locale: 'en',
    fallbackLocale: 'en',
    messages: { en: en_json_1.default },
    silentTranslationWarn: true,
});
n8n_design_system_1.locale.i18n((key, options) => i18nInstance.t(key, options && options.interpolate));
const loadedLanguages = ['en'];
function setLanguage(language) {
    i18nInstance.locale = language;
    axios_1.default.defaults.headers.common['Accept-Language'] = language;
    document.querySelector('html').setAttribute('lang', language);
    // update n8n design system and element ui
    n8n_design_system_1.locale.use(language);
    return language;
}
function loadLanguage(language) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!language)
            return Promise.resolve();
        if (i18nInstance.locale === language) {
            return Promise.resolve(setLanguage(language));
        }
        if (loadedLanguages.includes(language)) {
            return Promise.resolve(setLanguage(language));
        }
        const _a = require(`./locales/${language}.json`), { numberFormats } = _a, rest = __rest(_a, ["numberFormats"]);
        i18nInstance.setLocaleMessage(language, rest);
        if (numberFormats) {
            i18nInstance.setNumberFormat(language, numberFormats);
        }
        loadedLanguages.push(language);
        setLanguage(language);
    });
}
exports.loadLanguage = loadLanguage;
/**
 * Add a node translation to the i18n instance's `messages` object.
 */
function addNodeTranslation(nodeTranslation, language) {
    const oldNodesBase = i18nInstance.messages[language]['n8n-nodes-base'] || {};
    const updatedNodes = Object.assign(Object.assign({}, oldNodesBase.nodes), nodeTranslation);
    const newNodesBase = {
        'n8n-nodes-base': Object.assign(oldNodesBase, { nodes: updatedNodes }),
    };
    i18nInstance.setLocaleMessage(language, Object.assign(i18nInstance.messages[language], newNodesBase));
}
exports.addNodeTranslation = addNodeTranslation;
/**
 * Add a credential translation to the i18n instance's `messages` object.
 */
function addCredentialTranslation(nodeCredentialTranslation, language) {
    const oldNodesBase = i18nInstance.messages[language]['n8n-nodes-base'] || {};
    const updatedCredentials = Object.assign(Object.assign({}, oldNodesBase.credentials), nodeCredentialTranslation);
    const newNodesBase = {
        'n8n-nodes-base': Object.assign(oldNodesBase, { credentials: updatedCredentials }),
    };
    i18nInstance.setLocaleMessage(language, Object.assign(i18nInstance.messages[language], newNodesBase));
}
exports.addCredentialTranslation = addCredentialTranslation;
/**
 * Add a node's header strings to the i18n instance's `messages` object.
 */
function addHeaders(headers, language) {
    i18nInstance.setLocaleMessage(language, Object.assign(i18nInstance.messages[language], { headers }));
}
exports.addHeaders = addHeaders;
