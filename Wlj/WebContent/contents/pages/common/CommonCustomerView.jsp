<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/contents/pages/common/includes.jsp"%>
<html>
<head>
<title></title>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/contents/resource/ext3/ux/maximgb/index.css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/contents/resource/ext3/ux/maximgb/css/TreeGrid.css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/contents/resource/ext3/ux/maximgb/TreeGrid.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/contents/pages/common/commonExtPanel.js"></script>
<script type="text/javascript"src="<%=request.getContextPath()%>/contents/commonjs/scriptLoader.js"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/contents/pages/common/Com.yucheng.crm.cust.ViewWindow.js"></script>
<script type="text/javascript"src="<%=request.getContextPath()%>/contents/pages/customer/customerManager/globalVariable.js"></script>
<script type="text/javascript"src="<%=request.getContextPath()%>/contents/pages/customer/customerManager/assistInput.js"></script>
<!-- 关系网络图 -->
<script type="text/javascript" src="<%=request.getContextPath()%>/contents/commonjs/mxGraphLocal/mxclient-ie1.8.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/contents/commonjs/mxGraphLocal/mxGrapth-Crm-locale-ext-v1.000.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/contents/commonjs/mxGraphLocal/crm-mxGraph-api-v1.000.js"></script>
<!-- 公共选择放大镜 -->
<script type="text/javascript"src="<%=request.getContextPath()%>/contents/pages/com.yucheng.bcrm/com.yucheng.bcrm.js"></script>
<!-- 人员放大镜 -->
<script type="text/javascript" src="<%=request.getContextPath()%>/contents/pages/common/Com.yucheng.crm.common.OrgUserManage.js"></script>
<!-- 指标放大镜 -->
<script type="text/javascript" src="<%=request.getContextPath()%>/contents/pages/common/Com.yucheng.bcrm.common.indexfeild.js"></script>
<!-- 组织机构放大镜 -->
<script type="text/javascript"src="<%=request.getContextPath()%>/contents/pages/common/Com.yucheng.bcrm.common.CustomerQueryField.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/contents/pages/common/Com.yucheng.bcrm.common.OrgField.js"></script>

<!-- 加入客户群-------------------------------------------------------------------->

<!-- 自动筛选规则设置 -->
<script type="text/javascript" src="<%=request.getContextPath()%>/contents/pages/customer/customerClub/flexibleQuery.js"></script>
<!-- 客户群对应客户经理维护展示的js -->
<script type="text/javascript" src="<%=request.getContextPath()%>/contents/pages/customer/customerClub/groupCustMgrEdit.js"></script>

<!-- 客户群成员维护展示的js -->
<script type="text/javascript" src="<%=request.getContextPath()%>/contents/pages/customer/customerClub/groupLeaguerEdit.js"></script>

<!-- 客户群新增，修改详情展示的js -->
<script type="text/javascript" src="<%=request.getContextPath()%>/contents/pages/customer/customerClub/customerGroupEdit.js"></script>

<!-- 客户群放大镜 -->
<script type="text/javascript" src="<%=request.getContextPath()%>/contents/pages/common/Com.yucheng.bcrm.common.CustGroup.js"></script>

<!-- 创建客户群js  -->
<script type="text/javascript" src="<%=request.getContextPath()%>/contents/pages/customer/custSearchByDetailType/searchCustForGroup.js"></script>
<!-- 下拉复选框 -->
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/contents/css/LovCombo.css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/contents/pages/common/LovCombo.js"></script>
<style type="text/css">
.input_Assist
{
	background-color:#DDDDDD;
}
.ul_background
{
	background-color:#FFFFFF;
	list-style-type:none;
	font-size:12px;
 	border-style: solid;
	border-width:3px;
  	border-color:#DDDDDD;
}
</style>
<script type="text/javascript">
	var resId = "<%=request.getParameter("resId")%>";
	var custId = "<%=request.getParameter("custId")%>" ;
	var custName = "<%=request.getParameter("custName")%>" ;
	var custTyp = "<%=request.getParameter("custTyp")%>" ;
Ext.onReady(function(){
	var viewWindow = new Com.yucheng.crm.cust.ViewWindow({
		id:'viewWindow',
		custId:custId,
		closable  :false,
		custName:custName,
		custTyp:custTyp
	});
	Ext.Ajax.request({
		url : basepath + '/commsearch!isMainType.json',
		mothed : 'GET',
		params : {
		'mgrId' : __userId,
		'custId' : custId
	},
	success : function(response) {
		var anaExeArray = Ext.util.JSON.decode(response.responseText); 
		if(anaExeArray.json != null){
		if(anaExeArray.json.MAIN_TYPE=='1'){
			oCustInfo.omain_type=true;
		}else{
			oCustInfo.omain_type=false;
		}}
		else {
			oCustInfo.omain_type=false;
		}
		oCustInfo.cust_id = custId;
		oCustInfo.cust_name = custName;
		oCustInfo.cust_type = custTyp;
		oCustInfo.view_source = 'viewport_center';
		viewWindow.show();
	
	},
	failure : function(form, action) {}
	});
});

	
</script>

</head>
<body>

</body>
</html>