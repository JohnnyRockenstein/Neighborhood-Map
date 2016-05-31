/**
 * Creates a Google map.
 */

var Map = function() {

    this.Zoom = 10;
    this.mapOptions = {
        zoom: this.Zoom,
        disableDefaultUI: true,
        panControl: false,
        center: {
            lat: 49.8553475,
            lng: -97.14247180000001
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(document.getElementById('map'), this.mapOptions);

};
