// 初始化
mui.init({
	swipeBack: false,
	beforeback: back
});

var current, menu, mask = mui.createMask(_closeMenu);
var showMenu = false;
mui.plusReady(function() {
	initList();
	
	current = plus.webview.currentWebview();
	menu = plus.webview.getWebviewById('menu');	

	lib.on('.menua', 'tap', openMenu);
	lib.on('.adda', 'tap', newMode);
	
	// index页面滑动操作，关闭开启菜单页面
	window.addEventListener('swiperight', openMenu);
	window.addEventListener('swipeleft', closeMenu);
	// menu页面向左滑动，关闭菜单
	window.addEventListener("menu:swipeleft", closeMenu);

	// 下拉刷新
	current.setPullToRefresh({
		support: true,
		height: '50px',
		range: '50px',
		style: 'circle',
		offset: '46px'
	}, pulldownRefresh);
});

function initList() {	
	var $list = $('#modeList').empty();

	lib.h.query(db, 'select * from tb_review_model order by id desc', function(res) {
		var data = res.rows;
		for (var i = 0; i < res.rows.length; i++) {
			var id = data.item(i).id;
			var title = data.item(i).model_title;
			var description = data.item(i).model_description;
			var li = '<li class="mui-table-view-cell" id="' + id + '" >' + title + '</li>';
			console.log(li);
			$list.append(li);
		}
	});
}

function newMode() {
	mui.prompt(' ',' ','输入复习模式',['确认', '取消'], function(e) {
		if (e.index == 0) {
			mui.openWindow({
				url: "addMode.html",
				id: "addMode"
			})
		}
	});
}

/**
 * 下拉刷新具体业务实现
*/
function pulldownRefresh() {
	setTimeout(function() {
		initList();
		current.endPullToRefresh();
	}, 1000);
}