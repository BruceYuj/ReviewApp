// 初始化
mui.init({
	swipeBack: false,
	beforeback: back,
	gestureConfig: {
		longtap: true
	}
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
	
	// 长按删除
	$("#modeList").on("longtap","li", function() {
		var that = this;
		var btnArray = ['否', '是'];
		mui.confirm('确认删除？', 'Hello client', btnArray, function(e) {
			if (e.index == 1) {
				var sql = 'delete from tb_review_model where GUID="' + $(that).attr("id") + '"';
				console.log(sql);
				lib.h.update(db, sql);
				$(that).remove();
			} 
		},"div");
	});

	$("#modeList").on("tap","li", function() {
		mui.openWindow({
			url: "addMode.html",
			id: "addMode",
			extras: {
				name: $(this).find("span").text(),
				update: true,
				GUID: $(this).attr("id") 
			}
		});
	});
});

function initList() {	
	var $list = $('#modeList').empty();

	lib.h.query(db, 'select * from tb_review_model', function(res) {
		var data = res.rows;
		console.log(data.length);
		for (var i = 0; i < data.length; i++) {
			var total=0;
			var id = data.item(i).GUID;
			var title = data.item(i).model_title;
			var regulation = data.item(i).model_regulation;
			regulation = regulation.split(',');
			
			for (var j = 0; j < regulation.length; j++) {
				total += parseInt(regulation[j]);
			}
			var li = '<li class="mui-table-view-cell mui-media" id="' + id + '" >' + 
		            '<div class="mui-media-body">' +
		            '<span>' + title + '</span>' +
		            '<p class="mui-ellipsis">' + '复习' + regulation.length + '次，共' + hourToDay(total) + '天' + '</p>' +
		            '</div>' + 
			        '</li>';
			console.log(li);
			$list.append(li);
		}
	});
}

function newMode() {
	mui.prompt(' ',' ','输入复习模式',['确认', '取消'], function(e) {
		if (e.index == 0) {
			var webview = mui.openWindow({
				url: "addMode.html",
				id: "addMode",
				extras: {
					name: e.value
				}
			});
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