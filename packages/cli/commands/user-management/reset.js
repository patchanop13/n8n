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
exports.Reset = void 0;
const typeorm_1 = require("typeorm");
const src_1 = require("../../src");
const BaseCommand_1 = require("../BaseCommand");
class Reset extends BaseCommand_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const owner = yield this.getInstanceOwner();
            const ownerWorkflowRole = yield src_1.Db.collections.Role.findOneOrFail({
                name: 'owner',
                scope: 'workflow',
            });
            const ownerCredentialRole = yield src_1.Db.collections.Role.findOneOrFail({
                name: 'owner',
                scope: 'credential',
            });
            yield src_1.Db.collections.SharedWorkflow.update({ user: { id: (0, typeorm_1.Not)(owner.id) }, role: ownerWorkflowRole }, { user: owner });
            yield src_1.Db.collections.SharedCredentials.update({ user: { id: (0, typeorm_1.Not)(owner.id) }, role: ownerCredentialRole }, { user: owner });
            yield src_1.Db.collections.User.delete({ id: (0, typeorm_1.Not)(owner.id) });
            yield src_1.Db.collections.User.save(Object.assign(owner, this.defaultUserProps));
            yield src_1.Db.collections.Settings.update({ key: 'userManagement.isInstanceOwnerSetUp' }, { value: 'false' });
            yield src_1.Db.collections.Settings.update({ key: 'userManagement.skipInstanceOwnerSetup' }, { value: 'false' });
            this.logger.info('Successfully reset the database to default user state.');
        });
    }
    catch(error) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.error('Error resetting database. See log messages for details.');
            this.logger.error(error.message);
            this.exit(1);
        });
    }
}
exports.Reset = Reset;
Reset.description = '\nResets the database to the default user state';
