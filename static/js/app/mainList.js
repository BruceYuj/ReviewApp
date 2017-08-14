var current;
var planType;
mui.plusReady(function() {
	current = plus.webview.currentWebview();
	planType = getPlanType();
	
	//初次登录展示功能
	initHelp();
	initList(planType);
	updateFinishedTasks(planType);
	
	// 下拉刷新
	current.setPullToRefresh({
		support: true,
		height: '50px',
		range: '50px',
		style: 'circle',
		offset: '46px'
	}, pulldownRefresh);

	// 长按完成任务
	$("#todoList").on("longtap","li", function() {
		var that = this;
		var btnArray = ['否', '是'];
		mui.confirm('确认完成当前任务？', 'Hello client', btnArray, function(e) {
			if (e.index == 1) {
				var sql = 'UPDATE tb_plan_flow SET finish_state=1, finish_time="' + 
							formatDate(new Date()) + ':00:00'+ '" WHERE GUID="' + $(that).attr("id") + '"';
				console.log(sql);
				lib.h.update(db, sql);
				$(that).appendTo("#finishedTask ul");
			} 
		},"div");
	});
	// 点击查看任务详情
	$("#todoList,#finishedTask").on("tap","li", function() {
		mui.openWindow({
			url: "addItem.html",
			id: "addItem",
			extras: {
				read: true,
				GUID: $(this).attr("data") 
			}
		});
	});
});

function initHelp() {
	var help = lib.h.getItem('help');
	if (help == null) {
		lib.h.update(db, 'create table if not exists tb_plan (GUID TEXT unique, plan_title TEXT, plan_description TEXT, plan_mk_time DATETIME, review_model TEXT, plan_type TEXT, plan_state INTEGER)');
		lib.h.update(db, 'create table if not exists tb_review_model (GUID TEXT unique, model_title TEXT, model_regulation TEXT)');
		lib.h.update(db, 'create table if not exists tb_plan_type (GUID TEXT unique, plan_type_title TEXT)');
		lib.h.update(db, 'create table if not exists tb_plan_flow (GUID TEXT unique, plan_id TEXT, review_time INTEGER, finish_state INTEGER, time_interval INTEGER, begin_time DATETIME, finish_time DATETIME)');

		// 初始化plan_type表
		var planTypeId = lib.h.uuid();
		var sql = 'insert into tb_plan_type (GUID, plan_type_title) values ("' + planTypeId + '", "功能介绍")';
		lib.h.update(db, sql);

		// 初始化td_review_model
		var sql = 'insert into tb_review_model (GUID, model_title, model_regulation) values ("' + lib.h.uuid() + '", "艾宾浩斯复习", "1,12,24,48,96,168,360")';
		lib.h.update(db, sql);
		
		lib.h.insertItem('help', 'notFirst');
	}	
}

/**
 * update finished tasks
 */
function updateFinishedTasks(planType) {
	
	var $list = $('#finishedTask ul').empty();
	var now = formatDate(new Date()) + ':00:00';
	var sql = 'SELECT plan_id,tb_plan_flow.GUID, plan_title, plan_type, review_time, begin_time FROM tb_plan INNER JOIN tb_plan_flow ON ' +
			  'tb_plan.GUID = tb_plan_flow.plan_id AND finish_time >="' + now.split(" ")[0]+' 00:00:00' + '" AND finish_time <="' + now + 
			  '" AND finish_state = 1 ORDER BY finish_time DESC';
	console.log(now);
	lib.h.query(db, sql, function(res) {
//		console.log(res.rows.length);
		for (var i = 0; i < res.rows.length; i++) {
//			console.log(res.rows.item(i).plan_id);
//			console.log(res.rows.item(i).GUID);
//			console.log(res.rows.item(i).plan_title);
//			console.log(res.rows.item(i).review_time);
//			console.log(res.rows.item(i).begin_time);
			var str = '';
			str +=  '<li class="mui-table-view-cell" id="' + res.rows.item(i).GUID +'" data="' + res.rows.item(i).plan_id + '">' +
				    '<div class="plan">' +
					'<div class="plan-content">' +
					'<div>' +
					'<span>第' + res.rows.item(i).review_time + '次 </span>' + 
					'<span>' + res.rows.item(i).begin_time + '</span>' +
					'</div>' +
					'<p>' + res.rows.item(i).plan_title + '<p>' +
					'</div>' +
					'<div class="plan-type">' + planType[res.rows.item(i).plan_type] + '</div>' +						
					'</div>' +
					'</li>';
			$("#finishedTask ul").append(str);

		}
	});
}

/**
 * 下拉刷新具体业务实现
*/
function pulldownRefresh() {
	setTimeout(function() {
		initList(planType);
		updateFinishedTasks(planType);
		current.endPullToRefresh();
	}, 1000);
}


/**
 * 初始化今日待办
 */
function initList(planType) {
	
	var $list = $('#todoList ul').empty();
	var now = formatDate(new Date()) + ':00:00';
	var sql = 'SELECT plan_id,tb_plan_flow.GUID, plan_title, plan_type, review_time, begin_time FROM tb_plan INNER JOIN tb_plan_flow ON ' +
			  'tb_plan.GUID = tb_plan_flow.plan_id AND begin_time <="' + now + '" AND finish_state = 0 ORDER BY begin_time DESC';
	console.log(now);
	lib.h.query(db, sql, function(res) {
//		console.log(res.rows.length);
		for (var i = 0; i < res.rows.length; i++) {
//			console.log(res.rows.item(i).plan_id);
//			console.log(res.rows.item(i).GUID);
//			console.log(res.rows.item(i).plan_title);
//			console.log(res.rows.item(i).review_time);
//			console.log(res.rows.item(i).begin_time);
			var str = '';
			str +=  '<li class="mui-table-view-cell" id="' + res.rows.item(i).GUID +'" data="' + res.rows.item(i).plan_id + '">' +
				    '<div class="plan">' +
					'<div class="plan-content">' +
					'<div>' +
					'<span>第' + res.rows.item(i).review_time + '次 </span>' + 
					'<span>' + res.rows.item(i).begin_time + '</span>' +
					'</div>' +
					'<p>' + res.rows.item(i).plan_title + '<p>' +
					'</div>' +
					'<div class="plan-type">' + planType[res.rows.item(i).plan_type] + '</div>' +						
					'</div>' +
					'</li>';
			$("#todoList ul").append(str);

		}
	});
}