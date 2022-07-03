"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqliteMigrations = void 0;
const _1588102412422_InitialMigration_1 = require("./1588102412422-InitialMigration");
const _1592445003908_WebhookModel_1 = require("./1592445003908-WebhookModel");
const _1594825041918_CreateIndexStoppedAt_1 = require("./1594825041918-CreateIndexStoppedAt");
const _1611071044839_AddWebhookId_1 = require("./1611071044839-AddWebhookId");
const _1607431743769_MakeStoppedAtNullable_1 = require("./1607431743769-MakeStoppedAtNullable");
const _1617213344594_CreateTagEntity_1 = require("./1617213344594-CreateTagEntity");
const _1620821879465_UniqueWorkflowNames_1 = require("./1620821879465-UniqueWorkflowNames");
const _1621707690587_AddWaitColumn_1 = require("./1621707690587-AddWaitColumn");
const _1630330987096_UpdateWorkflowCredentials_1 = require("./1630330987096-UpdateWorkflowCredentials");
const _1644421939510_AddExecutionEntityIndexes_1 = require("./1644421939510-AddExecutionEntityIndexes");
const _1646992772331_CreateUserManagement_1 = require("./1646992772331-CreateUserManagement");
const _1648740597343_LowerCaseUserEmail_1 = require("./1648740597343-LowerCaseUserEmail");
const _1652367743993_AddUserSettings_1 = require("./1652367743993-AddUserSettings");
const _1652905585850_AddAPIKeyColumn_1 = require("./1652905585850-AddAPIKeyColumn");
const sqliteMigrations = [
    _1588102412422_InitialMigration_1.InitialMigration1588102412422,
    _1592445003908_WebhookModel_1.WebhookModel1592445003908,
    _1594825041918_CreateIndexStoppedAt_1.CreateIndexStoppedAt1594825041918,
    _1611071044839_AddWebhookId_1.AddWebhookId1611071044839,
    _1607431743769_MakeStoppedAtNullable_1.MakeStoppedAtNullable1607431743769,
    _1617213344594_CreateTagEntity_1.CreateTagEntity1617213344594,
    _1620821879465_UniqueWorkflowNames_1.UniqueWorkflowNames1620821879465,
    _1621707690587_AddWaitColumn_1.AddWaitColumn1621707690587,
    _1630330987096_UpdateWorkflowCredentials_1.UpdateWorkflowCredentials1630330987096,
    _1644421939510_AddExecutionEntityIndexes_1.AddExecutionEntityIndexes1644421939510,
    _1646992772331_CreateUserManagement_1.CreateUserManagement1646992772331,
    _1648740597343_LowerCaseUserEmail_1.LowerCaseUserEmail1648740597343,
    _1652367743993_AddUserSettings_1.AddUserSettings1652367743993,
    _1652905585850_AddAPIKeyColumn_1.AddAPIKeyColumn1652905585850,
];
exports.sqliteMigrations = sqliteMigrations;
