Ext.ns('Wlj.search.App');

Wlj.search.App.UTIL = {
	needSearchArea : false,				//是否需要点击开始后的主查询页面，该配置项会影响到的开始、返回主功能图标的展示
	menuInWindow : true,				//是否构建任务窗口顶部内置菜单
	buildComsits : true,				//是否为任务构建相关功能菜单
	headerFunctions : 'HEADBUTTONS', 	//首页主功能导航区展示内容：menuRoot，或者某个菜单下的子菜单：res：XXX，或者HEADBUTTONS;
	menuHeaderCount : 6,				//如首页展示菜单（一级菜单，或者某子菜单）时，主功能区的展示的菜单个数。
	needStartOBack : false,				//如首页展示菜单（一级菜单，或者某子菜单）时，是否始终需要一个开始返回按钮
	
	autoCreateGroup : true,				//如果瓷贴不在当前已有瓷贴个数内，是否创建新的组：true，创建新的group，并渲染瓷贴；false：舍弃该瓷贴；
	defaultTileGroupCount : 3,			//默认瓷贴组个数
	defaultTileGroupOwnerH : 3,			//瓷贴组纵向默认瓷贴单元数 
	defaultTileGroupOwnerW : 6,			//瓷贴组横向默认瓷贴单元数
	defaultIndexTileWidthUnit : 128,	//单元瓷贴宽度
	defaultIndexTileHeightUnit : 128,	//单元瓷贴高度
	defaultIndexTileMarginUnit : 1,		//1/2单元瓷贴间距
	
	groupMargin : 12,					//瓷贴组间距
	
//	containerTop : 79,					//瓷贴容器顶边距属性
	containerLeft : 0,					//瓷贴容器左边距属性
	
	headerHeight : 80,					//首页主功能导航区高度，暂不支持修改
	headerTopMargin : 56,				//主功能导航区顶部间隔
	headerButtomMargin : 23,			//瓷贴组及查询区域等，与主功能导航区域的间隔
	
	taskbarHeight : 40,					//任务栏高度，暂不支持修改
	//由此，瓷贴区域，以及搜索区域，高度，则可根据以上配置计算得出：
	//	瓷贴区域以及搜索区域高度：screenHeight - headerHeight - headerTopMargin - headerButtomMargin - taskbarHeigth
	//	瓷贴区域以及搜友区域距离顶部的距离： headerHeight + headerTopMargin + headerButtomMargin
	
	viewAdjust : true					//有限范围内，界面展示优化逻辑开关.默认启用。
	
};
APPUTIL = Wlj.search.App.UTIL;
Wlj.search.App.HEADERBUTTONS = [{
	id : 'backFunction',
	name:'返回',
	acls : 'lv1',
	iconcls : 'icon0',
	wordcls : 'word',
	cssText : 'display:none;',
	cls : '',
	handler:function(p,f,dom){
		p.appObject.HideSearchArea();
	}
},{
	id:'startFunction',
	name:'开始',
	cssText : !APPUTIL.needSearchArea?'display:none;':'',
	acls : 'lv1',
	iconcls : 'icon1',
	wordcls : 'word',
	cls : '',
	handler:function(p,f,dom){
		p.appObject.ShowSearchArea();
	}
},{
	id:'menuFunction',
	name:'菜单',
	acls:'lv1',
	iconcls : 'icon2',
	wordcls : 'word',
	cssText : '',
	cls : '',
	menuRoot : false,
	functionName : 'Wlj.widgets.search.header.MenuFunction'
},{
//	name:'配置',
//	acls:'lv1',
//	iconcls : 'icon3',
//	wordcls : 'word',
//	cssText : '',
//	cls : '',
//	handler : function(p,f,dom){
//		见首页右键菜单
//	}
//},{
	name:'主题',
	acls:'lv1',
	iconcls : 'icon4',
	wordcls : 'word',
	cssText : '',
	cls : '',
	handler : function(parent,_thisObj,dom){
		if(!_thisObj.controll){
			var cfg = {
				themeData : parent.appObject.themeData,
				themes : Wlj.search.App.THEME,
				backgrounds : Wlj.search.App.BACKGROUND,
				wordsizes : Wlj.search.App.WORDSIZE,
				BG_ICON : __background,
				THEME_CSS : __theme,
				WORD_SIZE : __wordsize,
				renderTo :  _thisObj.el,
				hidden : true
			};
			_thisObj.controll = new Wlj.widgets.search.header.Customize(cfg);
		}
		if(_thisObj.controll.hidden){
			_thisObj.controll.show();
		}
//		if(parent.headerFun.get(4).plugin && !parent.headerFun.get(4).plugin.hidden){
//			parent.headerFun.get(4).plugin.hide();
//		}
	},
	outHandler : function(p,_thisObj,dom){
		if(_thisObj.controll && !_thisObj.controll.hidden){
			_thisObj.controll.hide();
		}
	}
},
{
	name:'图表',
	acls:'lv1',
	iconcls : 'icon7',
	wordcls : 'word',
	cssText : '',
	cls : '',
	handler : function(parent,_thisObj,dom){
		if(!_thisObj.plugin){
			_thisObj.plugin = new indexTileExtra({
				renderTo :  _thisObj.el,
				appObject : parent.appObject,
				hidden : true
			});
		}
		if(_thisObj.plugin.hidden){
			_thisObj.plugin.show();
		}else{
			_thisObj.plugin.hide();
		}
		if(parent.headerFun.get(3).controll && !parent.headerFun.get(3).controll.hidden){
			parent.headerFun.get(3).controll.hide();
		}
	},
	outHandler : function(p,_thisObj,dom){
		if(_thisObj.plugin && !_thisObj.plugin.hidden){
			_thisObj.plugin.hide();
		}
	}
},{
	name:'模式',
	acls:'lv1',
	iconcls : 'icon5',
	wordcls : 'word',
	cssText : '',
	cls : '',
	handler:function(p,f,dom) {
		window.location.href = basepath + '/contents/wljFrontFrame/xtIndex.jsp';
		//记录切换失败
		Ext.Ajax.request({
			url:basepath+'/switchThemeAction!updateUserCfg.json?themeId=1',
			method: 'POST',
			success : function(response) {//记录切换成功，不提示			
			},
			failure : function(response) {//记录切换失败
				Ext.Msg.alert('提示', '模式切换失败!');
			}
		});
	}
}
//,{
//	name:'任务',
//	acls:'lv1',
//	iconcls : 'icon6',
//	wordcls : 'word',
//	cssText : '',
//	cls : '',
//	handler:function(p,f,dom) {
//		Wlj.TaskMgr.showTasks(dom);
//	}
//},{
//	name:'服务',
//	acls:'lv1',
//	iconcls : 'icon7',
//	wordcls : 'word',
//	cssText : '',
//	cls : '',
//	handler:function(p,f,dom) {
//		Wlj.ServiceMgr.showServiceWindow();
//	}
//}
//,{
//	name:'GETDEMOJSONS',
//	acls:'lv1',
//	iconcls : 'icon7',
//	wordcls : 'word',
//	cssText : '',
//	cls : '',
//	handler:function(p,f,dom) {
////		Ext.Ajax.request({
////			url : basepath+'/lookup.json',
////			method : 'GET',
////			success : function(a,b,c){debugger;}
////			
////		});
//		
//		var theUrls = [
//		               '/loanfproduct.json',
//		               '/usermanagequery.json',
//		               '/systemUnit-query.json',
//		               '/loanfcontract.json',
//		               '/loanfcontractbelong.json',
//		               '/loanfhkplan.json',
//		               '/loanfskrecord.json',
//		               '/loanfznjreduce.json',
//		               '/loanfblack.json',
//		               '/loanfcustomer.json'
//		               ];
//		
//		createDemoJson(theUrls);
//		
//	}
//	
//}
];

function createDemoJson(urls){
	if(urls.length == 0){
		return;
	}else {
		Ext.Ajax.request({
			url : basepath+urls.pop(),
			method:'GET',
			params : {
				createJson : 'true'
			},
			success : function(){
				createDemoJson(urls);
			}
		});
	}
	
	
}

Wlj.search.App.TASKEXTENSION = [{
	text : '刷新',
	cls:'simple-btn1',
	overCls:'simple-btn1-hover',
	handler : function(){
		this.ownerCt.windowObject.taskObject.reload();
	}
},'-',{
	text : '返回首页',
	cls:'simple-btn1',
	overCls:'simple-btn1-hover',
	handler : function(){
		Wlj.TaskMgr.tasks.each(function(task){
			task.minisize();
		});
	}
},'-',{
	text : '登出',
	cls:'simple-btn1',
	overCls:'simple-btn1-hover',
	handler : function(){
		top.window.location.href = basepath+'/j_spring_security_logout';
	}
}];

Wlj.search.App.SEARCHTYPES = [{
	name : '客户',
	searchType : 'CUSTOMER',
	searchUrl : '/contents/pages/wlj/customerManager/customerQueryNew/customerQueryNew.js'
},{
	name : '产品',
	searchType : 'PRODUCT',
	searchUrl : '/contents/pages/wlj/productManager/productInfoListNew/productInfoListNew.js'
}
//,{
//	name : '功能',
//	searchType : 'FUNCTION',
//	searchUrl : '/contents/pages/testtiles/oprationGuard.jsp'
//}
,{
	name : '在线智库',
	searchType : 'KNOWLEGE',
	searchUrl : '/contents/pages/wlj/workspaceManager/information/newInformation.js'
}];

/**
 * 瓷贴颜色
 */
Wlj.search.App.TILECOLOR ={
	red : {
		bColor : '#FF0000',
		fColor : '#1f373d'
	},
	blue : {
		bColor : '#1b96d1'
	},
	pink : {
		bColor:'#FF1493'
	},
	yellow : {
		bColor:'#FFFF00'
	},
	green : {
		bColor:'#9ACD32'
	},
	gray : {
		bColor:'#808080'
	},
	lightblue : {
		bColor:'#BBFFEE'
	},
	zise : {
		bColor:'#FF3EFF'
	},
	color9 : {
		bColor:'#CCBBFF'
	},
	color10 : {
		bColor:'#66009D'
	}
};
/**
 * 皮肤设置
 * @type 
 */
Wlj.search.App.THEME = [{
	preBG : '/contents/wljFrontFrame/styles/search/searchthemes/blue/pics/index/themes_pic_01.jpg',
	themeName : 'blue'
},{
	preBG : '/contents/wljFrontFrame/styles/search/searchthemes/blue/pics/index/themes_pic_02.jpg',
	themeName : 'darkblue'
},{
	preBG : '/contents/wljFrontFrame/styles/search/searchthemes/blue/pics/index/themes_pic_02.jpg',
	themeName : 'orange'
}];
/**
 * 背景图片
 */
Wlj.search.App.BACKGROUND = [{
	preBG : '/contents/wljFrontFrame/styles/search/searchthemes/blue/pics/index/index_bg_01_small.gif',
	reaBG : '/contents/wljFrontFrame/styles/search/searchthemes/blue/pics/index/index_bg_01.jpg'
},{
	preBG : '/contents/wljFrontFrame/styles/search/searchthemes/blue/pics/index/index_bg_02_small.gif',
	reaBG : '/contents/wljFrontFrame/styles/search/searchthemes/blue/pics/index/index_bg_02.jpg'
},{
	preBG : '/contents/wljFrontFrame/styles/search/searchthemes/blue/pics/index/index_bg_03_small.gif',
	reaBG : '/contents/wljFrontFrame/styles/search/searchthemes/blue/pics/index/index_bg_03.jpg'
},{
	preBG : '/contents/wljFrontFrame/styles/search/searchthemes/blue/pics/index/index_bg_04_small.gif',
	reaBG : '/contents/wljFrontFrame/styles/search/searchthemes/blue/pics/index/index_bg_04.jpg'
}];
/**
 * 字号设置
 * @type 
 */
Wlj.search.App.WORDSIZE = [{
	size : 'ra_normal',
	text : '正常(默认)'
},{
	size : 'ra_max',
	text : '大号'
}];
/**
 * 后台数据服务地址列表
 */
Wlj.search.App.DATA_SERVICE = {
	menuService : {
		url : '/indexinit.json',
		root : 'json.data'
	},
	userTileService : {
		url : '/usertile.json',
		root : 'json.data'
	},
	comunicatFunctionService : {
		url : '/comfunctionset.json',
		root : 'returns.data'
	}
};

/**
 * 右键菜单配置方案，
 * 下列某对象右键列表配置必须存在，且为数组对象，如不需要某项列表，可将该数据置为空数组，如[];
 * 每个右键菜单本身，必须至少有text和fn属性。且，fn属性为function。另，可添加Ext.menu.MenuItem的配置项。
 * 其他对象右键配置对象将逐步扩展。
 */
Wlj.search.App.CONTEXT_MENU = {
	//任务栏右键列表，作用域：任务栏对象；Wlj.widgets.search.window.TaskBar
	TASK_BAR : [{
		text : '返回首页',
		fn : function(){
			Wlj.TaskMgr.tasks.each(function(task){
				task.minisize();
			});
		}
	},{
		text : '关闭所有',
		fn : function(){
			this.closeAll();
		}
	},{
		text : '关闭非当前',
		fn : function(){
			this.closeWithOutCurrent();
		}
	}],
	//任务对象右键列表，会向上冒泡至任务栏。作用域：任务对象：Wlj.widgets.search.window.TaskItem
	TASK_ITEM : [{
		text : '关闭窗口',
		fn : function(){
			this.close();
		}
	},{
		text : '关闭其他',
		fn : function(){
			this.closeOthers();
		}
	},{
		text : '最大化',
		fn : function(){
			this.maxisize();
		}
	},{
		text : '最小化',
		fn : function(){
			this.minisize();
		}
	}],
	//首页瓷贴右键列表，会向上冒泡至瓷贴组对象；作用域：Wlj.widgets.search.tile.IndexTile
	INDEX_TILE : [{
		text : '打开',
		fn : function(){
			this.clickFire();
		}
	}],
	//首页瓷贴组右键列表，会向上冒泡至瓷贴容器对象；作用域：Wlj.widgets.search.tile.TileGroup
	TILE_GROUP : [],
	//首页瓷贴容器右键列表；作用域：Wlj.widgets.search.tile.TileContainer
	TILE_CONTAINER : [{
		text :'保存配置',
		fn : function(){


		
		var results = [];
		var groups = _APP.tileContainer.items;
	
		groups.each(function(g){
			var groupSeq = groups.indexOf(g);
			g.items.each(function(t){
				var posX = t.pos_size.TX;
				var posY = t.pos_size.TY;
				var tileSize = _APP.translateSizeCode(t.pos_size.TW,t.pos_size.TH);
				var resId = t.menuData.ID;
				var moduleId = t.menuData.MOD_FUNC_ID;
				var tileIcon = t.tileLogo?t.tileLogo:'';
				var tileColor = t.tileColor?t.tileColor:'';
				var jsUrl = t.jsUrl?t.jsUrl:'';
				//if(moduleId && resId)
				results.push({
					groupSeq : groupSeq,
					resId : resId,
					moduleId : moduleId,
					tileSize : tileSize,
					posX : posX,
					posY : posY,
					tileIcon : tileIcon,
					tileColor : tileColor,
					spareOne : jsUrl
				});
				
			});
		});
		Ext.Ajax.request({
			url : basepath + '/usertile.json',
			method : 'post',
			params : {
				condition : Ext.encode(results)
			},
			success : function(){
				Ext.Msg.alert('提示','保存成功！');
			}
		});
		
	
		
			
		
		}
	}]
};

Wlj.search.App.FUNCTIONRECOMMEND = [{
	name : '菜单',
	cls : 'dddd',
	type : 'menus'
}];