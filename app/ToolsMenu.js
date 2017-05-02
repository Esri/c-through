 /* Copyright 2017 Esri

   Licensed under the Apache License, Version 2.0 (the "License");

   you may not use this file except in compliance with the License.

   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software

   distributed under the License is distributed on an "AS IS" BASIS,

   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

   See the License for the specific language governing permissions and

   limitations under the License.
   ​
   */

/*
 * Title: Tools Menu
 * Author: Lisa Staehli
 * Date: 04/24/17
 * Description: creates the three tools
 * (highlight, visualization, filter) and
 * combines the various filter and selection
 * options to one definition expression.
 */

define([
    "esri/core/declare",

    "dojo/dom-construct",
    "dojo/_base/window",
    "dojo/dom",

    "c-through/HighlightTool",
    "c-through/VizTool",
    "c-through/FilterTool"

], function (
    declare,
    domCtr, win, dom,
    HighlightTool, VizTool, FilterTool
) {

        return declare(null, {
            constructor: function (params) {

                this.settings = params.config;
                this.scene = params.map;
                this.view = params.view;

                this.state = params.state;

                this.createUI();
                this.setupTools();
            },

            createUI: function () {
                this.containerSelect = domCtr.create("div", { className: "containerSelect" }, dom.byId("toolsMenu"));
                this.containerViz = domCtr.create("div", { className: "containerViz" }, dom.byId("toolsMenu"));
                this.containerFilter = domCtr.create("div", { className: "containerFilter", id: "containerFilter" }, dom.byId("toolsMenu"));

            },

            setupTools: function () {

                this.highlightTool = new HighlightTool({
                    container: this.containerSelect,
                    menu: this,
                    map: this.scene,
                    highlightstate: this.state.highlight,
                    settings: this.settings,
                    view: this.view
                });

                this.setLoadingState("busy");

                this.vizTool = new VizTool({
                    container: this.containerViz,
                    menu: this,
                    map: this.scene,
                    vizstate: this.state.viz,
                    highlightstate: this.state.highlight,
                    filterstate: this.state.filter,
                    settings: this.settings,
                    view: this.view
                });

            },

            setInitData: function (data) {
                this.initData = data;

                this.filterTool = new FilterTool({
                    container: this.containerFilter,
                    menu: this,
                    map: this.scene,
                    filterstate: this.state.filter,
                    settings: this.settings,
                    initData: data
                });

                this.setLoadingState("loaded");
            },

            setLoadingState: function (state) {
                this.loadingstate = state;

                if (state === "loaded") {
                    domCtr.destroy(dom.byId("loader"));
                    domCtr.destroy(dom.byId("toolsMenuBusy"));
                }

                if (state === "busy") {
                    domCtr.create("div", { id: "toolsMenuBusy" }, win.body());
                    domCtr.create("div", { id: "loader" }, dom.byId("toolsMenuBusy"));
                }

            },

            setHighlightState: function (state) {
                this.state.highlight = state;
                this.highlightTool.setHighlightState(state);

                this.state.combinedExpression = this.calculateCombinedExpression(this.settings);
                this.setVizState(this.state.viz, this.state.filter, state, this.state.combinedExpression);
                this.filterTool.setFilterState(this.state);
            },

            setVizState: function (state) {
                this.state.viz = state;

                this.vizTool.setVizState(this.state.viz, this.state.filter, this.state.highlight, this.state.combinedExpression);
            },

            resetFilterUI: function (mode) {
                this.filterTool.resetUI(this.state.filter, function (state) {
                    this.state.filter = state;
                    if (mode == "filter") {
                        this.setHighlightState(this.state.highlight);
                    }
                    if (mode == "highlight") {
                        this.setHighlightState({ name: "city", expression: undefined });
                    }
                }.bind(this));
            },

            setFilterState: function (state) {
                this.state.filter = state;

                this.state.combinedExpression = this.calculateCombinedExpression(this.settings);

                this.setVizState(this.state.viz, this.state.filter, this.state.highlight, this.state.combinedExpression);
                this.filterTool.setFilterState(this.state);
            },

            calculateCombinedExpression: function (settings) {
                var h = this.state.highlight.expression;
                var u = this.state.filter.usageFeatures;
                var f = this.state.filter.floorFeatures;
                var a = this.state.filter.areaFeatures;

                var expressions = [h, u, f, a];
                var combinedExpression = expressions.filter(item => item != undefined).join(" AND ");

                return combinedExpression;
            }
        });
    }
);