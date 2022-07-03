"use strict";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-cycle */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const typeorm_1 = require("typeorm");
let Settings = class Settings {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)()
], Settings.prototype, "key", void 0);
__decorate([
    (0, typeorm_1.Column)()
], Settings.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)()
], Settings.prototype, "loadOnStartup", void 0);
Settings = __decorate([
    (0, typeorm_1.Entity)()
], Settings);
exports.Settings = Settings;
