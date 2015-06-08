/**
 * Date : 2012-4-17
 * Version : 1.2
 * Memo : Version 1.0 is coded for the Ajax connection to JAVA Project with ActiveX Msxml2.XMLHTTP.6.0 . 
 * 		  Msxml2.XMLHTTP.6.0 uses the library "msxml6.dll" of "IE 6.0". 
 * 		  That will make some mistake when the URL contains some special chars or is too long.
 * 		  The Patch-1.000 will be used when the special chars is in the URL.
 * 		  The following words are included in the "Special chars":
 * 			 	backspace %08 		tab %09 			linefeed %0A 		creturn %0D 
 *				space %20 			! %21 				" %22 				# %23 
 *				$ %24 				% %25 				& %26 				' %27 
 *				( %28 				) %29  				* %2A 				+ %2B 
 *				, %2C 				- %2D 				. %2E 				: %3A 
 *				; %3B 				< %3C 				= %3D 				> %3E 
 *				? %3F 				@ %40 				[ %5B 				\ %5C 
 *				] %5D 				^ %5E 				_ %5F 				` %60 
 *				{ %7B 				| %7C 				} %7D 				~ %7E 
 *						
 *				var activeX = ['Msxml2.XMLHTTP.6.0',	
 *  	        	           'Msxml2.XMLHTTP.3.0',
 *                  		   'Msxml2.XMLHTTP'].
 *        Version 1.1 : 1、Fixed Ext.Ajax.requst method bug option. When single call the method with params. The Ext-base.js will change the 'method' option to 'POST'.
 *        				So we should encode the parameters ,and add it to the URL. 
 *           			2、Add a method Ext.setGridColumnMenDisable(param) for control the grid column's menu. You can call
 *           			it in includes.jsp for all the modules, or call it in your own module only work in your module.
 *        Version 1.2 : 1、Add the method to reduce the exceptions from the WEB server. It will be called when the Ext.Ajax.requestexception event happened.
 *        				2、Add a property : Ext.CRM_EXCEPTION. You can apply your special exception method in it.
 *        				3、Add the response exception code : 600(Session out).
 *        				4、MEMO: You can define your own exception code, add you can also define the HTTP exception codes. So we can control the exceptions together.
 *        				   Following codes can be defined here:
 *        						 	4**：请求包含一个错误语法或不能完成 
 *									5**：服务器执行一个完全有效请求失败 
 *		  Version 1.3 : 1、添加500错误码处理逻辑；
 *                      2、添加下拉框输入字符时，下拉选项匹配规则控制。
 */
/**System method: decode your URL.*/
Ext.apply(Ext,{
	URL_PAR : function(url){
		if(Ext.isString(url))
			if(url.indexOf("?")>=0){
				return url.substring(0,url.indexOf("?")+1)+Ext.urlEncode(Ext.urlDecode(url.substring(url.indexOf("?")+1)));
			}else return url;
		else return url;
	}
});
/**Add exception method. 
 * So coders can add exceptions methods in your owner project like this.
 */
Ext.apply(Ext,{
	/**CRM exceptions defines.*/
	CRM_EXCEPTION:{
		/**CRM System exception when the session is missing.*/
		SESSION_OUT:{
			CODE:'600',
			/**
			 * @param ajax: Ext.Ajax Object with current state;
			 * @param response: response object by the web sever;
			 * @param request: Current request informations.
			 */
			HANDLER:function(ajax,response,request){
				try{
					request.failure = false;
					requsst.success = false;
					request.callback = false;
				}catch(e){}finally{
					top.location.href=basepath;
				}
			}
		},
		COMMON_ERROR:{
			CODE:'500',
			/**
			 * TODO 需要区分：数据请求错误、js代码请求错误、通用数据请求错误（如数据字典等）。
			 * 		500错误编码牵涉范围过广，单500编码逻辑处理需要建立一个错误分类管理机制，
			 * 		除却系统错误，还包括BizException扩展定义的错误编码。
			 * 
			 * @param ajax: Ext.Ajax Object with current state;
			 * @param response: response object by the web sever;
			 * @param request: Current request informations.
			 */
			HANDLER:function(ajax,response,request){
				for(var i=0;i<this.exceptAble.length;i++){
					if(request.url.indexOf(this.exceptAble[i]) >= 0){
						return;
					}else continue;
				}
				try{
					request.failure = false;
					requsst.success = false;
					request.callback = false;
				}catch(e){}finally{
					var rep=Ext.decode(response.responseText);
					if(rep.level==0){//业务提醒信息
						Ext.Msg.alert('提示','操作失败，'+rep.msg);
					}else if(rep.level==1) {//警告信息
						Ext.Msg.alert('警告提示','警告代码：'+rep.code
								+"<p>警告名称："+rep.errMsg
								+"<p>警告原因："+rep.msg);
					}else{//错误信息提示
						Ext.Msg.alert('操作失败','错误代码：'+rep.code
								+"<p>错误名称："+rep.errMsg
								+"<p>错误原因："+rep.msg);
					}
				}
			},
			/**
			 * 排除选项，某些特定URL在抛出500异常之后，不做特殊处理，而是继续执行后续代码
			 */
			exceptAble : ['indexinit','pageSetManageAction','userdink']
		}
	}
});
/**System call: decode your URL when you call Ext.data.Store.load or Ext.Ajax.request*/
Ext.Ajax.on('beforerequest',function(a,b){
	b.url = Ext.URL_PAR(b.url);
	if(b.method && b.method.trim().toUpperCase()=='GET'){
		Ext.getMehtodFormat(b);
	}else if(b.method && b.method.trim().toUpperCase()=='POST'){
		Ext.postMehtodFormat(b);
	}
});

/**HTTP请求FORMAT开关，
 * GET : 对GET请求进行URL编码改造；
 * POST : 强制将未指明方法的URL指定为create方法；
 * **/
Ext.apply(Ext, {
	getFormatTrigger : true,
	postFormatTrigger : true, 
	postMehtodFormat : function(b){
		if(!Ext.postFormatTrigger){
			return;
		}
		if(b.url.indexOf('!')>=0 || b.url.indexOf('.json')<0){
			return;
		}
		var fUrl = b.url.substring(0,b.url.indexOf('.json'))+'!create'+b.url.substring(b.url.indexOf('.json'));
		b.url = fUrl;
	},
	getMehtodFormat : function(b){
		if(!Ext.getFormatTrigger){
			return;
		}
		if(!b.reader&&b.params){
			if(b.url.indexOf('?')>0){
				b.url += '&'+ (Ext.isString(b.params) ? b.params : Ext.urlEncode(b.params));
			}else{
				b.url += '?'+ (Ext.isString(b.params) ? b.params : Ext.urlEncode(b.params));
			}
			delete b.params;
		}
	}
});
/**System call: when your AJAX request is excepting, this event will be called.
 * It will call the function you defined in Ext.CRM_EXCEPTION by the response.status.
 * If the status code was not got , it will do nothing. And it need to be tested when timeout.
 */
Ext.Ajax.on("requestexception",function(ajax,response,request){
	if(response.isTimeout===true){
		Ext.Msg.alert('操作提示','操作超时或网络不可用');
		return;
	}
	for(var key in Ext.CRM_EXCEPTION){
		var EXP = Ext.CRM_EXCEPTION[key];
		if(EXP.CODE&&EXP.HANDLER)
			if(response.status&&response.status==EXP.CODE){
				EXP.HANDLER(ajax,response,request);
				return;
			}
			else continue;
		else continue;
	}
});
/**System method: set your grid column menu when your mouse over the column head.*/
Ext.apply(Ext,{
	setGridColumnMenuDisable : function(param){
		for(var key in Ext.grid.Column.types){
			Ext.grid.Column.types[key].prototype.menuDisabled = param;
		}
	}
});
/**
 * Fix: When render a tree in the ComboBox, the ComboBox collapse when expand a tree node.
 */
Ext.override(Ext.form.ComboBox, {
	onViewClick : function(doFocus) {
		var index = this.view.getSelectedIndexes()[0], s = this.store, r = s.getAt(index);
		if (r) {
			this.onSelect(r, index);
		} else if (s.getCount() === 0) {
			this.collapse();
		}
		if (doFocus !== false) {
			this.el.focus();
		}
	}
});	

/**
 * 添加Ext属性，下拉框匹配规则。
 * comboAnyMatch ： 默认为false：下拉框中输入字符匹配下拉选项前半部分；true：则匹配全文。
 * setComboAnyMatch : 方法，在需要修改下拉框匹配规则的功能调用，则可修改局部匹配规则；在全局作用域调用，则可修改全局匹配规则。
 */
Ext.apply(Ext,{
	comboAnyMatch : false,
	setComboAnyMatch : function(anyMatch){
		if (anyMatch === true){
			Ext.comboAnyMatch = true;
		}
	}
});
/**
 * 重写下拉框触发查询数据过滤方法。添加控制下拉框数据匹配规则参数.
 */
Ext.override(Ext.form.ComboBox,{
	doQuery : function(q, forceAll){
		
		this.typeAhead = false;
		
    	q = Ext.isEmpty(q) ? '' : q;
    	var qe = {
    			query: q,
    			forceAll: forceAll,
    			combo: this,
    			cancel:false
    	};
    	if(this.fireEvent('beforequery', qe)===false || qe.cancel){
    		return false;
    	}
    	q = qe.query;
    	forceAll = qe.forceAll;
    	if(forceAll === true || (q.length >= this.minChars)){
    		if(this.lastQuery !== q){
    			this.lastQuery = q;
    			if(this.mode == 'local'){
    				this.selectedIndex = -1;
    				if(forceAll){
    					this.store.clearFilter();
    				}else{
    					this.store.filter(this.displayField, q, Ext.comboAnyMatch);
    				}
    				this.onLoad();
    			}else{
    				this.store.baseParams[this.queryParam] = q;
    				this.store.load({
    					params: this.getParams(q)
    				});
    				this.expand();
    			}
    		}else{
    			this.selectedIndex = -1;
    			this.onLoad();
    		}
    	}
	},
	expand : function(){
		if(this.readOnly){
			return false;
		}
        if(this.isExpanded() || !this.hasFocus){
            return;
        }

        if(this.title || this.pageSize){
            this.assetHeight = 0;
            if(this.title){
                this.assetHeight += this.header.getHeight();
            }
            if(this.pageSize){
                this.assetHeight += this.footer.getHeight();
            }
        }

        if(this.bufferSize){
            this.doResize(this.bufferSize);
            delete this.bufferSize;
        }
        this.list.alignTo.apply(this.list, [this.el].concat(this.listAlign));

        // zindex can change, re-check it and set it if necessary
        this.list.setZIndex(this.getZIndex());
        this.list.show();
        if(Ext.isGecko2){
            this.innerList.setOverflow('auto'); // necessary for FF 2.0/Mac
        }
        this.mon(Ext.getDoc(), {
            scope: this,
            mousewheel: this.collapseIf,
            mousedown: this.collapseIf
        });
        this.fireEvent('expand', this);
    }
});
/********背景图片，使用本地图片，不去访问万维网资源。*********/
Ext.BLANK_IMAGE_URL = basepath + '/contents/wljFrontFrame/styles/common/ext3/resources/images/default/s.gif';

/********************浏览器版本判断机制**********************************/
Ext.apply(Ext, {
	isIE : /(msie\s|trident.*rv:)([\w.]+)/.test(navigator.userAgent.toLowerCase())
});

Ext.apply(Ext,{
	isIE6 : Ext.isIE && (/msie 6/.test(navigator.userAgent.toLowerCase()) || document.documentMode == 6),
	isIE7 : Ext.isIE && (/msie 7/.test(navigator.userAgent.toLowerCase()) || document.documentMode == 7),
	isIE8 : Ext.isIE && (/msie 8/.test(navigator.userAgent.toLowerCase()) || document.documentMode == 8),
	isIE9 : Ext.isIE && (/msie 9/.test(navigator.userAgent.toLowerCase()) || document.documentMode == 9),
	isIE10 : Ext.isIE && (/msie 10/.test(navigator.userAgent.toLowerCase()) || document.documentMode == 10),
	isIE11 : Ext.isIE && (/trident.*rv:11.0/.test(navigator.userAgent.toLowerCase()))
});
/**
 * 解决IE9下树形面板事件失效
 */
if(Ext.isIE9 || Ext.isIE10 || Ext.isIE11){
	Ext.tree.TreeEventModel.prototype.getNode = function(e){
		var t;
		if(t = e.getTarget('.x-tree-node-el', 10)){
			var id = Ext.fly(t, '_treeEvents').dom.getAttribute('ext:tree-node-id');
			if(id){
				return this.tree.getNodeById(id);
			}
		}
		return null;
	};
}
/**修复IE9下的日期框宽度问题**/
Ext.override(Ext.menu.Menu, {
    autoWidth : function(){         
        var el = this.el, ul = this.ul;         
        if(!el){         
            return;         
        }         
        var w = this.width;         
        if(w){         
            el.setWidth(w);   
        }else if(Ext.isIE9 || Ext.isIE10 || Ext.isIE11){
            el.setWidth(this.minWidth);         
            var t = el.dom.offsetWidth;         
            el.setWidth(ul.getWidth()+el.getFrameWidth("lr"));         
        }         
    }         
}); 

Ext.apply(Ext,{
	/**
	 * 判断Obj是否xtype的实体或者xtype子类的实体
	 * @param Obj : 实体Ext对象；
	 * @param xtype : Ext类的xtype或者Ext类本身
	 */
	instanceOf : function(Obj,xtype){
		var types = ['object','function','string'];
		
		var otype;
		
		if(types.indexOf(typeof Obj)!==0){
			return false;
		}
		try{
			if(Obj.constructor){
				otype = Obj.constructor;
			}
		}catch(e){
			return false;
		}
		if(types.indexOf(typeof xtype) < 1){
			return false;
		}
		return Ext.isSubClass(xtype,otype);
	},
	/**
	 * 判断type2是否type1的子类,type1和type2为xtype或者Ext类名,若传入两个类相同，则返回：true。
	 * @param type1:父类xtype或者父类本身
	 * @param type2:子类xtype或者子类本身
	 */
	isSubClass : function(type1,type2){
		var types = ['function','string'];
		var t1,t2;
		switch(types.indexOf(typeof type1)){
		case 1 : if(Ext.ComponentMgr.types[type1]){
			t1 = Ext.ComponentMgr.types[type1];
			break;
		}else return false;
		case 0 : t1 = type1;break;
		default : return false;
		}
		switch(types.indexOf(typeof type2)){
		case 1 : if(Ext.ComponentMgr.types[type2]){
			t2 = Ext.ComponentMgr.types[type2];
			break;
		}else return false;
		case 0 : t2 = type2;break;
		default : return false;
		}
		if(t1===t2){
			return true;
		}
		while(t2.superclass && t2.superclass.constructor !== t1){
			t2 = t2.superclass.constructor;
		}
		if(t2.superclass && t2.superclass.constructor === t1){
			return true;
		}else return false;
	}
});
/**
 * 修复IE9下Ext.Window展示、动画问题
 */
if ((typeof Range !== "undefined") && !Range.prototype.createContextualFragment) {
	Range.prototype.createContextualFragment = function(html) {
		var frag = document.createDocumentFragment(),
		div = document.createElement("div");
		frag.appendChild(div);
		div.outerHTML = html;
		return frag;
	};
}
/**
 * 修复IE9以上版本，获取自定义属性失败的BUG。
 */
if(Ext.isIE9 || Ext.isIE10 || Ext.isIE11){
	Ext.override(Ext.Element, {
		getAttribute : function(m, o){
			var p = this.dom, n = typeof p[o + ":" + m];
			if (["undefined", "unknown"].indexOf(n) == -1) {
				return p.getAttribute(o + ":" + m);
			}
			return p.getAttribute(m);
		}
	});
}
/**
 * Ext.unzipString
 * @params : value, splits...
 */
Ext.apply(Ext,{
	unzipString : function(){
		var args = arguments;
		if(args.length === 0 ){
			return false;
		}
		if(args.length === 1){
			return args[0];
		}
		var value = args[0];
		var result = false;
		result = value.split(args[1]);
		if(args.length>2){
			Ext.each(result, function(r){
				var i = result.indexOf(r);
				var iArgs = Array.prototype.slice.call(args, 2);
				iArgs.unshift(r);
				result[i] = Ext.unzipString.apply(Ext, iArgs);
			});
		}
		return result;
	}
});

/**
 * 放大镜被选择后
 */
Ext.override(Ext.form.TriggerField,{
	setValue : function(value){
		var oldValue = this.getValue();
		Ext.form.TriggerField.superclass.setValue.call(this,value);
		if(!Ext.instanceOf(this,'combo')){
			if(Ext.encode(value) !== Ext.encode(oldValue)){
				this.fireEvent('change',this, value, oldValue);
			}
		}
	},
	updateEditState: function(){
        if(this.rendered){
            if (this.readOnly) {
                this.el.dom.readOnly = true;
                this.el.addClass('x-trigger-noedit');
                //this.mun(this.el, 'click', this.onTriggerClick, this);
                this.trigger.setDisplayed(false);
            } else {
                if (!this.editable) {
                    this.el.dom.readOnly = true;
                    this.el.addClass('x-trigger-noedit');
                    //this.mon(this.el, 'click', this.onTriggerClick, this);
                } else {
                    this.el.dom.readOnly = false;
                    this.el.removeClass('x-trigger-noedit');
                    this.mun(this.el, 'click', this.onTriggerClick, this);
                }
                this.trigger.setDisplayed(!this.hideTrigger);
            }
            this.onResize(this.width || this.wrap.getWidth());
        }
    }
});
/**
 * 当字段被定义为editable：false或者readOnly的时候，该字段将无法获取焦点。
 */
//Ext.override(Ext.form.Field ,{
//	afterRender : function(){
//		var _this = this;
//		if(_this.editable===false || _this.readOnly){
//			_this.el.on('focus',function(){
//				_this.blur();
//			});
//		}
//    	Ext.form.Field.superclass.afterRender.call(this);
//    	this.initEvents();
//    	this.initValue();
//	}
//});
Ext.apply(Ext.util.Format, {
	rmbMoney : function(v) {
    	v = (Math.round((v-0)*100))/100;
    	v = (v == Math.floor(v)) ? v + ".00" : ((v*10 == Math.floor(v*10)) ? v + "0" : v);
    	v = String(v);
    	var ps = v.split('.'),
    	whole = ps[0],
        sub = ps[1] ? '.'+ ps[1] : '.00',
        r = /(\d+)(\d{3})/;
        while (r.test(whole)) {
        	whole = whole.replace(r, '$1' + ',' + '$2');
        }
        v = whole + sub;
        if (v.charAt(0) == '-') {
        	return '-￥' + v.substr(1);
        }
        return "￥" +  v;
	}
});

Ext.apply(Ext.form.Field.prototype, {
	setLabelText : function(label){
		if(!label){
			return false;
		}
		this.fieldLabel = label;
		if(this.rendered){
			if(this.allowBlank===false){
				this.label.dom.innerHTML = '<font color=red>*</font>'+label;
			}else{
				this.label.dom.innerText = label;
			}
		}
		return true;
	}
});