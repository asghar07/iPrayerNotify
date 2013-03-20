pn.ui.createLocationWindow = function(_args) {
	var cityTxt = getFromSession('city');
	var self = pn.util.createWindow({
		exitOnClose: true,
	});
	var view = Ti.UI.createView({
		backgroundImage : pn.images.bg,
	})
	self.add(view);
	var locIndicator = Ti.UI.createActivityIndicator({
		style : Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN,
		bottom : y(70),
		left : x(10),
		right : x(10),
	});
	if (Ti.Platform.osname != 'android') {
		view.add(locIndicator);
	}
	locIndicator.show();
	var loadingLbl = Ti.UI.createLabel({
		text : 'Finding current location...',
		color : 'white',
		font : pn.font.arial(14),
		bottom : y(40),
		left : x(100),
		width : 'auto',
		textAlign : 'center',
		opacity : 1,
	})
	view.add(loadingLbl);

	var logo = Ti.UI.createImageView({
		image : pn.images.logo,
		width : x(68),
		height : y(45),
		top : y(218),
		left : x(126),
	})
	view.add(logo);
	var locLbl = Ti.UI.createLabel({
		text : 'Location: ',
		top : y(140),
		left : x(20),
		font : pn.font.arial(14),
		color : pn.css.fontColor,
		opacity : 0,
	})
	var middleView = Ti.UI.createView({
		top : y(160),
		left : x(20),
		right : x(20),
		height : y(60),
		backgroundColor : pn.css.darkGreen,
		//borderRadius : 10,
		opacity : 0,
	});
	var city = Ti.UI.createLabel({
		text : cityTxt != undefined ? cityTxt : '',
		color : pn.css.fontColor,
		font : pn.font.arial(14),
		top : y(20),
		bottom : y(20),
		left : x(10),
		right : x(10),
		width : 'auto',
		textAlign : 'center',
		backgroundColor : pn.css.darkGreen,
	});

	middleView.add(city);
	view.add(locLbl);
	view.add(middleView);

	var changeLoc = new pn.util.createButton({
		top : y(240),
		left : x(20),
		// right : x(20),
		width : x(130),
		height : y(34),
		title : 'Find Location',
		color : pn.css.fontColor,
		backgroundColor : pn.css.buttonColor,
		clickCallback : changeLocCallback,
		opacity : 0,
	});
	view.add(changeLoc);
	function changeLocCallback(e) {
		isCurrentLocation = false;
		var newWin = pn.ui.createSearchWindow({

		});
		applicationWindow.navigationVC.open(newWin);
	}

	var currentLoc = new pn.util.createButton({
		top : y(240),
		left : x(170),
		// right : x(20),
		width : x(130),
		height : y(34),
		title : 'Current Location',
		color : pn.css.fontColor,
		backgroundColor : pn.css.buttonColor,
		clickCallback : currentLocCallback,
		opacity : 0,
	});
	view.add(currentLoc);
	function currentLocCallback(e) {
		if (!isCurrentLocation) {
			locIndicator.show();
			geo.addListener();
		}else{
			loadingLbl.opacity = 1;
			loadingLbl.text = "Current Location is '"+cityTxt+"'";
			setTimeout(function(e){
				loadingLbl.animate({
					duration: 500,
					opacity: 0,
				})
			}, 2000);
		}
	}

	var prayerTimes = new pn.util.createButton({
		top : y(290),
		left : x(20),
		right : x(20),
		height : y(34),
		title : 'Show Prayer Times',
		color : pn.css.fontColor,
		backgroundColor : pn.css.buttonColor,
		clickCallback : prayerTimesCallback,
		opacity : 0,
	});
	view.add(prayerTimes);
	function prayerTimesCallback(e) {
		var newWin = pn.ui.createPrayerTimeWindow({

		});
		applicationWindow.navigationVC.open(newWin);
	}

	function locationCallback(e) {
		isCurrentLocation = true;
		loadingLbl.opacity = 0;
		locIndicator.hide();
		logo.animate({
			top : 60,
			duration : 500,
		}, function(ex1) {
			log('location callback -------->' + JSON.stringify(e));
			cityTxt = e.city;
			city.text = cityTxt;
			var coords = {
				lat : e.lat,
				lon : e.lon,
			};
			setInSession('coords', JSON.stringify(coords));
			setInSession('city', cityTxt);

			locLbl.animate({
				duration : 500,
				opacity : 1,
			})
			middleView.animate({
				duration : 500,
				opacity : 1,
			}, function(e) {
				changeLoc.opacity = 1;
				currentLoc.opacity = 1;
				prayerTimes.opacity = 1;
			})
		})
	}

	var isCurrentLocation = false;
	var geo = new pn.util.getLocation({
		callback : locationCallback,
	});
	self.addEventListener('focus', function(e) {
		cityTxt = getFromSession('city');
		if (cityTxt != undefined) {
			city.text = cityTxt;
		} else {
			geo.addListener();
		}

	});
	self.addEventListener('blur', function(e) {
		geo.removeListener();
	});
	return self;
};
