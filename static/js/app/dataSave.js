
mui.init({
	swipeBack: false,
	beforeback: back
});

var menu;
var showMenu = false;
var mask = mui.createMask(_closeMenu);
var planType = getPlanType();
var reviewModel = getReviewModel();

mui.plusReady(function() {
	menu = plus.webview.getWebviewById("menu");
	
	lib.on('.menua', 'tap', openMenu);

	// 页面滑动操作，关闭开启菜单页面
	window.addEventListener('swiperight', openMenu);
	window.addEventListener('swipeleft', closeMenu);
	// menu页面向左滑动，关闭菜单
	window.addEventListener("menu:swipeleft", closeMenu);
	
	$("#output").on("tap", function() {
		var btnArray = ['否', '是'];
		mui.confirm('确认导出？', 'Hello client', btnArray, function(e) {
			if (e.index == 1) {
				plus.nativeUI.showWaiting("导出中...");
				plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, function(fs){
					var now = new Date();
					var fileName = 'database' + now.getFullYear() + (now.getMonth()+1)
									+ now.getDate() +'.sql';
					fs.root.getFile(fileName,{create:true}, function(fileEntry){
						fileEntry.createWriter( function (writer) {
							writer.onwrite = function (e) {
								plus.nativeUI.closeWaiting();
							};
							websqldump.export({
							  database: 'db_test',
							  linebreaks: true,
							  success: function(sql) {					
								writer.seek(writer.length);
								writer.write(sql);
							  }
							});
						}, function (e) {
							alert(e.message);
						});
					});
				});
			} 
		},"div");		
	});
	
	$("#clear").on("tap", function() {
		var btnArray = ['否', '是'];
		mui.confirm('确认清除部分已完成数据？', 'Hello client', btnArray, function(e) {
			if (e.index == 1) {
				plus.nativeUI.showWaiting("清理中...");
				plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, function(fs){
					var now = new Date();
					var fileName = '任务归档' + now.getFullYear() + (now.getMonth()+1)
									+ now.getDate() +'.txt';
					fs.root.getFile(fileName,{create:true}, function(fileEntry){
						fileEntry.createWriter( function (writer) {
							writer.onwrite = function (e) {
								plus.nativeUI.closeWaiting();
							};
							// write some data
							var data = JSON.stringify(clearData());
							writer.seek(writer.length);
							writer.write(data);							
						}, function (e) {
							alert(e.message);
						});
					});
				});
			} 
		},"div");		
	});
});

function clearData() {
	var planId = {};
	var jsonData = [];
	var keys, values;
	lib.h.query(db, 'select * from tb_plan', function(res) {
		var data = res.rows;
		for (var i = 0; i < res.rows.length; i++) {
			planId[data.item(i).GUID] = {
				"plan_title": data.item(i).plan_title,
				"plan_description": data.item(i).plan_description,
				"plan_mk_time": data.item(i).plan_mk_time,
				"plan_type": planType[data.item(i).plan_type],
				"review_model": reviewModel[data.item(i).review_model]
			};
		}
	});
	lib.h.query(db, 'select DISTINCT plan_id from tb_plan_flow where finish_state = 0', function(res) {
		var data = res.rows;
		for (var i = 0; i < res.rows.length; i++) {
			delete planId[data.item(i).plan_id];
		}
	});
	keys = Object.keys();
	for (var i = 0; i < keys.length; i++) {
		lib.h.update(db, 'delete from tb_plan where GUID="' + keys[i] + '"');
		lib.h.update(db, 'delete from tb_plan_flow where plan_id="' + keys[i] + '"');
		jsonData.push(planId[keys[i]]);
	}
	return jsonData;
}
