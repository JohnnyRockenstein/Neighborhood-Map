/**
 * This object holds the InfoWindow
 * It displays a loading string and then fills it in
 */

var Googlemap = function(){
    var self = this;
    /**
     * Default Google Map Bounds
     */
    self.defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(49.8866486, -97.1992166),
        new google.maps.LatLng(49.8959979, -97.13791730000003));

    /**
     * Generates Google Map infomation window
     */
    self.infowindow = new google.maps.InfoWindow({
        content: '<div id="infoContent" class="scrollFix">Loading...</loding>',
        maxWidth: self.infoMaxWidth
    });

    /**
     * Cleanup infoWindow after close
     */
    self.infoWindowClosed = function(shownPoints, toggleList) {
        panoObj.unbound();

        if ($(window).width() < 800) {
            toggleList(true);
        }
        googleMap.refitMap(shownPoints);
    };

    /**
     * Create new StreetViewService
     */
    self.streetViewService = new google.maps.StreetViewService();

    /**
     * Initialize Google Map services
     */
    self.init = function(shownPoints, toggleList) {
        var self = this;

        googleMap.DisplayError();
        theMap.map.fitBounds(self.defaultBounds);

        google.maps.event.addListener(self.infowindow, 'closeclick', function() {
            self.infoWindowClosed(shownPoints, toggleList);
        });

        //On close of infomation window
        google.maps.event.addListener(theMap.map, "click", function() {
            close(shownPoints, toggleList);
        });

        /*
         * On window Resize close information window on small window sizes
         */
        google.maps.event.addDomListener(self.infowindow, 'domready', function() {
            $('#infoContent').click(function() {

                if ($(window).width() <= 800) {
                    self.close(shownPoints, toggleList);
                }
            });
        });
    };

    /**
     * Check if the google map api did not work. If there is no map, we will
     * display an error message to the user.
     */
    self.DisplayError = function(){
        // Error handling for google map api
        if (typeof google !== 'object' || typeof google.maps !== 'object'){
            console.log("error loading google maps api");
            $('#searchbox').val("Error Loading Google Maps Api");
            $('#searchbox').css({'background-color' : 'rgba(255,0,0,0.5)'});
            return;
        }
    };

    /**
     * Close information window if it is open
     */
    self.close = function(shownPoints, toggleList) {
        if (self.infowindow.isOpen) {
            self.infowindow.close();
            self.infowindow.isOpen = false;
            self.infoWindowClosed(shownPoints, toggleList);
        }
    },

    /**
     * fit our map to show all of the currently visible markers at once
     */
    self.refitMap = function(shownPoints) {
        var bounds = new google.maps.LatLngBounds();
        var pointsLen = shownPoints().length;

        if (pointsLen >= 2) {
            for (var i = 0; i < pointsLen; i++) {
                bounds.extend(shownPoints()[i].marker.position);
            }
            theMap.map.fitBounds(bounds);
        }
    };
};