Ext.ns('Wlj.frame.functions.preview');
Wlj.frame.functions.preview.DataInterface = {
	setValue : function(name,value){
		var _this=this;
		if(Ext.isArray(name)){
				var flag=true;
			for(key in name){
				if(Ext.isObject(_this[name[key]])){
					_this[name[key]].value = value[key];
					_this[name[key]].defined = true;
					_this[name[key]] = Object.baseCoding(name[key],_this[name[key]]);
				}
			}
		}else if(Ext.isObject(this[name])){
			this[name].value = value;
			this[name].defined = true;
			this[name] = Object.baseCoding(name,this[name]);
		}else{
			return '';
		}
	},
	resetValue:function(name){
		if(Ext.isObject(this[name])){
			this[name].defined = false;
			this[name] = Object.baseCoding(name,this[name]);
		}else {
			return false;
		}
	},
	getCode : function(name){
		if(!this[name]){
			Ext.MessageBox.alert('提示', '未找到该名称对应的对象');
			return false;
		}
		if(!this[name].defined){
			return '';
		}
		return Object.baseComment(this[name])+this[name].codeValue;
	},
	getAllCode:function(){
		var returnV=this.getBasecomment();
		for(key in this){
			if(this[key].defined){
				returnV+=Object.baseComment(this[key])+this[key].codeValue;
			}
		}
		return returnV;
	},
	getBaselisteners:function(a){
		var returnV=false;
		if(Ext.isString(a)){
			if(Ext.isObject(this[a])){
				returnV=Object.baseComment(this[a]);
				if(this[a].defined){
					returnV+=this[a].codeValue;
				}else{
					 returnV+=a+" = function("+this[a].params+") {\n\t";
					 returnV+=(this[a].returns==undefined?"":"return "+this[a].returns.coding()+";");
					 returnV+="\n};\n";
				}
			}
		}
		return returnV;
	},
	getBasecomment:function(){
		var basecomment = "/**\n * @author ";
			basecomment+=__userId;
			basecomment+='\n * @since ';
			basecomment+=Ext.util.Format.date(new Date(), 'Y-m-d'); 
			basecomment+='\n */\n';
			return basecomment;
	},
	url : {
		defined : false,
		definedValue:false,
		value : false,
		codeValue:false,
		type: 'string',
		detailComment:'数据查询URL地址。如：XXX.json',
		comment:'数据查询URL地址',
		urlCode:function(url){
		url= "basepath + '/"+this.value.split('/')[this.value.split('/').length-1]+"';\n";
			return url;
		},
		coding : function(){
			if(this.defined){
				this.codeValue="url =" +this.urlCode(this.value);
			}else{
				this.value=false;
				this.codeValue=false;
			}
		}
	},
	comitUrl : {
		defined : false,
		definedValue:false,
		value : false,
		codeValue:false,
		type: 'string',
		detailComment:'新增、修改提交地址,如：XXX.json,若未配置该项,则使用查询URL做为提交地址',
		comment:'新增、修改提交URL地址',
		coding : function(){
			if(this.defined){
				this.codeValue="comitUrl = "+Wlj.frame.functions.preview.DataInterface.url.urlCode(this.value);
			}else{
				this.value=false;
				this.codeValue=false;
			}
		}
	},
	fields : {
		defined : false,
		definedValue:[],
		value : [],
		arrayModel:[
		     {'name':'name','shortComment':'字段名','defined':false,'defaultValue':false,'codeValue':false,'type':'string','detailComment':'字段所对应的业务逻辑名称,该属性应与查询结果中的字段列相同;该属性将做为数据接收、前台控制、后台提交等的关键属性;'},
		     {'name':'text','shortComment':'中文名','defined':false,'defaultValue':false,'codeValue':false,'type':'string','detailComment':'字段的中文名称,将被用于表单中的字段标签、以及列表中的表头;当字段没有这个属性时,该字段将被隐藏;'},
		     {'name':'searchField','shortComment':'是否默认查询条件','defined':false,'defaultValue':false,'codeValue':false,'type':'boolean','detailComment':'该字段是否做为查询字段,在查询条件域中展示;'},
		     {'name':'hidden','shortComment':'是否隐藏','defined':false,'defaultValue':false,'codeValue':false,'type':'boolean','detailComment':'字段展示情况,该属性用于字段在列表、查询表单、新增、修改表单的强制隐藏'},
		     {'name':'dataType','shortComment':'前端数据类型','defined':false,'defaultValue':false,'codeValue':false,'type':'string','detailComment':'数据类型;'},
		     {'name':'translateType','shortComment':'字典编码','defined':false,'defaultValue':false,'codeValue':false,'type':'string','detailComment':'字段涉及到的映射字典项;该字典项将做为查询结果中的字段映射依据,以及表单面板中的下拉框的选择值;'},
		     {'name':'resutlWidth','shortComment':'列宽','defined':false,'defaultValue':150,'codeValue':false,'type':'int','detailComment':'字段在查询结果列中展示的宽度,默认150;'},
		     {'name':'viewFn','shortComment':'展示逻辑','defined':false,'defaultValue':false,'codeValue':false,'type':'fn','detailComment':'字段在列表中,展示时的特殊展示类型;该function将在数据行渲染时,接收到字段的值,返回值将做为该字段的展示效果;'},
		     {'name':'xtype','shortComment':'控件类型','defined':false,'defaultValue':false,'codeValue':false,'type':'string','detailComment':'字段在面板中渲染时的类型，特别的，当xtype=wcombotree时，需要三个属性,innerTree,showField,hideField;'},
		     {'name':'innerTree','shortComment':'下拉树','defined':false,'defaultValue':false,'codeValue':false,'type':'string','detailComment':'下拉树类型指定的受控于TreeManager的tree面板KEY值。会在渲染时，自动调用TreeManager创建一个tree面板;'},
		     {'name':'showField','shortComment':'下拉树名称字段','defined':false,'defaultValue':false,'codeValue':false,'type':'string','detailComment':'下拉树的展示字段;'},
		     {'name':'hideField','shortComment':'下拉树ID字段','defined':false,'defaultValue':false,'codeValue':false,'type':'string','detailComment':'下拉树的key字段;'},
		     {'name':'gridField','shortComment':'是否在列表展示','defined':false,'defaultValue':false,'codeValue':false,'type':'boolean','detailComment':'是否在列表中展示;默认为true;'},
		     {'name':'cAllowBlank','shortComment':'查询条件是否可为空','defined':false,'defaultValue':true,'codeValue':false,'type':'boolean','detailComment':'当字段配置做为查询条件时字段时，是否可为空；默认为true;'},
		     {'name':'multiSelect','shortComment':'是否复选','defined':false,'defaultValue':false,'codeValue':false,'type':'boolean','detailComment':'下拉框是否为多选;仅当translateType配置时生效;默认为false;'},
		     {'name':'multiSeparator','shortComment':'复选分隔符','defined':false,'defaultValue':',','codeValue':false,'type':'string','detailComment':'多选下拉框的分隔符;仅当multiSelect为true时生效;默认值为app-cfg中的multiSelectSeparator配置(,)'},
		     {'name':'editable','shortComment':'可否编辑','defined':false,'defaultValue':false,'codeValue':false,'type':'boolean','detailComment':'下拉框是否可以手动编辑;仅当translateType配置时生效;默认为false'},
		     {'name':'enableCondition','shortComment':'是否可成为动态条件','defined':false,'defaultValue':true,'codeValue':false,'type':'boolean','detailComment':'列表字段是否可以拖动成为动态查询条件；默认为true;'},
		     {'name':'noTitle','shortComment':'是否显示数据tip','defined':false,'defaultValue':false,'codeValue':false,'type':'boolean','detailComment':'列表中cell块上鼠标指针浮动时，是否展示数据内容。默认为false，即展示数据内容。如数据经viewFn显示处理后，增加了html标签，则推荐将此属性置为true;'}],
		codeValue:false,
		type: 'array',
		detailComment:'页面主工作区域所涉及到的字段申明;该申明,将被运用于查询面板、结果列表、增删查改的展示、逻辑运算等。'+
		'字段对象：申明一个字段的业务逻辑、展示等的各类配置信息.',
		comment:'页面主工作区域所涉及到的字段申明',
		coding : function(){
			var _this=this;
			if(_this.defined){
				_this.codeValue="fields = [";
				var code = [];
				Ext.each(_this.value, function(field){
					var fCode = _this.codeField(field);
					if(fCode){
						code.push(fCode);
					}
				});
				_this.codeValue += code.join(',\n\t');
				_this.codeValue+="\n];\n";
			}else{
				_this.value=[];
				_this.codeValue=false;
			}
		},
		//coding one field
		//param : filedConfig or fieldIndex in fields.value
		//return : the code value
		codeField : function(par){
			var tmpCfg = null;
			var _this = this;
			if(typeof par == 'number'){
				tmpCfg = _this.value[par];
			}else{
				tmpCfg = par;
			}
			
			var code = [];
			for(var key in tmpCfg){
				if(Ext.isObject(tmpCfg[key])){
					code.push(key +" : " +Object.coding(tmpCfg[key]));
				}else{
					code.push(key +" : " + tmpCfg[key].coding());
				}
			}
			return "{" + code.join(',') + "}";
		},
		addField : function(config){
			var _this = this;
			if(!_this.defined){
				_this.defined = true;
				_this.value = [];
			}
			return _this.mergerField(config);
		},
		mergerField : function(config){
			if(!config.name){
				return false;
			}
			if(this.value.length>0){
				var index = 0;
				while(index<this.value.length){
					if(this.value[index].name === config.name){
						Ext.apply(this.value[index], config);
						this.coding();
						return this.codeField(config);
					}
					index ++;
				}
			}
			this.value.push(config);
			this.coding();
			return this.codeField(config);
		},
		removeField : function(index){
			if(!this.defined || !Ext.isNumber(index)){
				return false;
			}else {
				if(index >= this.value.length){
					return false;
				}else{
					this.value.remove(this.value[index]);
					this.coding();
					return true;
				}
			}
		}
	},
	autoLoadGrid : {
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		type: 'boolean',
		detailComment:'页面初始化之后，是否自动查询数据；默认为自动加载',
		comment:'是否自动加载数据'
	},
	needCondition : {
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		type: 'boolean',
		detailComment:'是否需要构建查询条件面板,默认构建',
		comment:'是否需要构建查询条件面板'
	},
	needGrid : {
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		type: 'boolean',
		detailComment:'是否需要默认的查询结果面板,默认需要,如不需要,查询条件面板也会强制为不构建,同时查询和提交URL不做使用',
		comment:'是否需要默认的查询结果面板'
	},
	needTbar : {
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		type: 'boolean',
		detailComment:'是否需要列表的tbar对象,默认需要',
		comment:'是否需要列表的tbar对象'
	},
	createView : {
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		type: 'boolean',
		detailComment:'是否需要新增面板;默认为：true',
		comment:'是否需要新增面板'
	},
	editView : {
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		type: 'boolean',
		detailComment:'是否需要修改面板;默认为：true',
		comment:'是否需要修改面板'
	},
	detailView : {
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		type: 'boolean',
		detailComment:'是否需要详情面板;默认为：true',
		comment:'是否需要详情面板'
	},
	formViewers :{
		defined : false,
		definedValue:[],
		value : [],
		arrayModel:[{'name':'fields','defined':false,'value':[],'codeValue':false,'type':'array','detailComment':'数组对象,某个分组中所需要的字段对象;必选'},
		            {'name':'fn','defined':false,'value':[],'codeValue':false,'type':'fn','detailComment':'分组字段初始化逻辑。该function可依次接收到[fields]数组中申明的字段;返回经过业务逻辑处理后的字段数组'},
		            {'name':'columnCount','defined':false,'value':false,'codeValue':false,'type':'int','detailComment':'字段面板中,字段列数。可选,默认值为,面板宽度大于1024时为4,小于1024时,为3'},
		            {'name':'labelWidth','defined':false,'value':false,'codeValue':false,'type':'int','detailComment':'字段面板中,标签宽度,数值类型,可选'}],
		codeValue:false,
		type: 'array',
		detailComment:'新增、修改、详情面板配置,也可单独对面板进行配置',
		comment:'新增、修改、详情面板基础配置',
		addGroup : function(group,index){
			if(!Ext.isArray(group.fields)){
				return false;
			}
			if(!this.defined){
				this.defined = true;
			}
			if(!Ext.isArray(this.value)){
				this.value = [];
			}
			this.value=this.value.insertArray(group,index);
			this.coding();
			return true;
		},
		codingAllGroup : function(){
			if(!this.defined || !Ext.isArray(this.value)){
				return '';
			}
			var v = this.value;
			var vcodes = [];
			Ext.each(this.value, function(onegroup){
				if(!onegroup || !Ext.isArray(onegroup.fields)){
					return false;
				}
				var groupcode = Object.coding(onegroup);
				if(groupcode){
					vcodes.push(groupcode);
				}
			});
			return vcodes.join(',');
		},
		coding : function(){
			var codes = 'formViewers = [';
			codes += this.codingAllGroup();
			codes += '];\n';
			this.codeValue = codes;
		}
	},
	createFormViewer : {
		defined : false,
		definedValue:[],
		value : [],
		codeValue:false,
		type: 'array',
		detailComment:'新增面板配置,可单独对新增面板进行配置,单独配置将覆盖基础配置',
		comment:'新增面板配置',
		addGroup:function(group,index){
		 Wlj.frame.functions.preview.DataInterface.formViewers.addGroup.call(this,group,index);
		},
		coding : function(){
			var codes = 'createFormViewer = [';
			codes += Wlj.frame.functions.preview.DataInterface.formViewers.codingAllGroup.call(this);
			codes += '];\n';
			this.codeValue = codes;
		}
	},
	editFormViewer : {
		defined : false,
		definedValue:[],
		value : [],
		codeValue:false,
		type: 'array',
		detailComment:'修改面板配置,可单独对新增面板进行配置,单独配置将覆盖基础配置',
		comment:'修改面板配置',
		addGroup:function(group,index){
		 Wlj.frame.functions.preview.DataInterface.formViewers.addGroup.call(this,group,index);
		},
		coding : function(){
			var codes = 'editFormViewer = [';
			codes += Wlj.frame.functions.preview.DataInterface.formViewers.codingAllGroup.call(this);
			codes += '];\n';
			this.codeValue = codes;
		}
	},
	detailFormViewer : {
		defined : false,
		definedValue:[],
		value : [],
		codeValue:false,
		type: 'array',
		detailComment:'详情面板配置,可单独对新增面板进行配置,单独配置将覆盖基础配置',
		comment:'详情面板配置',
		addGroup:function(group,index){
		 Wlj.frame.functions.preview.DataInterface.formViewers.addGroup.call(this,group,index);
		},
		coding : function(){
			var codes = 'detailFormViewer = [';
			codes += Wlj.frame.functions.preview.DataInterface.formViewers.codingAllGroup.call(this);
			codes += '];\n';
			this.codeValue = codes;
		}
	},
	formCfgs:{
		defined : false,
		definedValue:false,
		value : false,
		objectModel:[{'name':'formButtons','defined':false,'value':[],'codeValue':false,'type':'array','detailComment':'表单自定义按钮，每一个元素将被创建为一个按钮,数组内部类型为{text,fn},text属性为按钮名称， fn为点击触发逻辑，作用域为该按钮所在view对象，接收参数为view内的formPanel对象'}],
		codeValue:false,
		type: 'object',
		detailComment:'针对于新增、修改、详情面板的一些特殊配置。目前，仅有formButtons属性',
		comment:'新增、修改、详情面板特殊配置',
		addButtons:function(a,b){
			if(Ext.isArray(this.value.formButtons)){
				this.value.formButtons = this.value.formButtons.push(a);
			}else{
				this.value.formButtons=[];
				this.value.formButtons = this.value.formButtons.insertArray(a,b);
			}
			this.defined=true;
			this.coding();
		},
		removeButton:function(a){
			if(this.value){
				if(Ext.isArray(this.value.formButtons)){
					for(var i=0;i<this.value.formButtons.length;i++){
						if(a=this.value.formButtons[i].text){
							this.value.formButtons = this.value.formButtons.deleteArray(a);
						}
					}
				}
				this.coding();	
			}
		}
	},
	createFormCfgs:{
		defined : false,
		definedValue:false,
		value : false,
		codeValue:false,
		type: 'object',
		detailComment:'针对于新增面板的一些特殊配置。目前，仅有formButtons属性',
		comment:'新增面板特殊配置',
		addButtons:function(a,b){
			Wlj.frame.functions.preview.DataInterface.formCfgs.addButtons.call(this,a,b);
		},
		removeButton:function(a){
			Wlj.frame.functions.preview.DataInterface.formCfgs.removeButton.call(this,a);
		}
	
	},
	editFormCfgs:{
		defined : false,
		definedValue:false,
		value : false,
		codeValue:false,
		type: 'object',
		detailComment:'针对于修改面板的一些特殊配置。目前，仅有formButtons属性',
		comment:'修改面板特殊配置',
		addButtons:function(a,b){
		Wlj.frame.functions.preview.DataInterface.formCfgs.addButtons.call(this,a,b);
		},
		removeButton:function(a){
			Wlj.frame.functions.preview.DataInterface.formCfgs.removeButton.call(this,a);
		}
	
	},
	detailFormCfgs:{
		defined : false,
		definedValue:false,
		value : false,
		codeValue:false,
		type: 'object',
		detailComment:'针对于详情面板的一些特殊配置。目前，仅有formButtons属性',
		comment:'详情面板特殊配置',
		addButtons:function(a,b){
		Wlj.frame.functions.preview.DataInterface.formCfgs.addButtons.call(this,a,b);
		},
		removeButton:function(a){
			Wlj.frame.functions.preview.DataInterface.formCfgs.removeButton.call(this,a);
		}
	},
	validates:{
		defined : false,
		definedValue:[],
		value : [],
		arrayModel:[{'name':'dataFields','defined':false,'value':[],'codeValue':false,'type':'array','detailComment':'数组对象,申明该校验规则中,涉及到的字段'},
		             {'name':'fn','defined':false,'value':false,'codeValue':false,'type':'fn','detailComment':'校验逻辑function,可依次接收到[dataFields]中申明的字段的值,当且仅当返回为：false时,校验失败'},
		             {'name':'desc','defined':false,'value':false,'codeValue':false,'type':'string','detailComment':'校验失败时候的提示信息'}],
		codeValue:false,
		type: 'array',
		detailComment:'针对于新增、修改校验进行配置',
		comment:'新增、修改提交的校验'
	},
	createValidates:{
		defined : false,
		definedValue:[],
		value : [],
		codeValue:false,
		type: 'array',
		detailComment:'针对于新增校验进行配置',
		comment:'新增提交的单独校验'
	
	},
	editValidates:{
		defined : false,
		definedValue:[],
		value : [],
		codeValue:false,
		type: 'array',
		detailComment:'针对于修改校验进行配置',
		comment:'修改提交的单独校验'
	},
	linkages:{
		defined : false,
		definedValue:false,
		value : false,
		codeValue:false,
		type: 'object',
		objectModel:[{'name':'fieldName','defined':false,'value':false,'codeValue':false,'type':'object','detailComment':'联动逻辑触发字段,object内部包含了fields：申明该联动对象影响到的字段对象数组，fn:可依次接收到[fieldName][fields]声明的字段对象'}],
		detailComment:'数据域联动逻辑,逐条编写,联动逻辑将在字段数据发生变化,失去焦点时触发',
		comment:'数据域联动逻辑'
	},
	createLinkages:{
		defined : false,
		definedValue:false,
		value : false,
		codeValue:false,
		type: 'object',
		objectModel:[{'name':'fieldName','defined':false,'value':false,'codeValue':false,'type':'object','detailComment':'联动逻辑触发字段,object内部包含了fields：申明该联动对象影响到的字段对象数组，fn:可依次接收到[fieldName][fields]声明的字段对象'}],
		detailComment:'数据域联动逻辑,逐条编写,联动逻辑将在字段数据发生变化,失去焦点时触发',
		comment:'新增数据域联动逻辑'
	},
	editLinkages:{
		defined : false,
		definedValue:false,
		value : false,
		codeValue:false,
		type: 'object',
		objectModel:[{'name':'fieldName','defined':false,'value':false,'codeValue':false,'type':'object','detailComment':'联动逻辑触发字段,object内部包含了fields：申明该联动对象影响到的字段对象数组，fn:可依次接收到[fieldName][fields]声明的字段对象'}],
		detailComment:'数据域联动逻辑,逐条编写,联动逻辑将在字段数据发生变化,失去焦点时触发',
		comment:'修改数据域联动逻辑'
	},
	lookupTypes:{
		defined : false,
		definedValue:[],
		value : [],
		arrayModel:[{'name':'lookupType','defined':false,'value':false,'codeValue':false,'type':'string','detailComment':'远程数据字典分为两种类型,码值类型的直接为string的码值名称，远程RUL加载的为一个object对象,包含属性(TYPE,url,key,value,root)'}],
		codeValue:false,
		type: 'array',
		detailComment:'远程数据字典类型;APP对象会在页面渲染之前自动请求所有数据字典项,并纳入数据字典管理器',
		comment:'远程数据字典',
		coding : function(){
			if(this.defined){
				var returnValue='lookupTypes = [\n';
				for(var i=0;i<this.value.length;i++){
					if(i!=0){
						returnValue+=',\n';
					}
					if(Ext.isObject(this.value[i])){
						returnValue+='{';
						returnValue+='TYPE : '+Ext.encode(this.value[i].TYPE)+',\n';
						returnValue+='url : '+Ext.encode(this.value[i].url)+',\n';
						returnValue+='key : '+Ext.encode(this.value[i].key)+',\n';
						returnValue+='value : '+Ext.encode(this.value[i].value)+',\n';
						returnValue+='root : '+Ext.encode(this.value[i].root);
						returnValue+='}';
						
					}else{
						returnValue+="'"+this.value[i]+"'";		
					}
				}
				returnValue+='\n]';
				returnValue=returnValue.replace(/\n/g, "\n\t");
				this.codeValue=returnValue+';\n';
			}else{
				this.value=false;
				this.codeValue=false;
			}
		},
		addLookup : function(lookup){
			if(!this.defined){
				this.defined = true;
				this.value = [];
			}
			var codable = this.mergerLookup(lookup);
			if(codable)
				this.coding();
		},
		//如无发生变化，则返回false；如新增一个，则返回true
		mergerLookup : function(lookup){
			if(Ext.isString(lookup)){
				if(!this.checkExsit(lookup)){
					this.value.push(lookup);
					return true;
				}else {
					return false;
				}
			}
			if(Ext.isObject(lookup)){
				if(!lookup.TYPE || !Ext.isString(lookup.TYPE)){
					return false;
				}
				if(!this.validatLookupObject(lookup)){
					return false;
				}
				if(this.value.length == 0){
					this.value.push(lookup);
					return true;
				}
				if(this.checkExsit(lookup.TYPE)){
					return false;
				}else {
					this.value.push(lookup);
					return true;
				}
			}
		},
		//检查数据字典配置正确性,正确：true；错误：false；
		validatLookupObject : function(lookup){
			if(!lookup.TYPE || !Ext.isString(lookup.TYPE)){
				return false;
			}
			if(lookup.url){//远程URL字典
				if(lookup.key && lookup.value){
					return true;
				}else return false;
			}
		},
		//检查数据字典是否已经存在
		checkExsit : function(lookupType){
			var index = 0;
			while(index < this.value.length){
				if(this.value[index] === lookupType || this.value[index].TYPE === lookupType){
					return true;
				}
				index ++ ;
			}
			return false;
		}
	},
	localLookup:{
		defined : false,
		definedValue:false,
		value : false,
		objectModel:[{'name':'lookupName','defined':false,'value':[],'codeValue':false,'type':'array','detailComment':'本地数据字典的静态数据'}],
		codeValue:false,
		type: 'object',
		detailComment:'本地静态数据字典项;APP对象会在页面渲染之前将这些数据字典项同远程字典项一并纳入数据字典管理器;',
		comment:'本地数据字典',
		coding : function(){
			var codeTmp = "var localLookup = ";
			codeTmp += Object.coding(this.value);
			this.codeValue = codeTmp;
		},
		//检查数据字典是否已经存在
		checkExsit : function(lookupType){
			if(!this.defined){
				return false;
			}
			return !!this.value[lookupType];
		},
		addLookup : function(lookup){
			if(!this.defined){
				this.defined = true;
				this.value = {};
			}
			this.mergerLocalLookup(lookup);
			this.coding();
		},
		validateLocalLookup : function(config){
			for(var key in config){
				if(!Ext.isArray(config[key])){
					return false;
				}
			}
			return true;
		},
		mergerLocalLookup : function(config){
			if(!this.validateLocalLookup(config)){
				return false;
			}
			Ext.apply(this.value, config);
			return true;
		}
	},
	edgeVies:{
		defined : false,
		definedValue:false,
		value : false,
		objectModel:[{'name':'top','defined':false,'value':false,'codeValue':false,'type':'object','detailComment':'工作区上部边缘配置'},
		             {'name':'left','defined':false,'value':false,'codeValue':false,'type':'object','detailComment':'工作区左部边缘配置'},
		             {'name':'right','defined':false,'value':false,'codeValue':false,'type':'object','detailComment':'工作区右部边缘配置'},
		             {'name':'buttom','defined':false,'value':false,'codeValue':false,'type':'object','detailComment':'工作区底部边缘配置'}],
		codeValue:false,
		type: 'object',
		detailComment:'配置上下左右四个边缘配置信息,包含top、left、right、buttom;',
		comment:'上下左右四个边缘配置',
		coding : function(){//需要单独对itmes做处理，当做一个字符串把items结构放入value,如items :'[grid,right_panel]'
			if(this.defined){
				var returnValue='edgeVies : {\n';
				var keyNum=0;
				for(key in this.value){
					if(keyNum!=0){
						returnValue+=',\n';
					}
					keyNum+=1;
					returnValue+=key+' : {';
					var indentValue='';
					var keysNum=0;
					for(keys in this.value[key]){
						if(keysNum!=0){
							indentValue+=',';
						}
						indentValue+='\n';
						keysNum+=1;
						if(Ext.isObject(this.value[key][keys])){
							indentValue+=keys+' : '+Object.coding(this.value[key][keys]);
						}else{
							if(keys=='items'){
								indentValue+=keys+" : "+this.value[key][keys];
							}else{
								indentValue+=keys+" : '"+this.value[key][keys].coding()+"'";
							}
						}
					}
					indentValue += '\n}';
					returnValue += indentValue.replace(/\n/g, "\n\t");
				}
				this.codeValue = returnValue.replace(/\n/g, "\n\t")+'\n};\n';
			}else{
				this.value = false;
				this.codeValue = false;
			}
		}
	},
	customerView:{
		defined : false,
		definedValue:[],
		value : [],
		arrayModel:[{'name':'viewModel','defined':false,'value':false,'codeValue':false,'type':'object','detailComment':'可以是同新增面板一样的进行配置包含(fields,fn,columnCount,labelWidth,formButtons等),也可以是正常的基础面板包含(title,type,hideTitle,items等),items中放入组件'} ],
		codeValue:false,
		type: 'array',
		detailComment:'触发按钮将被渲染在‘新增’,‘修改’,‘详情’按钮之后;配置同Ext各类组件对象,与系统新增、修改、详情面板相同,可配置suspendFitAll、及suspendWidth属性',
		comment:'查询结果域扩展功能面板',
		addPanel : function(title, cfg){
			if(this.getByTitle(title)){
				alert('exsit');
				return false;
			}
			if(!Ext.isString(title)){
				alert('title error');
				return false;
			}
			if(!this.defined){
				this.defined = true;
				this.value = [];
			}
			var panel = {};
			panel.title = title;
			if(Ext.isObject(cfg)){
				Ext.apply(panel, cfg);
			}
			this.value.push(panel);
			this.codeValue =  'customerView = '+this.value.coding();
		},
		updatePanel : function(index, title, cfg){
			if(!this.defined) {
				alert('not defined');
				return false;
			}
			if(!Ext.isNumber(index) || index >= this.value.length){
				alert('index error!');
				return false;
			}
			if(!Ext.isString(title)){
				alert('title error!');
				return false;
			}
			var panel = {};
			Ext.apply(panel, cfg);
			panel.title = title;
			Ext.apply(this.value[index], panel);
			this.codeValue =  'customerView = '+this.value.coding()+";";
			return true;
		},
		removePanel : function(index){
			if(!this.defined){
				return false;
			}
			if(!Ext.isNumber(index) || index >= this.value.length){
				alert('index error!');
				return false;
			}
			this.value.remove(this.value[index]);
			this.codeValue = 'customerView = '+this.value.coding();
			return true;
			
		},
		getByTitle : function(title){
			if(!this.defined || !Ext.isString(title)){
				return false;
			}
			for(var i=0;i<this.value.length;i++){
				if(this.value[i].title == title){
					return this.value[i];
				}
			}
			return false;
		}
	},
	treeLoaders:{
		defined : false,
		definedValue:[],
		value : [],
		arrayModel:[],
		codeValue:false,
		type: 'array',
		detailComment:'配置参考：Wlj.frame.functions.app.widgets.ArrayTreeLoader;loader对象会在APP初始化的时候进行创建，且加载好数据结构。',
		comment:'页面中可能会使用的树形结构的loader对象配置',
		coding : function(){
			var code = "treeLoaders = "+this.value.coding()+";\n";
			this.codeValue = code;
		},
		mergerLoader : function(config){
			if(!this.validateLoadCfg(config)) return false;
			var loader = this.checkExsit(config.key);
			if(!this.defined){
				this.defined = true;
				this.value = [];
			}
			if(!loader){
				this.value.push(config);
			} else {
				Ext.apply(loader, config);
			}
			this.coding();
		},
		removeLoader : function(key){
			var theKey = key;
			if(Ext.isObject(key)){
				theKey = key.key;
			}
			var theLoader = this.checkExsit(theKey);
			if(!theLoader) return false;
			else {
				this.value.remove(theLoader);
				this.coding();
				return true;
			}
		},
		validateLoadCfg : function(config){
			if(!config.key)	return false;
			if(!config.url) return false;
			if(!config.parentAttr) return false;
			if(!config.idProperties) return false;
			if(!config.textField) return false;
			if(!config.rootValue) return false;
			return true;
		},
		checkExsit : function(key){
			if(!this.defined) return false;
			if(this.value.length == 0) return false;
			for(var i=0;i<this.value.length;i++){
				if(this.value[i].key === key) return this.value[i];
			}
			return false;
		}
	},
	treeCfgs:{
		defined : false,
		definedValue:[],
		value : [],
		arrayModel:[],
		codeValue:false,
		type: 'array',
		detailComment:'配置参考：Wlj.frame.functions.app.widgets.TreePanel；tree对象构建调用TreeManager对象的createTree方法；其中，root数据不做配置，由rootCfg代替，为简单json对象；',
		comment:'页面中可能用到的树形面板对象预配置',
		coding : function(){
			var code = "treeCfgs = "+this.value.coding()+";\n";
			this.codeValue = code;
		},
		mergerTreeCfg : function(config){
			if(!this.validateTreeCfg(config)) return false;
			var theTree = this.checkExsit(config.key);
			if(!this.defined){
				this.defined = true;
				this.value = [];
			}
			if(!theTree){
				this.value.push(config);
			}else{
				Ext.apply(theTree, config);
			}
			this.coding();
		},
		removeTreeCfg : function(key){
			var theKey = key;
			if(Ext.isObject(theKey)){
				theKey = key.key;
			}
			var theTree = this.checkExsit(theKey);
			if(!theTree) return false;
			else {
				this.value.remove(theTree);
				this.coding();
				return ;
			}
		},
		checkExsit : function(key){
			if(!this.defined) return false;
			if(this.value.length == 0) return false;
			for(var i=0;i<this.value.length;i++){
				if(this.value[i].key === key) return this.value[i];
			}
			return false;
		},
		validateTreeCfg : function(config){
			if(!config.key) return false;
			if(!config.loaderKey) return false;
			var cls = Wlj.frame.functions.preview.DataInterface.treeLoaders;
			if(!cls.checkExsit(config.loaderKey)) return false;
			//TODO more checking is needed.
			return true;
		}
	},
	tbar:{
		defined : false,
		definedValue:[],
		value : [],
		codeValue:false,
		type: 'array',
		detailComment:'按钮配置同Ext.Button',
		comment:'用户扩展工具栏按钮',
		coding : function(){
			if(this.defined){
				var codingArray = [];
				codingArray.push('tbar = [');
				for(var bindex=0;bindex<this.value.length; bindex++){
					if(bindex!=0){
						codingArray.push(',');
					}
					codingArray.push('{\n');
					codingArray.push('\ttext : "'+this.value[bindex].get('text')+'"');
					if(this.value[bindex].get('handler')){
						codingArray.push(',\n');
						codingArray.push('\thandler : function(){\n');
						codingArray.push('\t\t'+this.value[bindex].get('handler')+'\n');
						codingArray.push('\t}\n');
					}else{
						codingArray.push('\n');
					}
					codingArray.push('}');
				}
				codingArray.push('];');
				this.codeValue = codingArray.join('');
			}else{
				this.value=true;
				this.codeValue=false;
			}
		}
	},
	beforeinit:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'app',
		returns:true,
		type: 'listeners',
		detailComment:'APP初始化之前触发. params:app(当前APP对象). return:false(阻止页面初始化),默认为true',
		comment:'事件:beforeinit'
	},
	afterinit:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'app',
		type: 'listeners',
		detailComment:'APP初始化之后触发. params ： app：当前APP对象',
		comment:'事件:afterinit'
	},
	beforeconditioninit:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'con,app',
		type: 'listeners',
		detailComment:'查询条件域对象初始化之前触发，此时对象尚未渲染. params ：con：查询条件面板对象,app：当前APP对象',
		comment:'事件:beforeconditioninit'
	},
	afterconditioninit:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'con,app',
		type: 'listeners',
		detailComment:'查询条件域对象初始化之后触发，此时对象尚未渲染. params ：con：查询条件面板对象,app：当前APP对象',
		comment:'事件:afterconditioninit'
	},
	beforeconditionrender:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'con,app',
		type: 'listeners',
		detailComment:'查询条件域对象渲染之前触发，此时对象尚未渲染. con：查询条件面板对象,app：当前APP对象',
		comment:'事件:beforeconditionrender'
	},
	afterconditionrender:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'con,app',
		type: 'listeners',
		detailComment:'查询条件域对象渲染之后触发. params ：con：查询条件面板对象,app：当前APP对象',
		comment:'事件:afterconditionrender'
	},
	beforeconditionadd:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'fCfg,columnIndexT,searchPanel',
		returns:true,
		type: 'listeners',
		detailComment:'当数据字段被动态拖动到查询条件框时触发. params : fCfg：添加之前默认生成的数据项配置，columnIndexT：将要被添加的列数，searchPanel：查询条件form面板. return ：true阻止条件添加事件；默认为true',
		comment:'事件:beforeconditionadd'
	},
	conditionadd:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'field,searchPanel',
		type: 'listeners',
		detailComment:'当数据字段被添加为查询条件后触发. params : field：被添加后的字段对象，searchPanel：查询面板表单',
		comment:'事件:conditionadd'
	},
	beforeconditionremove:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'field,searchPanel',
		returns:true,
		type: 'listeners',
		detailComment:'当一个动态数据条件被移除前触发. params : field：将要被移除的查询条件字段对象,searchPanel：查询条件面板对象. return : false，阻止移除事件；默认为true',
		comment:'事件:beforeconditionremove'
	},
	conditionremove:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'searchPanel',
		type: 'listeners',
		detailComment:'当一个动态数据条件被移除后触发. params : searchPanel被移除字段后的查询条件表单',
		comment:'事件:conditionremove'
	},
	beforedyfieldclear:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'searchDomain,searchpanel,dyfield',
		type: 'listeners',
		detailComment:'当动态数据条件被全部移除前触发. params ：searchDomain：查询域对象，searchpanel：查询条件面板，dyfield：移除前动态字段数组',
		comment:'事件:beforedyfieldclear'
	},
	afterdyfieldclear:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'searchDomain,searchpanel,dyfield',
		type: 'listeners',
		detailComment:'当动态数据条件被全部移除后触发. params ：searchDomain：查询域对象，searchpanel：查询条件面板，dyfield：移除前动态字段数组',
		comment:'事件:afterdyfieldclear'
	},
	beforeconditioncollapse:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'panel',
		returns:true,
		type: 'listeners',
		detailComment:'查询条件域收起前触发. params：panel：查询条件域面板. return：false：阻止查询条件域收起事件，默认为true',
		comment:'事件:beforeconditioncollapse'
	},
	afterconditioncollapse:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'panel',
		type: 'listeners',
		detailComment:'查询条件域收起后触发. params：panel：查询条件域面板',
		comment:'事件:afterconditioncollapse'
	},
	beforeconditionexpand:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'panel',
		returns:true,
		type: 'listeners',
		detailComment:'查询条件域收展开触发. params：panel：查询条件域面板. return：false：阻止查询条件域展开事件，默认为true',
		comment:'事件:beforeconditionexpand'
	},
	afterconditionexpand:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'panel',
		type: 'listeners',
		detailComment:'查询条件域展开后触发.params：panel：查询条件域面板',
		comment:'事件:afterconditionexpand'
	},
	beforecondtitionfieldvalue:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'field,dataInfo,value',
		returns:true,
		type: 'listeners',
		detailComment:'当一个查询条件域字段被赋值前触发. params： field：字段对象 dataInfo：字段元数据 value ：字段值 return ： false：阻止setValue事件触发；默认为true',
		comment:'事件:beforecondtitionfieldvalue'
	},
	condtitionfieldvalue:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'field,dataInfo,value',
		type: 'listeners',
		detailComment:'当一个查询条件域字段被赋值后触发. params： field：字段对象 dataInfo：字段元数据 value ：字段值 ',
		comment:'事件:condtitionfieldvalue'
	},
	recordselect:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'record,store,tile',
		type: 'listeners',
		detailComment:'数据行被选择时触发,params : record:被选择的数据对象,store:数据所在数据源对象,tile:结果面板中数据行的瓷贴对象',
		comment:'事件:recordselect'
	},
	rowdblclick:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'tile,record',
		type: 'listeners',
		detailComment:'数据行双击事件. params : tile:被双击数据行瓷贴对象,record：被双击数据对象',
		comment:'事件:rowdblclick'
	},
	load:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'',
		type: 'listeners',
		detailComment:'数据load事件',
		comment:'事件:load'
	},
	beforesetsearchparams:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'params,forceLoad,add,transType',
		returns:true,
		type: 'listeners',
		detailComment:'设置当前查询条件前触发. params : params:追加查询条件项,forceLoad：是否强制刷新当前数据,add：是否清理之前查询条件,transType：查询条件key值转换类型. return ：true：阻止查询条件设置动作；默认为true',
		comment:'事件:beforesetsearchparams'
	},
	setsearchparams:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'params,forceLoad,add,transType',
		returns:true,
		type: 'listeners',
		detailComment:'设置当前查询条件之后，数据刷新之前触发. params : params:追加查询条件项,forceLoad：是否强制刷新当前数据,add：是否清理之前查询条件,transType：查询条件key值转换类型. return ：true：阻止查询条件设置动作；默认为true',
		comment:'事件:setsearchparams'
	},
	beforeresultinit:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'con,app',
		type: 'listeners',
		detailComment:'查询结果域对象初始化之前触发，此时对象尚未渲染. params ：con：查询条件面板对象,app：当前APP对象',
		comment:'事件:beforeresultinit'
	},
	afterresultinit:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'con,app',
		type: 'listeners',
		detailComment:'查询结果域对象初始化之后触发，. params ：con：查询条件面板对象,app：当前APP对象',
		comment:'事件:afterresultinit'
	},
	beforeresultrender:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'con,app',
		type: 'listeners',
		detailComment:'查询结果域对象渲染之前触发，此时对象尚未渲染. params ：con：查询条件面板对象,app：当前APP对象',
		comment:'事件:beforeresultrender'
	},
	afterresultrender:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'con,app',
		type: 'listeners',
		detailComment:'查询结果域对象渲染之后触发. params ：con：查询条件面板对象,app：当前APP对象',
		comment:'事件:afterresultrender'
	},
	beforecreateviewrender:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'view',
		type: 'listeners',
		detailComment:'新增面板渲染之前触发. params : view:新增面板对象',
		comment:'事件:beforecreateviewrender'
	},
	aftercreateviewrender:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'view',
		type: 'listeners',
		detailComment:'新增面板渲染之后触发. params : view:新增面板对象',
		comment:'事件:aftercreateviewrender'
	},
	beforeeditviewrender:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'view',
		type: 'listeners',
		detailComment:'修改面板渲染之前触发. params : view:新增面板对象',
		comment:'事件:beforeeditviewrender'
	},
	aftereditviewrender:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'view',
		type: 'listeners',
		detailComment:'修改面板渲染之后触发. params : view:新增面板对象',
		comment:'事件:aftereditviewrender'
	},
	beforedetailviewrender:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'view',
		type: 'listeners',
		detailComment:'详情面板渲染之前触发. params : view:新增面板对象',
		comment:'事件:beforedetailviewrender'
	},
	afterdetailviewrender:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'view',
		type: 'listeners',
		detailComment:'详情面板渲染之后触发. params : view:新增面板对象',
		comment:'事件:afterdetailviewrender'
	},
	beforeviewshow:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'theview',
		returns:true,
		type: 'listeners',
		detailComment:'结果域面板滑入前触发. params：theview : 当前滑入面板. return： false，阻止面板滑入操作；默认为true',
		comment:'事件:beforeviewshow'
	},
	viewshow:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'theview',
		type: 'listeners',
		detailComment:'结果域面板滑入后触发. params：theview ： 当前滑入面板',
		comment:'事件:viewshow'
	},
	beforeviewhide:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'theview',
		type: 'listeners',
		detailComment:'结果域面板滑出前触发. params：theview ： 当前滑出面板',
		comment:'事件:beforeviewhide'
	},
	viewhide:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'theview',
		type: 'listeners',
		detailComment:'结果域面板滑出后触发. params：theview ： 当前滑出面板',
		comment:'事件:viewhide'
	},
	beforevalidate:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'view,panel',
		returns:true,
		type: 'listeners',
		detailComment:'新增、修改面板提交之前数据校验前置事件. params : view:面板对象,panel:面板对象内部form表单面板对象. return : true，阻止校验以及提交',
		comment:'事件:beforevalidate'
	},
	validate:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'view,panel,error',
		type: 'listeners',
		detailComment:'新增、修改面板提交之前数据校验后置事件. params : view:面板对象,panel:面板对象内部form表单面板对象,error：校验结果，布尔型',
		comment:'事件:validate'
	},
	beforecommit:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'data,cUrl',
		returns:true,
		type: 'listeners',
		detailComment:'数据提交之前触发. params : data:提交的数据对象,cUrl：提交地址. return ： true，阻止提交动作；默认为true',
		comment:'事件:beforecommit'
	},
	afertcommit:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'data,cUrl',
		returns:true,
		type: 'listeners',
		detailComment:'数据提交之后触发. params : data:提交的数据对象,cUrl：提交地址. return ：提交成功失败结果，布尔型',
		comment:'事件:afertcommit'
	},
	beforeeditload:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'view,record',
		returns:true,
		type: 'listeners',
		detailComment:'修改表单滑入，加载当前选择数据之前触发. params ：view：修改表单,record ：当前选择的数据. return ： false：阻止数据加载事件，默认为true',
		comment:'事件:beforeeditload'
	},
	aftereditload:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'view,record',
		type: 'listeners',
		detailComment:'修改表单滑入，加载当前选择数据之后触发. params ：view：修改表单,record ：当前选择的数据',
		comment:'事件:aftereditload'
	},
	beforedetailload:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'view,record',
		returns:true,
		type: 'listeners',
		detailComment:'详情表单滑入，加载当前选择数据之前触发. params ：view：修改表单,record ：当前选择的数据. return ： false：阻止数据加载事件，默认为true',
		comment:'事件:beforedetailload'
	},
	afterdetailload:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'view,record',
		type: 'listeners',
		detailComment:'详情表单滑入，加载当前选择数据之后触发. params ：view：修改表单,record ：当前选择的数据',
		comment:'事件:afterdetailload'
	},
	beforetophide:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'',
		type: 'listeners',
		detailComment:'top边缘面板隐藏之前触发',
		comment:'事件:beforetophide'
	},
	tophide:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'',
		type: 'listeners',
		detailComment:'top边缘面板隐藏之后触发',
		comment:'事件:tophide'
	},
	beforetopshow:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'',
		type: 'listeners',
		detailComment:'top边缘面板滑出之前触发',
		comment:'事件:beforetopshow'
	},
	topshow:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'',
		type: 'listeners',
		detailComment:'top边缘面板滑出之后触发',
		comment:'事件:topshow'
	},
	beforelefthide:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'',
		type: 'listeners',
		detailComment:'left边缘面板隐藏之前触发',
		comment:'事件:beforelefthide'
	},
	lefthide:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'',
		type: 'listeners',
		detailComment:'left边缘面板隐藏之后触发',
		comment:'事件:lefthide'
	},
	beforeleftshow:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'',
		type: 'listeners',
		detailComment:'left边缘面板滑出之前触发',
		comment:'事件:beforeleftshow'
	},
	leftshow:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'',
		type: 'listeners',
		detailComment:'left边缘面板滑出之后触发',
		comment:'事件:leftshow'
	},
	beforebuttomhide:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'',
		type: 'listeners',
		detailComment:'buttom边缘面板隐藏之前触发',
		comment:'事件:beforebuttomhide'
	},
	buttomhide:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'',
		type: 'listeners',
		detailComment:'buttom边缘面板隐藏之后触发',
		comment:'事件:buttomhide'
	},
	beforebuttomshow:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'',
		type: 'listeners',
		detailComment:'buttom边缘面板滑出之前触发',
		comment:'事件:beforebuttomshow'
	},
	buttomshow:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'',
		type: 'listeners',
		detailComment:'buttom边缘面板滑出之后触发',
		comment:'事件:buttomshow'
	},
	beforerighthide:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'',
		type: 'listeners',
		detailComment:'right边缘面板隐藏之前触发',
		comment:'事件:beforerighthide'
	},
	righthide:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'',
		type: 'listeners',
		detailComment:'right边缘面板隐藏之后触发',
		comment:'事件:righthide'
	},
	beforerightshow:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'',
		type: 'listeners',
		detailComment:'right边缘面板滑出之前触发',
		comment:'事件:beforerightshow'
	},
	rightshow:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'',
		type: 'listeners',
		detailComment:'right边缘面板滑出之后触发',
		comment:'事件:rightshow'
	},
	lookupinit:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'key,store',
		type: 'listeners',
		detailComment:'一个远程数据字典项被加载完毕之后触发. params : key:字典项类型键值,store:数据字典store',
		comment:'事件:lookupinit'
	},
	locallookupinit:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'key,store',
		type: 'listeners',
		detailComment:'一个本地数据字典项被加载完毕之后触发. params : key:字典项类型键值,store:数据字典store',
		comment:'事件:locallookupinit'
	},
	alllookupinit:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'lookupManager',
		type: 'listeners',
		detailComment:'数据字典项全部加载完毕之后触发. params : lookupManager：数据字典管理器',
		comment:'事件:alllookupinit'
	},
	beforelookupreload:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'type,lStore,config',
		returns:true,
		type: 'listeners',
		detailComment:'数据字典reload之前触发. params ：type：数据字典类型编码,lStore：数据字典store,config ：reload配置. return : 返回false阻止事件发生；默认为true',
		comment:'事件:beforelookupreload'
	},
	lookupreload:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'type,lStore,records,config,succeed',
		type: 'listeners',
		detailComment:'数据字典reload之前触发. params ：type：数据字典类型编码,lStore：数据字典store,records : 更新的数据数组,config ：reload配置,succeed ：数据reload结果标志位',
		comment:'事件:lookupreload'
	},
	beforetreecreate:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'',
		type: 'listeners',
		detailComment:'树形结构构建之前触发',
		comment:'事件:beforetreecreate'
	},
	treecreate:{
		defined : false,
		definedValue:true,
		value : true,
		codeValue:false,
		params:'',
		type: 'listeners',
		detailComment:'树形结构构建之后触发',
		comment:'事件:treecreate'
	}
};