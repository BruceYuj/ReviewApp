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
	var db_size = size ? size: 128;
	
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

/**
 * to generate id by type and time.
 * @param {Object} type
 * @param {Object} number
 */
//lib.h.genId = function genId(type, number) {
//	var date = new Date();
//	var timestamp = date.getTime();
//	return type + timestamp.toString() + number;
//}
lib.h.uuid = function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,  
  	c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
};

// 其他工具方法
/**
 * format date: 2017-08-08 6
 */
function formatDate(datetime) {
	var month = datetime.getMonth() + 1;
	var day = datetime.getDate();
	var hour = datetime.getHours();
	if (month < 10) month = '0' + month;
	if (day < 10) day = '0' + day;
	if (hour < 10) hour = '0' + hour;
	return datetime.getFullYear() + '-' + month + '-' + day + ' ' + hour;
}

/**
 * 小时转换为天数，向上取值。
 * @param {Object} number
 */
function hourToDay(number) {
	return Math.ceil(number/24);
}
/**
 * 获取plantype ID和 title的映射 
 */
function getPlanType() {
	var result = {};
	lib.h.query(db, 'select * from tb_plan_type', function(res) {
		var data = res.rows;
		for (var i = 0; i < res.rows.length; i++) {
//			console.log(data.item(i).GUID + ':' + data.item(i).plan_type_title);
			result[data.item(i).GUID] = data.item(i).plan_type_title; 
		}
	});
	return result;
}

/**
 * 获取reviewModel ID和 title的映射 
 */
function getReviewModel() {
	var result = {};
	lib.h.query(db, 'select * from tb_review_model', function(res) {
		var data = res.rows;
		for (var i = 0; i < res.rows.length; i++) {
//			console.log(data.item(i).GUID + ':' + data.item(i).plan_type_title);
			result[data.item(i).GUID] = data.item(i).model_title; 
		}
	});
	return result;
}
//存储公共变量
var db = lib.h.db();
