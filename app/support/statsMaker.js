define([
    "esri/core/declare",

    "dojo/dom-construct",
    "dojo/_base/window",
    "dojo/dom",

    "c-through/support/applyRenderer",
    "c-through/support/chartMaker",
    "c-through/support/queryTools",
    "esri/tasks/support/StatisticDefinition",
    "esri/tasks/support/Query"

], function (
    declare,
    domCtr, win, dom,
    applyRenderer,
    chartMaker,
    queryTools,
    StatisticDefinition,
    Query
) {
        return {

            createChartData: function (data, settings, view) {

                var chartData = {
                    numberofUnits: null,
                    numberofBuildings: null,
                    mostCommonUsage: {
                        usage: null
                    },
                    averageArea: null,
                    areaMax: null,
                    floorMax: null,
                    averageFloor: null
                };

                function sum (a, b) {
                    return (isNaN(a) ? 0 : a) + (isNaN(b) ? 0 : b);
                }

                chartData.numberofUnits = data.length;

                // usage data

                var usageData = chartMaker.createChartData(data, settings);

                usageData.sort(function (a, b) { return a.area - b.area; });

                var usageAreaSum = 0;

                for (var i = 0; i < usageData.length; i++) {
                        usageAreaSum += usageData[i].area;
                }
                
                if (usageAreaSum === 0){
                    chartData.mostCommonUsage.usage = "0ther";
                } else{
                    chartData.mostCommonUsage = usageData[usageData.length - 1];
                }

                // area data
                
                var areaData = [];

                for (var j = 0; j < data.length; j++) {
                    if (data[j].attributes[settings.areaname] !== null) {
                        areaData.push(data[j].attributes[settings.areaname]);
                    }
                }

                areaData.sort(function (a, b) { return a - b; });

                chartData.areaMax = Math.round(areaData[areaData.length - 1]);

                var areaSum = areaData.reduce(sum, 0);

                chartData.averageArea = Math.round(areaSum / (areaData.length - 1));

                if (areaData.length === 1){
                    chartData.averageArea = areaData[0];
                }

                // floor data

                var floorData = [];

                for (var j = 0; j < data.length; j++) {
                    var value = data[j].attributes[settings.floorname];
                    if (value !== null && typeof value !== "string") {
                        floorData.push(data[j].attributes[settings.floorname]);
                    }
                    if (typeof value === "string"){
                        floorData.push(Number(data[j].attributes[settings.floorname]));
                    }
                }

                floorData.sort(function (a, b) { return (isNaN(a) ? 0 : a) - (isNaN(b) ? 0 : b);});

                chartData.floorMax = Math.round(floorData[floorData.length - 1]);

                var floorSum = floorData.reduce(sum, 0);

                chartData.averageFloor = Math.round(floorSum / (floorData.length - 1));

                if (floorData.length === 1){
                    chartData.averageFloor = floorData[0];
                }

                // building data

                var buildingData = [];

                for (var k = 0; k < data.length; k++) {
                    if (data[k].attributes[settings.buildingIDname] !== null) {
                        buildingData.push(data[k].attributes[settings.buildingIDname]);
                    }
                }

                function onlyUnique (value, index, self) {
                    return self.indexOf(value) === index;
                }

                var buildingDataunique = buildingData.filter(onlyUnique);

                chartData.numberofBuildings = buildingDataunique.length;

                return chartData;

            },

            createChart: function(data, callback){

                dom.byId("buildingInfo").innerHTML = "Number of Buildings: " + data.numberofBuildings;
                dom.byId("numberofunits").innerHTML = "<b>Number of Units:</b>      " + data.numberofUnits;
                dom.byId("usage").innerHTML = "<b>Most common usage:</b>        " + data.mostCommonUsage.usage;
                dom.byId("averagearea").innerHTML = "<b>Average Area:</b>       " + data.averageArea + " m2";
                dom.byId("maxarea").innerHTML = "<b>Max Area:</b>       " + data.areaMax + " m2";
                dom.byId("averagefloor").innerHTML = "<b>Average Floor Number:</b>      " + data.averageFloor;
                dom.byId("maxfloor").innerHTML = "<b>Max Floor Number:</b>      " + data.floorMax;

                callback("loaded");

            }
        };
    });