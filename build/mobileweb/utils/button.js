pn.util.createButton = function(_args) {

	var view = Ti.UI.createView({
		top : _args.top != undefined ? _args.top : undefined,
		bottom : _args.bottom != undefined ? _args.bottom : undefined,
		left : _args.left != undefined ?  _args.left : undefined,
		right : _args.right != undefined ? _args.right : undefined,
		width : _args.width,
		height : _args.height,
		opacity: _args.opacity != undefined ? _args.opacity : 1,
		backgroundImage: _args.backgroundImage != undefined ? _args.backgroundImage : undefined,
	});
	var button = Ti.UI.createView({
		top : y(0),
		left : (_args.leftImage != undefined ? 21 : 0),
		width : _args.width - ((_args.rightImage || _args.leftImage) != undefined ? 20 : 0),
		height : _args.height,
		backgroundColor : _args.backgroundColor,
		
	});
	alert('button ->'+_args.title + ' with bgcolor ->'+_args.backgroundColor);
	if(osname != 'android'){
		button.borderRadius = 3;
	}
	view.add(button);

	if (_args.leftImage != undefined) {
		view.add((function() {
			var leftView = Ti.UI.createView({
				top : y(0),
				left : x(0),
				width : x(20),
				height : y(34),
				layout : 'horizontal',
				touchEnabled : false,
			})
			var icon = Ti.UI.createImageView({
				top : 0,
				left : 0,
				width : x(20),
				height : y(33),
				image : _args.leftImage,
			});
			leftView.add(icon);
			
			return leftView;
		})());
	}
	if (_args.rightImage != undefined) {
		view.add((function() {
			var rightView = Ti.UI.createView({
				top :y(0),
				left : _args.width - 21,
				width : x(20) + 1,
				height : y(34),
				layout : 'horizontal',
				touchEnabled : false,
			})
			var icon = Ti.UI.createImageView({
				top : 0,
				left : 0,
				width : x(20),
				height : y(33),
				image : _args.rightImage,
			});
			rightView.add(icon);
			
			return rightView;
		})());
	}

	view.add((function() {
		var label = Ti.UI.createLabel({
			top : 0,
			bottom : 0,
			left : 0,
			right : 0,
			font : (_args.font != undefined ? _args.font : pn.font.arial(x(14))),
			text : _args.title,
			textAlign : 'center',
			color : _args.color,
			backgroundColor : 'transparent',
			touchEnabled : false,
		});
		view.label = label;
		return label;
	})());

	view.setEnabled = function(isEnabled) {
		if (isEnabled) {
			view.touchEnabled = true;
			// view.opacity = 1.0;
			// view.label.opacity = 1.0;
		} else {
			view.touchEnabled = false;
			// view.opacity = 0.5;
			// view.label.opacity = 0.5;
		}
	}

	view.addEventListener('touchstart', function(e) {
		view.opacity = 0.5;
		view.label.opacity = 0.5;
	});
	view.addEventListener('touchend', function(e) {
		view.opacity = 1.0;
		view.label.opacity = 1.0;
	});
	view.addEventListener('touchcancel', function(e) {
		view.opacity = 1.0;
		view.label.opacity = 1.0;
	});
	view.addEventListener('singletap', _args.clickCallback);

	return view;
}

