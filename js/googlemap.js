/**
 * This object holds the InfoWindow
 * It displays a loading string and then fills it in
 */

var Googlemap = {
    /**
     * Default Google Map Bounds
     */
    defaultBounds: new google.maps.LatLngBounds(
        new google.maps.LatLng(49.8866486, -97.1992166),
        new google.maps.LatLng(49.8959979, -97.13791730000003)),

    /**
     * Generates Google Map infomation window
     */
    infowindow: new google.maps.InfoWindow({
        content: '<div id="infoContent" class="scrollFix">Loading...</loding>',
        maxWidth: self.infoMaxWidth
    }),

    /**
     * Cleanup infoWindow after close
     */
    infoWindowClosed: function(shownPoints, toggleList) {
        panoObj.unbound();

        if ($(window).width() < 800) {
            toggleList(true);
        }
        Googlemap.refitMap(shownPoints);
    },

    /**
     * Create new StreetViewService
     */
    streetViewService: new google.maps.StreetViewService(),

    /**
     * Initialize Google Map services
     */
    init: function(shownPoints, toggleList) {
        var self = this;
        theMap.map.fitBounds(this.defaultBounds);

        google.maps.event.addListener(Googlemap.infowindow, 'closeclick', function() {
            self.infoWindowClosed(shownPoints, toggleList);
        });

        //On close of infomation window
        google.maps.event.addListener(theMap.map, "click", function() {
            close(shownPoints, toggleList);
        });

        /*
         * On window Resize close information window on small window sizes
         */
        google.maps.event.addDomListener(Googlemap.infowindow, 'domready', function() {
            $('#infoContent').click(function() {

                if ($(window).width() <= 800) {
                    this.close(shownPoints, toggleList)
                }
            });
        });
    },

    /**
     * Close information window if it is open
     */
    close: function(shownPoints, toggleList) {
        if (Googlemap.infowindow.isOpen) {
            Googlemap.infowindow.close();
            Googlemap.infowindow.isOpen = false;
            Googlemap.infoWindowClosed(shownPoints, toggleList);
        }
    },

    /**
     * fit our map to show all of the currently visible markers at once
     */
    refitMap: function(shownPoints) {
        var bounds = new google.maps.LatLngBounds();
        var pointsLen = shownPoints().length;

        if (pointsLen >= 2) {
            for (var i = 0; i < pointsLen; i++) {
                bounds.extend(shownPoints()[i].marker.position);
            }
            theMap.map.fitBounds(bounds);
        }
    }
}
