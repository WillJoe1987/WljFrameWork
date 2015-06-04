Ext.apply(Wlj.frame.functions.app.Builder.prototype,{
	getCodeFilePage : function(callbackIm){
		this.codeFile = '/contents/frameControllers/widgets/app/designer/designer.js';
	}
});
Ext.apply(String.prototype,{
	coding : function(){
		return Ext.encode(this.valueOf());
	}
});
(function(){
	/**
	 *说明：所有coding方法都是代码反编译方法，包含number,function,array,object,string,boolean
	 *      insertAttay:为数组对象插入params:a插入的对象，b位置索引
	 *      deleteArray:删除数组中的对象 params:a位置索引
	 *      addObj:为Object对象添加一个Object对象 params: o原object对象，a需要添加的object对象
	 *      insertObjIndex:通过位置索引为object插入一个object对象 params: o原object对象，a需要添加的object对象,b位置索引
	 *      insertObjKey:通过key索引为object插入一个object对象 params: o原object对象，a需要添加的object对象,b key索引
	 *      removeObj:通过key索引删除object中一个对象  params: o原object对象，a key索引
	 */
	Ext.apply(Array.prototype,{
		coding : function(){
			var array=[];
			var returnV="[";
			for(var i=0;i<this.length;i++){
				if(Ext.isObject(this[i])){
					array.push(Object.coding(this[i]));
				}else{
					array.push(this[i].coding());	
				}
			}
			returnV+=array.join(",");
			returnV+="]";
				return returnV.replace(/\n/g, "\n\t");
		},
		insertArray:function(a,b){
			if(Ext.isNumber(b)){
				var returnV=[];
				var flag=false;
				for(var i=0;i<this.length;i++){
					if(i==b){
						returnV.push(a);
						flag=true;
					}
					returnV.push(this[i]);
				}
				if(!flag){
					returnV.push(a);
				}
				return  returnV;
			}else {
				 this.push(a);
				 return this;
			}
		},
		deleteArray:function(a){
			var returnV=[];
			for(var i=0;i<this.length;i++){
				if(i!=a){
					returnV.push(this[i]);
				}
			}
			return returnV;
		}
	});
	Object.coding=function(o){
		var returnV="{";
		var index=0;
		for(key in o){
			if(index!=0){
				returnV+=",\n";
			}else{
				returnV+="\n";
			}
			index++;
			if(Ext.isObject(o[key])){
				returnV+=key +" : " +Object.coding(o[key]);
			}else if(Ext.isArray(o[key])){
				returnV+=key +" : " +o[key].coding();
			}else{
				returnV+=key +" : " +o[key].coding();
			}
		}
		 returnV+="\n}";
		 return returnV.replace(/\n/g, "\n\t");
	};
	Object.baseCoding=function(a,b){
		if(b.defined){
			var returnV = a+ " = ";
			if(b.type=="listeners"){
				b.value=eval(b.value);
				returnV+=b.value.coding()+";\n";
				b.codeValue=returnV;
			}else{
				if(Ext.isFunction(b.coding)){
					returnV=b.coding();
				}else{
					if(Ext.isObject(b.value)){
						returnV+=Object.coding(b.value);
					}else{
						returnV+=b.value.coding();
					}
					returnV+=";\n";
					b.codeValue=returnV;
				}
			}
		}else{
			b.value=b.definedValue;
			b.codeValue=false;
		}
		return b;
	};
	Object.baseComment=function(a){
		if(a.type==="listeners"){
			return '//'+a.detailComment+'\n';
		}else{
			return '//'+a.comment+'\n';
		}
	};
	Object.addObj=function(o,a){
		for(key in a){
			o.key = a[key];
		}
		return o;
	};
	Object.insertObjIndex=function(o,a,b){
		if(Ext.isNumber(b)){
			Object.addObj(o,a);
		}else{
			var index=0;
			var returnV={};
			for(keys in o){
				if(index==b){
					for(key in a){
						returnV.key = a[key];
					}
				}
				returnV.keys=o[keys];
			}
			o=returnV;
			return o;	
		}
	};
	Object.insertObjKey=function(o,a,b){
		if(!Ext.isString(b)){
			Object.addObj(o,a);
		}else{
			var returnV={};
			for(keys in o){
				if(keys==b){
					for(key in a){
						returnV.key = a[key];
					}
				}
				returnV.keys=o[keys];
			}
			o=returnV;
			return o;	
		}
	
	};
	Object.removeObj=function(o,a){
		if(Ext.isArray(a)){
			var returnV={};
			for(key in o){
				var f=false;
				for(var i=0;i<a.length;a++){
					if(key==a[i]){
						f=true;
					}
				}
				if(!f){
					returnV.key=o[key];
				}
			}
			o=returnV;
			return o;
		}else{
			return o;
		}
	};
	Ext.apply(Number.prototype,{
		coding : function(){
			return Ext.encode(this.valueOf());
		}
	});
	Ext.apply(Function.prototype,{
		coding : function(){
			return this.toString();
		}
	});
	Ext.apply(Date.prototype,{
		coding : function(){
			return Ext.encode(this);
		}
	});
	Ext.apply(Boolean.prototype,{
		coding : function(){
			return Ext.encode(this.valueOf());
		}
	});
})();
	