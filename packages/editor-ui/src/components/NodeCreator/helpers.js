"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchesNodeType = exports.matchesSelectType = exports.getCategorizedList = exports.getCategoriesWithNodes = void 0;
const constants_1 = require("@/constants");
const addNodeToCategory = (accu, nodeType, category, subcategory) => {
    if (!accu[category]) {
        accu[category] = {};
    }
    if (!accu[category][subcategory]) {
        accu[category][subcategory] = {
            triggerCount: 0,
            regularCount: 0,
            nodes: [],
        };
    }
    const isTrigger = nodeType.group.includes('trigger');
    if (isTrigger) {
        accu[category][subcategory].triggerCount++;
    }
    if (!isTrigger) {
        accu[category][subcategory].regularCount++;
    }
    accu[category][subcategory].nodes.push({
        type: 'node',
        key: `${category}_${nodeType.name}`,
        category,
        properties: {
            nodeType,
            subcategory,
        },
        includedByTrigger: isTrigger,
        includedByRegular: !isTrigger,
    });
};
const getCategoriesWithNodes = (nodeTypes, personalizedNodeTypes) => {
    const sorted = [...nodeTypes].sort((a, b) => a.displayName > b.displayName ? 1 : -1);
    return sorted.reduce((accu, nodeType) => {
        if (personalizedNodeTypes.includes(nodeType.name)) {
            addNodeToCategory(accu, nodeType, constants_1.PERSONALIZED_CATEGORY, constants_1.UNCATEGORIZED_SUBCATEGORY);
        }
        if (!nodeType.codex || !nodeType.codex.categories) {
            addNodeToCategory(accu, nodeType, constants_1.UNCATEGORIZED_CATEGORY, constants_1.UNCATEGORIZED_SUBCATEGORY);
            return accu;
        }
        nodeType.codex.categories.forEach((_category) => {
            const category = _category.trim();
            const subcategory = nodeType.codex &&
                nodeType.codex.subcategories &&
                nodeType.codex.subcategories[category]
                ? nodeType.codex.subcategories[category][0]
                : constants_1.UNCATEGORIZED_SUBCATEGORY;
            addNodeToCategory(accu, nodeType, category, subcategory);
        });
        return accu;
    }, {});
};
exports.getCategoriesWithNodes = getCategoriesWithNodes;
const getCategories = (categoriesWithNodes) => {
    const excludeFromSort = [constants_1.CORE_NODES_CATEGORY, constants_1.CUSTOM_NODES_CATEGORY, constants_1.UNCATEGORIZED_CATEGORY, constants_1.PERSONALIZED_CATEGORY];
    const categories = Object.keys(categoriesWithNodes);
    const sorted = categories.filter((category) => !excludeFromSort.includes(category));
    sorted.sort();
    return [constants_1.CORE_NODES_CATEGORY, constants_1.CUSTOM_NODES_CATEGORY, constants_1.PERSONALIZED_CATEGORY, ...sorted, constants_1.UNCATEGORIZED_CATEGORY];
};
const getCategorizedList = (categoriesWithNodes) => {
    const categories = getCategories(categoriesWithNodes);
    return categories.reduce((accu, category) => {
        if (!categoriesWithNodes[category]) {
            return accu;
        }
        const categoryEl = {
            type: 'category',
            key: category,
            category,
            properties: {
                expanded: false,
            },
        };
        const subcategories = Object.keys(categoriesWithNodes[category]);
        if (subcategories.length === 1) {
            const subcategory = categoriesWithNodes[category][subcategories[0]];
            if (subcategory.triggerCount > 0) {
                categoryEl.includedByTrigger = subcategory.triggerCount > 0;
            }
            if (subcategory.regularCount > 0) {
                categoryEl.includedByRegular = subcategory.regularCount > 0;
            }
            return [...accu, categoryEl, ...subcategory.nodes];
        }
        subcategories.sort();
        const subcategorized = subcategories.reduce((accu, subcategory) => {
            const subcategoryEl = {
                type: 'subcategory',
                key: `${category}_${subcategory}`,
                category,
                properties: {
                    subcategory,
                    description: constants_1.SUBCATEGORY_DESCRIPTIONS[category][subcategory],
                },
                includedByTrigger: categoriesWithNodes[category][subcategory].triggerCount > 0,
                includedByRegular: categoriesWithNodes[category][subcategory].regularCount > 0,
            };
            if (subcategoryEl.includedByTrigger) {
                categoryEl.includedByTrigger = true;
            }
            if (subcategoryEl.includedByRegular) {
                categoryEl.includedByRegular = true;
            }
            accu.push(subcategoryEl);
            return accu;
        }, []);
        return [...accu, categoryEl, ...subcategorized];
    }, []);
};
exports.getCategorizedList = getCategorizedList;
const matchesSelectType = (el, selectedType) => {
    if (selectedType === constants_1.REGULAR_NODE_FILTER && el.includedByRegular) {
        return true;
    }
    if (selectedType === constants_1.TRIGGER_NODE_FILTER && el.includedByTrigger) {
        return true;
    }
    return selectedType === constants_1.ALL_NODE_FILTER;
};
exports.matchesSelectType = matchesSelectType;
const matchesAlias = (nodeType, filter) => {
    if (!nodeType.codex || !nodeType.codex.alias) {
        return false;
    }
    return nodeType.codex.alias.reduce((accu, alias) => {
        return accu || alias.toLowerCase().indexOf(filter) > -1;
    }, false);
};
const matchesNodeType = (el, filter) => {
    const nodeType = el.properties.nodeType;
    return nodeType.displayName.toLowerCase().indexOf(filter) !== -1 || matchesAlias(nodeType, filter);
};
exports.matchesNodeType = matchesNodeType;
