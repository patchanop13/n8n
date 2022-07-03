"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBackgroundStyles = exports.getRelativePosition = exports.getMousePosition = exports.getNewNodePosition = exports.getIcon = exports.showOrHideItemsLabel = exports.getConnectorLengths = exports.showOrHideMidpointArrow = exports.hideOverlay = exports.showOverlay = exports.getOverlay = exports.scaleReset = exports.scaleBigger = exports.scaleSmaller = exports.getWorkflowCorners = exports.getLeftmostTopNode = exports.addOverlays = exports.getOutputNameOverlay = exports.getOutputEndpointStyle = exports.getInputNameOverlay = exports.getInputEndpointStyle = exports.ANCHOR_POSITIONS = exports.CONNECTOR_ARROW_OVERLAYS = exports.CONNECTOR_PAINT_STYLE_SUCCESS = exports.CONNECTOR_PAINT_STYLE_PRIMARY = exports.CONNECTOR_PAINT_STYLE_PULL = exports.CONNECTOR_PAINT_STYLE_DEFAULT = exports.CONNECTOR_FLOWCHART_TYPE = exports.WELCOME_STICKY_NODE = exports.DEFAULT_START_NODE = exports.OUTPUT_UUID_KEY = exports.INPUT_UUID_KEY = exports.PUSH_NODES_OFFSET = exports.MAX_X_TO_PUSH_DOWNSTREAM_NODES = exports.SIDEBAR_WIDTH = exports.HEADER_HEIGHT = exports.DEFAULT_START_POSITION_Y = exports.DEFAULT_START_POSITION_X = exports.NODE_SIZE = exports.GRID_SIZE = exports.OVERLAY_OUTPUT_NAME_LABEL = exports.OVERLAY_INPUT_NAME_LABEL_POSITION_MOVED = exports.OVERLAY_INPUT_NAME_LABEL_POSITION = exports.OVERLAY_INPUT_NAME_LABEL = exports.JSPLUMB_FLOWCHART_STUB = exports.OVERLAY_CONNECTION_ACTIONS_ID = exports.OVERLAY_RUN_ITEMS_ID = exports.OVERLAY_ENDPOINT_ARROW_ID = exports.OVERLAY_MIDPOINT_ARROW_ID = exports.OVERLAY_DROP_NODE_ID = void 0;
exports.getFixedNodesList = exports.getInputEndpointUUID = exports.getOutputEndpointUUID = exports.addConnectionActionsOverlay = exports.moveBackInputLabelPosition = exports.resetInputLabelPosition = exports.resetConnectionAfterPull = exports.showPullConnectionState = exports.showDropConnectionState = exports.getZoomToFit = exports.addConnectionOutputSuccess = exports.getRunItemsLabel = exports.resetConnection = exports.getOutputSummary = exports.showConectionActions = exports.hideConnectionActions = void 0;
const helpers_1 = require("@/components/helpers");
const constants_1 = require("@/constants");
exports.OVERLAY_DROP_NODE_ID = 'drop-add-node';
exports.OVERLAY_MIDPOINT_ARROW_ID = 'midpoint-arrow';
exports.OVERLAY_ENDPOINT_ARROW_ID = 'endpoint-arrow';
exports.OVERLAY_RUN_ITEMS_ID = 'run-items-label';
exports.OVERLAY_CONNECTION_ACTIONS_ID = 'connection-actions';
exports.JSPLUMB_FLOWCHART_STUB = 26;
exports.OVERLAY_INPUT_NAME_LABEL = 'input-name-label';
exports.OVERLAY_INPUT_NAME_LABEL_POSITION = [-3, .5];
exports.OVERLAY_INPUT_NAME_LABEL_POSITION_MOVED = [-4.5, .5];
exports.OVERLAY_OUTPUT_NAME_LABEL = 'output-name-label';
exports.GRID_SIZE = 20;
const MIN_X_TO_SHOW_OUTPUT_LABEL = 90;
const MIN_Y_TO_SHOW_OUTPUT_LABEL = 100;
exports.NODE_SIZE = 100;
exports.DEFAULT_START_POSITION_X = 240;
exports.DEFAULT_START_POSITION_Y = 300;
exports.HEADER_HEIGHT = 65;
exports.SIDEBAR_WIDTH = 65;
exports.MAX_X_TO_PUSH_DOWNSTREAM_NODES = 300;
exports.PUSH_NODES_OFFSET = exports.NODE_SIZE * 2 + exports.GRID_SIZE;
const LOOPBACK_MINIMUM = 140;
exports.INPUT_UUID_KEY = '-input';
exports.OUTPUT_UUID_KEY = '-output';
exports.DEFAULT_START_NODE = {
    name: 'Start',
    type: constants_1.START_NODE_TYPE,
    typeVersion: 1,
    position: [
        exports.DEFAULT_START_POSITION_X,
        exports.DEFAULT_START_POSITION_Y,
    ],
    parameters: {},
};
exports.WELCOME_STICKY_NODE = {
    name: constants_1.QUICKSTART_NOTE_NAME,
    type: constants_1.STICKY_NODE_TYPE,
    typeVersion: 1,
    position: [
        -260,
        200,
    ],
    parameters: {
        height: 300,
        width: 380,
    },
};
exports.CONNECTOR_FLOWCHART_TYPE = ['N8nCustom', {
        cornerRadius: 12,
        stub: exports.JSPLUMB_FLOWCHART_STUB + 10,
        targetGap: 4,
        alwaysRespectStubs: false,
        loopbackVerticalLength: exports.NODE_SIZE + exports.GRID_SIZE,
        loopbackMinimum: LOOPBACK_MINIMUM,
        getEndpointOffset(endpoint) {
            const indexOffset = 10; // stub offset between different endpoints of same node
            const index = endpoint && endpoint.__meta ? endpoint.__meta.index : 0;
            const totalEndpoints = endpoint && endpoint.__meta ? endpoint.__meta.totalEndpoints : 0;
            const outputOverlay = (0, exports.getOverlay)(endpoint, exports.OVERLAY_OUTPUT_NAME_LABEL);
            const labelOffset = outputOverlay && outputOverlay.label && outputOverlay.label.length > 1 ? 10 : 0;
            const outputsOffset = totalEndpoints > 3 ? 24 : 0; // avoid intersecting plus
            return index * indexOffset + labelOffset + outputsOffset;
        },
    }];
exports.CONNECTOR_PAINT_STYLE_DEFAULT = {
    stroke: (0, helpers_1.getStyleTokenValue)('--color-foreground-dark'),
    strokeWidth: 2,
    outlineWidth: 12,
    outlineStroke: 'transparent',
};
exports.CONNECTOR_PAINT_STYLE_PULL = Object.assign(Object.assign({}, exports.CONNECTOR_PAINT_STYLE_DEFAULT), { stroke: (0, helpers_1.getStyleTokenValue)('--color-foreground-xdark') });
exports.CONNECTOR_PAINT_STYLE_PRIMARY = Object.assign(Object.assign({}, exports.CONNECTOR_PAINT_STYLE_DEFAULT), { stroke: (0, helpers_1.getStyleTokenValue)('--color-primary') });
exports.CONNECTOR_PAINT_STYLE_SUCCESS = Object.assign(Object.assign({}, exports.CONNECTOR_PAINT_STYLE_DEFAULT), { stroke: (0, helpers_1.getStyleTokenValue)('--color-success-light') });
exports.CONNECTOR_ARROW_OVERLAYS = [
    [
        'Arrow',
        {
            id: exports.OVERLAY_ENDPOINT_ARROW_ID,
            location: 1,
            width: 12,
            foldback: 1,
            length: 10,
            visible: true,
        },
    ],
    [
        'Arrow',
        {
            id: exports.OVERLAY_MIDPOINT_ARROW_ID,
            location: 0.5,
            width: 12,
            foldback: 1,
            length: 10,
            visible: false,
        },
    ],
];
exports.ANCHOR_POSITIONS = {
    input: {
        1: [
            [0.01, 0.5, -1, 0],
        ],
        2: [
            [0.01, 0.3, -1, 0],
            [0.01, 0.7, -1, 0],
        ],
        3: [
            [0.01, 0.25, -1, 0],
            [0.01, 0.5, -1, 0],
            [0.01, 0.75, -1, 0],
        ],
        4: [
            [0.01, 0.2, -1, 0],
            [0.01, 0.4, -1, 0],
            [0.01, 0.6, -1, 0],
            [0.01, 0.8, -1, 0],
        ],
    },
    output: {
        1: [
            [.99, 0.5, 1, 0],
        ],
        2: [
            [.99, 0.3, 1, 0],
            [.99, 0.7, 1, 0],
        ],
        3: [
            [.99, 0.25, 1, 0],
            [.99, 0.5, 1, 0],
            [.99, 0.75, 1, 0],
        ],
        4: [
            [.99, 0.2, 1, 0],
            [.99, 0.4, 1, 0],
            [.99, 0.6, 1, 0],
            [.99, 0.8, 1, 0],
        ],
    },
};
const getInputEndpointStyle = (nodeTypeData, color) => ({
    width: 8,
    height: nodeTypeData && nodeTypeData.outputs.length > 2 ? 18 : 20,
    fill: (0, helpers_1.getStyleTokenValue)(color),
    stroke: (0, helpers_1.getStyleTokenValue)(color),
    lineWidth: 0,
});
exports.getInputEndpointStyle = getInputEndpointStyle;
const getInputNameOverlay = (label) => ([
    'Label',
    {
        id: exports.OVERLAY_INPUT_NAME_LABEL,
        location: exports.OVERLAY_INPUT_NAME_LABEL_POSITION,
        label,
        cssClass: 'node-input-endpoint-label',
        visible: true,
    },
]);
exports.getInputNameOverlay = getInputNameOverlay;
const getOutputEndpointStyle = (nodeTypeData, color) => ({
    radius: nodeTypeData && nodeTypeData.outputs.length > 2 ? 7 : 9,
    fill: (0, helpers_1.getStyleTokenValue)(color),
    outlineStroke: 'none',
});
exports.getOutputEndpointStyle = getOutputEndpointStyle;
const getOutputNameOverlay = (label) => ([
    'Label',
    {
        id: exports.OVERLAY_OUTPUT_NAME_LABEL,
        location: [1.9, 0.5],
        label,
        cssClass: 'node-output-endpoint-label',
        visible: true,
    },
]);
exports.getOutputNameOverlay = getOutputNameOverlay;
const addOverlays = (connection, overlays) => {
    overlays.forEach((overlay) => {
        connection.addOverlay(overlay);
    });
};
exports.addOverlays = addOverlays;
const getLeftmostTopNode = (nodes) => {
    return nodes.reduce((leftmostTop, node) => {
        if (node.position[0] > leftmostTop.position[0] || node.position[1] > leftmostTop.position[1]) {
            return leftmostTop;
        }
        return node;
    });
};
exports.getLeftmostTopNode = getLeftmostTopNode;
const getWorkflowCorners = (nodes) => {
    return nodes.reduce((accu, node) => {
        const xOffset = node.type === constants_1.STICKY_NODE_TYPE && (0, helpers_1.isNumber)(node.parameters.width) ? node.parameters.width : exports.NODE_SIZE;
        const yOffset = node.type === constants_1.STICKY_NODE_TYPE && (0, helpers_1.isNumber)(node.parameters.height) ? node.parameters.height : exports.NODE_SIZE;
        const x = node.position[0];
        const y = node.position[1];
        if (x < accu.minX) {
            accu.minX = x;
        }
        if (y < accu.minY) {
            accu.minY = y;
        }
        if ((x + xOffset) > accu.maxX) {
            accu.maxX = x + xOffset;
        }
        if ((y + yOffset) > accu.maxY) {
            accu.maxY = y + yOffset;
        }
        return accu;
    }, {
        minX: nodes[0].position[0],
        minY: nodes[0].position[1],
        maxX: nodes[0].position[0],
        maxY: nodes[0].position[1],
    });
};
exports.getWorkflowCorners = getWorkflowCorners;
const scaleSmaller = ({ scale, offset: [xOffset, yOffset] }) => {
    scale /= 1.25;
    xOffset /= 1.25;
    yOffset /= 1.25;
    xOffset += window.innerWidth / 10;
    yOffset += window.innerHeight / 10;
    return {
        scale,
        offset: [xOffset, yOffset],
    };
};
exports.scaleSmaller = scaleSmaller;
const scaleBigger = ({ scale, offset: [xOffset, yOffset] }) => {
    scale *= 1.25;
    xOffset -= window.innerWidth / 10;
    yOffset -= window.innerHeight / 10;
    xOffset *= 1.25;
    yOffset *= 1.25;
    return {
        scale,
        offset: [xOffset, yOffset],
    };
};
exports.scaleBigger = scaleBigger;
const scaleReset = (config) => {
    if (config.scale > 1) { // zoomed in
        while (config.scale > 1) {
            config = (0, exports.scaleSmaller)(config);
        }
    }
    else {
        while (config.scale < 1) {
            config = (0, exports.scaleBigger)(config);
        }
    }
    config.scale = 1;
    return config;
};
exports.scaleReset = scaleReset;
const getOverlay = (item, overlayId) => {
    try {
        return item.getOverlay(overlayId); // handle when _jsPlumb element is deleted
    }
    catch (e) {
        return null;
    }
};
exports.getOverlay = getOverlay;
const showOverlay = (item, overlayId) => {
    const overlay = (0, exports.getOverlay)(item, overlayId);
    if (overlay) {
        overlay.setVisible(true);
    }
};
exports.showOverlay = showOverlay;
const hideOverlay = (item, overlayId) => {
    const overlay = (0, exports.getOverlay)(item, overlayId);
    if (overlay) {
        overlay.setVisible(false);
    }
};
exports.hideOverlay = hideOverlay;
const showOrHideMidpointArrow = (connection) => {
    if (!connection || !connection.endpoints || connection.endpoints.length !== 2) {
        return;
    }
    const hasItemsLabel = !!(0, exports.getOverlay)(connection, exports.OVERLAY_RUN_ITEMS_ID);
    const sourceEndpoint = connection.endpoints[0];
    const targetEndpoint = connection.endpoints[1];
    const sourcePosition = sourceEndpoint.anchor.lastReturnValue[0];
    const targetPosition = targetEndpoint.anchor.lastReturnValue ? targetEndpoint.anchor.lastReturnValue[0] : sourcePosition + 1; // lastReturnValue is null when moving connections from node to another
    const minimum = hasItemsLabel ? 150 : 0;
    const isBackwards = sourcePosition >= targetPosition;
    const isTooLong = Math.abs(sourcePosition - targetPosition) >= minimum;
    const arrow = (0, exports.getOverlay)(connection, exports.OVERLAY_MIDPOINT_ARROW_ID);
    if (arrow) {
        arrow.setVisible(isBackwards && isTooLong);
        arrow.setLocation(hasItemsLabel ? .6 : .5);
    }
};
exports.showOrHideMidpointArrow = showOrHideMidpointArrow;
const getConnectorLengths = (connection) => {
    if (!connection.connector) {
        return [0, 0];
    }
    const bounds = connection.connector.bounds;
    const diffX = Math.abs(bounds.maxX - bounds.minX);
    const diffY = Math.abs(bounds.maxY - bounds.minY);
    return [diffX, diffY];
};
exports.getConnectorLengths = getConnectorLengths;
const isLoopingBackwards = (connection) => {
    const sourceEndpoint = connection.endpoints[0];
    const targetEndpoint = connection.endpoints[1];
    const sourcePosition = sourceEndpoint.anchor.lastReturnValue[0];
    const targetPosition = targetEndpoint.anchor.lastReturnValue[0];
    return targetPosition - sourcePosition < (-1 * LOOPBACK_MINIMUM);
};
const showOrHideItemsLabel = (connection) => {
    if (!connection || !connection.connector) {
        return;
    }
    const overlay = (0, exports.getOverlay)(connection, exports.OVERLAY_RUN_ITEMS_ID);
    if (!overlay) {
        return;
    }
    const actionsOverlay = (0, exports.getOverlay)(connection, exports.OVERLAY_CONNECTION_ACTIONS_ID);
    if (actionsOverlay && actionsOverlay.visible) {
        overlay.setVisible(false);
        return;
    }
    const [diffX, diffY] = (0, exports.getConnectorLengths)(connection);
    if (diffX < MIN_X_TO_SHOW_OUTPUT_LABEL && diffY < MIN_Y_TO_SHOW_OUTPUT_LABEL) {
        overlay.setVisible(false);
    }
    else {
        overlay.setVisible(true);
    }
    const innerElement = overlay.canvas && overlay.canvas.querySelector('span');
    if (innerElement) {
        if (diffY === 0 || isLoopingBackwards(connection)) {
            innerElement.classList.add('floating');
        }
        else {
            innerElement.classList.remove('floating');
        }
    }
};
exports.showOrHideItemsLabel = showOrHideItemsLabel;
const getIcon = (name) => {
    if (name === 'trash') {
        return `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-trash fa-w-14 Icon__medium_ctPPJ"><path data-v-66d5c7e2="" fill="currentColor" d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z" class=""></path></svg>`;
    }
    if (name === 'plus') {
        return `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-plus fa-w-14 Icon__medium_ctPPJ"><path data-v-301ed208="" fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" class=""></path></svg>`;
    }
    return '';
};
exports.getIcon = getIcon;
const canUsePosition = (position1, position2) => {
    if (Math.abs(position1[0] - position2[0]) <= 100) {
        if (Math.abs(position1[1] - position2[1]) <= 50) {
            return false;
        }
    }
    return true;
};
const getNewNodePosition = (nodes, newPosition, movePosition) => {
    const targetPosition = [...newPosition];
    targetPosition[0] = targetPosition[0] - (targetPosition[0] % exports.GRID_SIZE);
    targetPosition[1] = targetPosition[1] - (targetPosition[1] % exports.GRID_SIZE);
    if (!movePosition) {
        movePosition = [40, 40];
    }
    let conflictFound = false;
    let i, node;
    do {
        conflictFound = false;
        for (i = 0; i < nodes.length; i++) {
            node = nodes[i];
            if (!canUsePosition(node.position, targetPosition)) {
                conflictFound = true;
                break;
            }
        }
        if (conflictFound === true) {
            targetPosition[0] += movePosition[0];
            targetPosition[1] += movePosition[1];
        }
    } while (conflictFound === true);
    return targetPosition;
};
exports.getNewNodePosition = getNewNodePosition;
const getMousePosition = (e) => {
    // @ts-ignore
    const x = e.pageX !== undefined ? e.pageX : (e.touches && e.touches[0] && e.touches[0].pageX ? e.touches[0].pageX : 0);
    // @ts-ignore
    const y = e.pageY !== undefined ? e.pageY : (e.touches && e.touches[0] && e.touches[0].pageY ? e.touches[0].pageY : 0);
    return [x, y];
};
exports.getMousePosition = getMousePosition;
const getRelativePosition = (x, y, scale, offset) => {
    return [
        (x - offset[0]) / scale,
        (y - offset[1]) / scale,
    ];
};
exports.getRelativePosition = getRelativePosition;
const getBackgroundStyles = (scale, offsetPosition) => {
    const squareSize = exports.GRID_SIZE * scale;
    const dotSize = 1 * scale;
    const dotPosition = (exports.GRID_SIZE / 2) * scale;
    const styles = {
        'background-size': `${squareSize}px ${squareSize}px`,
        'background-position': `left ${offsetPosition[0]}px top ${offsetPosition[1]}px`,
    };
    if (squareSize > 10.5) {
        const dotColor = (0, helpers_1.getStyleTokenValue)('--color-canvas-dot');
        return Object.assign(Object.assign({}, styles), { 'background-image': `radial-gradient(circle at ${dotPosition}px ${dotPosition}px, ${dotColor} ${dotSize}px, transparent 0)` });
    }
    return styles;
};
exports.getBackgroundStyles = getBackgroundStyles;
const hideConnectionActions = (connection) => {
    if (connection && connection.connector) {
        (0, exports.hideOverlay)(connection, exports.OVERLAY_CONNECTION_ACTIONS_ID);
        (0, exports.showOrHideItemsLabel)(connection);
        (0, exports.showOrHideMidpointArrow)(connection);
    }
};
exports.hideConnectionActions = hideConnectionActions;
const showConectionActions = (connection) => {
    if (connection && connection.connector) {
        (0, exports.showOverlay)(connection, exports.OVERLAY_CONNECTION_ACTIONS_ID);
        (0, exports.hideOverlay)(connection, exports.OVERLAY_RUN_ITEMS_ID);
        if (!(0, exports.getOverlay)(connection, exports.OVERLAY_RUN_ITEMS_ID)) {
            (0, exports.hideOverlay)(connection, exports.OVERLAY_MIDPOINT_ARROW_ID);
        }
    }
};
exports.showConectionActions = showConectionActions;
const getOutputSummary = (data, nodeConnections) => {
    const outputMap = {};
    data.forEach((run) => {
        if (!run.data || !run.data.main) {
            return;
        }
        run.data.main.forEach((output, i) => {
            const sourceOutputIndex = i;
            if (!outputMap[sourceOutputIndex]) {
                outputMap[sourceOutputIndex] = {};
            }
            if (!outputMap[sourceOutputIndex][constants_1.NODE_OUTPUT_DEFAULT_KEY]) {
                outputMap[sourceOutputIndex][constants_1.NODE_OUTPUT_DEFAULT_KEY] = {};
                outputMap[sourceOutputIndex][constants_1.NODE_OUTPUT_DEFAULT_KEY][0] = {
                    total: 0,
                    iterations: 0,
                };
            }
            const defaultOutput = outputMap[sourceOutputIndex][constants_1.NODE_OUTPUT_DEFAULT_KEY][0];
            defaultOutput.total += output ? output.length : 0;
            defaultOutput.iterations += output ? 1 : 0;
            if (!nodeConnections[sourceOutputIndex]) {
                return;
            }
            nodeConnections[sourceOutputIndex]
                .map((connection) => {
                const targetNodeName = connection.node;
                const targetInputIndex = connection.index;
                if (!outputMap[sourceOutputIndex][targetNodeName]) {
                    outputMap[sourceOutputIndex][targetNodeName] = {};
                }
                if (!outputMap[sourceOutputIndex][targetNodeName][targetInputIndex]) {
                    outputMap[sourceOutputIndex][targetNodeName][targetInputIndex] = {
                        total: 0,
                        iterations: 0,
                    };
                }
                outputMap[sourceOutputIndex][targetNodeName][targetInputIndex].total += output ? output.length : 0;
                outputMap[sourceOutputIndex][targetNodeName][targetInputIndex].iterations += output ? 1 : 0;
            });
        });
    });
    return outputMap;
};
exports.getOutputSummary = getOutputSummary;
const resetConnection = (connection) => {
    connection.removeOverlay(exports.OVERLAY_RUN_ITEMS_ID);
    connection.setPaintStyle(exports.CONNECTOR_PAINT_STYLE_DEFAULT);
    (0, exports.showOrHideMidpointArrow)(connection);
    if (connection.canvas) {
        connection.canvas.classList.remove('success');
    }
};
exports.resetConnection = resetConnection;
const getRunItemsLabel = (output) => {
    let label = `${output.total}`;
    label = output.total > 1 ? `${label} items` : `${label} item`;
    label = output.iterations > 1 ? `${label} total` : label;
    return label;
};
exports.getRunItemsLabel = getRunItemsLabel;
const addConnectionOutputSuccess = (connection, output) => {
    connection.setPaintStyle(exports.CONNECTOR_PAINT_STYLE_SUCCESS);
    if (connection.canvas) {
        connection.canvas.classList.add('success');
    }
    if ((0, exports.getOverlay)(connection, exports.OVERLAY_RUN_ITEMS_ID)) {
        connection.removeOverlay(exports.OVERLAY_RUN_ITEMS_ID);
    }
    connection.addOverlay([
        'Label',
        {
            id: exports.OVERLAY_RUN_ITEMS_ID,
            label: `<span>${(0, exports.getRunItemsLabel)(output)}</span>`,
            cssClass: 'connection-run-items-label',
            location: .5,
        },
    ]);
    (0, exports.showOrHideItemsLabel)(connection);
    (0, exports.showOrHideMidpointArrow)(connection);
};
exports.addConnectionOutputSuccess = addConnectionOutputSuccess;
const getZoomToFit = (nodes, addComponentPadding = true) => {
    const { minX, minY, maxX, maxY } = (0, exports.getWorkflowCorners)(nodes);
    const sidebarWidth = addComponentPadding ? exports.SIDEBAR_WIDTH : 0;
    const headerHeight = addComponentPadding ? exports.HEADER_HEIGHT : 0;
    const footerHeight = addComponentPadding ? 200 : 100;
    const PADDING = exports.NODE_SIZE * 4;
    const editorWidth = window.innerWidth;
    const diffX = maxX - minX + sidebarWidth + PADDING;
    const scaleX = editorWidth / diffX;
    const editorHeight = window.innerHeight;
    const diffY = maxY - minY + headerHeight + PADDING;
    const scaleY = editorHeight / diffY;
    const zoomLevel = Math.min(scaleX, scaleY, 1);
    let xOffset = (minX * -1) * zoomLevel + sidebarWidth; // find top right corner
    xOffset += (editorWidth - sidebarWidth - (maxX - minX) * zoomLevel) / 2; // add padding to center workflow
    let yOffset = (minY * -1) * zoomLevel + headerHeight; // find top right corner
    yOffset += (editorHeight - headerHeight - (maxY - minY + footerHeight) * zoomLevel) / 2; // add padding to center workflow
    return {
        zoomLevel,
        offset: [xOffset, yOffset],
    };
};
exports.getZoomToFit = getZoomToFit;
const showDropConnectionState = (connection, targetEndpoint) => {
    if (connection && connection.connector) {
        if (targetEndpoint) {
            connection.connector.setTargetEndpoint(targetEndpoint);
        }
        connection.setPaintStyle(exports.CONNECTOR_PAINT_STYLE_PRIMARY);
        (0, exports.hideOverlay)(connection, exports.OVERLAY_DROP_NODE_ID);
    }
};
exports.showDropConnectionState = showDropConnectionState;
const showPullConnectionState = (connection) => {
    if (connection && connection.connector) {
        connection.connector.resetTargetEndpoint();
        connection.setPaintStyle(exports.CONNECTOR_PAINT_STYLE_PULL);
        (0, exports.showOverlay)(connection, exports.OVERLAY_DROP_NODE_ID);
    }
};
exports.showPullConnectionState = showPullConnectionState;
const resetConnectionAfterPull = (connection) => {
    if (connection && connection.connector) {
        connection.connector.resetTargetEndpoint();
        connection.setPaintStyle(exports.CONNECTOR_PAINT_STYLE_DEFAULT);
    }
};
exports.resetConnectionAfterPull = resetConnectionAfterPull;
const resetInputLabelPosition = (targetEndpoint) => {
    const inputNameOverlay = (0, exports.getOverlay)(targetEndpoint, exports.OVERLAY_INPUT_NAME_LABEL);
    if (inputNameOverlay) {
        inputNameOverlay.setLocation(exports.OVERLAY_INPUT_NAME_LABEL_POSITION);
    }
};
exports.resetInputLabelPosition = resetInputLabelPosition;
const moveBackInputLabelPosition = (targetEndpoint) => {
    const inputNameOverlay = (0, exports.getOverlay)(targetEndpoint, exports.OVERLAY_INPUT_NAME_LABEL);
    if (inputNameOverlay) {
        inputNameOverlay.setLocation(exports.OVERLAY_INPUT_NAME_LABEL_POSITION_MOVED);
    }
};
exports.moveBackInputLabelPosition = moveBackInputLabelPosition;
const addConnectionActionsOverlay = (connection, onDelete, onAdd) => {
    if ((0, exports.getOverlay)(connection, exports.OVERLAY_CONNECTION_ACTIONS_ID)) {
        return; // avoid free floating actions when moving connection from one node to another
    }
    connection.addOverlay([
        'Label',
        {
            id: exports.OVERLAY_CONNECTION_ACTIONS_ID,
            label: `<div class="add">${(0, exports.getIcon)('plus')}</div> <div class="delete">${(0, exports.getIcon)('trash')}</div>`,
            cssClass: exports.OVERLAY_CONNECTION_ACTIONS_ID,
            visible: false,
            events: {
                mousedown: (overlay, event) => {
                    const element = event.target;
                    if (element.classList.contains('delete') || (element.parentElement && element.parentElement.classList.contains('delete'))) {
                        onDelete();
                    }
                    else if (element.classList.contains('add') || (element.parentElement && element.parentElement.classList.contains('add'))) {
                        onAdd();
                    }
                },
            },
        },
    ]);
};
exports.addConnectionActionsOverlay = addConnectionActionsOverlay;
const getOutputEndpointUUID = (nodeIndex, outputIndex) => {
    return `${nodeIndex}${exports.OUTPUT_UUID_KEY}${outputIndex}`;
};
exports.getOutputEndpointUUID = getOutputEndpointUUID;
const getInputEndpointUUID = (nodeIndex, inputIndex) => {
    return `${nodeIndex}${exports.INPUT_UUID_KEY}${inputIndex}`;
};
exports.getInputEndpointUUID = getInputEndpointUUID;
const getFixedNodesList = (workflowNodes) => {
    const nodes = [...workflowNodes];
    const hasStartNode = !!nodes.find(node => node.type === constants_1.START_NODE_TYPE);
    const leftmostTop = (0, exports.getLeftmostTopNode)(nodes);
    const diffX = exports.DEFAULT_START_POSITION_X - leftmostTop.position[0];
    const diffY = exports.DEFAULT_START_POSITION_Y - leftmostTop.position[1];
    nodes.map((node) => {
        node.position[0] += diffX + (hasStartNode ? 0 : exports.NODE_SIZE * 2);
        node.position[1] += diffY;
    });
    if (!hasStartNode) {
        nodes.push(Object.assign({}, exports.DEFAULT_START_NODE));
    }
    return nodes;
};
exports.getFixedNodesList = getFixedNodesList;
