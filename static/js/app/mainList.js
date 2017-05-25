
mui.plusReady(function() {
	
	//初次登录展示功能
	initHelp();
});

function initHelp() {
	var help = lib.h.getItem('help');
	if (help == null) {
		lib.h.update(db, 'create table if not exists tb_day_todo (id unique, plan_type, plan_title, plan_description, plan_mk_time, review_model, review_times, next_time, finish_state)');
		lib.h.update(db, 'create table if not exists tb_review_model (id unique, model_title, model_regulation)');
		lib.h.update(db, 'create table if not exists tb_plan_type (id unique, plan_type_title)');
		var content = [
			'右上角添加事项',
			'点击事项查看详情',
			'长按删除事项',
			'右滑事项完成'
		]

		// 初始化plan_type表
		var sql = 'insert into tb_plan_type (id, plan_type_title) values ("' + genId('TP') + '", "功能介绍")';
		lib.h.update(db, sql);
		
		// 初始化day_todo表
		for (var i = 0; i < content.length; i++) {
			var sql = 'insert into tb_day_todo (id, plan_type, plan_title) values ("' + genId('TD', i) +'", "功能介绍","' + content[i]+'")';
			console.log(sql);
			lib.h.update(db, sql);
		}
		
		// 初始化td_review_model
		var sql = 'insert into tb_review_model (id, model_title, model_regulation) values ("' + genId('MD') + '", "艾宾浩斯复习", "默认复习模式")';
		lib.h.update(db, sql);
		
		lib.h.insertItem('help', 'notFirst');
	}
	
	initList();
}

/**
 * 初始化今日待办
 */
function initList() {
	
	var $list = $('#todoList').empty();

	lib.h.query(db, 'select * from tb_day_todo order by plan_type desc', function(res) {
		var type = '';
		for (var i = 0; i < res.rows.length; i++) {
			var li = genLi(res.rows.item(i));
			console.log(li);
			if (type != li[0]) {
				type = li[0];
				$list.append('<p style="margin: 4% 0 0 4%;">' + type + '</p>');
				$list.append('<ul  class="mui-table-view ' + type + '" style="margin-top:0;"></ul>');
			}
			$list.find('.'+type).append(li[1]);
		}
	});
}

function genLi(data) {
	var id = data.id;
	var type = data.plan_type;
	var title = data.plan_title;
	
	var li = '<li class="mui-table-view-cell" id="' + id + '" >' + title + '</li>';
	return [type, li];
}
/**
 * to generate id by type and.
 * @param {Object} type
 * @param {Object} number
 */
function genId(type, number) {
	var date = new Date();
	var timestamp = date.getTime();
	return type + timestamp.toString() + number;
}
