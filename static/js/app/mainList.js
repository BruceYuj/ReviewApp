
mui.plusReady(function() {
	
	//初次登录展示功能
	initHelp();
	initList();
});

function initHelp() {
	var help = lib.h.getItem('help');
	if (help == null) {
		lib.h.update(db, 'create table if not exists tb_plan (GUID TEXT unique, plan_title TEXT, plan_description TEXT, plan_mk_time DATETIME, review_model TEXT, plan_type TEXT)');
		lib.h.update(db, 'create table if not exists tb_review_model (GUID TEXT unique, model_title TEXT, model_regulation TEXT)');
		lib.h.update(db, 'create table if not exists tb_plan_type (GUID TEXT unique, plan_type_title TEXT)');
		lib.h.update(db, 'create table if not exists tb_plan_flow (GUID TEXT unique, plan_id TEXT, review_time INTEGER, finish_state INTEGER, time_interval INTEGER, begin_time DATETIME)');

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
 * 初始化今日待办
 */
function initList() {
	
	var $list = $('#todoList').empty();

	lib.h.query(db, 'select * from tb_plan order by plan_type desc', function(res) {
		var type = '';
		console.log(res.rows.length);
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
	var id = data.GUID;
	var type = data.plan_type;
	var title = data.plan_title;
	
	var li = '<li class="mui-table-view-cell" id="' + id + '" >' + title + '</li>';
	return [type, li];
}

