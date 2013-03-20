//--------------------- Copyright Block ----------------------
/*

iPrayerNotify(ver 1.0)
Copyright (C) 2013 

Developer: Mir Mohammed Shajahan
License: GNU LGPL v3.0

TERMS OF USE:
Permission is granted to use this code, with or
without modification, in any website or application
provided that credit is given to the original work
with a link back to PrayTimes.org.

This program is distributed in the hope that it will
be useful, but WITHOUT ANY WARRANTY.

PLEASE DO NOT REMOVE THIS COPYRIGHT BLOCK.

*/

var __type = (Ti.Platform.osname == 'android' ? '@2x.png' : '.png');
var platformWidth = Ti.Platform.displayCaps.platformWidth;
var platformHeight = Ti.Platform.displayCaps.platformHeight;
var loadingWin = Ti.UI.createWindow({
	backgroundImage : '/ui/images/Default'+__type,
	top : 0,
	left : 0,
	width : platformWidth,
	height : platformHeight,
});
var activityIndicator = Ti.UI.createActivityIndicator({
	color : 'white',
	style : Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN,
	bottom : 70,
	left : 10,
	right : 10,
});
if (Ti.Platform.osname != 'android') {
	loadingWin.add(activityIndicator);
}
activityIndicator.show();
var loadingLbl = Ti.UI.createLabel({
	text : 'Loading...',
	color : 'white',
	font : {
		fontFamily : 'Helvetica',
		fontSize : 14,
		fontWeight : 'light'
	},
	bottom : -20,
	left : 130,
	width : "auto",
	textAlign : "center",
	opacity : 0,
})
loadingLbl.animate({
	duration : 1000,
	bottom : 40,
	opacity : 1,
})
loadingWin.add(loadingLbl);
loadingWin.open();
var applicationWindow = undefined;
setTimeout(function(e) {
	Ti.include('/utils/import.js');
	Ti.include('/ui/common/ApplicationWindow.js');
	applicationWindow = pn.ui.createApplicationWindow();
	applicationWindow.open();
}, 1500);

