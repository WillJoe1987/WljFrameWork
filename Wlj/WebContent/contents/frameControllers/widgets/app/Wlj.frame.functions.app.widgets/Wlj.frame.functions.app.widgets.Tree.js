Ext.ns('Wlj.frame.functions.app.widgets');
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
