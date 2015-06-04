
WLJUTIL.BUTTON_TYPE = {};
WLJUTIL.conditionButtons = {};
url = basepath + '/loanfhkplan.json';

fields = [{name:'ID',text:'序号'},
{name:'CONT_ID',text:'合同编号',searchField : true,cAllowBlank:false},
{name:'HK_TEAM_NO',text:'还款期'},
{name:'PLAN_DATE',text:'计划还款日期'},
{name:'EXE_DATE',text:'执行还款日期'},
{name:'ACT_DATE',text:'实际还款日'},
{name:'XYGL_RATE',text:'信用管理费率'},
{name:'Y_XYGL',text:'应收信用管理费'},
{name:'S_XYGL',text:'实收信用管理费'},
{name:'R_XYGL',text:'减免后信用管理费'},
{name:'C_XYGL',text:'差额信用管理费'},
{name:'XGZNJ_RATE',text:'信用管理费滞纳金率'},
{name:'Y_XGZNJ',text:'应收信用管理费滞纳金'},
{name:'S_XGZNJ',text:'实收信用管理费滞纳金'},
{name:'R_XGZNJ',text:'减免后应收信用管理费滞纳金'},
{name:'C_XGZNJ',text:'差额信用管理费滞纳金'},
{name:'EXE_DUE_DAYS',text:'执行逾期天数'},
{name:'PLAN_DUE_DAYS',text:'计息逾期天数'},
{name:'DUE_RATE',text:'逾期利息率'},
{name:'Y_DUE_INT',text:'应收逾期利息费'},
{name:'S_DUE_INT',text:'实收逾期利息费'},
{name:'R_DUE_INT',text:'减免后应收逾期利息费'},
{name:'C_DUE_INT',text:'差额逾期利息费'},
{name:'C_TOTAL_FEE',text:'差额总费用'},
{name:'Y_BJ',text:'应还本金'},
{name:'S_BJ',text:'实收本金'},
{name:'Y_INT',text:'应收利息'},
{name:'S_INT',text:'实收利息'},
{name:'REF',text:'参考值'},
{name:'TODO_AMT',text:'当期应还金额'},
{name:'DONE_AMT',text:'当期实收金额'},
{name:'CHA_AMT',text:'当期实收金额'},
{name:'HK_STAT',text:'还款状态（正常、逾期）'},
{name:'MEMO',text:'还款状态（正常、逾期）'}];

autoLoadGrid = false;
needCondition = true;

searchDomainCfg = {
		title : '合同信息',
		collapsible : false,
		condtionFields : [{
			name:'CONT_ID',text : '合同ID'
		},{
			name:'CONT_NO',text:'合同编号'
		},{
			name:'CONT_NAME',text:'合同名称'
		},{
			name : 'CONT_STAT',text:'合同状态'
		}],
		fieldFn : function(A,B,C,D,E,F,G,H,I,J){
			return [A,B,C,D,E,F,G,H,I,J];
		}
	};



var createView = true;
var editView = true;
var detailView = false;

var formViewers = [{
	fields : ['ID','CONT_ID','HK_TEAM_NO','PLAN_DATE','EXE_DATE','ACT_DATE','XYGL_RATE','Y_XYGL','S_XYGL','R_XYGL','C_XYGL','XGZNJ_RATE','Y_XGZNJ','S_XGZNJ','R_XGZNJ','C_XGZNJ','EXE_DUE_DAYS','PLAN_DUE_DAYS','DUE_RATE','Y_DUE_INT','S_DUE_INT','R_DUE_INT','C_DUE_INT','C_TOTAL_FEE','Y_BJ','S_BJ','Y_INT','S_INT','REF','TODO_AMT','DONE_AMT','CHA_AMT','HK_STAT','MEMO'],
	fn : function(ID,CONT_ID,HK_TEAM_NO,PLAN_DATE,EXE_DATE,ACT_DATE,XYGL_RATE,Y_XYGL,S_XYGL,R_XYGL,C_XYGL,XGZNJ_RATE,Y_XGZNJ,S_XGZNJ,R_XGZNJ,C_XGZNJ,EXE_DUE_DAYS,PLAN_DUE_DAYS,DUE_RATE,Y_DUE_INT,S_DUE_INT,R_DUE_INT,C_DUE_INT,C_TOTAL_FEE,Y_BJ,S_BJ,Y_INT,S_INT,REF,TODO_AMT,DONE_AMT,CHA_AMT,HK_STAT,MEMO){
		return [ID,CONT_ID,HK_TEAM_NO,PLAN_DATE,EXE_DATE,ACT_DATE,XYGL_RATE,Y_XYGL,S_XYGL,R_XYGL,C_XYGL,XGZNJ_RATE,Y_XGZNJ,S_XGZNJ,R_XGZNJ,C_XGZNJ,EXE_DUE_DAYS,PLAN_DUE_DAYS,DUE_RATE,Y_DUE_INT,S_DUE_INT,R_DUE_INT,C_DUE_INT,C_TOTAL_FEE,Y_BJ,S_BJ,Y_INT,S_INT,REF,TODO_AMT,DONE_AMT,CHA_AMT,HK_STAT,MEMO];
	}
}];
formCfgs = {
		suspendWidth : 800
};
loancontractstore = new Ext.data.Store({
	restful:true,   
	autoLoad :false,
	proxy : new Ext.data.HttpProxy({
		url : basepath+'/loanfcontract.json'
	}),
	reader : new Ext.data.JsonReader({
		idProperty : 'CONT_ID',
		root : 'json.data'
	}, [{name : 'CONT_ID'},{name:'CONT_NAME'},{name:'CONT_NO'},{name:'CONT_STAT'}])
});

loancontractgridRowSelect = new Ext.grid.RowSelectionModel({
	singleSelect : true,
	listeners : {
		rowselect : function(sm , index, e){
			setSearchParams({
				CONT_ID : sm.grid.store.getAt(index).get('CONT_ID')
			});
			_app.searchDomain.searchPanel.getForm().setValues(sm.grid.store.getAt(index).data);
		}
	}
});

loancontractgrid = new Ext.grid.GridPanel({
    //title : 'grid',
    frame : true,
    title : '合同列表',
    width : 200,
    layout : 'fit',
    store : loancontractstore, 
    sm : loancontractgridRowSelect,
    region : 'west',
    stripeRows : true, 
    hideHeaders  : true,
    tbar : [{
    		name : 'CONT_ID',
    		text : '合同编号',
    		xtype : 'textfield',
    		labelWidth : 70,
    		id : 'CONT_FILTER'
    },{
    	text : '查询',
    	handler : function(){
    		loancontractstore.reload({
    			params : {
    				condition : Ext.encode({
    					CONT_NAME : Ext.getCmp('CONT_FILTER').getValue()
    				})
    			}
    		});
    	}
    }],
    columns: [
              {header: '合同编号', width: 195,menuDisabled: true,sortable: false,dataIndex: 'CONT_NAME'}
          ],
    viewConfig : {
    }
});
edgeVies = {
	left : {
		layout : 'fit',
		collapsible : false,
		items : [loancontractgrid]
	}
};

loancontractstore.load();