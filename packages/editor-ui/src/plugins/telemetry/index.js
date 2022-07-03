"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryPlugin = void 0;
function TelemetryPlugin(vue) {
    const telemetry = new Telemetry();
    Object.defineProperty(vue, '$telemetry', {
        get() { return telemetry; },
    });
    Object.defineProperty(vue.prototype, '$telemetry', {
        get() { return telemetry; },
    });
}
exports.TelemetryPlugin = TelemetryPlugin;
class Telemetry {
    constructor() {
        this.userNodesPanelSession = {
            sessionId: '',
            data: {
                nodeFilter: '',
                resultsNodes: [],
                filterMode: 'Regular',
            },
        };
        this.pageEventQueue = [];
        this.previousPath = '';
        this.store = null;
    }
    get telemetry() {
        // @ts-ignore
        return window.rudderanalytics;
    }
    init(options, { instanceId, logLevel, userId, store }) {
        if (options.enabled && !this.telemetry) {
            if (!options.config) {
                return;
            }
            this.store = store;
            const logging = logLevel === 'debug' ? { logLevel: 'DEBUG' } : {};
            this.loadTelemetryLibrary(options.config.key, options.config.url, Object.assign({ integrations: { All: false }, loadIntegration: false }, logging));
            this.identify(instanceId, userId);
            this.flushPageEvents();
        }
    }
    identify(instanceId, userId) {
        const traits = { instance_id: instanceId };
        if (userId) {
            this.telemetry.identify(`${instanceId}#${userId}`, traits);
        }
        else {
            this.telemetry.reset();
            this.telemetry.identify(undefined, traits);
        }
    }
    track(event, properties) {
        if (this.telemetry) {
            this.telemetry.track(event, properties);
        }
    }
    page(route) {
        if (this.telemetry) {
            if (route.path === this.previousPath) { // avoid duplicate requests query is changed for example on search page
                return;
            }
            this.previousPath = route.path;
            const pageName = route.name;
            let properties = {};
            if (this.store && route.meta && route.meta.telemetry && typeof route.meta.telemetry.getProperties === 'function') {
                properties = route.meta.telemetry.getProperties(route, this.store);
            }
            const category = (route.meta && route.meta.telemetry && route.meta.telemetry.pageCategory) || 'Editor';
            this.telemetry.page(category, pageName, properties);
        }
        else {
            this.pageEventQueue.push({
                route,
            });
        }
    }
    flushPageEvents() {
        const queue = this.pageEventQueue;
        this.pageEventQueue = [];
        queue.forEach(({ route }) => {
            this.page(route);
        });
    }
    trackNodesPanel(event, properties = {}) {
        if (this.telemetry) {
            properties.nodes_panel_session_id = this.userNodesPanelSession.sessionId;
            switch (event) {
                case 'nodeView.createNodeActiveChanged':
                    if (properties.createNodeActive !== false) {
                        this.resetNodesPanelSession();
                        properties.nodes_panel_session_id = this.userNodesPanelSession.sessionId;
                        this.telemetry.track('User opened nodes panel', properties);
                    }
                    break;
                case 'nodeCreateList.selectedTypeChanged':
                    this.userNodesPanelSession.data.filterMode = properties.new_filter;
                    this.telemetry.track('User changed nodes panel filter', properties);
                    break;
                case 'nodeCreateList.destroyed':
                    if (this.userNodesPanelSession.data.nodeFilter.length > 0 && this.userNodesPanelSession.data.nodeFilter !== '') {
                        this.telemetry.track('User entered nodes panel search term', this.generateNodesPanelEvent());
                    }
                    break;
                case 'nodeCreateList.nodeFilterChanged':
                    if (properties.newValue.length === 0 && this.userNodesPanelSession.data.nodeFilter.length > 0) {
                        this.telemetry.track('User entered nodes panel search term', this.generateNodesPanelEvent());
                    }
                    if (properties.newValue.length > (properties.oldValue || '').length) {
                        this.userNodesPanelSession.data.nodeFilter = properties.newValue;
                        this.userNodesPanelSession.data.resultsNodes = (properties.filteredNodes || []).map((node) => node.key);
                    }
                    break;
                case 'nodeCreateList.onCategoryExpanded':
                    properties.is_subcategory = false;
                    this.telemetry.track('User viewed node category', properties);
                    break;
                case 'nodeCreateList.onSubcategorySelected':
                    const selectedProperties = properties.selected.properties;
                    if (selectedProperties && selectedProperties.subcategory) {
                        properties.category_name = selectedProperties.subcategory;
                    }
                    properties.is_subcategory = true;
                    delete properties.selected;
                    this.telemetry.track('User viewed node category', properties);
                    break;
                case 'nodeView.addNodeButton':
                    this.telemetry.track('User added node to workflow canvas', properties);
                    break;
                case 'nodeView.addSticky':
                    this.telemetry.track('User inserted workflow note', properties);
                    break;
                default:
                    break;
            }
        }
    }
    resetNodesPanelSession() {
        this.userNodesPanelSession.sessionId = `nodes_panel_session_${(new Date()).valueOf()}`;
        this.userNodesPanelSession.data = {
            nodeFilter: '',
            resultsNodes: [],
            filterMode: 'All',
        };
    }
    generateNodesPanelEvent() {
        return {
            search_string: this.userNodesPanelSession.data.nodeFilter,
            results_count: this.userNodesPanelSession.data.resultsNodes.length,
            filter_mode: this.userNodesPanelSession.data.filterMode,
            nodes_panel_session_id: this.userNodesPanelSession.sessionId,
        };
    }
    loadTelemetryLibrary(key, url, options) {
        // @ts-ignore
        window.rudderanalytics = window.rudderanalytics || [];
        this.telemetry.methods = ["load", "page", "track", "identify", "alias", "group", "ready", "reset", "getAnonymousId", "setAnonymousId"];
        this.telemetry.factory = (t) => {
            return (...args) => {
                const r = Array.prototype.slice.call(args);
                r.unshift(t);
                this.telemetry.push(r);
                return this.telemetry;
            };
        };
        for (let t = 0; t < this.telemetry.methods.length; t++) {
            const r = this.telemetry.methods[t];
            this.telemetry[r] = this.telemetry.factory(r);
        }
        this.telemetry.loadJS = () => {
            const r = document.createElement("script");
            r.type = "text/javascript";
            r.async = !0;
            r.src = "https://cdn.rudderlabs.com/v1/rudder-analytics.min.js";
            const a = document.getElementsByTagName("script")[0];
            if (a && a.parentNode) {
                a.parentNode.insertBefore(r, a);
            }
        };
        this.telemetry.loadJS();
        this.telemetry.load(key, url, options);
    }
}
