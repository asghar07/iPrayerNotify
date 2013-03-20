pn.util.createTableRow = function(_args) {
	var type = _args.type;
	var data = _args.data;
	var index = _args.index;
	var clickcallback = _args.clickcallback;

	var row = Ti.UI.createTableViewRow({
		className : 'tablrowclass',
		objName : 'tablerow',
		height : y(40),
		selectionStyle : 'none',
		//backgroundSelectedColor : pn.css.lightGreen,
		backgroundImage : (data.title == '' ? undefined : (_args.backgroundImage != undefined ? _args.backgroundImage : undefined)),
		hasChild : clickcallback != undefined ? true : false,
	}), wrapperView = Ti.UI.createView({
		top : y(0),
		left : x(0),
		height : y(40),
		touchEnabled : true,
	});

	if (data.logo != undefined) {
		createIcon();
	}
	createLabels();
	createActionButton();

	wrapperView.addEventListener('touchstart', function(e) {
		if (clickcallback != undefined) {
			wrapperView.opacity = 0.5;
		}
	});
	wrapperView.addEventListener('touchend', function(e) {
		wrapperView.opacity = 1;
	});
	wrapperView.addEventListener('touchcancel', function(e) {
		wrapperView.opacity = 1;
	});
	wrapperView.addEventListener('singletap', function(e) {
		wrapperView.opacity = 1;
		if (clickcallback != undefined) {
			wrapperViewTapEventHandler(e);
		}
		
	});

	row.wrapperView = wrapperView;
	row.add(wrapperView);

	function createIcon() {
		var leftItem = Ti.UI.createView({
			top : 0,
			bottom : 0,
			left : 0,
			width : x(80),
			touchEnabled : false,
		});

		var icon = Ti.UI.createImageView({
			top : y(4),
			bottom : y(4),
			left : x(4),
			right : x(4),
			image : (data.logo != undefined ? data.logo : undefined),
		})
		leftItem.add(icon);
		row.leftItem = leftItem;
		wrapperView.icon = icon;
		wrapperView.add(leftItem);
	}

	function createLabels() {
		var centerItem = Ti.UI.createView({
			top : y(0),
			bottom : x(0),
			left : data.logo != undefined ? x(80) : x(10),
			touchEnabled : false,
		});

		createTitleLabel();
		if (data.subtitle != undefined && data.subtitle != '') {
			createSubtitleLabel();
		}

		row.centerItem = centerItem;
		wrapperView.add(centerItem);

		function createTitleLabel() {
			var label = Ti.UI.createLabel({
				top : y(5),
				bottom : data.subtitle != undefined ? undefined : y(5),
				right : x(10),
				//right : x(0),
				text : data.title,
				font : pn.font.arial(x(12)),
				color : 'black',
			});
			centerItem.titleLabel = label;
			centerItem.add(label);
			wrapperView.titleLabel = label;
		}

		function createSubtitleLabel() {
			var label = Ti.UI.createLabel({
				bottom : y(5),
				right : x(10),
				//right : x(0),
				text : data.subtitle,
				font : pn.font.arial(x(10, 'bold')),
				color : pn.css.darkGreen,
			});
			centerItem.subtitleLabel = label;
			centerItem.add(label);
			wrapperView.subtitleLabel = label;
		}

	}

	function createActionButton() {
		var rightItem = Ti.UI.createView({
			top : 0,
			bottom : 0,
			right : 0,
			width : x(40),
			touchEnabled : false,
		});

		row.rightItem = rightItem;
		wrapperView.add(rightItem);
	}

	function wrapperViewTapEventHandler(e) {
		log('ListViewTableViewRow.wrapperViewTapEventHandler ' + JSON.stringify(e));
		log('ListViewTableViewRow.wrapperViewTapEventHandler index: ' + index);
		clickcallback({
			data : data,
			index : index,
		})
	}

	return row;
}
