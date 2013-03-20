pn.ui.createSearchWindow = function(_args) {
	var self = pn.util.createWindow({});
	var nav = pn.ui.createNavigationBar({
		title : 'Find Location',
		leftButton : pn.ui.NAVIGATION_BAR_BACK_BUTTON,
		rightButton : {
			image : pn.images.search,
			width : x(32),
			height : y(27),
			clickCallback : searchBtnCallback,
		},
		win : self,
	});
	self.add(nav);
	var searchRecentView = Ti.UI.createView({
		top : y(43),
		left : x(0),
		opacity: 0,
	});
	self.add(searchRecentView);
	var searchView = Ti.UI.createView({
		top : y(43),
		left : x(0),
	});
	//self.add(searchView);
	var searchResultLbl = Ti.UI.createLabel({
		text : 'Click Search button to start looking for new locations.',
		//top : y(60),
		bottom : y(20),
		left : x(60),
		right : x(60),
		font : pn.font.arial(14),
		color : pn.css.fontColor,
	});
	searchRecentView.add(searchResultLbl);

	var searchMainView = Ti.UI.createView({
		top : y(0),
		left : x(0),
		opacity : 0,
	});
	self.add(searchMainView);
	var searchMainBgView = Ti.UI.createView({
		top : y(0),
		left : x(0),
		backgroundColor : pn.css.darkGreen,
		opacity : 0.5,
	});
	searchMainBgView.addEventListener('click', function(e) {
		searchBlur();
	});
	searchMainView.add(searchMainBgView);
	var searchTextFieldView = Ti.UI.createView({
		top : y(-42),
		left : x(0),
		height : x(42),
		backgroundImage : pn.images.navbar,
	});
	searchMainView.add(searchTextFieldView);
	var resultTable = (new pn.util.createTable({
		top : y(0),
		left : x(0),
		height : y(440),
	}));
	resultTable.view.addEventListener('touchstart', function(e) {
		searchTextField.blur();
	});
	resultTable.view.addEventListener('touchend', function(e) {
		searchTextField.blur();
	});
	resultTable.view.addEventListener('touchcancel', function(e) {
		searchTextField.blur();
	});
	resultTable.view.addEventListener('singletap', function(e) {
		searchTextField.blur();
	});
	var searchResultView = Ti.UI.createView({
		top : y(44),
		left : x(0),
		opacity : 0,
	})
	searchResultView.add(resultTable.view);
	searchMainView.add(searchResultView);

	var searchTextField = Ti.UI.createTextField({
		hintText : 'Search city name',
		top : y(5),
		bottom : y(5),
		left : x(5),
		width : platformWidth - 75,
		backgroundColor : '#ffffff',
		font : pn.font.arial(12),
		paddingLeft : x(5),
		paddingRight : x(5),
		autocorrect : false,

	});
	var isSearched = false;

	searchTextField.addEventListener('change', function(e) {
		log('e.value ---->' + e.value);
		if (e.value.length % 4 == 0 || isSearched) {
			isSearched = true;
			//searchTextField.enabled = false;
			searchIndicator.show();
			pn.util.getAddressList({
				value : e.value,
				callback : function(ex) {
					//isSearched = false;
					log('value is ----------->' + JSON.stringify(ex.list));
					var list = ex.list;
					searchResultView.animate({
						duration : 500,
						opacity : 1,
					}, function(ex1) {
						//searchTextField.enabled = true;
						searchIndicator.hide();
						//searchTextField.focus();
						resultTable.updateData({
							backgroundImage : pn.images.rowbg,
							title : list,
							rowcallback : function(ex2) {
								searchIndicator.show();
								pn.util.addresseocoder({
									value : ex2.data.title,
									callback : function(ex3) {
										if (ex3.lat != 0.0 && ex3.lon != 0.0) {
											var city = ex2.data.title;
											var coords = ex3;
											log('In Search window --> coords --> ' + JSON.stringify(coords));
											setInSession('city', city);
											setInSession('coords', JSON.stringify(coords));
											searchIndicator.hide();
											var recentVals = getFromSession('recent');
											var selectedVal = {
												city : city,
												coords : coords,
											};
											if (recentVals != undefined) {
												recentVals = JSON.parse(recentVals);
											} else {
												recentVals = [];
											}
											recentVals.push(selectedVal);
											setInSession('recent', JSON.stringify(recentVals));
											updateRecentTable(recentVals);
											applicationWindow.navigationVC.close(self);
										} else {
											searchIndicator.hide();
											applicationWindow.navigationVC.close(self);
										}
									}
								})
							}
						})
					})
				},
			});
		}
	});
	var cancel = pn.util.createButton({
		top : y(6),
		right : (2),
		width : x(62),
		height : y(27),
		title : 'Cancel',
		backgroundImage : pn.images.navbtn,
		font : pn.font.arial(12),
		color : pn.css.fontColor,
		clickCallback : searchBlur,
	})
	searchTextFieldView.add(cancel);
	searchTextFieldView.add(searchTextField);

	var searchIndicator = Ti.UI.createActivityIndicator({
		style : Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
		top : y(5),
		bottom : y(5),
		right : x(75),
	});
	searchTextFieldView.add(searchIndicator);

	function searchBtnCallback() {
		searchTextField.focus();
		searchMainView.animate({
			duration : 500,
			opacity : 1,
		});
		searchTextFieldView.animate({
			duration : 500,
			top : y(0),
		});
	}

	function searchBlur() {
		searchTextField.blur();
		searchTextFieldView.animate({
			duration : 500,
			top : (-42),
		}, function(ex) {
			searchMainView.animate({
				duration : 500,
				opacity : 0,
			})
		})
	}

	var data = [];

	data.push(new pn.util.createTableRow({
		backgroundImage : pn.images.rowbg,
		data : {
			title : "No recent search",
		},
		index : 0,
	}))

	var recentTitle = Ti.UI.createLabel({
		text : "Recently searched locations",
		top : y(10),
		left : x(10),
		right : x(10),
		color : pn.css.white,
		font : pn.font.arial(x(12)),

	})

	searchRecentView.add(recentTitle);

	var recentTable = (new pn.util.createTable({
		top : y(30),
		left : x(10),
		right : x(10),
		height : y(420),
	}));

	searchRecentView.add(recentTable.view);

	self.addEventListener('focus', function(e) {
		var recentVals = getFromSession('recent');
		log('recentvals ---------->' + recentVals);
		if (recentVals != undefined) {
			recentVals = JSON.parse(recentVals);
			updateRecentTable(recentVals);
		}
	});

	function updateRecentTable(recentVals) {
		var title = [];
		var coords = [];
		for (var i = 0; i < recentVals.length; i++) {
			for (key in recentVals[i]) {
				if (key == 'city') {
					title.push(recentVals[i][key]);
				} else {
					coords.push(recentVals[i][key]);
				}

			}
		}

		recentTable.updateData({
			title : title,
			backgroundImage : pn.images.rowbg,
			rowcallback : function(e) {
				log('e -------->'+JSON.stringify(e));
				var c = coords[e.index];
				setInSession('city', title[e.index]);
				setInSession('coords', JSON.stringify(c));
				applicationWindow.navigationVC.close(self);
			},
		})
	}
	
	setTimeout(function(e){
		searchRecentView.animate({
			duration: 500,
			opacity: 1,
		})
	}, 500);

	return self;
}
