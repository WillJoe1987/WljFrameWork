
API = {
	/**
	 * 设置查询条件面板尺寸
	 * @param obj：{
	 * 			width: 100,
	 * 			hieght: 100
	 * 				},高宽属性均为可选属性
	 * @return
	 */
	setSearchSize : true,
	/**
	 * 根据字典类型,获取字典STORE
	 * @param type
	 * @return
	 */
	findLookupByType : true,
	/**
	 * 根据指定配置，刷行一个数据字典数据；
	 * @param type
	 * @param config
	 * @return
	 */
	reloadLookup : true,
	/**
	 * 根据字典类型,把key转换为值
	 * @param type
	 * @param key
	 * @return
	 */
	translateLookupByKey : true,
	/**
	 * 根据字典类型,把值转换为key
	 * @param type
	 * @param value
	 * @return
	 */
	translateLookupByValue : true,
	/**
	 * 根据字典类型,把多个以分隔符连接的key转换为值
	 * @param type
	 * @param key
	 * @param separator
	 * @return
	 */
	translateLookupByMultiKey : true,
	/**
	 * 根据字典类型,把多个以分隔符连接的值转换为key
	 * @param type
	 * @param value
	 * @param separator
	 * @return
	 */
	translateLookupByMultiValue : true,
	/**
	 * 设置查询条件并刷新数据
	 * @param params : 参数
	 * @param forceLoad : 是否强制刷新,default : true
	 * @param add : 是否清除过期条件,default : true
	 * @param transType : 是否需要转换字段命名模式,默认为APP的SEARCHFIELDTRANS属性;1：转为驼峰命名;2：转为大写下划线模式;3：不做转换;
	 * @return
	 */
	setSearchParams : true,
	/***
	 * 获取查询store
	 * @return
	 */
	getResultStore : true,
	/**
	 * 刷新当前数据
	 * @return
	 */
	reloadCurrentData : true,
	/**
	 * 获取结果域中当前选择数据对象。如无选择数据,则返回false;如选择多条数据，则返回最后一条；
	 * @return
	 */
	getSelectedData : true,
	/**
	 * 返回当前所有选择数据对象数组。如无选择数据，则返回空数组。
	 * @return
	 */
	getAllSelects : true,
	/**
	 * 判断当前是否有选中的数据行
	 * @return boolean
	 */
	hasSelected : true,
	/**
	 * 根据index选择数据，
	 * @param index：数据行的顺序，从0开始计数；可为单个数字，也可为一个数字组成的数组，如：[1,2,3,4]
	 * @return
	 */
	selectByIndex : true,
	/**
	 * 取消所有的数据行选择
	 * @return
	 */
	clearSelect : true,
	/**
	 * 反选当前页数据
	 * @return
	 */
	antiSelect : true,
	/**
	 * 全选当前页数据
	 * @return
	 */
	allSelect : true,
	/**
	 * 数据提交
	 * @param data ：当前表单捕获数据,json格式;
	 * @param comitUrl ：可选参数,提交URL,系统默认为app对象的提交URL
	 * @param needPid ： 是否需要返回提交数据主键
	 * @return
	 */
	comitData : true,
	/**
	 * 转换数据字段名格式,对于空数据项,进行剪除。返回新副本,不变动传入参数的结构
	 * @param data ： 待提交数据
	 * @param transtype ： 转换类型,1：从大写下划线转换为驼峰命名;2：从驼峰命名转换为大写下划线类型;默认为1;3、不做转换;
	 * @return
	 */
	translateDataKey : true,
	/**
	 * 根据name属性,获取字段配置信息;
	 * @param name：可为String类型或者数组;
	 * @return
	 */
	getFieldsByName : true,
	/**
	 * 根据name属性,创建字段配置信息副本;
	 * @param name：可为String类型或者数组;
	 * @return
	 */
	copyFieldsByName : true,
	/**
	 * 创建APP对象整体基础字段配置副本
	 * @return
	 */
	getFieldsCopy : true,
	/**
	 * 收起查询条件面板
	 * @return
	 */
	collapseSearchPanel : true,
	/**
	 * 展开查询面板
	 * @return
	 */
	expandSearchPanel : true,
	/**
	 * 获取边缘面板对象；
	 * params ： 'left','right','top','buttom'
	 */
	getEdgePanel : true,
	/**
	 * 重置查询条件；
	 * params ： deldy : 是否删除动态字段；
	 */
	resetCondition : true,
	/**
	 * 获取当前展示信息VIEW对象,展示列表时,返回undefined;
	 */
	getCurrentView : true,
	/**
	 * 隐藏当前展示信息VIEW对象；
	 */
	hideCurrentView : true,
	/**
	 * 获取详情VIEW,无详情面板返回false；
	 */
	getDetailView : true,
	/**
	 * 获取新增VIEW,无新增面板返回false；
	 */
	getCreateView : true,
	/**
	 * 获取修改VIEW,无修改面板返回false；
	 */
	getEditView : true,
	/**
	 * 展示详情VIEW,无详情面板返回false；
	 */
	showDetailView : true,
	/**
	 * 展示新增VIEW,无新增面板返回false；
	 */
	showCreateView : true,
	/**
	 * 展示修改VIEW,无修改面板返回false；
	 */
	showEditView : true,
	/**
	 * 根据标题获取自定义信息VIEW
	 * @param title : view标题
	 * @return
	 */
	getCustomerViewByTitle : true,
	/**
	 * 根据顺序获取自定义信息VIEW
	 * @param index：顺序
	 * @return
	 */
	getCustomerViewByIndex : true,
	/**
	 * 根据标题展示自定义信息VIEW
	 * @param title：标题
	 * @return
	 */
	showCustomerViewByTitle : true,
	/**
	 * 根据顺序展示自定义信息VIEW
	 * @param index：顺序
	 * @return
	 */
	showCustomerViewByIndex : true,
	/**
	 * 锁定查询结果列表，下一次查询结果重新加载数据时，不在执行结果列表滑入方法；相关事件也不再触发；
	 * 结果列表锁定状态只能持续一次查询；包括手动调用和自动触发；
	 * @return
	 */
	lockGrid : true,
	/**
	 * 解锁查询结果列表锁定状态，如其为未锁定状态，则无任何影像；
	 * @return
	 */
	unlockGrid : true,
	/**
	 * 展示下一个面板
	 * @return
	 */
	showNextView : true,
	/**
	 * 根据字段name属性进行排序
	 * @param dataIndex：字段name属性
	 * @param info：可选：asc、desc；小写。
	 * @return
	 */
	sortByDataIndex : true,
	/**
	 * 根据字段name属性显示该字段
	 * @param fields：string/array ，可为单个字段名，也可为字段名属性
	 * @return
	 */
	showGridFields: true,
	/**
	 * 根据字段name属性隐藏该字段
	 * @param fields：string/array ，可为单个字段名，也可为字段名属性
	 * @return
	 */
	hideGridFields : true,
	/**
	 * 获取当前已隐藏的字段name属性数组
	 * @return
	 */
	getGridHiddenFields : true,
	/**
	 * 添加一个查询条件字段
	 * @param field：String/Object:当参数为String类型的时候，系统将会根据name属性查找元数据（fields）中的配置进行添加；
	 * 							   当参数Object类型的时候，系统将会根据参数本身的配置，进行添加。参数配置参加fields属性中字段配置项；
	 * @return
	 */
	addConditionField : true,
	/**
	 * 移除一个查询条件字段
	 * @param field：String/Object：当参数为String类型的时候，系统将会根据name属性移除字段；
	 * 								当参数为Object类型的时候，判断其为实际的字段对象还是配置项，如为字段对象直接移除，如为配置，则根据参数的name属性移除。
	 * @return
	 */
	removeConditionField : true,
	/**
	 * 获取一个查询条件字段
	 * @param field：String/Object：String类型则根据字段name属性获取字段；Object类型则根据参数中的name属性进行匹配。
	 * @return
	 */
	getConditionField : true,
	/**
	 * 判断是否存在一个查询条件字段
	 * @param field：String/Object：String类型则根据字段name属性获取字段；Object类型则根据参数中的name属性进行匹配。
	 * @return
	 */
	hasConditionField : true,
	/**
	 * 添加一个字段元数据,实时展现在列表对象上.不影响面板及其他,待更新
	 * @param field：object，字段配置
	 * @return
	 */
	addMetaField : true,
	/**
	 * 移除一个字段元数据，实时反映在列表对象上，不影响面板及其他，待更新
	 * @param field：string/object
	 * @return
	 */
	removeMetaField : true,
	/**
	 * 在指定字段之后添加字段。
	 * @param addField：被添加字段配置；参见字段配置；
	 * @param theField：指定字段name属性，string类型；如未发现指定字段，则添加至最后；
	 * @return
	 */
	addMetaAfter : true,
	/**
	 * 在指定字段之前添加字段。
	 * @param addField：被添加字段配置；参见字段配置；
	 * @param theField：指定字段name属性，string类型；如未发现指定字段，则添加至最后；
	 * @return
	 */
	addMetaBefore : true,
	/**
	 * 是否存在查询面板按钮
	 * @param but:操作的按钮类型,Wlj.frame.functions.app.App.prototype.BUTTON_TYPE
	 * @return
	 */
	hasConditionButton : true,
	/**
	 * 禁用按钮
	 * @param but:操作的按钮类型,App-cfg的BUTTON_TYPE属性
	 * @return
	 */
	disableConditionButton : true,
	/**
	 * 启用按钮
	 * @param but:操作的按钮类型,App-cfg的BUTTON_TYPE属性
	 * @return
	 */
	enableConditionButton : true,
	/**
	 * 隐藏查询面板按钮
	 * @param but:操作的按钮类型,Wlj.frame.functions.app.App.prototype.BUTTON_TYPE
	 * @return
	 */
	hideConditionButton : true,
	/**
	 * 显示查询面板按钮
	 * @param but:操作的按钮类型,Wlj.frame.functions.app.App.prototype.BUTTON_TYPE
	 * @return
	 */
	showConditionButton : true,
	/**
	 * 遮罩指定区域
	 * @param String/Array[String]:需要遮罩的区域'left','right','top','buttom','east',
	 * 'west','north','south','searchDomain','resultDomain'
	 * @param String:遮罩提示信息
	 */
	maskRegion : true,
	/**
	 * 去遮罩指定区域
	 * @param String/Array[String]:需要去遮罩的区域'left','right','top','buttom','east',
	 * 'west','north','south','searchDomain','resultDomain'
	 */
	unmaskRegion : true,
	/**
	 * 打开客户视图
	 * @param String/Object : custId 客户ID 或 {viewId :客户ID}
	 */
	openCustomerView : true,
	setFieldTile : true,
	addStepData : true,
	getViewTotalIndex : true,
	showViewByTotalIndex : true,
	getStat : true,
	initStat : true,
	/**
	 * 构建一个可以用于form表单的字段，根据fields中的配置
	 * @param name
	 * @return
	 */
	buildFormField : true,
	/**
	 * 构造一个可以用于grid表头的配置，根据fields的配置
	 * @param name
	 * @return
	 */
	buildGridColumn : true,
	/**
	 * 构造一个可以用于store中字段定义的配置，根据fields的配置
	 * @param name
	 * @return
	 */
	buildStoreField : true
};
