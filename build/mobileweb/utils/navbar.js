pn.ui.NAVIGATION_BAR_BACK_BUTTON = (Ti.Platform.osname != 'android' ? 1 : undefined );

pn.ui.createNavigationBar = function(_args) {
	var BUTTON_WIDTH = x(62);
	var BUTTON_PADDING_TOP = y(7), BUTTON_PADDING_BOTTOM = y(7);

	var navBar = Ti.UI.createView({
		top : 0,
		left : 0,
		right : 0,
		height : y(42),
		backgroundImage : pn.images.navbar,
	});

	createLeftButton();
	createTitle();
	createRightButton();
	//createHomeButton();

	function createLeftButton() {
		if (_args.leftButton === pn.ui.NAVIGATION_BAR_BACK_BUTTON) {
			createBackButton();
		} else {
			// custom left button
		}
	}

	function createTitle() {
		var title = Ti.UI.createLabel({
			top : y(0),
			bottom : y(0),
			left : x(100),
			right: x(100),
			height : y(44),
			width : platformWidth,
			ellipsize : true,
			text : (_args.title != undefined ? _args.title : ' '),
			font : pn.font.arial(x(1)),
			color : pn.css.fontColor,
		})
		navBar.add(title);
	}

	function createRightButton() {
		if (_args.rightButton == undefined)
			return;

		var view = Ti.UI.createView({
			top : y(7),
			bottom : y(7),
			right : x(10),
			width : _args.rightButton.width,
			height : _args.rightButton.height,
			//visible : _args.rightButton.visible != undefined ? _args.rightButton.visible : undefined,
			backgroundImage : (_args.rightButton.image != undefined ? _args.rightButton.image : undefined),
			backgroundColor : (_args.rightButton.image != undefined ? undefined : pn.css.darkGreen),
		});
		view.addEventListener('singletap', viewTapEventHandler);
		view.addEventListener('touchstart', viewTouchStartEventHandler);
		view.addEventListener('touchend', viewTouchEndEventHandler);
		view.addEventListener('touchcancel', viewTouchCancelEventHandler);

		if (_args.rightButton.title != undefined) {
			createButton();
		}

		navBar.rightButton = view;

		navBar.add(view);

		function createButton() {
			var button = Ti.UI.createLabel({
				top : y(0),
				bottom : y(0),
				width : _args.rightButton.width,
				height : _args.rightButton.height,

				text : (_args.rightButton.title != undefined ? _args.rightButton.title : ' '),
				color : pn.css.white,
				textAlign : 'center',
				font : pn.font.arial(x(12)),
				touchEnabled : false,
			});

			view.button = button;
			view.add(button);
		}

		function viewTapEventHandler(e) {
			
			view.opacity = 1;

			_args.rightButton.clickCallback({
				source : view.button
			});
		}

		function viewTouchStartEventHandler(e) {
			
			view.opacity = 0.5;
		}

		function viewTouchEndEventHandler(e) {
			
			view.opacity = 1;
		}

		function viewTouchCancelEventHandler(e) {
			
			view.opacity = 1;
		}

	}

	function createHomeButton() {
		if (_args.rightButton != undefined) {
			return;
		}

		if (_args.noHome != undefined) {
			return;
		}

		var view = Ti.UI.createView({
			top : 0,
			//bottom : 0,
			right : 0,
			width : BUTTON_WIDTH - 10,
		});
		view.addEventListener('singletap', viewTapEventHandler);
		view.addEventListener('touchstart', viewTouchStartEventHandler);
		view.addEventListener('touchend', viewTouchEndEventHandler);
		view.addEventListener('touchcancel', viewTouchCancelEventHandler);

		createButton();

		navBar.homeButton = view;
		navBar.add(view);

		function createButton() {
			var button = Ti.UI.createLabel({
				top : BUTTON_PADDING_TOP,
				bottom : BUTTON_PADDING_BOTTOM,
				width : x(52),
				//backgroundImage : app.ui.ImageList.components.NavigationBar.home,
				backgroundColor : 'white',
				//text : 'home',
				color : pn.css.darkGreen,
				textAlign : 'center',
				font : pn.font.arial(x(10)),
				touchEnabled : false,
			});

			view.button = button;
			view.add(button);
		}

		function viewTapEventHandler(e) {
			view.button.opacity = 1;
			view.opacity = 1;
			applicationWindow.navigationVC.home();
		}

		function viewTouchStartEventHandler(e) {
			view.button.opacity = 0.5;
			view.opacity = 0.5;
		}

		function viewTouchEndEventHandler(e) {
			view.button.opacity = 1;
			view.opacity = 1;
		}

		function viewTouchCancelEventHandler(e) {
			view.button.opacity = 1;
			view.opacity = 1;
		}

	}

	/****************************************
	 * 		Convenience Methods
	 ****************************************/

	function createBackButton() {
		if (Ti.Platform.osname == 'android')
			return;

		var view = Ti.UI.createView({
			top : y(7),
			bottom : y(7),
			left : x(10),
			width : BUTTON_WIDTH,
			height : y(27),
			backgroundImage : pn.images.navbtn,
		});
		var lbl = Ti.UI.createLabel({
			text : _args.backTitle != undefined ? _args.backTitle : 'Back',
			font : pn.font.arial(12),
			color : pn.css.white,
			top : y(5),
			bottom : y(5),
			left : x(15),
			right : x(15),
			width : BUTTON_WIDTH,
		});
		view.add(lbl);
		view.addEventListener('singletap', viewTapEventHandler);
		view.addEventListener('touchstart', viewTouchStartEventHandler);
		view.addEventListener('touchend', viewTouchEndEventHandler);
		view.addEventListener('touchcancel', viewTouchCancelEventHandler);

		navBar.backButton = view;
		navBar.add(view);

		function viewTapEventHandler(e) {
			e.source.opacity = 1;
			if (_args.backcallback != undefined) {
				_args.backcallback();
			}else{
				applicationWindow.navigationVC.close(_args.win);
			}
			
		}

		function viewTouchStartEventHandler(e) {
			e.source.opacity = 0.5;
		}

		function viewTouchEndEventHandler(e) {
			e.source.opacity = 1;
		}

		function viewTouchCancelEventHandler(e) {
			e.source.opacity = 1;
		}

	}

	return navBar;

}
