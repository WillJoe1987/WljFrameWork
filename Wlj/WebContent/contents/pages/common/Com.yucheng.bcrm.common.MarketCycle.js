/**
 * @description 营销指标周期选择器
 * @author helin
 * @since 2014-07-07
 */
Ext.ns('Com.yucheng.bcrm.common');
Com.yucheng.bcrm.common.TargetCycle = Ext.extend(Ext.form.TwinTriggerField, {
	initComponent : function(){
		Com.yucheng.bcrm.common.TargetCycle.superclass.initComponent.call(this);
	},
	onRender : function(ct, position){
		Com.yucheng.bcrm.common.TargetCycle.superclass.onRender.call(this, ct, position);
		if(this.hiddenName){
			var ownerForm = this;
			while(ownerForm.ownerCt && !Ext.instanceOf(ownerForm.ownerCt,'form')){				//根据条件查询放大镜控件的最外层容器
				ownerForm = ownerForm.ownerCt;
			};
			if(Ext.instanceOf(ownerForm.ownerCt,'form')){										//判断父容器是否为form类型
				ownerForm = ownerForm.ownerCt;
				this.ownerForm = ownerForm;
				if(ownerForm.getForm().findField(this.hiddenName)){								//如果已经创建隐藏域
					this.hiddenField = ownerForm.getForm().findField(this.hiddenName);
				}else {																			//如果未创建隐藏域，则根据hiddenName属性创建隐藏域
					this.hiddenField = ownerForm.add({
						xtype : 'hidden',
						name: this.hiddenName
					});
				}
			}
		}
	},
	callback : false,							//点击确定按钮后回调函数。Type： function
	validationEvent : false,
	validateOnBlur : false,
	trigger1Class : 'x-form-clear-trigger',
	trigger2Class : 'x-form-search-trigger',
	hideTrigger1 : true,
	width : 180,
	paramName : 'query',
	editable:false,
	checkBox:'',
	hiddenName:false,
	selectLeaf: true,	//只选择叶子结点
	listeners:{//增加鼠标点击放大镜输入框触发onTrigger2Click事件
		focus:function(){
			if(!this.disabled){ //禁用的放大镜不允许弹出选择
				this.onTrigger2Click();
			}
		}
	},
	onTrigger2Click : function() {
		//禁用的放大镜不允许弹出选择
		if(this.disabled){
			return ;
		}
		var _this = this;
		if (_this.targetCycleWin) {
			_this.targetCycleWin.show();
			return;
		}
	
		_this.loader = new Com.yucheng.bcrm.ArrayTreeLoader({
			checkField : 'ASTRUE',
			parentAttr : 'PARENT',
			locateAttr : 'CODE',
			rootValue : '0',
			textField : 'NAME',
			idProperties : 'CODE'
		});
		Ext.Ajax.request({
			url : basepath + '/myMarketTask!queryTargetCycle.json',
			method : 'GET',
			success : function(response) {
				var nodeArra = Ext.util.JSON.decode(response.responseText).json;
				_this.loader.nodeArray = nodeArra;
				var children = _this.loader.loadAll();
				_this.targetCycleTree.appendChild(children);
				_this.targetCycleTree.expandAll();
			},
			failure : function(a, b, c) {
			}
		});
	
		_this.targetCycleTree = new Com.yucheng.bcrm.TreePanel({
			checkBox : this.checkBox,
			width : 300,
			heigth : 385,
			autoScroll : true,
			rootVisible: false,
			root : new Ext.tree.AsyncTreeNode({
				id :'0',
				expanded : true,
				text: '周期类型树',
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
			
			}
		});
		
		_this.targetCycleWin = new Ext.Window({
			title : '指标周期类型',
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
				items : [ _this.targetCycleTree ]
			}],
			buttonAlign : 'center',
			buttons : [{
				text : '确定',
				handler : function() {
					var json ='';
					var sName = '';
					if(_this.hiddenName){
						if(!_this.checkBox){//单选状态
							if(!(_this.targetCycleTree.getSelectionModel().selNode==null)){
								if(!_this.targetCycleTree.getSelectionModel().selNode.isRoot){
									json = json + (_this.targetCycleTree.getSelectionModel().selNode.attributes.id);
									sName = sName + _this.targetCycleTree.getSelectionModel().selNode.attributes.text;
								}else{
									var checkedNodes = _this.targetCycleTree.getSelectionModel().selNode;
									if (i == 0) {
										json = json + checkedNodes.attributes.id;
										sName = sName + checkedNodes.attributes.text;
									} else {
										json = checkedNodes.attributes.id;
										sName = checkedNodes.attributes.text;
									}
									_this.hiddenField.setValue(json);
								}
							}
						}else{//多选状态
							if(!(_this.targetCycleTree.getSelectionModel().selNode==null)&&(_this.targetCycleTree.getChecked().length==0)){
								if(_this.targetCycleTree.getSelectionModel().selNode.isRoot){
									var checkedNodes = _this.targetCycleTree.getSelectionModel().selNode;
									if(!_this.selectLeaf || (_this.selectLeaf && checkedNodes.attributes.PARENT !== '0')){
										json = checkedNodes.attributes.id;
										sName =  checkedNodes.attributes.text;
									}
								}
							}else if ((_this.targetCycleTree.getSelectionModel().selNode==null)&&(!(_this.targetCycleTree.getChecked().length==0))){
								var checkedNodes = _this.targetCycleTree.getChecked();
								for (var i = 0; i < checkedNodes.length; i++) {
									//仅选择叶子节点,
									if(_this.selectLeaf && checkedNodes[i].attributes.PARENT == '0'){
										continue;
									}
									if (i == 0 || (_this.selectLeaf && json == '')) {
										json = json + checkedNodes[i].attributes.id;
										sName = sName + checkedNodes[i].attributes.text;
									} else {
										json = json + ',' + checkedNodes[i].attributes.id;
										sName = sName + ',' + checkedNodes[i].attributes.text;
									}
								}
							}else if ((!(_this.targetCycleTree.getSelectionModel().selNode==null))&&(!(_this.targetCycleTree.getChecked().length==0))){
								if(_this.targetCycleTree.getSelectionModel().selNode.isRoot){
									var checkedNodes = _this.targetCycleTree.getSelectionModel().selNode;
									if(!_this.selectLeaf || (_this.selectLeaf && checkedNodes.attributes.PARENT !== '0')){
										json = checkedNodes.attributes.id + ',';
										sName =  checkedNodes.attributes.text +',';
									}
								}
								var checkedNodes2 = _this.targetCycleTree.getChecked();
								for (var i = 0; i < checkedNodes2.length; i++) {
									//仅选择叶子节点,
									if(_this.selectLeaf && checkedNodes2[i].attributes.PARENT == '0'){
										continue;
									}
									if (i == 0 || (_this.selectLeaf && json == '')) {
										json = json + checkedNodes2[i].attributes.id;
										sName = sName + checkedNodes2[i].attributes.text;
									} else {
										json = json + ',' + checkedNodes2[i].attributes.id;
										sName = sName + ',' + checkedNodes2[i].attributes.text;
									}
								}
							} else {//多选时若不选择任何机构直接确认  将隐藏域中的机构号置空
								if(_this.hiddenField){
									_this.hiddenField.setValue("");
								}
							}
						}
					}
					_this.setRawValue(sName);
					if(_this.hiddenField){
						_this.hiddenField.setValue(json);
					}
					_this.targetCycleWin.hide();
					if (typeof _this.callback == 'function') {
						_this.callback(checkedNodes);
					}
				}
			}, {
				text : '取消',
				handler : function() {
					_this.targetCycleWin.hide();
				}
			}]
		});
		_this.targetCycleWin.show(this.id);
		return;
	}
});
Ext.reg('cyclechoose',Com.yucheng.bcrm.common.TargetCycle);