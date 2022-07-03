"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mysqlMigrations = void 0;
const _1588157391238_InitialMigration_1 = require("./1588157391238-InitialMigration");
const _1592447867632_WebhookModel_1 = require("./1592447867632-WebhookModel");
const _1594902918301_CreateIndexStoppedAt_1 = require("./1594902918301-CreateIndexStoppedAt");
const _1611149998770_AddWebhookId_1 = require("./1611149998770-AddWebhookId");
const _1607431743767_MakeStoppedAtNullable_1 = require("./1607431743767-MakeStoppedAtNullable");
const _1615306975123_ChangeDataSize_1 = require("./1615306975123-ChangeDataSize");
const _1620729500000_ChangeCredentialDataSize_1 = require("./1620729500000-ChangeCredentialDataSize");
const _1617268711084_CreateTagEntity_1 = require("./1617268711084-CreateTagEntity");
const _1620826335440_UniqueWorkflowNames_1 = require("./1620826335440-UniqueWorkflowNames");
const _1623936588000_CertifyCorrectCollation_1 = require("./1623936588000-CertifyCorrectCollation");
const _1626183952959_AddWaitColumn_1 = require("./1626183952959-AddWaitColumn");
const _1630451444017_UpdateWorkflowCredentials_1 = require("./1630451444017-UpdateWorkflowCredentials");
const _1644424784709_AddExecutionEntityIndexes_1 = require("./1644424784709-AddExecutionEntityIndexes");
const _1646992772331_CreateUserManagement_1 = require("./1646992772331-CreateUserManagement");
const _1648740597343_LowerCaseUserEmail_1 = require("./1648740597343-LowerCaseUserEmail");
const _1652367743993_AddUserSettings_1 = require("./1652367743993-AddUserSettings");
const _1652905585850_AddAPIKeyColumn_1 = require("./1652905585850-AddAPIKeyColumn");
exports.mysqlMigrations = [
    _1588157391238_InitialMigration_1.InitialMigration1588157391238,
    _1592447867632_WebhookModel_1.WebhookModel1592447867632,
    _1594902918301_CreateIndexStoppedAt_1.CreateIndexStoppedAt1594902918301,
    _1611149998770_AddWebhookId_1.AddWebhookId1611149998770,
    _1607431743767_MakeStoppedAtNullable_1.MakeStoppedAtNullable1607431743767,
    _1615306975123_ChangeDataSize_1.ChangeDataSize1615306975123,
    _1620729500000_ChangeCredentialDataSize_1.ChangeCredentialDataSize1620729500000,
    _1617268711084_CreateTagEntity_1.CreateTagEntity1617268711084,
    _1620826335440_UniqueWorkflowNames_1.UniqueWorkflowNames1620826335440,
    _1623936588000_CertifyCorrectCollation_1.CertifyCorrectCollation1623936588000,
    _1626183952959_AddWaitColumn_1.AddWaitColumnId1626183952959,
    _1630451444017_UpdateWorkflowCredentials_1.UpdateWorkflowCredentials1630451444017,
    _1644424784709_AddExecutionEntityIndexes_1.AddExecutionEntityIndexes1644424784709,
    _1646992772331_CreateUserManagement_1.CreateUserManagement1646992772331,
    _1648740597343_LowerCaseUserEmail_1.LowerCaseUserEmail1648740597343,
    _1652367743993_AddUserSettings_1.AddUserSettings1652367743993,
    _1652905585850_AddAPIKeyColumn_1.AddAPIKeyColumn1652905585850,
];
