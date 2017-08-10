mui.init();
mui.plusReady(function() {	
	// 初始化数据
	initTime();
	
	// 监听点击事件
	lib.on('.mui-icon-back', 'tap', hideAdd);
	lib.on('#make_date', 'tap', chooseDate);
	lib.on('#make_time', 'tap', chooseTime);
	
	// 监听复习模式点击
	getReviewMode();
	$("#Popover_1").on('tap', 'li',function() {
		$('#reviewMode').text($(this).text())
		                .attr("data", $(this).attr("id"))
		                .attr("data-regulation", $(this).attr("data-regulation"));
		$('#Popover_1').removeClass('mui-active');
		$("#Popover_1").hide();
	});
	
	// 监听类别点击
	getTaskType();
	$("#Popover_2").on('tap', 'li',function() {
		$('#taskType').text($(this).text()).attr("data", $(this).attr("id"));
		$('#Popover_2').removeClass('mui-active');
		$("#Popover_2").hide();
	});
	
	// 监听点击保存事件
	$(".adda").on("tap", function() {
		var state = addTask();		
		if(state) plus.webview.close(plus.webview.currentWebview());
	})
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
	
	planTime = $("#date").text() + ":0";
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
	console.log(sql);
	lib.h.update(db, sql);

	var flowSql = 'insert into tb_plan_flow (GUID, plan_id, review_time, finish_state, time_interval, begin_time) values ';
	for (var i = 0; i < reviewRegulation.length; i++) {
		var beginTime = new Date(planTime).getTime() + (parseInt(reviewRegulation[i]) * 3600 * 1000);
		beginTime = new Date(beginTime);
		beginTime = formatDate(beginTime) + ':0';		
		flowSql += '("' + lib.h.uuid() + '", "' + taskId + '", "' + (i+1) + '", "' + (0) + '", "' 
		                       + parseInt(reviewRegulation[i]) + '", "' + beginTime + '")';
		                       
		if (i != (reviewRegulation.length-1)) flowSql += ',';
	}
	console.log(flowSql);
	lib.h.update(db, flowSql);
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
		$("#Popover_1 ul").empty();
		for (var i = 0; i < res.rows.length; i++) {
			var li = genModeLi(res.rows.item(i));
			$("#Popover_1 ul").append(li);
		}
	});	
}

/*
 * 从数据库中获取任务类别，并更新
 */
function getTaskType() {
	lib.h.query(db, 'select * from tb_plan_type order by GUID desc', function(res) {
		$("#Popover_2 ul").empty();
		for (var i = 0; i < res.rows.length; i++) {
			var data = res.rows.item(i);
			var id = data.GUID;
			var title = data.plan_type_title;
			var li = '<li class="mui-table-view-cell" id="' + id + '" >' + title + '</li>';
			console.log(li);
			$("#Popover_2 ul").append(li);
		}
	});	
}

/*
 * 生成review mode的HTML 字符串
 */
function genModeLi(data) {
	var id = data.GUID;
	var title = data.model_title;
	var regulation = data.model_regulation;	
	var li = '<li class="mui-table-view-cell" id="' + id + '" data-regulation="'+ regulation +'" >' + title + '</li>';
	return li;	
}
