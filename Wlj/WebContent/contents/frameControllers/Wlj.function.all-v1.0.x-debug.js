Ext.ns('Com.yucheng.bcrm');
/**
 * Bcrm tree panel
 * 
 * @since 2013-01-30 修改树形结构解析方法，取消递归，采用的2维循环，算法复杂度：n的平方
 * @since 2013-01-30 添加lazyLoad模式；并设置阀值1000；当数据量超过1000时，强制采用lazyLoad模式；
 * 
 */
Wlj.frame.functions.app.widgets.TreePanel = Ext.extend(Ext.tree.TreePanel,{
	clickFn : false,
	resloader: false,
	checkBox: false,
	ctCls:'x-treeContainer',
	root:{},
	load : function(){
		var loader = this.resloader;
		var u = loader.url;
		var tree = this;
//		if(u&&!loader.dataCache){
//			Ext.Ajax.request({
//				url:u,
//				method:'GET',
//				success:function(response){
//					var responseObj = Ext.util.JSON.decode(response.responseText);
//					var rst;
//					if(dr){
//						rst = eval('response.'+dr);
//						loader.dataRoot = false;
//					}
//					else 
//						rst = responseObj;
//					loader.nodeArray = rst;
//					tree.appendChild(loader.loadAll());
//				}
//			});
//		}else{
			tree.appendChild(loader.loadAll());
//		}
	},
	addNode : function (obj) {
		this.resloader.addNode(obj);
	},
	deleteNode : function (obj) {
		this.resloader.deleteNode(obj);
	},
	editNode : function (obj) {
		this.resloader.editNode(obj);
	},
	onRender : function(ct,position){
		Wlj.frame.functions.app.widgets.TreePanel.superclass.onRender.call(this,ct,position);
	},
	afterRender : function(){
		Wlj.frame.functions.app.widgets.TreePanel.superclass.afterRender.call(this);
		if(this.resloader){
			this.load();
		}
		var _this = this;
		this.on('click',function(node){
			__tmpNode = node;
			if(Ext.isFunction(_this.clickFn)){
				_this.clickFn(node);
			}
		});
	},
	appendChild:function(childern){
		if(childern)
			this.root.appendChild(childern);
	},
	initComponent : function(){
		Wlj.frame.functions.app.widgets.TreePanel.superclass.initComponent.call(this);
		this.resloader.supportedTrees.push(this);
	},
	beforeLoad : function(){
        this.removeClass("x-tree-node-loading");
    },
	listeners : {
		append : function(tree,parent,node,index){
			__tmpNode = node;
			if(Ext.isBoolean(tree.checkBox)&&tree.checkBox){
				if(!node.attributes[tree.resloader.checkField]){
					node.checked = false;
					node.attributes.checked =  false;
				}else{
					node.checked = true;
					node.attributes.checked = true;
				}
			}else{
				delete node.checked;
				delete node.attributes.checked;
			}
			return true;
		},beforeexpandnode : function(node,deep,anim){
			var _this = this;
			if(node.hasloadeddata || node == _this.root){
				return true;
			}
			if(_this.resloader.lazyLoad){
				node.hasloadeddata = true;
				_this.resloader.expandChild(node.attributes);
			} else return true;
		},beforedestroy : function(tree){
			if(tree.resloader){
				tree.resloader.supportedTrees.remove(tree);
			}
			return true;
		}
	}
});
Ext.reg('wljtree',Wlj.frame.functions.app.widgets.TreePanel);

/**
 * Bcrm tree loader.
 */
Wlj.frame.functions.app.widgets.TreeLoader = Ext.extend(Ext.tree.TreeLoader,{});
Ext.reg('wljtreeloader',Wlj.frame.functions.app.widgets.TreeLoader);

var __tmpNode = {};
/**
 * A tree node array loader, Now it can only make the array to be a tree nodes option. But we can make it more powerfull.
 */
Wlj.frame.functions.app.widgets.ArrayTreeLoader = Ext.extend(Ext.tree.TreeLoader,{
	url:false,
	dataCache:false,
	nodeArray :false,
	parentAttr : false,
	rootValue : '',
	textField : false,
	idProperties: false,
	dataRoot : false,
	lazyLoad : false,
	lazyLoadCount : 1000,
	supportedTrees : new Array(),
	checkField : false,
	constructor : function(cfg){
		Wlj.frame.functions.app.widgets.ArrayTreeLoader.superclass.constructor.call(this, cfg);
		this.supportedTrees = new Array();
	},
	//private 
	loadAll : function(){
		var _this = this;
		if(!this.dataCache){
			var r = this.rootValue;
			var p = this.parentAttr;
			var t = this.textField;
			var i = this.idProperties;
			var d = this.dataRoot;
			var tn = this.nodeArray;
			if(!tn){
				return;
			}
			var n;
			if(!d)
				n = tn;
			else 
				n = evel('tn.'+d);
			var childArray = [];
			if(Ext.isArray(n)){
				if(n.length >= _this.lazyLoadCount){
					_this.lazyLoad = true;
				}
				Ext.each(n,function(a){
					if(a[p]==r){
						childArray.push(a);
					}
				});
			}else{
				return;
			}
			
			if(!_this.lazyLoad){
				Ext.each(this.nodeArray,function(b){
					if(t)
						b.text = b[t];
					if(i)
						b.id = b[i];
					_this.privateExpand(b);
				});
			}else{
				Ext.each(childArray,function(b){
					if(t)
						b.text = b[t];
					if(i)
						b.id = b[i];
					_this.privateExpand(b);
				});
			}
			this.dataCache = childArray;
			return this.dataCache;
		}else return this.dataCache;
	},
	refreshCache : function(){
		this.dataCache = false;
		this.dataCache = this.loadAll();
	},
	addNode : function(obj){
		var idPro = this.idProperties;
		var namePro = this.textField;
		var _this = this;
		var pField = this.parentAttr;
		if(obj[namePro]!=''&&obj[namePro]!=undefined&&obj[idPro]!=''&&obj[idPro]!=undefined){
			obj.id = obj[idPro];
			obj.text = obj[namePro];
		}
		if(!Ext.isArray(obj.children) || obj.children.length == 0)
			obj.leaf = true;
		if(!this.hasNode(obj)){
			//将此节点添加到父节点的children中
			var parent = this.hasNodeByProperties(idPro,obj[pField]);
			if(parent){
				if(parent.leaf || !parent.children){
					parent.children = [];
					parent.leaf = false;
				}
				parent.children.push(obj);
			}
			if(obj.text&&obj[this.parentAttr]){
				this.nodeArray.push(obj);
			}
		}
		
		Ext.each(this.supportedTrees,function(t){
			if(!t.rendered){
				return;
			}
			if(obj[idPro]==t.root.id){
				return;
			}
			if(t.root.findChild("id",obj[idPro],true)){
				return;
			}
			
			if(!obj[pField]||obj[pField]==t.root.id){
				obj[pField] = t.root.id;
				t.root.appendChild(obj);
			}else{
				var parent = t.root.findChild("id",obj[pField],true);
				if(parent){
					if(parent.isLeaf())
						parent.leaf = false;
//					if(parent.expanded)					//TODO adjust expanded.			
					parent.appendChild(obj);
				}
			}
		});
	},
	deleteNode : function(obj){
		var idPro = this.idProperties;
		var namePro = this.textField;
		var pField = this.parentAttr;
		var _this = this;
		if(!obj.id){
			obj.id = obj[idPro];
		}
		if(!obj.text){
			obj.text = obj[namePro];
		}
		var node = this.hasNode(obj);
		if(node){
			Ext.each(this.supportedTrees,function(t){
				if(!t.rendered){
					return;
				}
				if(obj.text!=''&&obj.text!=undefined&&obj.id!=''&&obj.text!=undefined){
					if(obj.id==t.root.id){
						return;
					}
					var node = t.root.findChild("id",obj.id,true);
					if(node){
						var parent = node.parentNode;
						parent.removeChild(node,true);
						if(!parent.hasChildNodes()){
							Ext.fly(parent.getUI().elNode).addClass('x-tree-node-leaf');
							parent.leaf = true;
							parent.ownerTree.doLayout();
							Ext.fly(parent.getUI().elNode).removeClass('x-tree-node-collapsed');
						}
					}else{
						var parent = t.root.findChild("id",obj[pField],true);
						if(parent){
							if(_this.hasChildren(_this.hasNode({id:obj[pField]})).length==1){
								Ext.fly(parent.getUI().elNode).addClass('x-tree-node-leaf');
								parent.leaf = true;
								parent.ownerTree.doLayout();
								Ext.fly(parent.getUI().elNode).removeClass('x-tree-node-collapsed');
							}
						}
					}
				}
			});
			this.nodeArray.remove(node);
			this.refreshCache();
		}
	},
	editNode : function(obj){
		var idPro = this.idProperties;
		var namePro = this.textField;
		var pField = this.parentAttr;
		if(!obj.id){
			obj.id = obj[idPro];
		}
		if(!obj.text){
			obj.text = obj[namePro];
		}
		var loader = this;
		if(obj.text!=''&&obj.text!=undefined&&obj.id!=''&&obj.text!=undefined){
			if(!loader.hasNode(obj)){
				return;
			}
			var objConfig = loader.hasNode(obj);
			//20141013,修改树节点其它属性,不控制text与pField
//			if(objConfig.text == obj.text && objConfig[pField] == obj[pField]){
//				return;
//			}
			Ext.apply(objConfig,obj);
			objConfig[idPro] = obj.id;
			objConfig[namePro] = obj.text;
			var pChanged = false;
			if(objConfig[pField] !== obj[pField]){
				objConfig[pField] = obj[pField];
				pChanged = true;		
			}
			
			this.refreshCache();
			
			Ext.each(this.supportedTrees,function(t){
				if(!t.rendered){
					return;
				}
				if(obj.id==this.root.id){
					return;
				}
				if(!obj[pField]){
					return;
				}
				if(!pChanged){
					var node = t.root.findChild("id",obj.id,true);
					if(node){
						node.setText(obj.text);
					}
				} else {
					t.root.removeAll();
					t.load();
					t.root.expand();
				}
			});
		}
	},
	hasNode : function(obj){
		var r = this.rootValue;
		var p = this.parentAttr;
		var t = this.textField;
		var i = this.idProperties;
		var d = this.dataRoot;
		var tn = this.nodeArray;
		if(!tn){
			return;
		}
		var n;
		if(!d)
			n = tn;
		else 
			n = evel('tn.'+d);
		for(var o in n){
			if(n[o].id==obj.id){
				return n[o];
			}
		}
		return false;
	},
	
	hasNodeByProperties : function(property, value){
		var r = this.rootValue;
		var p = this.parentAttr;
		var t = this.textField;
		var i = this.idProperties;
		var d = this.dataRoot;
		var tn = this.nodeArray;
		if(!tn){
			return false;
		}
		var n;
		if(!d)
			n = tn;
		else 
			n = evel('tn.'+d);
		
		if(!property){
			return false;
		}
//		for(var o in n){
//			if(n[o][property] === value){
//				return n[o];
//			}
//		}
		if(Ext.isArray(n)){
			var nodelen = n.length;
			for(var i=0;i<nodelen;i++){
				if(n[i][property] === value){
					return n[i];
				}
			}
		}
		
		return false;
		
	},
	
	hasChildren : function(obj){
		var r = this.rootValue;
		var p = this.parentAttr;
		var t = this.textField;
		var i = this.idProperties;
		var d = this.dataRoot;
		var tn = this.nodeArray;
		if(!tn){
			return;
		}
		var n;
		if(!d)
			n = tn;
		else 
			n = evel('tn.'+d);
		var res = [];
		for(var o in n){
			if(n[o][p]==obj[i]){
				res.push(n[o]);
			}
		}
		if(res.length>0){
			return res;
		}else return false;
	},
	privateExpand : function(obj){
		var tchild = this.hasChildren(obj);
		var _this = this;
		if(tchild){
			if(!_this.lazyLoad){
				obj.children = tchild;
			}else{
				obj.children = [];
			}
		}else {
			delete obj.children;
			obj.leaf = true;
		}
		return obj;
	},
	expandChild : function(obj){
		var r = this.rootValue;
		var p = this.parentAttr;
		var t = this.textField;
		var i = this.idProperties;
		var d = this.dataRoot;
		var tData = this.hasNode(obj);
		var tChild = this.hasChildren(obj);
		var _this = this;
		Ext.each(tChild, function(c){
			c.id = c[i];
			c.text = c[t];
			var hc = _this.hasChildren(c);
			if(hc){
				c.children = [];
			} else {
				delete c.children;
				c.leaf = true;
			}
			_this.addNode(c);
		});
	}
});
Ext.reg('wljarraytreeloader',Wlj.frame.functions.app.widgets.ArrayTreeLoader);
// vim: ts=4:sw=4:nu:fdc=4:nospell
/**
 * Ext.ux.form.LovCombo, List of Values Combo
 *
 * @author    Ing. Jozef Sakáloš
 * @copyright (c) 2008, by Ing. Jozef Sakáloš
 * @date      16. April 2008
 * @version   $Id: LovCombo.js,v 1.1 2009/03/02 03:39:45 zc_zheng Exp $
 *
 * @license Ext.ux.form.LovCombo.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the 
 * code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 * 
 * License details: http://www.gnu.org/licenses/lgpl.html
 */
 
/*global Ext */

// add RegExp.escape if it has not been already added
if('function' !== typeof RegExp.escape) {
	RegExp.escape = function(s) {
		if('string' !== typeof s) {
			return s;
		}
		// Note: if pasting from forum, precede ]/\ with backslash manually
		return s.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
	}; // eo function escape
}

// create namespace
Ext.ns('Ext.ux.form');
 /**
 *
 * @class Ext.ux.form.LovCombo
 * @extends Ext.form.ComboBox
 */
Ext.ux.form.LovCombo = Ext.extend(Ext.form.ComboBox, {

	// {{{
    // configuration options
	/**
	 * @cfg {String} checkField name of field used to store checked state.
	 * It is automatically added to existing fields.
	 * Change it only if it collides with your normal field.
	 */
	 checkField:'checked'

	/**
	 * @cfg {String} separator separator to use between values and texts
	 */
    ,separator:','

	/**
	 * @cfg {String/Array} tpl Template for items. 
	 * Change it only if you know what you are doing.
	 */
	// }}}
    // {{{
    ,initComponent:function() {
		var reg=new RegExp("-","g");
        this.checkField = 'checked'+this.id.replace(reg,'');
        	
		// template with checkbox
		if(!this.tpl) {
			this.tpl = 
				 '<tpl for=".">'
				+'<div class="x-combo-list-item">'
				+'<img src="' + Ext.BLANK_IMAGE_URL + '" '
				+'class="ux-lovcombo-icon-'
				+'{[values.' + this.checkField + '?"checked":"unchecked"' + ']}">'
				+'<label class="ux-lovcombo-item-text">{' + (this.displayField || 'text' )+ '}</label>'
				+'</div>'
				+'</tpl>'
			;
		}
 
        // call parent
        Ext.ux.form.LovCombo.superclass.initComponent.apply(this, arguments);

		// install internal event handlers
		this.on({
			 scope:this
			,beforequery:this.onBeforeQuery
			,blur:this.onRealBlur
		});

		// remove selection from input field
		this.onLoad = this.onLoad.createSequence(function() {
			if(this.el) {
				var v = this.el.dom.value;
				this.el.dom.value = '';
				this.el.dom.value = v;
			}
		});
 
    } // e/o function initComponent
    // }}}
	// {{{
	/**
	 * Disables default tab key bahavior
	 * @private
	 */
	,initEvents:function() {
		Ext.ux.form.LovCombo.superclass.initEvents.apply(this, arguments);

		// disable default tab handling - does no good
		this.keyNav.tab = false;

	} // eo function initEvents
	// }}}
	// {{{
	/**
	 * clears value
	 */
	,clearValue:function() {
		this.value = '';
		this.setRawValue(this.value);
		this.store.clearFilter();
		this.store.each(function(r) {
			r.set(this.checkField, false);
		}, this);
		if(this.hiddenField) {
			this.hiddenField.value = '';
		}
		this.applyEmptyText();
	} // eo function clearValue
	// }}}
	// {{{
	/**
	 * @return {String} separator (plus space) separated list of selected displayFields
	 * @private
	 */
	,getCheckedDisplay:function() {
		var re = new RegExp(this.separator, "g");
		return this.getCheckedValue(this.displayField).replace(re, this.separator + ' ');
	} // eo function getCheckedDisplay
	// }}}
	// {{{
	/**
	 * @return {String} separator separated list of selected valueFields
	 * @private
	 */
	,getCheckedValue:function(field) {
		field = field || this.valueField;
		var c = [];

		// store may be filtered so get all records
		var snapshot = this.store.snapshot || this.store.data;

		snapshot.each(function(r) {
			if(r.get(this.checkField)) {
				c.push(r.get(field));
			}
		}, this);

		return c.join(this.separator);
	} // eo function getCheckedValue
	// }}}
	// {{{
	/**
	 * beforequery event handler - handles multiple selections
	 * @param {Object} qe query event
	 * @private
	 */
	,onBeforeQuery:function(qe) {
		qe.query = qe.query.replace(new RegExp(this.getCheckedDisplay() + '[ ' + this.separator + ']*'), '');
	} // eo function onBeforeQuery
	// }}}
	// {{{
	/**
	 * blur event handler - runs only when real blur event is fired
	 */
	,onRealBlur:function() {
		this.list.hide();
		var rv = this.getRawValue();
		var rva = rv.split(new RegExp(RegExp.escape(this.separator) + ' *'));
		var va = [];
		var snapshot = this.store.snapshot || this.store.data;

		// iterate through raw values and records and check/uncheck items
		Ext.each(rva, function(v) {
			snapshot.each(function(r) {
				if(v === r.get(this.displayField)) {
					va.push(r.get(this.valueField));
				}
			}, this);
		}, this);
		this.setValue(va.join(this.separator));
		this.store.clearFilter();
	} // eo function onRealBlur
	// }}}
	// {{{
	/**
	 * Combo's onSelect override
	 * @private
	 * @param {Ext.data.Record} record record that has been selected in the list
	 * @param {Number} index index of selected (clicked) record
	 */
	,onSelect:function(record, index) {
        if(this.fireEvent('beforeselect', this, record, index) !== false){

			// toggle checked field
			record.set(this.checkField, !record.get(this.checkField));

			// display full list
			if(this.store.isFiltered()) {
				this.doQuery(this.allQuery);
			}

			// set (update) value and fire event
			this.setValue(this.getCheckedValue());
            this.fireEvent('select', this, record, index);
        }
	} // eo function onSelect
	// }}}
	// {{{
	/**
	 * Sets the value of the LovCombo
	 * @param {Mixed} v value
	 */
	,setValue:function(v) {
		if(v) {
			v = '' + v;
			if(this.valueField) {
				this.store.clearFilter();
				this.store.each(function(r) {
					var checked = !(!v.match(
						 '(^|' + this.separator + ')' + RegExp.escape(r.get(this.valueField))
						+'(' + this.separator + '|$)'))
					;

					r.set(this.checkField, checked);
				}, this);
				this.value = this.getCheckedValue();
				this.setRawValue(this.getCheckedDisplay());
				if(this.hiddenField) {
					this.hiddenField.value = this.value;
				}
			}
			else {
				this.value = v;
				this.setRawValue(v);
				if(this.hiddenField) {
					this.hiddenField.value = v;
				}
			}
			if(this.el) {
				this.el.removeClass(this.emptyClass);
			}
		}
		else {
			this.clearValue();
		}
	} // eo function setValue
	// }}}
	// {{{
	/**
	 * Selects all items
	 */
	,selectAll:function() {
        this.store.each(function(record){
            // toggle checked field
            record.set(this.checkField, true);
        }, this);

        //display full list
        this.doQuery(this.allQuery);
        this.setValue(this.getCheckedValue());
    } // eo full selectAll
	// }}}
	// {{{
	/**
	 * Deselects all items. Synonym for clearValue
	 */
    ,deselectAll:function() {
		this.clearValue();
    } // eo full deselectAll 
	// }}}
    /**
     * override,解决失去焦点后多选数据清空的问题
     * @author km
     * @since 20140723
     * */
    ,assertValue : Ext.emptyFn

}); // eo extend
 
// register xtype
Ext.reg('lovcombo', Ext.ux.form.LovCombo); 
 
// eof
/**
 * 同步AJAX对象
 * 
 */
(function(){
	var Wlj = {};
	if(!window.Wlj){
		window.Wlj = Wlj;
	}
	
	SyncAjax = function() {
		var _this = this;
		_this.initialize();
	};
	Ext.extend(SyncAjax, Ext.util.Observable);
	SyncAjax.prototype.disableCachingParam = '_dc';
	SyncAjax.prototype.method   = 'GET';//默认为GET方法
	SyncAjax.prototype.success  = false;
	SyncAjax.prototype.failure  = false;
	/***
	 * 初始化方法
	 * @return
	 */
	SyncAjax.prototype.initialize  = function(){
		var _this = this;
		this.addEvents({
			/**SyncAjax对象初始化**/
			/**
			 * SyncAjax 请求之前触发；
			 * params ：  
			 * return ：  
			 */
			beforeRequest : true,
			/**
			 * SyncAjax 请求之后触发；
			 * params ：  
			 */
			afterRequest : true,
			/**
			 * SyncAjax 请求异常触发；
			 * params ：  
			 */
			requestException : true,
			/**
			 * SyncAjax 请求成功触发；
			 * params ：  
			 */
			requestSucess : true,
			/**
			 * SyncAjax 请求失败触发；
			 * params ：  
			 */
			requestFailure : true
		});
	};
	/***
	 * 同步AJAX请求
	 */
	SyncAjax.prototype.request = function(cfg){
		var _this = this;
		var xhr;
		var value;
		try {
			if (window.ActiveXObject) {
				xhr = new ActiveXObject('Microsoft.XMLHTTP');
		    } else if (window.XMLHttpRequest) {
		    	xhr = new XMLHttpRequest();
		    }
			if (cfg.url.indexOf('?') > 0) {
				cfg.url = cfg.url + '&' +  Ext.urlEncode(cfg.params);
			} else {
				cfg.url = cfg.url + '?' +  Ext.urlEncode(cfg.params);
			}
			cfg.url = Ext.urlAppend(cfg.url, this.disableCachingParam + '=' + (new Date().getTime()));
			xhr.open(_this.method, cfg.url, false);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			var initFlag = _this.fireEvent('beforeRequest', this);
			if(initFlag === false){
				Ext.error('beforeRequest事件阻止了SyncAjax 请求!');
				return false;
			}
			xhr.send(null);
			_this.fireEvent('afterRequest', this);
			if (xhr.status == 200) {
				var _this = this;
				_this.fireEvent('requestSucess', this);
				if(Ext.isFunction(cfg.success)){ 
					cfg.success(xhr);
				}
			} else {
				var _this = this;
				Ext.log('Wlj.SyncAjax.syncRequest异常:[' + xhr.statusText + ']');
				_this.fireEvent('requestFailure', this);
				if(Ext.isFunction(cfg.failure)){ 
					cfg.failure(xhr);
				}
			}			
		} catch (eo) {
			Ext.log('Wlj.syncRequest异常');
			_this.fireEvent('syncException', this);
		} 
	}; 
	window.Wlj.SyncAjax = new SyncAjax();
})();

//var Wlj = {};
//window.Wlj = Wlj;
/**
 * 
 */
Wlj.version = {
	major : '1',
	subject : '0',
	patch : '0',
	fullVersion : '1.0.0',
	fullName : 'Walk Lonely Javascript',
	buildDate : '20131104',
	describe : 'Release 1.0.0 beta, based on Ext 3.3.1'
};

Wlj.tools = {
	namespace : function(){
		var o, d;
		Ext.each(arguments, function(v) {
			d = v.split(".");
			o = window[d[0]] = window[d[0]] || {};
			Ext.each(d.slice(1), function(v2){
				o = o[v2] = o[v2] || {};
			});
		});
		return o;
	},
	imports : function(files, callback){
		if(Ext.isArray(files)){
			if(files.length == 0){
				if(Ext.isFunction(callback)){
					callback.call(Wlj);
				}
			}else{
				Wlj.tools.load(files.pop(),function(){
					Wlj.tools.imports(files, callback);
				});
			}
		}else{
			Wlj.tools.load(files,callback);
		}
		
	},
	load : function(file, callback){
		//同步方式加载JS文件
		Wlj.SyncAjax.request({
			url : basepath + file, 
			callback : callback,
			success : function(response) {
				var _this = this;
				window.execScript ? window.execScript(response.responseText) : window.eval(response.responseText);
				if(Ext.isFunction(callback)){
					callback.call(Wlj);
				}
			}
		});
 	}
};

window.imports = Wlj.tools.imports;
Ext.ns('Wlj.memorise');
Wlj.memorise.Tile = function(){
	this.tiles = new Ext.util.MixedCollection();
	this.tilesData = new Ext.util.MixedCollection();
	var _this = this;
	this.tiles.on('add',function(){
		_this.onAdd();
	});
	this.tiles.on('remove',function(){
		_this.renderIndex --;
	});
	this.tilesData.on('add',function(){
		_this.onAddData();
	});
	this.tilesData.on('remove',function(){
		_this.dataLoadIndex --;
	});
	Wlj.memorise.Tile.superclass.constructor.call(this);
	this.renderIndex = 0;
	this.dataLoadIndex = 0;
	this.loading = false;
	this.dataLoading = false;
};

Ext.extend(Wlj.memorise.Tile, Ext.util.Observable, {
	addTile : function(tile){
		this.tiles.add(tile);
	},
	addDataCfg : function(cfg){
		this.tilesData.add(cfg);
	},
	loadJs : function(){
		var _this = this;
		_this.loading = true;
		var tile = _this.tiles.itemAt(_this.renderIndex);
		if(!tile){
			_this.loading = false;
			_this.loadData();
			return false;
		}else{
			if(!tile.jsUrl || !tile.tileSize){
				_this.renderIndex++;
				_this.loadJs();
			}else{
				var vs = tile.el.getViewSize(false);
				Ext.Ajax.request({
					method:'get',
					url : basepath + tile.jsUrl,
					success : function(response){
						tile.removeAll();
						tile.contentObject = window.eval ? window.eval(response.responseText) : window.execScript(response.responseText);
						if(tile.contentObject){
							if(Ext.isArray(tile.contentObject)){
								Ext.each(tile.contentObject,function(tc){
									tc.setSize(vs.width, vs.height);
								});
							}else{
								tile.contentObject.setSize(vs.width, vs.height);
							}
							tile.add(tile.contentObject);
							tile.doLayout();
						}
						_this.renderIndex++;
						_this.loadJs();
					},
					failure : function(response){
						_this.renderIndex++;
						_this.loadJs();
					}
				});
			}
		}
	},
	
	loadData : function(){
		var _this = this;
		_this.dataLoading = true;
		var dataCfg = _this.tilesData.itemAt(_this.dataLoadIndex);
		if(!dataCfg){
			_this.dataLoading = false;
			return false;
		} else {
			function cb(responseText){
				
				_this.dataLoadIndex ++;
				if(Ext.isFunction(dataCfg.dataCb)){
					dataCfg.dataCb.call(dataCfg.controlPanel,dataCfg.controlPanel, responseText);
				}
				_this.loadData();
			}
			if(dataCfg.store){
				dataCfg.store.load({
					params : {
						start : 0,
						limit : dataCfg.controlPanel.dataSize?dataCfg.controlPanel.dataSize:7
					},
					callback : function(){
						cb();
					}
				});
			}else {
				Ext.apply(dataCfg,{
					success : function(response){
						cb(response.responseText);
					},
					failure : function(){
						cb();
					}
				});
				Ext.Ajax.request(dataCfg);
			}
		}
	},
	onAddData : function(cfg){
		var _this = this;
		if(_this.loading){
			return;
		}else {
			if(_this.dataLoading){
				return;
			}else {
				_this.loadData();
			}
		}
	},
	onAdd : function(tile){
		var _this = this;
		if(_this.loading){
			return;
		}else{
			_this.loadJs();
		}
	},
	getTileBy : function(property, value){
		
	}
});

Wlj.memorise.TileController = new Wlj.memorise.Tile();
Wlj.TileMgr = Wlj.memorise.TileController;

/**任务管理器**/
Wlj.memorise.Task = function(){
	this.taskIdGen = 'task_tile_';
	this.tasks = new Ext.util.MixedCollection();
	var _this = this;
	this.tasks.on('add',function(index,task,key){
		_this.onAddTask(task);
	});
};
Ext.extend(Wlj.memorise.Task, Ext.util.Observable, {
	
	addTask : function(task){
		this.tasks.add(task);
	},
	removeTask : function(task){
		if(this.windowObject){
			var tile = this.windowObject.get(this.taskIdGen+task.id);
			if(tile){
				tile.ownerCt.remove(tile,true);
			}
		}
		this.tasks.remove(task);
	},
	getTask : function(id){
		return this.tasks.get(id);
	},
	onAddTask : function(task){
		this.toFront();
		if(this.windowObject){
			this.windowObject.add(this.createTaskTile(task,false));
			this.windowObject.doLayout();
		}
	},
	toFront : function(){
		if(this.windowObject){
			this.windowObject.toFront();
		}
	},
	createTaskTile : function(task,delay){
		var _this = this;
		var onetile = new Wlj.widgets.search.tile.Tile({
			id : _this.taskIdGen+task.id,
			cls : 'tile_c1',
			baseMargin : 2,
			ownerW :  10,
			ownerH : 20,
			baseSize :  686-4,
			baseHeight : 34,
			baseWidth : 20,
			taskObject : task,
			pos_size : {
				TX : 0,
				TY : _this.tasks.indexOf(task),
				TH : 1,
				TW : 1
			},
			html : '<br>&nbsp;'+task.name,
			listeners : {
				afterrender : function(t){
					var delayTime = delay ? (t.ownerCt.items.indexOf(t))*150 : 0;
					setTimeout(function(){
						t.el.animate({
							width : {
								from : 20,
								to : 686-4
							}
							
						},.35,
						null,
						'easeOut',
						'run');
					},delayTime);
				}
			},
			removeThis : function(){
				
				var index = this.ownerCt.items.indexOf(this);
				var ownerCt = this.ownerCt;
				this.ownerCt.remove(this,true);
				for(var i=index;i<ownerCt.items.getCount();i++){
					var item = ownerCt.items.itemAt(i);
					item.moveToPoint({
						x : item.pos_size.TX,
						y : item.pos_size.TY - 1
					});
				}
				task.close();
			}
		});
		return onetile;
	},
	
	showTasks : function(){
		var _this = this;

		if(this.windowObject){
			this.windowObject.toFront(true);
			return;
		}

		function createTaskTiles(){
			var tiles = [];
			_this.tasks.each(function(task){
				tiles.push(_this.createTaskTile(task,true));
			});
			return tiles;
		}
		this.windowObject = new Ext.Window({
			id : '_TASK_MANAGER',
			top:200,
			left:200,
			title : '任务管理器',
			height : 400,
			width : 700,
			appObject : _APP,
			manager : _APP.taskBar.windowManager
		});
		this.windowObject.on('show',function(window){
			window.add(createTaskTiles());
			window.doLayout();
		});
		this.windowObject.on('close',function(window){
			_this.windowObject = false;
		});
		this.windowObject.show();
	}
});

Wlj.memorise.TaskController = new Wlj.memorise.Task();
Wlj.TaskMgr = Wlj.memorise.TaskController;

Wlj.memorise.Service = function(){
	this.services = new Ext.util.MixedCollection();
};
Ext.extend(Wlj.memorise.Service, Ext.util.Observable, {
	
	addService : function(service){
		this.services.add(service);
	},
	removeService : function(service){
		/**
		 * TODO a remove service logic;
		 */
	},
	stopService : function(service){
		/**
		 * TODO a stop service logic;
		 */
	},
	createServiceWindow : function(){
		var _this = this;
		var cols = parseInt(_this.services.getCount()/7)+1;
		function createServiceItem(){
			var items = [];
			_this.services.each(function(ser){
				var index = _this.services.indexOf(ser);
				var ty = parseInt(index/7);
				var tx = parseInt(index%7);
				var item = new Wlj.widgets.search.service.PageServiceItem({
					ownerH : 20,
					ownerW : 100,
					serviceObject : ser
				});
				items.push(item);
			});
			return items;
		}
		
		this.serviceWindow = new Ext.Window({
			maximized : true,
			closeAction : 'hide',
			autoScroll : true,
			title : '服务管理器',
			items : [new Wlj.widgets.search.service.PageServiceContainer({
				width : 68 * cols,
				items : createServiceItem()
			})],
			listeners: {
				hide : function(){
					Ext.getBody().unmask();
				}
			}
		});
	},
	showServiceWindow : function(){
		if(!this.serviceWindow){
			this.createServiceWindow();
		}
		Ext.getBody().mask();
		this.serviceWindow.show();
		this.serviceWindow.el.setOpacity(.9);
	},
	findServiceByID : function(id){
		return this.services.get('service_'+id);
	}
});

Wlj.memorise.ServiceController = new Wlj.memorise.Service();
Wlj.ServiceMgr = Wlj.memorise.ServiceController;Ext.ns('Wlj.widgets.search.tile');
Wlj.widgets.search.tile.TileContainer = Ext.extend(Ext.Container, {
	cls : 'layout layout_tile',
	innerTpl : new Ext.XTemplate(' <div class="layout_contents" >','</div>'),
	layoutEl : false,
	scrolling : false,
	scrollIndex : 0,
	onRender :  function(ct,pos){
		Wlj.widgets.search.tile.TileContainer.superclass.onRender.call(this,ct,pos);
		this.layoutEl = this.innerTpl.append(this.el);
		//Ext.fly(this.layoutEl).setHeight(this.height);
		var _this = this;
		this.el.on('mousewheel', function(e){
			var delta = e.getWheelDelta();
			_this.scroll(delta);
		});
		this.el.on('contextmenu', function(eve){
			eve.stopEvent();
			_this.onContextMenu(eve, []);
		});
	},
	initComponent:function(){
		Wlj.widgets.search.tile.TileContainer.superclass.initComponent.call(this);
	},
	getLayoutTarget : function(){
		return this.layoutEl;
	},
	listeners : {
		show : function(cont){
			cont.scrollIndex = 0;
		}
	},
	scroll : function(delta){
		var _this = this;
		if(this.scrolling){
			return false;
		}
		this.scrolling = true;
		if(delta<0 && this.scrollIndex < this.items.getCount()-1){
			this.scrollIndex ++ ;
		}else if(delta>0 && this.scrollIndex >0){
			this.scrollIndex --;
		}else {
			_this.scrolling = false;//修复代码
			return;
		}
		this.el.scrollTo('left', this.scrollIndex * 836, true);
		setTimeout(function(){
			_this.scrolling = false;
		},350);
	},
	onContextMenu : function(e, added){
		var tilecontainermenu = Wlj.search.App.CONTEXT_MENU.TILE_CONTAINER;
		if(added.length>0&&tilecontainermenu.length>0){
			added.push('-');
		}
		var _this = this;
		if(tilecontainermenu.length>0){
			Ext.each(tilecontainermenu, function(tcm){
				tcm.handler = tcm.fn.createDelegate(_this);
				added.push(tcm);
			});
		}
		this.appObject.onContextMenu(e, added);
	}
});
Ext.reg('tilecontainer',Wlj.widgets.search.tile.TileContainer);

Wlj.widgets.search.tile.TileGroup = Ext.extend(Ext.Panel, {
	baseCls : 'layout_position',
	width : 840,
	tileKeys : [],
	height : 432,
	groupMargin : 27,
	onRender : function(ct, position){
		Wlj.widgets.search.tile.TileGroup.superclass.onRender.call(this, ct, position);
		this.el.setLeft(this.width*this.index+this.groupMargin*(this.index+1));
		this.initEvents();
		var _this = this;
		this.el.on('contextmenu', function(eve){
			eve.stopEvent();
			_this.onContextMenu(eve, []);
		});
		this.el.applyStyles({
			border:'1px transparent  dashed'
		});
	},
	
	initEvents : function(){
		this.dd = new Wlj.widgets.search.tile.GroupDropZone(this, {
			ddGroup: 'tileDrop'
		});
	},
	
	getTileWithPoint : function(point){
		var TX = point.x,
			TY = point.y;
		var _this = this;
		var items = _this.items.items,
			len = items.length;
		var ofTiles = [];
		for(var tileIndex=0; tileIndex<len; tileIndex++){
			var tile = items[tileIndex];
			var PS = tile.pos_size;
			if(TX >= PS.TX && TX < PS.TX+PS.TW
					&& TY >= PS.TY && TY < PS.TY+PS.TH){
				ofTiles.push(tile);
			}
		}
		return ofTiles;
	},
	regTile : function(keys,tileReg){
		
		if(!this.tileKeys){
			this.tileKeys = {};
		}
		
		if(!Ext.isArray(keys)){
			return false;
		}
		var _this = this;
		Ext.each(keys,function(key){
			_this.tileKeys[Ext.encode(key)] = tileReg;
		});
	},
	unRegTile : function(keys,tile){
		if(!Ext.isArray(keys)){
			return false;
		}
		var _this = this;
		Ext.each(keys,function(key){
			delete _this.tileKeys[Ext.encode(key)];
		});
	},
	getRegedTiles : function(keys){
		if(!Ext.isArray(keys)){
			return false;
		}
		var _this = this;
		var regedTiles = [];
		Ext.each(keys,function(key){
			if(regedTiles.indexOf(_this.tileKeys[Ext.encode(key)])<0){
				regedTiles.push(_this.tileKeys[Ext.encode(key)]);
			}
		});
		return regedTiles;
	},
	onContextMenu : function(e, added){
		
		var tilegroupmenu = Wlj.search.App.CONTEXT_MENU.TILE_GROUP;
		if(added.length>0&&tilegroupmenu.length>0){
			added.push('-');
		}
		var _this = this;
		if(tilegroupmenu.length>0){
			Ext.each(tilegroupmenu, function(tgm){
				tgm.handler = tgm.fn.createDelegate(_this);
				added.push(tgm);
			});
		}
		this.ownerCt.onContextMenu(e, added);
	}
});
Ext.reg('tilegroup', Wlj.widgets.search.tile.TileGroup);

Wlj.widgets.search.tile.TileLayout = Ext.extend(Ext.layout.ContainerLayout,{
	
	type : 'tilegroup',
	renderItem : function(c, position, target){
		Wlj.widgets.search.tile.TileLayout.superclass.renderItem.call(this,c,position,target);
	},
	fixPosition : function(c,target){
		var baseX = Ext.fly(target).getX(),
			baseY = Ext.fly(target).getY();
		c.el.setX(baseX + c.el.getX());
		c.el.setY(baseY + c.el.getY());
	}
	
});
Ext.Container.LAYOUTS['tilegroup'] = Wlj.widgets.search.tile.TileLayout;

Wlj.widgets.search.tile.GroupDropZone = Ext.extend(Ext.dd.DropTarget,{
	constructor : function(group, cfg){
		this.group = group;
		Ext.dd.ScrollManager.register(group.body);
		Wlj.widgets.search.tile.GroupDropZone.superclass.constructor.call(this,group.body.dom, cfg);
		group.el.ddScrollConfig =  this.ddScrollConfig;
	},
	createEvent : function(dd,e,data,col,c, pos){
		return {
			group : this.group,
			panel : data.panel,
			columnIndex: col,
			column: c,
			position: pos,
			data: data,
			source: dd,
			rawEvent: e,
			status: this.dropAllowed
		};
	},
	notifyEnter : function(ddSource, e, data){
		this.group.el.applyStyles({
			border : '1px #d3dbea dashed'
		});
	},
	notifyOut : function(ddSource, e, data){
		this.group.el.applyStyles({
			border : '1px transparent dashed'
		});
	},
	notifyDrop : function(ddSource, e, data){
		var tile = ddSource.tile;
		var menu = ddSource.menu;
		var plugin = ddSource.plugin;
		var ghost = ddSource.proxy.ghost;
		if(tile){
			if(tile.ownerCt !==this.group){
				tile.ownerCt.remove(tile,false);
				tile.el.setLeft(16);
				tile.el.setTop(16);
				tile.pos_size.TX=0;
				tile.pos_size.TY=0;
				this.group.add(tile);
				this.group.doLayout();
			}
			var influenced = tile.moveTo(ghost.getXY());
		}else if(menu){
			var group = this.group.ownerCt.items.indexOf(this.group);
			var appObject =  this.group.appObject;
			var _x = ghost.getXY()[0] - this.group.el.getX(),
			_y = ghost.getXY()[1] - this.group.el.getY();
			var pos = {};
			pos.POS_X = Math.floor(_x/128);
			pos.POS_Y = Math.floor(_y/128);
			appObject.createTile(appObject.createTileCfg(menu,pos),group);
			appObject.tileContainer.doLayout();
		}else if(plugin){
			var group = this.group.ownerCt.items.indexOf(this.group);
			var appObject =  this.group.appObject;
			var _x = ghost.getXY()[0] - this.group.el.getX(),
				_y = ghost.getXY()[1] - this.group.el.getY();
			var pos = {};
			pos.POS_X = Math.floor(_x/128);
			pos.POS_Y = Math.floor(_y/128);
			appObject.createTile(plugin.createTileCfg(pos),group);
			appObject.tileContainer.doLayout();
		}
	}
});


/*****************************Tile object class , to be fixed!since 2013-9-29*******************************/
Wlj.widgets.search.tile.Tile = Ext.extend(Ext.Container, {
	
	animate : false,
	jsUrl : false,
	
	dragable : true,
	ddInitType : 'render',//mousedown
	removeable : true,
	
	
	enforceHeight : true,
	enforceWidth : true,
	
	position : 'absolute',
	float : false,
	
	insertProxy : false,
	
	ownerW : 6,
	ownerH : 3,
	
	ownerWI : 0,
	ownerHI : 0,
	
	baseSize : 128,
	baseWidth : false,
	baseHeight : false,
	
	baseMargin : 4,
	
	defaultDDGroup : 'tileDrop',
	
	tileManaged : true,
	
	tileSize : false,
	tileName : false,
	tileLogo : false,

	autoEl : {
		tag : 'div',
		cls : '',
		style:{
			position:'absolute'
		}
	},
	layoutTpl : new Ext.XTemplate('<div style="overflow-x:hidden;overflow-y:hidden; position: relative;"></div>'),
	toolTemplate : new Ext.Template(
            '<div style="position:absolute;top:0;right:0; " class="x-tool x-tool-{id}">&#160;</div>'),
    logoTemplate : new Ext.XTemplate(
    		'<div class=tile_fun >',
    			'<a href=javascript:void(0); >',
    			'<div class="tile_fun_pic {tileLogo}">',
//    				'<img width=60 height=60 src={tileLogo} complete=complete />',
    			'</div>',
    			'<div class=tile_fun_name >',
    				'<p title={tileName} >',
    					'<i>',
    						'{tileName}',
    					'</i>',
    				'</p>',
    			'</div>',
    			'</a>',
    		'</div>'
    ),
	pos_size : {
		TW : 1 ,
		TH : 1 ,
		TX : 0 ,
		TY : 0 
	},
	initPostKey : function(){
		this.posKey = [];
		for(var x=0;x< this.pos_size.TW;x++){
			for(var y=0;y< this.pos_size.TH;y++){
				var pKey = {};
				this.posKey.push({
					x : this.pos_size.TX + x,
					y : this.pos_size.TY + y
				});
			}
		}
	},
	
	initComponent : function(){
		if(this.float){
			if(!this.style){
				this.style = {};
			}
			this.style.float = this.float;
			this.style.position = 'relative';
			this.style.margin = this.baseMargin + 'px';
		}
		Wlj.widgets.search.tile.Tile.superclass.initComponent.call(this);
		this.baseWidth = this.baseWidth ? this.baseWidth : this.baseSize;
		this.baseHeight = this.baseHeight ? this.baseHeight : this.baseSize;
		this.addEvents('beforeberemoved','beremoved');
	},
	
	onRender : function(ct,position){
		Wlj.widgets.search.tile.Tile.superclass.onRender.call(this,ct,position);
		var _this = this;
		if(!this.float){
			this.buildTilePosition();
		}
		this.buildTileSize();
		this.animate = new Wlj.widgets.search.tile.Tile.Animate(this);
		this.JsLoader = Ext.ScriptLoader;
		this.initPostKey();
		this.layoutEl = this.layoutTpl.append(this.el);
		if(this.dragable && this.ddInitType === 'render'){
			this.dd = new Wlj.widgets.search.tile.Tile.DD(this, {
				ddGroup: this.defaultDDGroup,
				insertProxy : this.insertProxy
			});
		}
	},
	afterRender : function(){
		Wlj.widgets.search.tile.Tile.superclass.afterRender.call(this);
		var _this = this;
		this.el.on('mousedown', function(e,t,o){
			if(_this.dragable && !_this.dd){
				_this.dd = new Wlj.widgets.search.tile.Tile.DD(_this, {
					ddGroup: _this.defaultDDGroup,
					insertProxy : _this.insertProxy
				});
				_this.dd.handleMouseDown(e,_this.dd);
			}
		});
		if(!this.tileSize){
			if(this.tileLogo){
				this.logo = this.logoTemplate.append(this.getLayoutTarget(),{
					tileLogo : this.tileLogo,
					tileName : this.tileName
				});
				Ext.fly(this.logo).on('click',function(){
					_this.clickFire();
				});
			}
		}
		if(this.tileManaged){
			Wlj.TileMgr.addTile(this);
		}
		var _this = this;
		if(this.removeable){
			var overCls = 'x-tool-unpin';
			var t = this.toolTemplate.insertFirst(this.el,{id:'pin'});
			/***************TO FIX**********/
			t.style.zIndex = 15000;
			Ext.fly(t).addClassOnOver(overCls);
			Ext.fly(t).animate({
				opacity : {to:0,from:1}
			},1);
			Ext.fly(t).on('mouseover',function(e,t,o){
				e.stopEvent();
				Ext.fly(t).animate({
					opacity : {to:1,from:0}
				},1);
			}) ;
			Ext.fly(t).on('mouseout',function(e,t,o){
				e.stopEvent();
				Ext.fly(t).animate({
					opacity : {to:0,from:1}
				},1);
			}) ;
			Ext.fly(t).on('click',function(e,t,o){
				e.stopEvent();
				_this.removeThis();
			});
			_this.removeTool = t;
		}
	},
	moveTo : function(posXY,callback){
		var tile = this;
		var pos = tile.getXYOrder(posXY);
		var influnceTils = this.ownerCt.getRegedTiles(this.posKey);
		tile.moveToPoint(pos);
		this.initPostKey();
	},
	moveToPoint : function(pos,callback){
		
		var tile = this;
		var posLast = tile.initPosition();
		
		tile.pos_size.TX = pos.x ;
		tile.pos_size.TY = pos.y ;
		
		tile.fixPos();
		
		var posNow =  tile.initPosition();
		
		var interX = posNow.x-posLast.x;
		var interY = posNow.y-posLast.y;
		
		this.animate.moveWithRaletive(interX, interY,callback);
		
	},
	forcedMove : function(){
	},
	getXYOrder : function(xy){
		var _x = xy[0] - this.ownerCt.el.getX(),
			_y = xy[1] - this.ownerCt.el.getY();
		var pos = {};
		pos.x = Math.floor(_x/this.baseWidth);
		pos.y = Math.floor(_y/this.baseHeight);
		return pos;
	},
	buildTilePosition : function(){
		this.el.setPositioning({'position':this.position});
		this.fixPos();
		this.el.setLeft(this.initPosition().x );
		this.el.setTop(this.initPosition().y);
//		this.el.setLocation(this.initPosition().x + this.ownerCt.el.getX(),this.initPosition().y+this.ownerCt.el.getY(),true);
	},
	buildTileSize : function(){
		if(this.enforceHeight)
			this.el.dom.style.height = this.getSize().height+"px";
		if(this.enforceWidth)
			this.el.dom.style.width = this.getSize().width+"px";
	},
	getSize : function(){
		var TW = this.pos_size.TW;
		var TH = this.pos_size.TH;
		
		return {
			width : TW*this.baseWidth+(this.baseMargin*2)*(TW-1),
			height : TH*this.baseHeight+(this.baseMargin*2)*(TH-1)
 		};
	},
	setSize : function(pos){
		if(!pos)
			return;
		if(!pos.width && !pos.height)
			return;
		if(!Ext.isNumber(pos.width) && !Ext.isNumber(pos.height))
			return;
		if(Ext.isNumber(pos.width)){
			this.pos_size.TW = pos.width;
		}
		if(Ext.isNumber(pos.height)){
			this.pos_size.TH = pos.height;
		}
		/**
		 * TODO fix the tile size;
		 */
		this.buildTileSize();
	},
	
	initPosition : function(){
		var TX = this.pos_size.TX;
		var TY = this.pos_size.TY;
		return {
			x : TX * this.baseWidth + (TX + 2)*(this.baseMargin*2) ,
			y : TY * this.baseHeight + (TY + 2)*(this.baseMargin*2)
		};
	},
	setPosition : function(size){
		
		var posLast = this.initPosition();
		
		if(!size){
			return;
		}
		if(!size.x && !size.y){
			return;
		}
		if(!Ext.isNumber(size.x) && !Ext.isNumber(size.y)){
			return;
		}
		if(Ext.isNumber(size.x)){
			this.pos_size.TX = size.x;
		}
		if(Ext.isNumber(size.y)){
			this.pos_size.TY = size.y;
		}
		
		var posNow = this.initPosition();
		
		this.el.moveTo(posNow.x-posLast.x , posNow.y-posLast.y ,true);		
		/***
		 * TODO fix the tile position;
		 */
		//this.buildTilePosition();
	},
	fixPos :function(){
		var tile = this;
		var ownerWI = this.ownerWI;
		var ownerHI = this.ownerHI;
		
		if(tile.pos_size.TX < ownerWI){
			tile.pos_size.TX = ownerWI;
		}
		if(tile.pos_size.TY < ownerHI){
			tile.pos_size.TY = ownerHI;
		}
		
		if(tile.pos_size.TY + tile.pos_size.TH > tile.ownerH){
			tile.pos_size.TY = tile.ownerH - tile.pos_size.TH;
		}
		
		if(tile.pos_size.TX + tile.pos_size.TW > tile.ownerW){
			tile.pos_size.TX = tile.ownerW - tile.pos_size.TW;
		}
	},
	createGhost : function(cls, useShim, appendTo){
		var el = document.createElement('div');
		el.className = 'x-panel-ghost ' + (cls ? cls : '');
		if(this.header){
			el.appendChild(this.el.dom.firstChild.cloneNode(true));
		}
		Ext.fly(el.appendChild(document.createElement('ul'))).setHeight(this.getSize().height);
		el.style.width = this.el.dom.offsetWidth + 'px';
		if(!appendTo){
			this.container.dom.appendChild(el);
		}else{
			Ext.getDom(appendTo).appendChild(el);
		}
		if(useShim !== false && this.el.shim !== false){
			var layer = new Ext.Layer({shadow:false, useDisplay:true, constrain:false}, el);
			layer.show();
			return layer;
		}else{
			return new Ext.Element(el);
		}
	},
	removeThis : function(){
		var _this = this;
		try{
			_this.animate.fadeOut();
			setTimeout(function(){
				if(_this.ownerCt){
					_this.ownerCt.remove(_this,true);
				}else{
					_this.destroy();
				}
			},1000);
		}catch(e){
		}
	},
	clickFire : function(){
		var _this = this;
		if(!_this.menuData){
			return;
		}
		if(!_this.menuData.ACTION || _this.menuData.ACTION == '0'){
			return;
		}
		Wlj.ServiceMgr.findServiceByID(this.menuData.ID).execute();
	},
	getLayoutTarget : function(){
		return this.layoutEl;
	},
	destroy : function(){
		if(this.dd){
			this.dd.destroy();
		}
		if(this.animate)
			Ext.destroy(this.animate);
		this.removeAll();
		this.purgeListeners();
		this.el.removeAllListeners();
		Ext.fly(this.layoutEl).remove();
		if(this.logo){
			Ext.fly(this.logo).removeAllListeners();			
			Ext.fly(this.logo).remove();
		}
		if(this.removeTool){
			Ext.fly(this.removeTool).removeAllListeners();			
			Ext.fly(this.removeTool).remove();
		}
		if(this.tileManaged){
			/**
			 * TODO remove from tile manager;
			 */
		}
		Wlj.widgets.search.tile.Tile.superclass.destroy.call(this);
	}
});
Ext.reg('tile', Wlj.widgets.search.tile.Tile);

Wlj.widgets.search.tile.NegaLayout = Ext.extend(Ext.layout.CardLayout,{
	
	renderHidden : false,
    setActiveItem : function(item){
        var ai = this.activeItem,
            ct = this.container;
        item = ct.getComponent(item);
        if(item && ai != item){
            this.activeItem = item;
            delete item.deferLayout;
            Ext.fly(ct.layoutEl).scrollTo('top', ct.items.indexOf(item)*ct.el.getHeight() , true);
            item.fireEvent('activate', item);
        }
    },
    configureItem : function(c){
    	if(c && this.container.el.getHeight() > 0){
            c.setSize(this.container.el.getViewSize());
        }
    },
	getLayoutTargetSize : function(){
		return this.container.el.getViewSize();
	}
});
Ext.Container.LAYOUTS['nega'] = Wlj.widgets.search.tile.NegaLayout;

Wlj.widgets.search.tile.NegativeTile = Ext.extend(Wlj.widgets.search.tile.Tile, {
	negativeConfig : false,
	layout : 'nega',
	interval : 1000,
	intervalId : false,
	initComponent : function(){
		Wlj.widgets.search.tile.NegativeTile.superclass.initComponent.call(this);
		this.on('afterlayout', this.reRunInterval);
	},
	onRender : function(ct, position){
		Wlj.widgets.search.tile.NegativeTile.superclass.onRender.call(this, ct, position);
	},
	afterRender : function(){
		Wlj.widgets.search.tile.NegativeTile.superclass.afterRender.call(this);
		this.layout.setActiveItem(0);
		this.el.on('mouseover', this.clearInterval.createDelegate(this));
		this.el.on('mouseout', this.reRunInterval.createDelegate(this));
	},
	scrollToNext : function(){
		var count = this.items.getCount();
		var index = this.items.indexOf(this.layout.activeItem);
		if(index < count-1){
			index ++;
		}else{
			index = 0;
		}
		this.layout.setActiveItem(index);
	},
	clearInterval : function(){
		clearInterval(this.intervalId);
		this.intervalId = false;
	},
	setInterval : function(){
		var interval = this.interval;
		var _this = this;
		if(this.items.getCount()>1){
			_this.intervalId = setInterval(function(){
				_this.scrollToNext();
			}, interval);
		}
	},
	reRunInterval : function(){
		var _this = this;
		if(_this.intervalId !== false){
			_this.clearInterval();
		}
		_this.setInterval();
	}
});
Ext.reg('negatile', Wlj.widgets.search.tile.NegativeTile);

Wlj.widgets.search.tile.ResizeTile = Ext.extend(Wlj.widgets.search.tile.NegativeTile,{
	enableResize : true,
	afterRender : function(){
		Wlj.widgets.search.tile.ResizeTile.superclass.afterRender.call(this);
		if(this.enableResize){
			this.createResizable();
		}
	},
	createResizable : function(){
		this.RESIZEABLE = new Wlj.widgets.search.tile.ResizeTile.Resizeable(this.el, {});
		this.RESIZEABLE.on('resize',this.onresize.createDelegate(this));
	},
	onresize : function(res, width, height, e){
	}
});
Ext.reg('resizetile', Wlj.widgets.search.tile.ResizeTile);

Wlj.widgets.search.tile.ResizeTile.Resizeable = Ext.extend(Ext.Resizable, {
	constructor : function(el, config){
		Wlj.widgets.search.tile.ResizeTile.Resizeable.superclass.constructor.call(this, el, config);
	},
	handles: 'se',
	preserveRatio: true,
	minWidth: 50,
	minHeight : 50,
	dynamic: true
});

Wlj.widgets.search.tile.IndexTile = Ext.extend(Wlj.widgets.search.tile.ResizeTile,{
	enableResize : false,
	enableTransSize : true,
	resizeTemplate : new Ext.Template(
    '<div style="position:absolute;bottom:0;right:0; " class="x-tool x-tool-{id}">&#160;</div>'),
    initComponent : function(){
		Wlj.widgets.search.tile.IndexTile.superclass.initComponent.call(this);
		var size = this.appObject.translateSize(this.tileSize);
		if(size.TH == undefined || size.TW == undefined || (size.TW==1&&size.TH==1)){
			this.jsUrl = false;
			this.tileSize = false;
		}
	},
	afterRender : function(){
		Ext.fly(this.layoutEl).setSize(this.el.getViewSize());
		Wlj.widgets.search.tile.IndexTile.superclass.afterRender.call(this);
		if(Ext.isEmpty(this.menuData.SUPPORT_SIZE_URL)){
			this.enableTransSize = false;
		}
		var _this = this;
		if(this.enableTransSize){
			this.supported = Ext.unzipString(this.menuData.SUPPORT_SIZE_URL,',','|');
			var t = this.resizeTemplate.insertFirst(this.el,{id:'refresh'});
			t.style.zIndex = 15000;
			Ext.fly(t).animate({
				opacity : {to:0,from:1}
			},1);
			Ext.fly(t).on('mouseover',function(e,t,o){
				e.stopEvent();
				Ext.fly(t).animate({
					opacity : {to:1,from:0}
				},1);
			}) ;
			Ext.fly(t).on('mouseout',function(e,t,o){
				e.stopEvent();
				Ext.fly(t).animate({
					opacity : {to:0,from:1}
				},1);
			}) ;
			Ext.fly(t).on('click',function(e,t,o){
				e.stopEvent();
				_this.resize();
			});
		}
		this.el.on('contextmenu', function(eve){
			eve.stopEvent();
			_this.onContextMenu(eve, []);
		});
	},
	resize : function(){
		var sizeIndex = -1;
		for(var i=0;i<this.supported.length;i++){
			if(this.supported[i][0] === this.tileSize){
				sizeIndex = i;
			}
		}
		var nextSize = false;
		var jsUrl = false;
		if(sizeIndex < this.supported.length-1){
			nextSize = this.supported[sizeIndex+1][0];
			jsUrl = this.supported[sizeIndex+1][1];
		}
		this.tileSize = nextSize;
		var sizeRe = this.appObject.translateSize(nextSize);
		this.pos_size.TW = sizeRe.TW;
		this.pos_size.TH = sizeRe.TH;
		this.jsUrl = jsUrl;
		this.reBuiltTile();
	},
	reBuiltTile : function(){
		delete this.contentObject;
		this.clearTileContent();
		this.buildTileSize();
		Ext.fly(this.getLayoutTarget()).applyStyles({
			height : this.el.getHeight(),
			width : this.el.getWidth()
		});
		if(!this.tileSize){
			if(this.tileLogo){
				var logo = this.logoTemplate.append(this.getLayoutTarget(),{
					tileLogo : this.tileLogo,
					tileName : this.tileName
				});
				Ext.fly(logo).on('click',function(){
					_this.clickFire();
				});
			}
		}
		Wlj.TileMgr.tiles.remove(this);
		Wlj.TileMgr.addTile(this);
	},
	clearTileContent : function(){
		this.removeAll();
		this.doLayout();
		this.getLayoutTarget().innerHTML = '';
	},
	onContextMenu : function(e, added){
		var indextilemenu = Wlj.search.App.CONTEXT_MENU.INDEX_TILE;
		if(added.length>0&&indextilemenu.length>0){
			added.push('-');
		}
		var _this = this;
		if(indextilemenu.length>0){
			Ext.each(indextilemenu, function(itm){
				itm.handler = itm.fn.createDelegate(_this);
				added.push(itm);
			});
		}
		this.ownerCt.onContextMenu(e, added);
	}
});
Ext.reg('indextile', Wlj.widgets.search.tile.IndexTile);


Wlj.widgets.search.tile.EditTile = Ext.extend(Wlj.widgets.search.tile.Tile,{
	tileManaged : false,
	tileLogo : false,
	baseSize : 300,
	hideLabel : true,
	innerTextTpl : new Ext.XTemplate('<div>{valueText}</div>'),
	initComponent : function(){
		Wlj.widgets.search.tile.EditTile.superclass.initComponent.call(this);
		delete this.html;
		var _this = this;
		this.contentArea = new Ext.form.TextArea({
			preventScrollbars : false,
			width:this.baseSize*this.pos_size.TW,
			height:this.baseSize*this.pos_size.TH,
			listeners : {
				blur:function(area){
					area.hide();
					_this.onAreaBlur(area);
				}
			}
		});
	},
	onRender : function(ct, position){
		Wlj.widgets.search.tile.EditTile.superclass.onRender.call(this, ct, position);
		this.contentArea.render(this.el);
		this.contentArea.hide();
		var _this = this;
		this.el.on('dblclick', function(){
			_this.contentArea.show();
			_this.contentArea.focus();
			_this.contentArea.setValue(this.valueText);
		});
		this.on('resize', this.onresize);
	},
	onresize : function(tile, aw, ah, rw, rh){
		this.contentArea.setHeight(ah);
		this.contentArea.setWidth(aw);
	},
	onAreaBlur : function(area){
		this.valueText = area.getValue();
		if(this.innerHtml)
			Ext.fly(this.innerHtml).remove();
		delete this.innerHtml;
		this.innerHtml = this.innerTextTpl.append(this.el, {
			valueText : this.valueText
		});
	}
});

Wlj.widgets.search.tile.TileProxy = Ext.extend(Object, {
	
	constructor : function(tile, config){
    	this.tile = tile;
    	this.id = this.tile.id +'-ddproxy';
    	Ext.apply(this, config);        
	},
	/**
	 * true:拖动的时候在容器内插入代理的节点；false：不插入。
	 */
	insertProxy : false,
    setStatus : Ext.emptyFn,
    reset : Ext.emptyFn,
    update : Ext.emptyFn,
    stop : Ext.emptyFn,
    sync: Ext.emptyFn,
    
    getEl :  function(){
		return this.ghost;
	},
	getGhost : function(){
		return this.ghost;
	},
	getProxy : function(){
		return this.proxy;
	},
	hide : function(){
		if(this.ghost){
			if(this.proxy){
				this.proxy.remove();
				delete this.proxy;
			}
			this.tile.el.dom.style.display = '';
			this.ghost.remove();
			delete this.ghost;
		}
	},
	show : function(){
		if(!this.ghost){
			this.ghost = this.tile.createGhost(this.tile.initialConfig.cls, undefined, Ext.getBody());
			this.ghost.setXY(this.tile.el.getXY());
			if(this.insertProxy){
				this.proxy = this.tile.el.insertSibling({cls:'tile'});
				this.proxy.setSize(this.tile.getSize());
			}
			this.tile.el.dom.style.display = 'none';
		}
	},
	repair : function(xy, callback, scope){
		this.hide();
		if(typeof callback == 'function'){
			callback.call(scope || this);
		}
	},
	moveProxy : function(parentNode, before){
		if(this.proxy){
			parentNode.insertBefore(this.proxy.dom, before);
		}
	}
});

Wlj.widgets.search.tile.Tile.DD = Ext.extend(Ext.dd.DragSource, {
	constructor : function(tile, cfg){
		this.tile = tile;
		this.dragData = {tile : tile};
		this.proxy = new Wlj.widgets.search.tile.TileProxy(tile, cfg);
		Wlj.widgets.search.tile.Tile.DD.superclass.constructor.call(this, tile.el, cfg);
		var h = tile.header,
			el = tile.el;
		if(h){
			this.setHandleElId(h.id);
			el = tile.header;
		}
		this.scroll = false;
	},
	showFrame: Ext.emptyFn,
    startDrag: Ext.emptyFn,
    b4StartDrag : function(x, y){
		this.proxy.show();
	},
	b4MouseDown : function(e){
		var x = e.getPageX(),
			y = e.getPageY();
		this.autoOffset(x, y);
	},
	onInitDrag : function(x, y){
		this.onStartDrag(x, y);
		return true;
	},
	createFrame : Ext.emptyFn,
	getDragEl : function(e){
		return this.proxy.ghost.dom;
	},
	endDrag : function(e){
		this.proxy.hide();
		this.tile.saveState();
	},
	autoOffset : function(x, y){
		x -= this.startPageX;
		y -= this.startPageY;
		this.setDelta(x, y);
	},
	onDrag : function(e){
	}
});


Wlj.widgets.search.tile.Tile.Animate = function(tile){
	this.tile = tile;
	this.el = tile.el;
	
	Wlj.widgets.search.tile.Tile.Animate.superclass.constructor.call(this);
};

Ext.extend(Wlj.widgets.search.tile.Tile.Animate, Ext.util.Observable, {
	
	defaultAnim : {
		duration : 300
	},
	
	fadeIn : function(dua){
		this.el.fadeIn(300);
	},
	fadeOut : function(dua){
		this.el.fadeOut(300);
	},
	moveWithRaletive : function(x,y ,callback){
		if(!this.el.dom){
			return;
		}
		var start = new Date(),
			duration = this.defaultAnim.duration,
			_this = this,
			finalLocation = _this.tile.initPosition(),
			startLocation = {
				x : parseInt(_this.el.dom.style.left),
				y : parseInt(_this.el.dom.style.top)
			};
		function doAnimate(){
			var current = new Date();
			var elapsed = current - start;
			var fraction = elapsed/duration;
			
			if(fraction >= 1){
				if(_this.el.dom){
					_this.el.applyStyles({
						top : finalLocation.y + 'px',
						left : finalLocation.x + 'px'
					});
				}
				 Ext.TaskMgr.stop(task);
				 if(Ext.isFunction(callback)){
					 try{
						 callback(_this.tile);
					 }catch(e){}
				 }
			}else{
				var currentTop = fraction * y,
					currentLeft = fraction * x;
				if(_this.el.dom){
					_this.el.applyStyles({
						top : currentTop + startLocation.y + 'px',
						left :  currentLeft + startLocation.x + 'px'
					});
				}else{
					Ext.TaskMgr.stop(task);
					 if(Ext.isFunction(callback)){
						 try{
							 callback(_this.tile);
						 }catch(e){}
					 }
				}
			}
			
		}
		
		var task = {
			run     : doAnimate,
			interval: 20,
			scope   : this
		};
		
		Ext.TaskMgr.start(task);
		
	},
	moveWithAbsolute : function(x,y){
		
		var startLeft = this.el.getLeft();
		var startTop = this.el.getTop();
		
		this.moveWithRaletive(x-startLeft,y-startTop);
		
	},
	moveWithMargin : function(x,y){
		
	}
});
Ext.ns('Wlj.error');
Wlj.error.debugerConfig = {
        
                                        
	consoleInPage : !!Wlj.frame.functions.app.Util.needConsoleInPage,//是否调用页面内部日志组件显示日志
	consoleInNavigator : !!Wlj.frame.functions.app.Util.needConsoleInNavigator,//是否调用浏览器控制台显示日志
		
	ERROR : !!Wlj.frame.functions.app.Util.needError,  
	WARN :  !!Wlj.frame.functions.app.Util.needWarn,   
	INFO :  !!Wlj.frame.functions.app.Util.needInfo,   
	DEBUG : !!Wlj.frame.functions.app.Util.needDebug,  
	logLineLimit : 100,
	initLogTool : function(){
		if(!Wlj.error.debugerConfig.ERROR){
			Ext.error = Ext.emptyFn;
		}
		if(!Wlj.error.debugerConfig.WARN){
			Ext.warn = Ext.emptyFn;
		}
		if(!Wlj.error.debugerConfig.INFO){
			Ext.log = Ext.emptyFn;
		}
		if(!Wlj.error.debugerConfig.DEBUG){
			Ext.debug = Ext.emptyFn;
		}
	}
};

JDEBUG = Wlj.error.debugerConfig;
Wlj.error.J_ERRORS = {
	J_NEVERDEFINE : '变量未定义'
		
		/**
		 * 1. EvalError：eval_r()的使用与定义不一致 
2. RangeError：数值越界 
3. ReferenceError：非法或不能识别的引用数值 
4. SyntaxError：发生语法解析错误 
5. TypeError：操作数类型错误 
6. URIError：URI处理函数使用不当
		 */
		
		
};
JERROR = Wlj.error.J_ERRORS;
Wlj.error.W_ERRORS = {
	NORESIDERROR : '无resId属性',
	NOCODEFILEERROR : '无页面文件'
};
WERROR = Wlj.error.W_ERRORS;/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.debugImg = {
  	warnImg : basepath + '/contents/wljFrontFrame/styles/common/commonpics/warn.gif',
	errorImg : basepath + '/contents/wljFrontFrame/styles/common/commonpics/error.gif',
//	infoImg : basepath + '/contents/wljFrontFrame/styles/common/commonpics/info.gif',
	debugImg : basepath + '/contents/wljFrontFrame/styles/common/commonpics/info.png'
};
(function(){

var cp;

function createConsole(){
//    var tree = new Ext.debug.DomTree();
//    var compInspector = new Ext.debug.ComponentInspector();
//    var compInfoPanel = new Ext.debug.ComponentInfoPanel();
//    var storeInspector = new Ext.debug.StoreInspector();
//    var objInspector = new Ext.debug.ObjectInspector();
	var scriptPanel = new Ext.debug.ScriptsPanel();
	var logView = new Ext.debug.LogPanel();
    var tabs = new Ext.TabPanel({
        activeTab: 0,
        border: false,
        tabPosition: 'bottom',
        items: [{
            title: 'Debug Console',
            layout:'border',
            items: [logView, scriptPanel]
        }
//        ,{
//            title: 'HTML Inspector',
//            layout:'border',
//            items: [tree]
//        },{
//            title: 'Component Inspector',
//            layout: 'border',
//            items: [compInspector,compInfoPanel]
//        },{
//            title: 'Object Inspector',
//            layout: 'border',
//            items: [objInspector]
//        },{
//            title: 'Data Stores',
//            layout: 'border',
//            items: [storeInspector]
//        }
        ]
    });

    cp = new Ext.Panel({
        id: 'x-debug-browser',
        title: 'Console',
        collapsible: true,
        animCollapse: false,
        style: 'position:absolute;left:0;bottom:0;z-index:101',
        height:200,
        logView: logView,
        scriptPanel : scriptPanel,
        layout: 'fit',
        tbar : [{
        	text : 'clear',
        	handler : function(){
        		Ext.clearLog();
        	}
        }],
        tools:[{
        	id : 'maximize',
        	handler : function(){
        		cp.expand();
        		cp.setHeight(Ext.getBody().getViewSize().height);
        		cp.getTool('maximize').hide();
        		cp.getTool('minimize').show();
        	}
        },{
        	id : 'minimize',
        	hidden : true,
        	handler : function(){
        		cp.expand();
        		cp.setHeight(200);
        		cp.getTool('maximize').show();
        		cp.getTool('minimize').hide();
        	}
        },{
            id: 'close',
            handler: function(){
                cp.destroy();
                cp = null;
                Ext.EventManager.removeResizeListener(handleResize);
            }
        }],

        items: tabs
    });
    cp.render(Ext.getBody());

    cp.resizer = new Ext.Resizable(cp.el, {
        minHeight:50,
        handles: "n",
        pinned: true,
        transparent:true,
        resizeElement : function(){
            var box = this.proxy.getBox();
            this.proxy.hide();
            cp.setHeight(box.height);
            return box;
        }
    });

//     function handleResize(){
//         cp.setWidth(Ext.getBody().getViewSize().width);
//     }
//     Ext.EventManager.onWindowResize(handleResize);
//
//     handleResize();

    function handleResize(){
        var b = Ext.getBody();
        var size = b.getViewSize();
        if(size.height < b.dom.scrollHeight) {
            size.width -= 18;
        }
        cp.setWidth(size.width);
    }
    Ext.EventManager.onWindowResize(handleResize);
    handleResize();
}


Ext.apply(Ext, {
    log : function(){
		if(Wlj.error.debugerConfig.consoleInPage){
			if(!cp){
				createConsole();
			}
			cp.logView.log.apply(cp.logView,arguments);
		}
		if(Wlj.error.debugerConfig.consoleInNavigator && window.console){
			console.info(Array.prototype.join.call(arguments, ', '));
		}
    },
    warn : function(){
    	if(Wlj.error.debugerConfig.consoleInPage){
    		if(!cp){
            	createConsole();
        	}
        	cp.logView.warn.apply(cp.logView, arguments);
    	}
    	if(Wlj.error.debugerConfig.consoleInNavigator && window.console){
    		console.warn(Array.prototype.join.call(arguments, ', '));
    	}
    },
    error : function(){
    	if(Wlj.error.debugerConfig.consoleInPage){
    		if(!cp){
    			createConsole();
    		}
    		cp.logView.error.apply(cp.logView, arguments);
    	}
    	if(Wlj.error.debugerConfig.consoleInNavigator && window.console){
    		console.error(Array.prototype.join.call(arguments, ', '));
    	}
    },
    debug : function(SO){
    	if(Wlj.error.debugerConfig.consoleInPage){
    		if(!cp){
    			createConsole();
    		}
    		cp.logView.debug.apply(cp.logView, [SO]);
    	}
    	if(Wlj.error.debugerConfig.consoleInNavigator && window.console){
    		var Str = Ext.isObject(SO) ? Ext.encode(SO) : SO;
    		console.log(Str);
    	}
    },
    showCode : function(code){
    	if(!cp){
			createConsole();
		}
    	cp.scriptPanel.scriptField.setValue(code);
    },
    clearLog : function(){
    	if(cp){
    		cp.logView.clear();
    	}
    },
    
    logf : function(format, arg1, arg2, etc){
        Ext.log(String.format.apply(String, arguments));
    },

    dump : function(o){
        if(typeof o == 'string' || typeof o == 'number' || typeof o == 'undefined' || Ext.isDate(o)){
            Ext.log(o);
        }else if(!o){
            Ext.log("null");
        }else if(typeof o != "object"){
            Ext.log('Unknown return type');
        }else if(Ext.isArray(o)){
            Ext.log('['+o.join(',')+']');
        }else{
            var b = ["{\n"];
            for(var key in o){
                var to = typeof o[key];
                if(to != "function" && to != "object"){
                    b.push(String.format("  {0}: {1},\n", key, o[key]));
                }
            }
            var s = b.join("");
            if(s.length > 3){
                s = s.substr(0, s.length-2);
            }
            Ext.log(s + "\n}");
        }
    },

    _timers : {},

    time : function(name){
        name = name || "def";
        Ext._timers[name] = new Date().getTime();
    },

    timeEnd : function(name, printResults){
        var t = new Date().getTime();
        name = name || "def";
        var v = String.format("{0} ms", t-Ext._timers[name]);
        Ext._timers[name] = new Date().getTime();
        if(printResults !== false){
            Ext.log('Timer ' + (name == "def" ? v : name + ": " + v));
        }
        return v;
    }
});

	Wlj.error.debugerConfig.initLogTool();

})();


Ext.debug.ScriptsPanel = Ext.extend(Ext.Panel, {
    id:'x-debug-scripts',
    region: 'east',
    minWidth: 200,
    split: true,
    width: 350,
    border: false,
    layout:'anchor',
    style:'border-width:0 0 0 1px;',

    initComponent : function(){

        this.scriptField = new Ext.form.TextArea({
            anchor: '100% -26',
            style:'border-width:0;'
        });

        this.trapBox = new Ext.form.Checkbox({
            id: 'console-trap',
            boxLabel: 'Trap Errors',
            checked: true
        });

        this.toolbar = new Ext.Toolbar([{
                text: 'Run',
                scope: this,
                handler: this.evalScript
            },{
                text: 'Clear',
                scope: this,
                handler: this.clear
            },
            '->',
            this.trapBox,
            ' ', ' '
        ]);

        this.items = [this.toolbar, this.scriptField];

        Ext.debug.ScriptsPanel.superclass.initComponent.call(this);
    },

    evalScript : function(){
        var s = this.scriptField.getValue();
        if(this.trapBox.getValue()){
            try{
                var rt = eval(s);
                Ext.dump(rt === undefined? '(no return)' : rt);
            }catch(e){
                Ext.log(e.message || e.descript);
            }
        }else{
            var rt = eval(s);
            Ext.dump(rt === undefined? '(no return)' : rt);
        }
    },

    clear : function(){
        this.scriptField.setValue('');
        this.scriptField.focus();
    }

});

Ext.debug.LogPanel = Ext.extend(Ext.Panel, {
    autoScroll: true,
    region: 'center',
    border: false,
    style:'border-width:0 1px 0 0',

    log : function(){
        var markup = [  '<div style="padding:5px !important;border-bottom:1px solid #ccc;">','【Info】',
                    Ext.util.Format.htmlEncode(Array.prototype.join.call(arguments, ', ')).replace(/\n/g, '<br/>').replace(/\s/g, '&#160;'),
                    '</div>'].join(''),
            bd = this.body.dom;
        
        this.body.insertHtml('beforeend', markup);
        bd.scrollTop = bd.scrollHeight;
    },
    warn : function(){
        var markup = [  '<div style="padding:5px !important;border-bottom:1px solid #ccc;">','<img src='+Ext.debugImg.warnImg+' />',
                        Ext.util.Format.htmlEncode(Array.prototype.join.call(arguments, ', ')).replace(/\n/g, '<br/>').replace(/\s/g, '&#160;'),
                        '</div>'].join(''),
                bd = this.body.dom;
            this.body.insertHtml('beforeend', markup);
            bd.scrollTop = bd.scrollHeight;
    },
    error : function(){
    	var markup = [  '<div style="padding:5px !important;border-bottom:1px solid #ccc;">','<img src='+Ext.debugImg.errorImg+' />',
                        Ext.util.Format.htmlEncode(Array.prototype.join.call(arguments, ', ')).replace(/\n/g, '<br/>').replace(/\s/g, '&#160;'),
                        '</div>'].join(''),
                bd = this.body.dom;
            this.body.insertHtml('beforeend', markup);
            bd.scrollTop = bd.scrollHeight;
    },
    debug : function(SO){
    	
    	var Str = Ext.isObject(SO) ? Ext.encode(SO) : SO;
    	
    	var markup = [  '<div style="padding:5px !important;border-bottom:1px solid #ccc;">','<img src='+Ext.debugImg.debugImg+' />',
                       Str,
                        '</div>'].join(''),
                bd = this.body.dom;
            this.body.insertHtml('beforeend', markup);
            bd.scrollTop = bd.scrollHeight;
    },
    clear : function(){
        this.body.update('');
        this.body.dom.scrollTop = 0;
    }
});

Ext.debug.DomTree = Ext.extend(Ext.tree.TreePanel, {
    enableDD:false ,
    lines:false,
    rootVisible:false,
    animate:false,
    hlColor:'ffff9c',
    autoScroll: true,
    region:'center',
    border:false,

    initComponent : function(){


        Ext.debug.DomTree.superclass.initComponent.call(this);

        // tree related stuff
        var styles = false, hnode;
        var nonSpace = /^\s*$/;
        var html = Ext.util.Format.htmlEncode;
        var ellipsis = Ext.util.Format.ellipsis;
        var styleRe = /\s?([a-z\-]*)\:([^;]*)(?:[;\s\n\r]*)/gi;

        function findNode(n){
            if(!n || n.nodeType != 1 || n == document.body || n == document){
                return false;
            }
            var pn = [n], p = n;
            while((p = p.parentNode) && p.nodeType == 1 && p.tagName.toUpperCase() != 'HTML'){
                pn.unshift(p);
            }
            var cn = hnode;
            for(var i = 0, len = pn.length; i < len; i++){
                cn.expand();
                cn = cn.findChild('htmlNode', pn[i]);
                if(!cn){ // in this dialog?
                    return false;
                }
            }
            cn.select();
            var a = cn.ui.anchor;
            this.getTreeEl().dom.scrollTop = Math.max(0 ,a.offsetTop-10);
            //treeEl.dom.scrollLeft = Math.max(0 ,a.offsetLeft-10); no likey
            cn.highlight();
            return true;
        }

        function nodeTitle(n){
            var s = n.tagName;
            if(n.id){
                s += '#'+n.id;
            }else if(n.className){
                s += '.'+n.className;
            }
            return s;
        }

        /*
        function onNodeSelect(t, n, last){
            return;
            if(last && last.unframe){
                last.unframe();
            }
            var props = {};
            if(n && n.htmlNode){
                if(frameEl.pressed){
                    n.frame();
                }
                if(inspecting){
                    return;
                }
                addStyle.enable();
                reload.setDisabled(n.leaf);
                var dom = n.htmlNode;
                stylePanel.setTitle(nodeTitle(dom));
                if(styles && !showAll.pressed){
                    var s = dom.style ? dom.style.cssText : '';
                    if(s){
                        var m;
                        while ((m = styleRe.exec(s)) != null){
                            props[m[1].toLowerCase()] = m[2];
                        }
                    }
                }else if(styles){
                    var cl = Ext.debug.cssList;
                    var s = dom.style, fly = Ext.fly(dom);
                    if(s){
                        for(var i = 0, len = cl.length; i<len; i++){
                            var st = cl[i];
                            var v = s[st] || fly.getStyle(st);
                            if(v != undefined && v !== null && v !== ''){
                                props[st] = v;
                            }
                        }
                    }
                }else{
                    for(var a in dom){
                        var v = dom[a];
                        if((isNaN(a+10)) && v != undefined && v !== null && v !== '' && !(Ext.isGecko && a[0] == a[0].toUpperCase())){
                            props[a] = v;
                        }
                    }
                }
            }else{
                if(inspecting){
                    return;
                }
                addStyle.disable();
                reload.disabled();
            }
            stylesGrid.setSource(props);
            stylesGrid.treeNode = n;
            stylesGrid.view.fitColumns();
        }
        */

        this.loader = new Ext.tree.TreeLoader();
        this.loader.load = function(n, cb){
            var isBody = n.htmlNode == document.body;
            var cn = n.htmlNode.childNodes;
            for(var i = 0, c; c = cn[i]; i++){
                if(isBody && c.id == 'x-debug-browser'){
                    continue;
                }
                if(c.nodeType == 1){
                    n.appendChild(new Ext.debug.HtmlNode(c));
                }else if(c.nodeType == 3 && !nonSpace.test(c.nodeValue)){
                    n.appendChild(new Ext.tree.TreeNode({
                        text:'<em>' + ellipsis(html(String(c.nodeValue)), 35) + '</em>',
                        cls: 'x-tree-noicon'
                    }));
                }
            }
            cb();
        };

        //tree.getSelectionModel().on('selectionchange', onNodeSelect, null, {buffer:250});

        this.root = this.setRootNode(new Ext.tree.TreeNode('Ext'));

        hnode = this.root.appendChild(new Ext.debug.HtmlNode(
                document.getElementsByTagName('html')[0]
        ));

    }
});

Ext.debug.ComponentNodeUI = Ext.extend(Ext.tree.TreeNodeUI,{
    onOver : function(e){
        Ext.debug.ComponentNodeUI.superclass.onOver.call(this);
        var cmp = this.node.attributes.component;
        if (cmp.el && cmp.el.mask && cmp.id !='x-debug-browser') {
            try { // Oddly bombs on some elements in IE, gets any we care about though
                cmp.el.mask();
            } catch(e) {}
        }
    },

    onOut : function(e){
        Ext.debug.ComponentNodeUI.superclass.onOut.call(this);
        var cmp = this.node.attributes.component;
        if (cmp.el && cmp.el.unmask && cmp.id !='x-debug-browser') {
            try {
                cmp.el.unmask();
            } catch(e) {}
        }
    }
});

Ext.debug.ComponentInspector = Ext.extend(Ext.tree.TreePanel, {
    enableDD:false ,
    lines:false,
    rootVisible:false,
    animate:false,
    hlColor:'ffff9c',
    autoScroll: true,
    region:'center',
    border:false,

    initComponent : function(){
        this.loader = new Ext.tree.TreeLoader();
        this.bbar = new Ext.Toolbar([{
            text: 'Refresh',
            handler: this.refresh,
            scope: this
        }]);
        Ext.debug.ComponentInspector.superclass.initComponent.call(this);

        this.root = this.setRootNode(new Ext.tree.TreeNode({
            text: 'Ext Components',
            component: Ext.ComponentMgr.all,
            leaf: false
        }));
        this.parseRootNode();

        this.on('click', this.onClick, this);
    },

    createNode: function(n,c) {
        var leaf = (c.items && c.items.length > 0);
        return n.appendChild(new Ext.tree.TreeNode({
            text: c.id + (c.getXType() ? ' [ ' + c.getXType() + ' ]': '' ),
            component: c,
            uiProvider:Ext.debug.ComponentNodeUI,
            leaf: !leaf
        }));
    },

    parseChildItems: function(n) {
        var cn = n.attributes.component.items;
        if (cn) {
            for (var i = 0;i < cn.length; i++) {
                var c = cn.get(i);
                if (c.id != this.id && c.id != this.bottomToolbar.id) {
                    var newNode = this.createNode(n,c);
                    if (!newNode.leaf) {
                        this.parseChildItems(newNode);
                    }
                }
            }
        }
    },

    parseRootNode: function() {
        var n = this.root;
        var cn = n.attributes.component.items;
        for (var i = 0,c;c = cn[i];i++) {
            if (c.id != this.id && c.id != this.bottomToolbar.id) {
                if (!c.ownerCt) {
                    var newNode = this.createNode(n,c);
                    if (!newNode.leaf) {
                        this.parseChildItems(newNode);
                    }
                }
            }
        }
    },

    onClick: function(node, e) {
        var oi = Ext.getCmp('x-debug-objinspector');
        oi.refreshNodes(node.attributes.component);
        oi.ownerCt.show();
    },

    refresh: function() {
        while (this.root.firstChild) {
            this.root.removeChild(this.root.firstChild);
        }
        this.parseRootNode();
        var ci = Ext.getCmp('x-debug-compinfo');
        if (ci) {
            ci.message('refreshed component tree - '+Ext.ComponentMgr.all.length);
        }
    }
});

Ext.debug.ComponentInfoPanel = Ext.extend(Ext.Panel,{
    id:'x-debug-compinfo',
    region: 'east',
    minWidth: 200,
    split: true,
    width: 350,
    border: false,
    autoScroll: true,
    layout:'anchor',
    style:'border-width:0 0 0 1px;',

    initComponent: function() {
        this.watchBox = new Ext.form.Checkbox({
            id: 'x-debug-watchcomp',
            boxLabel: 'Watch ComponentMgr',
            listeners: {
                check: function(cb, val) {
                    if (val) {
                        Ext.ComponentMgr.all.on('add', this.onAdd, this);
                        Ext.ComponentMgr.all.on('remove', this.onRemove, this);
                    } else {
                        Ext.ComponentMgr.all.un('add', this.onAdd, this);
                        Ext.ComponentMgr.all.un('remove', this.onRemove, this);
                    }
                },
                scope: this
            }
        });

        this.tbar = new Ext.Toolbar([{
            text: 'Clear',
            handler: this.clear,
            scope: this
        },'->',this.watchBox
        ]);
        Ext.debug.ComponentInfoPanel.superclass.initComponent.call(this);
    },

    onAdd: function(i, o, key) {
        var markup = ['<div style="padding:5px !important;border-bottom:1px solid #ccc;">',
                    'Added: '+o.id,
                    '</div>'].join('');
        this.insertMarkup(markup);
    },

    onRemove: function(o, key) {
        var markup = ['<div style="padding:5px !important;border-bottom:1px solid #ccc;">',
                    'Removed: '+o.id,
                    '</div>'].join('');
        this.insertMarkup(markup);
    },

    message: function(msg) {
        var markup = ['<div style="padding:5px !important;border-bottom:1px solid #ccc;">',
                    msg,
                    '</div>'].join('');
        this.insertMarkup(markup);
    },
    insertMarkup: function(markup) {
        this.body.insertHtml('beforeend', markup);
        this.body.scrollTo('top', 100000);
    },
    clear : function(){
        this.body.update('');
        this.body.dom.scrollTop = 0;
    }
});

Ext.debug.ColumnNodeUI = Ext.extend(Ext.tree.TreeNodeUI, {
    focus: Ext.emptyFn, // prevent odd scrolling behavior

    renderElements : function(n, a, targetNode, bulkRender){
        this.indentMarkup = n.parentNode ? n.parentNode.ui.getChildIndent() : '';

        var t = n.getOwnerTree();
        var cols = t.columns;
        var bw = t.borderWidth;
        var c = cols[0];

        var buf = [
             '<li class="x-tree-node"><div ext:tree-node-id="',n.id,'" class="x-tree-node-el x-tree-node-leaf ', a.cls,'">',
                '<div class="x-tree-col" style="width:',c.width-bw,'px;">',
                    '<span class="x-tree-node-indent">',this.indentMarkup,"</span>",
                    '<img src="', this.emptyIcon, '" class="x-tree-ec-icon x-tree-elbow"/>',
                    '<img src="', a.icon || this.emptyIcon, '" class="x-tree-node-icon',(a.icon ? " x-tree-node-inline-icon" : ""),(a.iconCls ? " "+a.iconCls : ""),'" unselectable="on"/>',
                    '<a hidefocus="on" class="x-tree-node-anchor" href="',a.href ? a.href : "#",'" tabIndex="1" ',
                    a.hrefTarget ? ' target="'+a.hrefTarget+'"' : "", '>',
                    '<span unselectable="on">', n.text || (c.renderer ? c.renderer(a[c.dataIndex], n, a) : a[c.dataIndex]),"</span></a>",
                "</div>"];
         for(var i = 1, len = cols.length; i < len; i++){
             c = cols[i];

             buf.push('<div class="x-tree-col ',(c.cls?c.cls:''),'" style="width:',c.width-bw,'px;">',
                        '<div class="x-tree-col-text">',(c.renderer ? c.renderer(a[c.dataIndex], n, a) : a[c.dataIndex]),"</div>",
                      "</div>");
         }
         buf.push(
            '<div class="x-clear"></div></div>',
            '<ul class="x-tree-node-ct" style="display:none;"></ul>',
            "</li>");

        if(bulkRender !== true && n.nextSibling && n.nextSibling.ui.getEl()){
            this.wrap = Ext.DomHelper.insertHtml("beforeBegin",
                                n.nextSibling.ui.getEl(), buf.join(""));
        }else{
            this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode, buf.join(""));
        }

        this.elNode = this.wrap.childNodes[0];
        this.ctNode = this.wrap.childNodes[1];
        var cs = this.elNode.firstChild.childNodes;
        this.indentNode = cs[0];
        this.ecNode = cs[1];
        this.iconNode = cs[2];
        this.anchor = cs[3];
        this.textNode = cs[3].firstChild;
    }
});

Ext.debug.ObjectInspector = Ext.extend(Ext.tree.TreePanel, {
    id: 'x-debug-objinspector',
    enableDD:false ,
    lines:false,
    rootVisible:false,
    animate:false,
    hlColor:'ffff9c',
    autoScroll: true,
    region:'center',
    border:false,
    lines:false,
    borderWidth: Ext.isBorderBox ? 0 : 2, // the combined left/right border for each cell
    cls:'x-column-tree',

    initComponent : function(){
        this.showFunc = false;
        this.toggleFunc = function() {
            this.showFunc = !this.showFunc;
            this.refreshNodes(this.currentObject);
        };
        this.bbar = new Ext.Toolbar([{
            text: 'Show Functions',
            enableToggle: true,
            pressed: false,
            handler: this.toggleFunc,
            scope: this
        }]);

        Ext.apply(this,{
            title: ' ',
            loader: new Ext.tree.TreeLoader(),
            columns:[{
                header:'Property',
                width: 300,
                dataIndex:'name'
            },{
                header:'Value',
                width: 900,
                dataIndex:'value'
            }]
        });

        Ext.debug.ObjectInspector.superclass.initComponent.call(this);

        this.root = this.setRootNode(new Ext.tree.TreeNode({
            text: 'Dummy Node',
            leaf: false
        }));

        if (this.currentObject) {
            this.parseNodes();
        }
    },

    refreshNodes: function(newObj) {
        this.currentObject = newObj;
        var node = this.root;
        while(node.firstChild){
            node.removeChild(node.firstChild);
        }
        this.parseNodes();
    },

    parseNodes: function() {
        for (var o in this.currentObject) {
            if (!this.showFunc) {
                if (Ext.isFunction(this.currentObject[o])) {
                    continue;
                }
            }
            this.createNode(o);
        }
    },

    createNode: function(o) {
        return this.root.appendChild(new Ext.tree.TreeNode({
            name: o,
            value: this.currentObject[o],
            uiProvider:Ext.debug.ColumnNodeUI,
            iconCls: 'x-debug-node',
            leaf: true
        }));
    },

    onRender : function(){
        Ext.debug.ObjectInspector.superclass.onRender.apply(this, arguments);
        this.headers = this.header.createChild({cls:'x-tree-headers'});

        var cols = this.columns, c;
        var totalWidth = 0;

        for(var i = 0, len = cols.length; i < len; i++){
             c = cols[i];
             totalWidth += c.width;
             this.headers.createChild({
                 cls:'x-tree-hd ' + (c.cls?c.cls+'-hd':''),
                 cn: {
                     cls:'x-tree-hd-text',
                     html: c.header
                 },
                 style:'width:'+(c.width-this.borderWidth)+'px;'
             });
        }
        this.headers.createChild({cls:'x-clear'});
        // prevent floats from wrapping when clipped
        this.headers.setWidth(totalWidth);
        this.innerCt.setWidth(totalWidth);
    }
});


Ext.debug.StoreInspector = Ext.extend(Ext.tree.TreePanel, {
    enableDD:false ,
    lines:false,
    rootVisible:false,
    animate:false,
    hlColor:'ffff9c',
    autoScroll: true,
    region:'center',
    border:false,

    initComponent: function() {
        this.bbar = new Ext.Toolbar([{
            text: 'Refresh',
            handler: this.refresh,
            scope: this
        }]);
        Ext.debug.StoreInspector.superclass.initComponent.call(this);

        this.root = this.setRootNode(new Ext.tree.TreeNode({
            text: 'Data Stores',
            leaf: false
        }));
        this.on('click', this.onClick, this);

        this.parseStores();
    },

    parseStores: function() {
        var cn = Ext.StoreMgr.items;
        for (var i = 0,c;c = cn[i];i++) {
            this.root.appendChild({
                text: c.storeId + ' - ' + c.totalLength + ' records',
                component: c,
                leaf: true
            });
        }
    },

    onClick: function(node, e) {
        var oi = Ext.getCmp('x-debug-objinspector');
        oi.refreshNodes(node.attributes.component);
        oi.ownerCt.show();
    },

    refresh: function() {
        while (this.root.firstChild) {
            this.root.removeChild(this.root.firstChild);
        }
        this.parseStores();
    }
});

// highly unusual class declaration
Ext.debug.HtmlNode = function(){
    var html = Ext.util.Format.htmlEncode;
    var ellipsis = Ext.util.Format.ellipsis;
    var nonSpace = /^\s*$/;

    var attrs = [
        {n: 'id', v: 'id'},
        {n: 'className', v: 'class'},
        {n: 'name', v: 'name'},
        {n: 'type', v: 'type'},
        {n: 'src', v: 'src'},
        {n: 'href', v: 'href'}
    ];

    function hasChild(n){
        for(var i = 0, c; c = n.childNodes[i]; i++){
            if(c.nodeType == 1){
                return true;
            }
        }
        return false;
    }

    function renderNode(n, leaf){
        var tag = n.tagName.toLowerCase();
        var s = '&lt;' + tag;
        for(var i = 0, len = attrs.length; i < len; i++){
            var a = attrs[i];
            var v = n[a.n];
            if(v && !nonSpace.test(v)){
                s += ' ' + a.v + '=&quot;<i>' + html(v) +'</i>&quot;';
            }
        }
        var style = n.style ? n.style.cssText : '';
        if(style){
            s += ' style=&quot;<i>' + html(style.toLowerCase()) +'</i>&quot;';
        }
        if(leaf && n.childNodes.length > 0){
            s+='&gt;<em>' + ellipsis(html(String(n.innerHTML)), 35) + '</em>&lt;/'+tag+'&gt;';
        }else if(leaf){
            s += ' /&gt;';
        }else{
            s += '&gt;';
        }
        return s;
    }

    var HtmlNode = function(n){
        var leaf = !hasChild(n);
        this.htmlNode = n;
        this.tagName = n.tagName.toLowerCase();
        var attr = {
            text : renderNode(n, leaf),
            leaf : leaf,
            cls: 'x-tree-noicon'
        };
        HtmlNode.superclass.constructor.call(this, attr);
        this.attributes.htmlNode = n; // for searching
        if(!leaf){
            this.on('expand', this.onExpand,  this);
            this.on('collapse', this.onCollapse,  this);
        }
    };


    Ext.extend(HtmlNode, Ext.tree.AsyncTreeNode, {
        cls: 'x-tree-noicon',
        preventHScroll: true,
        refresh : function(highlight){
            var leaf = !hasChild(this.htmlNode);
            this.setText(renderNode(this.htmlNode, leaf));
            if(highlight){
                Ext.fly(this.ui.textNode).highlight();
            }
        },

        onExpand : function(){
            if(!this.closeNode && this.parentNode){
                this.closeNode = this.parentNode.insertBefore(new Ext.tree.TreeNode({
                    text:'&lt;/' + this.tagName + '&gt;',
                    cls: 'x-tree-noicon'
                }), this.nextSibling);
            }else if(this.closeNode){
                this.closeNode.ui.show();
            }
        },

        onCollapse : function(){
            if(this.closeNode){
                this.closeNode.ui.hide();
            }
        },

        render : function(bulkRender){
            HtmlNode.superclass.render.call(this, bulkRender);
        },

        highlightNode : function(){
            //Ext.fly(this.htmlNode).highlight();
        },

        highlight : function(){
            //Ext.fly(this.ui.textNode).highlight();
        },

        frame : function(){
            this.htmlNode.style.border = '1px solid #0000ff';
            //this.highlightNode();
        },

        unframe : function(){
            //Ext.fly(this.htmlNode).removeClass('x-debug-frame');
            this.htmlNode.style.border = '';
        }
    });

    return HtmlNode;
}();Ext.ns('Wlj.frame.functions.app.widgets');
/**
 * 页面查询条件面板类
 */
Wlj.frame.functions.app.widgets.SearchContainer = Ext.extend(Ext.Panel,{
	vs : false,
	columnCount : 4,
	layout : 'fit',
	WCLP : false,
	needCloseLable4DCF : false,
	multiSelectSeparator : false,
	dyfield : new Array(),
	buttonCfg : {},
	initComponent : function(){
		var _this = this;
		_this._APP.fireEvent('beforeconditioninit',_this,_this._APP);
		this.height = this.vs.height;
		this.width = this.vs.width;
		Wlj.frame.functions.app.widgets.SearchContainer.superclass.initComponent.call(this);
		_this._APP.fireEvent('afterconditioninit',_this,_this._APP);
		_this._APP.fireEvent('beforeconditionrender',_this, _this._APP);
	},
	onRender : function(ct, position){
		var vs =  this.vs;
		var _this = this;
		var columnCount = 0;
		if(vs.width > 1024){
			columnCount = 4;
		} else {
			columnCount = 3;
		}
		this.columnCount = columnCount;
		this.createColumnItems(columnCount);
		Wlj.frame.functions.app.widgets.SearchContainer.superclass.onRender.call(this,ct,position);
		this.el.on('contextmenu', function(eve){
			eve.stopEvent();
			_this.onContextMenu(eve, []);
		});
		_this._APP.fireEvent('afterconditionrender',_this, _this._APP);
	},
	destroy : function(){
		this.dyfield = [];
		this.purgeListeners();
		this.itemsArray = null;
		this.searchPanel.purgeListeners();
		this.searchPanel = null;
		for(var key in this.buttonCfg){
			this[key+'Button'] = null;
			delete this[key+'Button'];
		}
		this.buttonCfg = {};
		this.DropZone.destroy();
		Wlj.frame.functions.app.widgets.SearchContainer.superclass.destroy.call(this);
	},
	initEvents : function(){
		this.addEvents({
			beforeconditionadd : true,
			conditionadd : true,
			beforeconditionremove : true,
			conditionremove : true,
			beforedyfieldclear : true,
			afterdyfieldclear : true,
			beforecondtitionfieldvalue : true,
			condtitionfieldvalue : true
		});
	},
	createColumnItems : function(columnCount){
		var _this = this;
		var items = this.items;
		if(!items){
			return false;
		}
		if(columnCount<1){
			return false;
		}
		var columns = new Array();
		for(var i = 0; i<columnCount;i++){
			var columnCfg = {};
			columnCfg.layout = 'form';
			columnCfg.defaultType = 'textfield';
			columnCfg.columnWidth = 1/columnCount;
			columnCfg.items = [];
			Ext.each(this.itemsArray,function(it){
				if(it.dataType && WLJDATATYPE[it.dataType]){
					it.xtype = WLJDATATYPE[it.dataType].getFieldXtype();
					Ext.applyIf(it, WLJDATATYPE[it.dataType].getFieldSpecialCfg());
				}
				if(_this.itemsArray.indexOf(it) % columnCount == i){
					if(it.cAllowBlank === false || it.allowBlank === false){
						it.allowBlank = false;
						it.fieldLabel = WLJTOOL.addBlankFlag(it.text);
					}
					it.anchor = '90%';
					columnCfg.items.push(it);
				}
			});
			columns.push(columnCfg);
		}
		var buttonCfg = _this.buttonCfg;
		var buttons = [];
		for(var key in buttonCfg){
			var cfg = {};
			Ext.apply(cfg,buttonCfg[key]);
			cfg.handler = buttonCfg[key].fn.createDelegate(this);
			_this[key+'Button'] = new Ext.Button(cfg);
			buttons.push(_this[key+'Button']);
		}
		
		_this.searchPanel = new Ext.form.FormPanel({
			frame : true,
			layout : 'column',
			items : columns,
			buttons : buttons,
			listeners : {
				'afterrender' : function(){
					_this.createDynaticSearchTarget();
					this.el.on('keydown',function(e,t,o){
						if(!e.ctrlKey && !e.altKey && e.keyCode === e.ENTER){
							e.stopEvent();
							_this.searchHandler();
						}
					});
				}
			}
		});
		_this.add(_this.searchPanel) ;
	},
	hasConditionButton : function(btn){
		if (this[btn+'Button'] && this.searchPanel.buttons.indexOf(this[btn+'Button'])> -1) {
			return true;
		}
		return false;
	},
	enableConditionButton : function(btn){
		if (this.hasConditionButton(btn)) {
			this[btn+'Button'].enable();
		}
	},
	disableConditionButton : function(btn){
		if (this.hasConditionButton(btn)) {
			this[btn+'Button'].disable();
		}
	},
	showConditionButton : function(btn){
		if (this.hasConditionButton(btn)) {
			this[btn+'Button'].show();
		}
	},
	hideConditionButton : function(btn){
		if (this.hasConditionButton(btn)) {
			this[btn+'Button'].hide();
		}
	},
	getNumberedColumn : function(max_min){
		var _this = this;
		var res = true;//true:取最大长度；false：取最小长度；
		if(max_min){
			res = true;
		}else{
			res = false;
		}
		var p = _this.searchPanel;
		var resi = 0;
		p.items.each(function(c){
			if(c.xtype !== 'hidden' && c.items){
				if(res && c.items.getCount() > p.get(resi).items.getCount()){
					resi = p.items.indexOf(c);
				}else if(!res &&  c.items.getCount() < p.get(resi).items.getCount()){
					resi = p.items.indexOf(c);
				}
			}
		});
		return resi;
	},
	fixSearchHeight : function(){
		var _this = this;
		var count = _this.searchPanel.items.get(_this.getNumberedColumn(true)).items.getCount();
		_this._APP.setSearchSize({
			height : 39 + 33 * count + 6 + (_this.title?27:0)
		});
	},
	removeAllDyField : function(){
		if(this.dyfield.length == 0){
			return false;
		}
		var clearable = this.fireEvent('beforedyfieldclear', this, this.searchPanel, this.dyfield);
		if(clearable === false){
			return false;
		}
		while(this.dyfield.length>0){
			var df = this.dyfield.pop();
			df.ownerCt.remove(df);
		}
		this.searchPanel.doLayout();
		this.fixSearchHeight();
		this.fireEvent('afterdyfieldclear', this, this.searchPanel, this.dyfield);
	},
	createDynaticSearchTarget : function(){
		var _this = this;
		this.DropZone = new Ext.dd.DropTarget(_this.searchPanel.el.dom, {
			ddGroup : 'searchDomainDrop',
			notifyDrop  : function(ddSource, e, data){
				var dataInfo = data.tile.data;
				if(dataInfo.name){
					var targetField = _this.addField(dataInfo.name);
					if(targetField.setValue){
						var setAble = _this.fireEvent('beforecondtitionfieldvalue',targetField,dataInfo,dataInfo.value);
						if(setAble){
							targetField.setValue(dataInfo.value);
							_this.fireEvent('condtitionfieldvalue',targetField,dataInfo,dataInfo.value);
						}
					}
					if(Ext.isString(dataInfo.text)){
						targetField.setLabelText(dataInfo.text);
					}
				}
			}
		});	
	},
	addField : function(fieldCfg){
		var _this = this;
		var targetField = _this.searchPanel.getForm().findField(fieldCfg);
		if(!targetField){
			var fCfg = this.getFieldCfg(fieldCfg);
			if(!fCfg) return false;
			var columnIndexT = _this.getNumberedColumn(false);
			var addable = _this.fireEvent('beforeconditionadd',fCfg,columnIndexT,_this.searchPanel);
			if(addable === false){
				return false;
			}
			var targetField = _this.searchPanel.items.get(columnIndexT).add(fCfg);
			_this.dyfield.push(targetField);
			_this.searchPanel.doLayout();
		}
		return targetField;
	},
	getFieldCfg : function(fieldCfg){
		var _this = this;
		if(Ext.isString(fieldCfg)){
			var f = _this._APP.getFieldsByName(fieldCfg);
			if(!f){
				return false;
			}
			var fCfg = _this.formatFieldCfg(f);
			return fCfg;
		}else{
			var fCfg = _this.formatFieldCfg(fieldCfg);
			return fCfg;
		}
	},
	formatFieldCfg : function(f){
		var _this = this;
		var fCfg = {};
		if(f.translateType){
			fCfg.xtype = f.multiSelect?'lovcombo':'combo';
			fCfg.store = _this._APP.lookupManager[f.translateType];
			if(!fCfg.store){
				Ext.error('字段【'+f.text+'】数据字典映射项store【'+f.translateType+'】获取错误，请检查[lookupTypes|localLookup]项配置');
				return false;
			}
			fCfg.valueField = 'key';
			fCfg.displayField = 'value';
			fCfg.editable = typeof f.editable === 'boolean' ? f.editable : false;
			fCfg.forceSelection = true;
			fCfg.triggerAction = 'all';
			fCfg.mode = 'local';
			fCfg.hiddenName = f.name;
			fCfg.separator = f.multiSeparator?f.multiSeparator:_this.multiSelectSeparator;
		}else{
			fCfg.name = f.name;
			if(f.dataType && WLJDATATYPE[f.dataType]){
				fCfg.xtype = WLJDATATYPE[f.dataType].getFieldXtype();
				Ext.applyIf(fCfg, WLJDATATYPE[f.dataType].getFieldSpecialCfg());
			}
		}
		fCfg.fieldLabel = f.text ? f.text : f.name;
		fCfg.anchor = '90%';
		Ext.applyIf(fCfg, f);
		delete fCfg.allowBlank;
		if(f.cAllowBlank === false){
			fCfg.allowBlank = false;
			fCfg.fieldLabel = WLJTOOL.addBlankFlag(f.text);
		}
		fCfg.listeners = {
			'afterrender':function(fitem){
				if(_this.needCloseLable4DCF){
					var rTemplate = new Ext.Template(
					'<div class="del-searchField"></div>');
					var t = rTemplate.insertFirst(fitem.el.parent());
					fitem.closeLabel = t;
					t.style.zIndex = 15000;
					t.onclick = function(){
						_this.removeField(fitem);
					};
				}
				_this.fixSearchHeight();
				_this.fireEvent('conditionadd',fitem,_this.searchPanel);
			}
		};
		return fCfg;
	},
	removeField : function(field){
		var _this = this;
		if(Ext.isString(field)){
			var fieldOb = this.searchPanel.getForm().findField(field);
			if(fieldOb){
				var removeable = _this.fireEvent('beforeconditionremove',fieldOb,_this.searchPanel);
				if(removeable === false){
					return false;
				}
				_this.dyfield.remove(fieldOb);
				fieldOb.ownerCt.remove(fieldOb);
				_this.searchPanel.doLayout();
				_this.fixSearchHeight();
				_this.fireEvent('conditionremove',_this.searchPanel);
			}
		}else if(Ext.isObject(field) && field.ownerCt){
			var removeable = _this.fireEvent('beforeconditionremove',field,_this.searchPanel);
			if(removeable === false){
				return false;
			}
			_this.dyfield.remove(field);
			field.ownerCt.remove(field);
			_this.searchPanel.doLayout();
			_this.fixSearchHeight();
			_this.fireEvent('conditionremove',_this.searchPanel);
		}else if(Ext.isObject(field) && !field.ownerCt){
			if(!field.name){
				return false;
			}
			var fieldOb = this.searchPanel.getForm().findField(field.name);
			if(fieldOb){
				var removeable = _this.fireEvent('beforeconditionremove',fieldOb,_this.searchPanel);
				if(removeable === false){
					return false;
				}
				_this.dyfield.remove(fieldOb);
				fieldOb.ownerCt.remove(fieldOb);
				_this.searchPanel.doLayout();
				_this.fixSearchHeight();
				_this.fireEvent('conditionremove',_this.searchPanel);
			}
		}else{
			return false;
		}
		
	},
	getField : function(field){
		var _this = this;
		if(Ext.isString(field)){
			return this.searchPanel.getForm().findField(field);
		}else if(Ext.isObject(field)){
			if(!field.name){
				return false;
			}else{
				return this.searchPanel.getForm().findField(field.name);
			}
		}else{
			return false;
		}
	},
	searchHandler : function(){
		var _this = this;
		if(!_this.searchPanel.getForm().isValid()){
			Ext.Msg.alert("提示",'请填写必要的查询条件');
			return false;
		}
		pars = _this.searchPanel.getForm().getFieldValues();
		for(var key in pars){
			if(!pars[key]){
				delete pars[key];
			}
		}
		_this._APP.setSearchParams(pars,true,true);
	},
	resetCondition : function(removeDy){
		if(removeDy===true){
			this.removeAllDyField();
		}
		this.searchPanel.getForm().reset();
	},
	resetHandler : function(){
		this.resetCondition(true);
	},
	clearHandler : function(){
		this.resetCondition(false);
	},
	onContextMenu : function(eve, added){
		var cmenus =Ext.isString(WLJUTIL.contextMenus.condition) ? eval(WLJUTIL.contextMenus.condition) : WLJUTIL.contextMenus.condition;
		for(var key in cmenus){
			var omenu = {};
			omenu.text = cmenus[key].text;
			omenu.handler = cmenus[key].fn.createDelegate(this);
			added.push(omenu);
		}
		added.push('-');
		this._APP.onContextMenu(eve, added);
	}
}); 
Ext.reg('searchcontainer', Wlj.frame.functions.app.widgets.SearchContainer);Ext.ns('Wlj.frame.functions.app.widgets');

/**
 * 页面查询结果列表容器;
 */
Wlj.frame.functions.app.widgets.ResultContainer = Ext.extend(Ext.Panel, {
	
	needGrid : true,
	needTbar : true,
	autoLoadGrid : true,
	
	singleSelect : false,
	multiSelectSeparator : false,
	
	gridLockedHole : false,
	gridLockedOnce : false,
	
	suspendViews : false,
	suspendViewsWidth : 0,
	alwaysLockCurrentView : false,
	
	tbarButtonAlign : 'left',
	tbarViewAlign : 'left',
	
	needRN : false,
	rnWidth : false,
	
	CREATE_VIEW:'createView',
	EDIT_VIEW:'editView',
	DETAIL_VIEW:'detailView',
	GRID_VIEW : 'gridView',
	
	createView : true,
	editView : true,
	detailView : true,
	
	createFieldsCopy : false,
	editFieldsCopy : false,
	detailFieldsCopy :false,
	
	createFormViewer : false,
	editFormViewer : false,
	detailFormViewer : false,
	
	createValidates : false,
	editValidates : false,
	
	createLinkages : false,
	editLinkages : false,
	
	createViewText : '新增',
	editViewText : '修改',
	detailViewText : '详情',	
	gridViewText : '列表',
	
	pageSize : 10,
	
	url : false,
	dataFields : [],
	jsonRoot : 'json.data',
	jsonCount : 'json.count',
	
	store : false,
	currentParams : {},
	formButtons : false,
	viewPanel : {
		createView : false,
		editView : false,
		detailView : false
	},
	
	easingStrtegy : false,
	/**
	 * resize事件
	 */
	beresized : function(p,aw,ah,rw,rh){
		var h = parseInt(ah, 10), w = parseInt(aw, 10);
		var vh,vw;
		var _this = this;
		if(Ext.isNumber(h)){
			if(_this.needTbar){
				var theight = this.tbar.getViewSize().height;
				vh = h - theight;/**to check**/
			}else{
				vh = h;
			}
			if(!this._APP.needCondition){
				vh = vh - 8;
			}
			if(vh < 0){
				vh = 0;
			}
		}
		if(Ext.isNumber(w)){
			vw = w;
		}
		Ext.iterate(this.viewPanel, function(key, panel){
			if(panel){
				if(vh)
					panel.setHeight(vh);
				if(vw){
					if(panel.rendered){
						if(!_this.suspendViews)
							panel.setWidth(vw);
						if(panel !== _this.currentView){
							panel.el.applyStyles({
								left : vw + 'px'
							});
						}else{
							panel.el.applyStyles({
								left : (vw - panel.el.getViewSize().width) + 'px'
							});
						}
					}
				}
			}
		});
		Ext.each(this.customerViewPanels, function(panel){
			if(vh){
				panel.setHeight(vh);
				if(panel.assistantView && panel.assistantView.setHeight){
					panel.assistantView.setHeight(vh);
				}
			}
			if(vw){
				if(panel.rendered){
					if(!_this.suspendViews)
						panel.setWidth(vw);
					if(panel !== _this.currentView){
						panel.el.applyStyles({
							left : vw + 'px'
						});
					}else{
						panel.el.applyStyles({
							left : (vw - panel.el.getViewSize().width) + 'px'
						});
					}
				}
			}
		});
		if(this.needGrid){
			if(vh)
				this.searchGridView.setHeight(vh);
			if(vw){
				this.searchGridView.setWidth(vw);
				if(this.gridOuted){
					Ext.fly(this.searchGridView.el).applyStyles({
						marginLeft : -vw + 'px'
					});
				}
			}
		}
	},
	
	initComponent : function(){
		var _this = this;
		_this.validateFieldsCfg();
		_this._APP.fireEvent('beforeresultinit', _this, _this._APP);
		if(_this.needTbar){
			var pbs = [];
			if(_this.tbarButtonAlign === 'right'){
				pbs.push('->');
			}
			if(Ext.isArray(this.tbar)){
				for(var i=0;i<this.tbar.length;i++){
					if(Ext.isObject(this.tbar[i]) && this.tbar[i].text){
						if(!this.tbar[i].iconCls){
							this.tbar[i].iconCls = 'ico-w-'+Math.ceil(Math.random()*100);
						}
						pbs.push(this.tbar[i]);
					}
				}
			}
			if(_this.tbarViewAlign === 'right'){
				if(_this.tbarButtonAlign !== 'right'){
					pbs.push('->');
				}else{
					if(pbs.length>0)
						pbs.push('-');
				}
			}else{
				if(pbs.length>0){
					pbs.push('-');
				}
			}
			
			if(!_this.suspendViews)
				pbs.push({
					text : this.gridViewText,
					hidden : !this.needGrid,
					handler : function(){
						_this.gridMoveIn();
					},
					listeners : {
						afterrender : function(button){
							_this.gridButton = button;
							_this.gridButton.toggle(true,true);
						}
					}
				});
			this.tbar = pbs;
		}else{
			delete this.tbar;
		}
		Wlj.frame.functions.app.widgets.ResultContainer.superclass.initComponent.call(this);
		_this._APP.fireEvent('afterresultinit', _this, _this._APP);
		_this._APP.fireEvent('beforeresultrender', _this, _this._APP);
	},
	validateFieldsCfg : function(){
		var dfs = this.dataFields;
		var targetFs = [];
		for(var i=0;i<dfs.length; i++){
			if(!dfs[i].name){
				continue;
			}else{
				if(!dfs[i].text){
					dfs[i].text = dfs[i].name;
					dfs[i].hidden = true;
				}
				targetFs.push(dfs[i]);
			}
		}
		this.dataFields = targetFs;
	},
	onRender : function(ct, position){
		var _this = this;
		this.width = this.vs.width;
		this.height = this.vs.height;
		Wlj.frame.functions.app.widgets.ResultContainer.superclass.onRender.call(this, ct, position);
		if(this.needGrid){
			this.initStore();
			this.searchGridView = new Wlj.frame.functions.app.widgets.SearchGrid({
				store : this.store,
				searchDomain : this,
				_APP : this._APP,
				pageSize : this.pageSize,
				needRN : this.needRN,
				rnWidth : this.rnWidth,
				easingStrtegy : this.easingStrtegy
			});
			this.add(this.searchGridView);
			this.searchGridView.on('recordselect', function(record, store,tile){
				_this.fireEvent('recordselect', record, store,tile);
				if(_this.currentView){
					var showable = _this.fireEvent('beforeviewshow',_this.currentView);
					if(showable === false){
						return false;
					}else{
						if(_this.currentView.hasListener('moveout')){
							_this.currentView.fireEvent('moveout');
						}
						if(_this.currentView.hasListener('movein')){
							_this.currentView.fireEvent('movein',record);
						}
						_this.fireEvent('viewshow',_this.currentView);
					}
				}
			});
			this.searchGridView.on('rowdblclick', function(tile, record){
				_this.fireEvent('rowdblclick', tile, record);
			});
		}
		this.initViews();
		if(this.needGrid){
			if(this.autoLoadGrid){
				var pars = this._APP.searchDomain.searchPanel.getForm().getFieldValues();
				for(var key in pars){
					if(!pars[key]){
						delete pars[key];
					}
				}
				this._APP.setSearchParams(pars,true,true);
			}
		}else{
			this.showView(this.firstView());
		}
		this.initEvents();
		var _this = this;
		this.el.on('contextmenu', function(eve){
			eve.stopEvent();
			_this.onContextMenu(eve, []);
		});
	},
	afterRender : function(){
		Wlj.frame.functions.app.widgets.ResultContainer.superclass.afterRender.call(this);
		this._APP.fireEvent('afterresultrender', this, this._APP);
	},
	initEvents : function(){
		this.addEvents({
			beforeviewshow : true,
			viewshow : true,
			beforeviewhide : true,
			viewhide : true,
			recorddelete : true,
			beforevalidate :true,
			validate : true,
			recordselect : true,
			beforecreateviewrender : true,
			aftercreateviewrender : true,
			beforeeditviewrender : true,
			aftereditviewrender : true,
			beforedetailviewrender : true,
			afterdetailviewrender : true,
			rowdblclick : true
		});
		this.on('resize',this.beresized);
	},
	initViews : function(){
		var thisVs = this.vs;
		var _this = this;
		
		var supportWidth = 0;
		if(!this.suspendViews){
			supportWidth = thisVs.width - 12;
		}else{
			if(this.suspendViewsWidth>thisVs.width-12-this.rnWidth){
				supportWidth = thisVs.width-12-this.rnWidth -30;
			}else{
				supportWidth= this.suspendViewsWidth;
			}
		}
		
		function buildWidth(supportWidth, vscontainer, formCfg){
			if(formCfg.suspendFitAll){
				return vscontainer.width;
			}else if(Ext.isNumber(formCfg.suspendWidth)){
				if(formCfg.suspendWidth>1){
					return formCfg.suspendWidth;
				}else{
					return vscontainer.width * formCfg.suspendWidth;
				}
			}else{
				return supportWidth;
			}
		}
		if(this[this.CREATE_VIEW]){
			var CVIEWCFG = {
				ownerDomain : this,
				ownerApp : this._APP,
				vs : {
					height : thisVs.height - 37,
					width : _this.suspendViews ? buildWidth(supportWidth, thisVs, this.createFormCfgs) : supportWidth
				},
				title : this[this.CREATE_VIEW+'Text'],
				formViewer : this.createFormViewer,
				fields : this.createFieldsCopy,
				validates : this.createValidates,
				linkages : this.createLinkages,
				baseType : this.CREATE_VIEW,
				suspended : this.suspendViews,
				tabIco : 'ico-w-6'
			};
			Ext.apply(CVIEWCFG,this.createFormCfgs);
			this.viewPanel[this.CREATE_VIEW] = new Wlj.frame.functions.app.widgets.CView(CVIEWCFG);
			this.viewPanel[this.CREATE_VIEW].on({
				moveout : {
					fn : this.viewPanel[this.CREATE_VIEW].reset,
					scope : this.viewPanel[this.CREATE_VIEW],
					delay : 0
				},
				beforevalidate : {
					fn : function(view, panel){
						return _this.fireEvent('beforevalidate', view, panel);
					},
					scope : _this,
					delay : 0
				},
				validate : {
					fn : function(view, panel, error){
						_this.fireEvent('validate', view, panel,error);
					},
					scope : _this,
					delay : 0
				},
				afterviewrender : {
					fn : function(view){
						_this.fireEvent('aftercreateviewrender', view);
					},
					scope : _this,
					delay : 0
				}
			});
			//this.viewPanel[this.CREATE_VIEW].render(this.body);
		}
		if(this[this.EDIT_VIEW]){
			var EVIEWCFG = {
				ownerDomain : this,
				ownerApp : this._APP,
				vs : {
					height : thisVs.height - 37,
					width : _this.suspendViews ? buildWidth(supportWidth, thisVs, this.editFormCfgs) : supportWidth
				},
				title : this[this.EDIT_VIEW+'Text'],
				formViewer : this.editFormViewer,
				fields : this.editFieldsCopy,
				validates : this.editValidates,
				linkages : this.editLinkages,
				baseType : this.EDIT_VIEW,
				suspended : this.suspendViews,
				tabIco : 'ico-w-79'
			};
			Ext.apply(EVIEWCFG, this.editFormCfgs);
			this.viewPanel[this.EDIT_VIEW] =new Wlj.frame.functions.app.widgets.CView(EVIEWCFG);
			this.viewPanel[this.EDIT_VIEW].on({
				moveout : {
					fn : this.viewPanel[this.EDIT_VIEW].reset,
					scope : this.viewPanel[this.EDIT_VIEW],
					delay : 0
				},
				movein : {
					fn : this.viewPanel[this.EDIT_VIEW].setRecord,
					scope : this.viewPanel[this.EDIT_VIEW],
					delay : 0
				},
				beforeloadrecord : {
					fn : function(view, record){
						return _this._APP.fireEvent('beforeeditload', view, record);
					},
					scope : this.viewPanel[this.EDIT_VIEW],
					delay : 0
				},
				loadrecord : {
					fn : function(view, record){
						_this._APP.fireEvent('aftereditload', view, record);
					},
					scope : this.viewPanel[this.EDIT_VIEW],
					delay : 0
				},
				beforevalidate : {
					fn : function(view, panel){
						return _this.fireEvent('beforevalidate', view, panel);
					},
					scope : _this,
					delay : 0
				},
				validate : {
					fn : function(view, panel, error){
						_this.fireEvent('validate', view, panel,error);
					},
					scope : _this,
					delay : 0
				},
				afterviewrender : {
					fn : function(view){
						_this.fireEvent('aftereditviewrender', view);
					},
					scope : _this,
					delay : 0
				}
			});
			//this.viewPanel[this.EDIT_VIEW].render(this.body);
		}
		if(this[this.DETAIL_VIEW]){
			var DVIEWCFG = {
				ownerDomain : this,
				ownerApp : this._APP,
				svButton : false,
				vs : {
					height : thisVs.height - 37,
					width :_this.suspendViews ? buildWidth(supportWidth, thisVs, this.detailFormCfgs) : supportWidth
				},
				title : this[this.DETAIL_VIEW+'Text'],
				formViewer : this.detailFormViewer,
				fields : this.detailFieldsCopy,
				baseType : this.DETAIL_VIEW,
				suspended : this.suspendViews,
				tabIco : 'ico-w-27'
			};
			Ext.apply(DVIEWCFG, this.detailFormCfgs);
			this.viewPanel[this.DETAIL_VIEW] =new Wlj.frame.functions.app.widgets.CView(DVIEWCFG);
			this.viewPanel[this.DETAIL_VIEW].on({
				moveout : {
					fn : this.viewPanel[this.DETAIL_VIEW].reset,
					scope : this.viewPanel[this.DETAIL_VIEW],
					delay : 0
				},
				movein : {
					fn : this.viewPanel[this.DETAIL_VIEW].setRecord,
					scope : this.viewPanel[this.DETAIL_VIEW],
					delay : 0
				},
				beforeloadrecord : {
					fn : function(view, record){
						return _this._APP.fireEvent('beforedetailload', view, record);
					},
					scope : this.viewPanel[this.EDIT_VIEW],
					delay : 0
				},
				loadrecord : {
					fn : function(view, record){
						_this._APP.fireEvent('afterdetailload', view, record);
					},
					scope : this.viewPanel[this.EDIT_VIEW],
					delay : 0
				},
				afterviewrender : {
					fn : function(view){
						_this.fireEvent('afterdetailviewrender', view);
					},
					scope : _this,
					delay : 0
				}
			});
			//this.viewPanel[this.DETAIL_VIEW].render(this.body);
		}
		this.createCustomerViews();
	},
	clearViews : function(){
		
		this.createFormViewer = false;
		this.createFieldsCopy = false;
		this.createFormCfgs = false;
		
		this.editFormViewer = false;
		this.editFieldsCopy = false;
		this.editFormCfgs = false;
		
		this.detailFormViewer = false;
		this.detailFieldsCopy = false;
		this.detailFormCfgs = false;
		
	},
	createCustomerViews : function(){
		var customerViewCfg = this._APP.customerView;
		if(!Ext.isArray(customerViewCfg)){
			return;
		}
		var _this = this;
		var thisVs = this.el.getViewSize();
		
		var supportWidth = 0;
		if(!this.suspendViews){
			supportWidth = thisVs.width;
		}else{
			if(this.suspendViewsWidth>thisVs.width-12-this.rnWidth){
				supportWidth = thisVs.width-12-this.rnWidth -30;
			}else{
				supportWidth= this.suspendViewsWidth;
			}
		}
		
		Ext.each(customerViewCfg, function(cvc){
			if(!_this.customerViewPanels){
				_this.customerViewPanels = [];
			}
			var vTitile = cvc.title;
			var viewType = cvc.type;
			delete cvc.title;
			
			function buildWidth(supportWidth, vscontainer, formCfg){
				if(formCfg.suspendFitAll){
					return vscontainer.width;
				}else if(Ext.isNumber(formCfg.suspendWidth)){
					if(formCfg.suspendWidth>1){
						return formCfg.suspendWidth;
					}else{
						return vscontainer.width * formCfg.suspendWidth;
					}
				}else{
					return supportWidth;
				}
			}
			
			var cvcCfg = {
				title : vTitile? vTitile : 'Bview',
				vs : {
					height : thisVs.height - (_this.needTbar ? 37 : 0),
					width : _this.suspendViews? buildWidth(supportWidth, thisVs, cvc) : supportWidth
				},
				ownerDomain : _this,
				ownerApp : _this._APP,
				suspended : _this.suspendViews
			};
			Ext.apply(cvcCfg, cvc);
			
			if(!cvcCfg.tabIco){
				cvcCfg.tabIco = 'ico-w-'+Math.ceil(Math.random()*100);
			}
			
			var cvcp = false;
			if(viewType === 'form'){
				cvcp = new Wlj.frame.functions.app.widgets.FormView(cvcCfg);
			}else if(viewType === 'grid'){
				cvcp = new Wlj.frame.functions.app.widgets.GridView(cvcCfg);
			}else{
				cvcp = new Wlj.frame.functions.app.widgets.BView(cvcCfg);
			}
			_this.customerViewPanels.push(cvcp);
			//cvcp.render(_this.body);
		});
	},
	showView : function(viewType){
		if(!viewType){
			return;
		}
		var hideable = this.hideCurrentView();
		if(hideable === false){
			return false;
		}
		if(this.needGrid){
			this.gridMoveOut();
		}
		var thisVs = this.el.getViewSize();
		if(!viewType.rendered){
			viewType.render(this.body);
			viewType.el.applyStyles({
				left :  thisVs.width + 'px'
			});
		}
		var showable = this.fireEvent('beforeviewshow',viewType);
		if(showable === false){
			return false;
		}
		/***
		 * TODO FIT ALL
		 */
		var viewVs = viewType.el.getViewSize();
		var ccEl = viewType.el;
		ccEl.animate({
			left : {
				to : thisVs.width - viewVs.width,
				from : thisVs.width
			}
		},
		0.5,
		null,
		null,
		'run');
		this.currentView = viewType;
		viewType.fireEvent('movein',this.searchGridView?this.searchGridView.getSelected()[this.searchGridView.getSelected().length-1]:'');
		if(this.needTbar){
			this.currentView.togogleButton.toggle(true,true);
		}
		this.fireEvent('viewshow',this.currentView);
	},
	hideCurrentView : function(){
		if(this.currentView){
			var hideable = this.fireEvent('beforeviewhide',this.currentView);
			if(hideable === false){
				return false;
			}
			/**
			 * TODO FIT ALL
			 */
			var thisVs = this.el.getViewSize();
			var cvEl = this.currentView.el;
			cvEl.animate({
				left:{from:cvEl.getLeft(),to:thisVs.width}
			},
			0.5,
			null,
			'easeOut',
			'run');
			this.currentView.fireEvent('moveout');
			this.fireEvent('viewhide',this.currentView);
			if(this.currentView.assistantView){
				this.currentView.hideAssistant();
			}
			if(this.needTbar){
				this.currentView.togogleButton.toggle(false,true);
			}
			this.currentView = false;
		}
	},
	initStore : function(){
		var url = this.url;
		if(!url){
			return;
		}
		var fields = this.createStoreFields();
		var jsonRoot = this.jsonRoot;
		var jsonCount = this.jsonCount;
		var store = new Ext.data.Store({
			restful:true,	
	        proxy : new Ext.data.HttpProxy({url:url}),
	        reader : new Ext.data.JsonReader({
	        	totalProperty : jsonCount,
	        	root : jsonRoot
	        },fields)
		});
		this.store = store;
	},
	createStoreFields : function(){
		var fields = this.dataFields;
		var sFields = [];
		Ext.each(fields, function(f){
			if(f.dataType && WLJDATATYPE[f.dataType]){
				f.type = WLJDATATYPE[f.dataType].getStoreType();
				Ext.applyIf(f, WLJDATATYPE[f.dataType].getStoreSpecialCfg());
			}
			//if(f.gridField !== false){
				sFields.push(f);
			//}
		});
		return sFields;
	},
	gridMoveOut : function(){
		if(this.gridLockedHole){
			return;
		}
		var _this = this;
		var layTargetEl = Ext.fly(_this.getLayoutTarget());
		_this.searchGridView.el.animate({
			marginLeft : {from : 0, to : -layTargetEl.getViewSize().width}
		},
		.35,
		 null,      
		 'easeOut', 
		'run' );
		_this.gridOuted = true;
		if(this.needTbar){
			_this.gridButton.toggle(false,true);
		}
	},
	gridMoveIn : function(){
		if(this.gridLockedHole){
			return;
		}
		var _this = this;
		_this.hideCurrentView();
		var layTargetEl = Ext.fly(_this.getLayoutTarget());
		_this.searchGridView.el.animate({
			marginLeft : {to : 0, from : -layTargetEl.getViewSize().width}
		},
		.35,
		 null,      
		 'easeOut', 
		'run' );
		_this.gridOuted = false;
		if(this.needTbar){
			_this.gridButton.toggle(true,true);
		}
	},
	destroy : function(){
		for(var key in this.viewPanel){
			if(this.viewPanel[key].destroy){
				this.viewPanel[key].destroy();
				this.viewPanel[key] = false;
			}
		}
		this.clearViews();
		this.currentView = false;
		if(Ext.isArray(this.customerViewPanels)){
			for(var i=0;i<this.customerViewPanels.length;i++){
				this.customerViewPanels[i].destroy();
			}
			delete this.customerViewPanels;
		}
		if(this.searchGridView && this.searchGridView.destroy){
			this.searchGridView.destroy();
			this.searchGridView = null;
		}
		if(this.store){
			this.store.removeAll();
			this.store.destroy();
			this.store = null;
		}
		this.url = false;
		this.dataFields = [];
		this.jsonRoot = 'json.data';
		this.jsonCount = 'json.count';
		this.currentParams = {};
		Wlj.frame.functions.app.widgets.ResultContainer.superclass.destroy.call(this);
		
	},
	onMetaAdd : function(field){
		this.dataFields.push(field);
		this.onMetaChange();
		this.searchGridView.onMetaAdd(field);
	},
	onMetaAddAfter : function(addField, theField){
		var theIndex = this.getFieldIndex(theField);
		this.dataFields.splice(theIndex+1,0,addField);
		this.onMetaChange();
		this.searchGridView.onMetaAddByIndex(addField, theIndex+1);
	},
	onMetaAddBefore : function(addField, theField){
		var theIndex = this.getFieldIndex(theField);
		this.dataFields.splice(theIndex,0,addField);
		this.onMetaChange();
		this.searchGridView.onMetaAddByIndex(addField, theIndex);
	},
	getFieldIndex : function(theField){
		for(var i=0; i<this.dataFields.length; i++){
			if(this.dataFields[i].name === theField){
				return i;
			}
		}
		return i;
	},
	onMetaRemove : function(field){
		for(var i=0;i<this.dataFields.length;i++){
			if(this.dataFields[i].name === field){
				this.dataFields.remove(this.dataFields[i]);
				break;
			}
		}
		this.onMetaChange();
		this.searchGridView.onMetaRemove(field);
	},
	storeMetaChange : function(){
		var readerMeta = {
			totalProperty : this.jsonCount,
			root : this.jsonRoot,
			fields : this.createStoreFields()
		};
		this.store.reader.onMetaChange(readerMeta);
	},
	onMetaChange : function(){
		this.storeMetaChange();
		this.searchGridView.titleTile.createRecordTileEl();
		var rs = [];
		if(this.store.getCount()>0){
			rs = this.store.reader.readRecords(this.store.reader.jsonData);
		}
		this.store.removeAll();
		if(rs.success && rs.totalRecords>0){
			this.store.loadRecords( rs, this.store.lastOptions, true);
		}
	},
	/*******************public API***************/
	nextPageHandler : function(){
		this.searchGridView.nextPageHandler();
	},
	prePageHandler : function(){
		this.searchGridView.prePageHandler();
	},
	firstPageHandler : function(){
		this.searchGridView.firstPageHandler();
	},
	lastPageHandler : function(){
		this.searchGridView.lastPageHandler();
	},
	gridViewHandler : function(){
		this.gridMoveIn();
	},
	getTotleViewIndex : function(view){
		var index = -1;
		if(this.viewPanel[this.CREATE_VIEW]){
			if(view === this.viewPanel[this.CREATE_VIEW]){
				return index + 1;
			}else{
				index++;
			}
		}
		if(this.viewPanel[this.EDIT_VIEW]){
			if(view === this.viewPanel[this.EDIT_VIEW]){
				return index + 1;
			}else{
				index++;
			}
		}
		if(this.viewPanel[this.DETAIL_VIEW]){
			if(view === this.viewPanel[this.DETAIL_VIEW]){
				return index + 1;
			}else{
				index++;
			}
		}
		var cvi = this.getCustomerViewIndex(view);
		return index+cvi+1;
	},
	getCustomerViewIndex : function(view){
		return this.customerViewPanels.indexOf(view);
	},
	getViewByTotleIndex : function(index){
		if(!Ext.isNumber(index)){
			return false;
		}
		var ci = parseInt(index);
		if(this.viewPanel[this.CREATE_VIEW]){
			if(ci == 0){
				return this.viewPanel[this.CREATE_VIEW];
			}
			ci--;
		}
		if(this.viewPanel[this.EDIT_VIEW]){
			if(ci == 0){
				return this.viewPanel[this.EDIT_VIEW];
			}
			ci--;
		}
		if(this.viewPanel[this.DETAIL_VIEW]){
			if(ci == 0){
				return this.viewPanel[this.DETAIL_VIEW];
			}
			ci--;
		}
		return this.customerViewPanels[ci] ? this.customerViewPanels[ci] : false;
	},
	firstView : function(){
		if(this.viewPanel[this.CREATE_VIEW])
			return this.viewPanel[this.CREATE_VIEW];
		if(this.viewPanel[this.EDIT_VIEW])
			return this.viewPanel[this.EDIT_VIEW];
		if(this.viewPanel[this.DETAIL_VIEW])
			return this.viewPanel[this.DETAIL_VIEW];
		if(this.customerViewPanels.length > 0)
			return this.customerViewPanels[0];
		return false;
	},
	showNextView : function(){
		var nextView = this.getViewByTotleIndex(this.getTotleViewIndex(this.currentView)+1);
		if(nextView){
			this.showView(nextView);
		}else{
			this.showView(this.firstView());
		}
	},
	createTbarMenu : function(){
		var tbarMenus = [];
		if(this.needTbar){
			this.topToolbar.items.each(function(button){
				if(button.text && button.handler && !button.hidden){
					var menuCfg = {};
					menuCfg.text = button.text;
					menuCfg.tbutton = button;
					menuCfg.handler = button.handler;
					tbarMenus.push(menuCfg);
				}
			});
		}
		return tbarMenus;
	},
	onContextMenu : function(eve, added){
		this._APP.onContextMenu(eve, added);
	}
});
Ext.reg('resultcontainer', Wlj.frame.functions.app.widgets.ResultContainer);

Ext.ns('Wlj.frame.functions.app.widgets');

Wlj.frame.functions.app.widgets.SearchGrid = Ext.extend(Ext.Panel, {
	
	pageSize : 10,
	pagable : true,
	easingStrtegy : false,
	store : false,
	currentParams : {},
	autoScroll : false,
	rnWidth : 40,
	needRN : false,
	
	beresized : function(p,aw,ah,rw,rh){
		var h = parseInt(ah, 10);
		var titleH = this.titleTile.titleTile.el.getViewSize().height;
		var bbarH = this.bbar ? this.bbar.getViewSize().height : 0;
		var bh = h - titleH - 2 - bbarH;
		var w = parseInt(aw, 10);
		if(Ext.isNumber(bh)){
			this.scrollElement.applyStyles({
				height : bh + 'px'
			});
		}
		if(Ext.isNumber(w)){
			this.hdElement.applyStyles({
				width : w + 'px'
			});
		}
	},
	onColumnResize : function(index, res, width, height, e, name, totleWidth){
		this.store.fields.get(name).resutlWidth = width;
		this.searchDomain.dataFields[index-1].resutlWidth = width;
		this.getLayoutTarget().applyStyles({
			width : totleWidth + 'px'
		});
		var rows = this.getRows();
		var len = rows.length;
		for(var i=0;i<len;i++){
			rows[i].style.width = totleWidth+'px';
			rows[i].childNodes[index].style.width = width+'px';
		}
	},
	initComponent : function(){
		var _this = this;
		if(this.pagable){
			this.pageSizeCombo = new Ext.form.ComboBox({
				triggerAction : 'all',
				mode : 'local',
				store : new Ext.data.ArrayStore({
					fields : ['value', 'text'],
					data : [ [ 10, '10条/页' ], 
					         [ 20, '20条/页' ], 
					         [ 50, '50条/页' ],
					         [ 100, '100条/页' ], 
					         [ 250, '250条/页' ],
					         [ 500, '500条/页' ],
					         [ 1000, '1000条/页'] ]
				}),
				width:80,
				valueField : 'value',
				displayField : 'text',
				value : _this.pageSize,
				editable : false,
				listeners : {
					select : function(combo, record, index){
						var ps = parseInt(combo.getValue());
						_this.currBar.pageSize = ps;
						_this.searchDomain.pageSize = ps;
						_this.pageSize = ps;
						_this._APP.searchDomain.searchHandler();
					}
				}
			});
			
			this.bbar = new Ext.PagingToolbar({
				pageSize : _this.pageSize,
				store : _this.store,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条，共{2}条',       
				emptyMsg : "没有符合条件的记录",
				items : ['-', '&nbsp;&nbsp;',this.pageSizeCombo],
				listeners:{
					'beforechange':function(a,b){
						if(!_this._APP.searchDomain.searchPanel.getForm().isValid()){
							Ext.Msg.alert("提示",'请填写必要的查询条件');
							return false;
						}
						pars = _this._APP.searchDomain.searchPanel.getForm().getFieldValues();
						for(var key in pars){
							if(!pars[key]){
								delete pars[key];
							}
						}
						var a = _this._APP.setSearchParams(pars,false,true);
						if(a!=undefined&&!a){
							return false;
						}
					}
				}
			});
			this.currBar = this.bbar;
			this.bbarCfg = {
					cls : 'yc-grid-footer'
			};
		}
		Wlj.frame.functions.app.widgets.SearchGrid.superclass.initComponent.call(this);
		if(!this.store){
			return;
		}
		this.initDataEvent();
	},
	
	destroy : function(){
		this.pageSizeCombo.destroy();
		this.pageSizeCombo = false;
		this.currBar.destroy();
		this.currBar = false;
		this.store = false;
		this.currentParams = {};
		Ext.destroy(this.hdElement);
		Ext.destroy(this.scrollElement);
		Ext.destroy(this.dtElement);
		delete this.hdElement;
		delete this.scrollElement;
		delete this.dtElement;
		Wlj.frame.functions.app.widgets.SearchGrid.superclass.destroy.call(this);
	},
	
	onRender : function(ct, position){
		Wlj.frame.functions.app.widgets.SearchGrid.superclass.onRender.call(this, ct, position);
		this.initElements();
		this.on('resize',this.beresized);
	},
	createTbarMenu : function(added){
		var tbars = this.searchDomain.createTbarMenu();
		if(tbars.length > 0){
			added.push.apply(added, tbars);
			added.push('-');
		}
	},
	onMetaAdd : function(field){
		this.titleTile.onMetaAdd(field);
	},
	onMetaAddByIndex : function(addField, theIndex){
		this.titleTile.onMetaAddByIndex(addField, theIndex);
	},
	onMetaRemove : function(field){
		this.titleTile.onMetaRemove(field);
		this.dtElement.dom.style.width = this.titleTile.recordWidth+'px';
	},
	onContextMenu : function(eve, html, obj, added){
		var row = Ext.fly(html).parent('.ygc-row');
		
		if(row){
			if(!row.hasClass('ygc-row-selected')){
				this.onRowClick(eve, html, obj);
			}
			this.createTbarMenu(added);
		}
		
		var gmenus = WLJUTIL.contextMenus.grid;
		for(var key in gmenus){
			var amenu = {};
			amenu.text = gmenus[key].text;
			amenu.handler = gmenus[key].fn.createDelegate(this);
			added.push(amenu);
		}
		added.push('-');
		this.searchDomain.onContextMenu(eve,added);
	},
	initEvents : function(){
		this.addEvents({
			recorddelete : true,
			recordselect : true,
			rowdblclick : true
		});
		var _this = this;
		this.getLayoutTarget().on('click',function(eve, html, obj){
			_this.onRowClick(eve, html, obj);
		});
		this.getLayoutTarget().on('dblclick', function(eve, html, obj){
			eve.stopEvent();
			_this.onRowDblclick(eve, html, obj);
		});
		this.getLayoutTarget().on('mousedown', function(eve, html, obj){
			eve.stopEvent();
			if(Ext.fly(html).hasClass('ygc-cell-no') || Ext.fly(html).hasClass('ygc-row')){
				return false;
			}
			_this.createDragGhost(eve, html, obj);
		});
		this.el.on('contextmenu',function(eve, html, obj){
			eve.stopEvent();
			_this.onContextMenu(eve, html, obj, []);
		});
	},
	onRowClick : function(eve, html, obj){
		var _this = this;
		var row = Ext.fly(html).hasClass('ygc-row')?Ext.fly(html):Ext.fly(html).parent('.ygc-row');
		if(!row){
			return false;
		}
		var rowIndex = parseInt(row.dom.getAttribute('rowIndex'));
		if(Ext.fly(html).hasClass('ygc-cell-no')){
			if(!row.hasClass('ygc-row-selected')){
				row.addClass('ygc-row-selected');
				_this.fireEvent('recordselect',this.store.getAt(rowIndex), this.store, html);
			}else{
				row.removeClass('ygc-row-selected');
			}
			return;
		}else{
			if(!row.hasClass('ygc-row-selected')){
				_this.clearSelect();
				row.addClass('ygc-row-selected');
				_this.fireEvent('recordselect',this.store.getAt(rowIndex), this.store, html);
			}else{
				_this.clearSelect();
				row.removeClass('ygc-row-selected');
			}
		}
	},
	onRowDblclick : function(eve, html, obj){
		var _this = this;
		var row = Ext.fly(html).parent('.ygc-row');
		var rowIndex = parseInt(row.dom.rowIndex);
		if(!row.hasClass('ygc-row-selected')){
			this.onRowClick(eve, html, obj);
		}
		_this.fireEvent('rowdblclick',html, this.store.getAt(rowIndex));
	},
	createDragGhost : function(eve, html, obj){
		var data = this.getCellData(html);
		if(this.store.fields.get(data.name).enableCondition === false){
			return false;
		}
		var ds = new Wlj.frame.functions.app.widgets.CellDD(Ext.fly(html), {
			dragData : {tile:{data:data}},
			ddGroup : 'searchDomainDrop'
		});
		ds.handleMouseDown(eve, ds);
	},
	initElements : function(){
		var Element = Ext.Element;
		var body = this.body;
		this.hdElement = body.createChild({
			tag : 'div',
			cls : 'yc-grid-header',
			style : 'width:100%;overflow:hidden;'
		});
		this.scrollElement = body.createChild({
			tag : 'div',
			style : 'overflow:auto;'
		});
		this.dtElement = this.scrollElement.createChild({
			tag : 'div',
			style : 'min-height:1px;'
		});
		this.createFieldsTitle();
	},
	getCellData : function(html){
		var row = Ext.fly(html).parent('.ygc-row');
		var rowIndex = parseInt(row.dom.getAttribute('rowIndex'));
		if(!Ext.fly(html).hasClass("ygc-cell")){
			html = Ext.fly(html).parent(".ygc-cell").dom;
		}
		var colIndex = Array.prototype.indexOf.call(row.dom.childNodes, html);
		var cellDT = this.titleTile.titleTile.items.itemAt(colIndex).data;
		cellDT.value = this.store.getAt(rowIndex).get(cellDT.name);
		return cellDT;
	},
	getLayoutTarget : function(){
		return this.dtElement;
	},
	createFieldsTitle : function(){
		var bwrap = this.bwrap;
		var body = this.body;
		var _this = this;
		this.titleTile = new Wlj.frame.functions.app.widgets.TitleTile({
			store : _this.store,
			vs : _this.vs,
			_APP : _this._APP,
			rnWidth : _this.rnWidth,
			searchGridView : _this,
			needRN : _this.needRN,
			easingStrtegy : _this.easingStrtegy
		});
		this.titleTile.titleTile.render(this.hdElement); 
		this.hdElement.applyStyles({
			height : this.titleTile.titleTile.el.getViewSize().height
		});
		this.titleTile.titleTile.el.applyStyles({
			top : 0,
			left : 0,
			marginTop : 0,
			marginLeft : 0
		});
		this.dtElement.applyStyles({
			width : this.titleTile.titleTile.el.getViewSize().width
		});
		this.scrollElement.on('scroll',function(){
			_this.synHDScroll();
		});
	},
	synHDScroll : function(){
		var innerHd = this.hdElement.dom ;
		var scrollLeft = this.scrollElement.dom.scrollLeft;
		innerHd.scrollLeft = scrollLeft;
		innerHd.scrollLeft = scrollLeft; // second time for IE (1/2 time first fails, other browsers ignore)
		
//		if(innerHd.scrollLeft<scrollLeft){
//			innerHd.style.marginLeft = (innerHd.scrollLeft-scrollLeft) + 'px'
//		}else{
//			if(parseInt(innerHd.style.marginLeft)!=0){
//				innerHd.style.marginLeft = 0;
//			}
//		}
	},
	booterDataElements : function(store, records){
		var _this = store.resultContainer;
		_this.clearRows();
		_this.titleTile.bootEls();
	},
	hasRows : function(){
		var ltEl = this.getLayoutTarget();
		if(ltEl.dom.firstChild){
			return true;
		}else return false;
	},
	clearRows : function(){
		var _this = this;
		_this.getLayoutTarget().dom.innerHTML = '';
	},
	getRows : function(){
		var _this = this;
		if(!_this.hasRows()){
			return [];
		}else{
			return this.getLayoutTarget().dom.childNodes;
		}
	},
	initDataEvent : function(){
		if(!this.store){
			this.initStore();
		}
		if(this.store){
			this.store.on('add', this.onDataAdd);
			this.store.on('load', this.onDataLoad);
			this.store.on('exception', this.onExceptionLoad);
			this.store.on('beforeload', this.onBeforeLoad);
			this.store.on('remove', this.onDataRemove);
			this.store.on('clear', this.onDataClear);
			this.store.resultContainer = this;
		}
	},
	onDataAdd : function(store, records, index){
		var _this = store.resultContainer;
		_this.booterDataElements(store, records);
	},
	onDataLoad : function(store, records, option){
		var _this = store.resultContainer;
		_this.totalLength = store.totalLength;
		_this.booterDataElements(store, records);
		_this._APP.unmaskRegion('resultDomain');
		_this._APP.enableConditionButton(WLJUTIL.BUTTON_TYPE.SEARCH);
	},
	onExceptionLoad : function(store, records, option){
		var _this = this.resultContainer;
		_this._APP.unmaskRegion('resultDomain');
		_this._APP.enableConditionButton(WLJUTIL.BUTTON_TYPE.SEARCH);
	},
	onBeforeLoad : function(store, option){
		var _this = store.resultContainer;
		delete option.add;
		store.removeAll();
		if(_this.getLayoutTarget())
			_this.getLayoutTarget().innerHTML = '';
		_this._APP.maskRegion('resultDomain',_this.searchDomain.loadMaskMsg);
		_this._APP.disableConditionButton(WLJUTIL.BUTTON_TYPE.SEARCH);
	},
	onDataRemove : function(store, record, index){
		store.resultContainer.getLayoutTarget().dom.removeChild(store.resultContainer.getLayoutTarget().dom.childNodes[index]);
	},
	onDataClear : function(store){
		if(store.resultContainer.getLayoutTarget())
			store.resultContainer.getLayoutTarget().dom.innerHTML = '';
	},
	turnToCurrentPage : function(callbackFn){
		var _this = this;
		if(!this.store || !this.store.load){
			return false;
		}
		var pars = this.currentParams;
		this.store.baseParams = {"condition":Ext.encode(pars)};
		this.store.load({
			params : {
				start : 0 ,
				limit : _this.pageSize
			},callback : function(){
				if(!_this.searchDomain.gridLockedHole){
					if(!_this.searchDomain.gridLockedOnce){
						_this.searchDomain.gridMoveIn();
					}else{
						_this.searchDomain.gridLockedOnce = false;
					}
				}
				if(_this.searchDomain.suspendViews){
					if(!_this.searchDomain.alwaysLockCurrentView){
						_this.searchDomain.hideCurrentView();
					}
				}
				if(Ext.isFunction(callbackFn)){
					callbackFn();
				};
			}
		});
	},
	getSelected : function(){
		var _this = this;
		_this.selected = [];
		this.el.select('.ygc-row-selected').each(function(se){
			_this.selected.push(_this.store.getAt(parseInt(se.getAttribute('rowIndex'))));
		});
		return _this.selected;
	},
	selectByIndex : function(index){
		var _this = this;
		if(Ext.isNumber(index)){
			this.clearSelect();
			if(this.el.select('.ygc-row').item(parseInt(index)))
				this.el.select('.ygc-row').item(parseInt(index)).addClass('ygc-row-selected');
		}else if(Ext.isArray(index)){
			if(index.length>0){
				this.clearSelect();
				Ext.each(index, function(i){
					if(_this.el.select('.ygc-row').item(parseInt(i)))
						_this.el.select('.ygc-row').item(parseInt(i)).addClass('ygc-row-selected');
				});
			}
		}
	},
	clearSelect : function(){
		this.el.select('.ygc-row-selected').removeClass('ygc-row-selected');
	},
	antiSelect : function(){
		var rws = this.getLayoutTarget().select('.ygc-row', true);
		rws.each(function(el){
			if(!el.hasClass('ygc-row-selected')){
				el.addClass('ygc-row-selected');
			}else{
				el.removeClass('ygc-row-selected');
			}
		});
	},
	allSelect : function(){
		this.getLayoutTarget().select('.ygc-row').addClass('ygc-row-selected');
	},
	sort : function(dataIndex, info){
		this.titleTile.updateSortIcon(dataIndex, info);
		this.store.sort(dataIndex, info);
		this.booterDataElements(this.store);
	},
	showFields : function(fields){
		var indexes = this.getFieldsIndex(fields);
		for(var i=0;i<indexes.length;i++){
			this.store.fields.get(indexes[i]).hidden = false;
			this.searchDomain.dataFields[indexes[i]].hidden = false;
		}
		this.titleTile.showFields(indexes);
		var rows = this.getRows();
		for(var i=0;i<rows.length;i++){
			for(var c=0; c<indexes.length; c++){
				if(indexes[c]>=0 && indexes[c] < rows[i].childNodes.length){
					rows[i].childNodes[indexes[c]+1].style.display='block';
				}
			}
			rows[i].style.width = this.titleTile.recordWidth+'px';
		}
		this.dtElement.dom.style.width = this.titleTile.recordWidth+'px';
	},
	hideFields : function(fields){
		var indexes = this.getFieldsIndex(fields);
		for(var i=0;i<indexes.length;i++){
			this.store.fields.get(indexes[i]).hidden = true;
			this.searchDomain.dataFields[indexes[i]].hidden = true;
		}
		this.titleTile.hideFields(indexes);
		var rows = this.getRows();
		for(var i=0;i<rows.length;i++){
			for(var c=0; c<indexes.length; c++){
				if(indexes[c]>=0 && indexes[c] < rows[i].childNodes.length){
					rows[i].childNodes[indexes[c]+1].style.display='none';
				}
			}
			rows[i].style.width = this.titleTile.recordWidth+'px';
		}
		this.dtElement.dom.style.width = this.titleTile.recordWidth+'px';
	},
	getFieldsIndex : function(fields){
		var fnames = [];
		var findexes = [];
		if(Ext.isArray(fields)){
			fnames = fields;
		}else{
			fnames = [fields];
		}
		for(var i=0; i<fnames.length; i++){
			var index = this.store.fields.indexOf(this.store.fields.get(fnames[i]));
			if(index >= 0){
				findexes.push(index);
			}
		}
		return findexes;
	},
	nextPageHandler : function(){
		if(!this.currBar.next.disabled){
			this.currBar.moveNext();
		}
	},
	prePageHandler : function(){
		if(!this.currBar.prev.disabled){
			this.currBar.movePrevious();
		}
	},
	firstPageHandler : function(){
		if(!this.currBar.first.disabled)
			this.currBar.moveFirst();
	},
	lastPageHandler : function(){
		if(!this.currBar.last.disabled)
			this.currBar.moveLast(); 
	},
	refreshPageHandler : function(){
	},
	setFieldTitle : function(cfg){
		this.titleTile.setFieldTitle(cfg);
	}
});
Ext.reg('searchgridview', Wlj.frame.functions.app.widgets.SearchGrid);
Wlj.frame.functions.app.widgets.TitleTile = function(cfg){
	Ext.apply(this,cfg);
	Wlj.frame.functions.app.widgets.TitleTile.superclass.constructor.call(this);
	this.createTitle();
	this.createRecordTileEl();
};
Ext.extend(Wlj.frame.functions.app.widgets.TitleTile, Ext.util.Observable, {
	
	alwaysField : true,
	float : 'left',
	
	lineHeight : 27,
	defaultFieldWidth : 150,
	rnWidth : 40,
	needRN : false,
	easingStrtegy : false,
	multiSelectSeparator : ',',
	
	getTitleClass : function(field){
		var dataType = field.dataType;
		if(dataType && WLJDATATYPE[dataType]){
			dataType = WLJDATATYPE[dataType];
			return dataType.getTitleClass();
		}
		return '';
	},
	createTitle : function(){
		var _this = this;
		_this.recordWidth = 0;
		var fields = this.store.fields;
		var fieldsTiels = [];
		if(this.needRN){
			this.indexTile = new Wlj.widgets.search.tile.Tile({
				ownerW : 10,
				removeable : false,
				dragable : false,
				baseSize : _this.lineHeight,
				baseWidth : _this.rnWidth,
				baseMargin : 0,
				cls : 'ygh-hd',
				float : 'left',
				html : '序号'
			});
			this.indexTile.on('afterrender', function(itile){
				itile.el.on('click',function(){
					if(!itile.__ALLS){
						_this.store.resultContainer.allSelect();
						itile.__ALLS=true;
					}else{
						_this.store.resultContainer.clearSelect();
						itile.__ALLS=false;
					}
				});
			});
			fieldsTiels.push(this.indexTile);
			_this.recordWidth = parseInt(_this.recordWidth) + parseInt(this.indexTile.baseMargin)*2 + parseInt(_this.rnWidth) + 12;
		}
		
		fields.each(function(field){
			var tf = _this.createFieldTile(field);
			if(tf){
				fieldsTiels.push(tf);
			}
		});
		var tile = new Wlj.widgets.search.tile.Tile({
			ownerW : 10,
			ownerWI : -10,
			removeable : false,
			dragable : false,
			baseSize : _this.lineHeight,
			baseWidth : _this.recordWidth,
			baseMargin : 1,
			recordView : this,
			cls : 'ygh-container',
			float : 'left',
			style : {
				//border : '1px solid #000',
				overflowX :'hidden'
			},
			pos_size : {
				TX : 0,
				TY : 0,
				TW : 1,
				TH : 1
			},
			items : fieldsTiels,
			listeners : {
				afterrender : function(tileThis){
					tileThis.el.on('contextmenu', function(eve, html, obj){
						eve.stopEvent();
						tileThis.recordView.onTitleContextMenu(eve, html, obj, []);
					});
					_this.initColumnDD();
				}
			}
		});
		_this.titleTile = tile;
	},
	createDataIndexEl : function(){
		var _this = this;
		var indexHTML = '<div class="ygc-cell ygc-cell-no" style="width:'+_this.rnWidth+'px;position: relative; margin: 0px; float: left; height: 27px;">'+
			'{index+1}' + 
			'</div>';
		return indexHTML;
	},
	createFieldEl : function(tf){
		var _this=  this;
		var fieldHTML = '';
		if(tf.text && tf.gridField !== false){
				fieldHTML =
					'<tpl for="'+tf.name+'">'+
					'<div title="{title}" class="ygc-cell '+_this.getFieldClass(tf)+'" style="position: relative; margin: 0px; width: '+
					(tf.resutlWidth?tf.resutlWidth:_this.defaultFieldWidth)+'px; float: left; height: 27px; '+(tf.hidden?'display:none;':'')+'">'+
					'{display}'+
					'</div>'+
					'</tpl>';
				return fieldHTML;
		}
		return '';
	},
	createRecordTileEl : function(){
		var _this = this;
		var store = this.store;
		var fields = store.fields;
		var ElBuffer = [];
		var createString = '<div class="ygc-row {oddc}" style="position: relative; overflow-x: hidden; margin: 0px; width: '+this.recordWidth+'px; float: left; height: 27px;" rowIndex="{index}">';
		ElBuffer.push(createString);
		ElBuffer.push(this.createDataIndexEl());
		ElBuffer.push('<tpl for="data">');
		fields.each(function(tf){
			ElBuffer.push(_this.createFieldEl(tf));
		});
		ElBuffer.push('</tpl>');
		ElBuffer.push('</div>');
		_this.recordTemplate = new Ext.XTemplate(ElBuffer.join(''),{
			formatFieldData : function(field, data){
				var dataFormat = '&nbsp;';
				if(data){
					dataFormat = data;
				}
				if(Ext.isFunction(field.viewFn)){
					dataFormat = field.viewFn(dataFormat);
				}
				return dataFormat;
			}
		});
	},
	bootEls : function(){
		var _this = this;
		var dc = this.store.getCount();
		
		if(!_this.easingStrtegy || 
		   !_this.easingStrtegy.type || 
		   !_this.easingStrtegy.firstStep || 
		   !Ext.isFunction(_this[_this.easingStrtegy.type+'DataLineRender']) ||
		   dc <= _this.easingStrtegy.firstStep){
			_this.defaultDataLineRender();
		}else{
			_this[_this.easingStrtegy.type+'DataLineRender'].call(_this, _this.easingStrtegy.initialConfig);
		}
	},
	defaultDataLineRender : function(){
		var _this = this;
		var grid = this.searchGridView;
		var layoutEl = grid.getLayoutTarget();
		var store = this.store;
		store.data.each(function(item, index, length){
			var oddc = index % 2 ===0 ? "ygc-row-odd" : "";
			var data = _this.buildData(item);
			_this.recordTemplate.append(layoutEl, {
				oddc : oddc,
				index : index,
				data : data
			});
		});
	},
	settimeoutDataLineRender : function(initialConfig){
		var _this = this;
		var grid = this.searchGridView;
		var layoutEl = grid.getLayoutTarget();
		var store = this.store;
		var firstStep = this.easingStrtegy.firstStep ?  this.easingStrtegy.firstStep : 50;
		store.data.each(function(item, index, length){
			var oddc = index % 2 ===0 ? "ygc-row-odd" : "";
			var data = _this.buildData(item);
			if(index < firstStep){
				_this.recordTemplate.append(layoutEl, {
					oddc : oddc,
					index : index,
					data : data
				});
			}else{
				setTimeout(function(){
					_this.recordTemplate.append(layoutEl, {
						oddc : oddc,
						index : index,
						data : data
					});
				},1);
			}
		});
	},
	
	buildData : function(record){
		var _this = this;
		var dataObj = {};
		record.fields.each(function(tf){
			var fData = _this.formatFieldData(tf,_this.translateFieldData(tf, record.get(tf.name)));
			dataObj[tf.name] = {
					display : fData,
					title : tf.noTitle===true?tf.text:record.get(tf.name)
			};
		});
		return dataObj;
	},
	getFieldClass : function(field){
		var dataType = field.dataType;
		if(dataType && WLJDATATYPE[dataType]){
			dataType = WLJDATATYPE[dataType];
			return dataType.getFieldClass();
		}
		return '';
	},
	
	formatFieldData : function(field, data){
		var dataFormat = '&nbsp;';
		if(data){
			dataFormat = data;
		}
		if(Ext.isFunction(field.viewFn)){
			dataFormat = field.viewFn(dataFormat);
		}
		return dataFormat;
	},
	translateFieldData : function(field, data){
		var app = this._APP;
		var reData = '&nbsp';
		if(field.translateType){
			if (field.multiSelect) {
				var separator = field.multiSeparator?field.multiSeparator:this.multiSelectSeparator;
				var de = app.translateLookupByMultiKey(field.translateType, data, separator);
			} else {
				var de = app.translateLookupByKey(field.translateType, data);
			}
			if(de){
				reData = de;
			}
		}else{
			reData = data;
		}
		
		var dataType = field.dataType;
		if(dataType && WLJDATATYPE[dataType]){
			dataType = WLJDATATYPE[dataType];
			if(reData !== '&nbsp'){
				reData = dataType.formatFn(reData);
				dataType = null;
			}
		}
		return reData;
	},
	initColumnDD : function(){
		var _this = this;
		this.DropZone = new Ext.dd.DropZone(_this.titleTile.el.dom, {
			ddGroup : 'searchDomainDrop',
			notifyDrop  : function(ddSource, e, data){
				var px = e.getXY()[0];
				var py = e.getXY()[1];
				var newIndex = 0;
				var tf = _this.titleTile.el.first().first('.ygh-hd');
				while(tf){
					if(px <= tf.getRight()){
						break;
					}else{
						tf = tf.next();
						newIndex ++;
					}
				}
				setTimeout(function(){
					_this.setColumnOrder(data.tile.data.name,newIndex);
				},50);
			}
		});	
	},
	createFieldTile : function(tf){
		var _this = this;
		if( tf.text && tf.gridField !== false){
			var tfHTML = '<div title="'+tf.text+'" class="ygh-hd-text">'+tf.text+'</div>';
			var fTile = new Wlj.widgets.search.tile.Tile({
				ownerW : 10,
				removeable : false,
				dragable : !(tf.enableCondition === false),
				defaultDDGroup : 'searchDomainDrop',
				baseSize : _this.lineHeight,
				baseWidth : tf.resutlWidth ? tf.resutlWidth : _this.defaultFieldWidth,
				float : 'left',
				cls : 'ygh-hd '+_this.getTitleClass(tf),
				baseMargin : 0,
				html : tfHTML,
				data : {
					name : tf.name,
					value : ''
				},
				clearSortIcon : function(){
					this.el.first().removeClass('ygh-hd-order-desc');
					this.el.first().removeClass('ygh-hd-order-asc');
				},
				addSortIcon : function(info){
					this.el.first().addClass('ygh-hd-order-'+info);
				},
				listeners : {
					afterrender : function( tileThis ){
						tileThis.el.on('click',function(eve){
							eve.stopEvent();
							if(!tileThis.el.first().hasClass('ygh-hd-order-desc')){
								_this._APP.sortByDataIndex(tileThis.data.name,'desc');
							}else{
								_this._APP.sortByDataIndex(tileThis.data.name,'asc');
							}
						});
						tileThis.el.on('contextmenu',function(eve, html, obj){
							eve.stopEvent();
							_this.onTitleFieldContextMenu(eve, html, obj, []);
						});
						this.RESIZEABLE = new Ext.Resizable(this.el, {
							handles : 'e',
							height : this.el.getHeight(),
							width : this.el.getWidth()
						});
						this.RESIZEABLE.on('resize',function(res, width, height, e){
							e.stopEvent();
							var index = _this.titleTile.items.indexOf(tileThis);
							_this.onColumnResize(index, res, width, height, e, tileThis.data.name);
						});
						if(this.dragable){
							this.dd.startDrag = function(){
								this.tile.el.applyStyles({
									display:''
								});
								this.proxy.getEl().dom.innerText = this.tile.el.dom.innerText;
							};
						}
						if(tf.hidden){
							this.hide();
						}
					}
				}
			});
			if(!tf.hidden){
				_this.recordWidth = parseInt(_this.recordWidth) + parseInt(fTile.baseMargin)*2 + parseInt(fTile.baseWidth) + 12;
			}
			return fTile;
		}
		return false;
	},
	onColumnResize : function(index, res, width, height, e, name){
		var recordWidth = parseInt(this.recordWidth) - parseInt(this.titleTile.items.get(index).baseWidth) + parseInt(width);
		this.titleTile.items.get(index).baseWidth = width;
		this.titleTile.items.get(index).initialConfig.baseWidth = width;
		this.recordWidth = recordWidth;
		this.titleTile.baseWidth = recordWidth;
		this.titleTile.get(index).el.applyStyles({
			width : width + 'px'
		});
		this.titleTile.el.applyStyles({
			width : recordWidth + 'px'
		});
		Ext.fly(this.titleTile.layoutEl).applyStyles({
			width : recordWidth + 'px'
		});
		this.searchGridView.onColumnResize(index, res, width, height, e, name, recordWidth);
		this.createRecordTileEl();
	},
	setColumnOrder : function(name, index){
		var tile = null;
		this.titleTile.items.each(function(it){
			if(it.data && it.data.name === name){
				tile = it;
			}
		});
		var oldIndex = this.titleTile.items.indexOf(tile);
		var ic = tile.initialConfig;
		this.titleTile.remove(tile);
		this.titleTile.insert(index,new Wlj.widgets.search.tile.Tile(ic));
		this.titleTile.doLayout();
		var rows = this.searchGridView.getRows();
		for(var i=0;i<rows.length;i++){
			var tNode = rows[i].removeChild(rows[i].childNodes[oldIndex]);
			rows[i].childNodes[index-1].insertAdjacentElement('afterEnd', tNode);
		}
		var df = this.searchGridView.searchDomain.dataFields;
		var mf = false;
		for(var i=0;i<df.length;i++){
			if(df[i].name === name){
				mf = df[i];
				break;
			}
		}
		if(mf){
			df.remove(mf);
			df.splice(index-1,0,mf);
			this.searchGridView.searchDomain.storeMetaChange();
		}
		this.createRecordTileEl();
	},
	onMetaAdd : function(field){
		var addedTile = this.createFieldTile(field);
		var addedTile = this.titleTile.add(addedTile);
		this.resetWidth();
		this.titleTile.doLayout();
		this.createRecordTileEl();
		var addedTemp = new Ext.XTemplate(
				'<div class="ygc-cell" style="position: relative; margin: 0px; width: '+
				(field.resutlWidth ? field.resutlWidth : this.defaultFieldWidth)+'px; float: left; height: 27px;">'+
				'</div>');
		var rows = this.searchGridView.getRows();
		var len = rows.length;
		for(var i=0;i<len;i++){
			addedTemp.append(rows[i]);
			rows[i].style.width = this.recordWidth+'px';
		}
		
	},
	onMetaAddByIndex : function(addField, theIndex){
		var addedTile = this.createFieldTile(addField);
		var addedTile = this.titleTile.insert(theIndex+1, addedTile);
		this.resetWidth();
		this.titleTile.doLayout();
		this.createRecordTileEl();
	},
	onMetaRemove : function(field){
		var theTiles = this.titleTile.findBy(function(i){if(i.data && field===i.data.name)return true;return false;});
		if(theTiles.length>0){
			var theTile = theTiles[0];
			if(!theTile.hidden){
				this.recordWidth = parseInt(this.recordWidth) - (parseInt(theTile.baseMargin) * 2 + parseInt(theTile.baseWidth) + 12);
			}
			this.titleTile.remove(theTile);
			this.resetWidth();
			this.titleTile.doLayout();
			this.createRecordTileEl();
			var row = this.searchGridView.getRows();
			var len = row.length;
			for(var i=0;i<len;i++){
				row[i].style.width = this.recordWidth+'px';
			}
		}
	},
	resetWidth : function(){
		this.titleTile.el.applyStyles({
			width : this.recordWidth+'px'
		});
		Ext.fly(this.titleTile.getLayoutTarget()).applyStyles({
			width : this.recordWidth+'px'
		});
	},
	clearSortIcons : function(){
		this.titleTile.items.each(function(f){
			if(f.clearSortIcon){
				f.clearSortIcon.call(f);
			}
		});
	},
	updateSortIcon : function(dataIndex, info){
		this.titleTile.items.each(function(f){
			if(f.clearSortIcon){
				f.clearSortIcon.call(f);
			}
			if(f.data && f.data.name === dataIndex && f.addSortIcon){
				f.addSortIcon.call(f, info);
			}
		});
	},
	showFields : function(dataIndexes){
		var _this = this;
		Ext.each(dataIndexes, function(di){
			var f = _this.titleTile.items.get(di+1);
			if(f && f.hidden){
				_this.recordWidth = parseInt(_this.recordWidth) + (parseInt(f.baseMargin) * 2 + parseInt(f.baseWidth) + 12);
				f.show();
			}
		});
		this.titleTile.doLayout();
		_this.resetWidth();
		this.createRecordTileEl();
	},
	hideFields : function(dataIndexes){
		var _this = this;
		Ext.each(dataIndexes, function(di){
			var f = _this.titleTile.items.get(di+1);
			if(f && !f.hidden){
				_this.recordWidth = parseInt(_this.recordWidth) - (parseInt(f.baseMargin) * 2 + parseInt(f.baseWidth) + 12);
				f.hide();
			}
		});
		_this.resetWidth();
		this.createRecordTileEl();
	},
	onTitleContextMenu : function(eve, html, obj, added){
		this.searchGridView.onContextMenu(eve, html, obj, added);
	},
	onTitleFieldContextMenu : function(eve, html, obj, added){
		this.onTitleContextMenu(eve, html, obj, added);
	},
	destroy : function(){
		this.titleTile.removeThis();
	},
	setFieldTitle : function(cfg){
		var fieldTile = this.titleTile.items.find(function(t){
			if(t.data && t.data.name==cfg.name)
				return true;
		});
		if(!fieldTile){
			return false;
		}
		fieldTile.data.text = cfg.text;
		fieldTile.el.select('.ygh-hd-text').first().dom.title= cfg.text;
		fieldTile.el.select('.ygh-hd-text').first().dom.innerText= cfg.text;
		var cField = this._APP.getConditionField(cfg.name);
		if(cField){
			cField.setLabelText(cfg.text);
		}
	}
});
Wlj.frame.functions.app.widgets.CellProxy = Ext.extend(Object, {
	
	constructor : function(tile, config){
    	this.tile = tile;
    	this.id = this.tile.id +'-ddproxy';
    	Ext.apply(this, config);        
	},
	/**
	 * true:拖动的时候在容器内插入代理的节点；false：不插入。
	 */
	insertProxy : false,
    setStatus : Ext.emptyFn,
    reset : Ext.emptyFn,
    update : Ext.emptyFn,
    stop : Ext.emptyFn,
    sync: Ext.emptyFn,
    
    getEl :  function(){
		return this.ghost;
	},
	getGhost : function(){
		return this.ghost;
	},
	buildCellGhost : function(appendTo){
		var el = document.createElement('div');
			el.style.width =150 + 'px';
			el.style.height = 27 + 'px';
			el.className = 'x-panel-ghost '+this.tile.dom.className;
			el.innerHTML = '<b>'+this.tile.dom.innerText+'</b>';
			Ext.getDom(appendTo).appendChild(el);
		return Ext.get(el);
	},
	getProxy : function(){
		return this.proxy;
	},
	hide : function(){
		if(this.ghost){
			if(this.proxy){
				this.proxy.remove();
				delete this.proxy;
			}
			this.ghost.remove();
			delete this.ghost;
		}
	},
	show : function(){
		if(!this.ghost){
			this.ghost = this.buildCellGhost(Ext.getBody());
			this.ghost.setXY(this.tile.getXY());
			if(this.insertProxy){
				this.proxy = this.tile.el.insertSibling({cls:'tile'});
				this.proxy.setSize(this.tile.getSize());
			}
			//this.tile.el.dom.style.display = 'none';
		}
	},
	repair : function(xy, callback, scope){
		this.hide();
		if(typeof callback == 'function'){
			callback.call(scope || this);
		}
	},
	moveProxy : function(parentNode, before){
		if(this.proxy){
			parentNode.insertBefore(this.proxy.dom, before);
		}
	}
});

Wlj.frame.functions.app.widgets.CellDD = Ext.extend(Ext.dd.DragSource, {
	constructor : function(tile, cfg){
		this.tile = tile;
		this.proxy = new Wlj.frame.functions.app.widgets.CellProxy(tile, cfg);
		Wlj.frame.functions.app.widgets.CellDD.superclass.constructor.call(this, tile, cfg);
		var el = tile;
		this.scroll = false;
	},
	showFrame: Ext.emptyFn,
    startDrag: Ext.emptyFn,
    b4StartDrag : function(x, y){
		this.proxy.show();
	},
	b4MouseDown : function(e){
		var x = e.getPageX(),
			y = e.getPageY();
		this.autoOffset(x, y);
	},
	onInitDrag : function(x, y){
		this.onStartDrag(x, y);
		return true;
	},
	createFrame : Ext.emptyFn,
	getDragEl : function(e){
		return this.proxy.ghost.dom;
	},
	endDrag : function(e){
		this.proxy.hide();
		this.destroy();
	},
	autoOffset : function(x, y){
		x -= this.startPageX;
		y -= this.startPageY;
		this.setDelta(x, y);
	},
	onDrag : function(e){
	}
});Ext.ns('Wlj.frame.functions.app.widgets');
/**
 * 结果容器扩展面板基类;
 */
Wlj.frame.functions.app.widgets.View = Ext.extend(Ext.Panel,{
	autoEl : {
		tag : 'div',
		cls : 'wlj-view-container'
	},
	autoScroll : true,
	layout : 'fit',
	_defaultTitle : 'hello world',
	initComponent : function(){
		Wlj.frame.functions.app.widgets.View.superclass.initComponent.call(this);
		this.addEvents({
			movein : true,
			moveout : true,
			beforeloadrecord : true,
			loadrecord : true
		});
	},
	render : function(container, position){
		this.width = this.vs.width;
		Wlj.frame.functions.app.widgets.View.superclass.render.call(this,container, position);
	}
});
Ext.reg('basicview', Wlj.frame.functions.app.widgets.View);

/**
 * 查询结果系统扩展面板基类
 */
Wlj.frame.functions.app.widgets.RView = Ext.extend(Wlj.frame.functions.app.widgets.View,{
	_defaultTitle : 'Rview',
	ownerDomain : false,
	ownerApp : false,
	hideTitle : false,
	suspended : false,
	vs : false,
	tabIco : false,
	
	assistantView : false,
	
	initComponent : function(){
		this.width = this.vs.width;
		if(this.title){
			this._defaultTitle = this.title;
		}else{
			this.title = this._defaultTitle;
		}
		this.iconCls='hide-wvc-right';
		this.headerCssClass='wvc-header';
		if(!this.ownerDomain.suspendViews){
			delete this.title;
		}
		Wlj.frame.functions.app.widgets.RView.superclass.initComponent.call(this);
		var _this = this;
		if(_this.ownerDomain.needTbar){
			_this.togogleButton = this.ownerDomain.getTopToolbar().addButton({
				text : _this._defaultTitle,
				enableToggle : true,
				hidden : _this.hideTitle,
				iconCls : _this.tabIco,
				handler : function(){
					if(_this.ownerDomain.currentView === _this){
						if(_this.ownerDomain.suspendViews){
							_this.ownerDomain.hideCurrentView();
						}else{
							_this.ownerDomain.gridMoveIn();
						}
					}else{
						var result = _this.ownerDomain.showView(_this);
						if(result === false){
							_this.togogleButton.toggle( false );
						}
					}
				}
			});
		}
	},
	onRender : function(ct, position){
		Wlj.frame.functions.app.widgets.RView.superclass.onRender.call(this, ct, position);
		var _this  = this;
		if(_this.suspended){
			_this.header.on('click', function(e,t,o){
				e.stopEvent();
				if(_this.ownerDomain.suspendViews){
					_this.ownerDomain.hideCurrentView();
				}else{
					_this.ownerDomain.gridMoveIn();
				}
			});
		}
		if(_this.assistantView){
			if(!_this.assistantView.width){
				_this.assistantView.width = ct.getViewSize().width - _this.width;
			}
//			_this.assistantView.baseCls = 'wlj-view-container';
//			//_this.assistantView.iconCls='hide-wvc-right';
//			_this.assistantView.headerCssClass='wvc-header';
			_this.assistantView.height = ct.getViewSize().height;
			var av = new Ext.Panel(_this.assistantView);
			av.majorView = this;
			this.assistantView = av;
			av.render(ct);
			av.setHeight(_this.height);
			av.el.applyStyles({
				top:0+'px',
				position : 'absolute',
				marginLeft : (-av.width)+'px'
			});
			av.header.on('click', function(){
				_this.hideAssistant();
			});
		}
	},
	getIndex : function(){
		return this.ownerDomain.getTotleViewIndex(this);
	},
	setValues : function(object){
		if(!this.contentPanel){
			return false;
		}
		var cp = this.contentPanel;
		if(!cp.getForm || !cp.getForm()){
			return false;
		}
		var form = cp.getForm();
		form.setValues(object);
	},
	showAssistant : function(){
		if(this.assistantView && !this.assistantView.moveined){
			this.assistantView.el.animate({
				marginLeft : {to : 0, from : -this.assistantView.width}
			},
			.35,
			null,      
			'easeOut', 
			'run' );
			this.assistantView.moveined = true;
		}
	},
	hideAssistant : function(){
		if(this.assistantView && this.assistantView.moveined){
			this.assistantView.el.animate({
				marginLeft : {from : 0, to : -this.assistantView.width}
			},
			.35,
			null,      
			'easeOut', 
			'run' );
			this.assistantView.moveined = false;
		}
	}
});
Ext.reg('resultview', Wlj.frame.functions.app.widgets.RView);

/**
 * 系统扩展面板类：用于新增、修改、详情
 */
Wlj.frame.functions.app.widgets.CView = Ext.extend(Wlj.frame.functions.app.widgets.RView,{
	_defaultTitle : 'Cview',
	baseType : false,
	openValidate : true,
	svButton : true,
	fields : false,
	validates : false,
	linkages : false,
	formButtons : false,
	//layout : 'form',
	autoValidateText : '字段校验失败，请检查输入项!',
	
	suspendFitAll : false,
	
	toBeValidate : true,
	
	record : false,
	initComponent : function(){
		Wlj.frame.functions.app.widgets.CView.superclass.initComponent.call(this);
		this.width = this.vs.width;
		this.buildContent();
		this.add(this.contentPanel);
		var bt = this.baseType.toLowerCase();
		this.ownerDomain.fireEvent('before'+bt+'render', this);
	},
	destory : function(){
		this.contentPanel = false;
		Wlj.frame.functions.app.widgets.CView.superclass.destory.call(this);
	},
	
	onRender : function(ct, position){
		Wlj.frame.functions.app.widgets.CView.superclass.onRender.call(this,ct,position);
		this.fireEvent('afterviewrender', this);
	},
	initEvents : function(){
		this.addEvents({
			beforevalidate :true,
			validate : true,
			afterviewrender : true
		});
	},
	setRecord : function(record){
		this.record = record;
		if(this.rendered === true){
			var loadrecordable = this.fireEvent('beforeloadrecord', this, this.record);
			if(loadrecordable === false){
				return false;
			}
			this.contentPanel.getForm().reset();
			if(this.record){
				this.contentPanel.getForm().loadRecord(this.record);
			}
			this.fireEvent('loadrecord', this, this.record);
		}
	},
	reset : function(){
		if(this.contentPanel && this.contentPanel.getForm()){
			this.contentPanel.getForm().reset();
		}
	},
	buildContent : function(){
		var _this = this;
		this.contentPanel = new Ext.form.FormPanel({
			items : this.buildFormField(),
			frame:true,
			height : 'auto',
			autoScroll : true,
			buttonAlign : 'center',
			layout : 'form',
			buttons : _this.buildButtons()
		});
	},
	buildButtons : function(){
		var _this = this;
		var buttons = [];
		if(_this.svButton){
			var svButtonCfg = {
				text : '保存',
				cls:'simple-btn',
				overCls:'simple-btn-hover',
				handler : function(){
					if(_this.openValidate){
						var validateAble = _this.fireEvent('beforevalidate',_this,_this.contentPanel);
						if(validateAble === false){
							return false;
						}
						if(!_this.contentPanel.getForm().isValid()){
							Ext.MessageBox.alert('提示', _this.autoValidateText);
							return false;
						}
						var error = _this.validateData();
						_this.fireEvent('validate',_this,_this.contentPanel,error);
						if(!error.passable){
							Ext.Msg.alert('提示',error.info);
							return;
						}
					}
					var data = _this.contentPanel.getForm().getFieldValues();
					_this.ownerApp.comitData(data);
				}
			};
			buttons.push(svButtonCfg);
		}
		if(Ext.isArray(_this.formButtons)){
			Ext.each(_this.formButtons,function(fb){
				if(Ext.isString(fb.text)){
					if(Ext.isFunction(fb.fn)){
						fb.handler = function(){
							fb.fn.call(_this, _this.contentPanel, _this.contentPanel.getForm());
						};
					}else{
						fb.handler = Ext.emptyFn;
					}
					buttons.push(fb);
				}
			});
		}
		return buttons.length>0?buttons:false;
	},
	
	//private
	createColumnsCfg : function(columnCount, fields){
		var columnsCfg = [];
		var _this = this;
		for(var i=0; i< columnCount;i++){
			var cfg = {};
			cfg.layout = 'form';
			cfg.columnWidth = 1/columnCount;
			cfg.items = [];
			columnsCfg.push(cfg);
		}
		Ext.each(fields, function(f){
			if(Ext.isObject(f)){
				if(Ext.instanceOf(f,'container')){
					/**
					 * TODO special optional config for containers or subclassed of container.
					 */
				}else{
					f.fieldLabel  = f.text ? f.text : f.name;
					f.xtype = f.xtype? f.xtype : 'textfield';
					f.hidden = typeof f.hidden === 'boolean' ? f.hidden : f.text ? false : true;
					f.anchor = '90%';
					if(f.allowBlank === false){
						f.fieldLabel = WLJTOOL.addBlankFlag(f.fieldLabel);
					}
					if(f.translateType){
						f.xtype = f.multiSelect?'lovcombo':'combo';
						f.store = _this.ownerApp.lookupManager[f.translateType];
						if(!f.store){
							Ext.error('字段【'+f.text+'】的数据字典映射项store【'+f.translateType+'】获取错误，请检查[lookupTypes|localLookup]项配置');
							return false;
						}
						f.valueField = 'key';
						f.displayField = 'value';
						f.editable = typeof f.editable === 'boolean' ? f.editable : false;
						f.forceSelection = true;
						f.triggerAction = 'all';
						f.mode = 'local';
						f.hiddenName = f.name;
						f.separator = f.multiSeparator?f.multiSeparator:_this.ownerDomain.multiSelectSeparator;
					}else{
						f.name = f.name;
						if(f.dataType && WLJDATATYPE[f.dataType]){
							f.xtype = WLJDATATYPE[f.dataType].getFieldXtype();
							Ext.applyIf(f, WLJDATATYPE[f.dataType].getFieldSpecialCfg());
						}
					}		
					var changeListeners = {
							change : function(field,newValue,oldValue){
						_this.linkaging(field,newValue,oldValue);
					}
					};
					if(!f.listeners){
						f.listeners = changeListeners;
					}else{
						Ext.apply(f.listeners,changeListeners);
					}
				}
				var columnI = fields.indexOf(f) % columnCount;
				columnsCfg[columnI].items.push(f);
			}
		});
		return columnsCfg;
	},
	buildFormField : function(){
		var _this = this;
		var groups = _this.formViewer;
		var groupPanels = [];
		var vs = _this.vs;
		var columnCount = vs.width > 1024 ? 4:3;
		if(vs.width < 800 ){
			columnCount = 2;
		}
		if(vs.width < 500){
			columnCount = 1;
		}
		var allFields = _this.fields;
		Ext.each(groups, function(g){
			var gFs = g.fields;
			var gColumnCount = columnCount;
			if(g.columnCount){
				gColumnCount = g.columnCount;
			}
			var panelFieldsCfg = _this.getFieldsByName(gFs);
			if(!panelFieldsCfg){
				return;
			}
			
			var items;
			if(Ext.isFunction(g.fn)){
				try{
					items = g.fn.apply(_this, panelFieldsCfg);
				}catch(Werror){
					Ext.error('['+_this._defaultTitle+']面板第['+groups.indexOf(g)+']个字段组渲染出错,字段组将以默认顺序解析。见【formViewers|createFormViewer|editFormViewer|detailFormViewer】，TYPE:【'+Werror.name+'】;MESSAGE:【'+Werror.message+'】!');
					items = panelFieldsCfg;
				}
			}else{
				items = panelFieldsCfg;
			}
			items.length = panelFieldsCfg.length;
			var tItems = new Array();
			for(var ti=0; ti<items.length; ti++){
				if(Ext.isObject(items[ti]) && items[ti].hidden !== true){
					if( _this.baseType === "detailView" ){
						items[ti].readOnly = true;
					}
					tItems.push(items[ti]);
				}else continue;
			}
			items = _this.createColumnsCfg(gColumnCount,tItems);
			delete tItems;
			var lines = Math.ceil(gFs.length/gColumnCount);
			var panelCfg = {};
			panelCfg.xtype = 'panel';
			panelCfg.layout = 'column';
			if (g.labelWidth) {
				panelCfg.labelWidth = g.labelWidth;
			}
			panelCfg.items = items;
			groupPanels.push(panelCfg);
		});
		Ext.each(allFields,function(af){
			if(af.hidden || !af.text){
				af.xtype = 'textfield';
				af.hidden = true;
				groupPanels.push(af);
			}
		});
		return groupPanels;
	},
	getFieldsByName : function(name){
		if(!this.fields){
			return false;
		}
		if(!name){
			return false;
		}
		var _this = this;
		if(Ext.isArray(name)){
			var fields = new Array(name.length);
			Ext.each(_this.fields,function(f){
				if(name.indexOf(f.name)>=0){
					fields[name.indexOf(f.name)] = f;
				}
			});
			return fields.length>0?fields:false;
		}else if(Ext.isString(name)){
			for(var i=0;i< this.fields.length; i++){
				var field = this.fields[i];
				if(field.name === name){
					return field;
				}
			}
		}
		return false;
	},
	validateData : function(){
		var _this = this;
		var result = {
				passable : true,
				info : '',
				addInfo : function(info){
			result.info += '<br>' + info;
		}
		};
		if(!_this.toBeValidate){
			return result;
		}
		var vas = this.validates;
		if(!vas){
			return result;
		}
		var panel = _this.contentPanel;
		if(!panel.getForm()){
			return result;
		}
		var values = panel.getForm().getFieldValues();
		var _this = this;	
		
		Ext.each(vas,function(v){
			if(Ext.isFunction(v.fn)){
				var arrays = [];
				Ext.each(v.dataFields,function(vf){
					arrays.push(values[vf]);
				});
				try{
					if( v.fn.apply(v,arrays) === false){
						result.passable = false;
						result.addInfo(v.desc);
					}
				}catch(Werror){
					Ext.error('['+_this._defaultTitle+']面板校验规则['+v.desc+']:运行错误，校验结果将按照失败计算。见【validates|createValidates|editValidates】，TYPE:【'+Werror.name+'】;MESSAGE:【'+Werror.message+'】!');
					result.passable = false;
					result.addInfo(v.desc);
				}
			}else{
				Ext.warn('['+_this._defaultTitle+']面板校验规则['+v.desc+']函数配置有误，或者中途被改变，校验结果将按照成功计算');
			}
		});
		return result;
	},
	linkaging : function(field,newValue,oldValue){
		var _this = this;
		if(!_this.linkages){
			return;
		}
		var name = field.name;
		var _linkage = _this.linkages[name];
		if(!_linkage){
			return false;
		}
		var linkedFields = _this.getLinkFields(_linkage.fields);
		var allerror = '字段:';
		var haserror = false;
		Ext.each(linkedFields, function(lf){
			if(lf.noFieldError){
				haserror = true;
				allerror += '['+lf.name+']';
			}
		});
		if(haserror){
			Ext.error('['+_this._defaultTitle+']面板['+name+']字段联动错误。'+allerror+'不在定义的字段中。见【linkages|createLinkages|editLinkages】中fields属性');
		}
		linkedFields.unshift(field);
		try{
			_linkage.fn.apply(_this,linkedFields);
		}catch(Werror){
			Ext.error('['+_this._defaultTitle+']面板['+name+']字段联动逻辑运行错误。见【linkages|createLinkages|editLinkages】中fn属性，TYPE:【'+Werror.name+'】;MESSAGE:【'+Werror.message+'】!');
		}
	},
	getLinkFields : function(o){
		if(!Ext.isArray(o)){
			return false;
		}
		var linkFields = [];
		var _this = this;
		Ext.each(o, function(of){
			var ofo = _this.contentPanel.getForm().findField(of);
			if(ofo){
				linkFields.push(ofo);
			}else{
				linkFields.push({
					name : of,
					noFieldError : 'field:['+of+'] is not found!'
				});
			}
		});
		return linkFields;
	}
});
Ext.reg('cview', Wlj.frame.functions.app.widgets.CView);

/**
 * 结果容器扩展面板类，用户自定义扩展面板均采用此类面板做为容器；
 */
Wlj.frame.functions.app.widgets.BView = Ext.extend(Wlj.frame.functions.app.widgets.RView  ,{
	_defaultTitle : 'Bview',
	ownerDomain : false,
	ownerApp : false,
	vs : false,
	initComponent : function(){
		/***
		 * TODO fit all
		 */
		this.width = this.vs.width;
		Wlj.frame.functions.app.widgets.BView.superclass.initComponent.call(this);
	},
	getCustomerViewIndex : function(){
		return this.ownerDomain.getCustomerViewIndex(this);
	}
});
Ext.reg('buisnessview', Wlj.frame.functions.app.widgets.BView);

Wlj.frame.functions.app.widgets.FormView = Ext.extend(Wlj.frame.functions.app.widgets.BView ,{
	
	autoLoadSeleted : false,
	formButtons : false,
	
	initComponent : function(){
		delete this.buttons;
		Wlj.frame.functions.app.widgets.FormView.superclass.initComponent.call(this);
		this.buildContentObject();
		var _this = this;
		if(this.autoLoadSeleted){
			this.on('movein', function(rec){
				_this.loadRecord(rec);
			});
		}
		this.on('moveout', function(){
			_this.reset();
		});
	},
	buildContentObject : function(){
		var _this = this;
		this.resolveButtons();
		this.contentPanel = new Ext.form.FormPanel({
			items : _this.createGroups(),
			frame:true,
			height : 'auto',
			autoScroll : true,
			buttonAlign : 'center',
			labelAlign : 'center',
			layout : 'form',
			buttons : _this.formButtons
		});
		this.add(this.contentPanel);
	},
	resolveButtons : function(){
		var buts = this.formButtons;
		var _this = this;
		Ext.each(buts,function(b){
			delete b.handler;
			b.ownerView = _this;
			if(Ext.isFunction(b.fn)){
				b.handler = function(){
					b.fn.call(_this, _this.contentPanel, _this.contentPanel.getForm());
				};
			}
		});
	},
	createGroups : function(){
		var groupPanels = [];
		var groupCfgs = this.groups;
		var _this = this;
		Ext.each(groupCfgs, function(g){
			groupPanels.push(_this.createGroupPanel(g));
		});
		return groupPanels;
	},
	createGroupPanel : function(groupCfg){
		var panelCfg = {};
		var vs = this.vs;
		var columnCount;
		if(vs.width>1024){
			columnCount = 4;
		}else if(vs.width > 800){
			columnCount = 3;
		}else if(vs.width > 500){
			columnCount = 2;
		}else{
			columnCount = 1;
		}
		if(Ext.isNumber(groupCfg.columnCount)){
			columnCount = groupCfg.columnCount;
		}
		var fields = groupCfg.fields;
		panelCfg.layout = 'column';
		if (groupCfg.labelWidth) {
			panelCfg.labelWidth = groupCfg.labelWidth;
		}
		panelCfg.items = new Array();
		for(var i=0;i<columnCount;i++){
			panelCfg.items.push({
				layout : 'form',
				columnWidth : 1/columnCount
			});
		}
		var fieldsCfg = this.getFieldsCfg(fields);
		if(Ext.isFunction(groupCfg.fn)){
			try{
				fieldsCfg = groupCfg.fn.apply(this, fieldsCfg);
			}catch(Werror){
				fieldsCfg = fieldsCfg;
			}
		}else{
			fieldsCfg = fieldsCfg;
		}
		if(!fieldsCfg){
			fieldsCfg=[];
		}
		var fluse = fieldsCfg.length -1;
		while(fluse >=0 ){
			if(!Ext.isObject(fieldsCfg[fluse])){
				fieldsCfg.remove(fieldsCfg[fluse]);
			}
			fluse -- ;
		}
		for(var i=0;i<fieldsCfg.length; i++){
			if(!panelCfg.items[i%columnCount].items){
				panelCfg.items[i%columnCount].items=[];
			}
			panelCfg.items[i%columnCount].items.push(fieldsCfg[i]);
		}
		return panelCfg;
	},
	getFieldsCfg : function(fields){
		var result = [];
		var _this = this;
		if(Ext.isArray(fields)){
			Ext.each(fields, function(field){
				var f = false;
				if(Ext.isEmpty(field)){
					f = false;
				}else if(Ext.isString(field)){
					f =  _this.ownerApp.copyFieldsByName(field);
				}else{
					f =  field;
				}
				if(f){
					f.fieldLabel  = f.text ? f.text : f.name;
					f.xtype = f.xtype? f.xtype : 'textfield';
					f.hidden = f.text ? false : true;
					if(!f.anchor){
						f.anchor = '90%';
					}
					if(f.allowBlank === false){
						f.fieldLabel = WLJTOOL.addBlankFlag(f.fieldLabel);
					}
					if(f.translateType){
						f.xtype = f.multiSelect?'lovcombo':'combo';
						f.store = _this.ownerApp.lookupManager[f.translateType];
						if(!f.store){
							Ext.error('字段【'+f.text+'】的数据字典映射项store【'+f.translateType+'】获取错误，请检查[lookupTypes|localLookup]项配置');
							return false;
						}
						f.valueField = 'key';
						f.displayField = 'value';
						f.editable = typeof f.editable === 'boolean' ? f.editable : false;
						f.forceSelection = true;
						f.triggerAction = 'all';
						f.mode = 'local';
						f.hiddenName = f.name;
						f.separator = f.multiSeparator?f.multiSeparator:_this.ownerDomain.multiSelectSeparator;
					}else{
						f.name = f.name;
						if(f.dataType && WLJDATATYPE[f.dataType]){
							f.xtype = WLJDATATYPE[f.dataType].getFieldXtype();
							Ext.applyIf(f, WLJDATATYPE[f.dataType].getFieldSpecialCfg());
						}
					}
				}
				result.push(f);
			});
		}
		return result;
	},
	getFormPanel : function(){
		return this.contentPanel();
	},
	reset : function(){
		if(this.contentPanel && this.contentPanel.getForm()){
			this.contentPanel.getForm().reset();
		}
	},
	loadRecord : function(record){
		this.reset();
		if(record){
			this.contentPanel.getForm().loadRecord(record);
		}
	},
	getFieldByName : function(name){
		return this.contentPanel.getForm().findField(name);
	},
	getValues : function(asString){
		if(asString === true){
			return this.contentPanel.getForm().getValues(true);
		}else{
			return this.contentPanel.getForm().getValues(false);
		}
	}
});
Ext.reg('rformview', Wlj.frame.functions.app.widgets.FormView);


Wlj.frame.functions.app.widgets.GridView = Ext.extend(Wlj.frame.functions.app.widgets.BView, {
	
	url : false,
	fields : false,
	pageable : true,
	grideditable : false,
	isCsm : true,
	isRn : true,
	buttons : false,
	jsonCount : 'json.count',
	jsonRoot : 'json.data',
	
	initComponent : function(){
		Wlj.frame.functions.app.widgets.GridView.superclass.initComponent.call(this);
		this.collectFileds();
		this.buildStore();
		if(this.pageable){
			this.buildPagingBar();
		}
		this.buildGrid();
		this.add(this.grid);
	},
	
	collectFileds : function(){
		var fieldsCfg = [];
		var _this = this;
		if(Ext.isArray(_this.fields.fields)){
			Ext.each(_this.fields.fields, function(f){
				if(Ext.isString(f)){
					var fCFG = _this.ownerApp.copyFieldsByName(f);
					if(fCFG){
						fCFG.header = fCFG.text;
						if(!fCFG.text){
							fCFG.hidden = true;
						}
						fCFG.dataIndex = fCFG.name;
						delete fCFG.xtype;
						
						if(fCFG.dataType && WLJDATATYPE[fCFG.dataType]){
							fCFG.type = WLJDATATYPE[fCFG.dataType].getStoreType();
							Ext.applyIf(fCFG, WLJDATATYPE[fCFG.dataType].getStoreSpecialCfg());
						}
						
						fieldsCfg.push(fCFG);
					}
				}else if(Ext.isObject(f)){
					if(f.name){
						f.header = f.text;
						if(!f.text){
							f.hidden = true;
						}
						f.dataIndex = f.name;
						delete f.xtype;
						if(f.dataType && WLJDATATYPE[f.dataType]){
							f.type = WLJDATATYPE[f.dataType].getStoreType();
							Ext.applyIf(f, WLJDATATYPE[f.dataType].getStoreSpecialCfg());
						}
						fieldsCfg.push(f);
					}
				}else{
					fieldsCfg.push(false);
				}
			});
		}
		
		if(Ext.isFunction(_this.fields.fn)){
			try{
				fieldsCfg = _this.fields.fn.apply(this, fieldsCfg);
			}catch(Werror){
				fieldsCfg = fieldsCfg;
			}
		}else{
			fieldsCfg = fieldsCfg;
		}
		
		var i= fieldsCfg.length - 1;
		while(i>=0){
			if(!fieldsCfg[i]){
				fieldsCfg.remove(fieldsCfg[i]);
			}
			i--;
		}
		_this.fields.fields = fieldsCfg;
	},
	
	buildStore : function(){
		var _this = this;
		_this.store = new Ext.data.Store({
			restful:true,	
	        proxy : new Ext.data.HttpProxy({url:_this.url}),
	        reader : new Ext.data.JsonReader({
	        	totalProperty : _this.jsonCount,
	        	root : _this.jsonRoot
	        },_this.fields.fields)
		});		
	},
	
	buildPagingBar : function(){
		var _this = this;
		this.pagingCombo =  new Ext.form.ComboBox({
	        name : 'pagesize',
	        triggerAction : 'all',
	        mode : 'local',
	        store : new Ext.data.ArrayStore({
	            fields : ['value', 'text'],
	            data : [ [ 10, '10条/页' ], [ 20, '20条/页' ], [ 50, '50条/页' ],
							[ 100, '100条/页' ], [ 250, '250条/页' ],
							[ 500, '500条/页' ] ]
	        }),
	        valueField : 'value',
	        displayField : 'text',
	        value: 20,
	        editable : false,
	        width : 85
	    });
		this.pagingbar = new Ext.PagingToolbar({
			pageSize : parseInt(this.pagingCombo.getValue()),
			store : this.store,
			displayInfo : true,
			displayMsg : '显示{0}条到{1}条,共{2}条',       
			emptyMsg : "没有符合条件的记录",
			items : ['-', '&nbsp;&nbsp;', this.pagingCombo]
		});
		
		this.pagingCombo.on("select", function(comboBox) {
			_this.pagingbar.pageSize = parseInt(comboBox.getValue()),
	        _this.store.reload({
	            params : {
	                start : 0,
	                limit : parseInt(comboBox.getValue())
	            }
	        });
	    });
	},
	createTbarCfg : function(){
		var tbs = [];
		var _this = this;
		if(Ext.isArray(_this.gridButtons)){
			Ext.each(_this.gridButtons, function(gb){
				if(Ext.isFunction(gb.fn)){
					gb.handler = function(){
						gb.fn.call(_this, _this.grid);
					};
				}
				tbs.push(gb);
			});
		}
		return tbs.length>0 ? tbs : false;
	},
	
	buildGrid : function(){
		var _this = this;
		if(_this.isCsm){
			_this.csm = new Ext.grid.CheckboxSelectionModel();
			_this.fields.fields.unshift(_this.csm);
		}
		if(_this.isRn){
			_this.rn = new Ext.grid.RowNumberer({
		        header : 'No.',
		        width : 35
			});
			_this.fields.fields.unshift(_this.rn);
		}
		if(this.grideditable){
			this.grid = new Ext.grid.EditorGridPanel({
				store : _this.store,
				frame : true,
				clicksToEdit:1,
				tbar : _this.createTbarCfg(),
				viewConfig : {
					autoFill : false 
				},
				cm : new Ext.grid.ColumnModel(_this.fields.fields),
				sm : _this.isCsm?_this.csm:null,
				footer : false,
				bbar : _this.pageable ? _this.pagingbar : false
			});
		}else{
			this.grid = new Ext.grid.GridPanel({
				store : _this.store,
				frame : true,
				tbar : _this.createTbarCfg(),
				viewConfig : {
					autoFill : false 
				},
				cm : new Ext.grid.ColumnModel(_this.fields.fields),
				sm : _this.isCsm?_this.csm:null,
				footer : false,
				bbar : _this.pageable ? _this.pagingbar : false
			});
		}
	},	
	getStore : function(){
		return this.store;
	},
	getGrid : function(){
		return this.grid;
	},
//	nextpage : function(){},
//	prepage : function(){},
//	firstpage : function(){},
//	lastpage : function(){},
//	currentpage : function(){},
	setParameters : function(params){
		delete this.currentParams;
		delete this.store.baseParams;
		this.currentParams = params;
		this.store.baseParams = params;
		if(this.pageable){
			this.store.load({
				params : {
					start : 0,
					limit : this.pagingbar.pageSize                                                      
				}
			});
		}else{
			this.store.load();
		}
	},
	getSeleted : function(){}
});
Ext.reg('rgridview', Wlj.frame.functions.app.widgets.GridView);Ext.ns('Wlj.frame.functions.app.widgets');
Wlj.frame.functions.app.widgets.TreeManager = Ext.extend(Ext.util.Observable, {
	loaded : false,
	constructor : function(cfg){
		this.loaders = {};
		this.treesCfg = {};
		this.dataStores = {};
		Wlj.frame.functions.app.widgets.TreeManager.superclass.constructor.call(this, cfg);
	},
	addLoader : function(key, cfg){
		if(!Ext.isString(key)){
			Ext.warn('错误','loader的key值设置失败，应配置为String类型。');
			return false;
		}
		if(!cfg.url){
			Ext.warn('错误','loader['+key+']创建失败，没有URL');
			return false;
		}
		if(this.loaders[key]){
			Ext.warn('错误','key['+key+']:已存在对应loader对象，请修改key值');
			return false;
		}
		var _this = this;
		var loader = new Wlj.frame.functions.app.widgets.ArrayTreeLoader(cfg);
		Ext.Ajax.request({
			url : cfg.url,
			method:'GET',
			success:function(response){
				var nodeArra = Ext.util.JSON.decode(response.responseText);
				if(Ext.isString(loader.jsonRoot)){
					try{
						loader.nodeArray = eval('nodeArra.'+loader.jsonRoot);
					}catch(e){
						loader.nodeArray = nodeArra;
					}
				}else{
					loader.nodeArray = nodeArra;
				}
				
				var children = loader.loadAll();
				var lookupstore = new Ext.data.JsonStore({
					fields : [{
						name : 'key',
						mapping : 'id'
					},{
						name : 'value',
						mapping : 'text'
					}],
					data : loader.nodeArray
				});
				_this.dataStores[key] = lookupstore;
				Ext.each(loader.supportedTrees,function(atree){
					atree.appendChild(children);
				});
				if(Ext.isFunction(cfg.callback)){
					cfg.callback.apply(loader,[loader]);
				}
			}
		});
		this.loaders[key] = loader;
		return loader;
	},
	initTree : function(key, cfg){
		if(!Ext.isString(key)){
			Ext.warn('tree的key值设置失败，应配置为String类型。');
			return false;
		}
		if(this.treesCfg[key]){
			Ext.warn('key['+key+']:已存在对应tree面板配置，请修改key值');
			return false;
		}
		this.treesCfg[key] = cfg;
		return cfg;
	},
	/**
	 * cfg : string/object
	 */
	createTree : function(cfg){
		if(!this.loaded){
			this.loadTreesCfgs();
		}
		if(Ext.isString(cfg)){
			var treeCfg = this.treesCfg[cfg];
			if(!treeCfg){
				Ext.warn('['+cfg+']:未查找到相关树形结构配置！');
				return false;
			}
			if(treeCfg.loaderKey && !treeCfg.resloader){
				treeCfg.resloader = this.loaders[treeCfg.loaderKey];
			}
			
			var reTreeCfg = Ext.apply({
				autoScroll : true
			},treeCfg);
			
			if(reTreeCfg.rootCfg){
				reTreeCfg.root = new Ext.tree.AsyncTreeNode(reTreeCfg.rootCfg);
			}
			return new Wlj.frame.functions.app.widgets.TreePanel(reTreeCfg);
		}else{
			if(!cfg.key){
				Ext.warn('树形面板配置没有key字段，请为其配置string类型唯一key值！');
				return false;
			}
			if(this.initTree(cfg.key, cfg)){
				return this.createTree(cfg.key);
			}
		}
	},
	loadTreesCfgs : function(){
		this.checkTreesCfgs();
		this.loaded = true;
		Ext.log('初始化树形结构管理器！');
		var loaderCfgs = window.treeLoaders;
		var treesCfg = window.treeCfgs;
		if(Ext.isArray(loaderCfgs)){
			Ext.each(loaderCfgs, function(l){
				TreeManager.addLoader(l.key,l);
			});
			if(Ext.isArray(treesCfg)){
				Ext.each(treesCfg, function(t){
					TreeManager.initTree(t.key,t);
				});
			}
		}
	},
	checkTreesCfgs : function(){
		Ext.log('树形结构配置检查，treeLoaders|treeCfgs');
		var loaderKeyMap = {};
		if(!Ext.isArray(window.treeLoaders)){
			Ext.log('无树形结构数据源配置[treeLoaders],或配置结构不正确');
			window.treeLoaders = false;
			window.treeCfgs = false;
		}else{
			Ext.log('发现['+treeLoaders.length+']个树形结构数据源配置:');
			for(var tli =0; tli<treeLoaders.length;tli++){
				var tl = treeLoaders[tli];
				if(!tl.key){
					Ext.warn('第['+tli+']个树形结构数据源无key属性；将被忽略');
					continue;
				}
				if(!tl.url){
					Ext.warn('第['+tli+']个树形结构数据源无url属性；将被忽略');
					continue;
				}
				if(!tl.parentAttr){
					Ext.warn('第['+tli+']个树形结构数据源无parentAttr属性；将被忽略');
					continue;
				}
				if(!tl.locateAttr){
					Ext.warn('第['+tli+']个树形结构数据源无locateAttr属性；将被忽略');
					continue;
				}
				if(!tl.rootValue){
					Ext.warn('第['+tli+']个树形结构数据源无rootValue属性；将被忽略');
					continue;
				}
				if(!tl.textField){
					Ext.warn('第['+tli+']个树形结构数据源无textField属性；将被忽略');
					continue;
				}
				if(!tl.idProperties){
					Ext.warn('第['+tli+']个树形结构数据源无idProperties属性；将被忽略');
					continue;
				}
				loaderKeyMap[tl.key] = tl;
			}
			Ext.log('树形结构数据源配置检查完毕');
		}
		if(!Ext.isArray(window.treeCfgs)){
			Ext.log('无树形面板配置[treeCfgs],或配置结构不正确');
			window.treeCfgs = false;
		}else{
			Ext.log('发现['+treeCfgs.length+']个树形面板配置:');
			for(var tci=0;tci<treeCfgs.length;tci++){
				var tc = treeCfgs[tci];
				if(!tc.key){
					Ext.warn('第['+tci+']个树形面板无key属性；将被忽略');
					continue;
				}
				if(tc.loaderKey){
					if(!loaderKeyMap[tc.loaderKey]){
						Ext.warn('第['+tci+']个树形面板关联数据源不存在，请检查loaderKey属性！');
					}
				}
			}
			Ext.log('树形面板配置检查完毕');
		}
		Ext.log('树形结构配置treeLoaders|treeCfgs检查完毕');
	}
});

TreeManager = new Wlj.frame.functions.app.widgets.TreeManager();Ext.ns('Wlj.frame.functions.app.widgets');

/**
 * 下拉树组件
 */
Wlj.frame.functions.app.widgets.ComboTree = Ext.extend(Ext.form.ComboBox, {
	
	innerTree : false,
	showField : false,
	hideField : false,
	singleSelect : true,
	
	anchor : '95%',
	mode : 'local',
	resizable :false,
	forceSelection:true,
	triggerAction : 'all',
	maxHeight : 390,
	onSelect : Ext.emptyFn,
	assertValue : Ext.emptyFn,
	
	initComponent : function(){
		this.store = new Ext.data.SimpleStore({
			fields : [],
			data : [[]]
		});
		this.tplId = 'innerContainer_'+this.id;
		this.tpl =  "<tpl for='.'><div id='"+this.tplId+"'></div></tpl>";
		Wlj.frame.functions.app.widgets.ComboTree.superclass.initComponent.call(this);
	},
	onRender : function(ct, position){
		Wlj.frame.functions.app.widgets.ComboTree.superclass.onRender.call(this, ct, position);
		if(!this.innerTree){
			return false;
		}
		if(typeof this.innerTree == "string" && TreeManager){
			this.innerTree = TreeManager.createTree(this.innerTree);
		}else if(typeof this.innerTree == 'object'){
			if(!this.innerTree instanceof Ext.tree.TreePanel){
				this.innerTree = new Wlj.frame.functions.app.widgets.TreePanel(this.innerTree);
			}
		}
		this.innerTree.frame = true;
		var _this = this;
		this.innerTree.on('click', function(node){
			_this.clickFn(node);
		});
	},
	expand : function(){
		Wlj.frame.functions.app.widgets.ComboTree.superclass.expand.call(this);
		if(!this.innerTree.rendered){
			this.innerTree.render(this.tplId);
			this.innerTree.setHeight(390);
		}
	},
	clickFn : function(node){
		var attribute = node.attributes;
		var showField  = this.showField;
		var hideField = this.hideField;
		this.setValue(attribute[hideField],node);
		if(this.singleSelect){
			this.collapse();
		}
	},
	setValue : function(hidevalue, node){
		node  = node ? node : this.innerTree.resloader.hasNodeByProperties(this.hideField, hidevalue);
		if(!node ){
			this.selectedNode = false;
			this.showValue = hidevalue;
			Ext.form.ComboBox.superclass.setValue.call(this, hidevalue);
		}else{
			this.selectedNode = node;
			var showvalue = node.attributes ? node.attributes[this.showField] : node[this.showField];
			this.showValue = showvalue;
			Ext.form.ComboBox.superclass.setValue.call(this, hidevalue);
			
			this.el.dom.value = showvalue;
		}
		this.lastSelectionText = this.showValue;
	},
	getValue : function(){
		return this.value ? this.value : this.showValue;
	},
	getShowValue : function(){
		return this.showValue;
	},
	clearValue : function(){
		Wlj.frame.functions.app.widgets.ComboTree.superclass.clearValue.call(this);
		this.selectedNode = false;
	},
	getSelectNode : function(){
		return this.selectedNode;
	}
});
Ext.reg('wcombotree', Wlj.frame.functions.app.widgets.ComboTree);

Ext.ns('Wlj.frame.functions.app');
/** 
 * 页面整体APP对象
 */	
Wlj.frame.functions.app.App = function(cfg){
	Ext.log('开始构建APP');
	this.buildSpecilPatch();
	this.pageSize = WLJUTIL.defaultPagesize;
	this.tbar = [];
	
	this.needRN = WLJUTIL.needRN;
	this.rnWidth = WLJUTIL.rnWidth;
	this.contextMenuAble = WLJUTIL.contextMenuAble;
	
	if(WLJUTIL.easingStrategy.indexOf(WLJUTIL.dataLineEasing)>=0){
		this.easingStrtegy = {};
		this.easingStrtegy.type = WLJUTIL.dataLineEasing;
		this.easingStrtegy.firstStep = WLJUTIL.firstStep;
		this.easingStrtegy.initialConfig = WLJUTIL[WLJUTIL.dataLineEasing];
	}else{
		this.easingStrtegy = false;
	}
	
	this.edgeVies = {
		top : false,
		left : false,
		right : false,
		buttom : false
	};
	
	this.createView = false;
	this.editView = false;
	this.detailView = false;
	
	this.createFormViewer = false;
	this.editFormViewer = false;
	this.detailFormViewer = false;
	
	this.createValidates = false;
	this.editValidates = false;
	
	this.createLinkages = false;
	this.editLinkages = false;
	
	this.needGrid = true;
	this.needTbar = true;
	
	Ext.apply(this,cfg);
	
	if(this.needGrid === false){
		this.needCondition = false;
		this.needTbar = false;
	}
	
	this.searchTileBaseheight = this.needCondition? 100 : -8;
	if(!this.comitUrl){
		this.comitUrl = this.url;
	}
	
	if(this.createView){
		if(!this.createFormViewer){
			this.createFormViewer = this.formViewers;
		}
		if(!this.createValidates){
			this.createValidates = this.validates;
		}
		if(!this.createLinkages){
			this.createLinkages = this.linkages;
		}
	}
	
	if(this.editView){
		if(!this.editFormViewer){
			this.editFormViewer = this.formViewers;
		}
		if(!this.editValidates){
			this.editValidates = this.validates;
		}
		
		if(!this.editLinkages){
			this.editLinkages = this.linkages;
		}
	}
	
	if(this.detailView){
		if(!this.detailFormViewer){
			this.detailFormViewer = this.formViewers;
		}
	}
	this.initEvents();
	//this.initTreeManager();
	Wlj.frame.functions.app.App.superclass.constructor.call(this);
	this.initAPI();
	var initable = this.fireEvent('beforeinit', this);
	
	if(initable === false){
		Ext.error('beforeinit事件阻止APP构建，APP构建结束!');
		return false;
	}
	if(!this.lookupTypes){
		this.lookupTypes = [];
	}
	this.prepareLookup();
	this.init();
};

Ext.extend(Wlj.frame.functions.app.App,Ext.util.Observable);

/**数据转换类型
 * TO_JAVA : 数据key值转换为驼峰命名法;
 * TO_SQL ：数据key值转换为大写下划线分隔形式;
 * NO_TRANS : 不做任何转换
 * */
Wlj.frame.functions.app.App.prototype.TRANS_TYPE = {
		TO_JAVA : 1,
		TO_SQL : 2,
		NO_TRANS : 3
};
/**查询条件默认转换方式**/
Wlj.frame.functions.app.App.prototype.SEARCHFIELDTRANS = Wlj.frame.functions.app.App.prototype.TRANS_TYPE.NO_TRANS;
/**查询结果列默认转换方式**/
//Wlj.frame.functions.app.App.prototype.RESULTFIELDTRANS = Wlj.frame.functions.app.App.prototype.TRANS_TYPE.NO_TRANS;
/**新增修改表单提交转换方式**/
Wlj.frame.functions.app.App.prototype.VIEWCOMMITTRANS =  Wlj.frame.functions.app.App.prototype.TRANS_TYPE.TO_JAVA;

/**
 * 页面边缘区域：上下左右基础配置;
 */
Wlj.frame.functions.app.App.prototype.edgeViewBaseCfg = {
		left : {
			layout : 'accordion',
			xtype : 'panel',
			width : 200,
			height : 'auto',
			frame : true,
			region : 'west',
			collapsible : true
		},
		right : {
			layout : 'accordion',
			xtype : 'panel',
			width : 200,
			height : 'auto',
			frame : true,
			region : 'east',
			collapsible : true
		},
		top : {
			layout : 'form',
			xtype : 'form',
			height : 100,
			frame : true,
			width : 'auto',
			region : 'north',
			defaultType : 'textfield',
			collapsible : true
		},
		buttom : {
			xtype : 'tabpanel',
			height : 100,
			frame : true,
			width : 'auto',
			region : 'south',
			collapsible : true,
			activeTab : 0
		}
};
/**
 * 页面初始化
 * @return
 */
Wlj.frame.functions.app.App.prototype.init = function(){
	this.vs = Ext.getBody().getViewSize();
	Ext.log('开始构建APP内部对象');
	this.buildEdgeViews();
	this.buildMajor();
	this.render();
	
	this.fireEvent('afterinit', this);
	Ext.log('APP构建结束！');
	this.clearSite();
};
/**
 * 清除window域配置
 * @return
 */
Wlj.frame.functions.app.App.prototype.clearSite = function(){
	
	window.needCondition = true;
	window.needTbar = true;
	window.needGrid = true;
	window.url = false;
	window.comitUrl = false;
	window.fields = false;
	window.createView = false;
	window.editView = false;
	window.detailView = false;
	window.createFormViewer = false;
	window.editFormViewer = false;
	window.detailFormViewer = false;
	window.lookupTypes = false;
	window.localLookup = false;
	window.createValidates = false;
	window.editValidates = false;
	window.createLinkages = false;
	window.editLinkages = false;
	window.edgeVies = false;
	window.customerView = false;
	window.listeners = false;
	window.tbar = false;
	window.createFormCfgs = false;
	window.editFormCfgs = false;
	window.detailFormCfgs = false;
	
	window.formViewers = false;
	window.formCfgs = false;
	window.validates = false;
	window.linkages = false;
	
	window.beforeinit  =  false;
	window.afterinit  =  false;
	window.beforeconditioninit  =  false;
	window.afterconditioninit  =  false;
	window.beforeconditionrender  =  false;
	window.afterconditionrender  =  false;
	window.beforeconditionadd  =  false;
	window.conditionadd  =  false;
	window.beforeconditionremove  =  false;
	window.conditionremove  =  false;
	window.beforedyfieldclear  =  false;
	window.afterdyfieldclear  =  false;
	window.beforeconditioncollapse  =  false;
	window.afterconditioncollapse  =  false;
	window.beforeconditionexpand  =  false;
	window.afterconditionexpand  =  false;
	window.recordselect  =  false;
	window.rowdblclick  =  false;
	window.load  =  false;
	window.beforesetsearchparams  =  false;
	window.setsearchparams  =  false;
	window.beforeresultinit  =  false;
	window.afterresultinit  =  false;
	window.beforeresultrender  =  false;
	window.afterresultrender  =  false;
	window.beforecreateviewrender  =  false;
	window.aftercreateviewrender  =  false;
	window.beforeeditviewrender  =  false;
	window.aftereditviewrender  =  false;
	window.beforedetailviewrender  =  false;
	window.afterdetailviewrender  =  false;
	window.beforeviewshow  =  false;
	window.viewshow  =  false;
	window.beforeviewhide  =  false;
	window.viewhide  =  false;
	window.beforevalidate  = false;
	window.validate  =  false;
	window.beforecommit  =  false;
	window.afertcommit  =  false;
	window.beforeeditload  =  false;
	window.aftereditload  =  false;
	window.beforedetailload  =  false;
	window.afterdetailload  =  false;
	window.beforetophide  =  false;
	window.tophide  =  false;
	window.beforetopshow  =  false;
	window.topshow  =  false;
	window.beforelefthide  =  false;
	window.lefthide  =  false;
	window.beforeleftshow  =  false;
	window.leftshow  =  false;
	window.beforebuttomhide  =  false;
	window.buttomhide  =  false;
	window.beforebuttomshow  =  false;
	window.buttomshow  =  false;
	window.beforerighthide  =  false;
	window.righthide  =  false;
	window.beforerightshow  =  false;
	window.rightshow  =  false;
	window.lookupinit  =  false;
	window.locallookupinit  =  false;
	window.alllookupinit  =  false;
	window.beforelookupreload  =  false;
	window.lookupreload  =  false;
	window.beforetreecreate  =  false;
	window.treecreate  =  false;
};
/**
 * 销毁方法
 * @return
 */
Wlj.frame.functions.app.App.prototype.destroy = function(){
	if(this.infoDD){
		this.infoDD.removeAllListeners();
		Ext.destroy(this.infoDD);
		this.infoDD = false;
	}
	this.destroyLookups();
	this.clearAPI();
	this.purgeListeners();
	this.viewPort.destroy();
	/********************************/
	this.majorPanel = null;
	this.searchDomain = null;
	this.resultDomain = null;
	this.fields = null;
	this.customerView = false;
	this.edgeVies = {
		top : false,
		left : false,
		right : false,
		buttom : false
	};
	
	window._app = null;
};
/**
 * 初始化事件
 * @return
 */
Wlj.frame.functions.app.App.prototype.initEvents = function(){
	Ext.log('初始化APP对象事件！');
	this.addEvents({
		/**APP初始化**/
		/**
		 * APP初始化之前触发；
		 * params ： app：当前APP对象；
		 * return ： false：阻止页面初始化；默认为true；
		 */
		beforeinit : true,
		/**
		 * APP初始化之后触发；
		 * params ： app：当前APP对象；
		 */
		afterinit : true,
		
		
		/**查询条件域事件**/
		/**
		 * 查询条件域对象初始化之前触发，此时对象尚未渲染；
		 * params ：con：查询条件面板对象；
		 * 			app：当前APP对象；
		 */
		beforeconditioninit : true,
		/**
		 * 查询条件域对象初始化之后触发，此时对象尚未渲染；
		 * params ：con：查询条件面板对象；
		 * 			app：当前APP对象；
		 */
		afterconditioninit : true,
		/**
		 * 查询条件域对象渲染之前触发，此时对象尚未渲染；
		 * params ：con：查询条件面板对象；
		 * 			app：当前APP对象；
		 */
		beforeconditionrender : true,
		/**
		 * 查询条件域对象渲染之后触发；
		 * params ：con：查询条件面板对象；
		 * 			app：当前APP对象；
		 */
		afterconditionrender : true,
		/**
		 * 当数据字段被动态拖动到查询条件框时触发;
		 * params : fCfg：添加之前默认生成的数据项配置；
		 * 			columnIndexT：将要被添加的列数；
		 * 			searchPanel：查询条件form面板；
		 * return ：false阻止条件添加事件；默认为true；
		 */
		beforeconditionadd : true,
		/**
		 * 当数据字段被添加为查询条件后触发
		 * params : field：被添加后的字段对象；
		 * 			searchPanel：查询面板表单；
		 */
		conditionadd : true,
		/**
		 * 当一个动态数据条件被移除前触发
		 * params : field：将要被移除的查询条件字段对象；
		 * 			searchPanel：查询条件面板对象；
		 * return : false，阻止移除事件；默认为true；
		 */
		beforeconditionremove : true,
		/**
		 * 当一个动态数据条件被移除后触发
		 * params : searchPanel被移除字段后的查询条件表单；
		 */
		conditionremove : true,
		/**
		 * 当动态数据条件被全部移除前触发；
		 * params ：searchDomain：查询域对象；
		 * 			searchpanel：查询条件面板；
		 * 			dyfield：移除前动态字段数组；
		 */
		beforedyfieldclear : true,
		/**
		 * 当动态数据条件被全部移除后触发；
		 * params ：searchDomain：查询域对象；
		 * 			searchpanel：查询条件面板；
		 * 			dyfield：移除后动态字段数组；
		 */
		afterdyfieldclear : true,
		/**
		 * 查询条件域收起前触发；
		 * params：panel：查询条件域面板；
		 * return：false：阻止查询条件域收起事件，默认为true，
		 */
		beforeconditioncollapse : true,
		/**
		 * 查询条件域收起后触发；
		 * params：panel：查询条件域面板；
		 */
		afterconditioncollapse : true,
		/**
		 * 查询条件域收展开触发；
		 * params：panel：查询条件域面板；
		 * return：false：阻止查询条件域展开事件，默认为true，
		 */
		beforeconditionexpand : true,
		/**
		 * 查询条件域展开后触发；
		 * params：panel：查询条件域面板；
		 */
		afterconditionexpand : true,
		/**
		 * 当一个查询条件域字段被赋值前触发；
		 * params： field：字段对象；
		 * 			dataInfo：字段元数据；
		 * 			value ：字段值；
		 * return ： false：阻止setValue事件触发；默认为true；
		 */
		beforecondtitionfieldvalue : true,
		/**
		 * 当一个查询条件域字段被赋值后触发；
		 * params： field：字段对象；
		 * 			dataInfo：字段元数据；
		 * 			value ：字段值；
		 */
		condtitionfieldvalue : true,
		
		/**查询结果域操作**/
		/**
		 * 数据行被选择时触发；
		 * params : record:被选择的数据对象；
		 * 			store:数据所在数据源对象;
		 * 			tile:结果面板中数据行的瓷贴对象;
		 */
		recordselect : true,
		/**
		 * 数据行双击事件；
		 * params : tile:被双击数据行瓷贴对象；
		 * 			record：被双击数据对象；
		 */
		rowdblclick : true,
		load : false,
		/**
		 * 设置当前查询条件前触发；
		 * params : params:追加查询条件项；
		 * 			forceLoad：是否强制刷新当前数据；
		 * 			add：是否清理之前查询条件；
		 * 			transType：查询条件key值转换类型
		 * return ：false：阻止查询条件设置动作；默认为true；
		 */
		beforesetsearchparams : true,
		/**
		 * 设置当前查询条件之后，数据刷新之前触发；
		 * params : params:追加查询条件项；
		 * 			forceLoad：是否强制刷新当前数据；
		 * 			add：是否清理之前查询条件；
		 * 			transType：查询条件key值转换类型
		 */
		setsearchparams : true,
		/**
		 * 查询结果域对象初始化之前触发，此时对象尚未渲染；
		 * params ：con：查询条件面板对象；
		 * 			app：当前APP对象；
		 */
		beforeresultinit : true,
		/**
		 * 查询结果域对象初始化之后触发，此时对象尚未渲染；
		 * params ：con：查询条件面板对象；
		 * 			app：当前APP对象；
		 */
		afterresultinit : true,
		/**
		 * 查询结果域对象渲染之前触发，此时对象尚未渲染；
		 * params ：con：查询条件面板对象；
		 * 			app：当前APP对象；
		 */
		beforeresultrender : true,
		/**
		 * 查询结果域对象渲染之后触发；
		 * params ：con：查询条件面板对象；
		 * 			app：当前APP对象；
		 */
		afterresultrender : true,
		
		
		/**查询结果域附加面板事件**/
		/**
		 * 新增面板渲染之前触发
		 * params : view:新增面板对象
		 */
		beforecreateviewrender : true,
		/**
		 * 新增面板渲染之后触发
		 * params : view:新增面板对象
		 */
		aftercreateviewrender : true,
		/**
		 * 修改面板渲染之前触发
		 * params : view:修改面板对象
		 */
		beforeeditviewrender : true,
		/**
		 * 修改面板渲染之后触发
		 * params : view:修改面板对象
		 */
		aftereditviewrender : true,
		/**
		 * 详情面板渲染之前触发
		 * params : view:详情面板对象
		 */
		beforedetailviewrender : true,
		/**
		 * 详情面板渲染之后触发
		 * params : view:详情面板对象
		 */
		afterdetailviewrender : true,
		/**
		 * 结果域面板滑入前触发：
		 * params：theview : 当前滑入面板；
		 * return： false，阻止面板滑入操作；默认为true；
		 */
		beforeviewshow : true,
		/**
		 * 结果域面板滑入后触发：
		 * params：theview ： 当前滑入面板；
		 */
		viewshow : true,
		/**
		 * 结果域面板滑出前触发；
		 * params：theview ：当前滑出面板；
		 * return：false，阻止面板滑出操作；默认为ture；
		 */
		beforeviewhide : true,
		/**
		 * 结果域面板滑出后触发：
		 * params：theview ： 当前滑出面板；
		 */
		viewhide : true,
		/**
		 * 新增、修改面板提交之前数据校验前置事件
		 * params : view:面板对象；
		 * 			panel:面板对象内部form表单面板对象；
		 * return : false，阻止校验以及提交；
		 */
		beforevalidate :true,
		/**
		 * 新增、修改面板提交之前数据校验后置事件
		 * params : view:面板对象；
		 * 			panel:面板对象内部form表单面板对象；
		 * 			error：校验结果，布尔型
		 */
		validate : true,
		/**
		 * 数据提交之前触发
		 * params : data:提交的数据对象；
		 * 			cUrl：提交地址；
		 * return ： false，阻止提交动作；默认为true
		 */
		beforecommit : true,
		/**
		 * 数据提交之后触发
		 * params : data:提交的数据对象；
		 * 			cUrl：提交地址；
		 * 			result：提交成功失败结果，布尔型；
		 */
		afertcommit : true,
		/**
		 * 修改表单滑入，加载当前选择数据之前触发；
		 * params ：view：修改表单；
		 * 			record ：当前选择的数据；
		 * return ： false：阻止数据加载事件，默认为true；
		 */
		beforeeditload : false,
		/**
		 * 修改表单滑入，加载当前选择数据之后触发；
		 * params ：view：修改表单；
		 * 			record ：当前选择的数据；
		 */
		aftereditload : false,
		/**
		 * 详情表单滑入，加载当前选择数据之前触发；
		 * params ：view：详情表单；
		 * 			record ：当前选择的数据；
		 * return ： false：阻止数据加载事件，默认为true；
		 */
		beforedetailload : true,
		/**
		 * 详情表单滑入，加载当前选择数据之后触发；
		 * params ：view：详情表单；
		 * 			record ：当前选择的数据；
		 */
		afterdetailload : true,
		
		
		/**边缘面板事件**/
		beforetophide : false,
		tophide : false,
		beforetopshow : false,
		topshow : false,
		beforelefthide : false,
		lefthide : false,
		beforeleftshow : false,
		leftshow : false,
		beforebuttomhide : false,
		buttomhide : false,
		beforebuttomshow : false,
		buttomshow : false,
		beforerighthide : false,
		righthide : false,
		beforerightshow : false,
		rightshow : false,
		
		
		/**数据字典事件**/
		/**
		 * 一个远程数据字典项被加载完毕之后触发;
		 * params : key:字典项类型键值；
		 * 			store:数据字典store；
		 */
		lookupinit : true,
		/**
		 * 一个本地数据字典项被加载完毕之后触发;
		 * params : key:字典项类型键值；
		 * 			store:数据字典store；
		 */
		locallookupinit : true,
		/**
		 * 数据字典项全部加载完毕之后触发;
		 * params : lookupManager：数据字典管理器
		 */
		alllookupinit : true,
		/**
		 * 数据字典reload之前触发；
		 * params ：type：数据字典类型编码；
		 * 			lStore：数据字典store
		 * 			config ：reload配置;
		 * return : 返回false阻止事件发生；默认为true；
		 */
		beforelookupreload : true,
		/**
		 * 数据字典reload之后触发；
		 * params ：type：数据字典类型编码；
		 * 			lStore：数据字典store;
		 * 			records : 更新的数据数组；
		 * 			config ：reload配置;
		 * 			succeed ：数据reload结果标志位；
		 */
		lookupreload : true,
		
		/**属性面板事件**/
		beforetreecreate : false,
		treecreate : false
	});
};
/**
 * 构建API句柄
 * @return
 */
Wlj.frame.functions.app.App.prototype.initAPI = function(){
	Ext.log('开始准备API!');
	if(typeof API === 'undefined' || !Ext.isObject(API)){
		Ext.log('NO API CONFIG, NONE API BUILT!');
		return false;
	}
	for(var key in API){
		if(API[key]){
			if(Ext.isFunction(this[key])){
				window[key] = this[key].createDelegate(this);
				Ext.log('BUILD API 【'+key+'】!');
				continue;
			}else{
				Ext.warn('API【'+key+'】准备出错，因为APP对象不具备该方法！');
				API[key] = false;
				continue;
			}
		}
	}
	Ext.log('API准备完毕！');
};
/**
 * 清除API句柄
 * @return
 */
Wlj.frame.functions.app.App.prototype.clearAPI = function(){
	for(var key in API){
		window[key] = null;
	}
};
/**
 * 事件触发逻辑
 * @return
 */
Wlj.frame.functions.app.App.prototype.fireEvent = function(){
	var eventName = arguments[0];
	var eventResult = true;
	if(!eventName){
		return eventResult;
	}
	Ext.log('触发事件：【'+arguments[0]+'】:接收到【'+(arguments.length - 1)+'】个参数！');
	if(!this.hasListener(eventName)){
		Ext.log('【'+arguments[0]+'】未绑定逻辑，事件调用结束！');
		return eventResult;
	}
	try{
		for(var i = 0;i<this.events[eventName].listeners.length;i++){
			Ext.log('fn['+i+']:'+this.events[eventName].listeners[0].fn.toString());
		}
		eventResult = Wlj.frame.functions.app.App.superclass.fireEvent.apply(this,arguments);
	}catch(Werror){
		Ext.error('事件【'+arguments[0]+'】：执行出错。TYPE:【'+Werror.name+'】;MESSAGE:【'+Werror.message+'】!');
		eventResult = false;
	}finally{
		Ext.log('【'+arguments[0]+'】事件结束!');
		return eventResult;
	}
};
/**
 * 准备数据字典项
 * @return
 */
Wlj.frame.functions.app.App.prototype.prepareLookup = function(){
	Ext.log('开始构建数据字典项管理器！');
	this.lookupManager = {};
	var _this = this;
	Ext.log('构建本地字典项');
	for(var key in this.localLookup){
		Ext.log('构建本地字典项：['+key+']；');
		var lookups = this.localLookup[key];
		var store = new Ext.data.JsonStore({
	        fields : ['key', 'value']
	    });
		store.loadData(lookups);
		this.lookupManager[key] = store;
		_this.fireEvent('locallookupinit', key, store);
	}
	Ext.log('本地字典项构建完毕');
	Ext.log('开始构建远程字典项');
	/****************************队列递归加载模式******************************/
//	var tStoreIndex = 0;
//	function loadlookup(fCB){
//		if(tStoreIndex >= _this.lookupTypes.length){
//			fCB();
//			return;
//		}
//		var tStore = null;
//		if(Ext.isString(_this.lookupTypes[tStoreIndex])){
//			Ext.log('构建远程字典项:['+_this.lookupTypes[tStoreIndex]+'];');
//			tStore = new Ext.data.Store({
//				sortInfo:{
//					field: 'key',
//				    direction: WLJUTIL.lookupSortDirect 
//				},
//				restful:true,   
//				proxy : new Ext.data.HttpProxy({
//					url : basepath+'/lookup.json?name='+_this.lookupTypes[tStoreIndex]
//				}),
//				reader : new Ext.data.JsonReader({
//					root : 'JSON'
//				}, [ 'key', 'value' ])
//			});
//			_this.lookupManager[_this.lookupTypes[tStoreIndex]] = tStore;
//		}else{
//			var typeCfg =  _this.lookupTypes[tStoreIndex];
//			Ext.log('构建远程字典项:['+typeCfg.TYPE+'];');
//			tStore = new Ext.data.Store({
//				restful:true,   
//				proxy : new Ext.data.HttpProxy({
//					url : basepath + typeCfg.url
//				}),
//				reader : new Ext.data.JsonReader({
//					root : typeCfg.root?typeCfg.root:'json.data'
//				}, [{
//					name : 'key',
//					mapping : typeCfg.key
//				},{
//					name : 'value',
//					mapping : typeCfg.value
//				}])
//			});
//			_this.lookupManager[typeCfg.TYPE] = tStore;
//		}
//		tStore.load({
//			callback : function(){
//				_this.fireEvent('lookupinit',_this.lookupTypes[tStoreIndex],tStore);
//				tStoreIndex ++ ;
//				loadlookup(fCB);
//			}
//		});
//	}
//	loadlookup(function(){
//		Ext.log('远程字典项构建完毕');
//		_this.fireEvent('alllookupinit',_this.lookupManager);
//	});
	
	/***********************同步并发加载模式*******************************/
	Ext.each(_this.lookupTypes, function(lt){
		var tStore = null;
		if(Ext.isString(lt)){
			Ext.log('构建远程字典项:['+lt+'];');
			tStore = new Ext.data.Store({
				sortInfo:{
					field: 'key',
				    direction: WLJUTIL.lookupSortDirect 
				},
				restful:true,   
				proxy : new Ext.data.HttpProxy({
					url : basepath+'/lookup.json?name='+lt
				}),
				reader : new Ext.data.JsonReader({
					root : 'JSON'
				}, [ 'key', 'value' ])
			});
			_this.lookupManager[lt] = tStore;
		}else{
			Ext.log('构建远程字典项:['+lt.TYPE+'];');
			tStore = new Ext.data.Store({
				restful:true,   
				proxy : new Ext.data.HttpProxy({
					url : basepath + lt.url
				}),
				reader : new Ext.data.JsonReader({
					root : lt.root?lt.root:'json.data'
				}, [{
					name : 'key',
					mapping : lt.key
				},{
					name : 'value',
					mapping : lt.value
				}])
			});
			_this.lookupManager[lt.TYPE] = tStore;
		}
		if(lt.autoLoadItems !== false){
			tStore.load({
				callback : function(){
					_this.fireEvent('lookupinit',lt,tStore);
				}
			});
		}
	});
	
	
	
};
/**
 * 销毁数据字典类别
 * @return
 */
Wlj.frame.functions.app.App.prototype.destroyLookups = function(){
	for(var key in this.lookupManager){
		this.lookupManager[key].destroy();
		this.lookupManager[key] = null;
	}
};
/**
 * 构建查询条件域
 * @return
 */
Wlj.frame.functions.app.App.prototype.bootSearchDomain = function(){
	var _this = this;
	Ext.log('构建查询条件域');
	this.searchDomain = new Wlj.frame.functions.app.widgets.SearchContainer(_this.createSearchCfg());
} ;
/**
 * 构建查询条件域配置信息
 * @return
 */
Wlj.frame.functions.app.App.prototype.createSearchCfg = function(){
	var _this = this;
	var itemsArray = [];
	if(_this.searchDomainCfg && Ext.isArray(_this.searchDomainCfg.condtionFields)){
		Ext.each(_this.searchDomainCfg.condtionFields, function(cf){
			var theField = false;
			if(Ext.isString(cf)){
				theField = _this.buildConditionField(_this.getFieldsByName(cf));
			}else{
				theField = _this.buildConditionField(cf);
			}
			if(theField){
				itemsArray.push(theField);
			}
		});
	}else{
		Ext.each(this.fields,function(f){
			if(f.searchField === true){
				var theField = _this.buildConditionField(f);
				if(theField){
					itemsArray.push(theField);
				}
			}
		});
	}
	if(_this.searchDomainCfg && Ext.isFunction(_this.searchDomainCfg.fieldFn)){
		itemsArray = _this.searchDomainCfg.fieldFn.apply(_this,itemsArray);
	}
	for(var i=itemsArray.length -1 ;i>=0;i--){
		if(!itemsArray[i]){
			itemsArray.remove(itemsArray[i]);
		}
	}
	var searchCfg = {
			vs : this.seearchVs,
			region : 'north',
			_APP : this,
			layout : 'fit',
			itemsArray : itemsArray,
			buttonCfg : WLJUTIL.conditionButtons,
			multiSelectSeparator : WLJUTIL.multiSelectSeparator,
			items : [],
			hidden : !this.needCondition,
			needCloseLable4DCF : WLJUTIL.needCloseLable4DCF,
			listeners : {
				beforeconditionadd : function(fCfg,columnIndexT,searchPanel){
					return _this.fireEvent('beforeconditionadd',fCfg,columnIndexT,searchPanel);
				},
				conditionadd : function(fitem,searchPanel){
					_this.fireEvent('conditionadd',fitem,searchPanel);
				},
				beforeconditionremove : function(fitem,searchPanel){
					return _this.fireEvent('beforeconditionremove',fitem,searchPanel);
				},
				conditionremove : function(searchPanel){
					_this.fireEvent('conditionremove',searchPanel);
				},
				beforedyfieldclear : function(searchDomain, searchpanel, dyfield){
					return _this.fireEvent('beforedyfieldclear', searchDomain, searchpanel, dyfield);
				},
				afterdyfieldclear : function(searchDomain, searchpanel, dyfield){
					_this.fireEvent('afterdyfieldclear', searchDomain, searchpanel, dyfield);
				},
				beforecondtitionfieldvalue : function(field, datainfo, value){
					return _this.fireEvent('beforecondtitionfieldvalue',field,datainfo,value);
				},
				condtitionfieldvalue : function(field, datainfo, value){
					_this.fireEvent('condtitionfieldvalue',field,datainfo,value);
				}
			}
		};
	if(this.searchDomainCfg){
		Ext.apply(searchCfg, this.searchDomainCfg);
	}
	return searchCfg;
};
/**
 * 构建查询结果域
 * @return
 */
Wlj.frame.functions.app.App.prototype.bootResultDomain = function(){
	Ext.log('构建查询结果域');
	this.resultDomain = new Wlj.frame.functions.app.widgets.ResultContainer(this.createResultCfg());
};
/**
 * 构建查询结果域配置信息
 * @return
 */
Wlj.frame.functions.app.App.prototype.createResultCfg = function(){
	var _this = this;
	var createResultCfg = {};
	
	createResultCfg.needRN = this.needRN;
	createResultCfg.rnWidth = this.rnWidth;
	
	createResultCfg.multiSelectSeparator = WLJUTIL.multiSelectSeparator;
	
	createResultCfg.pageSize = this.pageSize;
	createResultCfg.url = this.url;
	createResultCfg.tbar = this.tbar;
	createResultCfg.dataFields = this.getFieldsCopy();
	createResultCfg._APP = this;
	createResultCfg.loadMaskMsg = WLJUTIL.loadMaskMsg;
	createResultCfg.gridLockedHole = WLJUTIL.suspendViews ? true : false;
	createResultCfg.suspendViews = WLJUTIL.suspendViews;
	createResultCfg.alwaysLockCurrentView = WLJUTIL.alwaysLockCurrentView;
	createResultCfg.suspendViewsWidth = WLJUTIL.viewPanelsWidth;
	createResultCfg.tbarButtonAlign = WLJUTIL.tbarButtonAlign;
	createResultCfg.tbarViewAlign = WLJUTIL.tbarViewAlign;
	createResultCfg.easingStrtegy = this.easingStrtegy;
	createResultCfg.region = 'center';
	createResultCfg.vs = this.resultVs;
	createResultCfg.needGrid = !(this.needGrid === false);
	createResultCfg.needTbar = !(this.needTbar === false);
	createResultCfg.autoLoadGrid = !(this.autoLoadGrid === false);
	createResultCfg.createView = false;
	createResultCfg.editView = false;
	createResultCfg.detailView = false;
	createResultCfg.createFormCfgs = this.createFormCfgs;
	createResultCfg.editFormCfgs = this.editFormCfgs;
	createResultCfg.detailFormCfgs = this.detailFormCfgs;
	createResultCfg.listeners = {
		beforeviewhide : function(theView){
			return _this.fireEvent('beforeviewhide', theView);
		},
		viewhide : function(theView){
			_this.fireEvent('viewhide', theView);
		},
		beforeviewshow : function(theView){
			return _this.fireEvent('beforeviewshow', theView);
		},
		viewshow : function(theView){
			_this.fireEvent('viewshow', theView);
		},
		recordselect : function(record, store, tile){
			_this.fireEvent('recordselect', record, store, tile);
		},
		beforevalidate : function(view, panel){
			return _this.fireEvent('beforevalidate', view, panel);
		},
		validate : function(view, panel, error){
			_this.fireEvent('validate', view, panel, error);
		},
		beforecreateviewrender : function(view){
			return _this.fireEvent('beforecreateviewrender', view);
		},
		aftercreateviewrender : function(view){
			_this.fireEvent('aftercreateviewrender', view);
		},
		beforeeditviewrender : function(view){
			return _this.fireEvent('beforeeditviewrender', view);
		},
		aftereditviewrender : function(view){
			_this.fireEvent('aftereditviewrender', view);
		},
		beforedetailviewrender : function(view){
			return _this.fireEvent('beforedetailviewrender', view);
		},
		afterdetailviewrender : function(view){
			_this.fireEvent('afterdetailviewrender', view);
		},
		rowdblclick : function(tile, record){
			_this.fireEvent('rowdblclick', tile, record);
		}
	};
	
	if(this.createView && this.createFormViewer){
		createResultCfg.createFieldsCopy = this.getFieldsCopy();
		createResultCfg.createFormViewer = this.createFormViewer;
		createResultCfg.createValidates = this.createValidates;
		createResultCfg.createLinkages = this.createLinkages;
		createResultCfg.createView = true;
	}
	
	if(this.editView && this.editFormViewer){
		createResultCfg.editFieldsCopy = this.getFieldsCopy();
		createResultCfg.editFormViewer = this.editFormViewer;
		createResultCfg.editValidates = this.editValidates;
		createResultCfg.editLinkages = this.editLinkages;
		createResultCfg.editView = true;
	}
	
	if(this.detailView && this.detailFormViewer){
		createResultCfg.detailFieldsCopy = this.getFieldsCopy();
		createResultCfg.detailFormViewer = this.detailFormViewer;
		createResultCfg.detailView = true;
	}
	
	return createResultCfg;
};
/**
 * 构建主工作区域,包括查询条件区域和查询结果列表区域
 * @return
 */
Wlj.frame.functions.app.App.prototype.buildMajor = function(){
	var left = 'left',right = 'right', top = 'top',buttom = 'buttom';
	var leftPx = 0,rightPx = 0,topPx = 0,buttomPx = 0;
	Ext.log('构建主查询区域');
	if(this.edgeVies[left])
		leftPx = this.edgeVies[left].width;
	if(this.edgeVies[right])
		rightPx = this.edgeVies[right].width;
	if(this.edgeVies[top])
		topPx = this.edgeVies[top].height;
	if(this.edgeVies[buttom])
		buttomPx = this.edgeVies[buttom].height;
	
	this.seearchVs = {
		width : this.vs.width - leftPx - rightPx,
		height : this.searchTileBaseheight
	};
	this.resultVs = {
		width : this.vs.width - leftPx - rightPx,
		height : this.vs.height - topPx - buttomPx - this.searchTileBaseheight
	};
	this.bootSearchDomain();
	this.bootResultDomain();
	var _this = this;
	this.majorPanel = new Ext.Panel({
		frame : true,
		layout : 'form',
		height : this.vs.height - topPx - buttomPx,
		width : this.vs.width - leftPx - rightPx,
		region : 'center',
		listeners : {
			resize : function(p,aw,ah,rw,rh){
				if(Ext.isNumber(aw)){
					_this.searchDomain.setWidth(aw);
					_this.resultDomain.setWidth(aw);
				}
				var mainHeight = this.body.getViewSize().height;
				
				if(_this.needCondition){
					if(Ext.isNumber(mainHeight) && _this.searchDomain.rendered){
						_this.resultDomain.setHeight(mainHeight - _this.searchDomain.el.getHeight()+8);
					}
				}else{
					if(Ext.isNumber(mainHeight)){
						_this.resultDomain.setHeight(mainHeight);
					}
				}
			}
		},
		items : [this.searchDomain,this.resultDomain]
	});
};
/**
 * 构建上下左右边缘区域
 * @return
 */
Wlj.frame.functions.app.App.prototype.buildEdgeViews = function(){
	
	var left = 'left',right = 'right', top = 'top',buttom = 'buttom';
	var viewsCfg = this.edgeVies;
	
	if(viewsCfg[left]){
		Ext.log('构建左部面板');
		viewsCfg[left].panel = this.createEdgeView(left,viewsCfg[left]);
	}
	if(viewsCfg[right]){
		Ext.log('构建右部面板');
		viewsCfg[right].panel = this.createEdgeView(right,viewsCfg[right]);
	}
	if(viewsCfg[top]){
		Ext.log('构建顶部面板');
		viewsCfg[top].panel = this.createEdgeView(top,viewsCfg[top]);
	}
	if(viewsCfg[buttom]){
		Ext.log('构建底部面板');
		viewsCfg[buttom].panel = this.createEdgeView(buttom,viewsCfg[buttom]);
	}
};
/**
 * 构建边缘区域面板配置项
 * @param viewPosition
 * @param cfg
 * @return
 */
Wlj.frame.functions.app.App.prototype.createEdgeView = function(viewPosition,cfg){
	var result = false;
	if(!cfg){
		return result;
	}
	var baseCfg = this.edgeViewBaseCfg[viewPosition];
	Ext.applyIf(cfg, baseCfg);
	result = cfg;
	var _this = this;
	if(result.listeners){
		result.listeners.afterrender = function(p){
			p.el.on('contextmenu', function(eve){
				eve.stopEvent();
				_this.onContextMenu(eve, []);
			});
		};
	}else{
		result.listeners = {
			afterrender : function(p){
				p.el.on('contextmenu', function(eve){
					eve.stopEvent();
					_this.onContextMenu(eve, []);
				});
			}
		};
	}
	return result;
};
/**
 * 渲染页面
 * @return
 */
Wlj.frame.functions.app.App.prototype.render = function(){
	var left = 'left',right = 'right', top = 'top',buttom = 'buttom';
	var _this = this;
	var items  = [];
	if(this.edgeVies[left])
		items.push(this.edgeVies[left].panel);
	if(this.edgeVies[right])
		items.push(this.edgeVies[right].panel);
	if(this.edgeVies[top])
		items.push(this.edgeVies[top].panel);
	if(this.edgeVies[buttom])
		items.push(this.edgeVies[buttom].panel);
	items.push(this.majorPanel);
	Ext.log('页面渲染！');
	this.viewPort = new Ext.Viewport({
		layout:'border',
		items : items,
		listeners : {
			afterrender : function(){
				_this.searchDomain.fixSearchHeight();
				
			}
		}
	});
//	var rTemplate = new Ext.Template(
//	'<div title="提示" class="ycl-ico"></div>');
//	
//	_this.infoDD  = Ext.get(rTemplate.append(Ext.getBody()));
//	
//	_this.infoDD.initDD('dsf');
//	
//	_this.infoDD.on('mouseup',function(e,t,o){
//		_this.infoDD.animate({
//			left : {
//				to : Ext.getBody().getWidth() - _this.infoDD.getWidth(),
//				from : _this.infoDD.getLeft()
//			}
//		},
//		0.35,
//		null,
//		'easeOut',
//		'run');
//	});
};
Wlj.frame.functions.app.App.prototype.onContextMenu = function(e,added){
	
	if(!this.contextMenuAble){
		return false;
	}
	var windowMenu = WLJUTIL.contextMenus.window;
	for(var key in windowMenu){
		var omenu = {};
		omenu.text = windowMenu[key].text;
		omenu.handler = windowMenu[key].fn.createDelegate(this);
		added.push(omenu);
	}
	new Ext.menu.Menu({
        items: added
    }).showAt(e.getXY());
};
Wlj.frame.functions.app.App.prototype.onMetaAdd = function(field){
	this.fields.push(field);
	this.resultDomain.onMetaAdd(field);
};
Wlj.frame.functions.app.App.prototype.onMetaRemove = function(field){
	var fCfg = this.getFieldsByName(field);
	if(!fCfg){
		return false;
	}
	this.fields.remove(fCfg);
	this.resultDomain.onMetaRemove(field);
};
Wlj.frame.functions.app.App.prototype.onMetaAddAfter = function(addField, theField){
	if(!this.getFieldsByName(theField)){
		this.onMetaAdd(addField);
	}else{
		this.resultDomain.onMetaAddAfter(addField, theField);
	}
};
Wlj.frame.functions.app.App.prototype.onMetaAddBefore = function(addField, theField){
	if(!this.getFieldsByName(theField)){
		this.onMetaAdd(addField);
	}else{
		this.resultDomain.onMetaAddBefore(addField, theField);
	}
};
Wlj.frame.functions.app.App.prototype.buildSpecilPatch = function(){
	Ext.util.JSON.encodeDate = function(d) {
	    return '"'+d.format(WLJUTIL.defaultDateFormat)+'"';
	};
};
Wlj.frame.functions.app.App.prototype.buildConditionField = function(f){
	var _this = this;
	if(!f || !f.name || !f.text){
		return false;
	}
	var fCfg = {};
	if(!f.xtype){
		fCfg.xtype = f.translateType?(f.multiSelect?'lovcombo':'combo'):'textfield';
	}else{
		fCfg.xtype = f.xtype;
	}
	fCfg.store = f.translateType?_this.lookupManager[f.translateType]:false;
	if(f.translateType){
		fCfg.valueField = 'key';
		fCfg.displayField = 'value';
		fCfg.editable = typeof f.editable === 'boolean' ? f.editable : false;
		fCfg.forceSelection = true;
		fCfg.triggerAction = 'all';
		fCfg.mode = 'local';
		fCfg.hiddenName = f.name;
		fCfg.separator = f.multiSeparator?f.multiSeparator:WLJUTIL.multiSelectSeparator;
	}else{
		fCfg.name = f.name;
	}
	Ext.applyIf(fCfg, f);
	delete fCfg.allowBlank;
	fCfg.fieldLabel = f.text ? f.text : f.name;
	return fCfg;
};
/******************************API***************************************/
/**
 * 设置查询条件面板尺寸
 * @param obj：{
 * 			width: 100,
 * 			hieght: 100
 * 				},高宽属性均为可选属性
 * @return
 */
Wlj.frame.functions.app.App.prototype.setSearchSize = function(obj){
	
	if(!this.needCondition){
		return false;
	}
	var sh,sw;
	if(Ext.isNumber(obj.height)){
		sh = obj.height;
	}
	if(Ext.isNumber(obj.width)){
		sw = obj.width;
	}
	var searchDomain = this.searchDomain;
	var searchPanel = this.searchDomain.searchPanel;
	var searchVs = searchDomain.el ? searchDomain.el.getViewSize() : this.seearchVs;
	var resultDomain = this.resultDomain;
	var majorVs = this.majorPanel.el ? this.majorPanel.el.getViewSize() : {height:0,width:0};
	if(Ext.isNumber(sh)){
		searchDomain.setHeight(sh);
		resultDomain.setHeight(majorVs.height - sh);
	}
	if(Ext.isNumber(sw)){
		searchDomain.setWidth(sw+'px');
	}
};
/**
 * 根据字典类型,获取字典STORE
 * @param type
 * @return
 */
Wlj.frame.functions.app.App.prototype.findLookupByType = function(type){
	if(!type){
		return false;
	}
	if(!this.lookupManager[type]){
		return false;
	}
	return this.lookupManager[type];
};
/**
 * 根据指定配置，刷行一个数据字典数据；
 * @param type
 * @param config
 * @return
 */
Wlj.frame.functions.app.App.prototype.reloadLookup = function(type, config){
	var lStore = this.findLookupByType(type);
	var _this = this;
	if(!lStore){
		return false;
	}else{
		if(!lStore.proxy){
			Ext.warn('数据字典类型【'+type+'】为本地数据字典，无法reload！');
			return false;
		}
		var ccb = config?config.callback : false;
		var cb = function(records, option, succeed){
			Ext.log('lookup store : '+type+' has bean reload!');
			_this.fireEvent('lookupreload', type, lStore, records, config, succeed);
			if(Ext.isFunction(ccb)){
				ccb.call(lStore, records, config, succeed);
			}
		};
		var reloadAble = this.fireEvent('beforelookupreload', type, lStore, config);
		if(reloadAble === false){
			return false;
		}
		var cfg = {};
		Ext.apply(cfg, config);
		cfg.callback = cb;
		try{
			lStore.reload(cfg);
		}catch(e){
			Ext.error('reload lookup '+type+' error!');
		}
	}
};
/**
 * 根据字典类型,把key转换为值
 * @param type
 * @param key
 * @return
 */
Wlj.frame.functions.app.App.prototype.translateLookupByKey = function(type, key){
	var typeStore = this.findLookupByType(type);
	if(!typeStore){
		return key;
	}
	var tDataIndex = typeStore.findExact('key',key);
	if(tDataIndex < 0){
		return key;
	}
	var record = typeStore.getAt(tDataIndex);
	return record.get('value');
};
/**
 * 根据字典类型,把值转换为key
 * @param type
 * @param value
 * @return
 */
Wlj.frame.functions.app.App.prototype.translateLookupByValue = function(type, value){
	var typeStore = this.findLookupByType(type);
	if(!typeStore){
		return false;
	}
	var tDataIndex = typeStore.findExact('value',value);
	if(tDataIndex < 0){
		return false;
	}
	var record = typeStore.getAt(tDataIndex);
	return record.get('key');
};
/**
 * 根据字典类型,把多个以分隔符连接的key转换为值
 * @param type
 * @param key
 * @param separator
 * @return
 */
Wlj.frame.functions.app.App.prototype.translateLookupByMultiKey = function(type, key, separator){
	var typeStore = this.findLookupByType(type);
	if(!typeStore || !separator){
		return key;
	}
	var datas = key.split(separator);
	var returnData = '';
	Ext.each(datas,function(data){
		var tDataIndex = typeStore.findExact('key',data);
		if(tDataIndex < 0){
			returnData += data;
		} else {
			returnData += typeStore.getAt(tDataIndex).get('value');
		}
		returnData += separator;
	});
	returnData = returnData.substring(0,returnData.lastIndexOf(separator));
	return returnData;
};
/**
 * 根据字典类型,把多个以分隔符连接的值转换为key
 * @param type
 * @param value
 * @param separator
 * @return
 */
Wlj.frame.functions.app.App.prototype.translateLookupByMultiValue = function(type, value, separator){
	var typeStore = this.findLookupByType(type);
	if(!typeStore || !separator){
		return value;
	}
	var datas = value.split(separator);
	var returnData = '';
	Ext.each(datas,function(data){
		var tDataIndex = typeStore.findExact('value',data);
		if(tDataIndex < 0){
			returnData += data;
		} else {
			returnData += typeStore.getAt(tDataIndex).get('key');
		}
		returnData += separator;
	});
	returnData = returnData.substring(0,returnData.lastIndexOf(separator));
	return returnData;
};
/**
 * 设置查询条件并刷新数据
 * @param params : 参数
 * @param forceLoad : 是否强制刷新,default : true
 * @param add : 是否清除过期条件,default : true
 * @param transType : 是否需要转换字段命名模式,默认为APP的SEARCHFIELDTRANS属性;1：转为驼峰命名;2：转为大写下划线模式;3：不做转换;
 * @return
 */
Wlj.frame.functions.app.App.prototype.setSearchParams = function(params, forceLoad, add, transType, callbackFn){
	var resultDomain = this.resultDomain;
	
	var settable = this.fireEvent('beforesetsearchparams',params, forceLoad, add, transType);
	
	if(settable === false){
		return false;
	}
	
	if(!params){
		return false;
	}
	if(add === false){
		if(!resultDomain.searchGridView.currentParams){
			resultDomain.searchGridView.currentParams = {};
		}
	}else{
		delete resultDomain.searchGridView.currentParams;
		resultDomain.searchGridView.currentParams = {};
	}
	
	var transType = transType? transType : this.SEARCHFIELDTRANS;
	
	Ext.apply(resultDomain.searchGridView.currentParams,this.translateDataKey(params,transType));
	resultDomain.searchGridView.currentPage = 0;
	this.fireEvent('setsearchparams',params, forceLoad, add, transType);
	if(forceLoad === false){
		resultDomain.searchGridView.store.baseParams = {"condition":Ext.encode(resultDomain.searchGridView.currentParams)};
	}else{
		resultDomain.searchGridView.turnToCurrentPage(callbackFn);
	}
};
/***
 * 获取查询store
 * @return
 */
Wlj.frame.functions.app.App.prototype.getResultStore = function(){
	return this.resultDomain.store;
};
/**
 * 刷新当前数据
 * @return
 */
Wlj.frame.functions.app.App.prototype.reloadCurrentData = function(){
	this.resultDomain.searchGridView.turnToCurrentPage();
};
/**
 * 获取结果域中当前选择数据对象。如无选择数据,则返回false;如选择多条数据，则返回最后一条；
 * @return
 */
Wlj.frame.functions.app.App.prototype.getSelectedData = function(){
	var selectedData = this.resultDomain.searchGridView.getSelected();
	if(selectedData.length<=0){
		return false;
	}else{
		return selectedData[selectedData.length-1];
	}
};
/**
 * 返回当前所有选择数据对象数组。如无选择数据，则返回空数组。
 * @return
 */
Wlj.frame.functions.app.App.prototype.getAllSelects = function(){
	return this.resultDomain.searchGridView.getSelected();
};
/**
 * 判断当前是否有选中的数据行
 * @return boolean
 */
Wlj.frame.functions.app.App.prototype.hasSelected = function(){
	return this.resultDomain.searchGridView.getSelected().length>0;
};
/**
 * 根据index选择数据，
 * @param index：数据行的顺序，从0开始计数；可为单个数字，也可为一个数字组成的数组，如：[1,2,3,4]
 * @return
 */
Wlj.frame.functions.app.App.prototype.selectByIndex = function(index){
	this.resultDomain.searchGridView.selectByIndex(index);
};
/**
 * 取消所有的数据行选择
 * @return
 */
Wlj.frame.functions.app.App.prototype.clearSelect = function(){
	this.resultDomain.searchGridView.clearSelect();
};
/**
 * 反选当前页数据
 * @return
 */
Wlj.frame.functions.app.App.prototype.antiSelect = function(){
	this.resultDomain.searchGridView.antiSelect();
};
/**
 * 全选当前页数据
 * @return
 */
Wlj.frame.functions.app.App.prototype.allSelect = function(){
	this.resultDomain.searchGridView.allSelect();
};
/**
 * 数据提交
 * @param data ：当前表单捕获数据,json格式;
 * @param comitUrl ：可选参数,提交URL,系统默认为app对象的提交URL
 * @param needPid ： 是否需要返回提交数据主键
 * @return
 */
Wlj.frame.functions.app.App.prototype.comitData = function(data,comitUrl,needPid){
	var cUrl = comitUrl?comitUrl:this.comitUrl;
	var commitable = this.fireEvent('beforecommit',data,cUrl);
	if(commitable === false){
		return false;
	}
	if(!cUrl){
		return false;
	}
	var commintData = this.translateDataKey(data,this.VIEWCOMMITTRANS);
	if(Ext.encode(commintData) === "{}"){
		Ext.Msg.alert('提示','提交数据为空！');
		return false;
	}
	var _this = this;
	Ext.Ajax.request({
		url : cUrl,
		method : 'POST',
		params : commintData,
		success : function(response){
			Ext.Msg.alert('提示','保存成功');
			_this.fireEvent('afertcommit',data,cUrl,true);
			if(_this.needGrid !== false){
				_this.reloadCurrentData();
			}
		},
		failure: function(){
			_this.fireEvent('afertcommit',data,cUrl,false);
		}
	});
};

Wlj.frame.functions.app.App.prototype.deleteData = function(){
	
};
/**
 * 转换数据字段名格式,对于空数据项,进行剪除。返回新副本,不变动传入参数的结构
 * @param data ： 待提交数据
 * @param transtype ： 转换类型,1：从大写下划线转换为驼峰命名;2：从驼峰命名转换为大写下划线类型;默认为1;3、不做转换;
 * @return
 */
Wlj.frame.functions.app.App.prototype.translateDataKey = function(data,transtype){
	var translateType = transtype===2?2:transtype===1?1:3;
	var finnalData = {};
	function stringTrans(string){
		if(translateType == 1){
			var strArr = string.toLowerCase().split('_');
			var result = '';
			if(strArr.length <= 0){
				return result;
			}
			for(var i=1;i<strArr.length;i++){
				strArr[i] = strArr[i].substring(0,1).toUpperCase() + strArr[i].substring(1);
			}
			result = strArr.join('');
			return result;
		}else if(translateType==2){
			if(string.length == 0){
				return false;
			}
			var len = string.length;
			var wordsArr = [];
			var start = 0;
			var cur = 0;
			while(cur < len){
				if(string.charCodeAt(cur)<= 90 && string.charCodeAt(cur) >= 65){
					wordsArr.push(string.substring(start,cur).toUpperCase());
					start = cur;
				}
				cur ++ ;
			}
			wordsArr.push(string.substring(start, len).toUpperCase());
			return wordsArr.join('_');
		}else {
			return string;
		}
	}
	for(var key in data){
		if(!data[key]){
			continue;
		}else {
			finnalData[stringTrans(key)] = data[key];
		}
	}
	return finnalData;
};
Wlj.frame.functions.app.App.prototype.reboot = function(){};
/**
 * 根据name属性,获取字段配置信息原本;
 * @param name：可为String类型或者数组;
 * @return
 */
Wlj.frame.functions.app.App.prototype.getFieldsByName = function(name){
	if(!this.fields){
		return false;
	}
	if(!name){
		return false;
	}
	var _this = this;
	if(Ext.isArray(name)){
		var fields = new Array();
		Ext.each(name,function(n){
			Ext.each(_this.fields,function(f){
				if(f.name === n){
					fields.push(f);
				}
			});
		});
		return fields.length>0?fields:false;
	}else if(Ext.isString(name)){
		for(var i=0;i< this.fields.length; i++){
			var field = this.fields[i];
			if(field.name === name){
				return field;
			}
		}
	}
	return false;
};
/**
 * 根据name属性,创建字段配置信息副本;
 * @param name：可为String类型或者数组;
 * @return
 */
Wlj.frame.functions.app.App.prototype.copyFieldsByName = function(name){
	var fields = this.getFieldsByName(name);
	if(!fields){
		return false;
	}
	if(Ext.isArray(fields)){
		var result = new Array();
		Ext.each(fields,function(f){
			var rt = {};
			Ext.apply(rt,f);
			result.push(rt);
		});
		return result;
	}else {
		var result = {};
		Ext.apply(result,fields);
		return result;
	}
};
/**
 * 创建APP对象整体基础字段配置副本
 * @return
 */
Wlj.frame.functions.app.App.prototype.getFieldsCopy = function(){
	var copy = [];
	Ext.each(this.fields,function(f){
		var cf = {};
		Ext.apply(cf,f);
		copy.push(cf);
	});
	return copy;
};
/**
 * 收起查询条件面板
 * @return
 */
Wlj.frame.functions.app.App.prototype.collapseSearchPanel = function(){
	if(this.searchDomain.WCLP){
		return false;
	}
	var collapseable = this.fireEvent('beforeconditioncollapse', this.searchDomain);
	if(collapseable === false){
		return false;
	}
	this.searchDomain.realHeight = this.searchDomain.getHeight();
	this.searchDomain.collapse();
	this.setSearchSize({
		height:0
	});
	this.searchDomain.WCLP = true;
	this.fireEvent('afterconditioncollapse',this.searchDomain);
};
/**
 * 展开查询面板
 * @return
 */
Wlj.frame.functions.app.App.prototype.expandSearchPanel = function(){
	if(!this.searchDomain.WCLP){
		return false;
	}
	var expandable = this.fireEvent('beforeconditionexpand', this.searchDomain);
	if(expandable === false){
		return false;
	}
	this.searchDomain.expand();
	if(Ext.isNumber(this.searchDomain.realHeight)){
		this.setSearchSize.defer(150,this,[{
			height:this.searchDomain.realHeight
		}]);
	}
	this.searchDomain.WCLP = false;
	this.fireEvent('afterconditionexpand', this.searchDomain);
};
/**
 * 获取边缘面板对象；
 * params ： 'left','right','top','buttom'
 */
Wlj.frame.functions.app.App.prototype.getEdgePanel = function(position){
	var pm = {
		left : 'west',
		west : 'west',
		right : 'east',
		east : 'east',
		top : 'north',
		north : 'north',
		buttom : 'south',
		south : 'south'
	};
	return (this.viewPort.rendered && this.viewPort.layout[pm[position]])?this.viewPort.layout[pm[position]].panel : false;
};
/**
 * 重置查询条件；
 * params ： deldy : 是否删除动态字段；
 */
Wlj.frame.functions.app.App.prototype.resetCondition = function(deldy){
	this.searchDomain.resetCondition(deldy);
};
/**
 * 获取当前展示信息VIEW对象,展示列表时,返回undefined;
 */
Wlj.frame.functions.app.App.prototype.getCurrentView = function(){
	return this.resultDomain.currentView;
};
/**
 * 隐藏当前展示信息VIEW对象；
 */
Wlj.frame.functions.app.App.prototype.hideCurrentView = function(){
	if(WLJUTIL.suspendViews){
		this.resultDomain.hideCurrentView();
	}else{
		this.resultDomain.gridMoveIn();
	}
};
/**
 * 获取详情VIEW,无详情面板返回false；
 */
Wlj.frame.functions.app.App.prototype.getDetailView = function(){
	return this.resultDomain.viewPanel.detailView?this.resultDomain.viewPanel.detailView:false;
};
/**
 * 获取新增VIEW,无新增面板返回false；
 */
Wlj.frame.functions.app.App.prototype.getCreateView = function(){
	return this.resultDomain.viewPanel.createView?this.resultDomain.viewPanel.createView:false;
};
/**
 * 获取修改VIEW,无修改面板返回false；
 */
Wlj.frame.functions.app.App.prototype.getEditView = function(){
	return this.resultDomain.viewPanel.editView?this.resultDomain.viewPanel.editView:false;
};
/**
 * 展示详情VIEW,无详情面板返回false；
 */
Wlj.frame.functions.app.App.prototype.showDetailView = function(){
	var detailView = this.getDetailView();
	if(!detailView || detailView == this.getCurrentView()){
		return false;
	}
	this.resultDomain.showView(detailView);
};
/**
 * 展示新增VIEW,无新增面板返回false；
 */
Wlj.frame.functions.app.App.prototype.showCreateView = function(){
	var createView = this.getCreateView();
	if(!createView || createView == this.getCurrentView()){
		return false;
	}
	this.resultDomain.showView(createView);
};
/**
 * 展示修改VIEW,无修改面板返回false；
 */
Wlj.frame.functions.app.App.prototype.showEditView = function(){
	var editView = this.getEditView();
	if(!editView || editView == this.getCurrentView()){
		return false;
	}
	this.resultDomain.showView(editView);
};
/**
 * 根据标题获取自定义信息VIEW
 * @param title : view标题
 * @return
 */
Wlj.frame.functions.app.App.prototype.getCustomerViewByTitle = function(title){
	var views = this.resultDomain.customerViewPanels;
	for(var i=0;i<views.length; i++){
		if(views[i]._defaultTitle == title){
			return views[i];
		}
	}
	return false;
};
/**
 * 根据顺序获取自定义信息VIEW
 * @param index：顺序
 * @return
 */
Wlj.frame.functions.app.App.prototype.getCustomerViewByIndex = function(index){
	var views = this.resultDomain.customerViewPanels;
	return views[index]?views[index]:false;
};
/**
 * 根据标题展示自定义信息VIEW
 * @param title：标题
 * @return
 */
Wlj.frame.functions.app.App.prototype.showCustomerViewByTitle = function(title){
	var view = this.getCustomerViewByTitle(title);
	if(!view || view === this.getCurrentView()){
		return false;
	}
	this.resultDomain.showView(view);
};
/**
 * 根据顺序展示自定义信息VIEW
 * @param index：顺序
 * @return
 */
Wlj.frame.functions.app.App.prototype.showCustomerViewByIndex = function(index){
	var view = this.getCustomerViewByIndex(index);
	if(!view || view === this.getCurrentView()){
		return false;
	}
	this.resultDomain.showView(view);
};
/**
 * 锁定查询结果列表，下一次查询结果重新加载数据时，不在执行结果列表滑入方法；相关事件也不再触发；
 * 结果列表锁定状态只能持续一次查询；包括手动调用和自动触发；
 * @return
 */
Wlj.frame.functions.app.App.prototype.lockGrid = function(){
	this.resultDomain.gridLockedOnce = true;
};
/**
 * 解锁查询结果列表锁定状态，如其为未锁定状态，则无任何影像；
 * @return
 */
Wlj.frame.functions.app.App.prototype.unlockGrid = function(){
	this.resultDomain.gridLockedOnce = false;
};
/**
 * 展示下一个面板
 * @return
 */
Wlj.frame.functions.app.App.prototype.showNextView = function(){
	this.resultDomain.showNextView();
};
/**
 * 根据字段name属性进行排序
 * @param dataIndex：字段name属性
 * @param info：可选：asc、desc；小写。
 * @return
 */
Wlj.frame.functions.app.App.prototype.sortByDataIndex = function(dataIndex, info){
	this.resultDomain.searchGridView.sort(dataIndex, info);
};
/**
 * 根据字段name属性显示该字段
 * @param fields：string/array ，可为单个字段名，也可为字段名属性
 * @return
 */
Wlj.frame.functions.app.App.prototype.showGridFields = function(fields){
	this.resultDomain.searchGridView.showFields(fields);
};
/**
 * 根据字段name属性隐藏该字段
 * @param fields：string/array ，可为单个字段名，也可为字段名属性
 * @return
 */
Wlj.frame.functions.app.App.prototype.hideGridFields = function(fields){
	this.resultDomain.searchGridView.hideFields(fields);
};
/**
 * 获取当前已隐藏的字段name属性数组
 * @return
 */
Wlj.frame.functions.app.App.prototype.getGridHiddenFields = function(){
	return this.resultDomain.searchGridView.getHiddenFields();
};
/**
 * 添加一个查询条件字段
 * @param field：String/Object:当参数为String类型的时候，系统将会根据name属性查找元数据（fields）中的配置进行添加；
 * 							   当参数Object类型的时候，系统将会根据参数本身的配置，进行添加。参数配置参加fields属性中字段配置项；
 * @return
 */
Wlj.frame.functions.app.App.prototype.addConditionField = function(field){
	this.searchDomain.addField(field);
};
/**
 * 移除一个查询条件字段
 * @param field：String/Object：当参数为String类型的时候，系统将会根据name属性移除字段；
 * 								当参数为Object类型的时候，判断其为实际的字段对象还是配置项，如为字段对象直接移除，如为配置，则根据参数的name属性移除。
 * @return
 */
Wlj.frame.functions.app.App.prototype.removeConditionField = function(field){
	this.searchDomain.removeField(field);
};
/**
 * 获取一个查询条件字段
 * @param field：String/Object：String类型则根据字段name属性获取字段；Object类型则根据参数中的name属性进行匹配。
 * @return
 */
Wlj.frame.functions.app.App.prototype.getConditionField = function(field){
	return this.searchDomain.getField(field);
};
/**
 * 判断是否存在一个查询条件字段
 * @param field：String/Object：String类型则根据字段name属性获取字段；Object类型则根据参数中的name属性进行匹配。
 * @return
 */
Wlj.frame.functions.app.App.prototype.hasConditionField = function(field){
	if(this.getConditionField(field)){
		return true;
	}else{
		return false;
	}
};
/**
 * 添加一个字段元数据,实时展现在列表对象上.不影响面板及其他,待更新
 * @param field：object，字段配置
 * @return
 */
Wlj.frame.functions.app.App.prototype.addMetaField = function(field){
	if(!Ext.isObject(field)){
		return false;
	}
	if(!field.name){
		return false;
	}
	if(this.getFieldsByName(field.name)){
		return false;
	}
	this.onMetaAdd(field);
};
/**
 * 移除一个字段元数据，实时反映在列表对象上，不影响面板及其他，待更新
 * @param field：string/object
 * @return
 */
Wlj.frame.functions.app.App.prototype.removeMetaField = function(field){
	var fieldName = '';
	if(Ext.isObject(field)){
		if(!field.name){
			return false;
		}else{
			fieldName = field.name;
		}
	}else if(Ext.isString(field)){
		fieldName = field;
	}
	this.onMetaRemove(field);
};
/**
 * 在指定字段之后添加字段。
 * @param addField：被添加字段配置；参见字段配置；
 * @param theField：指定字段name属性，string类型；如未发现指定字段，则添加至最后；
 * @return
 */
Wlj.frame.functions.app.App.prototype.addMetaAfter = function(addField, theField){
	if(!Ext.isObject(addField)){
		return false;
	}
	if(!addField.name){
		return false;
	}
	if(this.getFieldsByName(addField.name)){
		return false;
	}
	this.onMetaAddAfter(addField, theField);
};
/**
 * 在指定字段之前添加字段。
 * @param addField：被添加字段配置；参见字段配置；
 * @param theField：指定字段name属性，string类型；如未发现指定字段，则添加至最后；
 * @return
 */
Wlj.frame.functions.app.App.prototype.addMetaBefore = function(addField, theField){
	if(!Ext.isObject(addField)){
		return false;
	}
	if(!addField.name){
		return false;
	}
	if(this.getFieldsByName(addField.name)){
		return false;
	}
	this.onMetaAddBefore(addField, theField);
};
/**
 * 是否存在查询面板按钮
 * @param but:操作的按钮类型,Wlj.frame.functions.app.App.prototype.BUTTON_TYPE
 * @return
 */
Wlj.frame.functions.app.App.prototype.hasConditionButton = function(but){
	return this.searchDomain.hasConditionButton(but);
};
/**
 * 禁用查询面板按钮
 * @param but:操作的按钮类型,Wlj.frame.functions.app.App.prototype.BUTTON_TYPE
 * @return
 */
Wlj.frame.functions.app.App.prototype.disableConditionButton = function(but){
	this.searchDomain.disableConditionButton(but);
};
/**
 * 启用查询面板按钮
 * @param but:操作的按钮类型,Wlj.frame.functions.app.App.prototype.BUTTON_TYPE
 * @return
 */
Wlj.frame.functions.app.App.prototype.enableConditionButton = function(but){
	this.searchDomain.enableConditionButton(but);
};
/**
 * 隐藏查询面板按钮
 * @param but:操作的按钮类型,Wlj.frame.functions.app.App.prototype.BUTTON_TYPE
 * @return
 */
Wlj.frame.functions.app.App.prototype.hideConditionButton = function(but){
	this.searchDomain.hideConditionButton(but);
};
/**
 * 显示查询面板按钮
 * @param but:操作的按钮类型,Wlj.frame.functions.app.App.prototype.BUTTON_TYPE
 * @return
 */
Wlj.frame.functions.app.App.prototype.showConditionButton = function(but){
	this.searchDomain.showConditionButton(but);
};
/**
 * 遮罩指定区域
 * @param regions: String/Array[String]:需要遮罩的区域'left','right','top','buttom',
 * 'east','west','north','south','searchDomain','resultDomain'
 * @param message: String:遮罩提示信息
 * */
Wlj.frame.functions.app.App.prototype.maskRegion = function(regions,message){
	var _this = this;
	function mask(r){
		if (r == 'searchDomain') {
			if (_this.searchDomain) {
				_this.searchDomain.getEl().mask(message);
			}
		} else if(r == 'resultDomain') {
			if (_this.resultDomain) {
				_this.resultDomain.getEl().mask(message);
			}
		} else {
			if (_this.getEdgePanel(r)) {
				_this.getEdgePanel(r).getEl().mask(message);
			}
		}
	}
	if (regions instanceof Array) {
		regions.forEach(mask);
	} else {
		mask(regions);
	}
};
/**
 * 去遮罩指定区域
 * @param String/Array[String]:需要去遮罩的区域'left','right','top','buttom',
 * 'east','west','north','south','searchDomain','resultDomain'
 * */
Wlj.frame.functions.app.App.prototype.unmaskRegion = function(regions){
	var _this = this;
	function unmask(r){
		if (r == 'searchDomain') {
			if (_this.searchDomain) {
				_this.searchDomain.getEl().unmask();
			}
		} else if(r == 'resultDomain') {
			if (_this.resultDomain) {
				_this.resultDomain.getEl().unmask();
			}
		} else {
			if (_this.getEdgePanel(r)) {
				_this.getEdgePanel(r).getEl().unmask();
			}
		}
	}
	if (regions instanceof Array) {
		regions.forEach(unmask);
	} else {
		unmask(regions);
	}
};
/**
 * 打开客户视图
 * @param String/Object : custId 客户ID 或 {viewId :客户ID}
 */
Wlj.frame.functions.app.App.prototype.openCustomerView = function(cfg){
	if(Ext.isFunction(top.window.openCustomerView)) {
		top.window.openCustomerView(cfg);
	}
};
Wlj.frame.functions.app.App.prototype.setFieldTile = function(cfg){
	var _this = this;
	if(Ext.isArray(cfg)){
		Ext.each(cfg, function(c){
			_this.setFieldTile(c);
		});
	}else{
		if(Ext.isObject(cfg)){
			if(cfg.name && cfg.text ){
				this.resultDomain.searchGridView.setFieldTitle(cfg);
			}
		}
	}
};

Wlj.frame.functions.app.App.prototype.addStepData = function(record){
	if(!window._IM){
		return false;
	}
	var stepO = window._IM.fc.getStepContainerByResId(this.resId);
	stepO.addData(record);
};
Wlj.frame.functions.app.App.prototype.getViewTotalIndex = function(view){
	var rd = this.resultDomain;
	return view.getIndex();
};
Wlj.frame.functions.app.App.prototype.showViewByTotalIndex = function(index){
	var rd = this.resultDomain;
	rd.showView(rd.getViewByTotleIndex(index));
};
Wlj.frame.functions.app.App.prototype.getStat = function(){
	var appStat = {};
	appStat.curParams = this.resultDomain.searchGridView.currentParams;
	var alls = this.getAllSelects();
	var ss = [];
	Ext.each(alls, function(data){
		ss.push(data.store.indexOf(data));
	});
	appStat.sels = ss;
	if(this.getCurrentView()){
		var cvindex = this.getViewTotalIndex(this.getCurrentView());
		appStat.cindex = cvindex;
	}
	return appStat;
};
Wlj.frame.functions.app.App.prototype.initStat = function(stat){
	var _this= this;
	if(stat.curParams){
		this.searchDomain.searchPanel.getForm().setValues(stat.curParams);
		this.setSearchParams(stat.curParams, true,true,undefined,function(){
			if(stat.sels){
				_this.selectByIndex(stat.sels);
			}
			if(Ext.isNumber(stat.cindex)){
				_this.showViewByTotalIndex(stat.cindex);
			}
		});
	}
};

Ext.ns('Wlj.frame.functions.app');
Wlj.frame.functions.app.Builder = function(){
	Wlj.frame.functions.app.Builder.superclass.constructor.call(this);
	this.codeLoad();
};
Ext.extend(Wlj.frame.functions.app.Builder,Ext.util.Observable,{
	builderMode : 'debug',										//debug,run
	resId : false,
	codeFile : false,
	buildFlow : false,
	buildEvirement : function(){
		window.url = false;
		window.comitUrl = false;
		window.fields = false;
		window.autoLoadGrid = true;
		window.needCondition = true;
		window.needGrid = true;
		window.needTbar = true;
		window.createView = false;
		window.editView = false;
		window.detailView = false;
		window.formViewers = false;
		window.createFormViewer = false;
		window.editFormViewer = false;
		window.detailFormViewer = false;
		window.formCfgs = false;
		window.createFormCfgs = false;
		window.editFormCfgs = false;
		window.detailFormCfgs = false;
		window.validates = false;
		window.createValidates = false;
		window.editValidates = false;
		window.linkages =	false;
		window.createLinkages = false;
		window.editLinkages = false;
		window.lookupTypes = false;
		window.localLookup = false;
		window.edgeVies = false;
		window.customerView = false;
		window.treeLoaders = false;
		window.treeCfgs = false;
		window.tbar = false;
		window.listeners = {
				beforeinit : true,
				afterinit : true,
				beforeconditioninit : true,
				afterconditioninit : true,
				beforeconditionrender : true,
				afterconditionrender : true,
				beforeconditionadd : true,
				conditionadd : true,
				beforeconditionremove : true,
				conditionremove : true,
				beforedyfieldclear : true,
				afterdyfieldclear : true,
				beforeconditioncollapse : true,
				afterconditioncollapse : true,
				beforeconditionexpand : true,
				afterconditionexpand : true,
				beforecondtitionfieldvalue : true,
				condtitionfieldvalue : true,
				recordselect : true,
				rowdblclick : true,
				load : true,
				beforesetsearchparams : true,
				setsearchparams : true,
				beforeresultinit : true,
				afterresultinit : true,
				beforeresultrender : true,
				afterresultrender : true,
				beforecreateviewrender : true,
				aftercreateviewrender : true,
				beforeeditviewrender : true,
				aftereditviewrender : true,
				beforedetailviewrender : true,
				afterdetailviewrender : true,
				beforeviewshow : true,
				viewshow : true,
				beforeviewhide : true,
				viewhide : true,
				beforevalidate :true,
				validate : true,
				beforecommit : true,
				afertcommit : true,
				beforeeditload : true,
				aftereditload : true,
				beforedetailload : true,
				afterdetailload : true,
				beforetophide : true,
				tophide : true,
				beforetopshow : true,
				topshow : true,
				beforelefthide : true,
				lefthide : true,
				beforeleftshow : true,
				leftshow : true,
				beforebuttomhide : true,
				buttomhide : true,
				beforebuttomshow : true,
				buttomshow : true,
				beforerighthide : true,
				righthide : true,
				beforerightshow : true,
				rightshow : true,
				lookupinit : true,
				locallookupinit : true,
				alllookupinit : true,
				beforelookupreload : true,
				lookupreload : true,
				beforetreecreate : true,
				treecreate : true
			};
	},
	codeLoad : function(callbackIm){
		this.buildEvirement();
		this.resId = JsContext._resId;
		if(!this.resId){
			Ext.error(WERROR.NORESIDERROR);
			return false;
		}
		this.getCodeFilePage();
		if(!this.codeFile){
			Ext.error(WERROR.NOCODEFILEERROR);
			return false;
		}
		this.codeLoading(callbackIm);
	},
	getCodeFilePage : function(){
		if(parent.Wlj){
			if(parent.Wlj.ServiceMgr.services.get('service_'+this.resId)){
				this.codeFile = parent.Wlj.ServiceMgr.services.get('service_'+this.resId).menuData.ACTION;
			}else{
				var searchType = this.resId.substring(7);
				if(parent.Wlj){
					for(var i=0;i<parent.Wlj.search.App.SEARCHTYPES.length;i++){
						if(searchType === parent.Wlj.search.App.SEARCHTYPES[i].searchType){
							this.codeFile = parent.Wlj.search.App.SEARCHTYPES[i].searchUrl;
							break;
						}
					}
				}
			}
		}else if(parent.booter){
			var menu = parent.booter.findMenuDataById(this.resId);
			if(menu){
				this.codeFile = menu.ACTION;
			}
		}
	},
	codeLoading : function(callbackIm){
		if(this.codeFile.indexOf('.jsp') >= 0){
			window.location.href = basepath + this.codeFile+'?resId='+this.resId;
		}else{
			var _this = this;
//			此方案采用HTML标签方式加载业务逻辑代码；
//			此方案业务应用程序会被浏览器缓存，终端用户只需要第一次进入时，或者业务逻辑代码发生变化时，才会加载业务逻辑代码；
//			此方案业务逻辑程序被浏览器缓存在浏览器中，对外可见；
			_this.busiTag = document.createElement('script');
			_this.busiTag.type = "text/javascript";
			_this.busiTag.src = basepath + this.codeFile;
			if(Ext.isIE6 || Ext.isIE7 || Ext.isIE8 || Ext.isIE9 || Ext.isIE10){
				_this.busiTag.onreadystatechange = function(){
					if(_this.busiTag.readyState == 'loaded' || _this.busiTag.readyState == "complete"){
						_this.codeCheck.call(_this);
					}
				};
			}else{
				_this.busiTag.onload = function(){
					_this.codeCheck.call(_this);
				};
			}
			document.body.appendChild(_this.busiTag);
//			采用AJAX可方案请求代码串，然后执行；
//			此方案会导致浏览器缓存失效，每次访问均需要请求逻辑代码；
//			但逻辑代码不会被缓存，业务逻辑被一定程度隐藏；
//			Ext.ScriptLoader.loadScript({
//				scripts: [
//				          basepath + this.codeFile
//				          ],
//				finalCallback: function(response){
//					_this.codeCheck(callbackIm);
//				}
//			});
		}
	},
	
	codeCheck : function(callbackIm){
		
		if(this.builderMode === 'debug'){
			var cancle = false;
			Ext.log('检查配置项');
			Ext.log('检查远程数据字典项配置[lookupTypes]:');
			if(!Ext.isArray(window.lookupTypes)){
				Ext.warn('无远程数据字典项或配置格式不正确，将被置为空！请检查【lookupTypes】配置');
				window.lookupTypes = [];
			}else{
				Ext.log('共发现['+lookupTypes.length+']个远程数据字典配置项：'+lookupTypes.join(','));
			}
			Ext.log('检查远程数据字典项配置检查完毕');
			
			Ext.log('检查本地数据字典项配置[localLookup]:');
			if(!Ext.isObject(window.localLookup)){
				Ext.log('未申明本地数据字典项,或配置不正确');
				window.localLookup = {};
			}else{
				var tk=[];
				for(var key in localLookup){
					tk.push(key);
				}
				Ext.log('共发现['+tk.length+']个远程数据字典配置项：'+tk.join(','));
			}
			Ext.log('检查本地数据字典项配置检查完毕');
			
			Ext.log('检查是否需要产寻结果[needGrid]属性！');
			if(window.needGrid === false){
				Ext.log('检查结果为false，跳过对url的检查');
			}else{
				Ext.log('检查主功能URL:[url]属性');
				if(typeof window.url !== 'string'){
					Ext.error('无[url]属性，或者[url]属性配置错误！');
					Ext.error('APP构建出错, APP构建停止');
					cancle = true;
					return false;
				}else{
					Ext.log('发现属性[url],值为：'+url);
					if(typeof window.comitUrl !== 'string'){
						Ext.warn('未发现数据提交URL：【comitUrl】,将使用[url]属性做为提交URL');
						window.comitUrl = window.url;
					}else{
						Ext.log('发现数据提交URL：[comitUrl],值为:'+window.comitUrl);
					}
				}
			}
			
			Ext.log('检查字段配置属性:[fields];');
			if(typeof fields === 'undefined' || Ext.isEmpty(fields) || !Ext.isArray(fields) || fields.length == 0){
				Ext.error('页面无基础字段配置或字段配置不正确，请检查【fields】属性！');
				Ext.error('APP构建出错, APP构建停止');
				return false;
			}
			var checkFieldsMap = {};
			for(var i=0; i<fields.length; i++){
				var fi = fields[i];
				if(!fi.name){
					Ext.error('第['+i+']个字段无name属性，请检查配置;请检查【fields】属性第【'+i+'】个字段配置！');
					continue;
				}else{
					Ext.log('发现字段['+fi.name+'];');
					checkFieldsMap[fi.name] = fi;
					continue;
				}
			}
			
			if(cancle){
				Ext.error('APP构建出错, APP构建停止');
				return false;
			}
			
			if(window['needCondition'] === false){
				Ext.log('【needCondition】为false，不构建产寻条件面板');
			}
			if(window.needTbar === false){
				Ext.log('【needTbar】为false，不构建查询结果面板tbar对象');
			}
			
			var typeMap = {
					create : '新增',
					edit : '修改',
					detail : '详情'
			};
			
			function checkFormViewers(){
				
				function checkFV( fvtype){
					
					function checkFVInner(type, config){
						var panelName = typeMap[type];
						Ext.log('检查['+panelName+']面板内部配置');
						if(!Ext.isArray(config)){
							Ext.error('['+panelName+']面板配置不是数组形式，无法解析！请检查【formViewers】或者【'+fvtype+'FormViewer】配置');
							cancle = true;
							return false;
						}else{
							Ext.log('['+panelName+']面板内部共['+config.length+']个字段组！');
							for(var ci=0; ci<config.length; ci ++){
								Ext.log('检查第['+ci+']个字段组：');
								if(!Ext.isArray(config[ci].fields)){
									Ext.error('['+panelName+']面板第['+ci+']个字段组，字段配置不为数组形式，无法解析,请检查【formViewers】或者【'+fvtype+'FormViewer】配置第【'+ci+'】个字段组的field属性');
									cancle = true;
									continue;
								}else{
									for(var fi = 0; fi<config[ci].fields.length; fi++ ){
										var finame = config[ci].fields[fi];
										if(!checkFieldsMap[finame]){
											Ext.warn('['+panelName+']面板第['+ci+']个字段组：第['+fi+']个字段：['+finame+']，未在基础字段配置中出现，可能无法展现；请检查【formViewers】或者【'+fvtype+'FormViewer】配置');
										}else{
											Ext.log('发现第['+fi+']个字段：['+finame+']；');
										}
									}
								}
								if(!Ext.isFunction(config[ci].fn)){
									Ext.warn('['+panelName+']面板第['+ci+']个字段组：[fn]属性不是有效function,将按照默认顺序渲染，请检查【formViewers】或者【'+fvtype+'FormViewer】配置');
									config[ci].fn = false;
								}
								Ext.log('第['+ci+']个字段组检查完毕');
							}
							Ext.log('['+panelName+']面板内部检查完毕！');
						}
					}
					
					Ext.log('开始检查['+typeMap[fvtype]+']面板表单设计');
					if(!Ext.isArray(window[fvtype+'FormViewer'])){
						Ext.log('无'+typeMap[fvtype]+'面板表单设计或者类型不为数组属性：['+fvtype+'FormViewer]');
						Ext.log('检查[formViewers]属性配置，做为['+typeMap[fvtype]+']面板表单设计');
						if(typeof formViewers === 'undefined' || !Ext.isArray(formViewers)){
							Ext.log('无[formViewers]属性配置！');
							Ext.warn(typeMap[fvtype]+'面板表单将被隐藏');
							return false;
						}else{
							window[fvtype+'FormViewer'] = formViewers;
							Ext.log('以[formViewers]属性配置，做为['+typeMap[fvtype]+'面板表单设计');
							checkFVInner(fvtype,window[fvtype+'FormViewer']);
							return true;
						}
					}else{
						Ext.log('发现'+typeMap[fvtype]+'面板表单设计属性：['+fvtype+'FormViewer]');
						checkFVInner(fvtype,window[fvtype+'FormViewer']);
						return true;
					}
				}
				
				if(typeof createView === 'undefined'){
					window.createView = false;
				}
				if(typeof editView === 'undefined'){
					window.editView = false;
				}
				if(typeof detailView === 'undefined'){
					window.detailView = false;
				}
				
				if(!createView && !editView && !detailView){
					Ext.warn('新增、修改、详情面板配置均不可展现');
					return ;
				}
				
				var createError = true;
				var editError = true;
				var detailError = true;
				
				if(!createView){
					Ext.log('页面无新增面板');
					window.createFormViewer = false;
				}else{
					createError = checkFV('create');
				}
				if(!editView){
					Ext.log('页面无修改面板');
					window.editFormViewer = false;
				}else{
					editError = checkFV('edit');
				}
				if(!detailView){
					Ext.log('页面无详情面板');
					window.detailFormViewer = false;
				}else{
					detailError = checkFV('detail');
				}
				
				if(!createError && !editError && !detailError){
					Ext.warn('新增、修改、详情面板配置均不可展现');
				}
				Ext.log('新增、修改、详情面板配置检查完毕!');
			}
			checkFormViewers();	
			
			if(cancle){
				Ext.error('APP构建出错, APP构建停止');
				return false;
			}
			
			Ext.log('构建面板特殊配置[formCfgs|createFormCfgs|editFormCfgs|detailFormCfgs]');
			if(window.createFormCfgs === false){
				Ext.log('无新增面板配置，用【formCfgs】代替');
				window.createFormCfgs = window.formCfgs;
			}
			if(window.editFormCfgs === false){
				Ext.log('无修改面板配置，用【formCfgs】代替');
				window.editFormCfgs = window.formCfgs;
			}
			if(window.detailFormCfgs === false){
				Ext.log('无详情面板配置，用【formCfgs】代替');
				window.detailFormCfgs = window.formCfgs;
			}
			
			Ext.log('特殊配置检查完毕');
			
			
			Ext.log('开始检查校验规则配置[validates|createValidates|editValidates]:');
			function checkValidates(vtype){
				var vname = typeMap[vtype];
				var vkey = vtype+'Validates';
				
				function checkValiInner(){
					var valiInner = window[vkey];
					if(!Ext.isArray(window[vkey])){
						Ext.warn('['+vname+']校验规则配置不是数组形式，无法解析；请检查【validates】或者【'+vtype+'Validates】配置');
					}else{
						Ext.log('发现['+vname+']校验规则配置,共['+valiInner.length+']条;');
						for(var vi =0; vi <valiInner.length; vi++){
							Ext.log('开始检查第['+vi+']条校验配置:['+valiInner[vi].desc+']');
							var vo = valiInner[vi];
							var fs = vo.dataFields;
							var fn = vo.fn;
							if(fs === 'undefined' || !Ext.isArray(fs) || fs.length == 0 ){
								Ext.warn('['+vname+']面板第['+vi+']条校验配置:['+valiInner[vi].desc+']字段属性[dataFields]配置有误，请检查【validates】或者【'+vtype+'Validates】配置');
								Ext.log('第['+vi+']条校验配置:['+valiInner[vi].desc+']校验完毕');
							}else{
								var ef = [];
								Ext.each(fs, function(f){
									if(!checkFieldsMap[f]){
										ef.push(f);
									}
								});
								if(ef.length > 0){
									Ext.warn('['+vname+']面板第['+vi+']条校验规则字段：['+ef.join(',')+']无基础字段属性配置，校验触发时，无法接收到值！请检查【validates】或者【'+vtype+'Validates】配置');
								}
								if(!fn || !Ext.isFunction(fn)){
									Ext.warn('['+vname+']面板第['+vi+']条校验规则无校验函数,将以空方法补充，请检查【validates】或者【'+vtype+'Validates】配置');
									vo.fn = Ext.emptyFn;
								}
								Ext.log('第['+vi+']条校验配置:['+valiInner[vi].desc+']校验完毕');
							}
						}
					}
				}
				
				Ext.log('开始检查['+vname+']校验规则配置：['+vtype+'Validates]');
				if(!Ext.isArray(window[vkey])){
					Ext.log('未发现['+vname+']校验配置或者配置不是数组形式,将以基础校验规则[validates]代替');
					if(typeof validates === 'undefined'){
						Ext.log('未发现基础校验配置，['+vname+']操作将不做校验');
					}else {
						window[vkey] = validates;
						checkValiInner();
					}
				}else{
					checkValiInner();
				}
				Ext.log('['+vname+']校验规则配置['+vkey+']检查完毕！');
			}
			checkValidates('create');
			checkValidates('edit');
			
			Ext.log('校验规则配置检查完毕！');
			
			Ext.log('字段联动逻辑配置检查[linkages|createLinkages|editLinkages];');
			
			function checkLinkages(ltype){
				var lname = typeMap[ltype];
				var lkey = ltype+'Linkages';
				
				function checkLinkageInner(){
					if(!Ext.isObject(window[lkey])){
						Ext.warn('['+lname+']面板字段联动逻辑配置有误,请检查【linkages】或者【'+lkey+'】');
					}else{
						for(var key in window[lkey]){
							Ext.log('开始检查字段联动逻辑['+key+']');
							if(!checkFieldsMap[key]){
								Ext.warn('['+lname+']面板字段联动['+key+']未在基础字段配置中出现，将无法触发！请检查【linkages】或者【'+lkey+'】的【'+key+'】属性');
							}else{
								Ext.log('发现字段联动逻辑：['+key+']');
								var onelink = window[lkey][key];
								if(!onelink.fields || !Ext.isArray(onelink.fields)){
									Ext.log('字段联动逻辑：['+key+']无联动字段配置,请检查【linkages】或者【'+lkey+'】的【'+key+'】属性');
								}else{
									var ef = [];
									Ext.each(onelink.fields,function(f){
										if(!checkFieldsMap[f]){
											ef.push(f);
										}
									});
									if(ef.length > 0 ){
										Ext.warn('['+lname+']面板联动逻辑：['+key+']的受联动字段：['+ef.join(',')+']未在基础字段中配置，联动逻辑可能出错！,请检查【linkages】或者【'+lkey+'】的【'+key+'】属性');
									}
									if(!Ext.isFunction(onelink.fn)){
										Ext.warn('['+lname+']面板字段联动逻辑['+key+']无联动function，将以空方法补充');
										onelink.fn = Ext.emptyFn;
									}
								}
							}
							Ext.log('字段联动逻辑['+key+']检查完毕!');
						}
					}
				}
				
				Ext.log('开始['+lname+']面板字段联动逻辑检查');
				if(!Ext.isObject(window[lkey])){
					Ext.log('未发现['+lname+']面板字段联动逻辑或者配置不是数组形式,将以基础联动逻辑配置[linkages]代替');
					if(typeof linkages === 'undefined'){
						Ext.log('未发现基础联动逻辑配置');
					}else{
						window[lkey] = linkages;
						checkLinkageInner();
					}
				}else{
					checkLinkageInner();
				}
				
				Ext.log('['+lname+']面板字段联动逻辑检查完毕！');
			}
			
			checkLinkages('create');
			checkLinkages('edit');
			
			Ext.log('字段联动逻辑配置检查完毕！');
			
			if(Ext.isObject(window.edgeVies)){
				if(edgeVies.left){
					Ext.log('发现左部面板配置[edgeVies.left]');
				}
				if(edgeVies.right){
					Ext.log('发现左部面板配置[edgeVies.right]');
				}
				if(edgeVies.top){
					Ext.log('发现左部面板配置[edgeVies.top]');
				}
				if(edgeVies.buttom){
					Ext.log('发现左部面板配置[edgeVies.buttom]');
				}
			}
			
			if(Ext.isArray(window.customerView)){
				Ext.log('发现['+customerView.length+']个客户化扩展面板！');
			}else{
				if(window.customerView === false){
					Ext.log('无客户化扩展面板配置');
				}else{
					Ext.warn('客户化扩展面板配置有误，将被忽略');
					window.customerView = false;
				}
			}
			
			if(Ext.isObject(window.listeners)){
				for(var key in listeners){
					if(listeners[key]===true && Ext.isFunction(window[key])){
						listeners[key] = window[key];
						Ext.log('发现监听器：['+key+'];');
					}else{
						delete listeners[key] ;
					}
				}
			}
			if(Ext.isArray(window.tbar)){
				Ext.each(tbar,function(tb){
					Ext.log('发现自定义按钮：['+tb.text+'];');
				});
			}else{
				if(window.tbar===false){
					Ext.log('无自定义按钮配置');
				}else{
					Ext.warn('自定义按钮[tbar]配置有误，将被忽略');
					window.tbar = false;
				}
			}
			
			Ext.log('配置项检查通过');
			delete checkFieldsMap;
		}else{
			if(!window.comitUrl){
				window.comitUrl = window.url;
			}
			if(window.createView){
				if(!window.createFormViewer){
					window.createFormViewer = window.formViewers;
				}
				if(!window.createFormCfgs){
					window.createFormCfgs = window.formCfgs;
				}
				if(!window.createValidates){
					window.createValidates = window.validates;
				}
				if(!window.createLinkages){
					window.createLinkages = window.linkages;
				}
			}
			if(window.editView){
				if(!window.editFormViewer){
					window.editFormViewer = window.formViewers;
				}
				if(!window.editFormCfgs){
					window.editFormCfgs = window.formCfgs;
				}
				if(!window.editValidates){
					window.editValidates = window.validates;
				}
				if(!window.editLinkages){
					window.editLinkages = window.linkages;
				}
			}
			if(window.detailView){
				if(!window.detailFormViewer){
					window.detailFormViewer = window.formViewers;
				}
				if(!window.detailFormCfgs){
					window.detailFormCfgs = window.formCfgs;
				}
			}
			if(Ext.isObject(window.listeners)){
				for(var key in listeners){
					if(listeners[key]===true && Ext.isFunction(window[key])){
						listeners[key] = window[key];
					}else{
						delete listeners[key] ;
					}
				}
			}
		}
		
		this.APPCFG = {
			resId : this.resId,
			needCondition : window.needCondition,
			needTbar : window.needTbar,
			needGrid : window.needGrid,
			autoLoadGrid : (Ext.isFunction(callbackIm))?false:window.autoLoadGrid,
			url : window.url,
			comitUrl : window.comitUrl,
			fields : window.fields,
			createView : window.createView,
			editView : window.editView,
			detailView : window.detailView,
			createFormViewer : window.createFormViewer,
			editFormViewer : window.editFormViewer,
			detailFormViewer : window.detailFormViewer,
			lookupTypes : window.lookupTypes,
			localLookup : window.localLookup,
			createValidates : window.createValidates,
			editValidates : window.editValidates,
			createLinkages : window.createLinkages,
			editLinkages : window.editLinkages,
			edgeVies : window.edgeVies,
			customerView : window.customerView,
			listeners : window.listeners,
			tbar : window.tbar,
			createFormCfgs : window.createFormCfgs,
			editFormCfgs : window.editFormCfgs,
			detailFormCfgs : window.detailFormCfgs
		};
		this.buildApp(callbackIm);
	},
	buildApp : function(callbackIm){
		window._app = new Wlj.frame.functions.app.App(this.APPCFG);
		if(Ext.isFunction(callbackIm))
			setTimeout(function(){
				callbackIm();
			},50);
		var _this = this;
		if(this.buildFlow && !window._IM){
			Ext.ScriptLoader.loadScript({
				scripts: [
				          basepath + '/contents/frameControllers/widgets/app/flows/Wlj-frame-function-flow.js',
				          basepath + '/contents/frameControllers/widgets/app/flows/Wlj-frame-function-flow-demodata.js'
				          ],
				finalCallback: function(response){
					window._IM = new Wlj.frame.functions.flow.widgets.InstanceManager();
					window._IM.activeStepContainer(_this.resId);
					window._IM.currentStepResId = _this.resId;
				}
			});
		}
	},
	clearGlobalHandler : function(){
		/**
		 * TODO To clear the handlers what are defined by developers and used by the APP object.
		 * 		Now the clearing function is defined and called by the APP object. But I don't think it's a good idea.
		 */
	},
	/**
	 * Reload current application
	 */
	reload : function(){},
	/**
	 * Change the resId property, and load the new page application.
	 * In fact, it's the logic what dose the page turning to.
	 */
	setResId : function(resId,callbackIm){
		window._app.destroy();
		window._app = null;
		JsContext._resId = resId;
		this.codeLoad(callbackIm);
	}
});