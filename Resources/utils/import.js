var pn = {};
pn.ui = {};
pn.css = {};
pn.font = {};
pn.util = {};
pn.images = {};
pn.http = {};
pn.method = 'ISNA';

Ti.include('/utils/utils.js'); //contains util methods - so importing first
Ti.include('/styles/styles.js');
Ti.include('/utils/geo.js');
Ti.include('/utils/button.js');
Ti.include('/utils/navbar.js');
Ti.include('/utils/http.js');
Ti.include('/utils/tablerow.js');
Ti.include('/utils/table.js');
Ti.include('/utils/prayertimes.js');
Ti.include('/utils/dateformat.js');

//windows
Ti.include('/ui/common/ApplicationWindow.js');
Ti.include('/ui/window/LocationWindow.js');
Ti.include('/ui/window/SearchWindow.js');
Ti.include('/ui/window/PrayerTimeWindow.js');
Ti.include('/ui/window/SettingsWindow.js');

