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
exports.CommandType = exports.SyncHandler = exports.MoveHandler = exports.UpdateHandler = exports.ReopenHandler = exports.GetAllHandler = exports.GetHandler = exports.DeleteHandler = exports.CloseHandler = exports.CreateHandler = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const uuid_1 = require("uuid");
class CreateHandler {
    handleOperation(ctx, itemIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            //https://developer.todoist.com/rest/v1/#create-a-new-task
            const content = ctx.getNodeParameter('content', itemIndex);
            const projectId = ctx.getNodeParameter('project', itemIndex);
            const labels = ctx.getNodeParameter('labels', itemIndex);
            const options = ctx.getNodeParameter('options', itemIndex);
            const body = {
                content,
                project_id: projectId,
                priority: (options.priority) ? parseInt(options.priority, 10) : 1,
            };
            if (options.description) {
                body.description = options.description;
            }
            if (options.dueDateTime) {
                body.due_datetime = (0, GenericFunctions_1.FormatDueDatetime)(options.dueDateTime);
            }
            if (options.dueString) {
                body.due_string = options.dueString;
            }
            if (labels !== undefined && labels.length !== 0) {
                body.label_ids = labels;
            }
            if (options.section) {
                body.section_id = options.section;
            }
            if (options.dueLang) {
                body.due_lang = options.dueLang;
            }
            const data = yield GenericFunctions_1.todoistApiRequest.call(ctx, 'POST', '/tasks', body);
            return {
                data,
            };
        });
    }
}
exports.CreateHandler = CreateHandler;
class CloseHandler {
    handleOperation(ctx, itemIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = ctx.getNodeParameter('taskId', itemIndex);
            yield GenericFunctions_1.todoistApiRequest.call(ctx, 'POST', `/tasks/${id}/close`);
            return {
                success: true,
            };
        });
    }
}
exports.CloseHandler = CloseHandler;
class DeleteHandler {
    handleOperation(ctx, itemIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = ctx.getNodeParameter('taskId', itemIndex);
            const responseData = yield GenericFunctions_1.todoistApiRequest.call(ctx, 'DELETE', `/tasks/${id}`);
            return {
                success: true,
            };
        });
    }
}
exports.DeleteHandler = DeleteHandler;
class GetHandler {
    handleOperation(ctx, itemIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = ctx.getNodeParameter('taskId', itemIndex);
            const responseData = yield GenericFunctions_1.todoistApiRequest.call(ctx, 'GET', `/tasks/${id}`);
            return {
                data: responseData,
            };
        });
    }
}
exports.GetHandler = GetHandler;
class GetAllHandler {
    handleOperation(ctx, itemIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            //https://developer.todoist.com/rest/v1/#get-active-tasks
            const returnAll = ctx.getNodeParameter('returnAll', itemIndex);
            const filters = ctx.getNodeParameter('filters', itemIndex);
            const qs = {};
            if (filters.projectId) {
                qs.project_id = filters.projectId;
            }
            if (filters.labelId) {
                qs.label_id = filters.labelId;
            }
            if (filters.filter) {
                qs.filter = filters.filter;
            }
            if (filters.lang) {
                qs.lang = filters.lang;
            }
            if (filters.ids) {
                qs.ids = filters.ids;
            }
            let responseData = yield GenericFunctions_1.todoistApiRequest.call(ctx, 'GET', '/tasks', {}, qs);
            if (!returnAll) {
                const limit = ctx.getNodeParameter('limit', itemIndex);
                responseData = responseData.splice(0, limit);
            }
            return {
                data: responseData,
            };
        });
    }
}
exports.GetAllHandler = GetAllHandler;
function getSectionIds(ctx, projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        const sections = yield GenericFunctions_1.todoistApiRequest.call(ctx, 'GET', '/sections', {}, { project_id: projectId });
        return new Map(sections.map(s => [s.name, s.id]));
    });
}
class ReopenHandler {
    handleOperation(ctx, itemIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            //https://developer.todoist.com/rest/v1/#get-an-active-task
            const id = ctx.getNodeParameter('taskId', itemIndex);
            const responseData = yield GenericFunctions_1.todoistApiRequest.call(ctx, 'POST', `/tasks/${id}/reopen`);
            return {
                data: responseData,
            };
        });
    }
}
exports.ReopenHandler = ReopenHandler;
class UpdateHandler {
    handleOperation(ctx, itemIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            //https://developer.todoist.com/rest/v1/#update-a-task
            const id = ctx.getNodeParameter('taskId', itemIndex);
            const updateFields = ctx.getNodeParameter('updateFields', itemIndex);
            const body = {};
            if (updateFields.content) {
                body.content = updateFields.content;
            }
            if (updateFields.priority) {
                body.priority = parseInt(updateFields.priority, 10);
            }
            if (updateFields.description) {
                body.description = updateFields.description;
            }
            if (updateFields.dueDateTime) {
                body.due_datetime = (0, GenericFunctions_1.FormatDueDatetime)(updateFields.dueDateTime);
            }
            if (updateFields.dueString) {
                body.due_string = updateFields.dueString;
            }
            if (updateFields.labels !== undefined &&
                Array.isArray(updateFields.labels) &&
                updateFields.labels.length !== 0) {
                body.label_ids = updateFields.labels;
            }
            if (updateFields.dueLang) {
                body.due_lang = updateFields.dueLang;
            }
            yield GenericFunctions_1.todoistApiRequest.call(ctx, 'POST', `/tasks/${id}`, body);
            return { success: true };
        });
    }
}
exports.UpdateHandler = UpdateHandler;
class MoveHandler {
    handleOperation(ctx, itemIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            //https://api.todoist.com/sync/v8/sync
            const taskId = ctx.getNodeParameter('taskId', itemIndex);
            const section = ctx.getNodeParameter('section', itemIndex);
            const body = {
                commands: [
                    {
                        type: CommandType.ITEM_MOVE,
                        uuid: (0, uuid_1.v4)(),
                        args: {
                            id: taskId,
                            section_id: section,
                        },
                    },
                ],
            };
            yield GenericFunctions_1.todoistSyncRequest.call(ctx, body);
            return { success: true };
        });
    }
}
exports.MoveHandler = MoveHandler;
class SyncHandler {
    handleOperation(ctx, itemIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const commandsJson = ctx.getNodeParameter('commands', itemIndex);
            const projectId = ctx.getNodeParameter('project', itemIndex);
            const sections = yield getSectionIds(ctx, projectId);
            const commands = JSON.parse(commandsJson);
            const tempIdMapping = new Map();
            for (let i = 0; i < commands.length; i++) {
                const command = commands[i];
                this.enrichUUID(command);
                this.enrichSection(command, sections);
                this.enrichProjectId(command, projectId);
                this.enrichTempId(command, tempIdMapping, projectId);
            }
            const body = {
                commands,
                temp_id_mapping: this.convertToObject(tempIdMapping),
            };
            yield GenericFunctions_1.todoistSyncRequest.call(ctx, body);
            return { success: true };
        });
    }
    convertToObject(map) {
        return Array.from(map.entries()).reduce((o, [key, value]) => {
            // @ts-ignore
            o[key] = value;
            return o;
        }, {});
    }
    enrichUUID(command) {
        command.uuid = (0, uuid_1.v4)();
    }
    enrichSection(command, sections) {
        if (command.args !== undefined && command.args.section !== undefined) {
            const sectionId = sections.get(command.args.section);
            if (sectionId) {
                command.args.section_id = sectionId;
            }
            else {
                throw new Error('Section ' + command.args.section + ' doesn\'t exist on Todoist');
            }
        }
    }
    enrichProjectId(command, projectId) {
        if (this.requiresProjectId(command)) {
            command.args.project_id = projectId;
        }
    }
    requiresProjectId(command) {
        return command.type === CommandType.ITEM_ADD;
    }
    enrichTempId(command, tempIdMapping, projectId) {
        if (this.requiresTempId(command)) {
            command.temp_id = (0, uuid_1.v4)();
            tempIdMapping.set(command.temp_id, projectId);
        }
    }
    requiresTempId(command) {
        return command.type === CommandType.ITEM_ADD;
    }
}
exports.SyncHandler = SyncHandler;
var CommandType;
(function (CommandType) {
    CommandType["ITEM_MOVE"] = "item_move";
    CommandType["ITEM_ADD"] = "item_add";
    CommandType["ITEM_UPDATE"] = "item_update";
    CommandType["ITEM_REORDER"] = "item_reorder";
    CommandType["ITEM_DELETE"] = "item_delete";
    CommandType["ITEM_COMPLETE"] = "item_complete";
})(CommandType = exports.CommandType || (exports.CommandType = {}));
