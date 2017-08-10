
var children = [];
for (var i = 0; i< 100; i++) {
	var result = {"value": (i+1), "text": (i+1)}; 
	children.push(result);
}

var reviewData = [{
	value: "hour",
	text: "时",
	children: children
},{
	value: "day",
	text: "天",
	children: children
},{
	value: "week",
	text: "周",
	children: children
},{
	value: "month",
	text: "月",
	children: children
},{
	value: "year",
	text: "年",
	children: children
}]
