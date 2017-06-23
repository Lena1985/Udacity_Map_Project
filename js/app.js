/*------- INITIALLY EMPTY ARRAY TO STORE FLICKR DATA -------*/
var photoLinks = ko.observableArray();

/*------- STORE LOCATION DATA AND INFORMATION IN ARRAY -------*/
var locationJSON = [
	{
		name: "Eisbach",
		lat: 48.1592947,
		lng: 11.6016883,
		description: "<h3>The Eisbach</h3>" + "<p> is a small man-made river, 2 kilometres long, in Munich. It flows through the park known as the Englischer Garten and is a side arm of the Isar River. A manmade wave has been created on one section.</p>"
	},
	{
		name: "Marienplatz",
		lat: 48.1373968,
		lng: 11.5732598,
		description: "<h3>The Marienplatz</h3>" + "<p>is a central square in the city centre of Munich, Germany. It has been the city's main square since 1158.</p>"
	},
	{
		name: "Oktoberfest Munich",
		lat: 48.131445,
		lng: 11.5463691,
		description: "<h3>The Oktoberfest</h3>" + "<p> is the world's largest Volksfest (beer festival and travelling funfair). Held annually in Munich, Bavaria, Germany, it is a 16- to 18-day folk festival running from mid or late September to the first weekend in October, with more than 6 million people from around the world attending the event every year.</p>"
	},
	{
		name: "Friedensengel",
		lat: 48.141356,
		lng: 11.5947738,
		description: "<h3>The Angel of Peace</h3>" + "<p> is part of the Maximilian Park and a point de vue at the eastern end of a line of sight forming Prinzregentenstrasse. Next to the Isar, slightly elevated above street level, is an open space with a fountain.</p>"
	},
	{
		name: "Schloss Nymphenburg",
		lat: 48.1582711,
		lng: 11.5011256,
		description: "<h3>The Nymphenburg Palace</h3>" + "<p> is a Baroque palace in Munich, Bavaria, southern Germany. The palace is the main summer residence of the former rulers of Bavaria of the House of Wittelsbach.</p>"
	},
	{
		name: "Frauenkirche Munich",
		lat: 48.1386346,
		lng: 11.5714367,
		description: "<h3>The Frauenkirche</h3>" + "<p> is a church in the Bavarian city of Munich that serves as the cathedral of the Archdiocese of Munich and Freising and seat of its Archbishop. It is a landmark and is considered a symbol of the Bavarian capital city.</p>"
	},
	{
		name: "Allianz Arena",
		lat: 48.2188033,
		lng: 11.6225185,
		description: "<h3>The Allianz Arena</h3>" + "<p> is a football stadium in Munich, Bavaria, Germany with a 75,000 seating capacity. Widely known for its exterior of inflated ETFE plastic panels, it is the first stadium in the world with a full colour changing exterior.</p>"
	},
	{
		name: "Olympiaturm Munich",
		lat: 48.1898006,
		lng: 11.5406359,
		description: "<h3>The Olympiapark München</h3>" + "<p> in Munich, Germany, is an Olympic Park which was constructed for the 1972 Summer Olympics. Located in the Oberwiesenfeld neighborhood of Munich, the Park continues to serve as a venue for cultural, social, and religious events such as events of worship.</p>"
	}
];

/* ------------ ERROR HANDLING FOR GOOGLE MAP ------------ */
function errorHandling() {
	alert("Google Maps has failed to load. Please try again.");
}

/* ------------ MODEL ------------ */
class LocationModel {
	constructor(place) {
		var self = this;
		this.name = place.name;
		this.title = place.name;
		this.lat = place.lat;
		this.lng = place.lng;
		this.marker = this.createMarker(place);
		this.description = place.description;
	}

	createMarker(place) {
		let latLng = new google.maps.LatLng(this.lat, this.lng);
		let icon = 'img/beer.png';
		let title = this.title;
		let description = place.description;
		let marker = new google.maps.Marker({
			position: latLng,
			map: map,
			title: title,
			animation: google.maps.Animation.DROP,
			icon: icon
		});

		// Animate markers an set content of Infowindow
		google.maps.event.addListener(marker, 'click', () => {
			marker.setAnimation(google.maps.Animation.BOUNCE);
			this.showFlickr();

			// Marker stops bouncing after 2,8 seconds	
			setTimeout(() => {
				marker.setAnimation(null);
			}, 2800);
			infowindow.setContent(this.description);
			infowindow.open(map, marker);
		});

		return marker;
	};

	/* FUNCTION TO ANIMATE MARKER AND SHOW INFOWINDOW */
	showInfo(place) {
		this.marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(() => {
			this.marker.setAnimation(null);
		}, 2800);
		infowindow.setContent(this.description);
		infowindow.open(map, this.marker);
	};

	/* FLICKR API FUNCTION */
	showFlickr(place) {
		var flickerAPI = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";   
		var location = $(this).attr('title');
		var flickrOptions = {
			tags: location,
			format: "json"
		};
		function displayPhotos(data) {
			photoLinks.removeAll();
			$.each(data.items, function(i, photo) {
				photoLinks.push(photo.media.m);
			});
		}
		// Error handling for Flickr AJAX request
		$.ajaxSetup({
			"error":function() { alert("Flickr doesn't seem to be working at the moment. Please try again!");  }
		});
		$.getJSON(flickerAPI, flickrOptions, displayPhotos);
	}

	/*  OPEN INFOWINDOW AND GET FLICKR PHOTOS WHEN CLICKING BUTTON */
	onClick() {
		this.showFlickr();
		this.showInfo();
	};
};

/* ------------ VIEWMODEL ------------ */
class ViewModel {
	constructor() {
		this.locationsArray = ko.observableArray();
		this.filterKeyword = ko.observable('');

		locationJSON.forEach((place) => {
			this.locationsArray.push(new LocationModel(place));
		});

		/* ------------ SEARCH/FILTER FOR LOCATIONS ------------ */
		this.filteredLocation = ko.computed(() => {
			if(!this.filterKeyword() || this.filterKeyword().trim() === '') {
				this.locationsArray().forEach((place) => {
					place.marker.setVisible(true);
				})
				return this.locationsArray();
			} else {
				return ko.utils.arrayFilter(this.locationsArray(), (place) => {
					let placeFound = place.name.toLowerCase().indexOf(this.filterKeyword().toLowerCase()) !== -1;
					place.marker.setVisible(placeFound);
					return(placeFound);
				});
			}
		});
	}
};

/* ------------ INIT MAP ------------ */
initMap = () => {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 12,
		center: new google.maps.LatLng(48.1719683, 11.5842726),
		mapTypeId: 'roadmap',
		mapTypeControl: false,
		styles: [
			{
				featureType: 'water',
				stylers: [
					{ color: '#052f5f' }
				]
			},{
				featureType: 'administrative',
				elementType: 'labels.text.stroke',
				stylers: [
					{ color: '#ffffff' },
					{ weight: 6 }
				]
			},{
				featureType: 'administrative',
				elementType: 'labels.text.fill',
				stylers: [
					{ color: '#de369d' }
				]
			},{
				featureType: 'road.highway',
				elementType: 'geometry.stroke',
				stylers: [
					{ color: '#ffdde2' },
					{ lightness: -60 }
				]
			},{
				featureType: 'transit.station',
				stylers: [
					{ weight: 9 },
					{ hue: '#de369d' }
				]
			},{
				featureType: 'road.highway',
				elementType: 'labels.icon',
				stylers: [
					{ visibility: 'off' }
				]
			},{
				featureType: 'water',
				elementType: 'labels.text.stroke',
				stylers: [
					{ lightness: 100 }
				]
			},{
				featureType: 'water',
				elementType: 'labels.text.fill',
				stylers: [
					{ lightness: -100 }
				]
			},{
				featureType: 'poi',
				elementType: 'geometry',
				stylers: [
					{ visibility: 'on' },
					{ color: '#f4f4f4' }
				]
			},{
				featureType: 'road.highway',
				elementType: 'geometry.fill',
				stylers: [
					{ color: '#f4f4f4' },
					{ lightness: -25 }
				]
			}
		]
	});
	infowindow = new google.maps.InfoWindow();

	ko.applyBindings(new ViewModel());
};