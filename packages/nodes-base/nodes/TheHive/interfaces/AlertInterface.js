"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TLP = exports.AlertStatus = void 0;
var AlertStatus;
(function (AlertStatus) {
    AlertStatus["NEW"] = "New";
    AlertStatus["UPDATED"] = "Updated";
    AlertStatus["IGNORED"] = "Ignored";
    AlertStatus["IMPORTED"] = "Imported";
})(AlertStatus = exports.AlertStatus || (exports.AlertStatus = {}));
var TLP;
(function (TLP) {
    TLP[TLP["white"] = 0] = "white";
    TLP[TLP["green"] = 1] = "green";
    TLP[TLP["amber"] = 2] = "amber";
    TLP[TLP["red"] = 3] = "red";
})(TLP = exports.TLP || (exports.TLP = {}));
