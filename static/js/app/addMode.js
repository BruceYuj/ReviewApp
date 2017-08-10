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
	$(".button").on("click", function() {
		console.log("test");
		timePicker.show(function(items) {
			console.log("你选择的是:" + items[0].text + " " + items[1].text) ;
			//返回 false 可以阻止选择框的关闭
			//return false;
		});
	})
});


