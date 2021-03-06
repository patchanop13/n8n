"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipientWallet = exports.RecipientType = void 0;
var RecipientType;
(function (RecipientType) {
    RecipientType["email"] = "EMAIL";
    RecipientType["phone"] = "PHONE";
    RecipientType["paypalId"] = "PAYPAL_ID";
})(RecipientType = exports.RecipientType || (exports.RecipientType = {}));
var RecipientWallet;
(function (RecipientWallet) {
    RecipientWallet["paypal"] = "PAYPAL";
    RecipientWallet["venmo"] = "VENMO";
})(RecipientWallet = exports.RecipientWallet || (exports.RecipientWallet = {}));
