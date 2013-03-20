pn.ui.createApplicationWindow = function(_args) {
	if (osname == 'android') {
		var applicationWindow = pn.ui.createLocationWindow();
		var navigationVC = new pn.ui.NavigationVC();
		applicationWindow.navigationVC = navigationVC;
		return applicationWindow;
	} else {
		var applicationWindow = pn.util.createWindow({});
		var navigationVC = new pn.ui.NavigationVC(pn.ui.createLocationWindow())
		applicationWindow.add(navigationVC.vc);
		applicationWindow.navigationVC = navigationVC;
		return applicationWindow;
	}
}

pn.ui.NavigationVC = function(window) {
	if (osname == 'android') {
		if(window != undefined){
			window.open();
		}
		this.open = function(win, dictionary) {
			win.open();
		}
		this.close = function(win, dictionary) {
			win.close();
		}
	} else {
		var navGroup = Ti.UI.iPhone.createNavigationGroup({
			window : window,
		});
		this.vc = navGroup;
		var stack = [window];
		this.open = function(win, dictionary) {
			win.addEventListener('close', function() {
				stack.pop();
			});
			win.addEventListener('open', function() {
				stack.push(win)
			});

			if (dictionary != undefined) {
				navGroup.open(win, dictionary);
			} else {
				navGroup.open(win);
			}
		}

		this.close = function(win, dictionary) {
			if (dictionary != undefined) {
				navGroup.close(win, dictionary);
			} else {
				navGroup.close(win);
			}
		}

		this.home = function(dictionary) {
			var windows = stack.concat([]);
			for (var l = windows.length - 1; l > 0; l--) {
				this.close(windows[l], dictionary);
			}
		}
	}
}

