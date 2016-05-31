/**
 * This file is the primary javascript for the neighboarhood map app
 */

var theMap = new Map();

var viewModelData = new viewModel(theMap);

var panoObj = new PanoObject(viewModelData.contentString, viewModelData.currentPoint);

var foursquareInit = new foursquareAPI(panoObj);


/**
 * This executes when the DOM is loaded
 * Applies the KnockoutJS bindings from the View model,
 * Instantiates and begins logic setup
 */

$(function() {
    ko.applyBindings(viewModelData);
});
