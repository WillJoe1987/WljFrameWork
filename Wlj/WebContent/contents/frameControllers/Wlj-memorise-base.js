Ext.ns('Wlj.memorise');
Wlj.memorise.Tile = function(){
	this.tiles = new Ext.util.MixedCollection();
	this.tilesData = new Ext.util.MixedCollection();
	var _this = this;
	this.tiles.on('add',function(){
		_this.onAdd();
	});
	this.tiles.on('remove',function(){
		_this.renderIndex --;
	});
	this.tilesData.on('add',function(){
		_this.onAddData();
	});
	this.tilesData.on('remove',function(){
		_this.dataLoadIndex --;
	});
	Wlj.memorise.Tile.superclass.constructor.call(this);
	this.renderIndex = 0;
	this.dataLoadIndex = 0;
	this.loading = false;
	this.dataLoading = false;
};

Ext.extend(Wlj.memorise.Tile, Ext.util.Observable, {
	addTile : function(tile){
		this.tiles.add(tile);
	},
	addDataCfg : function(cfg){
		this.tilesData.add(cfg);
	},
	loadJs : function(){
		var _this = this;
		_this.loading = true;
		var tile = _this.tiles.itemAt(_this.renderIndex);
		if(!tile){
			_this.loading = false;
			_this.loadData();
			return false;
		}else{
			if(!tile.jsUrl || !tile.tileSize){
				_this.renderIndex++;
				_this.loadJs();
			}else{
				var vs = tile.el.getViewSize(false);
				Ext.Ajax.request({
					method:'get',
					url : basepath + tile.jsUrl,
					success : function(response){
						tile.removeAll();
						tile.contentObject = window.eval ? window.eval(response.responseText) : window.execScript(response.responseText);
						if(tile.contentObject){
							if(Ext.isArray(tile.contentObject)){
								Ext.each(tile.contentObject,function(tc){
									tc.setSize(vs.width, vs.height);
								});
							}else{
								tile.contentObject.setSize(vs.width, vs.height);
							}
							tile.add(tile.contentObject);
							tile.doLayout();
						}
						_this.renderIndex++;
						_this.loadJs();
					},
					failure : function(response){
						_this.renderIndex++;
						_this.loadJs();
					}
				});
			}
		}
	},
	
	loadData : function(){
		var _this = this;
		_this.dataLoading = true;
		var dataCfg = _this.tilesData.itemAt(_this.dataLoadIndex);
		if(!dataCfg){
			_this.dataLoading = false;
			return false;
		} else {
			function cb(responseText){
				
				_this.dataLoadIndex ++;
				if(Ext.isFunction(dataCfg.dataCb)){
					dataCfg.dataCb.call(dataCfg.controlPanel,dataCfg.controlPanel, responseText);
				}
				_this.loadData();
			}
			if(dataCfg.store){
				dataCfg.store.load({
					params : {
						start : 0,
						limit : dataCfg.controlPanel.dataSize?dataCfg.controlPanel.dataSize:7
					},
					callback : function(){
						cb();
					}
				});
			}else {
				Ext.apply(dataCfg,{
					success : function(response){
						cb(response.responseText);
					},
					failure : function(){
						cb();
					}
				});
				Ext.Ajax.request(dataCfg);
			}
		}
	},
	onAddData : function(cfg){
		var _this = this;
		if(_this.loading){
			return;
		}else {
			if(_this.dataLoading){
				return;
			}else {
				_this.loadData();
			}
		}
	},
	onAdd : function(tile){
		var _this = this;
		if(_this.loading){
			return;
		}else{
			_this.loadJs();
		}
	},
	getTileBy : function(property, value){
		
	}
});

Wlj.memorise.TileController = new Wlj.memorise.Tile();
Wlj.TileMgr = Wlj.memorise.TileController;

/**任务管理器**/
Wlj.memorise.Task = function(){
	this.taskIdGen = 'task_tile_';
	this.tasks = new Ext.util.MixedCollection();
	var _this = this;
	this.tasks.on('add',function(index,task,key){
		_this.onAddTask(task);
	});
};
Ext.extend(Wlj.memorise.Task, Ext.util.Observable, {
	
	addTask : function(task){
		this.tasks.add(task);
	},
	removeTask : function(task){
		if(this.windowObject){
			var tile = this.windowObject.get(this.taskIdGen+task.id);
			if(tile){
				tile.ownerCt.remove(tile,true);
			}
		}
		this.tasks.remove(task);
	},
	getTask : function(id){
		return this.tasks.get(id);
	},
	onAddTask : function(task){
		this.toFront();
		if(this.windowObject){
			this.windowObject.add(this.createTaskTile(task,false));
			this.windowObject.doLayout();
		}
	},
	toFront : function(){
		if(this.windowObject){
			this.windowObject.toFront();
		}
	},
	createTaskTile : function(task,delay){
		var _this = this;
		var onetile = new Wlj.widgets.search.tile.Tile({
			id : _this.taskIdGen+task.id,
			cls : 'tile_c1',
			baseMargin : 2,
			ownerW :  10,
			ownerH : 20,
			baseSize :  686-4,
			baseHeight : 34,
			baseWidth : 20,
			taskObject : task,
			pos_size : {
				TX : 0,
				TY : _this.tasks.indexOf(task),
				TH : 1,
				TW : 1
			},
			html : '<br>&nbsp;'+task.name,
			listeners : {
				afterrender : function(t){
					var delayTime = delay ? (t.ownerCt.items.indexOf(t))*150 : 0;
					setTimeout(function(){
						t.el.animate({
							width : {
								from : 20,
								to : 686-4
							}
							
						},.35,
						null,
						'easeOut',
						'run');
					},delayTime);
				}
			},
			removeThis : function(){
				
				var index = this.ownerCt.items.indexOf(this);
				var ownerCt = this.ownerCt;
				this.ownerCt.remove(this,true);
				for(var i=index;i<ownerCt.items.getCount();i++){
					var item = ownerCt.items.itemAt(i);
					item.moveToPoint({
						x : item.pos_size.TX,
						y : item.pos_size.TY - 1
					});
				}
				task.close();
			}
		});
		return onetile;
	},
	
	showTasks : function(){
		var _this = this;

		if(this.windowObject){
			this.windowObject.toFront(true);
			return;
		}

		function createTaskTiles(){
			var tiles = [];
			_this.tasks.each(function(task){
				tiles.push(_this.createTaskTile(task,true));
			});
			return tiles;
		}
		this.windowObject = new Ext.Window({
			id : '_TASK_MANAGER',
			top:200,
			left:200,
			title : '任务管理器',
			height : 400,
			width : 700,
			appObject : _APP,
			manager : _APP.taskBar.windowManager
		});
		this.windowObject.on('show',function(window){
			window.add(createTaskTiles());
			window.doLayout();
		});
		this.windowObject.on('close',function(window){
			_this.windowObject = false;
		});
		this.windowObject.show();
	}
});

Wlj.memorise.TaskController = new Wlj.memorise.Task();
Wlj.TaskMgr = Wlj.memorise.TaskController;

Wlj.memorise.Service = function(){
	this.services = new Ext.util.MixedCollection();
};
Ext.extend(Wlj.memorise.Service, Ext.util.Observable, {
	
	addService : function(service){
		this.services.add(service);
	},
	removeService : function(service){
		/**
		 * TODO a remove service logic;
		 */
	},
	stopService : function(service){
		/**
		 * TODO a stop service logic;
		 */
	},
	createServiceWindow : function(){
		var _this = this;
		var cols = parseInt(_this.services.getCount()/7)+1;
		function createServiceItem(){
			var items = [];
			_this.services.each(function(ser){
				var index = _this.services.indexOf(ser);
				var ty = parseInt(index/7);
				var tx = parseInt(index%7);
				var item = new Wlj.widgets.search.service.PageServiceItem({
					ownerH : 20,
					ownerW : 100,
					serviceObject : ser
				});
				items.push(item);
			});
			return items;
		}
		
		this.serviceWindow = new Ext.Window({
			maximized : true,
			closeAction : 'hide',
			autoScroll : true,
			title : '服务管理器',
			items : [new Wlj.widgets.search.service.PageServiceContainer({
				width : 68 * cols,
				items : createServiceItem()
			})],
			listeners: {
				hide : function(){
					Ext.getBody().unmask();
				}
			}
		});
	},
	showServiceWindow : function(){
		if(!this.serviceWindow){
			this.createServiceWindow();
		}
		Ext.getBody().mask();
		this.serviceWindow.show();
		this.serviceWindow.el.setOpacity(.9);
	},
	findServiceByID : function(id){
		return this.services.get('service_'+id);
	}
});

Wlj.memorise.ServiceController = new Wlj.memorise.Service();
Wlj.ServiceMgr = Wlj.memorise.ServiceController;