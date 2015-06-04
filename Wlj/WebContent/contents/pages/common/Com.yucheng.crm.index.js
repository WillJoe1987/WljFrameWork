/**
 * 基础版本，首页加载，包括：
 * 基本框架部署器、页签对象、一级菜单对象、二级菜单对象、子菜单对象、右键菜单对象（无UI）
 * 基本配置信息，存放于Com.yucheng.crm.index.Util，调用句柄INDEXUTIL。
 * @author WILLJOE
 * @since 2012-11-27
 * @version 1.0
 * 			1.0.1(2012-11-28)    里程碑版本：兼容IE6
 * 			1.0.2(2012-11-28)    里程碑版本：兼容IE9
 */
Ext.ns("Com.yucheng.crm.index");
Com.yucheng.crm.index.Util = {
	tabMaxCount : 10,												//最大页签个数，小于1时，为无上限
	reopenOrAlert : true,											//超过最大页签限制时动作：true：关闭最早页签，打开新页签；false：提示页签超限，不打开新页签。
	countOverMsg : "已超过最大页签数",								//超过页签最大个数时，提示信息
	rigthKeyEnable : true,											//右键点击页签开关
	refreshMainPage : true,											//点击“首页”一级菜单是否刷新首页
	indexContentUrl : basepath+'/contents/pages/index/mainPage.jsp',//首页面内容URL
	pageReloadable : true,											//打开已开链接是否刷新该页面
	titleDraggable : true,											//是否启用页签标题栏拖动功能
	
	tabNameShort : false,											//页签名称过长时，是否截取tab名称，以“...”补充
	tabNameMaxLen : 9,												//页签名称最大长度，在tabNameShort为true时生效。
	subMenusNameShort : true,										//子菜单名字过长时，是否截取菜单名称，以“...”代替
	subMenusNameMaxLen : 9,											//子菜单名称过长时，是否截取菜单名称长度.subMenusNameShort为true时生效,二、三级菜单名称最大长度为9，往下逐级减1.
	
	expandingSubMenuMode :true,										//二级菜单是否只展开一个：true：展开二级菜单时，合上其他二级菜单；false：二级菜单展示各不干扰
	subMenuHidable : false,											//启用左侧子菜单隐藏功能	
	subSuspensionable : false,										//是否启用二级菜单悬浮策略
	
	mainMenuPage : true,											//点击一级菜单是否打开默认页面
	
	reLayoutSubMenus : false,										//采用下拉模式菜单样式
	
	menuReloadable : true,											//菜单初始化失败，是否重新查询菜单信息
	menuReloadCount : 3,											//菜单初始化失败，重新加载菜单信息次数
	menuLoadedCount : 0,											//菜单已加载次数
	menuReloadDelayMs : 1000,										//重新加载菜单时间间隔
	
	waitMsg : '正在加载页面……',										//加载等待提示信息
	
	titleButtons : false,											//是否启用页签栏的快捷功能
		
	shortCuts : [{													//右上角快捷图标配置
		enable:true,
		id : 'preGroup',
		className:'changemenu',
		title:'切换',
		backgroundImg : basepath + '/contents/images/ic_bt04.gif',
		handler : function(){
			this.booter.showPreGroup();
		},
		beControlled: false
	},{
		enable:true,
		id : 'nextGroup',
		className:'changemenu',
		title:'切换',
		backgroundImg : basepath + '/contents/images/ic_bt01.gif',
		handler : function(){
			this.booter.showNextGroup();
		},
		beControlled: false
	},{																
		enable:true,												//是否启用该图标,为false时，隐藏。
		id : 'custManagerPlat',										//对象ID，亦DOM ID
		className : 'cmwp',											//图标DOM样式
		title : '客户经理工作台',									//图标TITLE
		backgroundImg : basepath + '/contents/images/ic_bt06.gif',	//图标路径
		handler : function(){										//图标点击事件
			if(accordionWindow.isVisible()){
				eval('accordionWindow.'+accordionWindow.closeAction+'();');
			}else {
				accordionWindow.show(this.iconEl,function(){
					accordionWindow.expand(true);
				});
			}
		},
		beControlled: true
	},{
		enable:true,
		id : 'offenOp',
		className : 'offen',
		title : '常用操作',
		backgroundImg : basepath + '/contents/images/ic_bt07.gif',
		handler : function(){
			if(iconForViewPanel2.isVisible()){
				iconForViewPanel2.hide();
			}else{
				iconForViewPanel2.show(this.iconEl);
			}
		},
		beControlled: true
	},{
		enable:true,
		id : 'cu',
		className : 'cu',
		title : "登录用户:"+__userCname+"||登录日期:"+new Date().format("Y-m-d"),
		backgroundImg : basepath + '/contents/images/ic_bt08.gif',
		handler : function(){
			this.booter.switchCurrentRole();
		},
		beControlled: true
	},{
		enable:true,
		id : 'logout',
		className : 'logout',
		title : '注销',
		backgroundImg : basepath + '/contents/images/ic_bt02.gif',
		handler : function(){
			window.location.href = basepath + '/j_spring_security_logout';
		},
		beControlled: true
	}]
};
INDEXUTIL = Com.yucheng.crm.index.Util;
/**
 * 页面框架部署器
 */
Com.yucheng.crm.index.IndexBooter = function(){
	
	var _this = this;
	_this.mainMask.show();
	
	this.sh;                                    //浏览器高度
	this.sw;     								//浏览器宽度
	this.hh; 									//顶部高度
	this.hw; 									//顶部宽度
	this.mainFrameHeight; 						//中间iframe高度
	this.leftmenuHeight=0; 						//左侧菜区单高度
	this.subMenuHidding = false;				//左侧菜单是否隐藏
	
	this.mouseX = 0;
	this.mouseY = 0;
	
	this.menu1Num=7;  							//一组一级菜单数量
	this.menu1Width=this.menu1Num*81;   		//一级菜单宽度
	this.currMainMenu = false; 					//当前一级菜单
	
	this.tagPages = new Array();				//当前页签对象数组,以最近切换次序存储
	this.currTagPage = false;					//当前展示页签对象
	
	this.subSuspensionableLocal = INDEXUTIL.subSuspensionable;
	Ext.each(INDEXUTIL.shortCuts,function(cfg){			//初始化快捷图标
		var si = _this.createIcon(cfg);
		if(cfg.id == 'preGroup')						//前一组菜单
			_this.preGroupEl = si.iconEl;
		else if(cfg.id == 'nextGroup')					//后一组菜单
			_this.nextGroupEl = si.iconEl;
	});
	
	if(INDEXUTIL.titleButtons){
		_this.createTitleButtons();					//页签栏按钮
	}
	
	_this.createIndexMenuEl();					//创建菜单“首页”
	
	Ext.EventManager.onWindowResize(function(){ //窗口大小发生变化时调用
		_this.setFrame();
	});
	
	if(INDEXUTIL.subMenuHidable  && !INDEXUTIL.reLayoutSubMenus){
		Ext.fly('logo').on('click',function(){
			if(_this.subMenuHidding){
				_this.showSubMenus();
			}else{
				_this.hideSubMenus();
			}
		});
	}

	if(INDEXUTIL.subSuspensionable || this.subSuspensionableLocal){//是否启用二级菜单悬浮
		_this.suspensionInit();
	}
	
	if(INDEXUTIL.titleDraggable){
		Ext.fly('rightTagConent').on('mousedown',function(){
			INDEXUTIL.mouseX = event.screenX;
			INDEXUTIL.mouseY = event.screenY;
			document.detachEvent('onmousemove',_this.tagTitleMove);
			document.attachEvent('onmousemove', _this.tagTitleMove);
		});
		Ext.fly('rightTagConent').on('mouseup',function(){
			document.detachEvent('onmousemove',_this.tagTitleMove);
			_this.tagTitleMoveFix();
		});
		Ext.fly('rightTagConent').on('mouseout',function(){
			document.detachEvent('onmousemove',_this.tagTitleMove);
			_this.tagTitleMoveFix();
		});
	}
	
	if(INDEXUTIL.reLayoutSubMenus){
		_this.hideSubMenus();
	}
	_this.initSecurityBooter();							//认证管理初始化
	//_this.initMenus();								//初始化菜单
	
};

Com.yucheng.crm.index.IndexBooter.prototype.mainMask = new Ext.LoadMask(Ext.getBody(), {msg:INDEXUTIL.waitMsg});
Com.yucheng.crm.index.IndexBooter.prototype.lInfo = function(info){
	Ext.select(".x-mask-loading").first().dom.innerText=info;
};
Com.yucheng.crm.index.IndexBooter.prototype.securityBooter = null;
Com.yucheng.crm.index.IndexBooter.prototype.__menus = [];         //菜单数据
Com.yucheng.crm.index.IndexBooter.prototype.__mainMenuObj = [];   //一级菜单对象数组
Com.yucheng.crm.index.IndexBooter.prototype.indexMenuEl = false;  //一级菜单“首页”DOM对象
Com.yucheng.crm.index.IndexBooter.prototype.mainMenuElArr = [];   //一级菜单行数组，为LI DOM对象
Com.yucheng.crm.index.IndexBooter.prototype.currMenuGrp = 0;      //当前展示第几行一级菜单
Com.yucheng.crm.index.IndexBooter.prototype.contextMenu = false;  //
Com.yucheng.crm.index.IndexBooter.prototype.shortCutIcons = [];	  //快捷按钮对象数组


/**
 * 打开页签
 * @param _id
 * @param _tagurl
 * @param _content
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.addTag = function(_id, _tagurl, _content){
	var _this = this;
	var refresh_flag = true;//刷新标志
	
	if(!_tagurl){// 无URL时，不做任何操作
		return;
	}
	//切换主显示区域
	Ext.fly('indexPageFrame').setStyle('display','none');
	Ext.fly('wholeContent').setStyle('display','block');
	if(_this.getTagPages(_tagurl)){
		if(INDEXUTIL.pageReloadable){
			_this.getTagPages(_tagurl).frameEl.src = _tagurl;
		}
		_this.setCurrTag(_this.getTagPages(_tagurl));
		return;
	}
	
	if(INDEXUTIL.tabMaxCount>0 && _this.tagPages.length>=INDEXUTIL.tabMaxCount){
		if(INDEXUTIL.reopenOrAlert){
			_this.tagPages[0].destroy();
		}else{
			alert(INDEXUTIL.countOverMsg);
			return;
		}
	}
	
	var tagpage = new Com.yucheng.crm.index.TagPage(_id, _tagurl, _content);
	tagpage.booter = _this;
	_this.tagPages.push(tagpage);
	_this.setCurrTag(tagpage);
	Ext.select(".frame_iframe").setHeight(_this.sh-_this.hh-40);
};
/**
 * 移除最近几个页签之前几个页签
 * @param curr：保留最近页签个数
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.destroyRelateTabs = function(curr){
	var _this = this;
	if(!_this.currTagPage){
		return false;
	}
	var leftNum = 0;
	if(typeof curr =='number'){
		leftNum = curr;
	}
	
	while(_this.tagPages.length>leftNum){
		_this.tagPages[0].destroy();
	}
};
/**
 * 移除TAG对象，参数可为该对象的存储顺序，或者tag对象,参数为空时，不做任何操作
 * @param tag
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.destroyOtherTabs = function(tag){
	var _this = this;
	var opTag = null;
	if(typeof tag == 'number'){
		opTag = _this.tagPages[tag];
	} else if(tag.url){
		opTag = tag;
	} else {
		return false;
	}
	_this.tagPages.remove(opTag);
	while(_this.tagPages.length>0){
		_this.tagPages[0].destroy();
	}
	_this.setCurrTag(opTag);
};
/**
 * 设置当前页签
 * @param tag
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.setCurrTag = function(tag){
	if(this.currTagPage){
		this.currTagPage.switchOut();
	}
	tag.switchIn();
	this.currTagPage = tag;
	this.tagPages.remove(tag);
	this.tagPages.push(tag);
	if(INDEXUTIL.titleDraggable){
		this.tagChooseFix();
	}
};
/**
 * 根据URL判断是否已打开,如打开，则返回该TAGPAGE对象，否则返回false
 * @param tagPage
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.getTagPages = function(tagPage){
	for(var i=0;i<this.tagPages.length;i++){
		if(this.tagPages[i].equals(tagPage)){
			return this.tagPages[i];
		}
	}
	return false;
};
/**
 * 设置框架外观,调用一级菜单渲染方法
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.setFrame = function(){
	var _this = this;
	/**
	 * TODO 找到更好的获取整个页面高度的方法。
	 */
	_this.hh=Ext.select(".topbg").first().getHeight();
	_this.sw=document.documentElement.clientWidth;
	_this.sh=document.documentElement.clientHeight;
	//根据屏幕宽度自动调整一级菜单数目
	//Logo=361;Toolbar=4*36=180  右空出15
	_this.menu1Width=_this.sw-361-185-76;
	_this.menu1Num=parseInt(_this.menu1Width/81);
	//设置主工作区域的高度
	var contentHeight=document.documentElement.clientHeight-92;
	Ext.fly("indexPageFrame").setHeight(contentHeight);
	Ext.fly("nav").setWidth(_this.menu1Width);
	//21-logininfo_height 46-foot_height
	_this.maxMenuHeight = _this.sh-_this.hh-5;
	Ext.select(".frame_container").setHeight(_this.sh-_this.hh-5); 
	Ext.select(".left_menu").setHeight(_this.sh-_this.hh-5);
	//iframe高度	
	Ext.select(".frame_iframe").setHeight(_this.sh-_this.hh-40);
	//左侧菜单区最小高度
	if(	Ext.select(".frame_container").getHeight()<_this.leftmenuHeight){
		Ext.select(".frame_container").setHeight(_this.leftmenuHeight);
		Ext.select(".left_menu").setHeight(_this.leftmenuHeight);
		Ext.select(".frame_iframe").setHeight(_this.leftmenuHeight);
	}	
	_this.renderMainMenus();
};
/**
 * 创建一级菜单“首页”
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.createIndexMenuEl = function(){
	var _this = this;
	_this.indexMenuEl = document.createElement("a");
	_this.indexMenuEl.className = "nav1";
	_this.indexMenuEl.innerHTML = "首页";
	if(Ext.isIE6){
		_this.indexMenuEl.onmouseover = function(){
			_this.indexMenuEl.className = 'navover1';
		};
		_this.indexMenuEl.onmouseout = function(){
			_this.indexMenuEl.className = 'nav1';
		};
	}
	_this.indexMenuEl.onclick = function(){
		_this.indexMenuClick();
	};
};
/**
 * 一级菜单“首页”点击动作
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.indexMenuClick = function(){
	document.getElementById("wholeContent").style.display = "none";
	document.getElementById('indexPageFrame').style.display = "";
	if(INDEXUTIL.refreshMainPage){
		document.getElementById('indexPageFrame').src = INDEXUTIL.indexContentUrl;
	}
//	debugger;
//	document.getElementById('suspensionButton').style.zIndex = -1;
};
/**
 * 初始化菜单
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.initMenus = function(){
	var _this = this;
	INDEXUTIL.menuLoadedCount ++;
	Ext.Ajax.request({
		url:basepath+'/indexinit.json',
		method:'GET',
		success:function(a,b,c,d){
			INDEXUTIL.menuLoadedCount = 0;
			var menus = Ext.util.JSON.decode(a.responseText).json.data;
			_this.__menus = menus;
			_this.createMainMenus();
			_this.setFrame();
			document.getElementById('indexPageFrame').src = INDEXUTIL.indexContentUrl;
			_this.mainMask.hide();
		},
		failure:function(a,b,d,c){
			if(INDEXUTIL.menuReloadable && INDEXUTIL.menuLoadedCount <= INDEXUTIL.menuReloadCount){
				_this.lInfo('菜单初始化异常，正在做第' + INDEXUTIL.menuLoadedCount + '次尝试...');
				var task = new Ext.util.DelayedTask(function(){
					_this.initMenus();
				});
				task.delay(INDEXUTIL.menuReloadDelayMs);
			}else{
				_this.mainMask.hide();
				Ext.Msg.alert('系统异常','菜单初始化错误，请稍后重新登陆！');
			}
		}
	});
};
/**
 * 创建一级菜单对象
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.createMainMenus = function(){
	var _this = this;
	Ext.each(_this.__menus,function(a){
		if(a.PARENT_ID==0){
			var tMainMenu = new Com.yucheng.crm.index.MainMenu(a);
			tMainMenu.booter = _this;
			_this.__mainMenuObj.push(tMainMenu);
		}
	});
};
/**
 * 渲染添加一级菜单
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.renderMainMenus = function(){
	
	var _this = this;
	
	_this.nextGroupEl.style.display='none';
	_this.preGroupEl.style.display='none';
	var rootMenusEl = document.getElementById("rootMenus");
	while(rootMenusEl.hasChildNodes()){
		rootMenusEl.removeChild(rootMenusEl.firstChild);
	}
	delete _this.mainMenuElArr;
	_this.mainMenuElArr = [];
	
	var mGroupCount = Math.ceil((_this.__mainMenuObj.length+1)/_this.menu1Num);
	
	for(var i=0; i<mGroupCount; i++){
		var tLi = document.createElement('li');
		if(i==0){
			tLi.appendChild(_this.indexMenuEl);
			for(var mi=0;mi<_this.menu1Num-1&&mi<_this.__mainMenuObj.length;mi++){
				tLi.appendChild(_this.__mainMenuObj[mi].MainMenuEl);
			}
			_this.mainMenuElArr.push(tLi);
			rootMenusEl.appendChild(tLi);
		}else{
			for(var mi=i*_this.menu1Num-1; mi<(i+1)*_this.menu1Num-1&&mi<_this.__mainMenuObj.length; mi++){
				tLi.appendChild(_this.__mainMenuObj[mi].MainMenuEl);
			}
			tLi.style.display = 'none';
			_this.mainMenuElArr.push(tLi);
			rootMenusEl.appendChild(tLi);
		}
	}
	
	if(mGroupCount>1){
		_this.nextGroupEl.style.display = '';
	}
	
};
/**
 * 显示下一组一级菜单
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.showNextGroup = function(){
	var _this = this;
	if(_this.currMenuGrp<_this.mainMenuElArr.length-1){
		_this.mainMenuElArr[_this.currMenuGrp].style.display = 'none';
		_this.currMenuGrp++;
		_this.mainMenuElArr[_this.currMenuGrp].style.display = '';
	}
	if(_this.currMenuGrp == _this.mainMenuElArr.length-1){
		_this.nextGroupEl.style.display='none';
	}
	_this.preGroupEl.style.display='';
};
/**
 * 显示前一组一级菜单
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.showPreGroup = function(){
	var _this = this;
	if(_this.currMenuGrp>0){
		_this.mainMenuElArr[_this.currMenuGrp].style.display = 'none';
		_this.currMenuGrp--;
		_this.mainMenuElArr[_this.currMenuGrp].style.display = '';
	}
	if(_this.currMenuGrp==0){
		_this.preGroupEl.style.display='none';
	}
	_this.nextGroupEl.style.display='';
};
/**
 * 展示左侧子菜单
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.showSubMenus = function(){
	var flag = document.getElementById('hiddenLeftMenuDiv').style.left;
	if(flag!="" || INDEXUTIL.subMenuHidable)
	{
		document.getElementById('frame_contents').style.paddingLeft = '183px';
		document.getElementById('frame_container').style.marginLeft = '-183px';
		document.getElementById('frame_container').style.borderLeftWidth =  '183px';
		document.getElementById('hiddenLeftMenuDiv').style.display = 'block';
	}
	this.subMenuHidding = false;
};
/**
 * 隐藏左侧子菜单
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.hideSubMenus = function(){
	document.getElementById('frame_contents').style.paddingLeft = '0px';
	document.getElementById('frame_container').style.marginLeft = '0px';
	document.getElementById('frame_container').style.borderLeftWidth = '0px';
	document.getElementById('hiddenLeftMenuDiv').style.display = 'none';
	this.subMenuHidding = true;
};
/**
 * 悬浮展示左侧子菜单
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.suspensionShowSubMenus = function(){
	document.getElementById('hiddenLeftMenuDiv').style.display = 'block';
	document.getElementById('hiddenLeftMenuDiv').style.zIndex =99999;
	document.getElementById('hiddenLeftMenuDiv').style.width = '183px';
	document.getElementById('hiddenLeftMenuDiv').style.marginLeft = '0px';
	document.getElementById('hiddenLeftMenuDiv').style.position = 'absolute';
	document.getElementById('hiddenLeftMenuDiv').style.float = 'left';
};
/**
 * 隐藏悬浮左侧子菜单
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.suspensionHideSubMenus = function(){
	document.getElementById('hiddenLeftMenuDiv').style.zIndex =-1;
	document.getElementById('hiddenLeftMenuDiv').style.width = '0px';
	document.getElementById('hiddenLeftMenuDiv').style.marginLeft = '-183px';
	document.getElementById('hiddenLeftMenuDiv').style.position = 'relative';
	document.getElementById('hiddenLeftMenuDiv').style.float = 'left';
};
/**
 * 悬浮二级菜单
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.left_menu_mouseoutfunc = function(e){
	var _this = this;
	var x = (document.layers) ? e.pageX : document.body.scrollLeft+event.clientX;
	var y = (document.layers) ? e.pageY : document.body.scrollTop+event.clientY;
	var flag = document.getElementById('hiddenLeftMenuDiv').style.left;//如果是固定模式，鼠标移出二级菜单时则不隐藏
	if((x>183||y<92)&& flag==""){
		Com.yucheng.crm.index.IndexBooter.prototype.suspensionHideSubMenus();
	}
	return false;
};

Com.yucheng.crm.index.IndexBooter.prototype.left_menu_mouseoverfunc = function(e){
	var _this = this;
	var x = (document.layers) ? e.pageX : document.body.scrollLeft+event.clientX;
	var y = (document.layers) ? e.pageY : document.body.scrollTop+event.clientY;
	if(x<183||y>92)
	{
		Com.yucheng.crm.index.IndexBooter.prototype.suspensionShowSubMenus();
	}
	return false;
};
/**
 * 初始化二级菜单悬浮状态
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.suspensionInit = function(){
	
	var _this = this;
	
	var clickDiv = document.createElement("div");
	clickDiv.id = "suspensionButton";
	var imgUrl =  basepath+'/contents/img/but003.jpg';
	clickDiv.innerHTML = "<a class=arrows id=arrows href='#'><img src=\""+imgUrl+"\"/></a></div>";
	_this.suspensionButton = clickDiv;
	document.getElementById('frame_container').appendChild(_this.suspensionButton);// 把二级菜单箭头挂在功能面板
	_this.hideSubMenus();// 隐藏左侧二级菜单
	_this.suspensionShowSubMenus();// 展示左侧二级浮动菜单
	
	// 隐藏浮动二级菜单
	document.getElementById("left_menu_p").ondblclick=function(){
		var flag = document.getElementById('hiddenLeftMenuDiv').style.left;
		if(flag!="")// 固定模式转浮动模式
		{
			_this.hideSubMenus();// 隐藏左侧二级菜单
			document.getElementById('hiddenLeftMenuDiv').style.left = ""; //关键（回复二级菜单显示位置（浮动））
			document.body.appendChild(_this.suspensionButton);// 显示二级菜单浮出箭头
			_this.suspensionShowSubMenus();// 展示左侧二级浮动菜单
			return false;
		}
		
		document.getElementById('hiddenLeftMenuDiv').style.left = "0px"; // 关键（回复二级菜单显示位置（固定））
		_this.suspensionButton.parentNode.removeChild(_this.suspensionButton);// 隐藏二级菜单浮出箭头
		_this.showSubMenus();
	};
	// 展示浮动二级菜单
	_this.suspensionButton.onclick = function(){
		_this.suspensionShowSubMenus();
	};
	document.getElementById("left_menu").onmouseout=_this.left_menu_mouseoutfunc;
	document.getElementById("left_menu").onmouseover=_this.left_menu_mouseoverfunc;
};
/**
 * 页签拖动方法
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.tagTitleMove = function(){
	var tagCon = document.getElementById(Com.yucheng.crm.index.TagPage.prototype.tagCSelector);
	var cPl = 0;
	if(tagCon.currentStyle.paddingLeft){
		cPl = parseInt(tagCon.currentStyle.marginLeft.substring(0,tagCon.currentStyle.marginLeft.length-2));
	}
	var x = event.screenX;
	var y = event.screenY;
	tagCon.style.marginLeft = cPl + (x - INDEXUTIL.mouseX);
	INDEXUTIL.mouseX = event.screenX;
	INDEXUTIL.mouseY = event.screenY;
};
/**
 * 拖动结束后调整页签位置
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.tagTitleMoveFix = function(){
	var _this = this;
	var tagCon = document.getElementById(Com.yucheng.crm.index.TagPage.prototype.tagCSelector);
	if(_this.tagPages.length == 0){
		tagCon.style.marginLeft = 0;
	}else{
		if(tagCon.firstChild.offsetLeft>0){
			tagCon.style.marginLeft = 0;
		}
		if(tagCon.lastChild.offsetLeft<0){
			var cPl = 0;
			if(tagCon.currentStyle.paddingLeft){
				cPl = parseInt(tagCon.currentStyle.marginLeft.substring(0,tagCon.currentStyle.marginLeft.length-2));
			}
			tagCon.style.marginLeft = cPl - tagCon.lastChild.offsetLeft;
		}
	}
};
/**
 * 点选菜单后，修复页签位置
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.tagChooseFix = function(){
	var _this = this;
	if(_this.currTagPage && _this.currTagPage.titleEl.offsetLeft < 0){
		var tagCon = document.getElementById(Com.yucheng.crm.index.TagPage.prototype.tagCSelector);
		var cPl = 0;
		if(tagCon.currentStyle.paddingLeft){
			cPl = parseInt(tagCon.currentStyle.marginLeft.substring(0,tagCon.currentStyle.marginLeft.length-2));
		}
		tagCon.style.marginLeft = cPl - _this.currTagPage.titleEl.offsetLeft;
	}
};
/**
 * 创建一个右上角的快捷按钮
 * @param cfg
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.createIcon = function(cfg){
	var _this = this;
	if(cfg.enable!==false){
		var si = new Com.yucheng.crm.index.ShortcutIcon(cfg);
		si.booter = _this;
		_this.shortCutIcons.push(si);
		return si;
	}else return false;
};
/**
 * 创建页签栏的快捷按钮
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.createTitleButtons = function(){
	
	var _this = this;
	
	var butContainer = document.createElement("div");
	var cssText = "position:absolute;right:16px;top:5px;";
	butContainer.style.cssText = cssText;
	
	var removeOtherTabs = document.createElement("a");
	removeOtherTabs.innerHTML = "<img src="+basepath+"/contents/images/blue/tagbt01.gif />";
	removeOtherTabs.onclick = function(){
		_this.destroyRelateTabs(1);
	};
	var removeAllTabs = document.createElement("a");
	removeAllTabs.innerHTML = "<img src="+basepath+"/contents/images/blue/tagbt02.gif />";
	removeAllTabs.onclick = function(){
		_this.destroyRelateTabs(0);
	};
	
	butContainer.appendChild(removeOtherTabs);
	butContainer.appendChild(removeAllTabs);
	
	document.getElementById(Com.yucheng.crm.index.TagPage.prototype.tagContainer).appendChild(butContainer);
	
};
/**
 * private方法，移除一个TAG对象,仅移除tag缓存句柄数据，如需需移除并销毁该对象，应该调用TAGPAGE对象的destroy方法。
 * @param tag
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.removeTag = function(tag){
	var _this = this;
	if(tag===_this.currTagPage){
		_this.tagPages.remove(tag);
		if(_this.tagPages.length>0){
			_this.setCurrTag(_this.tagPages.pop());//切换到最近页签
		}else{
			_this.currTagPage = false;
		}
	}else{
		_this.tagPages.remove(tag);
	}
	delete tag;
};
/**
 * 点击打开菜单
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.indexLocate = function(menuId,url,name){
	var _this = this;
	if(!menuId){
		return;
	}
	var pathArr = _this.stackGetParents(menuId, new Array());
	if(!pathArr||pathArr.length<=0){
		return;
	}
	var mainM=false;
	for(var i=0;i<_this.__mainMenuObj.length;i++){
		if(_this.__mainMenuObj[i].attrInfo.ID == pathArr[pathArr.length-1].ID){
			mainM = _this.__mainMenuObj[i];
			break;
		}
	}
	mainM.showSubs();
	pathArr.pop();
	if(mainM.attrInfo.ID==menuId || pathArr.length==0){
		return;
	}
	var tSubMenu = false;
	for(var i=0;i<mainM.subMenuItems.length;i++){
		if(mainM.subMenuItems[i].attrInfo.ID == pathArr[pathArr.length-1].ID){
			tSubMenu = mainM.subMenuItems[i];
			break;
		}
	}
	tSubMenu.expand();
	if(tSubMenu.attrInfo.ID == menuId){
		_this.createTag(tSubMenu.attrInfo,url,name);
		return;
	}
	pathArr.pop();
	if(tSubMenu.attrInfo.ID==menuId || pathArr.length==0){
		return;
	}
	while(tSubMenu.attrInfo.ID!=menuId || pathArr.length!=0){
		for(var i=0;i<tSubMenu.subMenuItems.length;i++){
			if(tSubMenu.subMenuItems[i].attrInfo.ID==pathArr[pathArr.length-1].ID){
				tSubMenu = tSubMenu.subMenuItems[i];
				break;
			}
		}
		tSubMenu.expand();
		if(tSubMenu.attrInfo.ID == menuId){
			_this.createTag(tSubMenu.attrInfo,url,name);
			return;
		}
		pathArr.pop();
	}
	return;
};
/**
 * 判断两个URL是否相等
 * @param a
 * @param b
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.urlEquals = function(a,b){
	if(!b) return false;
	var ta = a.indexOf('?')>0 ? a.substring(0,a.indexOf('?')): a;
	var tb = b.indexOf('?')>0 ? b.substring(0,b.indexOf('?')): b;
	return ta===tb;
};
/**
 * 下级菜单对象
 * @param b
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.getSubItems = function(b){
	var _this = this;
	var tmpSubs = [];
	Ext.each(_this.__menus,function(a){
		if(a.PARENT_ID == b){
			tmpSubs.push(a);
		}
	});
	return tmpSubs;
};
/**
 * 打开菜单页面
 * @param a
 * @param url
 * @param name
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.createTag = function(a,url,name){
	var _this = this;
	var finalUrl = url?url:basepath+a.ACTION;
	if(finalUrl.indexOf('?')>=0){
		finalUrl += '&resId='+a.ID;
	}else {
		finalUrl += '?resId='+a.ID;
	}
	var finalName = name!=''&&name!=undefined?name:a.NAME;
	_this.addTag("",finalUrl,finalName);
};
/**
 * 父节点路径，即菜单树XPATH
 * @param a
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.stackGetParents = function(a,res){
	var _this = this;
	var tmpOne = false;
	for(var d in _this.__menus){
		if(_this.__menus[d].ID == a){
			res.push(_this.__menus[d]);
			tmpOne = _this.__menus[d];
			break;
		}
	}
	if(!tmpOne){
		return false;
	}
	if(tmpOne.PARENT_ID=='0'){
		return res;
	}else{
		return _this.stackGetParents(tmpOne.PARENT_ID ,res);
	}
};
/**
 * security 认证管理初始化
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.initSecurityBooter = function(){
	var _this = this;
	if (_this.securityBooter == null) {
		_this.securityBooter = new Com.yucheng.crm.security.SecurityBooter(_this);
	}
	
	return _this.securityBooter;
};
/**
 * security 切换角色信息
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.switchCurrentRole = function(){
	if (JsContext._loginType == 1) {
		var _this = this;
		var tabItems = [];
		var singleRoleLoginpanel  = new Com.yucheng.crm.security.SecListUnit();	
		/**单角色登录引用indexBooter*/
		singleRoleLoginpanel.setSecIndex(_this);
		/**单角色登录引用SecMainWin*/
		singleRoleLoginpanel.setSecMainWin(_this.securityBooter);		
		singleRoleLoginpanel.setPanelConfig({ index : 1 });
		/**单角色登录初始化*/
		singleRoleLoginpanel.init();
		/**填加到secWin中*/
		tabItems.push(singleRoleLoginpanel);
		_this.__mainMenuObj = [];
		_this.securityBooter.showMainWin(tabItems);
		_this.securityBooter.activate(0);
	}
};


/**
 * TAGPAGE页面对象，包含TAG标签和IFRAME标签DOM对象
 * @param id
 * @param url
 * @param title
 */
Com.yucheng.crm.index.TagPage = function(id,url,title){
	if(!url){
		return false;
	}
	this.id = id;
	this.url = url;
	this.title = title;
	
	if(INDEXUTIL.tabNameShort && title.length > INDEXUTIL.tabNameMaxLen){
		this.name = title.substring(0,INDEXUTIL.tabNameMaxLen)+'...';
	}else {
		this.name = title;
	}
	
	this.switched = true;
	this.booter = false;
	
	this.frameEl = document.createElement("iframe");
	this.frameEl.id="mainframe"+Ext.id();
	this.frameEl.scrolling="auto";
	this.frameEl.src=this.url;
	this.frameEl.className="frame_iframe";
	this.frameEl.setAttribute('frameborder','0',0);
	
	this.titleEl = document.createElement("li");
	this.titleEl.className = "curr_tab";
	if(Ext.isIE6){
		this.titleEl.style.width = this.name.length*10+56;
	}
	this.titleEl.innerHTML = "<div class='left'><div class='right' title='"+this.title+ "'>"
		+"<a name='" + this.url+ "'>"+ this.name +"</a></div>"
		+"<div class='openclose'><a href='javascript:void(0);'></a></div>"
		+"</div></div>";
	
	var _this = this;
	_this.titleEl.onclick = function(){
		if(event.srcElement.parentElement.className==="openclose"){
			_this.destroy();
		}else{
			_this.booter.setCurrTag(_this);
		}
		return false;
	};
	_this.titleEl.oncontextmenu = function(){
		if(INDEXUTIL.rigthKeyEnable){
			var e = event;
			titleMenu = new Com.yucheng.crm.index.contextMenu(e,_this,_this.booter);
			document.body.appendChild(titleMenu.getEl());
		}
		return false;
	};
	
	document.getElementById(this.tagCSelector).appendChild(this.titleEl);
	document.getElementById(this.frameCSelector).appendChild(this.frameEl);
};
/**
 * TAG和IFRAME标签渲染容器选择器
 */
Com.yucheng.crm.index.TagPage.prototype = {
	tagCSelector : "fc_tab_ul",
	tagContainer : "rightTagConent",
	frameCSelector : "frame_center_contents"
};
/**
 * 判等对象，参数可为另一个TAGPAGE对象也可为一个string类型的URL
 * @param anotherTag
 * @return
 */
Com.yucheng.crm.index.TagPage.prototype.equals = function(anotherTag){
	if(typeof anotherTag == "string"){
		return Com.yucheng.crm.index.IndexBooter.prototype.urlEquals(this.url,anotherTag);
	}else if(anotherTag.url){
		return Com.yucheng.crm.index.IndexBooter.prototype.urlEquals(this.url,anotherTag.url);
	}else return false;
};
/**
 * 对象销毁方法，其中主要动作为销毁DOM对象，销毁本对象在booter中的记录。
 * @return
 */
Com.yucheng.crm.index.TagPage.prototype.destroy = function(){
	this.booter.removeTag(this);
	this.frameEl.src='';
	this.frameEl.parentNode.removeChild(this.frameEl);
	this.titleEl.parentNode.removeChild(this.titleEl);
	if(INDEXUTIL.titleDraggable){
		this.booter.tagTitleMoveFix();
	}
};
/**
 * 选中本页面标签动作
 * @return
 */
Com.yucheng.crm.index.TagPage.prototype.switchIn = function(){
	this.titleEl.className = 'curr_tab';
	this.frameEl.style.display = '';
	this.frameEl.style.height = this.booter.sh-this.booter.hh-55;
	this.switched = true;
};
/**
 * 本页面标签失去选择焦点动作
 * @return
 */
Com.yucheng.crm.index.TagPage.prototype.switchOut = function(){
	this.titleEl.className = 'old_tab';
	this.frameEl.style.display = 'none';
	this.switched = false;
};
/**
 * 或许本页面IFRAME对象
 * @return
 */
Com.yucheng.crm.index.TagPage.prototype.getFrame = function(){
	return this.frameEl;
};
/**
 * 获取本页面标签对象DOM
 * @return
 */
Com.yucheng.crm.index.TagPage.prototype.getTitle = function(){
	return this.titleEl;
};




/**
 * 一级菜单对象
 * @param menu_data
 */
Com.yucheng.crm.index.MainMenu = function(menu_data){
	
	this.attrInfo = menu_data;
	
	this.MainMenuEl = document.createElement("a");
	this.MainMenuEl.className = 'nav' + this.attrInfo.ICON;
	this.MainMenuEl.innerText = this.attrInfo.NAME;
	this.subUl=false;
	
	this.booter = false;
	this.expanding = false;
	this.subMenuItems = new Array();
	
	var _this = this;
	
	if(Ext.isIE6){
		_this.MainMenuEl.onmouseover = function(){
			_this.MainMenuEl.className = 'navover' + _this.attrInfo.ICON;
		};
		_this.MainMenuEl.onmouseout = function(){
			_this.MainMenuEl.className = 'nav' + _this.attrInfo.ICON;
		};
	}
	
	if(INDEXUTIL.reLayoutSubMenus) {
		_this.MainMenuEl.onmouseover = function(){
			_this.showSubs();
		};
	}
	
	this.MainMenuEl.onclick = function(){
		_this.onClick();
	};
};
/**
 * 获取一级菜单EL
 * @return
 */
Com.yucheng.crm.index.MainMenu.prototype.getMainMenuEl = function(){
	return this.MainMenuEl;
};
/**
 * 一级菜单对象点击方法
 * @return
 */
Com.yucheng.crm.index.MainMenu.prototype.onClick = function(){
	
	var _this = this;
	//打开页签
	if(INDEXUTIL.mainMenuPage && _this.attrInfo.ACTION){
		_this.booter.createTag(_this.attrInfo);
	}
	_this.showSubs();
	
	if(INDEXUTIL.subSuspensionable){//是否启用二级菜单悬浮
		Com.yucheng.crm.index.IndexBooter.prototype.suspensionShowSubMenus();
	}
};
/**
 * 获取一级菜单下的二级菜单数据
 * @return
 */
Com.yucheng.crm.index.MainMenu.prototype.getSubItems = function(){
	var _this = this;
	return _this.booter.getSubItems(_this.attrInfo.ID);
};
/**
 * 隐藏一级菜单下的二级菜单项
 * @return
 */
Com.yucheng.crm.index.MainMenu.prototype.hideSubs = function(){
	var _this = this;
	_this.expanding = false;
	_this.collapseAll();
	if(_this.subUl)
		_this.subUl.style.display = 'none';
};
/**
 * 显示一级菜单下的二级菜单项
 * @return
 */
Com.yucheng.crm.index.MainMenu.prototype.showSubs = function(){
	var _this = this;
	
	if(_this.booter.contextMenu){
		_this.booter.contextMenu.destroy();
	}
	
	if(!_this.subUl){
		var subMenusData = _this.getSubItems();
	
		Ext.each(subMenusData,function(b){
			var smi = new Com.yucheng.crm.index.SubMenuItem(b);
			smi.booter = _this.booter;
			smi.parentMenu = _this;
			_this.subMenuItems.push(smi);
		});
		_this.subUl = document.createElement('ul');
		_this.subUl.className = 'left_menu_ul';
		
		
		Ext.each(_this.subMenuItems,function(smi){
			_this.subUl.appendChild(smi.itemEl);
		});	
		_this.subUl.style.maxHeight = _this.booter.maxMenuHeight-29;
		
		if(!INDEXUTIL.reLayoutSubMenus){
			document.getElementById("left_menu").appendChild(_this.subUl);
		}else {
			_this.subUl.style.position = 'absolute';
			_this.subUl.style.left =361+ _this.getMainMenuEl().offsetLeft;
			_this.subUl.style.top = _this.getMainMenuEl().offsetTop + _this.getMainMenuEl().offsetHeight;
			_this.subUl.style.overflowX = 'hidden';
			_this.subUl.style.overflowY = 'auto';
			_this.subUl.style.zIndex = 10000;
			document.body.appendChild(_this.subUl);
		}
	}
	
	_this.expanding = true;
	
	if(!INDEXUTIL.reLayoutSubMenus){
		//切换主显示区域
		Ext.fly('indexPageFrame').setStyle('display','none');
		Ext.fly('wholeContent').setStyle('display','block');
	}
	if(!INDEXUTIL.reLayoutSubMenus){
		//刷新二级菜单区
		Ext.fly('firstTitleSpan').replaceWith({
			tag: 'span',
			cls: 'left_menu_w',	
			id: 'firstTitleSpan',
			html: this.attrInfo.NAME
		});
	}
	
	if(_this.booter.ccurrMainMenu){
		_this.booter.ccurrMainMenu.hideSubs();
	}
	_this.subUl.style.display = '';
	_this.booter.ccurrMainMenu = _this;
	
	if(INDEXUTIL.reLayoutSubMenus){
		_this.hideInit();
	}
	
};
/**
 * 收起所有孙子菜单
 * @return
 */
Com.yucheng.crm.index.MainMenu.prototype.collapseAll = function(){
	var _this = this;
	Ext.each(_this.subMenuItems,function(smi){
		smi.collapse();
	});
};
/**
 * 初始化下拉菜单影藏事件
 * @return
 */
Com.yucheng.crm.index.MainMenu.prototype.hideInit = function(){
	var _this = this;
	document.onclick = function(){
		_this.hideSubs();
	};
	for(var i=0;i<document.frames.length;i++){
		document.frames[i].document.onclick = function(){
			_this.hideSubs();
		};
	};
};


/**
 * 二级菜单项目对象
 * @param menu_data
 */
Com.yucheng.crm.index.SubMenuItem = function(menu_data){
	
	this.attrInfo = menu_data;
	
	this.booter = false;
	this.parentMenu = false;
	
	this.subMenuItems = new Array();
	this.expanded = false;
	this.expanding = false;
	this.subUl = false;
	
	var _this = this;
	
	var itemName = document.createElement('a');
	itemName.title = _this.attrInfo.NAME;
	if(_this.attrInfo.LEAF_FLAG==1){
		itemName.className = 'nosub';
	}else {
		itemName.className = 'withsub';
	}
	if(INDEXUTIL.subMenusNameShort && _this.attrInfo.NAME.length > INDEXUTIL.subMenusNameMaxLen){
		itemName.innerHTML = '<span class="lnav1">'+_this.attrInfo.NAME.substring(0,INDEXUTIL.subMenusNameMaxLen)+'...</span>';
	}else{
		itemName.innerHTML = '<span class="lnav1">'+_this.attrInfo.NAME+'</span>';
	}
	
	itemName.onclick = function(){
		_this.onClick();
		if(_this.attrInfo.LEAF_FLAG!=1 && INDEXUTIL.reLayoutSubMenus){
			event.cancelBubble = true;
			return false;
		}
	};
	
	if(Ext.isIE6){
		itemName.onmouseover = function(){
			itemName.className +='over';
		};
		itemName.onmouseout = function(){
			itemName.className = itemName.className.substring(0,itemName.className.length-4);
		};
	}
	
	this.itemEl = document.createElement('li');
	this.itemEl.id = _this.attrInfo.ID+"_sec";
	this.itemEl.className = 'lnav';
	this.itemEl.appendChild(itemName);
	
};
/**
 * 获取二级菜单菜单DOM
 * @return
 */
Com.yucheng.crm.index.SubMenuItem.prototype.getItemEl = function(){
	return this.itemEl;
};
/**
 * 二级菜单点击方法
 * @return
 */
Com.yucheng.crm.index.SubMenuItem.prototype.onClick = function(){
	var _this = this;
	
	if(_this.expanding){
		_this.collapse();
	}else{
		_this.expand();
	}
	
	if(_this.attrInfo.ACTION){
		_this.booter.createTag(_this.attrInfo);
	}
	
};
/**
 * 展开子菜单
 * @return
 */
Com.yucheng.crm.index.SubMenuItem.prototype.expand = function(){
	var _this = this;
	if(_this.expanding){
		return false;
	}
	if(INDEXUTIL.expandingSubMenuMode){
		_this.parentMenu.collapseAll();
	}
	if(!_this.expanded){
		var subDatas = _this.getSubItems();
		Ext.each(subDatas,function(sd){
			var mmi = new Com.yucheng.crm.index.ModuleMenuItems(sd,2);
			mmi.booter = _this.booter;
			mmi.parentMenu = _this;
			_this.subMenuItems.push(mmi);
		});
		if(_this.subMenuItems.length>0){
			_this.subUl = document.createElement("ul");
			_this.subUl.id = _this.attrInfo.ID;
			_this.subUl.className = "left_menu_sub";
			Ext.each(_this.subMenuItems,function(smi){
				_this.subUl.appendChild(smi.menuEl);
			});
			_this.itemEl.appendChild(_this.subUl);
			_this.expanding = true;
		}
		_this.expanded = true;
	}else{
		if(_this.subUl){
			_this.subUl.style.display = '';
			_this.expanding = true;
		}
	}
	
	
};
/**
 * 收起子菜单
 * @return
 */
Com.yucheng.crm.index.SubMenuItem.prototype.collapse = function(){
	var _this = this;
	if(!_this.expanding){
		return false;
	}else{
		_this.collapseAll();
		if(_this.subUl){
			_this.subUl.style.display = 'none';
			_this.expanding = false;
		}
	}
};
/**
 * 收起所有孙子菜单
 * @return
 */
Com.yucheng.crm.index.SubMenuItem.prototype.collapseAll = function(){
	var _this = this;
	Ext.each(_this.subMenuItems,function(smi){
		smi.collapse();
	});
};
/**
 * 获取二级菜单子菜单数据
 * @return
 */
Com.yucheng.crm.index.SubMenuItem.prototype.getSubItems = function(){
	var _this = this;
	return _this.booter.getSubItems(_this.attrInfo.ID);
};


/**
 * 三、四...级菜单对象
 * @param menu_data
 * @param level
 */
Com.yucheng.crm.index.ModuleMenuItems = function(menu_data,level){
	
	this.attrInfo = menu_data;
	
	this.level = level;
	this.serbIn = '';
	for(var i=0;i<level-2;i++){
		this.serbIn += '&nbsp;';
	}
	
	this.booter = false;
	this.parentMenu = false;
	
	this.subMenuItems = new Array();
	this.expanded = false;
	this.expanding = false;
	this.subUl = false;
	
	var _this = this;
	
	
	var menuTile = document.createElement("a");
	menuTile.className = "lnav1_sub";
	menuTile.title = _this.attrInfo.NAME;
	if(INDEXUTIL.subMenusNameShort && _this.attrInfo.NAME.length > INDEXUTIL.subMenusNameMaxLen-level+2){
		menuTile.innerHTML = '<span class="lnav1_sub1">'+_this.serbIn+_this.attrInfo.NAME.substring(0,INDEXUTIL.subMenusNameMaxLen-level+2)+'...</span></a>';
	}else{
		menuTile.innerHTML = '<span class="lnav1_sub1">'+_this.serbIn+_this.attrInfo.NAME+'</span></a>';
	}
	menuTile.onclick = function(){
		_this.onClick();
		if(_this.attrInfo.LEAF_FLAG!=1 && INDEXUTIL.reLayoutSubMenus){
			event.cancelBubble = true;
			return false;
		}
	};
	
	if(Ext.isIE6){
		menuTile.onmouseover = function(){
			menuTile.className = 'aover';
		};
		menuTile.onmouseout = function(){
			menuTile.className = '';
		};
	}
	
	this.menuEl = document.createElement('li');
	this.menuEl.id = this.attrInfo.ID+'_minaMenu';
	this.menuEl.appendChild(menuTile);
	
};

Com.yucheng.crm.index.ModuleMenuItems.prototype = {
		/**
		 * 子菜单样式扩展。
		 * 此属性记录子菜单UL样式类名，从三级菜单开始适配，
		 * 如子菜单层级-2大于等于此数组长度，则样式均加载最后一个样式类。
		 * 另：如需扩展子菜单样式，则应编写该级别字菜单UL样式类X，添加在下面数组中，
		 * 	   同时，需编写UL下子元素样式，包括：.X li、.X li a、.X li a:hover、.X li a.aover(ie6适配mouseover样式)、.X li a span。
		 */
		subUlClass : ['left_menu_sub_sub']
};
/**
 * 获取三、四...菜单DOM
 * @return
 */
Com.yucheng.crm.index.ModuleMenuItems.prototype.getMenuEl = function(){
	return this.menuEl;
};
/**
 * 菜单对象点击方法
 * @return
 */
Com.yucheng.crm.index.ModuleMenuItems.prototype.onClick = function(){
	var _this = this;
	if(!_this.expanded){
		var subDatas = _this.getSubItems();
		Ext.each(subDatas,function(sd){
			var sdItem = new Com.yucheng.crm.index.ModuleMenuItems(sd,_this.level+1);
			sdItem.booter = _this.booter;
			sdItem.parentMenu = _this;
			_this.subMenuItems.push(sdItem);
		});
		if(_this.subMenuItems.length>0){
			_this.subUl = document.createElement("ul");
			_this.subUl.id = _this.attrInfo.ID;
			if(_this.level-2>=Com.yucheng.crm.index.ModuleMenuItems.prototype.subUlClass.length){
				_this.subUl.className = Com.yucheng.crm.index.ModuleMenuItems.prototype.subUlClass[Com.yucheng.crm.index.ModuleMenuItems.prototype.subUlClass.length-1];
			}else{
				_this.subUl.className = Com.yucheng.crm.index.ModuleMenuItems.prototype.subUlClass[_this.level-2];
			}
			Ext.each(_this.subMenuItems,function(smi){
				_this.subUl.appendChild(smi.menuEl);
			});
			_this.menuEl.appendChild(_this.subUl);
			_this.expanding = true;
		}
		_this.expanded = true;
	} else {
		if(_this.expanding){
			_this.subUl.style.display = 'none';
			_this.expanding = false;
		}else{
			if(_this.subUl){
				_this.subUl.style.display = '';
				_this.expanding = true;
			}
		}
	}
	
	if(_this.attrInfo.ACTION){
		_this.booter.createTag(_this.attrInfo);
	}
};
/**
 * 子菜单展开
 * @return
 */
Com.yucheng.crm.index.ModuleMenuItems.prototype.expand = function(){
	var _this = this;
	if(_this.expanding){
		return false;
	}
	if(!_this.expanded){
		var subDatas = _this.getSubItems();
		Ext.each(subDatas,function(sd){
			var sdItem = new Com.yucheng.crm.index.ModuleMenuItems(sd,_this.level+1);
			sdItem.booter = _this.booter;
			sdItem.parentMenu = _this;
			_this.subMenuItems.push(sdItem);
		});
		if(_this.subMenuItems.length>0){
			_this.subUl = document.createElement("ul");
			_this.subUl.id = _this.attrInfo.ID;
			if(_this.level-2>=Com.yucheng.crm.index.ModuleMenuItems.prototype.subUlClass.length){
				_this.subUl.className = Com.yucheng.crm.index.ModuleMenuItems.prototype.subUlClass[Com.yucheng.crm.index.ModuleMenuItems.prototype.subUlClass.length-1];
			}else{
				_this.subUl.className = Com.yucheng.crm.index.ModuleMenuItems.prototype.subUlClass[_this.level-2];
			}
			Ext.each(_this.subMenuItems,function(smi){
				_this.subUl.appendChild(smi.menuEl);
			});
			_this.menuEl.appendChild(_this.subUl);
			_this.expanding = true;
		}
		_this.expanded = true;
	} else {
		if(_this.subUl){
			_this.subUl.style.display = '';
			_this.expanding = true;
		}
	}
};
/**
 * 三、四级子菜单收起方法
 * @return
 */
Com.yucheng.crm.index.ModuleMenuItems.prototype.collapse = function(){
	var _this = this;
	if(!_this.expanding){
		return false;
	}else{
		_this.collapseAll();
		if(_this.subUl){
			_this.subUl.style.display = 'none';
			_this.expanding = false;
		}
	}
};
/**
 * 收起所有孙子菜单
 * @return
 */
Com.yucheng.crm.index.ModuleMenuItems.prototype.collapseAll = function(){
	var _this = this;
	Ext.each(_this.subMenuItems,function(smi){
		smi.collapse();
	});
};
/**
 * 获取菜单对象子菜单数据
 * @return
 */
Com.yucheng.crm.index.ModuleMenuItems.prototype.getSubItems = function(){
	var _this = this;
	return _this.booter.getSubItems(_this.attrInfo.ID);
};


/**
 * 页签右键菜单
 * @param e
 * @param tag
 * @param booter
 */
Com.yucheng.crm.index.contextMenu = function(e,tag,booter){
	
	this.tag = tag;
	this.booter = booter;
	
	if(booter.contextMenu){
		booter.contextMenu.destroy();
	}
	booter.contextMenu = this;
	
	this.rightKeyEl = document.createElement("div");
	this.rightKeyEl.style.position = 'absolute';
	//this.rightKeyEl.style.border = "1px solid";
	this.rightKeyEl.style.zIndex = 1000;
	this.rightKeyEl.style.width = 74;
	this.rightKeyEl.style.left = e.clientX-1;
	this.rightKeyEl.style.top = e.clientY-1;
	this.rightKeyEl.className = 'contextMenu';
	
	var aOther = document.createElement('a');
	//aOther.innerHTML =' <img src="../../images/blue/tagbt01.gif" />';
	aOther.title = '移除其他页签';
	aOther.className = 'close_btn_all';
	var allTag = document.createElement('a');
	allTag.className = 'close_btn_other';
	allTag.title = '移除所有页签';
	var aThis = document.createElement('a');
	//aThis.innerHTML ='<img src="../../images/blue/tagbt02.gif" />';
	aThis.title = '移除本页签';
	aThis.className = 'close_btn_other';
	var noCurTag = document.createElement('a');
	noCurTag.innerHTML = '<img src="../../images/ic_bt02.gif" />';
	noCurTag.title = '移除非当前页签';
	var _this = this;
	
	aOther.onclick = function(){
		_this.booter.destroyOtherTabs(_this.tag);
		return true;
	};
	aThis.onclick = function(){
		_this.tag.destroy();
		return true;
	};
	allTag.onclick = function(){
		_this.booter.destroyRelateTabs(0);
	};
	noCurTag.onclick = function(){
		_this.booter.destroyRelateTabs(1);
	};
	document.onclick = function(){
		_this.destroy();
	};
	for(var i=0;i<document.frames.length;i++){
		document.frames[i].document.onclick = function(){
			_this.destroy();
		};
	};
	this.rightKeyEl.appendChild(aOther);
	this.rightKeyEl.appendChild(allTag);
};
/**
 * 获取右键菜单DOM对象
 * @return
 */
Com.yucheng.crm.index.contextMenu.prototype.getEl = function(){
	var _this = this;
	return _this.rightKeyEl;
};
/**
 * 销毁右键菜单对象
 * @return
 */
Com.yucheng.crm.index.contextMenu.prototype.destroy = function(){
	var _this = this;
	_this.rightKeyEl.parentNode.removeChild(_this.rightKeyEl);
	delete _this;
};


/**
 * 右上角快捷按钮对象，对象保存于Com.yucheng.crm.index.IndexBooter.prototype.shortCutIcons
 * @param iconCfg：取自INDEXUTIL.shortCuts
 */
Com.yucheng.crm.index.ShortcutIcon = function(iconCfg){
	
	var _this = this;
	
	_this.booter = null;
	_this.id = iconCfg.id;
	_this.className = iconCfg.className;
	_this.backgroundImg = iconCfg.backgroundImg;
	_this.iconClick = iconCfg.handler;
	_this.title = iconCfg.title;
	_this.aStyle = iconCfg.aStyle;
	
	var iconA = document.createElement("a");
	iconA.innerHTML = "<img src="+_this.backgroundImg+" />";
	if(_this.aStyle)
		iconA.style.cssText = _this.aStyle;
	iconA.onclick = function(){
		if(Ext.isFunction(_this.iconClick))
			_this.iconClick();
	};
	
	_this.iconEl = document.createElement("div");
	if(_this.id)
		_this.iconEl.id = _this.id;
	if(_this.className)
		_this.iconEl.className = _this.className;
	_this.iconEl.title = _this.title;
	_this.iconEl.style.cursor = 'hand';
	
	_this.iconEl.appendChild(iconA);
	document.getElementById(_this.shortCutContainer).appendChild(_this.iconEl);
};
Com.yucheng.crm.index.ShortcutIcon.prototype.shortCutContainer = 'invokeIcons';