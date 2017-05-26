// 初始化
mui.init({
	swipeBack: false,
	beforeback: back
});

var current, menu, mask = mui.createMask(_closeMenu);
var showMenu = false;
mui.plusReady(function() {
	current = plus.webview.currentWebview();
	menu = plus.webview.getWebviewById('menu');	

	lib.on('.menua', 'tap', openMenu);
	
	// index页面滑动操作，关闭开启菜单页面
	window.addEventListener('swiperight', openMenu);
	window.addEventListener('swipeleft', closeMenu);
	// menu页面向左滑动，关闭菜单
	window.addEventListener("menu:swipeleft", closeMenu);
});

