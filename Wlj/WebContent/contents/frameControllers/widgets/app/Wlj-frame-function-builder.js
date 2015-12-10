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
		
		window.searchDomainCfg = false;
		window.resultDomainCfg = false;
		
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
				treecreate : true,
				beforefieldlock : true,
				beforefieldunlock : true,
				fieldlock : true,
				fieldunlock : true
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
		Wlj.tools.imports(['/contents/frameControllers/defaultPatches.js']);
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
			detailFormCfgs : window.detailFormCfgs,
			searchDomainCfg : window.searchDomainCfg,
			resultDomainCfg : window.resultDomainCfg
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