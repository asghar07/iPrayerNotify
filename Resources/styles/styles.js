pn.font = {
	arial : function(size, weight) {
		if (osname != 'android') {
			return {
				fontFamily : 'Helvetica',
				fontSize : (size != undefined ? size : x(14)),
				fontWeight : weight != undefined ? weight : 'light',
			}
		} else {
			return {
				fontFamily : 'Helvetica',
				fontSize: 24,
				fontWeight : 'bold',
			}
		}
	},
}

pn.css = {
	bgColor : '#73ae73',
	darkGreen : '#294635',
	fontColor : '#ffffff',
	white : '#ffffff',
	lightGreen : '#70ac70',
	black : '#000000',
	buttonColor : '#5c895c',
}

var type = (Ti.Platform.osname == 'android' ? '@2x.png' : '.png');

pn.images = {
	defaultBg : '/ui/images/Default' + type,
	bg : '/ui/images/bg' + type,
	logo : '/ui/images/logo' + type,
	rightarrow : '/ui/images/rightarrow' + type,
	navbar : '/ui/images/navbar' + type,
	navbtn : '/ui/images/navbtn' + type,
	search : '/ui/images/search' + type,
	rowbg : '/ui/images/rowbg' + type,
	settings : '/ui/images/settings' + type,
}

