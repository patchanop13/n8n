"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserStatusEnum;
(function (UserStatusEnum) {
    UserStatusEnum[UserStatusEnum["ACTIVE"] = 0] = "ACTIVE";
    UserStatusEnum[UserStatusEnum["PENDING_EMAIL_VERIFICATION"] = 1] = "PENDING_EMAIL_VERIFICATION";
    UserStatusEnum[UserStatusEnum["DELETED"] = 2] = "DELETED";
})(UserStatusEnum || (UserStatusEnum = {}));
