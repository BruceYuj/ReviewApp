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
		closeMenu();
		var analysisWebview = plus.webview.getWebviewById("analysis");
		if(analysisWebview) {
//			reviewWebview.evalJS("mask.close();");
			analysisWebview.reload(true);
		}
		mui.openWindow(lib.h.normalPage('analysis', { top: '0px'}));
	});
	
	lib.on('#output', 'tap', function() {
		closeMenu();
		var dataSave = plus.webview.getWebviewById("dataSave");
		if(dataSave) {
			dataSave.evalJS("mask.close();");
//			dataSave.reload(true);
		}
		mui.openWindow(lib.h.normalPage('dataSave', { top: '0px'}));
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



