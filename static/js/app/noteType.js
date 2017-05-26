// 初始化
mui.init({
	swipeBack: false,
	beforeback: back
});

var current, menu, mask = mui.createMask(_closeMenu);
var showMenu = false;
var num = 0;
mui.plusReady(function() {
	initList();
	
	current = plus.webview.currentWebview();
	menu = plus.webview.getWebviewById('menu');
	
	lib.on('.menua', 'tap', openMenu);
	lib.on('.adda', 'tap', newType);
	lib.on('li', 'tap', function() {
		console.log('click the li');
	});
	// type页面滑动操作，关闭开启菜单页面
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

/*
 * 初始化列表
 */
function initList() {	
	var $list = $('#typeList').empty();

	lib.h.query(db, 'select * from tb_plan_type order by id desc', function(res) {
		var data = res.rows;
		for (var i = 0; i < res.rows.length; i++) {
			var id = data.item(i).id;
			var type = data.item(i).plan_type_title;
			var li = '<li class="mui-table-view-cell" id="' + id + '" >' + type + '</li>';
			$list.append(li);
		}
	});
}

function newType() {
	mui.prompt(' ',' ','输入类别',['确认', '取消'], function(e) {
		if (e.index == 0) {
			insertType(e.value);
			initList();
			num++;
		}
	});
}

function insertType(value) {
	var sql = 'insert into tb_plan_type (id, plan_type_title) values ("' + lib.h.genId('TP', num) + '", "'+ value + '")';
	lib.h.update(db, sql);	
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