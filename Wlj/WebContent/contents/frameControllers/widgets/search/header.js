/**
 * 搜索模式顶层工具栏
 */
Ext.ns('Wlj.widgets.search.header');
Wlj.widgets.search.header.HeadBar = Ext.extend(Ext.Container,{
	autoEl: {
		tag : 'div'
	},
	cls : 'menu_menu_con',
	backgroundTpl :new Ext.XTemplate('<div class="main_menu"></div>'),
	defaultType : 'mainfunction',
	onRender : function(ct, position){
		Wlj.widgets.search.header.HeadBar.superclass.onRender.call(this,ct,position);
		this.backgroundTpl = new  Ext.XTemplate('<div class="main_menu" style="top:{top}px"></div>');
		/**
		 * 透明背景
		 */
		this.backgroundTpl.insertBefore(this.el,{
			top:this.y
		});
	}
});
Ext.reg('headbar',Wlj.widgets.search.header.HeadBar);
/***
 * 搜索模式顶层功能区
 */
Wlj.widgets.search.header.MainFunction = Ext.extend(Ext.BoxComponent,{
	autoEl : {
		tag : 'div',
		cls : 'main_menu_div'
	},
	functionTpl : new Ext.XTemplate(
		'<li class="main_menu_ul_li {cls}" style="{cssText}">',
    		'<a class="{acls}" href="javascript:void(0)">',
    			'<i class="{iconcls}"></i>',
    			'<i class="{wordcls}" title="{name}">{name}</i>',
    		'</a>',
    	'</li>'),
    mainTpl : new Ext.XTemplate(
    	 '<ul class="main_menu_ul"></ul>'
    ),
    items:[],
    headerFun : new Ext.util.MixedCollection(),
    onRender : function(ct, position){
		Wlj.widgets.search.header.MainFunction.superclass.onRender.call(this, ct, position);
		this.ulEl = this.mainTpl.append(this.el,{functions:[]});
		var _this = this;
		Ext.each(_this.items,function(it){
			var _fn = it.functionName ? it.functionName : 'Wlj.widgets.search.header.Function';
			_this.headerFun.add(eval('new '+_fn+'(it, _this)'));
		});
	},
	doRender : function(){
		var items = this.items;
		if(!Ext.isArray(items) || items.length == 0){
			return;
		}
		var _this = this;
		var len = items.length;
		var funBuffer = [];
		for(var it=0;it<len;it++){
			funBuffer.push(_this.functionTpl.apply(items[it]));
		}
		return funBuffer.join('');
	},
	add : function(func){
		return this.functionTpl.append(this.ulEl,func.cfg);
	}
});
Ext.reg('mainfunction', Wlj.widgets.search.header.MainFunction);

/**
 * 搜索模式顶层图标
 */
Wlj.widgets.search.header.Function = function(cfg,p){
	Ext.apply(this, cfg);
	this.id = cfg.id ? cfg.id : Ext.id('Head_fun_');
	this.parent = p;
	this.cfg = cfg;
	this.el = p.add(this);
	var _this = this;
	Ext.fly(this.el).on('click',function(event,dom,scope){
		if(Ext.isFunction(_this.handler)){
			_this.handler(_this.parent,_this,_this.el);
		}
	});
	if(Ext.isFunction(_this.overHandler)){
		Ext.fly(this.el).on('mouseenter',function(event,dom,scope){
			_this.overHandler(_this.parent,_this,_this.el);
		});
	}
	if(Ext.isFunction(_this.outHandler)){
		Ext.fly(this.el).on('mouseleave',function(event,dom,scope){
//			if(dom === _this.el) 
				_this.outHandler(_this.parent,_this,_this.el);
		});
	}
	return this;
};
Wlj.widgets.search.header.Function.prototype.show = function(){
	this.el.style.display = 'block';
};
Wlj.widgets.search.header.Function.prototype.hide = function(){
	this.el.style.display = 'none';
};

Wlj.widgets.search.header.MenuFunction = Ext.extend(Wlj.widgets.search.header.Function, {
	
	constructor : function(cfg, p){
		Wlj.widgets.search.header.MenuFunction.superclass.constructor.call(this, cfg, p);
		if(!this.menuRoot){
			this.menuRoot = '0';
		}
	},
	overHandler : function(p,_thisObj,dom){
		if(_thisObj.menuItem && _thisObj.hasSub){
			_thisObj.menuItem.show();
			return;
		}else{
			var subc = p.appObject.createSubMenuCfg(_thisObj.menuRoot);
			if(!subc){
				_thisObj.hasSub = false;
				return false;
			}
			_thisObj.hasSub = true;
			var mc = new Wlj.widgets.search.menu.MenuComponent({
				appObject : p.appObject,
				renderTo : _thisObj.el,
				items : [subc]
			});
			_thisObj.menuItem = mc;
			p.appObject.menuItem = mc;
		}
	},
	outHandler : function(p,_thisObj,dom){
		if(_thisObj.menuItem && _thisObj.hasSub){
			_thisObj.menuItem.hide();
		}
	},
	handler : function(p,f,dom){
		if(Wlj.ServiceMgr.findServiceByID(f.menuRoot)){
			Wlj.ServiceMgr.findServiceByID(f.menuRoot).execute();
		}
	}
});


/**
 * 用户信息对象
 */
Wlj.widgets.search.header.UserInfo = Ext.extend(Ext.BoxComponent, {
	autoEl:{
		tag:'div',
		cls:'user_frame'
	},
	userImg:basepath+(__userIcon !== ''?('/imgshow.json?t='+new Date().getTime()+'&path='+__userIcon):'/contents/wljFrontFrame/styles/search/searchpics/user_head.jpg'),
	welcomeText:'',
	userName : '',
	userRole : '',
	userOrg : '',
	headTpl : new Ext.XTemplate('<div class="user_head">',
		'<div class="user_head_pic"><img src="{userImg}" width="45" height="45" complete="complete"/></div>',
		'</div>'	),
	logoutTpl : new Ext.XTemplate('<div class="user_oper">',
			'<p><a class="loginout" href="'+basepath+'/j_spring_security_logout"></a></p>',
			'</div>'),
	infoTpl : new Ext.XTemplate('<div class="user_info">'
			,'<p class="user_info_p">你好，<i class="name">{userName}</i>，欢迎登录！</p>'
			,'<p class="user_info_p blue"><span class="tit">岗位：</span><span>{userRole}</span></p>'
			,'<p class="user_info_p blue"><span class="tit">机构：</span><span>{userOrg}</span></p>'
			,'</div>'),
	onRender : function(ct,position){
		Wlj.widgets.search.header.UserInfo.superclass.onRender.call(this, ct, position);
		this.headTpl.append(this.el,{userImg:this.userImg});
		this.infoTpl.append(this.el,{userName:this.userName,userRole:this.userRole,userOrg:this.userOrg});
		this.logoutTpl.append(this.el);
	}
});
Ext.reg('userinfo',Wlj.widgets.search.header.UserInfo);

/**
 * 个性化设置
 */
Wlj.widgets.search.header.Customize = Ext.extend(Ext.Container,{
	autoEl : {
		tag : 'div',
		cls : 'yc-themeSettings'
	},
	themes : [],
	backgrounds : [],
	wordsizes : [],
	themeElArray : [],
	bgElArray : [],
	wordsizeElArray : [],
	containerTemplate : new Ext.XTemplate('<div class="yc-tsContent"></div>'),
	separateTemplate : new Ext.XTemplate('<div class="yc-ts-Title"><span class="yc-tstText">{text}</span></div>'),
	iconTemplate : new Ext.XTemplate(
		'<a class="yc-tscLink" href="javascript:void(0);">',
			'<img alt="" src="{icon}">',
			'<div class="yc-tsclsIco"></div>',
		'</a>'),
	wordsizeTemplate : new Ext.XTemplate('<label><input type="radio" name="ra_fontsize" />{text}</label>'),
	saveTemplate : new Ext.XTemplate('<a class="yc-tsbt" href="javascript:void(0);" title="{text}">{text}</a>'),
	onRender : function(ct, position){
		Wlj.widgets.search.header.Customize.superclass.onRender.call(this, ct, position);
		
		this.renderThemeEl();
		this.renderBackgroundEl();
		this.renderWordsizeEl();
		this.renderSaveEl();
		this.el.applyStyles({
			zIndex : 15000
		});
	},
	onShow : function(){
		var _this = this;
        Wlj.widgets.search.header.Customize.superclass.onShow.call(this);
        _this.THEME_CSS = _this.THEME_CSS?_this.THEME_CSS:(_this.themes[0]?_this.themes[0].themeName : "");
		_this.BG_ICON = _this.BG_ICON?_this.BG_ICON:(_this.backgrounds[0]?_this.backgrounds[0].reaBG : "");
		_this.WORD_SIZE = _this.WORD_SIZE?_this.WORD_SIZE:(_this.wordsizes[0]?_this.wordsizes[0].size : "");
		_this.setCustomize();
    },
	renderThemeEl : function(){
		var _this = this;
		_this.separateTemplate.append(_this.el,{
			text : '皮肤设置'
		});
		_this.themeEl = this.containerTemplate.append(_this.el,{});
		Ext.each(_this.themes,function(it){
			var iconEl = _this.iconTemplate.append(_this.themeEl,{
				icon : basepath + it.preBG
			});
			_this.themeElArray.push(iconEl);
			Ext.fly(iconEl).on('click',function(event,dom,scope){
				Ext.each(_this.themeElArray,function(el){
					Ext.fly(el).removeClass('yc-tscLinkSelected');
				});
				Ext.fly(iconEl).addClass('yc-tscLinkSelected');
				_this.THEME_CSS = it.themeName;
			});
		});
	},
	renderBackgroundEl : function(){
		var _this = this;
		_this.separateTemplate.append(_this.el,{
			text : '背景设置'
		});
		_this.bgEl = this.containerTemplate.append(_this.el,{});
		Ext.each(_this.backgrounds,function(it){
			var iconEl = _this.iconTemplate.append(_this.bgEl,{
				icon : basepath + it.preBG
			});
			_this.bgElArray.push(iconEl);
			Ext.fly(iconEl).on('click',function(event,dom,scope){
				Ext.each(_this.bgElArray,function(el){
					Ext.fly(el).removeClass('yc-tscLinkSelected');
				});
				Ext.fly(iconEl).addClass('yc-tscLinkSelected');
				Ext.getBody().applyStyles({
					background: "url("+basepath+it.reaBG+") fixed center"
				});
				_this.BG_ICON = it.reaBG;
			});
		});
	},
	renderWordsizeEl : function(){
		var _this = this;
		_this.separateTemplate.append(_this.el,{
			text : '字号设置'
		});
		_this.wordSizeEl = _this.containerTemplate.append(_this.el,{});
		Ext.each(_this.wordsizes,function(it){
			var wordsizeEL = _this.wordsizeTemplate.append(_this.wordSizeEl,{
				text : it.text
			});
			_this.wordsizeElArray.push(wordsizeEL);
			Ext.fly(wordsizeEL).on('click',function(event,dom,scope){
				_this.WORD_SIZE = it.size;
			});
		});
	},
	renderSaveEl : function(){
		var _this = this;
		new Ext.XTemplate('<div class="yc-ts-Title"></div>').append(_this.el,{});
		_this.saveConainerEl = this.containerTemplate.append(_this.el,{});
		_this.saveEl = _this.saveTemplate.append(_this.saveConainerEl,{
			text : '保存设置'
		});
		_this.resetEl = _this.saveTemplate.append(_this.saveConainerEl,{
			text : '恢复默认'
		});
		Ext.fly(_this.saveEl).on('click',function(event,dom,scope){
			if(Ext.isFunction(_this.saveHandler)){
				_this.saveHandler(_this);
			}
		});
		Ext.fly(_this.resetEl).on('click',function(event,dom,scope){
			_this.THEME_CSS = _this.themes[0]?_this.themes[0].themeName : "";
			_this.BG_ICON = _this.backgrounds[0]?_this.backgrounds[0].reaBG : "";
			_this.WORD_SIZE = _this.wordsizes[0]?_this.wordsizes[0].size : "";
			Ext.getBody().applyStyles({
				background: "url("+basepath+_this.BG_ICON+") fixed center"
			});
			_this.setCustomize();
			if(Ext.isFunction(_this.saveHandler)){
				_this.saveHandler(_this);
			}
		});
		new Ext.XTemplate('<span class="yc-tsRemark">提示：恢复默认将还原首页个性化与主题到初始状态。</span>').append(_this.saveConainerEl,{});
	},
	setCustomize : function(){
		var _this = this;
		for(var i=0;i<_this.themes.length;i++){
			Ext.fly(_this.themeElArray[i]).removeClass('yc-tscLinkSelected');
			if(_this.THEME_CSS == _this.themes[i].themeName){
				Ext.fly(_this.themeElArray[i]).addClass('yc-tscLinkSelected');
			}
		}
		for(var i=0;i<_this.backgrounds.length;i++){
			Ext.fly(_this.bgElArray[i]).removeClass('yc-tscLinkSelected');
			if(_this.BG_ICON == _this.backgrounds[i].reaBG){
				Ext.fly(_this.bgElArray[i]).addClass('yc-tscLinkSelected');
			}
		}
		for(var i=0;i<_this.wordsizes.length;i++){
			if(_this.WORD_SIZE == _this.wordsizes[i].size){
				Ext.fly(_this.wordsizeElArray[i]).child('input').dom.checked = true;
				break;
			}
		}
		
	},
	saveHandler : function(c){
		var _this = this;
		var results = {
			themeCss : c.THEME_CSS ? c.THEME_CSS:'',
			bgIcon : c.BG_ICON ? c.BG_ICON:'',
			wordSize : c.WORD_SIZE ? c.WORD_SIZE:'',
			spareOne : '',
			spareTwo : ''
		};
		Ext.Ajax.request({
			url : basepath + '/userSysCfg.json',
			method : 'POST',
			params : results,
			success : function(){
				Ext.apply(_APP.themeData,{
					THEME_CSS : c.THEME_CSS ? c.THEME_CSS:'',
					BG_ICON : c.BG_ICON ? c.BG_ICON:'',
					WORD_SIZE : c.WORD_SIZE ? c.WORD_SIZE:'',
					SPARE_ONE : '',
					SPARE_TWO : ''
				});
				document.createStyleSheet(basepath+"/contents/wljFrontFrame/styles/search/searchthemes/"+c.THEME_CSS+"/frame.css",document.styleSheets.length);
				document.createStyleSheet(basepath+"/contents/wljFrontFrame/styles/search/searchthemes/"+c.THEME_CSS+"/main.css",document.styleSheets.length+1);
				if(c.WORD_SIZE === 'ra_normal'){
					document.createStyleSheet(basepath+"/contents/wljFrontFrame/styles/search/searchcss/font_normal.css",document.styleSheets.length+2);
				}else{
					document.createStyleSheet(basepath+"/contents/wljFrontFrame/styles/search/searchcss/font_big.css",document.styleSheets.length+2);
				}
				Wlj.TaskMgr.tasks.each(function(task){
					
					task.frame.dom.contentWindow.document.createStyleSheet( basepath+"/contents/wljFrontFrame/styles/search/searchthemes/"+c.THEME_CSS+"/frame.css",task.frame.dom.contentWindow.document.styleSheets.length);
					task.frame.dom.contentWindow.document.createStyleSheet( basepath+"/contents/wljFrontFrame/styles/search/searchthemes/"+c.THEME_CSS+"/main.css",task.frame.dom.contentWindow.document.styleSheets.length+1);
					if(c.WORD_SIZE === 'ra_normal'){
						task.frame.dom.contentWindow.document.createStyleSheet( basepath+"/contents/wljFrontFrame/styles/search/searchcss/font_normal.css",task.frame.dom.contentWindow.document.styleSheets.length+2);
					}else{
						task.frame.dom.contentWindow.document.createStyleSheet( basepath+"/contents/wljFrontFrame/styles/search/searchcss/font_big.css",task.frame.dom.contentWindow.document.styleSheets.length+2);
					}
				});
				Ext.Msg.alert('提示','保存成功！');
				_this.hide();
				
			}
		});
	}
});
Ext.reg("wljcustomize",Wlj.widgets.search.header.Customize);