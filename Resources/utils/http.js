pn.http.requestGET = function(url, callback) {
	log('url: ' + url);

	// send request to server
	var client = Ti.Network.createHTTPClient({
		onload : requestOnLoad,
		onerror : requestOnError,
		timeout : 5000,
	});
	client.autoEncodeUrl = false;
	client.open("GET", url);
	client.send();

	function requestOnLoad(e) {
		var httpResponse = this.responseText;
		var status = this.status;
		httpResponse = unescape(httpResponse);
		log('httpResponse: ' + httpResponse);
		log('status: ' + status);
		if (status == 200) {

			callback({
				success : true,
				response : httpResponse,
			});

		} else {
			callback({
				success : false,
				error : 'Unable to connect to the server. ' + status,
				code : status,
			});
		}
	}

	function requestOnError(e) {
		logError('request failed, error: ' + e.error);
		callback({
			success : false,
			error : 'Unable to connect to the server.', // + e.error,
			code : -1,
		});
	}

}

pn.http.requestPOST = function(url, data, callback) {
	log('url: ' + url);

	// send request to server
	var client = Ti.Network.createHTTPClient({
		onload : requestOnLoad,
		onerror : requestOnError,
		timeout : 10000,
	});
	client.autoEncodeUrl = false;
	client.open("POST", url);
	client.send(data);

	function requestOnLoad(e) {
		var httpResponse = this.responseText;
		var status = this.status;
		log('httpResponse: ' + httpResponse);
		log('status: ' + status);
		if (status == 200) {

			callback({
				response : httpResponse,
			});

		} else {
			callback({
				success : false,
				error : 'Unable to connect to the server. ' + httpResponse,
				code : status,
			});
		}
	}

	function requestOnError(e) {
		logError('request failed, error: ' + e.error);

		callback({
			success : false,
			error : 'Unable to connect to the server.', // + e.error,
			code : -1,
		});
	}

}

