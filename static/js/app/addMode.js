var totalHours = 0;
var codeToCharacter = {
	"hour": "时",
	"day": "天",
	"week": "周",
	"month": "月",
	"year": "年"
}

// 初始化
mui.init();

mui.plusReady(function() {
	// 初始化数据
	var update = mui.currentWebview.update;
	var GUID = mui.currentWebview.GUID;
	$('.mui-title').text(mui.currentWebview.name+(update?"(修改)":""));
	if(update) initData(GUID);
	
	mui('.mui-scroll-wrapper').scroll({
		indicators: true //是否显示滚动条
	});
	
	//级联示例
	var timePicker = new mui.PopPicker({
		layer: 2
	});
	timePicker.setData(reviewData);
	$(".button").on("tap", function() {
		console.log("test");
		timePicker.show(function(items) {
			var innerHTML = '<li class="mui-table-view-cell" data="' + items[1].value + '" data-unit="' + items[0].value + '">' +
							'<span class="index">' + ($("#scroll li").length + 1) + '</span>' +
							'<span class="time">' + items[1].text+items[0].text + '</span>' +
					    	'</li>';
			$("#scroll ul").append(innerHTML);
			totalHours += timeToHours(items[1].value, items[0].value);
			$("#total").text("复习持续" + hourToDay(totalHours) +"天");
			console.log("你选择的是:" + items[0].text + " " + items[1].text) ;
			//返回 false 可以阻止选择框的关闭
			//return false;
		});
	});
	$("#scroll").on("tap", "li", function() {
		var that = this;
		timePicker.show(function(items) {
			totalHours -= timeToHours(parseInt($(that).attr("data")), $(that).attr("data-unit"));
			totalHours += timeToHours(items[1].value, items[0].value);
			$(that).attr("data-unit", items[0].value).attr("data", items[1].value);
			$(that).children(".time").text(items[1].text+items[0].text);
			
			$("#total").text("复习持续" + hourToDay(totalHours) +"天");
			console.log("你选择的是:" + items[0].text + " " + items[1].text) ;
			//返回 false 可以阻止选择框的关闭
			//return false;
		});		
	});
	$(".adda").on("tap", function() {
		if(update) {
			updateData(GUID);
		} else {
			saveMode();			
		}

	});
});

function timeToHours(number, unit) {
	if (unit == "hour") return number;
	if (unit == "day") return number*24;
	if (unit == "week") return number*24*7;
	if (unit == "month") return number*24*30;
	if (unit == "year") return number*24*365;
}

function hoursToTime(number) {
	if (number%24 != 0) return [number,"hour"];
	number = number/24;
	if (number%365 == 0) return [number/365, "year"];
	else if (number%30 == 0) return [number/30, "month"];
	else if (number%7 == 0) return [number/7, "week"];
	else return [number, "day"];

}
function saveMode() {
	var modeRegulation = [];
	$("#scroll li").each(function() {
		modeRegulation.push(timeToHours(parseInt($(this).attr("data")), $(this).attr("data-unit")));
	});
	modeRegulation = modeRegulation.join(",");
	var sql = 'insert into tb_review_model (GUID, model_title, model_regulation) values ("' + lib.h.uuid() + '", "' + 
			  $(".mui-title").text() + '", "' + modeRegulation + '")';
	console.log(sql);
	lib.h.update(db, sql);
	plus.webview.currentWebview().opener().reload();
	mui.back();
}

function initData(GUID) {
	$("#scroll ul").empty();
	console.log(GUID);
	lib.h.query(db, 'select * from tb_review_model where GUID="' + GUID + '"', function(res) {
		var rows= res.rows;
		for (var i = 0; i < rows.length; i++) {
			var row = rows.item(i);
			var id = row.GUID;
			var modelTitle = row.model_title;
			var modelRegulation = row.model_regulation.split(",").map(function(x) {
				totalHours += parseInt(x);
				return hoursToTime(parseInt(x));
			});
			for (var j = 0; j < modelRegulation.length; j++) {
				var innerHTML = '<li class="mui-table-view-cell" data="' + modelRegulation[j][0] + '" data-unit="' + modelRegulation[j][1] + '">' +
								'<span class="index">' + (j+1) + '</span>' +
								'<span class="time">' + modelRegulation[j][0]+codeToCharacter[modelRegulation[j][1]] + '</span>' +
						    	'</li>';
				$("#scroll ul").append(innerHTML);
			}
			
		}
		$("#total").text("复习持续" + hourToDay(totalHours) +"天");
	});
}

function updateData(GUID) {
	var modeRegulation = [];
	$("#scroll li").each(function() {
		modeRegulation.push(timeToHours(parseInt($(this).attr("data")), $(this).attr("data-unit")));
	});
	modeRegulation = modeRegulation.join(",");
	var sql = 'UPDATE tb_review_model SET model_regulation="' + modeRegulation + '" WHERE GUID="' + GUID + '"';
	console.log(sql);
	lib.h.update(db, sql);
	plus.webview.currentWebview().opener().reload();
	mui.back();
}
