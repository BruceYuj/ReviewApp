/**
 * 存储GUID到内容的映射
 */
var planType = {};
var reviewModel = {};

mui.init();
mui.plusReady(function() {
	mui('.mui-scroll-wrapper').scroll({
	});
	
	var read = mui.currentWebview.read;
	var GUID = mui.currentWebview.GUID;
	
	getReviewMode();
	getTaskType();

	lib.on('.mui-icon-back', 'tap', hideAdd);
	if (!read) {
		// 初始化数据
		initTime();
		
		// 监听点击事件
		lib.on('#make_date', 'tap', chooseDate);
		lib.on('#make_time', 'tap', chooseTime);
		
		// 监听复习模式点击		
		$("#Popover_1").on('tap', 'li',function() {
			$('#reviewMode').text($(this).text())
			                .attr("data", $(this).attr("id"))
			                .attr("data-regulation", $(this).attr("data-regulation"));
			$('#Popover_1').removeClass('mui-active');
			$("#Popover_1").hide();
		});
		
		// 监听类别点击
		$("#Popover_2").on('tap', 'li',function() {
			$('#taskType').text($(this).text()).attr("data", $(this).attr("id"));
			$('#Popover_2').removeClass('mui-active');
			$("#Popover_2").hide();
		});
		
		// 监听点击保存事件
		$(".adda").on("tap", function() {
			var state = addTask();		
			if(state) {
				plus.webview.currentWebview().opener().reload();
				plus.webview.close(plus.webview.currentWebview());
			}
		});		
	} else {
		$(".mui-title").text("查看任务详情");
		$(".adda").hide();
		getPlanById(GUID);
	}

});

/**
 * 初始化时间
 */
function initTime() {
	var now = new Date();
	$("#date").text(formatDate(now));
}

/*
 * close current webview
 */
function hideAdd() {
	plus.webview.currentWebview().opener().reload();
	plus.webview.close(plus.webview.currentWebview());
}

/**
 * 保存任务
 */
function addTask() {
	var taskId;
	var planTitle, planDescription;
	var planTime, reviewModel,reviewRegulation, planType;
	
	taskId = lib.h.uuid();
	planTitle = $("#addTitle").val();
	planDescription = $("#addContent").val();
	
	planTime = $("#date").text() + ":00:00";
	reviewModel = $("#reviewMode").attr("data");
	planType = $("#taskType").attr("data");
	console.log(planTime.split(' '));	
	
	// 校验1
	if (!planTitle || !reviewModel || !planType) {
		mui.toast("请填写必填内容！");
		return false;
	}
	
	reviewRegulation = $("#reviewMode").attr("data-regulation").split(",");
	
	var sql = 'insert into tb_plan (GUID, plan_type, plan_title, plan_description, plan_mk_time, review_model) ' + 
			'values ("' + taskId +'", "' + planType + '","' + planTitle + '", "' + planDescription +'", "'
			+ planTime +'", "' + reviewModel +'")';
//	console.log(sql);
	lib.h.update(db, sql);

	var flowSql = 'insert into tb_plan_flow (GUID, plan_id, review_time, finish_state, time_interval, begin_time) values ';
	for (var i = 0; i < reviewRegulation.length; i++) {
		var beginTime = new Date(planTime).getTime() + (parseInt(reviewRegulation[i]) * 3600 * 1000);
		beginTime = new Date(beginTime);
		beginTime = formatDate(beginTime) + ':00:00';		
		flowSql += '("' + lib.h.uuid() + '", "' + taskId + '", "' + (i+1) + '", "' + (0) + '", "' 
		                       + parseInt(reviewRegulation[i]) + '", "' + beginTime + '")';
		                       
		if (i != (reviewRegulation.length-1)) flowSql += ',';
	}
	console.log(flowSql);
	lib.h.update(db, flowSql);
	return true;
}


/*
 * 调用native日期选择器
 */
function chooseDate() {
	var dDate = new Date();
	var $date = $("#date");
	plus.nativeUI.pickDate(function(e) {
		var d = e.date;
		d = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
		$date.text(d + ' ' + $date.text().split(' ')[1]);
	}, function(e) {
		mui.toast("您没有选择日期");
	}, {
		title: "请选择日期",
		date: dDate
	});
}

/*
 * 调用native时间选择器
 */
function chooseTime() {
	var dTime = new Date();
	var $time = $("#date");
	dTime.setHours(6, 0);
	plus.nativeUI.pickTime(function(e) {
		var d = e.date;
		var str = $time.text().split(' ');
		$time.text(str[0] + " " + d.getHours());			
	}, function(e) {
		mui.toast("您没有选择时间");
	}, {
		title: "请选择时间",
		is24Hour: true,
		time: dTime
	});
}

/*
 * 从数据库中获取review mode，并更新
 */
function getReviewMode() {
	lib.h.query(db, 'select * from tb_review_model order by GUID desc', function(res) {
		$("#Popover_1 .mui-scroll").empty();
		for (var i = 0; i < res.rows.length; i++) {
			var data = res.rows.item(i);
			var id = data.GUID;
			var title = data.model_title;
			var regulation = data.model_regulation;	
			var li = '<li class="mui-table-view-cell" id="' + id +
			         '" data-regulation="'+ regulation +'" >' + title + '</li>';
			reviewModel[id] = title;
			$("#Popover_1 .mui-scroll").append(li);

		}
	});	
}

/*
 * 从数据库中获取任务类别，并更新
 */
function getTaskType() {
	lib.h.query(db, 'select * from tb_plan_type order by GUID desc', function(res) {
		$("#Popover_2 .mui-scroll").empty();
		for (var i = 0; i < res.rows.length; i++) {
			var data = res.rows.item(i);
			var id = data.GUID;
			var title = data.plan_type_title;
			var li = '<li class="mui-table-view-cell" id="' + id + '" >' + title + '</li>';
			console.log(li);
			planType[id] = title;
			$("#Popover_2 .mui-scroll").append(li);
		}
	});	
}

/**
 * 查询当前任务
 */
function getPlanById(GUID) {
	var sql = 'select * from tb_plan where GUID="' + GUID + '"';
	lib.h.query(db, sql, function(res) {
		for (var i = 0; i < res.rows.length; i++) {
			var data = res.rows.item(i);
			$("#addTitle").val(data.plan_title).attr("disabled", "disabled");
			$("#addContent").val(data.plan_description).attr("disabled", "disabled");
			$("#date").text(data.plan_mk_time.split(":")[0]).attr("href",":;");
			$("#reviewMode").text(reviewModel[data.review_model]).attr("href",":;");
			$("#taskType").text(planType[data.plan_type]).attr("href",":;");
			
		}		
	});
}
