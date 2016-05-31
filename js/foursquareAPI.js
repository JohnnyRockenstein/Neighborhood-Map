 /**
  * foursquareAPI Service. Anything to do with foursquare should pass through here
  */

 var foursquareAPI = function(pano) {
     this.pano = pano;
     var self = this;
     var clientId = 'TY5AODXKV1WJK3YUQGU5IAAEJIEKNXKF2VGZ2H0IXBIE1SRX';
     var clientSecret = 'VVNAQW5K5S1P1WP5HLSE1ERQFJ5OCXOKJLCUCVESRQ4IGS4D'

     // Max foursquare tips
     self.max4Stips = Math.max(1,
         Math.min(5, Math.floor($(window).width() / 200)));

     self.the4Sstring = '';

     /**
      * Query foursquare for a given location and name
      */

     this.get4Sinfo = function(point) {

         // foursquare api
         var url = 'https://api.foursquare.com/v2/venues/search?client_id=' +
             clientId + '&client_secret=' + clientSecret +
             '&v=20140806' + '&ll=' + point.lat() + ',' +
             point.long() + '&query=\'' + point.name + '\'&limit=1';

         // Ajax JSON request
         $.getJSON(url)
             .done(function(response) {

                 self.the4Sstring = '<p><b>Map Pin information</b><br>';
                 var venue = response.response.venues[0];

                 // venue id
                 var venueId = venue.id;
                 var venueName = venue.name;
                 if (venueName !== null && venueName !== undefined) {
                     self.the4Sstring = self.the4Sstring + 'Venue: ' +
                         venueName + '<br>';
                 }

                 // address
                 var address = venue.location.formattedAddress;
                 if (address !== null && address !== undefined) {
                     self.the4Sstring = self.the4Sstring + 'Location: ' +
                         address + '<br>';
                 }

                 // checkins
                 var checkinCount = venue.stats.checkinsCount;
                 if (checkinCount !== null && checkinCount !== undefined) {
                     self.the4Sstring = self.the4Sstring + 'Checkins: ' +
                         checkinCount + '<br>';
                 }

                 self.the4Sstring = self.the4Sstring + '</p>';

                 self.pano.checkPano();

             })
             .fail(function() {
                 self.the4Sstring = 'Fouresquare api error';
                 self.pano.checkPano();
             });

     };
 };
