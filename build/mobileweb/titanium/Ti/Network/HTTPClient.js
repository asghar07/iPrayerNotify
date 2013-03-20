define(["Ti/_", "Ti/_/declare", "Ti/_/has", "Ti/_/lang", "Ti/_/Evented", "Ti/Network", "Ti/Blob", "Ti/_/event"],
	function(_, declare, has, lang, Evented, Network, Blob, event) {

	var is = require.is,
		on = require.on;

	return declare("Ti.Network.HTTPClient", Evented, {

		constructor: function() {
			var xhr = this._xhr = new XMLHttpRequest;

			this._handles = [
				on(xhr, "error", this, "_onError"),
				xhr.upload && on(xhr.upload, "error", this, "_onError"),
				on(xhr, "progress", this, function(evt) {
					evt.progress = evt.lengthComputable ? evt.loaded / evt.total : false;
					is(this.ondatastream, "Function") && this.ondatastream.call(this, evt);
				}),
				xhr.upload && on(xhr.upload, "progress", this, function(evt) {
					evt.progress = evt.lengthComputable ? evt.loaded / evt.total : false;
					is(this.onsendstream, "Function") && this.onsendstream.call(this, evt);
				})
			];

			xhr.onreadystatechange = lang.hitch(this, function() {
				var c = this.constants;
				switch (xhr.readyState) {
					case 0: c.readyState = this.UNSENT; break;
					case 1: c.readyState = this.OPENED; break;
					case 2: c.readyState = this.LOADING; break;
					case 3: c.readyState = this.HEADERS_RECEIVED; break;
					case 4:
						clearTimeout(this._timeoutTimer);
						this._completed = 1;
						c.readyState = this.DONE;
						if (xhr.status == 200) {
							if (this.file) {
								Filesystem.getFile(Filesystem.applicationDataDirectory,
									this.file).write(xhr.responseText);
							}
							c.responseText = xhr.responseText;
							c.responseData = new Blob({
								data: xhr.responseText,
								length: xhr.responseText.length,
								mimeType: xhr.getResponseHeader("Content-Type")
							});
							c.responseXML = xhr.responseXML;
							has("ti-instrumentation") && (instrumentation.stopTest(this._requestInstrumentationTest, this.location));
							is(this.onload, "Function") && this.onload.call(this);
						} else {
							xhr.status / 100 | 0 > 3 && this._onError();
						}
				}
				this._fireStateChange();
			});
		},

		destroy: function() {
			if (this._xhr) {
				this._xhr.abort();
				this._xhr = null;
			}
			event.off(this._handles);
			Evented.destroy.apply(this, arguments);
		},

		_onError: function(error) {
			this.abort();
			is(error, "Object") || (error = { message: error });
			error.error || (error.error = error.message || this._xhr.status);
			parseInt(error.error) || (error.error = "Can't reach host");
			is(this.onerror, "Function") && this.onerror.call(this, error);
		},

		abort: function() {
			var c = this.constants;
			c.responseText = c.responseXML = c.responseData = "";
			this._completed = true;
			clearTimeout(this._timeoutTimer);
			this.connected && this._xhr.abort();
			c.readyState = this.UNSENT;
			this._fireStateChange();
		},

		_fireStateChange: function() {
			is(this.onreadystatechange, "Function") && this.onreadystatechange.call(this);
		},

		getResponseHeader: function(name) {
			return this._xhr.readyState > 1 ? this._xhr.getResponseHeader(name) : null;
		},

		open: function(method, url, async) {
			var httpURLFormatter = Ti.Network.httpURLFormatter,
				c = this.constants,
				wc = this.withCredentials;
			this.abort();
			this._xhr.open(
				c.connectionType = method,
				c.location = _.getAbsolutePath(httpURLFormatter ? httpURLFormatter(url) : url),
				wc || async === void 0 ? true : !!async
			);
			wc && (this._xhr.withCredentials = wc);
		},

		send: function(args){
			try {
				var timeout = this.timeout | 0;
				this._completed = false;
				has("ti-instrumentation") && (this._requestInstrumentationTest = instrumentation.startTest("HTTP Request")),
				args = is(args, "Object") ? lang.urlEncode(args) : args;
				args && this._xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				this._xhr.send(args);
				clearTimeout(this._timeoutTimer);
				timeout && (this._timeoutTimer = setTimeout(lang.hitch(this, function() {
					if (this.connected) {
						this.abort();
						!this._completed && this._onError("Request timed out");
					}
				}), timeout));
			} catch (ex) {}
		},

		setRequestHeader: function(name, value) {
			this._xhr.setRequestHeader(name, value);
		},

		properties: {
			ondatastream: void 0,
			onerror: void 0,
			onload: void 0,
			onreadystatechange: void 0,
			onsendstream: void 0,
			timeout: void 0,
			withCredentials: false
		},

		constants: {
			DONE: 4,

			HEADERS_RECEIVED: 2,

			LOADING: 3,

			OPENED: 1,

			UNSENT: 1,

			connected: function() {
				return this.readyState >= this.OPENED;
			},

			connectionType: void 0,

			location: void 0,

			readyState: this.UNSENT,

			responseData: void 0,

			responseText: void 0,

			responseXML: void 0,

			status: function() {
				return this._xhr.status;
			},

			statusText: function() {
				return this._xhr.statusText;
			}
		}

	});

});
