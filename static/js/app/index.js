// 初始化
mui.init({
	swipeBack: false,
	beforeback: back
});

var add = null;
var main, menu, mask = mui.createMask(_closeMenu);
var showMenu = false;

mui.plusReady(function() {
	main = plus.webview.currentWebview();
	
	// 自动预创建menu窗口
	// 目的是等待窗体动画结束后，再执行create webview操作，避免资源竞争，导致窗口动画不流畅
	setTimeout(function() {
		menu = mui.preload({
			id: 'menu',
			url: 'dragMenu.html',
			styles: {
				left: 0,
				width: '70%',
				zindex: 9997
			}
		});
	}, 500);
	
	//添加复习任务,popGesture为none表示新建webview窗口无侧滑返回功能
	add = mui.preload(lib.h.normalPage('addItem', {popGesture: 'none', top: '0px'}));
	lib.on('.adda', 'tap', showAdd);
	lib.on('.menua', 'tap', openMenu);
	
	// index页面滑动操作，关闭开启菜单页面
	window.addEventListener('swiperight', openMenu);
	window.addEventListener('swipeleft', closeMenu);
	// menu页面向左滑动，关闭菜单
	window.addEventListener("menu:swipeleft", closeMenu);
});

function showAdd() {
	lib.h.show('addItem', 'slide-in-right', 300);
}

function back() {
	if(showMenu) {
		//菜单处于显示状态，返回键应该先关闭菜单，阻止主窗口执行mui.back逻辑
		closeMenu();
		return false;
	} else {
		// 菜单处于隐藏状态，执行返回时，需要先close掉菜单页面，然后继续执行mui.back逻辑关闭主窗口
		// 因为android两次点击退出，一次点击后会出现无法显示menu页面的bug
//		menu.close('none');
		return true;
	}
}

