//关闭back、menu按键监听，这样侧滑主界面会自动获得back和memu的按键事件，仅在主界面处理按键逻辑即可；
mui.init({
	keyEventBind: {
		backbutton: false,
		menubutton: false
	}
});
var main = null;
var menu = null;
var noteType = null;
var reviewMode = null;
var analysis = null;
var type = null; // 该参数用来改善性能
mui.plusReady(function () {
	main = plus.webview.currentWebview().opener();
				
	// 处理监听
	lib.on('#index', 'tap', function() {
		closeMenu();
		main.evalJS("mask.close();");
		main.show();

	});
	lib.on('#noteType', 'tap', function() {
		closeMenu();
		var noteWebview = plus.webview.getWebviewById("noteType");
		if(noteWebview){
//			noteWebview.evalJS("mask.close();");
			noteWebview.reload(true);
		}
		mui.openWindow(lib.h.normalPage('noteType', { top: '0px'}));
	});
	lib.on('#reviewMode', 'tap', function() {
		closeMenu();
		var reviewWebview = plus.webview.getWebviewById("reviewMode");
		if(reviewWebview) {
//			reviewWebview.evalJS("mask.close();");
			reviewWebview.reload(true);
		}
		mui.openWindow(lib.h.normalPage('reviewMode', { top: '0px'}));
	});
	lib.on('#analysis', 'tap', function() {
//		mui.openWindow(lib.h.normalPage('analysis', { top: '0px'}));
//		closeMenu();
	});
	lib.on('#output', 'tap', function() {
		var btnArray = ['否', '是'];
		mui.confirm('确认导出？', 'Hello client', btnArray, function(e) {
			if (e.index == 1) {
				plus.nativeUI.showWaiting("导出中...");
				plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, function(fs){
					var now = new Date();
					var fileName = 'database' + now.getFullYear() + (now.getMonth()+1)
									+ now.getDay() +'.sql';
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

	lib.on('#clear', 'tap', function() {
		var btnArray = ['否', '是'];
		mui.confirm('确认清除部分已完成数据？', 'Hello client', btnArray, function(e) {
			if (e.index == 1) {
				plus.nativeUI.showWaiting("清理中...");
				plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, function(fs){		
					fs.root.getFile('a.sql',{create:true}, function(fileEntry){
						fileEntry.createWriter( function (writer) {
							writer.onwrite = function (e) {
								plus.nativeUI.closeWaiting();
							};
							// write some data
							
						}, function (e) {
							alert(e.message );
						});
					});
				});
			} 
		},"div");
	});
})
		
function closeMenu () {
	menu = plus.webview.getWebviewById('menu');
	menu.setStyle({
		left: '-70%',
		transition: {
			duration: 150	
		}
	});

	menu.hide();
}



