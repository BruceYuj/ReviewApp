
## 已完成
### 功能点
1. 复习模式: 
    1. 查看复习模式具体内容
    2. 内容修改功能
2. 类别：
    1. 长按删除功能
3. 首页：
    1.展示待完成任务
    - 按照时间先后顺序展示
    - 每条记录展示所属类别
    - 长按完成该任务
    - 下拉刷新
    - 设置已完成任务的box（可以更加清楚今天完成的任务）
4. 添加任务管理页面
    1. 任务展示页面
    2. 任务详情页面，并提供修改功能（只能修改某些东西，需要考虑到级联删除）(没有提供修改功能)
5. 数据库资料备份与清理
    1. 提供数据库数据导出功能
   		- 通过本地文件系统将sql文件保存在本地，定期上传到云端。(已经能够保存到本地，上传并未作出自动化处理)
	2. 提供数据库数据清理处理（过久并且已完成的需要清除）
    	- 清除标准：当前模式下，所有任务已经全部完成，可以清除,减少数据库溢出可能。
    	- 本地文件存储：json格式字符串：包含任务标题并且将任务内容和完成模式写入本地文件。
	```		
			{
			    "plan_title": "测试1",
			    "plan_description": "测试1",
			    "plan_type": "前端",
			    "review_model": "艾宾浩斯复习",
			    "plan_mk_time": "xxxx-xx-xx xx"
			}
	```

6. 任务的分析
	1. 每天任务分析： 饼状图（已完成、未完成） + 任务详情
	2. 每天任务分析： 饼状图（已完成、未完成） + 任务详情
	3. 每天任务分析： 饼状图（已完成、未完成） + 任务详情
### bug修复
1. 修复menu页面重复点击进入其他页面，遮罩未消失bug

## 未完成
### 功能点
1. 数据库备份文件自动上传

### bug修复
1. 下拉刷新时会触发list的点击事件
可能原因：下拉刷新监听的是全局界面，因此会产生冲突
解决方案：长按删除改成滑动删除