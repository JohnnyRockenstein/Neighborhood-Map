/**
 * This is the primary knockout view model and data for the app
 */

var viewModel = function(map) {
    var self = this;
    sessionStorage.clear();

    self.theMap = map;
    self.zNum = 1;

    /* Hookup the observables*/
    self.refitFilterCheck = ko.observable(true);
    self.refitResizeCheck = ko.observable(true);
    self.searchCategoryCheck = ko.observable(false);
    self.listVisible = ko.observable(true);
    self.rollupText = ko.observable('collapse list');
    self.rollupIconPath = ko.observable('img/collapseIcon.png');
    self.maxListNum = ko.observable(Math.max(1, Math.ceil(($(window).height() - 150) / 30)));
    self.listVisible = ko.observable(1);
    self.listPoint = ko.observable(1);


    /* setting max width fixes nonsense autosizing issues with
     * whitespace wrapping in the infowindow constructor
     */
    self.infoMaxWidth = Math.min(400, $(window).width() * 0.8);

    /* Aligns the map canvas to bottom center */
    self.centerToPoint = function(point, offsetIt) {
        if (!offsetIt) {
            self.theMap.map.setCenter(point.marker.position);
        } else {
            var scale = Math.pow(2, self.theMap.map.getZoom());
            var projection = self.theMap.map.getProjection();
            var pixPosition = projection.fromLatLngToPoint(point.marker.position);
            var positionY = pixPosition.y;

            if (!$(window).width() > 800) {
                positionY = pixPosition.y - ($(window).height() * 0.45 / scale);
            }

            var pixPosNew = new google.maps.Point(
                pixPosition.x,
                positionY
            );
            var posLatLngNew = projection.fromPointToLatLng(pixPosNew);
            theMap.map.setCenter(posLatLngNew);
        }
    };

    /**
     * Selects a given point and attempts to retreive data.
     * If data is not available a query is made
     **/
    self.selectPoint = function(point) {
        var oldPoint = self.currentPoint();
        var divContent = '<div id="infoContent" ' +
            'class="scrollFix">loading...</loding>';
        self.centerToPoint(point, true);

        if ($(window).width() < 800) {
            self.toggleList(false);
        }
        self.currentPoint(point);
        var storedContent = sessionStorage.getItem("infoKey" +
            self.currentPoint().name +
            self.currentPoint().lat() + self.currentPoint().long());

        /* if there is stored data for the point, use it in infowindow */
        if (storedContent) {
            self.openWindow(storedContent, point);
            panoObj.checkPano(true);
        } else {
            self.openWindow(divContent, point);
            foursquareInit.get4Sinfo(point);
        }
        point.marker.setZIndex(point.marker.getZIndex() + 5000);


        self.setPoint(point);

        if (oldPoint !== null && oldPoint !== undefined) {
            self.setPoint(oldPoint);
        }
    };

    /**
     * Sets a given point when a mouse is hovered, else is gone
     */
    self.setPoint = function(point) {
        if (point.hovered()) {
            point.hovered(false);
            self.mouseOn(point);
        } else {
            self.mouseOff(point);
        }
    };

    /**
     * Opens a given Google Map information window
     */
    self.openWindow = function(storedContent, point) {
        googleMap.infowindow.setContent(storedContent);
        googleMap.infowindow.open(self.theMap.map, point.marker);
        googleMap.infowindow.isOpen = true;
    };

    /**
     * Controls the CSS class assignments on the li's
     */
    self.getStyle = function(thisPoint) {
        if (thisPoint === self.currentPoint()) {
            if (thisPoint.hovered() === true) {
                return 'hoveredactiveMapListPoint';
            } else {
                return 'activeMapListPoint';
            }
        } else if (thisPoint.hovered() === true) {
            return 'hoveredMapListLocation';
        }
    };

    /**
     * This will be called when the mouse enters a point
     */
    self.mouseOn = function(point) {
        if (point.hovered() !== true) {
            point.hovered(true);
            if (point.marker.getZIndex() <= self.zNum) {
                point.marker.setZIndex(point.marker.getZIndex() + 5000);
            }
            if (self.currentPoint() === point) {
                point.marker.setIcon(point.activeHoverIcon);
            } else {
                point.marker.setIcon(point.hoverIcon);
            }
        }
    };

    /**
     * Returns pointer to oringal state once the mouse is removed from pointer
     */
    self.mouseOff = function(point) {
        if (point.hovered() === true) {
            point.hovered(false);
        }
        if (point.marker.getZIndex() > self.zNum && point !==
            self.currentPoint()) {

            point.marker.setZIndex(point.marker.getZIndex() - 5000);
        }
        if (self.currentPoint() === point) {
            point.marker.setIcon(point.activeIcon);
        } else {
            point.marker.setIcon(point.defaultIcon);
        }

    };

    /**
     * Class for instatiating points on a Google Map(Map marker details)
     */
    self.point = function(name, lat, long, draggable, category) {

        // Setup icons images for pointers
        this.defaultIcon = 'https://mt.googleapis.com/vt/icon/name=icons/' +
            'spotlight/spotlight-poi.png';
        this.activeHoverIcon = 'https://mt.google.com/vt/icon?psize=20&font=' +
            'fonts/Roboto-Regular.ttf&color=ff330000&name=icons/spotlight/' +
            'spotlight-waypoint-a.png&ax=44&ay=48&scale=1&text=X';
        this.activeIcon = 'http://mt.google.com/vt/icon?psize=30&font=fonts/' +
            'arialuni_t.ttf&color=ff00ff00&name=icons/spotlight/spotlight' +
            '-waypoint-a.png&ax=43&ay=48&text=%E2%80%A2';
        this.hoverIcon = 'https://mt.google.com/vt/icon?color=ff004C13&name=' +
            'icons/spotlight/spotlight-waypoint-blue.png';

        this.name = name;
        this.lat = ko.observable(lat);
        this.long = ko.observable(long);
        this.category = category;
        this.hovered = ko.observable(false);
        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, long),
            title: name,
            map: self.theMap.map,
            draggable: draggable,
            zIndex: self.zNum
        });


        self.zNum++;

        google.maps.event.addListener(this.marker, 'click', function() {
            self.selectPoint(this);
        }.bind(this));

        google.maps.event.addListener(this.marker, 'mouseover', function() {
            self.mouseOn(this);
        }.bind(this));

        google.maps.event.addListener(this.marker, 'mouseout', function() {
            self.mouseOff(this);
        }.bind(this));
    };

    /**
     * Collect pointer locations from JSON. Expected to be on server later on
     */
    self.locations = $.ajax({
        dataType: "json",
        url: "js/locations.JSON",
        async: false,
        success: (data) => {
            var jsonPoints = [];
            for (var i = 0; i < data.length; i++) {
                var point = data[i];
                jsonPoints.push(new self.point(point.name, point.lat, point.long, false, point.category));
            }
            self.points = ko.observableArray(jsonPoints);
        }
    });

    self.currentPoint = ko.observable();
    self.pointFilter = ko.observable('');

    /* calculated array containing just the filtered results from points()*/
    self.shownPoints = ko.computed(function() {
        return ko.utils.arrayFilter(self.points(), function(point) {
            if (self.searchCategoryCheck()) {
                return (self.pointFilter() === '*' ||
                    point.name.toLowerCase().indexOf(self.pointFilter().toLowerCase()) !== -1);
            } else {
                return (self.pointFilter() === '*' ||
                    (point.name.toLowerCase().indexOf(self.pointFilter().toLowerCase()) !== -1 ||
                        point.category.toLowerCase().indexOf(self.pointFilter().toLowerCase()) !== -1));
            }
        });
    }, self);


    self.shownPoints.subscribe(function() {
        self.toggleMarkers();
        /* Closes info window if we apply a new filter */
        if (googleMap.infowindow.isOpen) {
            googleMap.infowindow.close();
            googleMap.infowindow.isOpen = false;
            googleMap.infoWindowClosed(self.shownPoints, self.toggleList);
        }
    });

    self.listPage = ko.computed(function() {
        return Math.max(1, Math.ceil(self.listPoint() / self.maxListNum()));
    });

    /* Items that should be visible on the list current visible page
     */
    self.shownList = ko.computed(function() {
        return self.shownPoints().slice(self.listPoint() - 1,
            self.listPoint() - 1 + self.maxListNum());
    });

    /*
     * Calculate total pages from the current max size of our list based on window size
     */
    self.totalPages = ko.computed(function() {
        return Math.max(1, Math.ceil(
            self.shownPoints().length / self.maxListNum()));
    });

    self.pageText = ko.computed(function() {
        return 'Current List Page: <strong>' + self.listPage() +
            '</strong> of <strong>' + self.totalPages() +
            '</strong> (' + self.shownPoints().length + ' locations)';
    });

    self.previousPageText = ko.computed(function() {
        if (self.listPage() > 1) {
            return 'page: ' + (self.listPage() - 1) + ' <';
        } else {
            self.listPoint(1);
            return self.listPage();
        }
    });

    self.nextPageText = ko.computed(function() {
        if (self.totalPages() > self.listPage()) {
            return '> page: ' + (self.listPage() + 1);
        } else {
            return self.listPage();
        }
    });

    /**
     * Changes pages in given direction. -1 Previous page, +1 Next Page
     */
    self.changePage = function(direction) {
        if (direction === 1 && self.totalPages() > self.listPage()) {
            self.listPoint(self.listPoint() + self.maxListNum());
        } else if (direction === -1 && self.listPage() > 1) {
            self.listPoint(self.listPoint() - self.maxListNum());
        }
    };

    /**
     * Shows/Hides the list.
     */
    self.toggleList = function(makeVisible) {
        if (typeof makeVisible !== 'boolean') {
            if (self.listVisible() === 0) {
                makeVisible = true;
            } else {
                makeVisible = false;
            }
        }

        if (makeVisible) {
            self.listVisible(1);
            self.rollupText('collapse list');
            self.rollupIconPath('img/collapseIcon.png');
        } else {
            self.listVisible(0);
            self.rollupText('expand list');
            self.rollupIconPath('img/expandIcon.png');
        }

    };

    /**
     * When shownPoints changes then show the markers in the array
     */
    self.toggleMarkers = function() {
        var i;
        var pointsLen = self.points().length;

        // Make all markers hidden and unhovered
        for (i = 0; i < pointsLen; i++) {
            var thisPoint = self.points()[i];
            thisPoint.marker.setVisible(false);
            thisPoint.hovered(false);

            // Set icons for points
            if (self.currentPoint() === thisPoint) {
                thisPoint.marker.setIcon(thisPoint.activeIcon);
            } else {
                thisPoint.marker.setIcon(thisPoint.defaultIcon);
            }
        }

        // Show markers in shownPoints array
        for (i = 0; i < pointsLen; i++) {
            var thisPoint = self.shownPoints()[i];
            if (thisPoint) {
                thisPoint.marker.setVisible(true);
            }
        }

        // refit map
        if (self.refitFilterCheck() === true) {
            googleMap.refitMap(self.shownPoints);
        }
    };


    googleMap.init(self.shownPoints, self.toggleList);

    // event to resize the map and list size when the browser window resizes
    $(window).resize(function() {
        self.maxListNum(Math.max(1, Math.ceil(($(window).height() - 150) / 30)));
        if (self.refitResizeCheck()) {
            googleMap.refitMap(self.shownPoints);
        }
    });

    googleMap.refitMap(self.shownPoints);
};
