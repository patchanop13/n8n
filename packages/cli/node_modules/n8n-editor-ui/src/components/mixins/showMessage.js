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
exports.showMessage = void 0;
const vue_typed_mixins_1 = __importDefault(require("vue-typed-mixins"));
const externalHooks_1 = require("@/components/mixins/externalHooks");
const helpers_1 = require("./helpers");
let stickyNotificationQueue = [];
exports.showMessage = (0, vue_typed_mixins_1.default)(externalHooks_1.externalHooks).extend({
    methods: {
        $showMessage(messageData, track = true) {
            messageData.dangerouslyUseHTMLString = true;
            if (messageData.position === undefined) {
                messageData.position = 'bottom-right';
            }
            const notification = this.$notify(messageData);
            if (messageData.duration === 0) {
                stickyNotificationQueue.push(notification);
            }
            if (messageData.type === 'error' && track) {
                this.$telemetry.track('Instance FE emitted error', {
                    error_title: messageData.title,
                    error_message: messageData.message,
                    caused_by_credential: this.causedByCredential(messageData.message),
                    workflow_id: this.$store.getters.workflowId,
                });
            }
            return notification;
        },
        $showToast(config) {
            // eslint-disable-next-line prefer-const
            let notification;
            if (config.closeOnClick) {
                const cb = config.onClick;
                config.onClick = () => {
                    if (notification) {
                        notification.close();
                    }
                    if (cb) {
                        cb();
                    }
                };
            }
            if (config.onLinkClick) {
                const onLinkClick = (e) => {
                    if (e && e.target && config.onLinkClick && (0, helpers_1.isChildOf)(notification.$el, e.target)) {
                        const target = e.target;
                        if (target && target.tagName === 'A') {
                            config.onLinkClick(e.target);
                        }
                    }
                };
                window.addEventListener('click', onLinkClick);
                const cb = config.onClose;
                config.onClose = () => {
                    window.removeEventListener('click', onLinkClick);
                    if (cb) {
                        cb();
                    }
                };
            }
            notification = this.$showMessage({
                title: config.title,
                message: config.message,
                onClick: config.onClick,
                onClose: config.onClose,
                duration: config.duration,
                customClass: config.customClass,
                type: config.type,
            });
            return notification;
        },
        $showAlert(config) {
            return this.$message(config);
        },
        $getExecutionError(error) {
            // There was a problem with executing the workflow
            let errorMessage = 'There was a problem executing the workflow!';
            if (error && error.message) {
                let nodeName;
                if (error.node) {
                    nodeName = typeof error.node === 'string'
                        ? error.node
                        : error.node.name;
                }
                const receivedError = nodeName
                    ? `${nodeName}: ${error.message}`
                    : error.message;
                errorMessage = `There was a problem executing the workflow:<br /><strong>"${receivedError}"</strong>`;
            }
            return errorMessage;
        },
        $showError(e, title, message) {
            const error = e;
            const messageLine = message ? `${message}<br/>` : '';
            this.$showMessage({
                title,
                message: `
					${messageLine}
					<i>${error.message}</i>
					${this.collapsableDetails(error)}`,
                type: 'error',
                duration: 0,
            }, false);
            this.$externalHooks().run('showMessage.showError', {
                title,
                message,
                errorMessage: error.message,
            });
            this.$telemetry.track('Instance FE emitted error', {
                error_title: title,
                error_description: message,
                error_message: error.message,
                caused_by_credential: this.causedByCredential(error.message),
                workflow_id: this.$store.getters.workflowId,
            });
        },
        confirmMessage(message, headline, type = 'warning', confirmButtonText, cancelButtonText) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const options = Object.assign({ confirmButtonText: confirmButtonText || this.$locale.baseText('showMessage.ok'), cancelButtonText: cancelButtonText || this.$locale.baseText('showMessage.cancel'), dangerouslyUseHTMLString: true }, (type && { type }));
                    yield this.$confirm(message, headline, options);
                    return true;
                }
                catch (e) {
                    return false;
                }
            });
        },
        confirmModal(message, headline, type = 'warning', confirmButtonText, cancelButtonText, showClose = false) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const options = Object.assign({ confirmButtonText: confirmButtonText || this.$locale.baseText('showMessage.ok'), cancelButtonText: cancelButtonText || this.$locale.baseText('showMessage.cancel'), dangerouslyUseHTMLString: true, showClose }, (type && { type }));
                    yield this.$confirm(message, headline, options);
                    return 'confirmed';
                }
                catch (e) {
                    return e;
                }
            });
        },
        clearAllStickyNotifications() {
            stickyNotificationQueue.map((notification) => {
                if (notification) {
                    notification.close();
                }
            });
            stickyNotificationQueue = [];
        },
        // @ts-ignore
        collapsableDetails({ description, node }) {
            if (!description)
                return '';
            const errorDescription = description.length > 500
                ? `${description.slice(0, 500)}...`
                : description;
            return `
				<br>
				<br>
				<details>
					<summary
						style="color: #ff6d5a; font-weight: bold; cursor: pointer;"
					>
						${this.$locale.baseText('showMessage.showDetails')}
					</summary>
					<p>${node.name}: ${errorDescription}</p>
				</details>
			`;
        },
        /**
         * Whether a workflow execution error was caused by a credential issue, as reflected by the error message.
         */
        causedByCredential(message) {
            if (!message)
                return false;
            return message.includes('Credentials for') && message.includes('are not set');
        },
    },
});
