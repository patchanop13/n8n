"use strict";
// @ts-nocheck
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
const vue_1 = __importDefault(require("vue"));
const vue_fragment_1 = __importDefault(require("vue-fragment"));
require("regenerator-runtime/runtime");
const vue_agile_1 = __importDefault(require("vue-agile"));
const n8n_design_system_1 = require("n8n-design-system");
vue_1.default.use(vue_fragment_1.default.Plugin);
// n8n design system
vue_1.default.use(n8n_design_system_1.N8nInfoAccordion);
vue_1.default.use(n8n_design_system_1.N8nActionBox);
vue_1.default.use(n8n_design_system_1.N8nActionToggle);
vue_1.default.use(n8n_design_system_1.N8nAvatar);
vue_1.default.use(n8n_design_system_1.N8nButton);
vue_1.default.component('n8n-card', n8n_design_system_1.N8nCard);
vue_1.default.component('n8n-form-box', n8n_design_system_1.N8nFormBox);
vue_1.default.component('n8n-form-inputs', n8n_design_system_1.N8nFormInputs);
vue_1.default.component('n8n-icon', n8n_design_system_1.N8nIcon);
vue_1.default.use(n8n_design_system_1.N8nIconButton);
vue_1.default.use(n8n_design_system_1.N8nInfoTip);
vue_1.default.use(n8n_design_system_1.N8nInput);
vue_1.default.use(n8n_design_system_1.N8nInputLabel);
vue_1.default.use(n8n_design_system_1.N8nInputNumber);
vue_1.default.component('n8n-loading', n8n_design_system_1.N8nLoading);
vue_1.default.use(n8n_design_system_1.N8nHeading);
vue_1.default.use(n8n_design_system_1.N8nLink);
vue_1.default.component('n8n-markdown', n8n_design_system_1.N8nMarkdown);
vue_1.default.use(n8n_design_system_1.N8nMenu);
vue_1.default.use(n8n_design_system_1.N8nMenuItem);
vue_1.default.component('n8n-notice', n8n_design_system_1.N8nNotice);
vue_1.default.use(n8n_design_system_1.N8nOption);
vue_1.default.use(n8n_design_system_1.N8nPulse);
vue_1.default.use(n8n_design_system_1.N8nSelect);
vue_1.default.use(n8n_design_system_1.N8nSpinner);
vue_1.default.component('n8n-sticky', n8n_design_system_1.N8nSticky);
vue_1.default.use(n8n_design_system_1.N8nRadioButtons);
vue_1.default.component('n8n-square-button', n8n_design_system_1.N8nSquareButton);
vue_1.default.use(n8n_design_system_1.N8nTags);
vue_1.default.component('n8n-tabs', n8n_design_system_1.N8nTabs);
vue_1.default.use(n8n_design_system_1.N8nTag);
vue_1.default.component('n8n-text', n8n_design_system_1.N8nText);
vue_1.default.use(n8n_design_system_1.N8nTooltip);
// element io
vue_1.default.use(n8n_design_system_1.Dialog);
vue_1.default.use(n8n_design_system_1.Drawer);
vue_1.default.use(n8n_design_system_1.Dropdown);
vue_1.default.use(n8n_design_system_1.DropdownMenu);
vue_1.default.use(n8n_design_system_1.DropdownItem);
vue_1.default.use(n8n_design_system_1.Submenu);
vue_1.default.use(n8n_design_system_1.Radio);
vue_1.default.use(n8n_design_system_1.RadioGroup);
vue_1.default.use(n8n_design_system_1.RadioButton);
vue_1.default.use(n8n_design_system_1.Checkbox);
vue_1.default.use(n8n_design_system_1.Switch);
vue_1.default.use(n8n_design_system_1.Select);
vue_1.default.use(n8n_design_system_1.Option);
vue_1.default.use(n8n_design_system_1.OptionGroup);
vue_1.default.use(n8n_design_system_1.ButtonGroup);
vue_1.default.use(n8n_design_system_1.Table);
vue_1.default.use(n8n_design_system_1.TableColumn);
vue_1.default.use(n8n_design_system_1.DatePicker);
vue_1.default.use(n8n_design_system_1.Tabs);
vue_1.default.use(n8n_design_system_1.TabPane);
vue_1.default.use(n8n_design_system_1.Tag);
vue_1.default.use(n8n_design_system_1.Row);
vue_1.default.use(n8n_design_system_1.Col);
vue_1.default.use(n8n_design_system_1.Badge);
vue_1.default.use(n8n_design_system_1.Card);
vue_1.default.use(n8n_design_system_1.ColorPicker);
vue_1.default.use(n8n_design_system_1.Container);
vue_1.default.use(n8n_design_system_1.Pagination);
vue_1.default.use(n8n_design_system_1.Popover);
vue_1.default.use(vue_agile_1.default);
vue_1.default.component(n8n_design_system_1.CollapseTransition.name, n8n_design_system_1.CollapseTransition);
vue_1.default.use(n8n_design_system_1.Loading.directive);
vue_1.default.prototype.$loading = n8n_design_system_1.Loading.service;
vue_1.default.prototype.$msgbox = n8n_design_system_1.MessageBox;
vue_1.default.prototype.$alert = (message, configOrTitle, config) => __awaiter(void 0, void 0, void 0, function* () {
    let temp = config || (typeof configOrTitle === 'object' ? configOrTitle : {});
    temp = Object.assign(Object.assign({}, temp), { roundButton: true, cancelButtonClass: 'btn--cancel', confirmButtonClass: 'btn--confirm' });
    if (typeof configOrTitle === 'string') {
        return yield n8n_design_system_1.MessageBox.alert(message, configOrTitle, temp);
    }
    return yield n8n_design_system_1.MessageBox.alert(message, temp);
});
vue_1.default.prototype.$confirm = (message, configOrTitle, config) => __awaiter(void 0, void 0, void 0, function* () {
    let temp = config || (typeof configOrTitle === 'object' ? configOrTitle : {});
    temp = Object.assign(Object.assign({}, temp), { roundButton: true, cancelButtonClass: 'btn--cancel', confirmButtonClass: 'btn--confirm', distinguishCancelAndClose: true, showClose: config.showClose || false, closeOnClickModal: false });
    if (typeof configOrTitle === 'string') {
        return yield n8n_design_system_1.MessageBox.confirm(message, configOrTitle, temp);
    }
    return yield n8n_design_system_1.MessageBox.confirm(message, temp);
});
vue_1.default.prototype.$prompt = (message, configOrTitle, config) => __awaiter(void 0, void 0, void 0, function* () {
    let temp = config || (typeof configOrTitle === 'object' ? configOrTitle : {});
    temp = Object.assign(Object.assign({}, temp), { roundButton: true, cancelButtonClass: 'btn--cancel', confirmButtonClass: 'btn--confirm' });
    if (typeof configOrTitle === 'string') {
        return yield n8n_design_system_1.MessageBox.prompt(message, configOrTitle, temp);
    }
    return yield n8n_design_system_1.MessageBox.prompt(message, temp);
});
vue_1.default.prototype.$notify = n8n_design_system_1.Notification;
vue_1.default.prototype.$message = n8n_design_system_1.Message;
