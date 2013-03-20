pn.ui.createPrayerTimeWindow = function(_args) {
	var self = pn.util.createWindow({});
	log('prayer times window ----> logging in');
	var nav = pn.ui.createNavigationBar({
		title : 'Prayer Time',
		leftButton : pn.ui.NAVIGATION_BAR_BACK_BUTTON,
		rightButton : {
			image : pn.images.settings,
			width : x(32),
			height : y(27),
			clickCallback : settingsBtnCallback,
		},
		win : self,
	});
	self.add(nav);
	var prayerTimeView = Ti.UI.createView({
		top : y(43),
		left : x(0),
		opacity : 0,
	});
	self.add(prayerTimeView);
	self.addEventListener('focus', function(e) {
		var title = [];
		var subtitle = [];
		Ti.API.info('getting coords from properties');
		var coords = getFromSession('coords');
		Ti.API.info('coords ------->'+JSON.stringify(coords));
		if (coords  == undefined) {
			applicationWindow.navigationVC.close(self);
		} else {
			coords = JSON.parse(coords);
		}
		var method = getFromSession('method');
		method = method != undefined ? method : pn.method;
		prayTimes.setMethod(method);
		setInSession('method', method);
		var times = prayTimes.getTimes(new Date(), [coords.lat, coords.lon]);
		var d = new Date();
		d = dateFormat(d, "dddd, mmmm dS, yyyy");
		title.push(d);
		subtitle.push('Current Setting: ' + prayTimes.getMethods()[prayTimes.getMethod()].name)
		title.push("");
		var txt = getNextPrayerTimeLeft(times);
		title.push(txt);
		title.push("");
		for (var key in times) {
			title.push(toTitleCase(key) + ':               ' + times[key]);
		}
		log('prayer times for this city is --->' + JSON.stringify(times));
		table.updateData({
			backgroundImage : pn.images.rowbg,
			title : title,
			subtitle : subtitle,
			callback : function(e) {
				prayInd.hide();
				prayLoadingLbl.opacity = 0;
				prayerTimeView.animate({
					duration : 500,
					opacity : 1,
				})
			}
		})
	});

	function oc(a) {
		var o = {};
		for (var i = 0; i < a.length; i++) {
			o[a[i]] = '';
		}
		return o;
	}

	function getNextPrayerTimeLeft(times) {
		var pt = ["fajr", "dhuhr", "asr", "maghrib", "isha"]
		for (var key in times) {
			if ( key in oc(pt)) {
				var time = times[key];
				var d = new Date();
				log("time next is -->" + time + ' AND time now is -->' + d.getHours());
				var t = time.split(':');
				var h = parseInt(t[0]);
				var m = parseInt(t[1]);
				if (h > d.getHours() || (h == d.getHours() && m > d.getMinutes())) {

					log("selected time next is -->" + time + ' AND time now is -->' + d.getHours());
					var rh = Math.abs(d.getHours() - h);
					var rm = Math.abs(d.getMinutes() - m);
					if(rh < 10){
						rh = '0' + rh;
					}
					if(rm < 10){
						rm = '0' + rm;
					}
					return rh + ":" + rm + ' hours until ' + key + ' in ' + getFromSession('city');
				}
			}
		}
		var time = times['fajr'];

		return 'Fajr at ' + time + ' in ' + getFromSession('city');
	}

	var data = [];
	var table = new pn.util.createTable({
		top : y(10),
		left : x(10),
		right : x(10),
		height : y(400),
		data : data,
	});
	prayerTimeView.add(table.view);

	function settingsBtnCallback() {
		var newWin = pn.ui.createSettingsWindow({
			modal : true,
		});
		newWin.open();

	}

	var prayInd = Ti.UI.createActivityIndicator({
		color : 'white',
		style : Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN,
		top : y(60),
		bottom : y(60),
		left : x(120),

	});
	if (Ti.Platform.osname != 'android') {
		self.add(prayInd);
	}
	prayInd.show();
	var prayLoadingLbl = Ti.UI.createLabel({
		text : 'Loading...',
		color : 'white',
		font : {
			fontFamily : 'Helvetica',
			fontSize : 14,
			fontWeight : 'light'
		},
		top : y(60),
		bottom : y(60),
		left : x(150),
		//right : x(150),
		width : "auto",
		textAlign : "center",
		opacity : 1,
	})

	self.add(prayLoadingLbl);

	return self;
}
