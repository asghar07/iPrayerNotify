var platformWidth = Ti.Platform.displayCaps.platformWidth;
var platformHeight = Ti.Platform.displayCaps.platformHeight;
pn.util.DEBUG = true;
function log(string) {
	if (pn.util.DEBUG) {
		Ti.API.info('[DEBUG] >>>>>>> ' + string);
	}
}

function logError(string) {
	if (pn.util.DEBUG) {
		Ti.API.error('[ERROR] >>>>>>> ' + string);
	}
}

function toTitleCase(toTransform) {
	return toTransform.replace(/\b([a-z])/g, function(_, initial) {
		return initial.toUpperCase();
	});
}

var x = function(_args) {
	var temp = _args / 320;
	return parseInt((platformWidth * temp));
};
;
var y = function(_args) {
	var temp = _args / 480;
	return parseInt((Ti.Platform.displayCaps.platformHeight * temp));
};

function setInSession(key, value) {
	Ti.App.Properties.setString(key, value);
}

function getFromSession(key) {
	return Ti.App.Properties.getString(key);
}

var osname = Ti.Platform.osname;
var os = function(map) {
	var def = map.def || null;
	//default function or value
	if ( typeof map[osname] != 'undefined') {
		if ( typeof map[osname] == 'function') {
			return map[osname]();
		} else {
			return map[osname];
		}
	} else {
		if ( typeof def == 'function') {
			return def();
		} else {
			return def;
		}
	}
};

pn.util.createWindow = function(_args) {
	return os({
		iphone : function() {
			var self = Ti.UI.createWindow({
				backgroundImage : pn.images.bg,
				navBarHidden : true,
				modal : _args.modal != undefined ? _args.modal : undefined,
			});
			return self;

		},
		android : function() {
			var self = Ti.UI.createWindow({
				backgroundImage : pn.images.bg,
				exitOnClose : _args.exitOnClose != undefined ? _args.exitOnClose : false,
				navBarHidden : true,
				modal : _args.modal != undefined ? _args.modal : undefined,
			});
			return self;
		}
	})
}