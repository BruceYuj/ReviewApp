var totalHours = 0;

// 初始化
mui.init({
	
});


mui.plusReady(function() {
	$('.mui-title').text(mui.currentWebview.name);
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
	})
});

function timeToHours(number, unit) {
	if (unit == "hour") return number;
	if (unit == "day") return number*24;
	if (unit == "week") return number*24*7;
	if (unit == "month") return number*24*30;
	if (unit == "year") return number*24*365;
}

function hourToDay(number) {
	return Math.ceil(number/24);
}
