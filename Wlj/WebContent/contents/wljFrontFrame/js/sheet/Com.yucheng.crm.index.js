/**
 * 基础版本，首页加载，包括：
 * 基本框架部署器、页签对象、一级菜单对象、二级菜单对象、子菜单对象
 * 基本配置信息，存放于Com.yucheng.crm.index.Util，调用句柄INDEXUTIL。
 * @author WILLJOE
 * @since 2012-11-27
 * @version 1.0
 * 			1.0.1(2012-11-28)    里程碑版本：兼容IE6
 * 			1.0.2(2012-11-28)    里程碑版本：兼容IE9
 */
Ext.ns("Com.yucheng.crm.index");
Com.yucheng.crm.index.Util = {
	tabMaxCount : 6,												//最大页签个数，小于1时，为无上限
	reopenOrAlert : true,											//超过最大页签限制时动作：true：关闭最早页签，打开新页签；false：提示页签超限，不打开新页签。
	countOverMsg : "已超过最大页签数",								//超过页签最大个数时，提示信息
	rigthKeyEnable : true,											//右键点击页签开关
	refreshMainPage : false,											//点击“首页”一级菜单是否刷新首页
	//indexContentUrl : basepath+'/contents/pages/index/mainPage.jsp',//首页面内容URL
	indexContentUrl : basepath+'/contents/pages/homePage/mainPage.jsp?resId=240',//首页面内容URL
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
	
	reLayoutSubMenus : true,										//采用下拉模式菜单样式
	
	menuReloadable : true,											//菜单初始化失败，是否重新查询菜单信息
	menuReloadCount : 3,											//菜单初始化失败，重新加载菜单信息次数
	menuLoadedCount : 0,											//菜单已加载次数
	menuReloadDelayMs : 1000,										//重新加载菜单时间间隔
	
	waitMsg : '正在加载页面……',										//加载等待提示信息
	
	titleButtons : false,											//是否启用页签栏的快捷功能
		
	shortCuts : [{
		enable:true,
		id : 'cu',
		className : 'in_fun_p',
		title : "登录用户:"+__userCname+"||登录日期:"+new Date().format("Y-m-d"),
		backgroundImg : basepath + '/contents/wljFrontFrame/styles/sheet/sheetthemes/theme1/pics/icon01.gif',
		handler : function(){
			this.booter.switchCurrentRole();
		},
		beControlled: true
	},{																
		enable:true,												//是否启用该图标,为false时，隐藏。
		id : 'custManagerPlat',										//对象ID，亦DOM ID
		className : 'in_fun_p',											//图标DOM样式
		title : '客户经理工作台',									//图标TITLE
		backgroundImg : basepath + '/contents/wljFrontFrame/styles/sheet/sheetthemes/theme1/pics/icon02.gif',	//图标路径
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
		className : 'in_fun_p',
		title : '常用操作',
		backgroundImg : basepath + '/contents/wljFrontFrame/styles/sheet/sheetthemes/theme1/pics/icon03.gif',
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
		className:'in_fun_p',
		title:'主题颜色',
		backgroundImg: basepath + '/contents/wljFrontFrame/styles/sheet/sheetthemes/theme1/pics/icon04.gif',
		handler:function(){
			var currentColorId = __themeColorId;
			var tabs = window.frames;
			var cssUrl;
			if (currentColorId == 0)  {
				__themeColorId = 1;
				cssUrl = basepath + '/contents/resource/ext3/resources/css/xtheme-blue.css';
			} else {
				__themeColorId = 0;
				cssUrl = basepath + '/contents/resource/ext3/resources/css/xtheme-zhongxin_crm.css';
			}
			for (i = 0; i < tabs.length; i++) {
				tabs[i].Ext.util.CSS.swapStyleSheet('themeId', cssUrl);
			}
			//记录切换失败
			Ext.Ajax.request({
				url:basepath+'/switchThemeAction!updateUserCfg.json?colorId='+__themeColorId,
				method: 'POST',
				success : function(response) {//记录切换成功，不提示			
				},
				failure : function(response) {//记录切换失败
					Ext.Msg.alert('提示', '模式切换失败!');
				}
			});
		},
		beControlled:true
	},{
		enable:true,
		id:'swith',
		className:'in_fun_p',
		title:'切换模式',
		backgroundImg: basepath + '/contents/wljFrontFrame/styles/sheet/sheetthemes/theme1/pics/icon05.gif',
		handler:function(){
			window.location.href = basepath + '/contents/wljFrontFrame/JSsearch_index.jsp';
			//记录切换失败
			Ext.Ajax.request({
				url:basepath+'/switchThemeAction!updateUserCfg.json?themeId=2',
				method: 'POST',
				success : function(response) {//记录切换成功，不提示			
				},
				failure : function(response) {//记录切换失败
					Ext.Msg.alert('提示', '模式切换失败!');
				}
			});
		},
		beControlled:true
	},{
		enable:true,
		id : 'logout',
		className : 'in_fun_p',
		title : '注销',
		backgroundImg : basepath + '/contents/wljFrontFrame/styles/sheet/sheetthemes/theme1/pics/icon06.gif',
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
	//_this.mainMask.show();
	
	this.sh;                                    //浏览器高度
	this.sw;     								//浏览器宽度
	this.hh; 									//顶部高度
	this.hw; 									//顶部宽度
	this.mainFrameHeight; 						//中间iframe高度
	
	this.mouseX = 0;
	this.mouseY = 0;
	
	this.tagPages = new Array();				//当前页签对象数组,以最近切换次序存储
	this.currTagPage = false;					//当前展示页签对象
	
	this.subSuspensionableLocal = INDEXUTIL.subSuspensionable;
	Ext.each(INDEXUTIL.shortCuts,function(cfg){			//初始化快捷图标
		var si = _this.createIcon(cfg);
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
	//Ext.fly('indexPageFrame').setStyle('display','none');
	//Ext.fly('wholeContent').setStyle('display','block');
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
 * 设置一级菜单分组方法
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.resetFrame = function(mainMenuPre, mainMenuNext){
	var _this = this;

	var mainMenuNavW = document.documentElement.clientWidth;//主菜单栏宽度
	Ext.fly('nav').setWidth(mainMenuNavW);
	var mainMenuW = mainMenuNavW - 14 - 14;//主菜单宽度 = 主菜单栏宽度 - 左边距 - 右边距
	var menuContentsW = mainMenuW - mainMenuPre.width - mainMenuNext.width - 30;//一级菜单内容宽度 = 主菜单宽度 - 向前按钮宽度 - 向后按钮宽度
	var currMAxEl= parseInt(menuContentsW/100);//目前能显示的一级菜单个数；
	for(var i = 0; i < _this.__mainMenuObj.length; i++){
		_this.__mainMenuObj[i].MainMenuEl.style.display = '';
		if(menuContentsW >= _this.__mainMenuObj[i].MainMenuli.offsetWidth) {
			_this.__mainMenuObj[i].MainMenuEl.style.display = '';
			menuContentsW = menuContentsW - _this.__mainMenuObj[i].MainMenuli.offsetWidth;
		} else {
			_this.__mainMenuObj[i].MainMenuEl.style.display = 'none';
			mainMenuNext.style.display = '';
		}
	};
	
	
};/**
 * 设置框架外观,调用一级菜单渲染方法
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.setFrame = function(){
	var _this = this;
	/**
	 * TODO 找到更好的获取整个页面高度的方法。
	 */
	_this.hh=Ext.select(".in_head").first().getHeight();
	_this.ht=Ext.select(".in_tab").first().getHeight();
	_this.sw=document.documentElement.clientWidth;
	_this.sh=document.documentElement.clientHeight;
	//设置主工作区域的高度  
	var contentHeight=document.documentElement.clientHeight;
	Ext.fly("indexPageFrame").setHeight(contentHeight-_this.hh);
	Ext.fly("wholeContent").setHeight(_this.sh-_this.hh);
	
	//Ext.select(".frame_center_contents").setHeight(_this.sh-_this.hh-33);
	Ext.select(".frame_iframe").setHeight(_this.sh-_this.hh-34);
	_this.renderMainMenus();
	
	var mainMenuPre = document.getElementById("preGroup");//一级菜单前翻按钮	
	var mainMenuNext = document.getElementById("nextGroup");//一级菜单后翻按钮
    _this.resetFrame(mainMenuPre, mainMenuNext);
	//LOGO点击事件，当点击LOGO时收起一级菜单
	 var logo=document.getElementById("in_logo");
	 var logoStat=false;
	 logo.onclick=function(){
		 if(!logoStat){
			 document.getElementById("nav").style.display='none';
			 document.getElementById("left_menu").style.display='';
			 logoStat=true;
			  var hh=Ext.select(".in_head").first().getHeight();//当一级菜单收起后从新设置主工作界面高度
				Ext.fly("indexPageFrame").setHeight(_this.sh-hh);
				Ext.fly("wholeContent").setHeight(_this.sh-hh);				
				//Ext.select(".frame_center_contents").setHeight(_this.sh-hh-34);
				Ext.select(".frame_iframe").setHeight(_this.sh-hh-34);
		 }else{
			 document.getElementById("nav").style.display='';
			 logoStat=false;
			 var hh=Ext.select(".in_head").first().getHeight();//当一级菜单展开后从新设置主工作界面高度
				Ext.fly("indexPageFrame").setHeight(_this.sh-hh);
				Ext.fly("wholeContent").setHeight(_this.sh-hh);
				
				//Ext.select(".frame_center_contents").setHeight(_this.sh-hh-34);
				Ext.select(".frame_iframe").setHeight(_this.sh-hh-34);
		 }
		 
	 };
};
/**
 * 创建一级菜单“首页”
 * @return
 */
Com.yucheng.crm.index.IndexBooter.prototype.createIndexMenuEl = function(){
	var _this = this;
	_this.indexMenuEl = document.createElement("li");
	_this.indexMenuEl.className="lv1";
	_this.indexMenuA = document.createElement("a");
	_this.indexMenuI = document.createElement("i");
	_this.indexMenuI.innerHTML = "首页";
	_this.indexMenuA.appendChild(_this.indexMenuI);
	_this.indexMenuEl.appendChild(_this.indexMenuA);
//	if(Ext.isIE6){
//		_this.indexMenuEl.onmouseover = function(){
//			_this.indexMenuEl.className = 'navover1';
//		};
//		_this.indexMenuEl.onmouseout = function(){
//			_this.indexMenuEl.className = 'lv1';
//		};
//	}
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
			Ext.fly('indexPageFrame').setStyle('display','');
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
	var rootMenusEl = document.getElementById("rootMenus");
	while(rootMenusEl.hasChildNodes()){
		rootMenusEl.removeChild(rootMenusEl.firstChild);
	}
	var mainPre = document.createElement("li");//向前翻按钮
	mainPre.className = 'lv1';
	mainPre.width = '27';
	mainPre.height = '36';
	mainPre.style.cursor = 'hand';
	mainPre.style.display = 'none';
	mainPre.id = 'preGroup';
	mainPre.style.align = 'right';
	mainPre.innerHTML  = '<a href="javascript:void(0)" style="hide-focus: true;hideFocus:hidefocus;">'+
    					'<img width="27" height="36" src="'+basepath +'/contents/images/ic_bt04.gif"/></a>';
	
	var mainNext = document.createElement("li");//向后翻按钮
	mainNext.className = 'lv1';
	mainNext.width = '27';
	mainNext.height = '36';
	mainNext.style.cursor = 'hand';
	mainNext.style.display = 'none';
	mainNext.id = 'nextGroup';
	mainNext.style.align = 'left';
	mainNext.innerHTML  = '<a href="javascript:void(0)" style="hide-focus: true;hideFocus:hidefocus;">'+
    					'<img width="27" height="36" src="'+basepath +'/contents/images/ic_bt01.gif"/></a>';
	
	rootMenusEl.appendChild(mainPre);
	rootMenusEl.appendChild(_this.indexMenuEl);
	for(var mi=0;mi<_this.__mainMenuObj.length;mi++){		
		rootMenusEl.appendChild(_this.__mainMenuObj[mi].MainMenuEl);
	};
	rootMenusEl.appendChild(mainNext);
	rootMenusEl.style.position = 'absolute';
	rootMenusEl.style.zIndex=20000;
	mainPre.onclick = function(){//向前翻的点击事件
		var lastNum  = 0;
		var firstNum = 0;
		for(var i = _this.__mainMenuObj.length - 1; i >= 0; i--){
			if(_this.__mainMenuObj[i].MainMenuEl.style.display == '') {
				lastNum = i;
				break;
			}
		};
		for(var i = 0; i < _this.__mainMenuObj.length; i++){
			if(_this.__mainMenuObj[i].MainMenuEl.style.display == '') {
				firstNum = i;
				break;
			}
		};
		if (firstNum < 1) {
			mainPre.style.display = 'none';
			mainNext.style.display = '';
		} else {
			_this.__mainMenuObj[firstNum-1].MainMenuEl.style.display = '';
			_this.__mainMenuObj[lastNum].MainMenuEl.style.display = 'none';
			mainPre.style.display  = '';
			mainNext.style.display = '';
			if (firstNum == 1) {
				mainPre.style.display  = 'none';
			}
		}	
	};
	mainNext.onclick = function(){//向后翻的点击事件
		var lastNum  = 0;
		var firstNum = 0;
		for(var i = _this.__mainMenuObj.length - 1; i >= 0; i--){
			if(_this.__mainMenuObj[i].MainMenuEl.style.display == '') {
				lastNum = i;
				break;
			}
		};
		for(var i = 0; i < _this.__mainMenuObj.length; i++){
			if(_this.__mainMenuObj[i].MainMenuEl.style.display == '') {
				firstNum = i;
				break;
			}
		};
		if (lastNum == _this.__mainMenuObj.length - 1) {
			mainNext.style.display = 'none';
		} else {
			_this.__mainMenuObj[lastNum+1].MainMenuEl.style.display = '';
			_this.__mainMenuObj[firstNum].MainMenuEl.style.display = 'none';
			mainNext.style.display = '';
			mainPre.style.display  = '';
			if (lastNum == _this.__mainMenuObj.length - 2) {
				mainNext.style.display = 'none';
			}
		}
	};	
	
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
	removeOtherTabs.href = 'javascript:void(0);';
	removeOtherTabs.innerHTML = "<img src="+basepath+"/contents/images/blue/tagbt01.gif />";
	removeOtherTabs.onclick = function(){
		_this.destroyRelateTabs(1);
	};
	var removeAllTabs = document.createElement("a");
	removeAllTabs.href = 'javascript:void(0);';
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
				//当没有页面展示时，跳回首页
		    document.getElementById("wholeContent").style.display = "none";
		    document.getElementById('indexPageFrame').style.display = "";

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
	for(var i=0;i<_this.__menus.length;i++){
		if(_this.__menus[i].ID == menuId){
			_this.createTag(_this.__menus[i],url,name);
			document.getElementById("wholeContent").style.display = "";
			document.getElementById('indexPageFrame').style.display = "none";
			break;
		}
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
	
	var actionPath = a.ACTION.indexOf('.jsp')>0 ? a.ACTION : '/contents/frameControllers/wlj-function.jsp' ;
	var finalUrl = url?url:basepath+actionPath;
	if(finalUrl.indexOf('?')>=0){
		finalUrl += '&resId='+a.ID;
	}else {
		finalUrl += '?resId='+a.ID;
	}
	var finalName = name!=''&&name!=undefined?name:a.NAME;
	_this.addTag("",finalUrl,finalName);
};
//Com.yucheng.crm.index.IndexBooter.prototype.indexLocate = function(menuId,url,name){
//	var _this = this;
//	var finalUrl = url;
//	if(finalUrl.indexOf('?')>=0){
//		finalUrl += '&resId='+menuId;
//	}else {
//		finalUrl += '?resId='+menuId;
//	}
//	var finalName = name;
//	_this.addTag("",finalUrl,finalName);
//};
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

Com.yucheng.crm.index.IndexBooter.prototype.findMenuDataById = function(id){
	var m = false;
	for(var i=0;i<this.__menus.length;i++){
		if(this.__menus[i].ID == id){
			return this.__menus[i];
		}
	}
	return m;
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
	this.frameEl.name="tabframe";
	this.frameEl.className="frame_iframe";
	this.frameEl.style.width="100%";
	this.frameEl.setAttribute('frameborder','0',0);
	
	this.titleEl = document.createElement("li");
	this.titleEl.className = "curr_tab";
	if(Ext.isIE6){
		this.titleEl.style.width = this.name.length*10+56;
	}
	this.titleEl.innerHTML = "<div class='left'><div class='right' title='"+this.title+ "'>"
	+"<a name='" + this.url+ "'>"+ this.name +"</a></div><div class='openclose'><a href='javascript:void(0);'></a></div>"
	+"</div>";
	
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
			_this.booter.setCurrTag(_this);
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
	this.frameEl.style.height = this.booter.sh-this.booter.hh-35;
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
 * 获取本页面IFRAME对象
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
	this.MainMenuEl = document.createElement("li");
	this.MainMenuEl.className='lv1';
	this.MainMenuli = document.createElement("a");
	this.MainMenuli.href = 'javascript:void(0);';
	this.MainMenuI = document.createElement("i");
	this.MainMenuI.innerText = this.attrInfo.NAME;
	this.MainMenuli.appendChild(this.MainMenuI);
	this.subUl=false;
	this.expandingEl=false;
	this.booter = false;
	this.expanding = false;
	this.subMenuItems = new Array();
	this.MainMenuEl.appendChild(this.MainMenuli);
	var _this = this;	
	
	_this.MainMenuEl.onmouseover = function(){
			_this.showSubs();		
		};		
	_this.MainMenuEl.onmouseout = function(){
		var srcElement = event.srcElement;
		var pos = Ext.fly(_this.subUl).getXY();
		var size = Ext.fly(_this.subUl).getSize();
		var posMainMenu = Ext.fly(_this.MainMenuEl).getXY();
		var sizeMainMenu = Ext.fly(_this.MainMenuEl).getSize();
		event.cancelBubble = true;
		
		if(pos[0]<event.clientX && event.clientX<pos[0]+size.width
				&& pos[1]<event.clientY && event.clientY<pos[1]+size.height||posMainMenu[0]<event.clientX 
				&& event.clientX<posMainMenu[0]+sizeMainMenu.width
				&& posMainMenu[1]<event.clientY && event.clientY<posMainMenu[1]+sizeMainMenu.height+10){
			return false;
		}
		_this.hideSubs();
	};
		
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
		document.getElementById("wholeContent").style.display = "";
		document.getElementById('indexPageFrame').style.display = "none";
		_this.booter.createTag(_this.attrInfo);
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
	_this.MainMenuli.style.backgroundColor="";
	if(_this.subUl)		
		_this.subUl.style.display = 'none';
};
/**
 * 二级菜单显示位置计算
 * @return
 */
Com.yucheng.crm.index.MainMenu.prototype.resetPos = function(){
	//默认向右浮动
	var _this = this;

	var MainMenuW      = Ext.fly('in_top').getSize().width;//主菜单栏宽度
	var MainMenuBeginX = Ext.fly('in_top').getXY()[0];//主菜单栏开始X坐标
	var MainMenuEndX   = MainMenuBeginX + MainMenuW;//主菜单栏结束X坐标
	var subUlW         = Ext.fly(_this.subItem).getSize().width;//二级菜单宽度
	var currMainMenuX  = Ext.fly(_this.MainMenuEl).getXY()[0];//当前一级菜单X坐标
	var currMainMenuW  = _this.MainMenuEl.offsetWidth;//当前一级菜单宽度

	//当前剩余宽度处理
	//可以右浮动
	if(currMainMenuX + subUlW <= MainMenuEndX){
		Ext.fly(_this.subUl).setX(currMainMenuX);
	} 
	//可以左浮动
	else if (currMainMenuX + subUlW > MainMenuEndX 
			&& (currMainMenuX + currMainMenuW - MainMenuBeginX) >= subUlW){
		Ext.fly(_this.subUl).setX(currMainMenuX + currMainMenuW - subUlW);
	} else {
		Ext.fly(_this.subUl).setX(MainMenuBeginX + 10);//显示不下了，放在主菜单栏开始X坐标+10
	}
};
/**
 * 显示一级菜单下的二级菜单项
 * @return
 */
Com.yucheng.crm.index.MainMenu.prototype.showSubs = function(){
	var _this = this;	
	if(!_this.subUl){
		var mainMenuElArr = [];
		var currMenuGrp = 0;
		var subMenusData = _this.getSubItems();
		
		Ext.each(subMenusData,function(b){
			var smi = new Com.yucheng.crm.index.SubMenuItem(b,_this.booter);
			smi.parentMenu = _this;
			_this.subMenuItems.push(smi);
		});
		
		_this.subUl=document.createElement('div');
		_this.subUl.className ='menu_lv2';
		_this.subUl.style.display='';
		_this.subItem=document.createElement('div');
		_this.subItem.className ='menu_lv2_div';
		_this.subItem.style.minHeight = '160px';
					
		_this.subLeft = document.createElement('div');//换组按钮：上一组
		_this.subLeft.innerHTML="<a href='javascript:void(0);'></a>";
		_this.subLeft.className = 'menu_lv2_left';
		
		_this.subRight = document.createElement('div');//换组按钮：下一组
		_this.subRight.innerHTML="<a href='javascript:void(0);'></a>";
		_this.subRight.className = 'menu_lv2_right';
			
		if(_this.subMenuItems.length<4||_this.subMenuItems.length==4){
			var tLi = document.createElement('ul');
			tLi.className='menu_lv2_ul';
			for(var mi=0;mi<_this.subMenuItems.length;mi++){
				tLi.appendChild(_this.subMenuItems[mi].itemEl);
			}
			 mainMenuElArr.push(tLi);
			_this.subItem.appendChild(tLi);
			Ext.fly(tLi).setWidth((155 *_this.subMenuItems.length)+35);//根据一级菜单下的二级菜单个数调整二级菜单显示框的宽度；
			tLi.style.width= parseInt(155 *_this.subMenuItems.length + 5)+'px';
			_this.subLeft.style.display = 'none';
			_this.subRight.style.display = 'none';
		}else{
			var mGroupCount = Math.ceil((_this.subMenuItems.length)/4);
			for(var i=0; i<mGroupCount; i++){//对二级菜单进行分组
				var tLi = document.createElement('ul');
				tLi.className='menu_lv2_ul';
				if(i==0){
					for(var mi=0;mi<4&&mi<_this.subMenuItems.length;mi++){
						tLi.appendChild(_this.subMenuItems[mi].itemEl);
					}
					
					 mainMenuElArr.push(tLi);
					_this.subItem.appendChild(tLi);
					Ext.fly(tLi).setWidth((155 *4)+35);
					tLi.style.width='625px';
				}else{
					for(var mi=i*4; mi<(i+1)*4&&mi<_this.subMenuItems.length; mi++){
						tLi.appendChild(_this.subMenuItems[mi].itemEl);
					}
					
					tLi.style.display = 'none';
					mainMenuElArr.push(tLi);
					_this.subItem.appendChild(tLi);
					if(i==mGroupCount-1){
						//Ext.fly(tLi).setWidth(155 *(_this.subMenuItems.length-4*i)+35);//根据一级菜单下的二级菜单个数调整二级菜单显示框的宽度；
						Ext.fly(tLi).setWidth(155 *4+35);//根据一级菜单下的二级菜单个数调整二级菜单显示框的宽度；
						tLi.style.width='625px';
					}else{
						Ext.fly(tLi).setWidth(155 *4+35);
						tLi.style.width='625px';
					}
				}
			}
			//翻页点击事件
			_this.subLeft.onclick=function(){
				
				event.cancelBubble = true;
				_this.subRight.style.display = '';
				if(currMenuGrp>0){
					mainMenuElArr[currMenuGrp].style.display = 'none';
					currMenuGrp--;
					mainMenuElArr[currMenuGrp].style.display = '';
					
				}
				if(currMenuGrp==0){
					_this.subLeft.style.display = 'none';
				}
			};			
			_this.subRight.onclick=function(){
				event.cancelBubble = true;
				_this.subLeft.style.display = '';
				if( currMenuGrp<mainMenuElArr.length-1){
					mainMenuElArr[currMenuGrp].style.display = 'none';
					currMenuGrp++;
					mainMenuElArr[currMenuGrp].style.display = '';
					
				}
				if(currMenuGrp ==mainMenuElArr.length-1){
					
					_this.subRight.style.display = 'none';
				}
			};
			
			var	scrollFunc = function(event){//滑轮滚动翻页二级菜单
				if(!event){
					event=window.event;
				}
				if(event.wheelDelta){
					if(event.wheelDelta==120){//滚轮向前
						_this.subRight.style.display = '';
						if(currMenuGrp>0){
							mainMenuElArr[currMenuGrp].style.display = 'none';
							currMenuGrp--;
							mainMenuElArr[currMenuGrp].style.display = '';
							
						}
						if(currMenuGrp==0){
							_this.subLeft.style.display = 'none';
						}
					}else if(event.wheelDelta==-120){//滚轮向后
						_this.subLeft.style.display = '';
						if( currMenuGrp<mainMenuElArr.length-1){
							mainMenuElArr[currMenuGrp].style.display = 'none';
							currMenuGrp++;
							mainMenuElArr[currMenuGrp].style.display = '';
						}
						if(currMenuGrp ==mainMenuElArr.length-1){
							
							_this.subRight.style.display = 'none';
						}
					}
				}
			};
			if(document.addEventListener){ //注册事件
				document.addEventListener('DOMMouseScroll',scrollFunc,false); 
			}//W3C 
			window.onmousewheel=_this.subUl.onmousewheel=scrollFunc;
		}			
		
		_this.subUl.style.position = 'absolute';
		_this.subUl.style.zIndex = 60000;
		_this.subLeft.style.display = 'none';
		_this.subUl.appendChild(_this.subLeft);
		_this.subUl.appendChild(_this.subItem);
		_this.subUl.appendChild(_this.subRight);
		
		_this.getMainMenuEl().appendChild(_this.subUl);
	
	}
	
	_this.subUl.style.display = '';
	_this.MainMenuli.style.backgroundColor='#99cc00';//显示二级菜单时，对应的一级菜单的背景颜色
	//计算当前二级菜单位置
	_this.resetPos();
	//IE6判断
	if(Ext.isIE6){
		_this.subUl.className ='menu_lv2IE6';
		_this.subLeft.style.top = '150px';
		_this.subLeft.style.marginTop = '-34px';
		_this.subLeft.style.height = '100px';
		_this.subLeft.style.zIndex = 20000;
		_this.subLeft.style.width = '23px';
		_this.subRight.style.width = '23px';
		_this.subRight.style.height = '100px';
		_this.subRight.style.top = '150px';
		_this.subRight.style.marginTop = '-34px';
	}
			
	_this.expanding = true;
	_this.booter.ccurrMainMenu = _this;
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
Com.yucheng.crm.index.SubMenuItem = function(menu_data,booter){
	
	this.attrInfo = menu_data;
	
	this.booter = booter;
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
		itemName.innerHTML = '<i>'+_this.attrInfo.NAME.substring(0,INDEXUTIL.subMenusNameMaxLen)+'...</i>';
	}else{
		itemName.innerHTML = '<i>'+_this.attrInfo.NAME+'</i>';
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
	this.itemEl.className = 'lv2';
	this.itemEl.appendChild(itemName);
	_this.showSubs();
	
};
/**
 * 二级菜单下的三级菜单显示
 * */
Com.yucheng.crm.index.SubMenuItem.prototype.showSubs = function(){
	
	var _this = this;
	if(_this.expanding){
		return false;
	};
	
	if(!_this.expanded){
		var subDatas = _this.getSubItems();
		Ext.each(subDatas,function(sd){
			var mmi = new Com.yucheng.crm.index.ModuleMenuItem(sd);
			mmi.booter = _this.booter;
			mmi.parentMenu = _this;
			_this.subMenuItems.push(mmi);
		});
		if(_this.subMenuItems.length>0){
			_this.subUl = document.createElement("ul");
			_this.subUl.id = _this.attrInfo.ID;
			_this.subUl.className = "menu_lv3_ul";
			Ext.each(_this.subMenuItems,function(smi){
				_this.subUl.appendChild(smi.menuEl);
			});
			_this.subUl.style.display = '';
			_this.getItemEl().appendChild(_this.subUl);			
			_this.expanding = true;
		}
		_this.expanded = true;
	}else{	
			_this.subUl.style.display = '';
			_this.expanding = true;
		
	}
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
	_this=this;
	if(_this.attrInfo.ACTION){
		event.cancelBubble = true;
		document.getElementById("wholeContent").style.display = "";
		document.getElementById('indexPageFrame').style.display = "none";
		_this.booter.createTag(_this.attrInfo);
	}
	
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
 * 三级菜单对象
 * @param menu_data
 * @param level
 */
Com.yucheng.crm.index.ModuleMenuItem = function(menu_data){
	
	this.attrInfo = menu_data;
	//this.serbIn += '&nbsp;';	
	this.booter = false;
	this.level = 3;
	this.parentMenu = false;
	
	this.subMenuItems = new Array();
	this.expanded = false;
	this.expanding = false;
	this.subUl = false;
	
	var _this = this;
	var img=document.createElement("img");
	img.id='img';
	img.src= basepath +'/contents/wljFrontFrame/styles/sheet/sheetthemes/theme1/pics/menu_arr.gif';
	img.width='16';
	img.height='6';
	var menuTile = document.createElement("a");
	//menuTile.className = "lnav1_sub";
	menuTile.title = _this.attrInfo.NAME;
	if(INDEXUTIL.subMenusNameShort && _this.attrInfo.NAME.length > INDEXUTIL.subMenusNameMaxLen){
		menuTile.innerHTML = '<i>'+_this.attrInfo.NAME.substring(0,INDEXUTIL.subMenusNameMaxLen)+'...</i>';
	}else{
		menuTile.innerHTML = '<i>'+_this.attrInfo.NAME+'</i>';
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
	if(_this.attrInfo.LEAF_FLAG ==0){
		menuTile.appendChild(img);
	}
	this.menuEl = document.createElement('li');
	this.menuEl.className='lv3';
	this.menuEl.id = this.attrInfo.ID+'_minaMenu';
	this.menuEl.appendChild(menuTile);

};
/**
 * 获取三级菜单DOM
 * @return
 */
Com.yucheng.crm.index.ModuleMenuItem.prototype.getMenuEl = function(){
	return this.menuEl;
};
/**
 * 三级菜单点击事件
 * */
Com.yucheng.crm.index.ModuleMenuItem.prototype.onClick = function(){
	var _this=this;
	var El=_this.getMenuEl();

	if(_this.expanding){
		_this.collapse();
		_this.parentMenu.parentMenu.expandingEl=false;
	}else{
		if(_this.parentMenu.parentMenu.expandingEl){
			if(_this.parentMenu.parentMenu.expandingEl!=_this){
				_this.parentMenu.parentMenu.expandingEl.collapse();
				_this.expand();
				_this.parentMenu.parentMenu.expandingEl=_this;
			}else{
				_this.expand();
			}
		}else{
			_this.expand();
			_this.parentMenu.parentMenu.expandingEl=_this;
		}
	}

	if(_this.attrInfo.ACTION){
		if(!event){
			event=window.event;
		}
		event.cancelBubble = true;
		document.getElementById("wholeContent").style.display = "";
		document.getElementById('indexPageFrame').style.display = "none";
		_this.booter.createTag(_this.attrInfo);
	}
	
};
/**
 * 三级菜单的子菜单展开
 * @return
 */
Com.yucheng.crm.index.ModuleMenuItem.prototype.expand = function(){
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
			_this.subUl.className = 'menu_lv3_ul';
			_this.subUl.id = _this.attrInfo.ID;
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
 * 三级子菜单收起方法
 * @return
 */
Com.yucheng.crm.index.ModuleMenuItem.prototype.collapse = function(){
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
/*
 * 四级或五..级菜单对象
 * */
Com.yucheng.crm.index.ModuleMenuItems = function(menu_data,level){
	
	this.attrInfo = menu_data;
	
	this.level = level;
	this.serbIn = '';
	for(var i=0;i<level-1;i++){
		this.serbIn += '&nbsp;';
	}
	
	this.booter = false;
	this.parentMenu = false;
	
	this.subMenuItems = new Array();
	this.expanded = false;
	this.expanding = false;
	this.subUl = false;
	
	var img=document.createElement("img");
	img.src=basepath +'/contents/wljFrontFrame/styles/sheet/sheetthemes/theme1/pics/menu_arr.gif';
	img.width='16';
	img.height='6';
	var _this = this;
	var menuTile = document.createElement("a");
	menuTile.href = 'javascript:void(0);';
	//menuTile.className = "lv4";
	menuTile.title = _this.attrInfo.NAME;
	if(INDEXUTIL.subMenusNameShort && _this.attrInfo.NAME.length > INDEXUTIL.subMenusNameMaxLen-level+1){
		menuTile.innerHTML = '<i>'+_this.serbIn+_this.attrInfo.NAME.substring(0,INDEXUTIL.subMenusNameMaxLen-level+1)+'...</i>';
	}else{
		menuTile.innerHTML = '<i>'+_this.serbIn+_this.attrInfo.NAME+'</i>';
	}	
	menuTile.onclick = function(){
		_this.onClick();
		if(_this.attrInfo.LEAF_FLAG!=1 && INDEXUTIL.reLayoutSubMenus){
			event.cancelBubble = true;
			return false;
		}
	};
	if(_this.attrInfo.LEAF_FLAG ==0){
		menuTile.appendChild(img);
	}
	if(Ext.isIE6){
		menuTile.onmouseover = function(){
			menuTile.className = 'aover';
		};
		menuTile.onmouseout = function(){
			menuTile.className = '';
		};
	}
	
	this.menuEl = document.createElement('li');
	this.menuEl.className = 'lv4';
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
 * 获取四，五级...菜单DOM
 * @return
 */
Com.yucheng.crm.index.ModuleMenuItem.prototype.getMenuEl = function(){
	return this.menuEl;
};

/**
 * 四级或五级．．．点击方法
 * */
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
			_this.subUl.className='menu_lv3_ul';			
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
		document.getElementById("wholeContent").style.display = "";
		document.getElementById('indexPageFrame').style.display = "none";
		_this.booter.createTag(_this.attrInfo);
	}
};

/**
 * 四级或五级...子菜单的展开方法 
 * */
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
			_this.subUl.className='menu_lv3_ul';
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
* 四级或五级子菜单收起方法
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
 * 收起所有三级菜单孙子菜单
 * @return
 */
Com.yucheng.crm.index.ModuleMenuItem.prototype.collapseAll = function(){
	var _this = this;
	Ext.each(_this.subMenuItems,function(smi){
		smi.collapse();
	});
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
 * 获取三级菜单对象子菜单数据
 * @return
 */
Com.yucheng.crm.index.ModuleMenuItem.prototype.getSubItems = function(){
	var _this = this;
	return _this.booter.getSubItems(_this.attrInfo.ID);
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
	aOther.href ='javascript:void(0);';
	//aOther.innerHTML =' <img src="../../images/blue/tagbt01.gif" />';
	aOther.title = '移除其他页签';
	aOther.className = 'close_btn_all';
	var allTag = document.createElement('a');
	allTag.href ='javascript:void(0);';
	allTag.className = 'close_btn_other';
	allTag.title = '移除所有页签';
	var aThis = document.createElement('a');
	aThis.href ='javascript:void(0);';
	//aThis.innerHTML ='<img src="../../images/blue/tagbt02.gif" />';
	aThis.title = '移除本页签';
	aThis.className = 'close_btn_other';
	var noCurTag = document.createElement('a');
	noCurTag.href ='javascript:void(0);';
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
	iconA.href = 'javascript:void(0);';
	iconA.innerHTML = "<img src="+_this.backgroundImg+" width='27' height='28' />";
	if(_this.aStyle)
		iconA.style.cssText = _this.aStyle;
	iconA.onclick = function(){
		if(Ext.isFunction(_this.iconClick))
			_this.iconClick();
	};
	
	_this.iconEl = document.createElement("p");
	if(_this.id)
		_this.iconEl.id = _this.id;
	if(_this.className)
		_this.iconEl.className = 'in_fun_p';
	_this.iconEl.title = _this.title;
	_this.iconEl.style.cursor = 'hand';
	
	_this.iconEl.appendChild(iconA);
	document.getElementById(_this.shortCutContainer).appendChild(_this.iconEl);
};
Com.yucheng.crm.index.ShortcutIcon.prototype.shortCutContainer = 'invokeIcons';