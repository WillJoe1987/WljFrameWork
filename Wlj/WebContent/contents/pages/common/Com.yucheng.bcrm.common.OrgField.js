Ext.ns('Com.yucheng.bcrm.common');
/**
 * 放大镜查询树结构
 * @author:wangwan
 * @since:2012.11.08
 */
Com.yucheng.bcrm.common.OrgField = Ext.extend(Ext.form.TwinTriggerField, {
	
	initComponent : function(){
		Com.yucheng.bcrm.common.OrgField.superclass.initComponent.call(this);
	},
	onRender : function(ct, position){
		Com.yucheng.bcrm.common.OrgField.superclass.onRender.call(this, ct, position);
		if(this.hiddenName){
			var ownerForm = this;
			while(ownerForm.ownerCt && !Ext.instanceOf(ownerForm.ownerCt,'form')/*&&!Ext.instanceOf(ownerForm.ownerCt,'toolbar')*/){				//根据条件查询放大镜控件的最外层容器
				ownerForm = ownerForm.ownerCt;
			};
			if(Ext.instanceOf(ownerForm.ownerCt,'form')){										//判断父容器是否为form类型
				ownerForm = ownerForm.ownerCt;
				this.ownerForm = ownerForm;
				if(ownerForm.getForm().findField(this.hiddenName)){								//如果已经创建隐藏域
					this.hiddenField = ownerForm.getForm().findField(this.hiddenName);
				}else {																			//如果未创建隐藏域，则根据hiddenName属性创建隐藏域
					this.hiddenField = ownerForm.add({
						id:this.hiddenName,
						xtype : 'hidden',
						name: this.hiddenName
					});
				}
			}/*else if(Ext.instanceOf(ownerForm.ownerCt,'toolbar')){								//判断父容器是否为toolbar类型
				ownerForm = ownerForm.ownerCt;
				this.ownerForm = ownerForm;
				this.hiddenField = ownerForm.add({
					id:this.hiddenName,
					xtype : 'hidden',
					name: this.hiddenName
				});
			}*/
		}
	},
	callback : false,							//点击确定按钮后回调函数。Type： function
	userId : '',
	validationEvent : false,
	validateOnBlur : false,
	trigger1Class : 'x-form-clear-trigger',
	trigger2Class : 'x-form-search-trigger',
	hideTrigger1 : true,
	width : 180,
	paramName : 'query',
	orgWindow : false,
	editable:false,
	orgTreeForShow : false,
	searchType:'SUBTREE',
	checkBox:'',
	hiddenName:false, 
	listeners:{//增加鼠标点击放大镜输入框触发onTrigger2Click事件
		focus:function(){
			if(!this.disabled){ //禁用的放大镜不允许弹出选择
				this.onTrigger2Click();
			}
		}
	},
	onTrigger2Click : function() {
		if(this.disabled){ //禁用的放大镜不允许弹出选择
			return;
		}
		var _this = this;
		var s = new String("机构");
		if (_this.orgWindow) {
			_this.orgWindow.show();
			return;
		}
	
		_this.loader = new Com.yucheng.bcrm.ArrayTreeLoader({
			checkField : 'ASTRUE',
			parentAttr : 'SUPERUNITID',
			locateAttr : 'root',//UNITID
			rootValue : (this.searchType=='ALLORG')?JsContext.ROOT_UP_ORG_ID:JsContext._orgId,
			textField : 'UNITNAME',
			idProperties : 'ID'
		});
		var condition = {searchType:_this.searchType};
		Ext.Ajax.request({
			url : basepath + '/commsearch.json?condition='+ Ext.encode(condition),
			method : 'GET',
			success : function(response) {
				var nodeArra = Ext.util.JSON.decode(response.responseText).json.data;
				_this.loader.nodeArray = nodeArra;
				var children = _this.loader.loadAll();
				_this.orgTreeForShow.appendChild(children);
			},
			failure : function(a, b, c) {
			}
		});
	
		var s2 = new String('所有机构');
		_this.orgTreeForShow = new Com.yucheng.bcrm.TreePanel({
			checkBox : this.checkBox,
			width : 300,
			heigth : 385,
			autoScroll : true,
			/** 虚拟树形根节点 */
			root : new Ext.tree.AsyncTreeNode({
				id :(this.searchType=='ALLORG')?JsContext.ROOT_UP_ORG_ID:JsContext._orgId,
				expanded : true,
				//查辖内的时候为全部机构，查本机构的时候只查总行，此处写全部机构不合适 by GuoChi 2013-12-25
				text:(this.searchType=='ALLORG')?'全部机构':JsContext._unitname,
				autoScroll : true,
				children : []
			}),
			resloader : _this.loader,
			split : true,
			listeners:{
				'checkchange' : function(node, checked) {
					if (checked) {
						var childNodes = node.childNodes;
						for ( var i = 0; i < childNodes.length; i++) {
							childNodes[i].getUI().toggleCheck(true);
						}
					} else {
						var childNodes = node.childNodes;
						for ( var i = 0; i < childNodes.length; i++) {
							childNodes[i].getUI().toggleCheck(false);
						}
					}
				},
				'click':function(node){ 																//事件在节点被单击时触发,判断该节点是否被选中
					if(node.getUI().isChecked()){
						node.getUI().toggleCheck(false);
					}else{
						node.getUI().toggleCheck(true);
					} 
				}
			
			},
	
			_hiddens : [],
			filterTree : function(t, e) {
				var text = t.getValue();
				Ext.each(this._hiddens, function(n) {
					n.ui.show();
				});
				this.expandAll();
		
				var re = new RegExp('^' + Ext.escapeRe(text), 'i');
				this._hiddens = [];
				var me = this;
				var _test = function(_n) {
					var result = false;
					if (!re.test(_n.text)) {
						if (!_n.childNodes) {														//若无叶子节点，则该节点被隐藏
							_n.ui.hide();
							me._hiddens.push(_n);
						} else {
							Ext.each(_n.childNodes, function(_cn) {									//若该节点存在叶子节点，则遍历该节点
								if (!result) {
									result = _test(_cn);
								} else
									_test(_cn);
							});
							if (!result) {
								_n.ui.hide();
								me._hiddens.push(_n);
							}
						}
					} else {
						result = true;
						Ext.each(_n.childNodes, function(_cn) {
							result = _test(_cn);
						});
					}
					return result;
				};
				_test(this.root);
			}
		});
		
		_this.searchPanel = new Ext.form.FormPanel({//查询panel
			height:35,
			labelWidth:50,//label的宽度
			labelAlign:'right',
			frame:true,
			region:'north',
			split:true,
			items:[{
				layout:'column',
				items:[{
					columnWidth:.8,
					layout:'form',
					items:[{
						xtype:'textfield',
						name:'orgfield',
						fieldLabel:'机构',
						region:'left',
						anchor:'60%',
						enableKeyEvents : true,
						listeners : {
							keypress : function(a, b, c) {
								if (b.getKey() == 13) {
									_this.orgTreeForShow.filterTree(_this.searchPanel.getForm().findField('orgfield'));
								}
							}
						}
					}]
				}]
			}]
		});
		_this.orgWindow = new Ext.Window({
			title : '机构列表',
			resizable : true,
			width : 300,
			height : 420,
			draggable : true,
			layout : 'fit',
			closeAction : 'hide',
			modal : true, // 模态窗口
			border : false,
			closable : true,
			layout : 'border',
			items : [{
				region : 'center',
				layout : 'fit',
				items : [ _this.orgTreeForShow ]
			},{
				region : 'north',
				height : 40,
				layout : 'fit',
				items : [ _this.searchPanel ]
			}],
			buttonAlign : 'center',
			buttons : [{
				text : '确定',
				handler : function() {
					var json =[];
					var sName = '';
					if(_this.hiddenName){
						if(!_this.checkBox){//单选状态
							if(!(_this.orgTreeForShow.getSelectionModel().selNode==null)){
								if(!_this.orgTreeForShow.getSelectionModel().selNode.isRoot){
									json.push(_this.orgTreeForShow.getSelectionModel().selNode.attributes.id);
									sName = sName + _this.orgTreeForShow.getSelectionModel().selNode.attributes.text;
									_this.hiddenField.setValue(json[0]);
								}else{
									var checkedNodes = _this.orgTreeForShow.getSelectionModel().selNode;
									json.push(checkedNodes.attributes.id);
									if (i == 0) {
										sName = sName + checkedNodes.attributes.text;
									} else {
										sName = checkedNodes.attributes.text;
									}
									_this.hiddenField.setValue(json);
								}
							}
						}else{//多选状态
							if(!(_this.orgTreeForShow.getSelectionModel().selNode==null)&&(_this.orgTreeForShow.getChecked().length==0)){
								if(_this.orgTreeForShow.getSelectionModel().selNode.isRoot){
									var checkedNodes = _this.orgTreeForShow.getSelectionModel().selNode;
									json.push(checkedNodes.attributes.id);
									sName =  checkedNodes.attributes.text;
									if(_this.hiddenField){
										_this.hiddenField.setValue(json);
									}
								}
							}else if ((_this.orgTreeForShow.getSelectionModel().selNode==null)&&(!(_this.orgTreeForShow.getChecked().length==0))){
								var checkedNodes = _this.orgTreeForShow.getChecked();
								for (var i = 0; i < checkedNodes.length; i++) {
									json.push(checkedNodes[i].attributes.id);
									if (i == 0) {
										sName = sName + checkedNodes[i].attributes.text;
									} else {
										sName = sName + ',' + checkedNodes[i].attributes.text;
									}
								}
								if(_this.hiddenField){
									_this.hiddenField.setValue(json);
								}
							}else if ((!(_this.orgTreeForShow.getSelectionModel().selNode==null))&&(!(_this.orgTreeForShow.getChecked().length==0))){
								if(_this.orgTreeForShow.getSelectionModel().selNode.isRoot){
									var checkedNodes = _this.orgTreeForShow.getSelectionModel().selNode;
									json.push(checkedNodes.attributes.id);
									sName =  checkedNodes.attributes.text+',';
								}
								var checkedNodes2 = _this.orgTreeForShow.getChecked();
								for (var i = 0; i < checkedNodes2.length; i++) {
									json.push(checkedNodes2[i].attributes.id);
									if (i == 0) {
										sName = sName + checkedNodes2[i].attributes.text;
									} else {
										sName = sName + ',' + checkedNodes2[i].attributes.text;
									}
								}
								if(_this.hiddenField){
									_this.hiddenField.setValue(json);
								}
							} else {//多选时若不选择任何机构直接确认  将隐藏域中的机构号置空
								if(_this.hiddenField){
									_this.hiddenField.setValue("");
								}
							}
						}
					}
					_this.Id = json;
					_this.setRawValue(sName);
					_this.orgWindow.hide();
					if (typeof _this.callback == 'function') {
						_this.callback(checkedNodes);
					}
				}
			}, {
				text : '取消',
				handler : function() {
					_this.orgWindow.hide();
				}
			}]
		});
		_this.orgWindow.show(this.id);
		return;
	}
});
Ext.reg('orgchoose',Com.yucheng.bcrm.common.OrgField);