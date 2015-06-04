/**
 * @par dataStr format:'yyyy-MM-dd hh:mm:ss.ms'
 * @return Date Object.
 */
function toDateTime(dateStr){
    var result = new Date();
    result.setFullYear(dateStr.substring(0,4));
    var month = dateStr.substring(5,7);
    var monthInt = parseInt(month,10);
    monthInt--;
    if(monthInt<0){
        monthInt = 11;
    }
    result.setMonth(monthInt);
    result.setDate(dateStr.substring(8,10));
    result.setHours(dateStr.substring(11,13));
    result.setMinutes(dateStr.substring(14,16));
    result.setSeconds(dateStr.substring(17,19));
    return result;
}

Ext.ensible.sample.CalendarStore = Ext.extend(Ext.data.Store, {
    constructor: function(config){
        config = Ext.applyIf(config || {}, {
            storeId: 'calendarStore',
            root: 'calendars',
            idProperty: Ext.ensible.cal.CalendarMappings.CalendarId.mapping || 'id',
            proxy: new Ext.data.MemoryProxy(),
            autoLoad: true,
            fields: Ext.ensible.cal.CalendarRecord.prototype.fields.getRange()
        });
        this.reader = new Ext.data.JsonReader(config);
        Ext.ensible.sample.CalendarStore.superclass.constructor.call(this, config);
    }
});

Ext.ns("Com.yucheng.crm.index");

Com.yucheng.crm.CalendarPanelCust = Ext.extend(Ext.ensible.cal.CalendarPanel, {
	theChoseDate:'',//记录当前选中的日期，用于重新选择之后清楚当前这一天的特殊格式
    // private
    initComponent : function(){
        this.tbar = {
            cls: 'ext-cal-toolbar',
            border: true,
            items: []
        };
        var _this = this;
        this.theChoseDate = new Date().format('Ymd');//默认为今天
        this.viewCount = 0;
        this.showDayView =false;
		this.showMultiDayView =false;
		this.showWeekView = false;
		this.showMultiWeekView = false;
		this.showMonthView = true;
        
        var multiDayViewCount = (this.multiDayViewCfg && this.multiDayViewCfg.dayCount) || 3,
            multiWeekViewCount = (this.multiWeekViewCfg && this.multiWeekViewCfg.weekCount) || 2;
        
        if(this.showNavToday){
            this.tbar.items.push({
                id: this.id+'-tb-today', text: this.todayText, handler: this.onTodayClick, scope: this
            });
        }
        if(this.showNavNextPrev){
            this.tbar.items.push([
                {id: this.id+'-tb-prev', handler: this.onPrevClick, scope: this, iconCls: 'x-tbar-page-prev'},
                {id: this.id+'-tb-next', handler: this.onNextClick, scope: this, iconCls: 'x-tbar-page-next'}
            ]);
        }
        if(this.showNavJump){
            this.tbar.items.push([
                this.jumpToText,
                {id: this.id+'-tb-jump-dt', xtype: 'datefield', showToday: false
                	,listeners:{
                	'select': function(){
                		_this.onJumpClick();
                	}
                }
                }
//                ,{id: this.id+'-tb-jump', text: this.goText, handler: this.onJumpClick, scope: this}
            ]);
        }
        
        this.tbar.items.push('->');
        
        if(this.showDayView){
            this.tbar.items.push({
                id: this.id+'-tb-day', text: this.dayText, handler: this.onDayNavClick, scope: this, toggleGroup: this.id+'-tb-views'
            });
            this.viewCount++;
        }
        if(this.showMultiDayView){
            var text = String.format(this.getMultiDayText(multiDayViewCount), multiDayViewCount);
            this.tbar.items.push({
                id: this.id+'-tb-multiday', text: text, handler: this.onMultiDayNavClick, scope: this, toggleGroup: this.id+'-tb-views'
            });
            this.viewCount++;
        }
        if(this.showWeekView){
            this.tbar.items.push({
                id: this.id+'-tb-week', text: this.weekText, handler: this.onWeekNavClick, scope: this, toggleGroup: this.id+'-tb-views'
            });
            this.viewCount++;
        }
        if(this.showMultiWeekView){
            var text = String.format(this.getMultiWeekText(multiWeekViewCount), multiWeekViewCount);
            this.tbar.items.push({
                id: this.id+'-tb-multiweek', text: text, handler: this.onMultiWeekNavClick, scope: this, toggleGroup: this.id+'-tb-views'
            });
            this.viewCount++;
        }
        if(this.showMonthView || this.viewCount == 0){
            this.tbar.items.push({
                id: this.id+'-tb-month',hidden:true, text: this.monthText, handler: this.onMonthNavClick, scope: this, toggleGroup: this.id+'-tb-views'
            });
            this.viewCount++;
//            this.showMonthView = true;
        }
        
        var idx = this.viewCount-1;
        this.activeItem = this.activeItem === undefined ? idx : (this.activeItem > idx ? idx : this.activeItem);
        
        if(this.showNavBar === false){
            delete this.tbar;
            this.addClass('x-calendar-nonav');
        }
        
        Ext.ensible.cal.CalendarPanel.superclass.initComponent.call(this);
        
        this.addEvents({
            /**
             * @event eventadd
             * Fires after a new event is added to the underlying store
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The new {@link Ext.ensible.cal.EventRecord record} that was added
             */
            eventadd: true,
            /**
             * @event eventupdate
             * Fires after an existing event is updated
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The new {@link Ext.ensible.cal.EventRecord record} that was updated
             */
            eventupdate: true,
            /**
             * @event beforeeventdelete
             * Fires before an event is deleted by the user. This is a cancelable event, so returning false from a handler 
             * will cancel the delete operation.
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that was deleted
             * @param {Ext.Element} el The target element
             */
            beforeeventdelete: true,
            /**
             * @event eventdelete
             * Fires after an event is deleted by the user.
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that was deleted
             * @param {Ext.Element} el The target element
             */
            eventdelete: true,
            /**
             * @event eventcancel
             * Fires after an event add/edit operation is canceled by the user and no store update took place
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The new {@link Ext.ensible.cal.EventRecord record} that was canceled
             */
            eventcancel: true,
            /**
             * @event viewchange
             * Fires after a different calendar view is activated (but not when the event edit form is activated)
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.CalendarView} view The view being activated (any valid {@link Ext.ensible.cal.CalendarView CalendarView} subclass)
             * @param {Object} info Extra information about the newly activated view. This is a plain object 
             * with following properties:<div class="mdetail-params"><ul>
             * <li><b><code>activeDate</code></b> : <div class="sub-desc">The currently-selected date</div></li>
             * <li><b><code>viewStart</code></b> : <div class="sub-desc">The first date in the new view range</div></li>
             * <li><b><code>viewEnd</code></b> : <div class="sub-desc">The last date in the new view range</div></li>
             * </ul></div>
             */
            viewchange: true,
            /**
             * @event editdetails
             * Fires when the user selects the option to edit the selected event in the detailed edit form
             * (by default, an instance of {@link Ext.ensible.cal.EventEditForm}). Handling code should hide the active
             * event editor and transfer the current event record to the appropriate instance of the detailed form by showing it
             * and calling {@link Ext.ensible.cal.EventEditForm#loadRecord loadRecord}.
             * @param {Ext.ensible.cal.CalendarPanel} this The CalendarPanel
             * @param {Ext.ensible.cal.CalendarView} view The currently active {@link Ext.ensible.cal.CalendarView CalendarView} subclass
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} that is currently being edited
             * @param {Ext.Element} el The target element
             */
            editdetails: true
            
            
            //
            // NOTE: CalendarPanel also relays the following events from contained views as if they originated from this:
            //
            
            /**
             * @event eventsrendered
             * Fires after events are finished rendering in the view
             * @param {Ext.ensible.cal.CalendarPanel} this 
             */
            /**
             * @event eventclick
             * <p>Fires after the user clicks on an event element.</p>
             * <p><strong>NOTE:</strong> This version of <code>eventclick</code> differs from the same event fired directly by
             * {@link Ext.ensible.cal.CalendarView CalendarView} subclasses in that it provides a default implementation (showing
             * the default edit window) and is also cancelable (if a handler returns <code>false</code> the edit window will not be shown).
             * This event when fired from a view class is simply a notification that an event was clicked and has no default behavior.
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that was clicked on
             * @param {HTMLNode} el The DOM node that was clicked on
             */
            /**
             * @event rangeselect
             * Fires after the user drags on the calendar to select a range of dates/times in which to create an event
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Object} dates An object containing the start (StartDate property) and end (EndDate property) dates selected
             * @param {Function} callback A callback function that MUST be called after the event handling is complete so that
             * the view is properly cleaned up (shim elements are persisted in the view while the user is prompted to handle the
             * range selection). The callback is already created in the proper scope, so it simply needs to be executed as a standard
             * function call (e.g., callback()).
             */
            /**
             * @event eventover
             * Fires anytime the mouse is over an event element
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that the cursor is over
             * @param {HTMLNode} el The DOM node that is being moused over
             */
            /**
             * @event eventout
             * Fires anytime the mouse exits an event element
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that the cursor exited
             * @param {HTMLNode} el The DOM node that was exited
             */
            /**
             * @event beforedatechange
             * Fires before the start date of the view changes, giving you an opportunity to save state or anything else you may need
             * to do prior to the UI view changing. This is a cancelable event, so returning false from a handler will cancel both the
             * view change and the setting of the start date.
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Date} startDate The current start date of the view (as explained in {@link #getStartDate}
             * @param {Date} newStartDate The new start date that will be set when the view changes
             * @param {Date} viewStart The first displayed date in the current view
             * @param {Date} viewEnd The last displayed date in the current view
             */
            /**
             * @event dayclick
             * Fires after the user clicks within a day/week view container and not on an event element
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Date} dt The date/time that was clicked on
             * @param {Boolean} allday True if the day clicked on represents an all-day box, else false.
             * @param {Ext.Element} el The Element that was clicked on
             */
            /**
             * @event datechange
             * Fires after the start date of the view changes
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Date} startDate The start date of the view (as explained in {@link #getStartDate}
             * @param {Date} viewStart The first displayed date in the view
             * @param {Date} viewEnd The last displayed date in the view
             */
            /**
             * @event beforeeventmove
             * Fires before an event element is dragged by the user and dropped in a new position. This is a cancelable event, so 
             * returning false from a handler will cancel the move operation.
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that will be moved
             */
            /**
             * @event eventmove
             * Fires after an event element is dragged by the user and dropped in a new position
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that was moved with
             * updated start and end dates
             */
            /**
             * @event initdrag
             * Fires when a drag operation is initiated in the view
             * @param {Ext.ensible.cal.CalendarPanel} this
             */
            /**
             * @event dayover
             * Fires while the mouse is over a day element 
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Date} dt The date that is being moused over
             * @param {Ext.Element} el The day Element that is being moused over
             */
            /**
             * @event dayout
             * Fires when the mouse exits a day element 
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Date} dt The date that is exited
             * @param {Ext.Element} el The day Element that is exited
             */
            /**
             * @event beforeeventresize
             * Fires after the user drags the resize handle of an event to resize it, but before the resize operation is carried out.
             * This is a cancelable event, so returning false from a handler will cancel the resize operation. <strong>NOTE:</strong>
             * This event is only fired from views that support event resizing.
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that was resized
             * containing the updated start and end dates
             */
            /**
             * @event eventresize
             * Fires after the user drags the resize handle of an event and the resize operation is complete. <strong>NOTE:</strong>
             * This event is only fired from views that support event resizing.
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that was resized
             * containing the updated start and end dates
             */
        });
        
        this.layout = 'card'; // do not allow override
        this.addClass('x-cal-panel');
        
        if(this.eventStore){
            this.store = this.eventStore;
            delete this.eventStore;
        }
        this.setStore(this.store);
        
        var sharedViewCfg = {
            showToday: this.showToday,
            todayText: this.todayText,
            showTodayText: this.showTodayText,
            showTime: this.showTime,
            readOnly: this.readOnly,
            enableRecurrence: this.enableRecurrence,
            store: this.store,
            calendarStore: this.calendarStore,
            editModal: this.editModal,
            enableEditDetails: this.enableEditDetails,
            ownerCalendarPanel: this
        };
        
        if(this.showDayView){
            var day = Ext.apply({
                xtype: 'extensible.dayview',
                title: this.dayText
            }, sharedViewCfg);
            
            day = Ext.apply(Ext.apply(day, this.viewConfig), this.dayViewCfg);
            day.id = this.id+'-day';
            this.initEventRelay(day);
            this.add(day);
        }
        if(this.showMultiDayView){
            var mday = Ext.apply({
                xtype: 'extensible.multidayview',
                title: this.getMultiDayText(multiDayViewCount)
            }, sharedViewCfg);
            
            mday = Ext.apply(Ext.apply(mday, this.viewConfig), this.multiDayViewCfg);
            mday.id = this.id+'-multiday';
            this.initEventRelay(mday);
            this.add(mday);
        }
        if(this.showWeekView){
            var wk = Ext.applyIf({
                xtype: 'extensible.weekview',
                title: this.weekText
            }, sharedViewCfg);
            
            wk = Ext.apply(Ext.apply(wk, this.viewConfig), this.weekViewCfg);
            wk.id = this.id+'-week';
            this.initEventRelay(wk);
            this.add(wk);
        }
        if(this.showMultiWeekView){
            var mwk = Ext.applyIf({
                xtype: 'extensible.multiweekview',
                title: this.getMultiWeekText(multiWeekViewCount)
            }, sharedViewCfg);
            
            mwk = Ext.apply(Ext.apply(mwk, this.viewConfig), this.multiWeekViewCfg);
            mwk.id = this.id+'-multiweek';
            this.initEventRelay(mwk);
            this.add(mwk);
        }
        if(this.showMonthView){
            var month = Ext.applyIf({
                xtype: 'extensible.monthview',
                title: this.monthText//,
//                listeners: {
//                    'weekclick': {
//                        fn: function(vw, dt){
//                            this.showWeek(dt);
//                        },
//                        scope: this
//                    }
//                }
            }, sharedViewCfg);
            month = Ext.apply(Ext.apply(month, this.viewConfig), this.monthViewCfg);
            month.id = this.id+'-month';
            this.initEventRelay(month);
            this.add(month);
        }

        
        
    }  
});

Ext.reg('CalendarPanelCust', Com.yucheng.crm.CalendarPanelCust);

Ext.override(Ext.ensible.cal.CalendarView,{
	onDayClick:function(c, b, a){
		//去掉原当前日期的特殊格式
		var theChoseDateId = a.id.substring(0,a.id.length-8)+this.ownerCt.theChoseDate;
		if(document.getElementById(theChoseDateId))
		document.getElementById(theChoseDateId).className="ext-cal-day";
		//重新设置当前日期
		this.ownerCt.theChoseDate = c.format('Ymd');
		a.addClass("ext-cal-day-chose ");//选中的一天添加红框
		if(this.ownerCt.ownerCt.ownerCt.ifShowContent){
			this.ownerCt.ownerCt.ownerCt.moveGrid.removeContent();
			this.ownerCt.ownerCt.ownerCt.moveGrid.initContent(c.format('Y-m-d'));
		}
		
		
	}
});

Ext.override(Ext.ensible.cal.CalendarPanel,{
	onTodayClick:function() {
		this.startDate = this.layout.activeItem.moveToday(true);
		this.updateNavState();
		this.fireViewChange();
		if(this.ownerCt.ownerCt.ifShowContent){
			this.ownerCt.ownerCt.moveGrid.removeContent();
			this.ownerCt.ownerCt.moveGrid.initContent(this.startDate.format('Y-m-d'));
		}
		this.theChoseDate = this.startDate.format('Ymd');
	},
	onJumpClick : function() {
		var a = Ext.getCmp(this.id + "-tb-jump-dt").getValue();
		if (a !== "") {
			this.startDate = this.layout.activeItem.moveTo(a,
					true);
			this.updateNavState();
			this.fireViewChange();
			if(this.ownerCt.ownerCt.ifShowContent){
				this.ownerCt.ownerCt.moveGrid.removeContent();
				this.ownerCt.ownerCt.moveGrid.initContent(this.startDate.format('Y-m-d'));
			}
			this.theChoseDate = this.startDate.format('Ymd');
			
		}
	},
	onPrevClick : function() {
		this.startDate = this.layout.activeItem.movePrev(true);
		this.updateNavState();
		this.fireViewChange();
		if(this.ownerCt.ownerCt.ifShowContent){
			this.ownerCt.ownerCt.moveGrid.removeContent();
			this.ownerCt.ownerCt.moveGrid.initContent(this.startDate.format('Y-m-d'));
		}
		this.theChoseDate = this.startDate.format('Ymd');
		
	},
	onNextClick : function() {
		this.startDate = this.layout.activeItem.moveNext(true);
		this.updateNavState();
		this.fireViewChange();
		if(this.ownerCt.ownerCt.ifShowContent){
			this.ownerCt.ownerCt.moveGrid.removeContent();
			this.ownerCt.ownerCt.moveGrid.initContent(this.startDate.format('Y-m-d'));
		}
		this.theChoseDate = this.startDate.format('Ymd');
	}
});

//列表内容展示panel
Com.yucheng.crm.ContentPanel = Ext.extend(Ext.Panel, {
	height:100,
	width:300,
	bodyStyle:'background-color:#fff',    		
	frame:true,
	window:'',
	renderTo:Ext.getBody(),
	store:'',
	pramName:'date',
	showColumn:'title',
	html:"<div class='info_box' style='height:100px' id ='contentContainer' ><marquee id='content' onmouseover=stop(); onmouseout=start(); direction='up' " +
			"align='top' style='height:1px;' behavior='scroll' scrollamount=2>"
					    	+"</marquee></div>",
    
    
	//展示内容
	showContent:function(index,store,a){
		if(a.ownerCt)
			a.ownerCt.ownerCt.showContent(index,store);
	},	
	
	//创建展示内容window
	createContentWindow:function(){
		var _this = this;
			this.window = new  Ext.Window({
	            height:this.height*2,
	            width:this.width,
	            closable : false,
	            resizable:false,
	            frame:true,
	            bodyStyle:'background-color:#fff',    		
	            x:0,
	            y:0,
	            html:"<div class='info_box' style='height:100px' id ='contentDivContainer' ><marquee id='contentDiv' onmouseover=stop(); onmouseout=start(); direction='up' " +
	        		"align='top' style='height:1px;' behavior='scroll' scrollamount=2>"
	        		+"</marquee></div>",
	        	listeners: {
	         	    render : function(p) {
	         	       p.getEl().on('mouseout', _this.closeContentWindow);
	         	   }
	         	    }
	            });
			this.window.show();
			this.window.hide();
			//阻止子元素的冒泡
			Ext.fly('contentDivContainer').parent().on('mouseout',function(e){
				e.stopPropagation();
			});
	},
	
	
	
	//show展示内容window
	showContentWindow:function(){
		if(this.store.getCount()>parseInt(this.height/20)){//如果movegrid不用滚动则不需要出现窗口
			this.window.setPosition(this.ownerCt.ownerCt.getPosition()[0],
								   (this.getPosition()[1]-this.height)>0?this.getPosition()[1]-this.height:0
			);
			this.window.show();
		}
	},
	//hide展示内容window
	closeContentWindow:function (){
		Ext.getCmp(this.id).hide();
	},
	
	//将内容写成链接				    	
	putContent: function(){
		var count1 = parseInt(this.height/20);//计算panel可以摆放的a标签个数
		var count2 = parseInt(this.height/10);//计算window可以摆放的a标签个数
		var contentContainer,contentDivContainer;
		if(count2<this.store.getCount()){//都滚动
			document.getElementById('content').style.height = this.height;
			document.getElementById('contentDiv').style.height = this.height*2;
			document.getElementById('contentDiv').style.width = this.width*0.7;
			contentContainer = 'content';
			contentDivContainer = 'contentDiv';	
		}else if(count1<this.store.getCount()&&count2>=this.store.getCount() ){//只panel滚动
			document.getElementById('content').style.height = this.height;
			document.getElementById('contentDiv').style.height = '1px';
			contentContainer = 'content';
			contentDivContainer = 'contentDivContainer';
		}else{//都不滚动
			document.getElementById('content').style.height = '1px';
			document.getElementById('contentDiv').style.height = '1px';
			contentContainer = 'contentContainer';
			contentDivContainer = 'contentDivContainer';
		}
		if(this.store.getCount()>0){
			for(var i=0;i<=this.store.getCount()-1;i++){
				var si = new Com.yucheng.crm.Atag(
						this.store.getAt(i).get(this.showColumn),
						this.showContent,
						i,
						this.store,
						this,
						contentContainer,
						contentDivContainer);
			}
		}else{
			document.getElementById(contentContainer).innerHTML = "<div><font size='4' color = 'red'>无相关信息</font></div>";
		}
		
		
	},
	
	//初始化内容
	initContent : function(time){
		var _this = this ;
		if(time==null||time=='')
			time = (new Date()).format('Y-m-d');
		var urlStr = this.store.proxy.url;
		if(urlStr.indexOf('?')!=-1){
			urlStr = urlStr.substring(0,urlStr.indexOf('?'));
		}
		this.store.proxy = new  Ext.data.HttpProxy({url: urlStr+'?'+this.pramName+'='+time });
		this.store.load({
			callback:function(){
				_this.putContent();
			}
		});
	},
	
	//清除内容
	removeContent:function(){
		this.store.removeAll();
		document.getElementById('contentContainer').innerHTML="<marquee id='content' onmouseover=stop(); onmouseout=start(); direction='up' " +
    		"align='top' style='height:1px;' behavior='scroll' scrollamount=2>"
    		+"</marquee>";
		document.getElementById('contentDivContainer').innerHTML="<marquee id='contentDiv' onmouseover=stop(); onmouseout=start(); direction='up' " +
    		"align='top' style='height:1px;' behavior='scroll' scrollamount=2>"
    		+"</marquee>";
	},
	
	afterRender : function() {
		var _this = this;
		this.createContentWindow();
		this.initContent();
		Ext.fly(this.id).on('mouseover',function(){
			_this.showContentWindow();
		});
	}
});




Com.yucheng.crm.CalendarPanelCommon = Ext.extend(Ext.Panel, {
	height:300,
	width:300,
	ifShowContent:true,//是否展示相关内容
	store:'',//相关信息存储
	pramName:'',//查询的参数名
	showColumn:'',//信息滚动部分展示的字段名
	title:'事件信息',//信息详细页面的title
	mapping:'',//信息展示的mapping
	toolbars:[],
	initComponent: function(){
		//firstPanel包含日历的panel和滚动内容部分的panel
		this.firstPanel = new Ext.Panel({
			id:this.id+'firstPanel',
			height:this.height,
			 width:this.width,
			 items:[]
		});
		  Ext.ensible.cal.CalendarMappings = {
		    		CalendarId:   {name:'ID', mapping: 'remindBelong', type: 'string'}, // int by default
		    		Title:        {name:'CalTitle', mapping: 'cal_title', type: 'string'},
		    		Description:  {name:'Desc', mapping: 'cal_desc', type: 'string'},
		    		ColorId:      {name:'Color', mapping: 'cal_color', type: 'int'},
		    		IsHidden:     {name:'Hidden', mapping: 'hidden', type: 'boolean'}
		    };
		    Ext.ensible.cal.CalendarRecord.reconfigure();
		    this.calendarStore = new Ext.ensible.sample.CalendarStore({
		    	data: Ext.ensible.sample.CalendarDataCustom
		    }); 
		    
		    this.eventStore = new Ext.ensible.cal.EventStore({
		    	proxy:new Ext.data.HttpProxy({
		        	api:{
		    		read:{
		    			url:basepath+'',
		    			method:'GET'
		    		},
		    		destroy:{
		    			 url: basepath+'',
		                 method: 'POST'
		    		},
		    		create:{
		    			 url: basepath+'',
		                 method: 'POST'
		    		},
		    		update:{
		    			 url: basepath+'',
		                 method: 'POST'
		    		}
		    	}
		    	})
		    });
		    
		if(this.ifShowContent){
			this.calenderHeight = this.height*0.7;
		}else{
			this.calenderHeight = this.height;
		}
		
		//日历panel
		this.calender = new Com.yucheng.crm.CalendarPanelCust({
			id:this.id+'calender',
			height:this.calenderHeight,
			width:this.width,
			theChoseDate:new Date().format('Ymd'),//默认为今天
			eventStore: this.eventStore,
	    	calendarStore:this.calendarStore,
	    	monthViewCfg : {
	    		showHeader : true,
	    		showWeekLinks : false,
	    		showWeekNumbers : false
	    	},
	    	viewConfig:{
	    		enableContextMenus : false
	    	},
	    	layout:'fit'
			
		});
		this.firstPanel.add(this.calender);
		
		if(this.ifShowContent){
			//滚动内容部分
	        this.moveGrid = new Com.yucheng.crm.ContentPanel({
	        	width:this.width,
				height:this.height*0.3,
				store:this.store,
				showColumn:this.showColumn,
				pramName:this.pramName,
				id:this.id+'moveGrid',
	        	 style:{
	     	        margin:'0px 0 0px 0'
	     	    },
	     	    frame:true

	        });
	        this.firstPanel.add(this.moveGrid);
		}
        
        this.add(this.firstPanel);
        
        
        this.contentSet = new Ext.form.FieldSet( {
    		xtype : 'fieldset',
    		title:this.title,
    		collapsible : false,
    		autoScroll : true,
    		labelWidth : 80, // 标签宽度
    		items : []
    	});
        
        //根据mapping画出信息展示页面
        for(var i=0;i<this.mapping.length;i++){
        	var temp = this.mapping[i];
        	if(temp.type == 'text')
	        	this.contentSet.add(
	        			new Ext.form.TextField({
	        				name : temp.name,
	        				fieldLabel : temp.fieldLabel,
	        				hidden:temp.ifHide,
	        				anchor : "90%"
				}));
        	else if(temp.type == 'area'){
        		this.contentSet.add(
	        			new Ext.form.TextArea({
	        				name : temp.name,
	        				fieldLabel : temp.fieldLabel,
	        				hidden:temp.ifHide,
	        				anchor : "90%"
				}));
        	}
        }
        
        //内容展示部分
        this.secondPanel = new Ext.form.FormPanel({
        	id:this.id+'secondPanel',
        	height:this.height,
			width:this.width,
			frame : true,
			hidden:true,
			items:[this.contentSet],
			buttonAlign : 'center',
				buttons : [{
					text : '上一条',
					iconCls: 'x-tbar-page-prev',
					handler : function() {
						this.ownerCt.ownerCt.ownerCt.doPrev();
					}
				},{
					text : '返回',
					handler : function() {
						this.ownerCt.ownerCt.ownerCt.doBack();
					}
				},{
					text : '下一条',
					iconCls: 'x-tbar-page-next',
					handler : function() {
						this.ownerCt.ownerCt.ownerCt.doNext();
					}
				}]
        });
        
        this.add(this.secondPanel);
        
	},
	
	//展示内容
	showContent:function(index,store){
		var _this = this;
		this.moveGrid.window.hide();
		this.firstPanel.el.slideOut('l', {
		     easing: 'easeNone',
		     duration: .5,
		     callback:function(){
			    	_this.firstPanel.hide(); 
			    	_this.secondPanel.show(); 
			    	_this.secondPanel.el.slideIn('r',{
			    		 easing: 'easeNone',
					     duration: .5
			    	});
			     }
		 });
			this.index = index;
		   this.secondPanel.getForm().loadRecord(store.getAt(index));
		   if(store.getCount()==1){
			   this.secondPanel.buttons[0].setDisabled(true);
			   this.secondPanel.buttons[2].setDisabled(true); 
		   }
		   else if(index==0){
			   this.secondPanel.buttons[0].setDisabled(true);
			   this.secondPanel.buttons[2].setDisabled(false);
		   } else if(index==store.getCount()-1){
			   this.secondPanel.buttons[0].setDisabled(false);
			   this.secondPanel.buttons[2].setDisabled(true);
			   }else{
				   this.secondPanel.buttons[0].setDisabled(false);
				   this.secondPanel.buttons[2].setDisabled(false); 
			   }
		
	},
	
	//上一条
	 doPrev: function(){
		 this.index = this.index-1;
		 if(this.index==0){
			 this.secondPanel.buttons[0].setDisabled(true);
			 this.secondPanel.buttons[2].setDisabled(false);
		   }
		   else if(this.index==this.moveGrid.store.getCount()-1){
			   this.secondPanel.buttons[0].setDisabled(false);
			   this.secondPanel.buttons[2].setDisabled(true);
		   }
		   else{
			   this.secondPanel.buttons[0].setDisabled(false);
			   this.secondPanel.buttons[2].setDisabled(false); 
		   }
		 this.secondPanel.getForm().loadRecord(this.moveGrid.store.getAt(this.index));
		},
		
		//下一条
	doNext: function(){
		 this.index = this.index+1;
		 if(this.index==0){
			 this.secondPanel.buttons[0].setDisabled(true);
			 this.secondPanel.buttons[1].setDisabled(false);
		   }
		   else if(this.index==this.moveGrid.store.getCount()-1){
			   this.secondPanel.buttons[0].setDisabled(false);
			   this.secondPanel.buttons[2].setDisabled(true);
		   }
		   else{
			   this.secondPanel.buttons[0].setDisabled(false);
			   this.secondPanel.buttons[2].setDisabled(false); 
		   }
		 this.secondPanel.getForm().loadRecord(this.moveGrid.store.getAt(this.index));
		},
		
		//返回到日历页面
	doBack:function(){
//		滑入/滑出
//		slideIn( [String anchor], [Object options] ) : Ext.Element
//		slideOut( [String anchor], [Object options] ) : Ext.Element
//		anchor定义
//		tl     左上角(默认)
//		 t      上居中 
//		tr     右上角
//		 l      左边界的中央
//		 c      居中
//		 r      右边界的中央
//		 bl     左下角
//		 b      下居中
//		 br     右下角
		
//		 easing:String        行为方法   默认值是:easeOut
//		 easeNone:匀速
//		 easeIn:开始慢且加速
//		 easeOut:开始快且减速
//		 easeBoth:开始慢且减速
//		 easeInStrong:开始慢且加速,t的四次方
//		 easeOutStrong:开始快且减速,t的四次方
//		 easeBothStrong:开始慢且减速,t的四次方
		var _this = this;
		this.secondPanel.el.slideOut('l', {
		     easing: 'easeNone',
		     duration: .5,
		     callback:function(){
			    	_this.secondPanel.hide(); 
			    	_this.firstPanel.show(); 
			    	_this.firstPanel.el.slideIn('r',{
			    		 easing: 'easeNone',
					     duration: .5//时间，单位s
			    	});
			     }
		 });
		},
		
		
		//在内容展示form添加textfield或textarea
		addfeild:function(type,name,lable,ifHide){
			if(type=='text'){
				var field = new Ext.form.TextField({
					name : name,
					fieldLabel : lable,
					hidden:ifHide,
					anchor : "90%"
				});
			this.contentSet.add(field);	
			this.contentSet.doLayout();
				 
			}else if(type=='area'){
				var field = new Ext.form.TextArea({
					name : name,
					fieldLabel : lable,
					hidden:ifHide,
					anchor : "90%"
				});
				this.contentSet.add(field);	
				this.contentSet.doLayout();
			}else return;
			
		},
		
	 afterRender : function() {
		 document.getElementById(this.id).style.width=this.width;
		 document.getElementById(this.id).style.height=this.height;
		 
	 }
});
Ext.reg('CalendarPanelCommon', Com.yucheng.crm.CalendarPanelCommon);



//内容链接对象
Com.yucheng.crm.Atag = function(title,handler,index,store,a,contentContainer,contentDivContainer){
	var _this = this;
	_this.onClick = handler;
	_this.title = title;
	var tagA = document.createElement("a");
	tagA.innerHTML = "<font size='4'>"+title+"</font>";
	tagA.onclick = function(){
		if(Ext.isFunction(_this.onClick))
			_this.onClick(index,store,a);
	};
	
	_this.iconEl = document.createElement("div");
	if(_this.id)
		_this.iconEl.id = _this.id;
	_this.iconEl.title = _this.title;
	_this.iconEl.style.cursor = 'hand';
	_this.iconEl.style.height = '20px';
	
	_this.iconEl.appendChild(tagA);
	
	var tagA1 = document.createElement("a");
	tagA1.innerHTML = "<font size='4'>"+title+"</font>";
	tagA1.onclick = function(){
		if(Ext.isFunction(_this.onClick))
			_this.onClick(index,store,a);
	};
	
	_this.iconEl1 = document.createElement("div");
	if(_this.id)
		_this.iconEl1.id = _this.id;
	_this.iconEl1.title = _this.title;
	_this.iconEl1.style.cursor = 'hand';
	_this.iconEl1.style.height = '20px';
	
	_this.iconEl1.appendChild(tagA1);
	document.getElementById(contentContainer).appendChild(_this.iconEl);
	document.getElementById(contentDivContainer).appendChild(_this.iconEl1);
};


if(Com.yucheng.crm.CalendarPanelCust) {
    Ext.apply(Com.yucheng.crm.CalendarPanelCust.prototype, {
        todayText: '今日',
        dayText: '日',
        weekText: '星期',
        monthText: '月',
        jumpToText: '<b>选择日期：</b>',
        goText: '<b>转到</b>',
        multiDayText: '{0}天',
        multiWeekText: '{0}星期',
        getMultiDayText: function(numDays){
            return '{0}天';
        },
        getMultiWeekText: function(numWeeks){
            return '{0}星期';
        }
    });
}

if(Ext.ensible.cal.BoxLayoutTemplate) {
    Ext.apply(Ext.ensible.cal.BoxLayoutTemplate.prototype, {
        firstWeekDateFormat: 'D j',
        otherWeeksDateFormat: 'j',
        singleDayDateFormat: 'l, F j, Y',
        multiDayFirstDayFormat: 'm,j',//格式为09,28
        multiDayMonthStartFormat: 'm,j'
    });
}
