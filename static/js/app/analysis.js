// 指定图表的配置项和数据
var option = {
    tooltip : {
        trigger: 'item',
        formatter: "{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'horizontal',
        left: 'center',
        bottom: '20%',
        data: ['未完成','已完成']
    },
    series : [
        {
            name: '完成情况',
            type: 'pie',
            radius : '55%',
            center: ['50%', '40%'],
		    data:[],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};
var myChart;

mui.init({
	swipeBack: false,
	beforeback: back
});
var menu, mask = mui.createMask(_closeMenu);
var showMenu = false;
mui.plusReady(function () {
	menu = plus.webview.getWebviewById('menu');
	
	lib.on('.menua', 'tap', openMenu);
	// type页面滑动操作，关闭开启菜单页面
	window.addEventListener('swiperight', openMenu);
	window.addEventListener('swipeleft', closeMenu);
	// menu页面向左滑动，关闭菜单
	window.addEventListener("menu:swipeleft", closeMenu);

});

$(function() {
	// 基于准备好的dom，初始化echarts实例
    myChart = echarts.init(document.getElementById('main'));
    
    showData("day");
    
	mui('.mui-scroll-wrapper').scroll();
	
	// 下拉框选择
	$("body").on("tap",".mui-popover li a", function() {
		console.log($(this).attr("id"));
		showData($(this).attr("id"));
		mui("#topPopover").popover("toggle");//show hide toggle
	});

});

function showData(type) {
	var result = {};
	var finishTaskSql = 'select count(*) as c from tb_plan_flow where finish_state=1';
	var undoneTaskSql = 'select count(*) as c from tb_plan_flow where finish_state=0';
	if (type == "day") {
		var now = formatDate(new Date()).split(" ")[0];
		finishTaskSql += ' and finish_time between  "' + (now + ' 00:00:00') + '" and "' + (now + ' 23:59:59') + '"';
		undoneTaskSql += ' and begin_time<= "' + (now + ' 23:59:59') + '"';
		console.log(finishTaskSql);
	} else if(type == "week"){
		var now = new Date();
		var monday = new Date();
		var sunday = new Date();
		monday.setDate(now.getDate() - (now.getDay() - 1));
		sunday.setDate(now.getDate() + (7 - now.getDay()));
		monday = formatDate(monday).split(" ")[0];
		sunday = formatDate(sunday).split(" ")[0];
		
		finishTaskSql += ' and finish_time between  "' + (monday + ' 00:00:00') + '" and "' + (sunday + ' 23:59:59') + '"';
		undoneTaskSql += ' and begin_time<="' + (sunday + ' 23:59:59') + '"';
	} else if (type == "month") {
		var now = new Date();
		var firstDay = new Date();
		var lastDay = new Date();
		
		firstDay.setDate(1);
		lastDay.setMonth(lastDay.getMonth()+1);
		lastDay.setDate(0);
		
		firstDay = formatDate(firstDay).split(" ")[0];
		lastDay = formatDate(lastDay).split(" ")[0];
		
//		console.log(firstDay + ',' + lastDay);
		finishTaskSql += ' and finish_time between  "' + (firstDay + ' 00:00:00') + '" and "' + (lastDay + ' 23:59:59') + '"';
		undoneTaskSql += ' and begin_time<="'+ (lastDay + ' 23:59:59') + '"';
	}
	
	var asyncQueryFinish = new Promise(function (resolve, reject) {
		lib.h.query(db, finishTaskSql, function(res) {
				result.finish = parseInt(res.rows[0].c);
				resolve("finish");
		});		
	});	
	var asyncQueryUndone = new Promise(function (resolve, reject) {
		lib.h.query(db, undoneTaskSql, function(res) {
			result.undone = parseInt(res.rows[0].c);
			resolve("finish");
		});			
	});
	Promise.all([asyncQueryFinish, asyncQueryUndone]).then(function() {
		option.series[0].data = [
			{value: result.undone, name: '未完成'},
			{value: result.finish, name: '已完成'}
		];
	    // 使用指定的配置项和数据显示图表。
		myChart.setOption(option);		
	});
}
