/*
 * 非主页面的回退到主页面
 */
function back() {
	if(showMenu) {
		//菜单处于显示状态，返回键应该先关闭菜单，阻止主窗口执行mui.back逻辑
		closeMenu();
		return false;
	} else {
		// 菜单处于隐藏状态，执行返回时，回退到主页面
		var main = plus.webview.getWebviewById('HBuilder');
		main.evalJS('mask.close();')
		setTimeout(function() {
			main.show();			
		},200);

		return false;
	}
}

/*
 * 显示菜单页面
 */
function openMenu() {
	if (!showMenu) {
		//解决Android 4.4以下版本webview移动时，导致fixed定位元素错乱的bug
		if (mui.os.android && parseFloat(mui.os.version) < 4.4) {
			document.querySelector("header.mui-bar").style.position = "static";
			//同时修改以下.mui-content的padding-top,否则会多出空白；
			document.querySelector(".mui-bar-nav~.mui-content").style.paddingTop = "0px";
		}
		// 显示主窗口遮罩
		mask.show();		
		// 侧滑菜单处于隐藏状态，立刻显示出来；
		// 显示完毕后，根据不同动画效果移出窗体
		menu.show('menu', 0, function() {
			menu.setStyle({
				left: 0,
				transition: {
					duration: 150
				}
			});
		});
	}
	showMenu = true;
}

/*
 * 关闭侧滑菜单
 */
function closeMenu() {
	
	_closeMenu();
	mask.close();
}

function _closeMenu() {
	if (showMenu) {
		//解决Android 4.4以下版本webview移动时，导致fixed定位元素错乱的bug
		if (mui.os.android && parseFloat(mui.os.version) < 4.4) {
			document.querySelector("header.mui-bar").style.position = "static";
			//同时修改以下.mui-content的padding-top,否则会多出空白；
			document.querySelector(".mui-bar-nav~.mui-content").style.paddingTop = "0px";
		}
		menu.setStyle({
			left: '-70%',
			transition: {
				duration: 150
			}
		});
		
		// 等待窗体动画结束，隐藏菜单webview，节省资源
		setTimeout(function() {
			menu.hide();
		}, 300);
		showMenu = false;
	}
}