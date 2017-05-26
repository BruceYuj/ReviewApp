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
	
	// 预加载页面
	noteType = mui.preload(lib.h.normalPage('noteType', { top: '0px'}));
	reviewMode = mui.preload(lib.h.normalPage('reviewMode', { top: '0px'}));
	analysis = mui.preload(lib.h.normalPage('analysis', { top: '0px'}));
	
	// 处理监听
	lib.on('#index', 'tap', function() {
		closeMenu();
		main.show();
		main.evalJS("mask.close();");
	});
	lib.on('#noteType', 'tap', function() {
		closeMenu();
		noteType.show();
	});
	lib.on('#reviewMode', 'tap', function() {
		closeMenu();
		reviewMode.show();
	});
	lib.on('#analysis', 'tap', function() {
		closeMenu();
		analysis.show();
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

	// 等待窗体动画结束，隐藏菜单webview，节省资源
	setTimeout(function() {
		menu.hide();
	}, 300);
}



