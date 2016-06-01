/**
 * Panorama Image. Anything to do with the Panorama image is calculated through here
 */

var PanoObject = function(currentPoint) {
    this.pano = null;
    var self = this;
    this.currentPoint = currentPoint;

    /**
     * Looks up a panorama image that is near the Map pin.
     * @skipContent is cached.
     */

    this.checkPano = function(skipContent) {

        /* if browser widtn is small skip the panorama */

        if ($(window).width() <= 800) {
            if (skipContent !== true) {
                googleMap.infowindow.setContent(self.contentString(false));
            }

            /* never check for pano image if the width is small */

            return;
        }
        /* check for a Google streetview and use it */

        googleMap.streetViewService.getPanoramaByLocation(
            viewModelData.currentPoint().marker.position, 80,
            function(streetViewPanoramaData, status) {

                if (status === google.maps.StreetViewStatus.OK) {

                    /* if a street view is available */

                    if (skipContent !== true) {
                        googleMap.infowindow.setContent(self.contentString(true));
                    }
                    if (self.pano !== null) {
                        self.pano.unbind("position");
                        self.pano.setVisible(false);
                    }
                    self.pano = new google.maps.StreetViewPanorama(
                        document.getElementById("panoramaContent"), {

                            navigationControl: true,
                            navigationControlOptions: {
                                style: google.maps.NavigationControlStyle.ANDROID
                            },
                            enableCloseButton: false,
                            addressControl: false,
                            linksControl: false
                        });
                    self.pano.setPano(streetViewPanoramaData.location.pano);
                    self.pano.setVisible(true);
                } else {

                    /* if there is no street view available */

                    if (skipContent !== true) {
                        googleMap.infowindow.setContent(self.contentString(false));
                    }
                }
            });
    };

    this.unbound = function() {
        if (this.pano !== null && this.pano !== undefined) {
            this.pano.unbind("position");
            this.pano.setVisible(false);
            this.pano = null;
        }
    };

    /**
     * Builds Panorama content box
     */
    this.contentString = function(includePano) {
        var retStr = '<div id="infoContent" class="scrollFix">' +
            foursquareInit.the4Sstring;

        if (includePano === true) {
            retStr = retStr +
                '<div id="panoramaContent"></div>';
        }
        retStr = retStr + '</div>';
        sessionStorage.setItem("infoKey" + viewModelData.currentPoint().name +
            viewModelData.currentPoint().lat() + viewModelData.currentPoint().long(), retStr);

        return retStr;
    };
};
