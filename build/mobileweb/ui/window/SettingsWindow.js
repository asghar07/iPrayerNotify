pn.ui.createSettingsWindow = function(_args) {
	var self = pn.util.createWindow({
		modal : true,
	})
	var nav = pn.ui.createNavigationBar({
		title : 'Settings',
		leftButton : pn.ui.NAVIGATION_BAR_BACK_BUTTON,
		backTitle : 'Cancel',
		backcallback : function(e) {
			self.close();
		},
		rightButton : {
			title : 'Done',
			width : x(62),
			height : y(25),
			clickCallback : function(e) {
				picker.animate({
					duration : 500,
					bottom : y(-250),
				}, function(ex) {
					self.close();
				});
			}
		},
		win : self,
	});
	self.add(nav);

	var settingsView = Ti.UI.createView({
		top : y(44),
		left : x(0),
	});
	self.add(settingsView);

	var data = [];
	var table = new pn.util.createTable({
		top : y(10),
		left : x(10),
		right : x(10),
		height : y(400),
		data : data,
	});
	settingsView.add(table.view);

	self.addEventListener('focus', function(e) {
		updateSettingRow();
	});

	function updateSettingRow() {
		var title = [];
		var subtitle = [];
		title.push("Prayer Time Calculation")
		var method = getFromSession('method');
		if(method == undefined || method == null){
			method = prayTimes.getSetting();
		}
		log('settings in settings window --->' + method)
		subtitle.push("Current Setting: " + prayTimes.getMethods()[method].name);
		table.updateData({
			backgroundImage : pn.images.rowbg,
			title : title,
			subtitle : subtitle,
			rowcallback : function(ex1) {
				// picker.animate({
				// duration : 500,
				// bottom : 0,
				// });
			},
			callback : function(e) {
				picker.animate({
					duration : 500,
					bottom : 0,
				});
			}
		})
	}

	var pickerVals = [];
	for (var key in prayTimes.getMethods()) {
		pickerVals.push(Ti.UI.createPickerRow({
			title : prayTimes.getMethods()[key].name,
			custom_item : key
		}));
	}

	var picker = Ti.UI.createPicker({
		bottom : y(-250),
		type : Ti.UI.PICKER_TYPE_PLAIN,
		height : y(100),
		selectionIndicator : true,
	});
	picker.add(pickerVals);
	picker.addEventListener('change', pickerChangeEventHandler);
	settingsView.add(picker);

	function pickerChangeEventHandler(e) {
		// picker.animate({
		// duration : 500,
		// bottom : y(-250),
		// }, function(ex){

		log('setting in session the custom item');
		setInSession('method', e.row.custom_item);
		log('setting in session the custom item 2');
		updateSettingRow();
		// self.close();
		// })

	}

	return self;
}
