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
exports.setTagsForImport = exports.removeRelations = exports.createRelations = exports.getTagsWithCountDb = exports.sortByRequestOrder = void 0;
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-cycle */
const typeorm_1 = require("typeorm");
const TagEntity_1 = require("./databases/entities/TagEntity");
// ----------------------------------
//              utils
// ----------------------------------
/**
 * Sort tags based on the order of the tag IDs in the request.
 */
function sortByRequestOrder(tags, { requestOrder }) {
    const tagMap = tags.reduce((acc, tag) => {
        acc[tag.id.toString()] = tag;
        return acc;
    }, {});
    return requestOrder.map((tagId) => tagMap[tagId]);
}
exports.sortByRequestOrder = sortByRequestOrder;
// ----------------------------------
//             queries
// ----------------------------------
/**
 * Retrieve all tags and the number of workflows each tag is related to.
 */
function getTagsWithCountDb(tablePrefix) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, typeorm_1.getConnection)()
            .createQueryBuilder()
            .select(`${tablePrefix}tag_entity.id`, 'id')
            .addSelect(`${tablePrefix}tag_entity.name`, 'name')
            .addSelect(`${tablePrefix}tag_entity.createdAt`, 'createdAt')
            .addSelect(`${tablePrefix}tag_entity.updatedAt`, 'updatedAt')
            .addSelect(`COUNT(${tablePrefix}workflows_tags.workflowId)`, 'usageCount')
            .from(`${tablePrefix}tag_entity`, 'tag_entity')
            .leftJoin(`${tablePrefix}workflows_tags`, 'workflows_tags', `${tablePrefix}workflows_tags.tagId = tag_entity.id`)
            .groupBy(`${tablePrefix}tag_entity.id`)
            .getRawMany()
            .then((tagsWithCount) => {
            tagsWithCount.forEach((tag) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                tag.id = tag.id.toString();
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                tag.usageCount = Number(tag.usageCount);
            });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return tagsWithCount;
        });
    });
}
exports.getTagsWithCountDb = getTagsWithCountDb;
// ----------------------------------
//             mutations
// ----------------------------------
/**
 * Relate a workflow to one or more tags.
 */
function createRelations(workflowId, tagIds, tablePrefix) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, typeorm_1.getConnection)()
            .createQueryBuilder()
            .insert()
            .into(`${tablePrefix}workflows_tags`)
            .values(tagIds.map((tagId) => ({ workflowId, tagId })))
            .execute();
    });
}
exports.createRelations = createRelations;
/**
 * Remove all tags for a workflow during a tag update operation.
 */
function removeRelations(workflowId, tablePrefix) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, typeorm_1.getConnection)()
            .createQueryBuilder()
            .delete()
            .from(`${tablePrefix}workflows_tags`)
            .where('workflowId = :id', { id: workflowId })
            .execute();
    });
}
exports.removeRelations = removeRelations;
const createTag = (transactionManager, name) => __awaiter(void 0, void 0, void 0, function* () {
    const tag = new TagEntity_1.TagEntity();
    tag.name = name;
    return transactionManager.save(tag);
});
const findOrCreateTag = (transactionManager, importTag, tagsEntities) => __awaiter(void 0, void 0, void 0, function* () {
    // Assume tag is identical if createdAt date is the same to preserve a changed tag name
    const identicalMatch = tagsEntities.find((existingTag) => existingTag.id.toString() === importTag.id.toString() &&
        existingTag.createdAt &&
        importTag.createdAt &&
        existingTag.createdAt.getTime() === new Date(importTag.createdAt).getTime());
    if (identicalMatch) {
        return identicalMatch;
    }
    const nameMatch = tagsEntities.find((existingTag) => existingTag.name === importTag.name);
    if (nameMatch) {
        return nameMatch;
    }
    const created = yield createTag(transactionManager, importTag.name);
    tagsEntities.push(created);
    return created;
});
const hasTags = (workflow) => 'tags' in workflow && Array.isArray(workflow.tags) && workflow.tags.length > 0;
/**
 * Set tag IDs to use existing tags, creates a new tag if no matching tag could be found
 */
function setTagsForImport(transactionManager, workflow, tags) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!hasTags(workflow)) {
            return;
        }
        const workflowTags = workflow.tags;
        const tagLookupPromises = [];
        for (let i = 0; i < workflowTags.length; i++) {
            if ((_a = workflowTags[i]) === null || _a === void 0 ? void 0 : _a.name) {
                const lookupPromise = findOrCreateTag(transactionManager, workflowTags[i], tags).then((tag) => {
                    workflowTags[i] = {
                        id: tag.id,
                        name: tag.name,
                    };
                });
                tagLookupPromises.push(lookupPromise);
            }
        }
        yield Promise.all(tagLookupPromises);
    });
}
exports.setTagsForImport = setTagsForImport;
