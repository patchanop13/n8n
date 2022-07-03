"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Type;
(function (Type) {
    Type[Type["TYPE_UNSPECIFIED"] = 0] = "TYPE_UNSPECIFIED";
    Type[Type["HUMAN"] = 1] = "HUMAN";
    Type[Type["BOT"] = 2] = "BOT";
})(Type || (Type = {}));
// // TODO: define other interfaces
//
// export interface IMessage {s
// 	name?: string;
// 	sender?: IUser;
// 	createTime?: string;
// 	text?: string;
// 	cards?: ICard[];
// 	previewText?: string;
// 	annotations?: IAnnotation[];
// 	thread?: IThread[];
// 	space?: ISpace;
// 	fallbackText?: string;
// 	actionResponse?: IActionResponse;
// 	argumentText?: string;
// 	slashCommand?: ISlashCommand;
// 	attachment?: IAttachment[];
// }
//
// export interface ICard {
// 	header?: ICardHeader;
// 	sections?: ISection[];
// 	cardActions?: ICardAction[];
// 	name?: string;
// }
//
// export interface ICardHeader {
// 	title: string;
// 	subtitle: string;
// 	imageStyle: ImageStyleType;
// 	imageUrl: string;
// }
// enum ImageStyleType {
// 	'IMAGE_STYLE_UNSPECIFIED',
// 	'IMAGE',
// 	'AVATAR',
// }
//
// export interface ISection {
//
// }
//
// export interface ICardAction {
//
// }
//
// export interface IAnnotation {
//
// }
//
// export interface IThread {
//
// }
//
// export interface ISpace {
//
// }
//
// export interface IActionResponse {
//
// }
//
// export interface ISlashCommand {
//
// }
//
// export interface IAttachment {
// // attachments are not available for bots
// }
