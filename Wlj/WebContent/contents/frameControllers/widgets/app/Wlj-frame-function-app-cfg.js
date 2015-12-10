/**
 * TODO 1、defualt_patch.js之属加载机制，或可采用配置解析，增加可控性，且同化部署逻辑；需确定配置范围
 * TODO 2、
 */


Ext.ns('Wlj.frame.functions.app');
Wlj.frame.functions.app.Util = {
		
	needConsoleInPage : false,														//是否调用页面内部日志组件显示日志                     
	needConsoleInNavigator : false,													//是否调用浏览器控制台显示日志                  
	needError : true,                                              
	needWarn : true,                                                
	needInfo : true,                                                
	needDebug : true,                                              
	
	pluginTrigger : false,															//应用插件开关
	
	columnResizable : true,															//是否开启列宽调整功能
	hoverXY : false,																//是否开启行列鼠标悬浮效果
	pagSrollingLevel : 0,														// 当出现多层分组表头时，左右滑动图标的滚动基准表头层级，默认值包括：'top'：顶层, buttom：底层,title：字段表头（暂未实现）,{groupLevel}：表头层级（数值），从下向上计数，从0开始。如超出层级，则无任何动作。
	
	defaultDateFormat : 'Y-m-d',													//默认日期类型转JSON格式	
		
	noBlankFlag : '<font color=red>*</font>',										//为不为空的字段添加标志标签的形式;false为不添加；
	flagSide : 'left',																//left：在字段标签左边添加，right：在字段右边添加
	
	suspendViews : true,															//信息操作面板悬浮策略是否启用，启用时，gridLockedHole配置项失效，默认为true；
	
	viewPanelsWidth : 700,															//结果集悬浮类面板宽度：对于form表类型的面板，默认列数为：1024以上4列、800到1024 3列；800一下2列；
	alwaysLockCurrentView : false,													//当当前有信息操作面板滑入的情况下，重新查询数据时，是否滑出当前面板；
	
	defaultPagesize : 10,															//默认的查询列表页分页大小.如功能内配置了pagesize属性,则以代码为准;
	
	needCloseLable4DCF : false,														//是否为动态查询条件添加一个关闭标签
	
	needRN : true,																	//是否在列表上需要一个行号列
	rnWidth : 40,																	//行号列宽度
	
	multiSelectSeparator : ',',														//多选下拉框默认分隔符
	
	lookupSortDirect : 'ASC',														//数据字典排序方式.ASC:升序;DESC:降序
	
	tbarButtonAlign : 'left',														//tbar中button的居左或居右的布局；可选：left、right；默认left；
	tbarViewAlign : 'left',														//tbar中，面板按钮的居左或居右布局；可选：left、right；默认left；如果tbarButtonAlign居右，则面板按钮同样居右。

	enableDataDD : true,															//是否可以拖动数据单元格
	
	easingStrategy : ['settimeout', 'scrolling'],									//延迟加载数据行策略集合<scrolling暂未实现>
	dataLineEasing : 'settimeout',													//是否启用数据行延迟加载策略.无值或非法值，则不启用延迟策略。可选参数见于easingStrategy属性；
	firstStep : 50,																	//当延迟加载策略生效时，初始化数据条数;如实际数据数未达到初始值，则延迟策略不再生效。
	settimeout : {																	//延迟策略settimeout配置信息<暂未实现>
	
	},
	
	BUTTON_TYPE : {																	//查询面板的功能按钮KEY值，与Wlj.frame.functions.app.Util.conditionButtons对象中key值一一对应。
			SEARCH : 'search',
			RESET : 'reset',
			CLEAR : 'clear'
	},
	
	loadMaskMsg : '正在加载数据..',														//加载数据时遮罩的提示信息
	conditionButtons : {															//查询面板默认按钮配置。将作为查询面按钮以及右键菜单构建基础配置。
		search : {
			text : '查询',
			cls:'simple-btn',
			overCls:'simple-btn-hover',
			fn : function(){														//作用域为查询域对象
				this.searchHandler();
			}
		},
		reset : {
			text : '重置',
			fn : function(){
				this.resetHandler();
			}
		},
		clear : {
			text : '清除',
			fn : function(){
				this.clearHandler();
			}
		}
	},
	contextMenuAble : true,															//是否启动页面右键操作菜单
	contextMenus : {																//全局右键操作配置
		cell : {																	//列表子字段级别右键菜单配置
			customerView : {
				text : '客户视图',
				iconCls : 'ico-03',
				fn : function(record, field, data){}
			},
			userView : {
				text : '客户经理视图',
				iconCls : 'ico-03',
				fn : function(record, field, data){}
			},
			dateView : {
				text : '日程',
				iconCls : 'ico-03',
				fn : function(record, field, data){}
			}
		},
		line : {
			tbarButtons : {}
		},
		title : {
			showColumn : {
				text : '显示列',
				fn : function(){}
			},
			hideColumn : {
				text : '隐藏列',
				fn : function(){}
			},
			orderBy : {
				text : '列排序',
				menus : {
					orderDesc : {
						text : '降序排列',
						fn : function(){}
					},
					orderAsc : {
						text : '升序排列',
						fn : function(){}
					}
				}
			}
		},
		grid : {
			nextpage : {
				text : '下一页',
				fn : function(){
					this.nextPageHandler();
				}
			},
			prePage : {
				text : '上一页',
				fn : function(){
					this.prePageHandler();
				}
			},
			firstPage : {
				text : '第一页',
				fn : function(){
					this.firstPageHandler();
				}
			},
			lastPage : {
				text : '最后一页',
				fn : function(){
					this.lastPageHandler();
				}
			}
//			,
//			refresh : {
//				text : '刷新数据',
//				fn : function(){
//					this.refreshPageHandler();
//				}
//			}
		},
		window : {
			refresh : {
				text : '刷新页面',
				fn : function(){
					window.location.reload();
				}
			},
			close : {
				text : '关闭窗口',
				fn : function(){
					var taskMgr = parent.Wlj?parent.Wlj.TaskMgr:undefined;
					var p = parent;
					for(var i=0;i<10 && !taskMgr;i++){
						p = p.parent;
						taskMgr = p.Wlj?p.Wlj.TaskMgr:undefined;
					}
					taskMgr.getTask('task_'+JsContext._resId).close();
				}
			},
			properties : {
				text : '属性',
				fn : function(){
					var taskMgr = parent.Wlj?parent.Wlj.TaskMgr:undefined;
					var p = parent;
					for(var i=0;i<10 && !taskMgr;i++){
						p = p.parent;
						taskMgr = p.Wlj?p.Wlj.TaskMgr:undefined;
					}
					var jsUrl = parent.CUSTVIEW?parent.CUSTVIEW.CURRENT_VIEW_URL:'';
					if(!jsUrl){
						jsUrl = taskMgr.getTask('task_'+JsContext._resId).action;
					}
					var html =	'<div class=\'prpBanner\'></div><div class=\'prpContent\'>'+
					'<h1>宇信易诚科技有限公司&nbsp;&copy;&nbsp;版权所有</h1>'+
					'产品版本：V4.6'+
					'<br/>前端版本：'+__frameVersion+':'+__frontVersion+
					'<br/>功能名称：'+taskMgr.getTask('task_'+JsContext._resId).name+
					'<br/>ResId：'+JsContext._resId+
					'<br/>引用js：'+jsUrl+
					'</div>';
						new Ext.Window({
							title : '属性',
							width : 500,
							height : 300,
							html  : html
						}).show();
				}
			}
		},
		condition : 'Wlj.frame.functions.app.Util.conditionButtons'
	}
};

Wlj.frame.functions.app.Tools = {
	addBlankFlag : function(text){													//为字符串添加一个html标签串
		if(Ext.isString(text) && text.length>0){
			if(Wlj.frame.functions.app.Util.flagSide === 'right'){
				return text + Wlj.frame.functions.app.Util.noBlankFlag;
			}else{
				return Wlj.frame.functions.app.Util.noBlankFlag + text;
			}
		}
		return '';
	}
};

WLJUTIL = Wlj.frame.functions.app.Util;
WLJTOOL = Wlj.frame.functions.app.Tools;
/**
 * 数据类型配置，目前可提供：date、string、number、money数据类型；
 * 数据类型扩展可在Wlj.frame.functions.app.DataType对象下添加新的数据类型对象；
 * 数据类型接口格式如下：
 * 		dateType：{
 * 			getFieldXtype : function(){},
 * 			formatFn : function(){},
 * 			getStoreType : function(){},
 * 			getFieldSpecialCfg : function(){},
 * 			getStoreSpecialCfg : function(){},
 * 			getFieldClass : function(){},
 * 			getTitleClass : function(){}
 * 		}
 * 以上几个方法均为必须方法，
 * getFieldXtype：定义数据域在各类表单面板中的字段展示类型，返回string类型xtype属性；
 * formatFn：数据在结果展示列表中的数据格式化方法；返回string类型格式化结果，可添加HTML标签美化；
 * getStoreType：数据在各store对象中的字段type属性，包括EXT标准数据类型：auto，string，int，float，boolean，date；
 * getFieldSpecialCfg：类型数据在表单中字段对象的特殊配置，参见Ext.form.Field对象；不覆盖字段配置；如无特殊配置，可返回空对象{};
 * getStoreSpecialCfg：类型数据在store对象中的特殊配置，参见Ext.data.Field对象；不覆盖字段配置；如无特殊配置，可返回空对象{};
 * getFieldClass:或取字段在瓷贴样式字符串，可选：ygc-cell-right，ygc-cell-left，ygc-cell-center分别代表居右、居左、居中；返回空字符串居左；
 * getTitleClass:获取字段表头瓷贴样式字符串，可选：ygh-hd-right，ygh-hd-left，ygh-hd-center分别代表居右、居左、居中；返回空字符串居左；
 */
Wlj.frame.functions.app.DataType = {
	date : {
		getFieldXtype : function(){
			return 'datefield';
		},
		formatStr : 'Y-m-d',
		formatFn : function(value){
			if(Ext.isDate(value)){
				return value.format(this.formatStr);
			}else{
				return value;
			}
		},
		getStoreType : function(){
			return 'date';
		},
		getFieldSpecialCfg : function(){
			return {
				format : this.formatStr
			};
		},
		getStoreSpecialCfg : function(){
			return {
				dateFormat : this.formatStr
			};
		},
		getFieldClass : function(){
			return '';
		},
		getTitleClass : function(){
			return '';
		}
	},
	string : {
		getFieldXtype : function(){
			return 'textfield';
		},
		formatFn : function(value){
			return value;
		},
		getStoreType : function(){
			return 'string';
		},
		getFieldSpecialCfg : function(){
			return {};
		},
		getStoreSpecialCfg : function(){
			return {};
		},
		getFieldClass : function(){
			return '';
		},
		getTitleClass : function(){
			return '';
		}
	},
	number : {
		getFieldXtype : function(){
			return 'numberfield';
		},
		formatStr : '0,000.00',
		formatFn : function(value){
			return Ext.util.Format.number(value, this.formatStr);
		},
		getStoreType : function(){
			return 'float';
		},
		getFieldSpecialCfg : function(){
			return {};
		},
		getStoreSpecialCfg : function(){
			return {};
		},
		getFieldClass : function(){
			return 'ygc-cell-right';
		},
		getTitleClass : function(){
			return 'ygh-hd-right';
		}
	},
	rate : {
		getFieldXtype : function(){
			return 'numberfield';
		},
		formatStr : '0,000.000000',
		formatFn : function(value){
			return Ext.util.Format.number(value, this.formatStr);
		},
		getStoreType : function(){
			return 'float';
		},
		getFieldSpecialCfg : function(){
			return {
				decimalPrecision : 6
			};
		},
		getStoreSpecialCfg : function(){
			return {};
		},
		getFieldClass : function(){
			return 'ygc-cell-right';
		},
		getTitleClass : function(){
			return 'ygh-hd-right';
		}
	},
	numberNoDot : {//不要小数位的number
		getFieldXtype : function(){
			return 'numberfield';
		},
		formatStr : '0,000',
		formatFn : function(value){
			return Ext.util.Format.number(value, this.formatStr);
		},
		getStoreType : function(){
			return 'int';
		},
		getFieldSpecialCfg : function(){
			return {
				decimalPrecision : 0
			};
		},
		getStoreSpecialCfg : function(){
			return {};
		},
		getFieldClass : function(){
			return 'ygc-cell-right';
		},
		getTitleClass : function(){
			return 'ygh-hd-right';
		}
	},
	money : {
		getFieldXtype : function(){
			return 'numberfield';
		},
		formatStr : 'rmbMoney',
		formatFn : function(value){
			return Ext.util.Format[this.formatStr](value);
		},
		getStoreType : function(){
			return 'float';
		},
		getFieldSpecialCfg : function(){
			return {};
		},
		getStoreSpecialCfg : function(){
			return {};
		},
		getFieldClass : function(){
			return 'ygc-cell-right';
		},
		getTitleClass : function(){
			return 'ygh-hd-right';
		}
	},
	productChoose:{//产品放大镜
		getFieldXtype : function(){
			return 'productChoose';
		},
		formatFn : function(value){
			return value;
		},
		getStoreType : function(){
			return 'string';
		},
		getFieldSpecialCfg : function(){
			return {};
		},
		getStoreSpecialCfg : function(){
			return {};
		},
		getFieldClass : function(){
			return 'ygc-cell-left';
		},
		getTitleClass : function(){
			return 'ygh-hd-left';
		}
	},
	userchoose:{//用户放大镜
		getFieldXtype : function(){
			return 'userchoose';
		},
		formatFn : function(value){
			return value;
		},
		getStoreType : function(){
			return 'string';
		},
		getFieldSpecialCfg : function(){
			return {};
		},
		getStoreSpecialCfg : function(){
			return {};
		},
		getFieldClass : function(){
			return 'ygc-cell-left';
		},
		getTitleClass : function(){
			return 'ygh-hd-left';
		}
	},
	orgchoose:{//机构放大镜
		getFieldXtype : function(){
			return 'orgchoose';
		},
		formatFn : function(value){
			return value;
		},
		getStoreType : function(){
			return 'string';
		},
		getFieldSpecialCfg : function(){
			return {};
		},
		getStoreSpecialCfg : function(){
			return {};
		},
		getFieldClass : function(){
			return 'ygc-cell-left';
		},
		getTitleClass : function(){
			return 'ygh-hd-left';
		}
	},
	customerquery:{//客户放大镜
		getFieldXtype : function(){
			return 'customerquery';
		},
		formatFn : function(value){
			return value;
		},
		getStoreType : function(){
			return 'string';
		},
		getFieldSpecialCfg : function(){
			return {};
		},
		getStoreSpecialCfg : function(){
			return {};
		},
		getFieldClass : function(){
			return 'ygc-cell-left';
		},
		getTitleClass : function(){
			return 'ygh-hd-left';
		}
	}
};
WLJDATATYPE = Wlj.frame.functions.app.DataType;