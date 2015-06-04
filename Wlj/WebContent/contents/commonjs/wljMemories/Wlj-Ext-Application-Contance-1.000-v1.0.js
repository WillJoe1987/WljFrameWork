Wlj = {
	version: '1.0.0',
	versionDetail : {
        major : 1,
        minor : 0,
        patch : 0
    }
};
Ext.ns('Wlj.ext.app');
Wlj.ext.app.base_c_loaction=basepath+'/BIZS';
Wlj.ext.app.PrintedObject = {};
Wlj.ext.app.PrintedStore = {};
Wlj.ext.app.CurrentURL = '';

/**
 * 获取当前页面根容器
 */
Wlj.getCurrentRoots = function(){ 
	var co = Wlj.ext.app.PrintedObject[Wlj.ext.app.CurrentURL];
	var roots = new Array();
	Ext.each(co,function(o){
		if(o.getXType()!=="quicktip"){
			if(!o.ownerCt){
				roots.push(o);
			}else if(co.indexOf(o.ownerCt)<0){
				roots.push(o);
			}
		}
	});
	return roots;
};

Wlj.getFileRoots = function(file){
	var co = Wlj.ext.app.PrintedObject[file];
	var roots = new Array();
	Ext.each(co,function(o){
		if(o.getXType()!=="quicktip"){
			if(!o.ownerCt){
				roots.push(o);
			}else if(co.indexOf(o.ownerCt)<0){
				roots.push(o);
			}
		}
	});
	return roots;
};

/**
 * 获取当前页面数据源对象
 */
Wlj.getCurrentStores = function(){
	return Wlj.ext.app.PrintedStore[Wlj.ext.app.CurrentURL];
};
Wlj.getFileStores = function(file){
	return Wlj.ext.app.PrintedStore[file];
};