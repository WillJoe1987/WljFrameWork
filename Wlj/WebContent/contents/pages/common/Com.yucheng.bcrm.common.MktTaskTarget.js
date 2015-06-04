Ext.ns('Com.yucheng.bcrm.common');
/**
 * 营销任务指标明细放大镜
 * @author geyu
 * @since 2014-7-17
 */
Com.yucheng.bcrm.common.MktTaskTarget = Ext.extend(Ext.form.TwinTriggerField, {
    initComponent : function(){
        Ext.ux.form.SearchField.superclass.initComponent.call(this);
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTrigger2Click();
            }
        }, this);
    },
    onRender : function(ct, position){
    	Com.yucheng.bcrm.common.MktTaskTarget.superclass.onRender.call(this, ct, position);
		if(this.hiddenName){
			var ownerForm = this;
			while(ownerForm.ownerCt && !Ext.instanceOf(ownerForm.ownerCt,'form')){				//根据条件查询放大镜控件的最外层容器
				ownerForm = ownerForm.ownerCt;
			};
			if(Ext.instanceOf(ownerForm.ownerCt,'form')){										//判断父容器是否为form类型
				ownerForm = ownerForm.ownerCt;
				if(ownerForm.getForm().findField(this.hiddenName)){								//如果已经创建隐藏域
					this.hiddenField = ownerForm.getForm().findField(this.hiddenName);
				}else {		//如果未创建隐藏域，则根据hiddenName属性创建隐藏域
					
					this.hiddenField = ownerForm.add({
						xtype : 'hidden',
						name: this.hiddenName
					});
				}
			}
		}
	},
	autoLoadFlag: false,
    singleSelected:true,//记录标志 true单选,false多选
    callback:false,
    TASK_ID:'',//任务编号
    MKT_TARGET_ID:'',//指标编号
    MKT_TARGET_NAME:'',//指标名称
    TARGET_VALUE:'',//目标值
    ACHIEVE_VALUE:'',//达成值
    ACHIEVE_PERCENT:'',//达成率
    CYCLE_TYPE:'',//周期类型
    CYCLE_NAME:'',//周期类型名称
    
    validationEvent:false,
    validateOnBlur:false,
    trigger1Class:'x-form-clear-trigger',
    trigger2Class:'x-form-search-trigger',
    hideTrigger1:true,
    width:180,
    hasSearch : false,
    paramName : 'query',
    hiddenName:false, //用于存隐藏ID字段
    oTaskTargetQueryWindow : false,
    editable:false,
    listeners:{//增加鼠标点击放大镜输入框触发onTrigger2Click事件
		focus:function(){
			if(!this.disabled){ //禁用的放大镜不允许弹出选择
				this.onTrigger2Click();
			}
		}
	},
    onTrigger2Click : function(){
    	//禁用的放大镜不允许弹出选择
		if(this.disabled){
			return ;
		}
    	var _this=this;
    	if(_this.oTaskTargetQueryWindow){
    		_this.oTaskTargetQueryWindow.show();
    		return;
    	}
    	var oThisSearchField=_this;
    	_this.oTaskTargetQueryForm = new Ext.form.FormPanel({
			frame : true, //是否渲染表单面板背景色
			labelAlign : 'middle', // 标签对齐方式
			buttonAlign : 'center',
			region:'north',
			height : 97,
			width : 1000,
			items : [{
				layout : 'column',
				border : false,
				items : [{
					columnWidth : .25,
					layout : 'form',
					labelWidth: 100, // 标签宽度
					defaultType : 'textfield',
					border : false,
					items : [new Com.yucheng.bcrm.common.MarketTask({ 
						xtype:'taskchoose',
						fieldLabel : '营销任务', 
						labelStyle: 'text-align:right;',
						name : 'TASK_NAME',
						hiddenName:'TASK_ID',
						searchRoleType:('127,47'),  //指定查询角色属性 ,默认全部角色
						searchType:'SUBTREE',/* 允许空，默认辖内机构用户，指定查询机构范围属性  SUBTREE（子机构树）SUBORGS（直接子机构）PARENT（父机构）PARPATH （所有父、祖机构）ALLORG（所有机构）*/
						singleSelect:true,
						anchor : '95%'
					})]
				}]
			}],
			listeners :{
    			'render':function(){
    			}
			},
			buttons : [{
				text : '查询',
				handler : function() {
					_this.oTaskTargetQueryStore.on('beforeload', function() {
						var conditionStr =  _this.oTaskTargetQueryForm.getForm().getValues(false);
						this.baseParams = {
								"condition":Ext.encode(conditionStr)
						};
					});
					_this.oTaskTargetQueryStore.reload({
						params : {
							start : 0,
							limit : _this.oTaskTargetQueryBbar.pageSize
						}
					});
				}
			},{
				text : '重置',
				handler : function() {
					_this.oTaskTargetQueryForm.getForm().reset();  
					_this.oTaskTargetQueryForm.getForm().findField('TASK_NAME').setValue('');
				}
			}]
		});
    	_this.sm = new Ext.grid.CheckboxSelectionModel({singleSelect:oThisSearchField.singleSelected});

    	// 定义自动当前页行号
    	_this.rownum = new Ext.grid.RowNumberer({
    		header : 'No.',
    		width : 28
    	});
    	// 定义列模型
    	_this.cm = new Ext.grid.ColumnModel([_this.rownum,_this.sm, 
    	    {header : '任务编号',dataIndex : 'TASK_ID',sortable : true,width : 150},
    	    {header : '指标编号',dataIndex : 'TARGET_NO',width : 200,sortable : true},
    	    {header : '指标名称',dataIndex : 'TARGET_NAME',width : 200,sortable : true},
    	    {header : '达成值',dataIndex : 'ACHIEVE_VALUE',width : 80,sortable : true},
    	    {header : '达成率',dataIndex : 'ACHIEVE_PERCENT',width : 80,sortable : true},
    	    {header : '周期',dataIndex : 'CYCLE_NAME',width : 200,sortable : true}
    	]);
    	/**
    	 * 数据存储
    	 */
    	_this.oTaskTargetQueryStore = new Ext.data.Store({
    		restful:true,	
    		proxy : new Ext.data.HttpProxy({url:basepath+'/marketTaskTarget.json'}),
    		reader: new Ext.data.JsonReader({
    			totalProperty : 'json.count',
    			root:'json.data'
    		}, [
    		    {name: 'TASK_ID'},
    		    {name: 'TARGET_NO'},
    		    {name: 'TARGET_NAME'},
    		    {name: 'ACHIEVE_VALUE'},
    		    {name: 'ACHIEVE_PERCENT'},
    		    {name: 'CYCLE_NAME'}
    		    ])
    	});

    	_this.oPagesizeCombo = new Ext.form.ComboBox({
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
    		value : '20',
    		editable : false,
    		width : 85
    	});
    	_this.number = parseInt(_this.oPagesizeCombo.getValue());
    	_this.oPagesizeCombo.on("select", function(comboBox) {
    		_this.oTaskTargetQueryBbar.pageSize = parseInt(_this.oPagesizeCombo.getValue()),
    		_this.oTaskTargetQueryStore.load({
    			params : {
    				start : 0,
    				limit : parseInt(_this.oPagesizeCombo.getValue())
    			}
    		});
    	});
    	_this.oTaskTargetQueryBbar = new Ext.PagingToolbar({
    		pageSize : _this.number,
    		store : _this.oTaskTargetQueryStore,
    		displayInfo : true,
    		displayMsg : '显示{0}条到{1}条,共{2}条',
    		emptyMsg : "没有符合条件的记录",
    		items : ['-', '&nbsp;&nbsp;', _this.oPagesizeCombo]
    	});
		// 表格实例
    	_this.oTaskTargetQueryGrid = new Ext.grid.GridPanel({
    		height : 275,
			width:1000,
			region:'center',
			frame : true,
			autoScroll : true,
			store : _this.oTaskTargetQueryStore, // 数据存储
			stripeRows : true, // 斑马线
			cm : _this.cm, // 列模型
			sm : _this.sm, // 复选框
			bbar:_this.oTaskTargetQueryBbar,
			viewConfig:{
    			forceFit:false,
    			autoScroll:true
    		},
    		loadMask : {
    			msg : '正在加载表格数据,请稍等...'
    		}
    	});

    	_this.oTaskTargetQueryWindow=new Ext.Window({
    		title : '营销任务指标',
    		closable : true,
    		resizable : true,
    		height:435,
    		width:1013,
    		draggable : true,
    		closeAction : 'hide',
    		modal : true, // 模态窗口 
    		border : false,
    		closable : true,
    		layout : 'border',
    		listeners : {
    			'show':function(){
					_this.oTaskTargetQueryForm.form.reset();
					_this.oTaskTargetQueryStore.removeAll();
					if(_this.autoLoadFlag)
						_this.oTaskTargetQueryStore.load({//如果自动加载，需要对数据进行分页
							params : {
								start : 0,
								limit : _this.oTaskTargetQueryBbar.pageSize
							}
						});
    			}    			
    		},
    		items : [_this.oTaskTargetQueryForm,_this.oTaskTargetQueryGrid],
    		buttonAlign:'center',
    		buttons:[{
    			text:'确定',
    			handler:function(){
    				debugger;
    				var sName='';
    				var checkedNodes;
    				if(!(_this.oTaskTargetQueryGrid.getSelectionModel().selections==null)){
    					if(oThisSearchField.hiddenField){
    						checkedNodes = _this.oTaskTargetQueryGrid.getSelectionModel().selections.items;
						if(oThisSearchField.singleSelected&&checkedNodes.length>1){
							Ext.Msg.alert('提示', '您只能选择一个指标');
							return ;
						}
						for(var i=0;i<checkedNodes.length;i++){
							if(i==0){
								sName=checkedNodes[i].data.TARGET_NAME;
								oThisSearchField.hiddenField.setValue(checkedNodes[i].data.TARGET_NO);
							}else{
//								sName=sName+','+checkedNodes[i].data.CUST_ZH_NAME;
//								oThisSearchField.hiddenField.setValue(_this.hiddenField.value+','+checkedNodes[i].data.CUST_ID);
							}
						}
						oThisSearchField.setRawValue(sName);
						if(checkedNodes.length==1){//如果单选，则设置该客户相应的附属属性
//							oThisSearchField.customerId=checkedNodes[0].data.CUST_ID;
//							oThisSearchField.custtype=checkedNodes[0].data.CUST_TYP;
													
						}
					}
    					/**
    					 * 如果未选择任何指标，清空隐藏域中的指标号 
    					 * by GuoChi
    					 * 2013-12-25
    					 */
    					if(_this.oTaskTargetQueryGrid.getSelectionModel().selections.length==0){
    						oThisSearchField.hiddenField.setValue("");
    					}	
    					
				}
				if (typeof oThisSearchField.callback == 'function') {
					oThisSearchField.callback(oThisSearchField,checkedNodes);
				}
				_this.oTaskTargetQueryWindow.hide();
			}
    	},{
    		text: '取消',
    		handler:function(){
				_this.oTaskTargetQueryWindow.hide();
    		}
    	}]	
    });
	_this.oTaskTargetQueryWindow.show();
    return;
    }
});
Ext.reg('mktTaskTarget',Com.yucheng.bcrm.common.MktTaskTarget);