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
Object.defineProperty(exports, "__esModule", { value: true });
const workflows_1 = require("@/api/workflows");
const constants_1 = require("@/constants");
const module = {
    namespaced: true,
    state: {},
    actions: {
        getNewWorkflowData: (context, name) => __awaiter(void 0, void 0, void 0, function* () {
            let workflowData = {
                name: '',
                onboardingFlowEnabled: false,
            };
            try {
                workflowData = yield (0, workflows_1.getNewWorkflow)(context.rootGetters.getRestApiContext, name);
            }
            catch (e) {
                // in case of error, default to original name
                workflowData.name = name || constants_1.DEFAULT_NEW_WORKFLOW_NAME;
            }
            context.commit('setWorkflowName', { newName: workflowData.name }, { root: true });
            return workflowData;
        }),
        getDuplicateCurrentWorkflowName: (context) => __awaiter(void 0, void 0, void 0, function* () {
            const currentWorkflowName = context.rootGetters.workflowName;
            if (currentWorkflowName && (currentWorkflowName.length + constants_1.DUPLICATE_POSTFFIX.length) >= constants_1.MAX_WORKFLOW_NAME_LENGTH) {
                return currentWorkflowName;
            }
            let newName = `${currentWorkflowName}${constants_1.DUPLICATE_POSTFFIX}`;
            try {
                const newWorkflow = yield (0, workflows_1.getNewWorkflow)(context.rootGetters.getRestApiContext, newName);
                newName = newWorkflow.name;
            }
            catch (e) {
            }
            return newName;
        }),
    },
};
exports.default = module;
