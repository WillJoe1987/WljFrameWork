var headerData = {
		html : 
			  '<div class="yc-cvHeader">'
			 + '<div class="yc-cvhContainer">'
			 + '<div class="yc-cvhUser">'
			 + '<span class="yc-cvhuName">张三(zhangsan)</span>'
			 + '<span class="yc-cvhuSNM">男，汉族，已婚</span>'
			 + '</div>'
			 + '<div class="yc-cvhUserInfo">'
			 + '<div class="yc-cvhuiList"><label>客户编号：</label><span title="0023034043">0023034043</span></div>'
			 + '<div class="yc-cvhuiList"><label>证件类型：</label><span title="身份证">身份证</span></div>'
			 + '<div class="yc-cvhuiList"><label>证件号码：</label><span title="510123198702289987">510123198702289987</span></div>'
			 + '<div class="yc-cvhuiList"><label>基础评级：</label><span title="显著客户">显著客户</span></div>'
			 + '<div class="yc-cvhuiList"><label>贡献度评级：</label><span title="四星客户">四星客户</span></div>'
			 + '<div class="yc-cvhuiList"><label>两地客户标示：</label><span title="商旅客户">商旅客户</span></div>'
			 + '</div>'
			 + '</div>'
			 + '</div>'
};

/**
 *  TX : 磁贴X坐标
	TY : 磁贴Y坐标
	tileName : 磁贴名称
	TILE_SIZE : 磁贴尺寸  为空或为false尺寸为1*1,为特定编码将被解析为特定的尺寸
		[3,3] :  'TS_01';
		[2,3] :  'TS_02';
		[3,2] :  'TS_03';
		[1,3] :  'TS_04';
		[3,1] :  'TS_05';
		[2,2] :  'TS_06';
		[1,2] :  'TS_07';
		[2,1] :  'TS_08';
	JS_URL : 磁贴内容渲染路径 
			为空且html磁贴尺寸将被设置1*1；
			如设置此属性时将被应用该磁贴内容的展示，
			参考代码如：JS_URL : '/contents/pages/testtiles/viewTileTest.js'
							
	DETAIL_URL : 磁贴对应功能路径，即点击时弹出的页面路径
				可被设置为*.js或*.jsp
				如：DETAIL_URL : '/contents/pages/wlj/systemManager/userManagerNew.js'
				 或 DETAIL_URL : '/contents/pages/systemManager/adminLogManager/adminLogManager.jsp'
				 页面中要接受[_custId]参数，作为当前浏览客户ID作为上下文。
	html : 磁贴静态内容，为空且JS_URL磁贴尺寸将被设置1*1；
		   当无JS_URL属性时，磁贴内部将展示HTML属性中在内容。
 * 
 */
var contentData = [{
	TX : 0,
	TY : 0,
	tileName : '基本信息',
	TILE_SIZE : '',
	DETAIL_URL : '/contents/pages/wlj/customerManager/privateCustView/privateCustInfoHomePage.jsp',
	html : '<div class="yc-cvTile tile_c1"><img alt="" src="../../../wljFrontFrame/styles/search/searchthemes/blue/pics/ico/tile/ico_29.png"/><br/><span>基本信息</span></div>'
},{
	TX : 1,
	TY : 0,
	TILE_SIZE : '',
	tileName : '信用信息',
	TILE_COLOR : 'tile_c3',
	DETAIL_URL : '/contents/pages/system/dataSetManager/dataSetManager.jsp',
	html : '<div style="width:100%;height:100%;" class="yc-cvTile  yc-cvtBr"><img alt="" src="../../../wljFrontFrame/styles/search/searchthemes/blue/pics/ico/tile/ico_62.png"/><br/><span>信用信息</span></div>'
},{
	TX : 2,
	TY : 0,
	TILE_SIZE : 'TS_06',
	tileName : '关注客户',
	TILE_COLOR : 'tile_c5',
	DETAIL_URL : '/contents/pages/wlj/customerView/retailCustView/hobbyInfo.js',
	JS_URL : '/contents/pages/testtiles/viewTileTest.js'
},{
	TX : 4,
	TY : 0,
	TILE_SIZE : 'TS_06',
	tileName : '最新事件',
	DETAIL_URL : '/contents/pages/wlj/systemManager/organizationManagerNew.js',
	html : '<div style="width:100%;height:100%;" class="tile_c5">'
		+ '<div class="yc-cvtcTitle">'
		+ '<img alt="" src="../../../wljFrontFrame/styles/search/searchthemes/blue/pics/ico/tile/ico_3.png"/>'
		+ '最新事件'
		+ '</div>'
		+ '<div class="yc-cvtcContent">'
		+ '	<div class="yc-cvtcList" title="XXX">2014-07-21，（5天后）客户生日。</div>'
		+ '<div class="yc-cvtcList" title="XXX">2014-07-27，贷款账户6222456456****需还款。</div>'
		+ '<div class="yc-cvtcList" title="XXX">2014-08-01，有1份理财产品到期。</div>'
		+ '<div class="yc-cvtcList" title="XXX">2014-05-25，账户6222456456****产生1笔大额交易。</div>'
		+ '</div>'
		+ '</div>'
},{
	TX : 0,
	TY : 1,
	DETAIL_URL : '/contents/pages/wlj/customerView/retailCustView/contactInfo.js',
	html : '<div style="width:100%;height:100%;" class="yc-cvTile tile_c6"><img alt="" src="../../../wljFrontFrame/styles/search/searchthemes/blue/pics/ico/tile/ico_45.png"/><br/><span>联系信息</span></div>'
},{
	TX : 1,
	TY : 1,
	DETAIL_URL : '',
	html : '<div style="width:100%;height:100%;" class="yc-cvTile tile_c5 yc-cvtBr"><img alt="" src="../../../wljFrontFrame/styles/search/searchthemes/blue/pics/ico/tile/ico_6.png"/><br/><span>积分信息</span></div>'
},{
	TX : 0,
	TY : 2,
	DETAIL_URL : '',
	JS_URL : '',
	html : '<div style="width:100%;height:100%;" class="yc-cvTile tile_c10"><img alt="" src="../../../wljFrontFrame/styles/search/searchthemes/blue/pics/ico/tile/ico_13.png"/><br/><span>产品信息</span></div>'
},{
	TX : 1,
	TY : 2,
	DETAIL_URL : '',
	html : '<div style="width:100%;height:100%;"  class="yc-cvTile tile_c1 yc-cvtBr"><img alt="" src="../../../wljFrontFrame/styles/search/searchthemes/blue/pics/ico/tile/ico_32.png"/><br/><span>他行信息</span></div>'
},{
	TX : 2,
	TY : 2,
	TILE_SIZE : 'TS_06',
	DETAIL_URL : '',
	html : '<div style="width:100%;height:100%;"  class="tile_c10">'
		+ '<div class="yc-cvtcTitle">'
		+ '<img alt="" src="../../../wljFrontFrame/styles/search/searchthemes/blue/pics/ico/tile/ico_61.png"/>'
		+ '存款情况'
		+ '</div>'
		+ '<div class="yc-cvtcContent">'
		+ '<div class="yc-cvtcList" title="XXX">统计日期：2014-12-31</div>'
		+ '<div class="yc-cvtcList" title="XXX">贷款总额： 27,300.30元</div>'
		+ '<div class="yc-cvtcList1" title="XXX">上期余额： 25,470.30元</div>'
		+ '<div class="yc-cvtcList1" title="XXX">上期日均：25,678.00元</div>'
		+ '<div class="yc-cvtcList1" title="XXX">上年余额： 27,300.30元</div>'
		+ '<div class="yc-cvtcList1" title="XXX">上年日均：25,678.00元</div>'
		+ '</div>'
		+ '</div>'
},{
	TX : 4,
	TY : 2,
	TILE_SIZE : 'TS_06',
	DETAIL_URL : '',
	html : '<div style="width:100%;height:100%;"  class="tile_c3">'
		+ '<div class="yc-cvtcTitle">'
		+ '<img alt="" src="../../../wljFrontFrame/styles/search/searchthemes/blue/pics/ico/tile/ico_61.png"/>'
		+ '贷款情况'
		+ '</div>'
		+ '<div class="yc-cvtcContent">'
		+ '<div class="yc-cvtcList" title="XXX">统计日期：2014-12-31</div>'
		+ '<div class="yc-cvtcList" title="XXX">贷款总额： 27,300.30元</div>'
		+ '<div class="yc-cvtcList1" title="XXX">上期余额： 25,470.30元</div>'
		+ '<div class="yc-cvtcList1" title="XXX">上期日均：25,678.00元</div>'
		+ '<div class="yc-cvtcList1" title="XXX">上年余额： 27,300.30元</div>'
		+ '<div class="yc-cvtcList1" title="XXX">上年日均：25,678.00元</div>'
		+ '</div>'
		+ '</div>'
},{
	TX : 0,
	TY : 3,
	DETAIL_URL : '',
	html : '<div style="width:100%;height:100%;"  class="yc-cvTile tile_c3"><img alt="" src="../../../wljFrontFrame/styles/search/searchthemes/blue/pics/ico/tile/ico_55.png"/><br/><span>客户经理信息</span></div>'
},{
	TX : 1,
	TY : 3,
	DETAIL_URL : '',
	html : '<div style="width:100%;height:100%;"  class="yc-cvTile tile_c5 yc-cvtBr"><img alt="" src="../../../wljFrontFrame/styles/search/searchthemes/blue/pics/ico/tile/ico_46.png"/><br/><span>黑名单信息</span></div>'
},{
	TX : 0,
	TY : 4,
	DETAIL_URL : '',
	TILE_SIZE : 'TS_06',
	html : '<div style="width:100%;height:100%;" class="tile_c1">'
		+ '<div class="yc-cvtcTitle">'
		+ '	<img alt="" src="../../../wljFrontFrame/styles/search/searchthemes/blue/pics/ico/tile/ico_18.png"/>'
		+ '本期评级'
		+ '</div>'
		+ '<div class="yc-cvtcContent">'
		+ '<div class="yc-cvtcList" title="XXX">本期AUM总额：456,738.00元</div>'
		+ '<div class="yc-cvtcList" title="XXX">存款AUM总额：234,245.05元</div>'
		+ '<div class="yc-cvtcList" title="XXX">理财AUM总额：456,738.00元</div>'
		+ '<div class="yc-cvtcList" title="XXX">总贡献度总额：4234,245.05元</div>'
		+ '</div>'
		+ '</div>'
},{
	TX : 2,
	TY : 4,
	TILE_SIZE : 'TS_06',
	DETAIL_URL : '',
	html : '<div style="width:100%;height:100%;" class="tile_c3">'
		+ '<div class="yc-cvtcTitle">'
		+ '<img alt="" src="../../../wljFrontFrame/styles/search/searchthemes/blue/pics/ico/tile/ico_47.png"/>'
		+ '客户归属'
		+ '</div>'
		+ '<div class="yc-cvtcContent">'
		+ '<div class="yc-cvtcList" title="XXX">主办机构： 深圳华侨支行</div>'
		+ '<div class="yc-cvtcList" title="XXX">主办客户经理： 李四</div>'
		+ '<div class="yc-cvtcList" title="XXX">主办团队： 华侨高端客户组</div>'
		+ '<div class="yc-cvtcList" title="XXX">协办客户经理：  王五</div>'
		+ '</div>'
		+ '</div>'
},{
	TX : 4,
	TY : 4,
	TILE_SIZE : 'TS_06',
	DETAIL_URL : '',
	html : '<div style="width:100%;height:100%;" class="tile_c5">'
		+ '<div class="yc-cvtcTitle">'
		+ '<img alt="" src="../../../wljFrontFrame/styles/search/searchthemes/blue/pics/ico/tile/ico_7.png"/>'
		+ '家庭信息'
		+ '</div>'
		+ '<div class="yc-cvtcContent">'
		+ '<div class="yc-cvtcList1" title="XXX">某某信息： XXXXXX</div>'
		+ '<div class="yc-cvtcList1" title="XXX">某某信息： XXXXXX</div>'
		+ '<div class="yc-cvtcList1" title="XXX">某某信息： XXXXXX</div>'
		+ '<div class="yc-cvtcList1" title="XXX">某某信息： XXXXXX</div>'
		+ '<div class="yc-cvtcList" title="XXX">某某信息： XXXXXX</div>'
		+ '<div class="yc-cvtcList" title="XXX">某某信息： XXXXXX</div>'
		+ '</div>'
		+ '</div>'
},{
	TX : 0,
	TY : 6,
	TILE_SIZE : 'TS_06',
	html : '<div style="width:100%;height:100%;" class="tile_c6">'
		+ '<div class="yc-cvtcTitle">'
		+ '<img alt="" src="../../../wljFrontFrame/styles/search/searchthemes/blue/pics/ico/tile/ico_33.png"/>'
		+ '	财务信息'
		+ '</div>'
		+ '<div class="yc-cvtcContent">'
		+ '	<div class="yc-cvtcList" title="XXX">某某信息： XXXXXX</div>'
		+ '<div class="yc-cvtcList" title="XXX">某某信息： XXXXXX</div>'
		+ '<div class="yc-cvtcList1" title="XXX">某某信息： XXXXXX</div>'
		+ '<div class="yc-cvtcList1" title="XXX">某某信息： XXXXXX</div>'
		+ '<div class="yc-cvtcList1" title="XXX">某某信息： XXXXXX</div>'
		+ '<div class="yc-cvtcList1" title="XXX">某某信息： XXXXXX</div>'
		+ '</div>'
		+ '</div>'
},{
	TX : 2,
	TY : 6,
	TILE_SIZE : 'TS_06',
	html : '<div style="width:100%;height:100%;" class="tile_c10">'
		+ '<div class="yc-cvtcTitle">'
		+ '<img alt="" src="../../../wljFrontFrame/styles/search/searchthemes/blue/pics/ico/tile/ico_71.png"/>'
		+ '行为信息'
		+ '</div>'
		+ '<div class="yc-cvtcContent">'
		+ '<div class="yc-cvtcList" title="XXX">某某信息： XXXXXX</div>'
		+ '<div class="yc-cvtcList" title="XXX">某某信息： XXXXXX</div>'
		+ '<div class="yc-cvtcList1" title="XXX">某某信息： XXXXXX</div>'
		+ '<div class="yc-cvtcList1" title="XXX">某某信息： XXXXXX</div>'
		+ '<div class="yc-cvtcList1" title="XXX">某某信息： XXXXXX</div>'
		+ '<div class="yc-cvtcList1" title="XXX">某某信息： XXXXXX</div>'
		+ '</div>'
		+ '</div>'
},{
	TX : 4,
	TY : 6,
	TILE_SIZE : 'TS_06',
	html : '<div style="width:100%;height:100%;" class="tile_c1">'
		+ '<div class="yc-cvtcTitle">'
		+ '<img alt="" src="../../../wljFrontFrame/styles/search/searchthemes/blue/pics/ico/tile/ico_12.png"/>'
		+ '基础评级趋势'
		+ '</div>'
		+ '<div class="yc-cvtcContent">'
		+ '	这里展示图形'
		+ '</div>'
		+ '</div>'
}];