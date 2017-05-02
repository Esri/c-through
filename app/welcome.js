/*
 * Title: Welcome Page
 * Author: Lisa Staehli
 * Date: 04/24/17
 * Description: First Page of the application
 * with information about authors and disclaimers,
 * starts the application
 */

define([
    "esri/core/declare",

    "dojo/dom-construct",
    "dojo/_base/window",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/on",
    "dojo/mouse",

    "c-through/app"

], function (
    declare,
    domCtr, win, dom, domStyle, on, mouse,
    App) {

        return declare(null, {

            constructor: function () {
                
            },

            init: function () {

                this.createUI();
                this.clickHandler();
                this.urlParser();

            },

            createUI: function () {

                var container = domCtr.create("div", { id: "welcome" }, win.body());

                domCtr.create("div", { id: "welcomeTitle", className: "animate-bottom", innerHTML: "c-through" }, container);
                domCtr.create("hr", { id: "welcomeLine", className: "animate-bottom", style: "width:300px" }, container);
                domCtr.create("img", { id: "esri-logo", src: "img/Capture.PNG", style: "width:200px;height:48px", top: "65%", left: "35%" }, container);

                domCtr.create("div", { id: "description1", innerHTML: "Internship poject by Lisa Staehli" }, container);
                domCtr.create("div", { id: "description2", innerHTML: "supervised by Javier Gutierrez" }, container);
                this.demoLink = domCtr.create("div", { id: "demo-link", innerHTML: "Demo" }, container);

            },

            clickHandler: function () {

                on(this.demoLink, "click", function (evt) {
                    window.location.href = window.location.href + "?demo";
                }.bind(this));

            },

            urlParser: function () {
                var urlParams = Object.keys(getJsonFromUrl());
                if (urlParams.length >= 1 && urlParams[0] === "demo") {
                    var app = new App();
                    app.init(urlParams[0]);
                }
            }
        });
    });


function getJsonFromUrl() {
    var query = location.search.substr(1);
    var result = {};
    query.split("&").forEach(function (part) {
        var item = part.split("=");
        result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
}