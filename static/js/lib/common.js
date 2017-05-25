var lib = {};
lib.on = function(obj, event, func) {
	$(document).off(event, obj).on(event, obj, func);
}


lib.h = {};
// page相关
lib.h.normalStyle = {top: '45px', bottom:'0px'};
lib.h.centerStyle = {top: '45px', bottom: '50px'};

lib.h.normalPage = function(id, options) {
	var opt = $.extend({}, lib.h.normalStyle, options);
	return lib.h.page(id, {styles: opt});
};

// 返回page的配置信息(options)
lib.h.page = function(id, options) {
	var url = id + '.html';
	
	options.url = url;
	options.id = id;
	return options;
};

// 返回程序入口webview
lib.h.indexPage = function() {
	return plus.webview.getWebviewById(plus.runtime.appid);	
}

// 返回当前的webview
lib.h.currentPage = function() {
	return plus.webview.currentWebview();
}

// 获取固定页面
lib.h.getPage = function(id) {
	return id ? plus.webview.getWebviewById(id) : null;
}

lib.h.show = function(id, ani, time, func) {
//	console.log(id);
	if(id) plus.webview.show(id, ani, time, func);
}

lib.h.hide = function(id, ani, time) {
	if(id) plus.webview.hide(id, ani, time);
}

// 以下为插件封装---------------------------------------------------
// 本地存储相关
lib.h.length = function() {
	return plus.storage.getLength();
};

lib.h.key = function(i) {
	return plus.storage.key(i);
};

lib.h.getItem = function(key) {
	if(key) {
		for(var i=0; i < lib.h.length(); i++) {
			if (key == lib.h.key(i)) {
				return plus.storage.getItem(key);
			}
		}
	}
	return null;
};

lib.h.insertItem = function(key, value) {
	plus.storage.setItem(key, value);
};

lib.h.delItem = function(key) {
	plus.storage.removeItem(key);
};

lib.h.clear = function() {
	plus.storage.clear();
};

// web sql
lib.h.db = function(name, size) {
	var db_name = name ? name: 'db_test';
	var db_size = size ? size: 16;
	
	return openDatabase(db_name, '1.0', 'db_test', db_size * 1024 * 1024);
};

lib.h.update = function(db, sql) {
	if(db && sql) {
		db.transaction(function(tx){
			tx.executeSql(sql);
		});
	}
};

lib.h.query = function(db, sql, func) {
	if(db && sql) {
		db.transaction(function(tx){
			tx.executeSql(sql, [], function(tx, results) {
				func(results);
			}, null);
		});
	}
};

//存储公共变量
var db = lib.h.db();