/*
 * Title: Filter Tool
 * Author: Lisa Staehli
 * Date: 04/24/17
 * Description: constructs filter dropdowns
 * and area slider and triggers interactions
 * with filter options. Sends selected options
 * to tools menu.
 */

define([
    "esri/core/declare",
    "esri/tasks/support/Query",

    "dojo/dom-construct",
    "dojo/_base/window",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/on",

    "dojo/parser",
    "dijit/registry",
    "dijit/form/TextBox",
    "dijit/form/Button",
    "dijit",

    "c-through/support/queryTools",
    "c-through/support/applyRenderer",
    "c-through/support/chartMaker",
    "c-through/support/barMaker"


], function (
    declare, Query,
    domCtr, win, dom, domStyle, on,
    parser, registry, TextBox, Button, dijit,
    queryTools, applyRenderer,
    chartMaker, barMaker
) {
        return declare(null, {
            constructor: function (params) {

                this.container = params.container;
                this.menu = params.menu;
                this.scene = params.scene;
                this.state = params.filterstate;
                this.settings = params.settings;
                this.initData = params.initData;

                this.createUI(this.container);
            },

            updateFilterState: function (stateName, selection) {
                this.state.name = stateName;
                switch (stateName) {
                    case "area": this.state.areaFeatures = selection;
                        break;
                    case "floor": this.state.floorFeatures = selection;
                        break;
                    case "usage": this.state.usageFeatures = selection;
                        break;
                    case "none":
                        this.state.usageFeatures = undefined;
                        this.state.floorFeatures = undefined;
                        this.state.areaFeatures = undefined;
                }

                this.menu.setFilterState(this.state);

            },

            resetUI: function (filterstate, callback) {

                // reset filter UI to default

                filterstate.name = "none";
                filterstate.usageFeatures = undefined;
                filterstate.floorFeatures = undefined;
                filterstate.areaFeatures = undefined;

                callback(filterstate);

            },

            updateUI: function (state) {

                if (state.name === "none") {
                    domCtr.destroy(dom.byId("filter-floors"));
                    domCtr.destroy(dom.byId("filter-usage"));
                    domCtr.destroy(dom.byId("filterAreaMin"));
                    domCtr.destroy(dom.byId("AreaMaxText"));
                    domCtr.destroy(dom.byId("AreaMinText"));

                    this.createFilterFloorUI(this.container);
                    this.createFilterUsageUI(this.container);
                    this.createFilterAreaUI(this.container);

                } else {

                    if (state.floorFeatures !== undefined) {
                        if (state.usageFeatures !== undefined) {
                            if (state.areaFeatures !== undefined) {
                                return;
                            }
                            else {
                                domCtr.destroy(dom.byId("filterAreaMin"));
                                domCtr.destroy(dom.byId("AreaMaxText"));
                                domCtr.destroy(dom.byId("AreaMinText"));

                                this.createFilterAreaUI(this.container);
                            }
                        }
                        else if (state.areaFeatures !== undefined) {
                            domCtr.destroy(dom.byId("filter-usage"));
                            this.createFilterUsageUI(this.container);
                        }
                        else {
                            domCtr.destroy(dom.byId("filter-usage"));
                            domCtr.destroy(dom.byId("filterAreaMin"));
                            domCtr.destroy(dom.byId("AreaMaxText"));
                            domCtr.destroy(dom.byId("AreaMinText"));

                            this.createFilterUsageUI(this.container);
                            this.createFilterAreaUI(this.container);
                        }
                    } else if (state.usageFeatures !== undefined) {
                        if (state.areaFeatures !== undefined) {
                            domCtr.destroy(dom.byId("filter-floors"));
                            this.createFilterFloorUI(this.container);
                        } else {
                            domCtr.destroy(dom.byId("filter-floors"));
                            domCtr.destroy(dom.byId("filterAreaMin"));
                            domCtr.destroy(dom.byId("AreaMaxText"));
                            domCtr.destroy(dom.byId("AreaMinText"));
                            this.createFilterFloorUI(this.container);
                            this.createFilterAreaUI(this.container);
                        }

                    } else if (state.areaFeatures !== undefined && state.usageFeatures !== undefined) {
                        domCtr.destroy(dom.byId("filter-floors"));
                        domCtr.destroy(dom.byId("filter-usage"));
                        this.createFilterFloorUI(this.container);
                        this.createFilterUsageUI(this.container);
                    }
                }
            },

            setFilterState: function (state) {
                this.state = state.filter;
                this.selection = state.combinedFilteredFeatures;

                this.updateUI(this.state);
            },

            createUI: function (container) {

                this.titleFilter = domCtr.create("div", { className: "titleFilter", id: "titleFilter", innerHTML: "Filter by" }, container);
                domCtr.create("div", { className: "titleFilter", id: "titleAreaMin", innerHTML: "Min Area" }, container);
                domCtr.create("div", { className: "titleFilter", id: "titleAreaMax", innerHTML: "Max Area" }, container);

                this.reset = domCtr.create("div", { className: "button", id: "reset", innerHTML: "Reset" }, container);

                this.createFilterFloorUI(this.container);
                this.createFilterUsageUI(this.container);
                this.createFilterAreaUI(this.container);

                on(this.reset, "click", function (evt) {

                    this.menu.resetFilterUI("filter");

                }.bind(this));

            },

            createFilterFloorUI: function (container) {

                this.LevelFilterContainer = domCtr.create("div", { className: "FilterLabel", id: "filter-floors" }, container);

                queryTools.distinctValues(this.settings.layer1, this.settings.floorname, this.settings.OIDname, function (distinctValues) {
                    distinctValues.sort();
                    distinctValues.unshift("Select Floor");

                    this.setDropdown("FloorLevel", distinctValues, this.LevelFilterContainer, function (floorSelector) {
                        this.floorSelector = floorSelector;
                    }.bind(this));

                    this.onChangeFloor = this.dropdownChangeFloor(this.floorSelector, this.settings.floorname, "floor");

                }.bind(this));

            },

            createFilterUsageUI: function (container) {
                this.UsageFilterContainer = domCtr.create("div", { className: "FilterLabel", id: "filter-usage" }, container);

                queryTools.distinctValues(this.settings.layer1, this.settings.usagename, this.settings.OIDname, function (distinctValues) {
                    distinctValues.sort();
                    distinctValues.unshift("Select Usage");

                    this.setDropdown("Usage", distinctValues, this.UsageFilterContainer, function (usageSelector) {
                        this.usageSelector = usageSelector;
                    }.bind(this));

                    this.onChangeUsage = this.dropdownChangeUsage(this.usageSelector, this.settings.usagename, "usage");

                }.bind(this));

            },

            createFilterAreaUI: function (container) {

                this.UsageAreaContainer = domCtr.create("div", { className: "Area", id: "filterAreaMin" }, container);

                this.areaTextBox(this.settings, "area", this.selection);

            },


            areaTextBox: function (settings, state, selection) {

                var max, min;

                queryTools.distinctValues(this.settings.layer1, this.settings.areaname, this.settings.OIDname, function (distinctValues) {

                    distinctValues.sort(function (a, b) {
                        return a - b;
                    });

                    max = Math.ceil(distinctValues[distinctValues.length - 1]);
                    min = Math.floor(distinctValues[0]);

                    this.max = max;
                    this.min = min;

                    var menu = this.menu;

                    var filterAreaMin = dom.byId("filterAreaMin");
                    var filterAreaWrapper = domCtr.create("div", { style: "position:relative" }, filterAreaMin);
                    this.sliderDomNode = domCtr.create("div", {}, filterAreaWrapper);

                    if (min === max) {
                        alert("No area range can be displayed because there is only one feature filtered.");

                    } else {

                        this.sliderInstance = noUiSlider.create(this.sliderDomNode, {
                            start: [min, max],
                            step: 10,
                            connect: true,
                            range: {
                                "min": min,
                                "max": max
                            }
                        });

                    }

                    var areaMaxText = domCtr.create("input", { id: "AreaMaxText", type: "text", value: "0" }, filterAreaWrapper);
                    var areaMinText = domCtr.create("input", { id: "AreaMinText", type: "text", value: "0" }, filterAreaWrapper);

                    this.upper = max;
                    this.lower = min;

                    this.sliderInstance.on("end", function (values) {
                        this.upper = Math.round(values[1]);
                        this.lower = Math.round(values[0]);
                        areaMaxText.value = this.upper;
                        areaMinText.value = this.lower;
                        this.applyFilter(this.settings, this.state, this.menu, this.lower, this.upper, function (selection) {
                            this.updateFilterState("area", selection);
                        }.bind(this));

                    }.bind(this));

                    this.sliderInstance.on("update", function (values) {
                        areaMaxText.value = Math.round(values[1]);
                        areaMinText.value = Math.round(values[0]);
                    });

                    on(areaMinText, "change", function (event) {
                        this.sliderInstance.set([event.target.value, null]);
                        this.lower = event.target.value;
                        this.applyFilter(this.settings, this.state, this.menu, this.lower, this.upper, function (selection) {
                            this.updateFilterState("area", selection);
                        }.bind(this));
                    }.bind(this));

                    on(areaMaxText, "change", function (event) {
                        this.sliderInstance.set([null, event.target.value]);
                        this.upper = event.target.value;
                        this.applyFilter(this.settings, this.state, this.menu, this.lower, this.upper, function (selection) {
                            this.updateFilterState("area", selection);
                        }.bind(this));
                    }.bind(this));

                }.bind(this));

            },

            applyFilter: function (settings, state, menu, lower, upper, callback) {

                if (lower !== undefined && upper !== undefined) {

                    this.filter = state;

                    var expression = settings.areaname + " >= " + lower + " AND " + settings.areaname + " <= " + upper;

                    callback(expression);

                }

            },

            setDropdown: function (name, distinctValues, container, callback) {

                var nameSelector = domCtr.create("select", { id: name, className: "filterDropdown" }, container);
                distinctValues.forEach(function (value) {
                    domCtr.create("option", { value: value, innerHTML: value }, nameSelector);
                });

                callback(nameSelector);

            },

            dropdownChangeFloor: function (nameSelector, fieldname, state) {

                on(nameSelector, "change", function () {
                    this.updateFilterFeatures(nameSelector, fieldname, "floor");
                }.bind(this));
            },

            dropdownChangeUsage: function (nameSelector, fieldname, state) {

                on(nameSelector, "change", function () {
                    this.updateFilterFeatures(nameSelector, fieldname, "usage");
                }.bind(this));
            },

            updateFilterFeatures: function (nameSelector, fieldname, state) {

                for (var i = 0; i < nameSelector.options.length; i++) {
                    if (nameSelector.options[i].selected === true) {
                        if (nameSelector.options[0].selected === true) {
                            this.updateFilterState(state, undefined);

                        } else {

                            this.filter = state;

                            var expression = "";

                            if (this.settings.name === "Zurich" && this.filter === "floor" || this.settings.name === "Demo" && this.filter === "floor"){
                                expression = fieldname + "= " + nameSelector.options[i].value;
                            } else {
                                expression = fieldname + "= '" + nameSelector.options[i].value + "'";
                            }

                            this.updateFilterState(state, expression);

                        }
                    }
                }
            },

            optionsUI: function (distinctValues) {
                var options = [];

                for (var i = 0; i < distinctValues.length + 1; i++) {
                    if (distinctValues[i] === 0) {
                        options.push({
                            value: "0",
                            label: "Groundfloor"
                        });
                    } else {
                        options.push({
                            value: distinctValues[i],
                            label: String(distinctValues[i])
                        });
                    }
                }

                return options;
            }
        });
    }


);

function maxIterate(arr) {
    var max = arr[0];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

function minIterate(arr, max) {
    var cleanarr = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i]) {
            cleanarr.push(arr[i]);
        }
    }
    var min = max;
    for (var j = 0; j < cleanarr.length; j++) {
        if (cleanarr[j] < min) {
            min = cleanarr[j];
        }
    }
    return min;
}