define([
    "esri/core/declare",
    "esri/tasks/support/Query"

], function (
    declare,
    Query

) {
        return {

            distinctValues: function (layer, fieldname, OIDname, callback) {

                var query = layer.createQuery();

                var values = [];
                
                query.returnGeometry = false;
                query.returnDistinctValues = true;
                query.outFields = [fieldname];

                layer.load().then(function () {

                    return layer.queryFeatures(query);

                }).then(function (results) {

                    var selection = results.features;

                    for (var i = 0; i < selection.length; i++) {
                        values.push(selection[i].attributes[fieldname]);
                    }

                    values.sort(function (a, b) { return a - b; });

                    for (var j = 0; j < values.length; j++) {
                        if (values[j] === null || values[j] === undefined) {
                            values.splice(j, 1);
                        }
                    }

                    callback(values);

                }.bind(this)).otherwise(function (err) {
                    console.error(err);
                });


            },

            pagedQuery: function (layer, query, currentOffset, currentResult, index, callback) {

                query.start = currentOffset;
                query.num = 8000;

                layer.queryFeatures(query).then(function (result) {

                    var selection = result.features;

                    for (var i = 0; i < selection.length; i++) {
                        currentResult.push(selection[i]);
                    }

                    if (result.exceededTransferLimit) {

                        currentOffset += 8000;

                        this.pagedQuery(layer, query, currentOffset, currentResult, index, callback);
                    }
                    else {
                        callback(currentResult, index);
                    }
                }.bind(this)).otherwise(function(e){
                    console.error(e);
                });
            }
        };
    });