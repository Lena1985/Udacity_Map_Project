/* ------------ Store locations information which will be displayed in the info windows ------------ */
var infoEisbach = "<h3>The Eisbach</h3>" + "<p> is a small man-made river, 2 kilometres long, in Munich. It flows through the park known as the Englischer Garten and is a side arm of the Isar River. A manmade wave has been created on one section.</p>";
var infoMarienplatz = "<h3>The Marienplatz</h3>" + "<p>is a central square in the city centre of Munich, Germany. It has been the city's main square since 1158.</p>";
var infoOktoberfest = "<h3>The Oktoberfest</h3>" + "<p> is the world's largest Volksfest (beer festival and travelling funfair). Held annually in Munich, Bavaria, Germany, it is a 16- to 18-day folk festival running from mid or late September to the first weekend in October, with more than 6 million people from around the world attending the event every year.</p>";
var infoFriedensengel = "<h3>The Angel of Peace</h3>" + "<p> is part of the Maximilian Park and a point de vue at the eastern end of a line of sight forming Prinzregentenstrasse. Next to the Isar, slightly elevated above street level, is an open space with a fountain.</p>";
var infoNymphenburg = "<h3>The Nymphenburg Palace</h3>" + "<p> is a Baroque palace in Munich, Bavaria, southern Germany. The palace is the main summer residence of the former rulers of Bavaria of the House of Wittelsbach.</p>";
var infoFrauenkirche = "<h3>The Frauenkirche</h3>" + "<p> is a church in the Bavarian city of Munich that serves as the cathedral of the Archdiocese of Munich and Freising and seat of its Archbishop. It is a landmark and is considered a symbol of the Bavarian capital city.</p>";
var infoAllianzArena = "<h3>The Allianz Arena</h3>" + "<p> is a football stadium in Munich, Bavaria, Germany with a 75,000 seating capacity. Widely known for its exterior of inflated ETFE plastic panels, it is the first stadium in the world with a full colour changing exterior.</p>";
var infoOlympiapark = "<h3>The Olympiapark München</h3>" + "<p> in Munich, Germany, is an Olympic Park which was constructed for the 1972 Summer Olympics. Located in the Oberwiesenfeld neighborhood of Munich, the Park continues to serve as a venue for cultural, social, and religious events such as events of worship.</p>";

var map;

/* ------------ VIEW MODEL ------------ */
var Location = function(name, lat, lng, description, marker) {
	var self = this;
	this.name = name;
	this.title = name;
	this.lat = lat;
	this.lng = lng;
	this.description = description;
	this.icon = 'img/beer.png';
	this.marker = new google.maps.Marker({
		position: new google.maps.LatLng(self.lat, self.lng),
		map: map,
		title: self.name,
		animation: google.maps.Animation.DROP,
		icon: self.icon
	});
	this.infowindow = new google.maps.InfoWindow();
	this.getAnimation = google.maps.Animation.BOUNCE;

	/* ------------ OPEN INFOWINDOW AND ANIMATE WHEN CLICKING MARKER ------------ */
	this.openInfoWindow = function() {
		for(var i = 0; i < Locations.locations.length; i++) {
			Locations.locations[i].infowindow.close();
			Locations.locations[i].marker.setAnimation(null);
		}
		map.panTo(self.marker.getPosition());
		self.infowindow.setContent(self.description);
		self.infowindow.open(map, self.marker);
		self.marker.setAnimation(google.maps.Animation.BOUNCE);
	};
	this.addListener = google.maps.event.addListener(self.marker, 'click', (this.openInfoWindow));
	
	/* ------------ GET FLICKR PHOTOS WHEN CLICKING MARKER ------------ */
	this.showFlickrPhotos = function() {
		var flickerAPI = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
		var location = $(this).attr('title');
		var flickrOptions = {
			tags: location,
			format: "json",
			total: 4
		};
		function displayPhotos(data) {
			var photoHTML = ' ';
			$.each(data.items, function(i, photo) {
				photoHTML += '<a href="' + photo.link + '" class="image">';
				photoHTML += '<img src="' + photo.media.m + '"></a></li>';
			});
			photoHTML += ' ';
			$('#photos').html(photoHTML);
		}
		$.getJSON(flickerAPI, flickrOptions, displayPhotos);
	};
	this.addListener = google.maps.event.addListener(self.marker, 'click', (this.showFlickrPhotos));
	
	/* ------------ OPEN INFOWINDOW AND GET FLICKR PHOTOS WHEN CLICKING BUTTON ------------ */
	this.onClick = function() {
		this.showFlickrPhotos();
		this.openInfoWindow();
	};
};

/* ------------ MODEL ------------ */
var Locations = {
	locations: [
		new Location("Eisbach", 48.1592947, 11.6016883, infoEisbach),
		new Location("Marienplatz", 48.1373968, 11.5732598, infoMarienplatz),
		new Location("Oktoberfest Munich", 48.131445, 11.5463691, infoOktoberfest),
		new Location("Friedensengel", 48.141356, 11.5947738, infoFriedensengel),
		new Location("Schloss Nymphenburg", 48.1582711, 11.5011256, infoNymphenburg),
		new Location("Frauenkirche Munich", 48.1386346, 11.5714367, infoFrauenkirche),
		new Location("Allianz Arena", 48.2188033, 11.6225185, infoAllianzArena),
		new Location("Olympiaturm Munich", 48.1898006, 11.5406359, infoOlympiapark)
	]
};

ko.applyBindings(Locations);