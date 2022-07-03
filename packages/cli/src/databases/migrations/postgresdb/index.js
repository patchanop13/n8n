"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresMigrations = void 0;
const _1587669153312_InitialMigration_1 = require("./1587669153312-InitialMigration");
const _1589476000887_WebhookModel_1 = require("./1589476000887-WebhookModel");
const _1594828256133_CreateIndexStoppedAt_1 = require("./1594828256133-CreateIndexStoppedAt");
const _1611144599516_AddWebhookId_1 = require("./1611144599516-AddWebhookId");
const _1607431743768_MakeStoppedAtNullable_1 = require("./1607431743768-MakeStoppedAtNullable");
const _1617270242566_CreateTagEntity_1 = require("./1617270242566-CreateTagEntity");
const _1620824779533_UniqueWorkflowNames_1 = require("./1620824779533-UniqueWorkflowNames");
const _1626176912946_AddwaitTill_1 = require("./1626176912946-AddwaitTill");
const _1630419189837_UpdateWorkflowCredentials_1 = require("./1630419189837-UpdateWorkflowCredentials");
const _1644422880309_AddExecutionEntityIndexes_1 = require("./1644422880309-AddExecutionEntityIndexes");
const _1646834195327_IncreaseTypeVarcharLimit_1 = require("./1646834195327-IncreaseTypeVarcharLimit");
const _1646992772331_CreateUserManagement_1 = require("./1646992772331-CreateUserManagement");
const _1648740597343_LowerCaseUserEmail_1 = require("./1648740597343-LowerCaseUserEmail");
const _1652367743993_AddUserSettings_1 = require("./1652367743993-AddUserSettings");
const _1652905585850_AddAPIKeyColumn_1 = require("./1652905585850-AddAPIKeyColumn");
exports.postgresMigrations = [
    _1587669153312_InitialMigration_1.InitialMigration1587669153312,
    _1589476000887_WebhookModel_1.WebhookModel1589476000887,
    _1594828256133_CreateIndexStoppedAt_1.CreateIndexStoppedAt1594828256133,
    _1611144599516_AddWebhookId_1.AddWebhookId1611144599516,
    _1607431743768_MakeStoppedAtNullable_1.MakeStoppedAtNullable1607431743768,
    _1617270242566_CreateTagEntity_1.CreateTagEntity1617270242566,
    _1620824779533_UniqueWorkflowNames_1.UniqueWorkflowNames1620824779533,
    _1626176912946_AddwaitTill_1.AddwaitTill1626176912946,
    _1630419189837_UpdateWorkflowCredentials_1.UpdateWorkflowCredentials1630419189837,
    _1644422880309_AddExecutionEntityIndexes_1.AddExecutionEntityIndexes1644422880309,
    _1646834195327_IncreaseTypeVarcharLimit_1.IncreaseTypeVarcharLimit1646834195327,
    _1646992772331_CreateUserManagement_1.CreateUserManagement1646992772331,
    _1648740597343_LowerCaseUserEmail_1.LowerCaseUserEmail1648740597343,
    _1652367743993_AddUserSettings_1.AddUserSettings1652367743993,
    _1652905585850_AddAPIKeyColumn_1.AddAPIKeyColumn1652905585850,
];
