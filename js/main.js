/**
 * This file is the primary javascript for the neighboarhood map app
 */

var theMap, viewModelData, panoObj, foursquareInit, googleMap;

var init = function() {
console.log('ballz');
    theMap = new Map();

    googleMap = new Googlemap();

    viewModelData = new viewModel(theMap);

    panoObj = new PanoObject(viewModelData.contentString, viewModelData.currentPoint);

    foursquareInit = new foursquareAPI(panoObj);


    /**
     * This executes when the DOM is loaded
     * Applies the KnockoutJS bindings from the View model,
     * Instantiates and begins logic setup
     */

    $(function() {
        ko.applyBindings(viewModelData);
    });
};
