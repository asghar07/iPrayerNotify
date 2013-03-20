pn.util.createTable = function(_args) {
	var data = [];
	data.push(new pn.util.createTableRow({
		backgroundImage: pn.images.rowbg,
		data : {
			title : 'No result',
		},
		index : 0,
	}))

	var view = Ti.UI.createView({
		top : _args.top != undefined ? _args.top : undefined,
		bottom : _args.bottom != undefined ? _args.bottom : undefined,
		left : _args.left != undefined ? _args.left : undefined,
		right : _args.right != undefined ? _args.right : undefined,
		visible : true,
	});
	this.view = view;

	var table = Ti.UI.createTableView({
		top : 0,
		bottom : 0,
		left : 0,
		right : 0,
		data : data,
		height: _args.height != undefined ? _args.height : undefined,
		separatorColor : 'transparent',
		backgroundColor : 'transparent',
	});
	table.footerView = Ti.UI.createView({
		top : 0,
		height : y(5),
		left : 0,
		right : 0,
	})
	view.add(table);

	this.show = function() {
		this.view.visible = true;
		this.updateData();
	}

	this.hide = function() {
		this.view.visible = false;
	}

	this.updateData = function(_args) {
		data = [];
		table.setData(data);
		var title = _args.title;
		log('subtitle ----->'+JSON.stringify(_args));
		if (title.length > 0) {
			for (var i = 0; i < title.length; i++) {
				data.push(new pn.util.createTableRow({
					backgroundImage: _args.backgroundImage,
					data : {
						title : title[i],
						subtitle: _args.subtitle != undefined && _args.subtitle[i] != undefined ? _args.subtitle[i] : undefined,
					},
					clickcallback : _args.rowcallback != undefined ? _args.rowcallback : undefined,
					index : i,
				}));
			}
			if(_args.callback != undefined){
				_args.callback();
			}
		}
		table.setData(data);
	}
}
