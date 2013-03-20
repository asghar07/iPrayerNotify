function translateErrorCode(code) {
	if (code == null) {
		return null;
	}
	switch (code) {
		case Ti.Geolocation.ERROR_LOCATION_UNKNOWN:
			return "Location unknown";
		case Ti.Geolocation.ERROR_DENIED:
			return "Access denied";
		case Ti.Geolocation.ERROR_NETWORK:
			return "Network error";
		case Ti.Geolocation.ERROR_HEADING_FAILURE:
			return "Failure to detect heading";
		case Ti.Geolocation.ERROR_REGION_MONITORING_DENIED:
			return "Region monitoring access denied";
		case Ti.Geolocation.ERROR_REGION_MONITORING_FAILURE:
			return "Region monitoring access failure";
		case Ti.Geolocation.ERROR_REGION_MONITORING_DELAYED:
			return "Region monitoring setup delayed";
	}
}

pn.util.getLocation = function(_args) {
	Ti.Geolocation.purpose = "Prayer timings are calculated based on the location";

	var headingAdded = false;
	var locationAdded = false;

	if (Titanium.Geolocation.locationServicesEnabled === false) {
		Titanium.UI.createAlertDialog({
			title : 'iPrayer Notify',
			message : 'Your device has geo turned off - turn it on.'
		}).show();
	} else {
		if (Titanium.Platform.name != 'android') {
			var authorization = Titanium.Geolocation.locationServicesAuthorization;
			log('Authorization: ' + authorization);
			if (authorization == Titanium.Geolocation.AUTHORIZATION_DENIED) {
				Ti.UI.createAlertDialog({
					title : 'iPrayer Notify',
					message : 'You have disallowed us from running geolocation services.'
				}).show();
			} else if (authorization == Titanium.Geolocation.AUTHORIZATION_RESTRICTED) {
				Ti.UI.createAlertDialog({
					title : 'iPrayer Notify',
					message : 'Your system has disallowed us from running geolocation services.'
				}).show();
			}
		}

		Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
		Titanium.Geolocation.distanceFilter = 10;

		Titanium.Geolocation.getCurrentPosition(function(e) {
			if (!e.success || e.error) {
				log("Code translation: " + translateErrorCode(e.code));
				alert('error ' + JSON.stringify(e.error));
				return;
			}
			var longitude = e.coords.longitude;
			var latitude = e.coords.latitude;
		});

		var locationCallback = function(e) {
			if (!e.success || e.error) {
				alert('error:' + JSON.stringify(e.error));
				return;
			}

			var longitude = e.coords.longitude;
			var latitude = e.coords.latitude;

			// reverse geo
			Titanium.Geolocation.reverseGeocoder(latitude, longitude, function(evt) {
				if (evt.success) {
					log('event from reverse geocode --->' + JSON.stringify(evt));
					var places = evt.places;
					if (places && places.length) {
						var city = places[0].city;
						_args.callback({
							lat : latitude,
							lon : longitude,
							city : city,
						})
					} else {
						alert("No address found");
					}
					log("reverse geolocation result = " + JSON.stringify(evt));

				} else {
					Ti.UI.createAlertDialog({
						title : 'Reverse geo error',
						message : evt.error
					}).show();
					log("Code translation: " + translateErrorCode(e.code));
				}
			});

		};
		Titanium.Geolocation.addEventListener('location', locationCallback);
		locationAdded = true;

		function addListener() {
			if (!locationAdded && locationCallback != undefined) {
				Titanium.Geolocation.addEventListener('location', locationCallback);
				locationAdded = true;
			}
		}

		function removeListener() {
			if (locationAdded && locationCallback != undefined) {
				Titanium.Geolocation.removeEventListener('location', locationCallback);
				locationAdded = false;
			}
		}

	}
	this.addListener = addListener;
	this.removeListener = removeListener;
}

pn.util.forwardGeocoder = function(_args) {
	var addr = _args.value;
	//city or zipcode - needs to return list
	log('city being forward geocoded --->' + addr);
	Titanium.Geolocation.forwardGeocoder(addr, function(e) {
		log('in forward --->' + JSON.stringify(e));
		if (e.success) {
			_args.callback({
				lat : e.latitude,
				lon : e.longitude,
			})

		} else {
			_args.callback({
				lat : 0.0,
				lon : 0.0,
			})
			Ti.UI.createAlertDialog({
				title : 'reverse geo error',
				message : e.error
			}).show();

			log("Code translation: " + translateErrorCode(e.code));
		}
	});
}

pn.util.addresseocoder = function(_args) {
	var addr = _args.value;
	//city or zipcode - needs to return list
	log('city being forward geocoded --->' + addr);
	pn.http.requestGET('http://dev.virtualearth.net/REST/v1/Locations?q=' + escape(addr) + '&key=At7KgX4cmIC8g2zPJSns0fvuQaIv2SHZz1Qqeg5NP2dHrPEU68tPMyA7QNXmKKiL', function(e) {
		var response = e.response;
		log('new response ---->' + JSON.stringify(response));
		var jsonResponse = JSON.parse(response);
		if (jsonResponse.statusCode == 200) {
			var coordinates = jsonResponse.resourceSets[0].resources[0].geocodePoints[0].coordinates;
			log('coordinates --->' + JSON.stringify(coordinates));
			_args.callback({
				lat : coordinates[0],
				lon : coordinates[1],
			})
		} else {
			_args.callback({
				lat : 0.0,
				lon : 0.0,
			})
			Ti.UI.createAlertDialog({
				title : 'reverse geo error',
				message : 'Server not responding'
			}).show();
		}
	});
}

pn.util.getAddressList = function(_args) {
	pn.http.requestGET('http://gd.geobytes.com/AutoCompleteCity?filter=US&q=' + _args.value, function(e) {
		var response = e.response;
		log('new response ---->' + JSON.stringify(response));
		var jsonResponse = JSON.parse(response);
		log('new response ---->2   ' + JSON.stringify(jsonResponse));
		if (jsonResponse != undefined) {
			_args.callback({
				list : jsonResponse,
			});
		} else {
			alert('cannot parse');
		}
	})
}

