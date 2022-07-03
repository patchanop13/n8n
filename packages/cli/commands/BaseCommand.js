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
exports.BaseCommand = void 0;
const core_1 = require("@oclif/core");
const n8n_workflow_1 = require("n8n-workflow");
const Logger_1 = require("../src/Logger");
const User_1 = require("../src/databases/entities/User");
const src_1 = require("../src");
class BaseCommand extends core_1.Command {
    constructor() {
        super(...arguments);
        /**
         * User Management utils
         */
        this.defaultUserProps = {
            firstName: null,
            lastName: null,
            email: null,
            password: null,
            resetPasswordToken: null,
        };
    }
    /**
     * Lifecycle methods
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger = (0, Logger_1.getLogger)();
            n8n_workflow_1.LoggerProxy.init(this.logger);
            yield src_1.Db.init();
        });
    }
    finally() {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.NODE_ENV === 'test')
                return;
            this.exit();
        });
    }
    getInstanceOwner() {
        return __awaiter(this, void 0, void 0, function* () {
            const globalRole = yield src_1.Db.collections.Role.findOneOrFail({
                name: 'owner',
                scope: 'global',
            });
            const owner = yield src_1.Db.collections.User.findOne({ globalRole });
            if (owner)
                return owner;
            const user = new User_1.User();
            Object.assign(user, Object.assign(Object.assign({}, this.defaultUserProps), { globalRole }));
            yield src_1.Db.collections.User.save(user);
            return src_1.Db.collections.User.findOneOrFail({ globalRole });
        });
    }
}
exports.BaseCommand = BaseCommand;
