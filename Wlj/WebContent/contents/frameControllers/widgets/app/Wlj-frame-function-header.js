/**
 * 	url : 
 * 		类型：string;
 * 		说明：数据查询URL地址;
 * 		必选：是;
 */
var url = false;
/**
 *  comitUrl : 
 * 		类型：string;
 * 		说明：新增、修改提交地址,若未配置该项,则使用查询URL做为提交地址;
 * 		必选：否;
 */
var comitUrl = false;


/**
 * fields :
 * 		类型：array[object];
 * 		说明：页面主工作区域所涉及到的字段申明;该申明,将被运用于查询面板、结果列表、增删查改的展示、逻辑运算等;
 * 			字段对象：申明一个字段的业务逻辑、展示等的各类配置信息;主要可配属性如下：
 * 				name :
 * 					类型：string;
 * 					说明：字段所对应的业务逻辑名称,该属性应与查询结果中的字段列相同;该属性将做为数据接收、前台控制、后台提交等的关键属性;
 * 					必选：是;
 * 				hidden :
 * 					类型：boolean;
 * 					说明：字段展示情况,该属性用于字段在列表、查询表单、新增、修改表单的强制隐藏;
 * 					必选：否;
 * 				text : 
 * 					类型：string;
 * 					说明：字段的中文名称,将被用于表单中的字段标签、以及列表中的表头;当字段没有这个属性时,该字段将被隐藏;
 * 					必选: 否;
 * 				searchField ：
 * 					类型：boolean;
 * 					说明：该字段是否做为查询字段,在查询条件域中展示;
 * 					必选：否;
 * 				viewFn ：
 * 					类型：function;
 * 					说明：字段在列表中,展示时的特殊展示类型;该function将在数据行渲染时,接收到字段的值,返回值将做为该字段的展示效果;
 * 					必选：否;
 * 				dataType :
 * 					类型：string;
 * 					说明：数据类型;
 * 					必选：否;
 * 				translateType :
 * 					类型：string;
 * 					说明：字段涉及到的映射字典项;该字典项将做为查询结果中的字段映射依据,以及表单面板中的下拉框的选择值;
 * 					必选：否;
 * 				resutlWidth : 
 * 					类型：int;
 * 					说明：字段在查询结果列中展示的宽度,默认150;
 * 					必选：否;
 * 				xtype : 
 * 					类型：string;
 * 					说明：字段在面板中渲染时的类型，特别的，当xtype='wcombotree'时，需要一下三个属性,innerTree,showField,hideField
 * 					必选：否
 * 				innerTree ： 
 * 					类型：string;
 * 					说明：下拉树类型指定的受控于TreeManager的tree面板KEY值。会在渲染时，自动调用TreeManager创建一个tree面板；
 * 					必选：否
 * 				showField ： 
 * 					类型：string；
 * 					说明：下拉树的展示字段；
 * 					必选：否；
 * 				hideField ： 
 * 					类型：string；
 * 					说明：下拉树的key字段；
 * 					必选：否；
 * 				gridField : 
 * 					类型: boolean;
 * 					说明:是否在列表中展示;默认为true;
 * 					必选:否;
 * 				cmTypes : 
 * 					类型:array[string/object]
 * 					说明：字段中的右键菜单扩展。string类型时取默认配置，可选：customerView、userView、dateView，object为自定义右键菜单项，需定义text,fn属性；
 * 					必选：否;
 * 				cAllowBlank : 
 * 					类型：boolean
 * 					说明：当字段配置做为查询条件时字段时，是否可为空；默认为true
 * 					必选：否；
 * 				multiSelect : 
 * 					类型：boolean
 * 					说明：下拉框是否为多选;仅当translateType配置时生效;默认为false
 * 					必选：否；
 * 				multiSeparator ： 
 * 					类型：string；
 * 					说明：多选下拉框的分隔符;仅当multiSelect为true时生效;默认值为app-cfg中的multiSelectSeparator配置
 * 					必选：否；
 * 				editable : 
 * 					类型：boolean
 * 					说明：下拉框是否可以手动编辑;仅当translateType配置时生效;默认为false
 * 					必选：否；
 * 				enableCondition :
 * 					类型：boolean
 * 					说明：列表字段是否可以拖动成为动态查询条件；默认为true；
 * 					必选：否；
 * 				noTitle :
 * 					类型：boolean
 * 					说明：列表中cell块上鼠标指针浮动时，是否展示数据内容。默认为false，即展示数据内容。如数据经viewFn显示处理后，增加了html标签，则推荐将此属性置为true；
 * 					必选：否；
 * 				lockingView :
 * 					类型：boolean
 * 					说明：是否在左侧固定列显示；
 * 					必选：否；
 * 		必选：是;
 */
var fields = false;

/**
 * autoLoadGrid:
 * 		类型：boolean
 * 		说明：页面初始化之后，是否自动查询数据；默认为true；
 * 		必选：否；
 */
var autoLoadGrid = true;

/**
 * needCondition:
 * 		类型：boolean
 * 		说明：是否需要构建查询条件面板；
 * 		必选：否
 */
var needCondition = true;
/**
 * 	needGrid : 
 * 		类型：boolean
 * 		说明：是否需要默认的查询结果面板；默认为true；如为false，needCondition也会被强制置为false；同时代码检查时，越过url和commitUrl检查项；
 * 		必选：否；
 */
var needGrid = true;
/**
 *	needTbar :
 *		类型：boolean
 *		说明：是否需要一个结果框的tbar对象；默认为true；
 *		必选：否；
 */
var needTbar = true;
/**
 *  createView|editView|detailView
 *  createView : 
 * 		类型：boolean;
 * 		说明：是否需要新增面板;默认为：true;
 * 		必选：否;
 *  editView : 
 * 		类型：boolean;
 * 		说明：是否需要修改面板;默认为：true;
 * 		必选：否;
 * 	detailView : 
 * 		类型：boolean;
 * 		说明：是否需要详情面板;默认为：true;
 * 		必选：否;
 */
var createView = false;
var editView = false;
var detailView = false;

/**
 * searchDomainCfg ：
 * 		类型：object;
 * 		说明：
 * 			查询条件域配置，可配置Ext面板对象属性；
 * 			condtionFields ： 
 * 				类型：array；
 * 				说明：按顺序指向fields中配置为searchField为true的字段name属性，或自定义字段；
 * 				必选：否；
 * 			fieldFn ： 
 * 				类型：function；
 * 				说明：如有condtionFields，则所接参数为数组中定义字段，如无condtionFields配置，则所接参数为fields中searchField为true的字段对象；返回值则为查询条件面板的字段排版；
 * 				必选：否；
 * 		必选：否；
 */
var searchDomainCfg = false;

/**
 * resultDomainCfg : 
 * 		类型：object；
 * 		说明：
 * 			columnGroups ：
 * 				类型：[[]](二维数组）；
 * 				说明：表头分组配置。类型为二维数组，依照顺序进行多次列分组。
 * 					 最外层数序长度决定了有多少个层次的分组，每一个元素为一个分组层级。
 * 					 每个分组层级也是一个数组，每个数组元素指定了本层次的分组方式。层级内每个元素为一个object。
 * 					 含 includeCount：分组所含列数，按照先后顺序罗列；groupTitle：分组名称；
 * 					 每个层级以前一个层级列为基础组织；第一个层级以列表字段为基础组织，（含隐藏字段）；
 * 					 如：下例代码中，表示查询列表增加三层分组，第一层分3组，第二层分2组，第一层分1组。
 * 							var resultDomainCfg = {
								columnGroups : [
		                			[
		                 				{includeCount : 2, groupTitle : '我的1'} ,
		                 				{includeCount : 1, groupTitle : '我的2'} ,
		                 				{includeCount : 3, groupTitle : '剩下的'}
		                 			],
		                 			[
		                  				{includeCount : 2 , groupTitle : '2层1' } ,
		                  				{includeCount : 1, groupTitle : '2层剩余'}
		                  			] ,
		                  			[
		                   				{includeCount : 2 , groupTitle : '全部'}
		                   			]
		                		]
							};
 *		必选：否；
 */
var resultDomainCfg = false;

/**
 * formViewers[createFormViewer|editFormViewer|detailFormViewer] :
 * 		类型：array[object{fields[string],fn,columnCount}];
 * 		说明：新增、修改、详情业务数据表单分组;form表单，基础配置，createFormViewer|editFormViewer|detailFormViewer可单独对新增、修改、详情面板进行配置；
 * 			字段业务分组：
 * 				fields：数组对象,某个分组中所需要的字段对象;必选;
 * 				fn：分组字段初始化逻辑。该function可依次接收到[fields]数组中申明的字段;
 * 					返回经过业务逻辑处理后的字段数组,该数组中,字段的顺序将成为分组面板中字段的展示顺序;
 * 					非必选;
 * 				columnCount：字段面板中,字段列数。可选,默认值为,面板宽度大于1024时为4,小于1024时,为3
 * 				labelWidth : 字段面板中,标签宽度,数值类型,可选
 * 		必选：是;
 */
var formViewers = false;
var createFormViewer = false;
var editFormViewer = false;
var detailFormViewer = false;

/**
 * formCfgs[createFormCfgs|editFormCfgs|detailFormCfgs] :
 * 		类型：object；
 * 		说明：针对于新增、修改、查询面板的一些特殊配置。目前，仅有formButtons属性；
 * 			formButtons：
 * 				类型：array[{text,fn}]；
 * 				说明：表单自定义按钮，每一个元素将被创建为一个按钮；
 * 					  text属性为按钮名称；
 * 					  fn为点击触发逻辑，作用域为该按钮所在view对象，接收参数为view内的formPanel对象和basicForm对象；
 * 			suspendFitAll : 
 *				类型：boolean；
 *				说明：悬浮模式下，该悬浮面板是否充满整个主列表区域；默认false；
 *			suspendWidth : 
 *				类型：integer|float；
 *				说明：悬浮模式下，该悬浮面板宽度定义，当suspendFitAll为true时，失效。
 *					  当配置项大于1时，该参数做为面板宽度属性；当配置项小于1时，将做为比例，以列表宽度为基准进行计算。
 * 		必选：否；
 */
var formCfgs = false;
var createFormCfgs = false;
var editFormCfgs = false;
var detailFormCfgs = false;

/**
 * validates[createValidates|editValidates] ：
 * 		类型：array[object{dataFields[string],fn}];
 * 		说明：新增、修改提交时,字段校验逻辑,逐条配置,编写;校验对象基础配置，createValidates|editValidates可单独对新增、修改校验进行配置；
 * 			校验规则对象(validate object) ： 包含两个属性;
 * 				dataFields：数组对象,申明该校验规则中,涉及到的字段;
 * 				fn: 校验逻辑function,可依次接收到[dataFields]中申明的字段的值;
 * 				    当且仅当返回为：false时,校验失败;
 * 		必选：否;
 */
var validates = false;
var createValidates = false;
var editValidates = false;


/**
 * linkages[createLinkages|editLinkages] :
 * 		类型: object{fieldName:{fields[string],fn}};
 * 		说明：新增、修改面板数据域联动逻辑,逐条编写,联动逻辑将在字段数据发生变化,失去焦点时触发;联动对象基础配置，createLinkages|editLinkages可单独对新增、修改进行配置；
 * 			联动对象{linkages object} : 
 * 				fieldName: 联动逻辑触发字段;
 * 			  		fields: 数组对象,申明该联动对象影响到的字段对象;
 * 					fn：逻辑function,可依次接收到[fieldName]声明的字段对象以及[fields]中申明的所有的字段对象;
 * 		必选：否;
 */
var linkages =	false;
var createLinkages = false;
var editLinkages = false;


/**
 * lookupTypes|localLookup
 *  lookupTypes :
 * 		类型：array[string];
 * 		说明：远程数据字典类型;APP对象会在页面渲染之前自动请求所有数据字典项,并纳入数据字典管理器;
 * 		必选：否;
 * 	localLookup :
 * 		类型: object{sring:array};
 * 		说明：本地静态数据字典项;APP对象会在页面渲染之前将这些数据字典项同远程字典项一并纳入数据字典管理器;
 * 		必选：否;
 */
var lookupTypes = false;
var localLookup = false;


/**
 * edgeVies :
 * 		类型：object;
 * 		说明：四个属性,分别配置上下左右四个边缘配置信息;
 * 			top:
 * 				类型: object;
 * 				说明：工作区上部边缘配置;配置信息同：Ext.form.FormPanel;默认配置参看：Wlj.frame.functions.app.App.prototype.edgeViewBaseCfg.top;
 * 				必选：否;
 * 			left:
 * 				类型: object;
 * 				说明：工作区上部边缘配置;配置信息同：Ext.Panel,默认布局采用accordion;默认配置参看：Wlj.frame.functions.app.App.prototype.edgeViewBaseCfg.left;
 * 				必选：否;
 * 			right:
 * 				类型: object;
 * 				说明：工作区上部边缘配置;配置信息同：Ext.Panel,默认布局采用accordion;默认配置参看：Wlj.frame.functions.app.App.prototype.edgeViewBaseCfg.right;
 * 				必选：否;
 * 			buttom:
 * 				类型: object;
 * 				说明：工作区上部边缘配置;配置信息同：Ext.TabPanel;默认配置参看：Wlj.frame.functions.app.App.prototype.edgeViewBaseCfg.buttom;
 * 				必选：否;
 * 
 * 		必选：否;
 */
var edgeVies = false;


/**
 * customerView :
 * 		类型: array[object];
 * 		说明：查询结果域扩展功能面板;触发按钮将被渲染在‘新增’,‘修改’,‘详情’按钮之后;配置同Ext各类组件对象;
 * 			  与系统新增、修改、详情面板相同，可配置suspendFitAll、及suspendWidth属性。属性说明见
 * 			  formCfgs[createFormCfgs|editFormCfgs|detailFormCfgs]
 * 		必选：否;
 */
var customerView = false;


/**
 * treeLoaders|treeCfgs
 *  treeLoaders : 
 *  	类型：array[object]
 *  	说明：页面中可能会使用的树形结构的loader对象配置，配置参考：Com.yucheng.bcrm.ArrayTreeLoader;loader对象会在APP初始化的时候进行创建，且加载好数据结构。
 * 		必选：否；
 *  treeCfgs ：
 *  	类型：array[object]
 *  	说明：页面中可能用到的树形面板对象预配置，配置参考：Com.yucheng.bcrm.TreePanel；tree对象构建调用TreeManager对象的createTree方法；
 *  		  其中，root数据不做配置，由rootCfg代替，为简单json对象；
 *  	必选：否；
 */
var treeLoaders = false;
var treeCfgs = false;


/**
 * tbar : 
 * 		类型：array[object];
 * 		说明：用户扩展工具栏按钮,按钮配置同Ext.Button;
 * 		必选：否;
 */
var tbar = false;



var listeners = {
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
	 * return ：true阻止条件添加事件；默认为true；
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
	load : true,
	/**
	 * 设置当前查询条件前触发；
	 * params : params:追加查询条件项；
	 * 			forceLoad：是否强制刷新当前数据；
	 * 			add：是否清理之前查询条件；
	 * 			transType：查询条件key值转换类型
	 * return ：true：阻止查询条件设置动作；默认为true；
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
	 * return：fasle，阻止面板滑出操作；默认为ture；
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
	 * return : true，阻止校验以及提交；
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
	 * return ： true，阻止提交动作；默认为true
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
	beforeeditload : true,
	/**
	 * 修改表单滑入，加载当前选择数据之后触发；
	 * params ：view：修改表单；
	 * 			record ：当前选择的数据；
	 */
	aftereditload : true,
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
	 * 		 	records : 更新的数据数组；
	 * 			config ：reload配置;
	 * 			succeed ：数据reload结果标志位；
	 */
	lookupreload : true,
	
	
	/**属性面板事件**/
	beforetreecreate : true,
	treecreate : true,
	
	/**
	 * 列锁定之前触发；
	 * params ： fieldCfg ：字段配置属性；
	 * return ：false :阻止列锁定，默认为true；
	 */
	beforefieldlock : true,
	/**
	 * 列解除锁定之前触发；
	 * params ： fieldCfg ：字段配置属性；
	 * return ：false :阻止列解除锁定，默认为true；
	 */
	beforefieldunlock : true,
	/**
	 * 列锁定之后触发；
	 * params ： fieldCfg ：字段配置属性；
	 */
	fieldlock : true,
	/**
	 * 列解除锁定之后触发；
	 * params ： fieldCfg ：字段配置属性；
	 */
	fieldunlock : true
	
};
