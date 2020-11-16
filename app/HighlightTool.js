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
 * Title: Highlight Tool
 * Author: Lisa Staehli
 * Date: 04/24/17
 * Description: handles click events
 * on features and queries feature layer
 * for building id of clicked feature, 
 * additionally supports multiple selection 
 * by holding the SHIFT key.
 */

define([
    "esri/core/Accessor",
    "esri/tasks/support/Query",

    "dojo/dom-construct",
    "dojo/_base/window",
    "dojo/dom",
    "dojo/on",

    "c-through/VizTool",
    "c-through/FilterTool",
    "c-through/support/queryTools"

], function (
    Accessor, Query,
    domCtr, win, dom, on,
    VizTool, FilterTool, queryTools
) {
        return Accessor.createSubclass({
            declaredClass: "c-through.HighlightTool",

            constructor: function (params) {

                this.container = params.container;
                this.menu = params.menu;
                this.scene = params.scene;
                this.state = params.highlightstate;
                this.settings = params.settings;
                this.view = params.view;

                this.createUI();
                this.updateUI(this.state.name);
                this.clickHandler();
            },

            createUI: function () {
                this.label = domCtr.create("div", { className: "labelSelect", id: "labelSelect", innerHTML: "Selection" }, this.container);
                this.numberofbuildings = domCtr.create("div", { id: "buildingInfo", innerHTML: "" }, this.container);

            },

            updateHighlightState: function (state) {
                this.stateName = state.name;
                this.selection = state.features;

                var expression = this.settings.buildingIDname + " IN (" + state.features + ")";
                state.expression = expression;

                this.menu.setHighlightState(state);
                this.updateUI(this.stateName);

            },

            setHighlightState: function (state) {
                this.stateName = state.name;
                this.selection = state.features;

                this.updateUI(this.stateName);
            },

            updateUI: function (state) {

                if (state === "city") {
                    this.label.innerHTML = "Selection: City Level";
                }

                if (state === "building") {
                    this.label.innerHTML = "Selection: Building Level";
                }

                if (state === "multiple buildings") {
                    this.label.innerHTML = "Selection: Multiple Buildings";
                }
            },

            clickHandler: function () {
                var view = this.view;

                var viewDiv = dom.byId("viewDiv");

                on(viewDiv, "click", function (event) {
                    this.shiftKey = event.shiftKey;
                    return this.shiftKey;
                }.bind(this));

                view.on("click", function (event) {
                    view.hitTest(event.screenPoint).then(function (response) {
                        var result = response.results[0];

                        if (!result) {
                            this.menu.resetFilterUI("highlight");
                        }
                        else {
                            var buildingIDs = this.selection;

                            if (result && result.graphic) {
                                if (event.native.shiftKey) {
                                    if (this.stateName === "building" || this.stateName === "multiple buildings") {
                                        this.processGraphic(result.graphic, function (buildingID) {
                                            if (this.settings.name === "Zurich" || this.settings.name === "Vancouver" || this.settings.name === "Demo") {
                                                buildingIDs = String(buildingIDs).concat(", " + buildingID);
                                                this.updateHighlightState({ name: "multiple buildings", features: buildingIDs });
                                            } else {
                                                buildingIDs = buildingIDs.concat(", '" + buildingID + "'");
                                                this.updateHighlightState({ name: "multiple buildings", features: buildingIDs });
                                            }
                                        }.bind(this));
                                    } else {
                                        this.processGraphic(result.graphic, function (buildingID) {
                                            if (this.settings.name === "Zurich" || this.settings.name === "Vancouver" || this.settings.name === "Demo"){
                                                this.updateHighlightState({ name: "building", features: buildingID});

                                            } else {
                                                this.updateHighlightState({ name: "building", features: "'" + buildingID + "'" });
                                            }
                                        }.bind(this));

                                    }
                                } else {
                                    this.processGraphic(result.graphic, function (buildingID) {
                                        if (this.settings.name === "Zurich" || this.settings.name === "Vancouver" || this.settings.name === "Demo"){
                                                this.updateHighlightState({ name: "building", features: buildingID});

                                            } else {
                                                this.updateHighlightState({ name: "building", features: "'" + buildingID + "'" });
                                            }
                                    }.bind(this));
                                }

                            }
                        }

                    }.bind(this)).catch(function (err) {
                        console.error(err);
                    });
                }.bind(this));
            },

            processGraphic: function (graphic, callback) {

                var selectedOID = graphic.attributes[this.settings.OIDname];

                var query = new Query();

                query.objectIds = [selectedOID];
                query.returnGeometry = false;
                query.outFields = [this.settings.buildingIDname];

                this.settings.layer1.queryFeatures(query).then(function (results) {

                    if (results.features[0] === undefined) {
                        console.log("Wrong ObjectID");
                    }

                    var buildingID = results.features[0].attributes[this.settings.buildingIDname];

                    callback(buildingID);

                }.bind(this)).catch(function (err) {
                    console.error(err);
                });
            }
        });
    }
);