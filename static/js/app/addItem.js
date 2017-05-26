mui.init({

});

mui.plusReady(function() {	
	// 封装退出, 设定fade-out效果
	var oldBack = mui.back;
	mui.back = function() {
		lib.h.hide('addItem', 'fade-out', 400);
		oldBack();
	}
	
	// 监听点击事件
	lib.on('.mui-icon-back', 'tap', hideAdd);
	lib.on('#make_date', 'tap', chooseDate);
	lib.on('#make_time', 'tap', chooseTime);
	
	// 监听复习模式点击
	getReviewMode();
	$("#Popover_1").on('tap', 'li',function() {
		$('#reviewMode').text($(this).text());
		$('#Popover_1').removeClass('mui-active');
		$("#Popover_1").hide();
	});
	
	// 监听类别点击
	getTaskType();
	$("#Popover_2").on('tap', 'li',function() {
		$('#taskType').text($(this).text());
		$('#Popover_2').removeClass('mui-active');
		$("#Popover_2").hide();
	});
});

/*
 * hide add webview
 */
function hideAdd() {
	lib.h.hide('addItem', 'fade-out', 400);
}

/*
 * 调用native日期选择器
 */
function chooseDate() {
	var dDate = new Date();
	var $date = $("#date");
	plus.nativeUI.pickDate(function(e) {
		var d = e.date;
		$date.text(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());
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
		if (str != '创建时间') {
			$time.text(str[0] + " " + d.getHours());			
		} else {
			$time.text(dTime.getFullYear() + "-" + (dTime.getMonth() + 1) + "-" + dTime.getDay() + " " + d.getHours());	
		}
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
	lib.h.query(db, 'select * from tb_review_model order by id desc', function(res) {
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
	lib.h.query(db, 'select * from tb_plan_type order by id desc', function(res) {
		$("#Popover_2 ul").empty();
		for (var i = 0; i < res.rows.length; i++) {
			var data = res.rows.item(i);
			var id = data.id;
			var title = data.plan_type_title;
			var li = '<li class="mui-table-view-cell" id="' + id + '" >' + title + '</li>';
			$("#Popover_2 ul").append(li);
		}
	});	
}

/*
 * 生成review mode的HTML 字符串
 */
function genModeLi(data) {
	var id = data.id;
	var title = data.model_title;
	var regulation = data.model_regulation;	
	var li = '<li class="mui-table-view-cell" id="' + id + '" data-regulation="'+ regulation +'" >' + title + '</li>';
	return li;	
}
