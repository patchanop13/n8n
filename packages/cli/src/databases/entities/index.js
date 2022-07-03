"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entities = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-cycle */
const CredentialsEntity_1 = require("./CredentialsEntity");
const ExecutionEntity_1 = require("./ExecutionEntity");
const WorkflowEntity_1 = require("./WorkflowEntity");
const WebhookEntity_1 = require("./WebhookEntity");
const TagEntity_1 = require("./TagEntity");
const User_1 = require("./User");
const Role_1 = require("./Role");
const Settings_1 = require("./Settings");
const SharedWorkflow_1 = require("./SharedWorkflow");
const SharedCredentials_1 = require("./SharedCredentials");
exports.entities = {
    CredentialsEntity: CredentialsEntity_1.CredentialsEntity,
    ExecutionEntity: ExecutionEntity_1.ExecutionEntity,
    WorkflowEntity: WorkflowEntity_1.WorkflowEntity,
    WebhookEntity: WebhookEntity_1.WebhookEntity,
    TagEntity: TagEntity_1.TagEntity,
    User: User_1.User,
    Role: Role_1.Role,
    Settings: Settings_1.Settings,
    SharedWorkflow: SharedWorkflow_1.SharedWorkflow,
    SharedCredentials: SharedCredentials_1.SharedCredentials,
};
