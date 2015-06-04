<%@ page language="java" pageEncoding="utf-8"%>
<%@ page import="org.springframework.security.core.context.SecurityContextHolder" language="java"%>
<%@ page import="com.yuchengtech.framework.vo.AuthUser" language="java"%>
<%@ page import="java.util.List" language="java" %>
<%@ page import="com.yuchengtech.framework.common.LogService" language="java" %>
<%@ page import="com.yuchengtech.framework.constance.SystemConstance" language="java" %>
<%@ page import="com.yuchengtech.framework.core.LookupManager" language="java" %>
<%@ page import="com.yuchengtech.framework.constance.OperateTypeConstant" language="java" %>
<%@ page import="org.springframework.context.ApplicationContext" language="java" %>
<%@ page import="org.springframework.web.context.support.WebApplicationContextUtils" language="java" %>
<%@ page import="com.yuchengtech.core.version.VersionInformation" language="java" %>
<%@ page import="java.util.Map" language="java" %>
<%@ taglib uri="/VersionControlTag" prefix="version" %>

<%@page import="com.yuchengtech.core.version.VersionInformation.Version"%>
<script type="text/javascript">
	var a="<%=request.getContextPath()%>";
	var basepath = "/" + a.substring(1, a.length);	
	<%
	String frontVersion = VersionInformation.getInstance().getVersionInfo(VersionInformation.Version.SUB);
	String frameVersion = VersionInformation.getInstance().getVersionInfo(VersionInformation.Version.FRAME);
	out.print("var __frontVersion = '"+frontVersion+"';");
	out.print("var __frameVersion = '"+frameVersion+"';");
	if((SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof String)){
		//Session过期，重新登录
		out.print("top.location.href = basepath;");
	}else{
		AuthUser auth=(AuthUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();        
		String userId = auth.getUserId();
		out.print("var __userId = '"+userId+"';");
		out.print("var __userName = '"+auth.getUsername()+"';");
		out.print("var __userCname = '"+auth.getUsername()+"';");
		out.print("var __userIcon = '"+(auth.getTemp1() != null?auth.getTemp1():"")+"';");
		out.print("var __updatePwdStat = '"+(auth.getTemp2() != null?auth.getTemp2():"")+"';");
		
		out.print("var __themeColorId = '"+auth.getAttribute("THEME_COLOR_ID")+"';");
		
		out.print("var __background='"+auth.getAttribute("crm.front.BG")+"';");
		out.print("var __theme='"+auth.getAttribute("crm.front.TH")+"';");
		out.print("var __wordsize='"+auth.getAttribute("crm.front.WS")+"';");
		
		//当前用户角色ID串
		String role = "";
		//当前用户角色Code串
		String roleCode ="";
		String roleName ="";
		//当前用户角色类型：1：对私  2：对公
		String roleType = "1";
		for(int i=0;i<auth.getAuthorities().size();i++)
			role += auth.getAuthorities().get(i).getAuthority()+"$";
		
		for(int i=0;i<auth.getRolesInfo().size();i++){
			Map roleMap=(Map)auth.getRolesInfo().get(i);
			roleCode+=roleMap.get("ROLE_CODE")+"$";
			roleName+="," + roleMap.get("ROLE_NAME");
		}
		roleName = roleName.length() > 0?roleName.substring(1):roleName;
		if(roleCode.toLowerCase().startsWith("c_")){
			roleType = "2";
			//customerManagerCode = "1014";
		}
		//当前用户机构ID
		String orgId = auth.getUnitId();
		//公共JS变量
		out.print("var __roles = '"+role+"';");
		out.print("var __roleCodes = '"+roleCode+"';");
		out.print("var __roleNames = '"+roleName+"';");
		out.print("var __roleType = '"+ roleType +"';");
		out.print("var __units = '"+auth.getUnitId()+"';");
		out.print("var __grants = [];");
		String resId = request.getParameter("resId");
		out.print("var __resId = '"+resId+"';");
		out.print("var __unitname = '"+auth.getUnitName()+"';");
		out.print("var __unitlevel = '"+auth.getUnitlevel()+"';");
		out.print("var __appId = '"+SystemConstance.LOGIC_SYSTEM_APP_ID+"';");
		//登录类型（单角色或多角色）
		out.print("var __loginType = '"+auth.getLoginType()+"';");
		//security变量
		out.print("var __secMsgType = '';");
		out.print("var __secMsg = '';");
		if (auth.getCredentialInfo() != null) {
			out.print("__secMsgType = '"+auth.getCredentialInfo().getInfoType()+"';");
			out.print("__secMsg = '"+auth.getCredentialInfo().getMessage()+"';");
		}
		//判断如果是菜单URL请求，则做两件事  
		//1、将菜单下的控制点写入公共变量
		//2、记录菜单访问日志
		if(resId!=null && !"-1".equals(resId) && !"".equals(resId)){
			List<String> grants = auth.findGrantByRes(resId);
			if(grants!=null){
				for(int i=0;i<grants.size();i++){
					out.print("__grants.push('"+grants.get(i)+"');");
				}
			}
			//增加菜单日志访问记录
			//LogUtils lu=new LogUtils();
			LogService.loginfo.setLoginIp(request.getRemoteAddr());
			LogService.loginfo.setLogTypeId(Long.valueOf(OperateTypeConstant.VISIT_MENU+""));
			LogService.loginfo.setAfterValue(request.getServletPath());
			LogService.loginfo.setContent(OperateTypeConstant.getOperateText(OperateTypeConstant.VISIT_MENU)+":"+LookupManager.getInstance().getMenuName(resId));
			LogService.addLog();
		} 
		//获取异常描述信息
		ApplicationContext app =WebApplicationContextUtils.getRequiredWebApplicationContext(this.getServletConfig().getServletContext()) ;
		Map<String, String> errMsgMap = (Map<String, String>) app.getBean("getErrMsgMap");
		Map<String, String> errPageMap = (Map<String, String>) app.getBean("getErrPageMap");
		String defaultErrMsg = (String) app.getBean("getDefaultErrMsg");
		String defaultErrPage = (String) app.getBean("getDefaultErrPage");
		out.print("var __errMsgMap = [];");
		for(String key : errMsgMap.keySet()){
			out.print("__errMsgMap.push({code:'"+key+"',content:'"+errMsgMap.get(key)+"'});");
		}
	}
	String custManagerType =   SysPublicParamManager.getInstance().findParamValueByName(SysPublicParamManager.CUST_MANAGER_TYPE);
	out.print("var __custManagerType = '"+custManagerType+"';");//客户归属参数
	%>
</script>
<%@ page import="com.yuchengtech.framework.core.SysPublicParamManager"  language = "java"%>
<version:frameLink  type="text/css" rel="stylesheet" href="/contents/resource/ext3/resources/css/ext-all-notheme.css" />
<% 
	if(!(SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof String)){
		AuthUser auth=(AuthUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		out.print("<link type=\"text/css\" rel=\"stylesheet\" href=\""+request.getContextPath()+"/contents/wljFrontFrame/styles/search/searchthemes/"+auth.getAttribute("crm.front.TH")+"/main.css\" />");
	/*	if(auth.getAttribute("crm.front.WS").equals("ra_normal")){
			out.print("<link type=\"text/css\" rel=\"stylesheet\" href=\""+request.getContextPath()+"/contents/wljFrontFrame/styles/search/searchcss/font_normal.css\" />");
		}else{
			out.print("<link type=\"text/css\" rel=\"stylesheet\" href=\""+request.getContextPath()+"/contents/wljFrontFrame/styles/search/searchcss/font_big.css\" />");
		}*/
	}
%>
<version:frameLink rel="stylesheet" type="text/css" href="/contents/resource/ext3/ux/css/toolbars.css" />
<!-- 补丁样式文件，对于Ext中由于css样式引起的公共性质的BUG，修复代码均添加在此文件中 -->
<version:frameLink  type="text/css" rel="stylesheet" href="/contents/pages/common/Crm-Ext-Patch-Css-1.000-v1.0.css" />

<version:frameScript type="text/javascript" src="/contents/resource/ext3/adapter/ext/ext-base.js" />
<version:frameScript type="text/javascript" src="/contents/resource/ext3/ext-all.js"/>
<version:frameScript type="text/javascript" src="/contents/resource/ext3/ux/ux-all.js"/>
<version:frameScript type="text/javascript" src="/contents/pages/common/Crm-Ext-Patch-1.000-v1.0.js"/>
<version:frameScript type="text/javascript" src="/contents/pages/common/Crm-Ext-Extends-1.000-v1.0.js"/>  
<version:frameScript type="text/javascript" src="/contents/resource/ext3/locale/ext-lang-zh_CN.js"/>
<!-- 校验以及数据格式化组件 -->
<version:frameScript type="text/javascript" src="/contents/pages/common/LovCombo.js"/>
<version:frameScript type="text/javascript" src="/contents/commonjs/DataFormat.js"/>
<version:frameScript type="text/javascript" src="/contents/commonjs/Validator.js"/>
<!-- 控制点权限判断组件 -->
<version:frameScript type="text/javascript" src="/contents/pages/common/ViewContext.js"/>  
<!-- 导入导出组件 -->
<version:frameScript type="text/javascript" src="/contents/pages/common/Com.yucheng.crm.common.ImpExp.js"/> 
<version:frameScript type="text/javascript" src="/contents/pages/common/Com.yucheng.crm.common.Upload.js"/> 
<!-- 流程发起选择办理人窗口 -->
<version:frameScript type="text/javascript" src="/contents/pages/common/EchainSelectNextNodeUserPanel.js"/> 

<!--<version:frameScript type="text/javascript" src="/contents/pages/common/SystemBooter.js"/>  -->

<script type="text/javascript">

/*特殊按键屏蔽
 * 
 
document.oncontextmenu=function(){
	return false;
};
document.onkeydown = function(){
	if((window.event.ctrlKey)&&((window.event.keyCode==67))){
		event.returnValue=false;
	}
};*/
JsContext.initContext();
//Ajax请求超时时间
Ext.Ajax.timeout = 90000;
</script>

