Ext.ns('Com.yucheng.crm.common');
/**
 * @description 密码认证策略公共调用类
 * @author helin
 * @since 2014-04-22
 */
Com.yucheng.crm.common.PasswordValidate = Ext.extend(Ext.util.Observable, {
	loaded : false,    //是否初始化策略参数
	
	state6 : false,    //口令与近期历史密码重复策略启用标志
	historyPw : false, //口令与近期历史密码重复策略配置参数
	
	state7 : false,    //口令长度策略启用标志
	pwLength : false,  //口令长度策略配置参数
	
	state8 : false,    //口令复杂度策略启用标志
	pwComplex : false, //口令复杂度策略配置参数
	
	state9 : false,    //口令不重复长度策略启用标志
	pwNoRepeat : false, //口令不重复长度策略配置参数
	
	state10 : false,     //口令连续长度策略启用标志
	pwSeries : false,   //口令连续长度策略配置参数
	
	errorMsg1 : '', //最小口令长度,校验错误提示信息
	errorMsg2 : '', //连续重复,校验错误提示信息
	errorMsg3 : '', //连续字符,校验错误提示信息
	//口令复杂度策略,校验错误提示信息errorMsg4-errorMsg8
	errorMsg4 : '',
	errorMsg5 : '',
	errorMsg6 : '',
	errorMsg7 : '',
	errorMsg8 : '',
    pw : '', //当前密码
	ipAuthSign : 0, //ip校验成功与否标志
	/**
	 * 构造密码认证策略类
	 * @param {} cfg
	 */
	constructor : function(cfg){
		// constructor will add them.
        //this.listeners = cfg.listeners;
		Com.yucheng.crm.common.PasswordValidate.superclass.constructor.call(this,cfg);
	},
	/**
	 * 密码校验
	 * @param pwd 待校验密码
	 * @return {valid,errorMsg}  valid：校验是否通过，true表示通过,false未通过，errorMsg：未来通过提示信息
	 */
	pwdValidate : function(pwd){
		this.resetErrorMsg();
		var obj = {valid:true,errorMsg:false};
		if(!this.loaded){
			obj.valid = false;
			obj.errorMsg = '请先初始化密码认证策略！';
			return obj;
		}
		if(typeof pwd !== 'string' || pwd == null || pwd == undefined){
			obj.valid = false;
			obj.errorMsg = '校验的密码为类型不为string,或密码为undefined！';
			return obj;
		}
		var temp = true;
		debugger;
		if(this.state7 == '1'){
			temp = this.passwordLength(pwd,this.pwLength);
			if(!temp && obj.valid){
				obj.valid = false;
			}
		}
		if(this.state9 == '1'){
			temp = this.passwordNoRepeatLength(pwd,this.pwNoRepeat);
			if(!temp && obj.valid){
				obj.valid = false;
			}
		}
		if(this.state10 == '1'){
			temp = this.passwordSeries(pwd,this.pwSeries);
			if(!temp && obj.valid){
				obj.valid = false;
			}
		}
		if(this.state8 == '1'){
			temp = this.passwordComplexStrategy(pwd, this.pwComplex);
			if(!temp && obj.valid){
				obj.valid = false;
			}
		}
		if(!obj.valid){
			obj.errorMsg = '密码校验出错，' + this.errorMsg1 +' '+ this.errorMsg2 +' '+ this.errorMsg3 +' '+ this.errorMsg4
				+' '+ this.errorMsg5 +' '+ this.errorMsg6 +' '+ this.errorMsg7 +' '+ this.errorMsg8;
		}
		return obj;
	},
	/**
	 * 初始化密码校验策略
	 * @param forceLoad true表示强制重新加载密码认证策略，默认false
	 */
	initTactics : function(forceLoad){
		var _this = this;
		if(this.loaded && !forceLoad){
			return;
		}
	    Ext.Ajax.request({
		    url: basepath + '/userApproveTacticsQuery.json',
		    method: 'GET',
		    params: {
		        'tem1': 6,
		        'tem2': 10
		    },
		    success: function(response) {
		        var param = Ext.util.JSON.decode(response.responseText);
		        _this.state6 = param.json.data[0].ENABLE_FLAG; //口令与近期历史密码重复策略启用标志
		        _this.historyPw = param.json.data[0].DETAIL; //口令与近期历史密码重复策略配置参数
		        _this.state7 = param.json.data[1].ENABLE_FLAG; //口令长度策略启用标志
		        _this.pwLength = param.json.data[1].DETAIL; //口令长度策略配置参数
		        _this.state8 = param.json.data[2].ENABLE_FLAG; //口令复杂度策略启用标志
		        _this.pwComplex = param.json.data[2].DETAIL; //口令复杂度策略配置参数        
		        _this.state9 = param.json.data[3].ENABLE_FLAG; //口令不重复长度策略启用标志
		        _this.pwNoRepeat = param.json.data[3].DETAIL; //口令不重复长度策略配置参数
		        _this.state10 = param.json.data[4].ENABLE_FLAG; //口令连续长度策略启用标志
		        _this.pwSeries = param.json.data[4].DETAIL; //口令连续长度策略配置参数
		        _this.loaded = true;
		        _this.resetErrorMsg();
		    },
		    failure: function(response) {
		        Ext.Msg.alert('提示', '查询密码校验策略信息失败');
		    }
		});
	},
	/**
	 * 重置所有错误信息
	 */
	resetErrorMsg : function(){
		this.errorMsg1 = '';
		this.errorMsg2 = '';
		this.errorMsg3 = '';
		this.errorMsg4 = '';
		this.errorMsg5 = '';
		this.errorMsg6 = '';
		this.errorMsg7 = '';
		this.errorMsg8 = '';
		
		this.ipAuthSign = 0;
	},
	/**
	 * 口令长度策略
	 * @param {} v 待校验的密码
	 * @param {} pwLength 最小长度
	 * @return {Boolean}
	 */
	passwordLength : function(v, pwLength) {
	    var minLength = parseInt(pwLength);
	    if (v.length >= minLength) {
	        return true;
	    } else {
	        this.pw = '';
	        this.errorMsg1 = '您输入的密码长度小于最小口令长度';
	        return false;
	    }
	},
	/**
	 * 口令不重复长度策略
	 * @param {} v 待校验的密码
	 * @param {} pwNoRepeat 最大重复长度值
	 * @return {Boolean}
	 */
	passwordNoRepeatLength : function(v, pwNoRepeat) {
	    var repeatMinLength = parseInt(pwNoRepeat);
	    var c = 0;
	    var a1 = 0;
	    for (var j = 0; j < v.length - 1; j++) {
	        for (var i = 0; i < (repeatMinLength + 1); i++) {
	            var tmp = v.charCodeAt(i + j) - v.charCodeAt(i + j + 1);
	            if (tmp == 0) {
	                c++;
	            }
	        }
	        if (c == (repeatMinLength)) {
	            a1++;
	        }
	        c = 0;
	    }
	    if (a1 > 0) {
	        this.pw = '';
	        this.errorMsg2 = '您输入的密码连续重复的字符数超过最大长度';
	        return false;
	    } else {
	        return true;
	
	    }
	},
	/**
	 * 口令连续长度策略
	 * @param {} v 待校验的密码
	 * @param {} pwSeries 最大连续长度
	 * @return {Boolean}
	 */
	passwordSeries : function(v, pwSeries) {
	    var repeatMinLength = parseInt(pwSeries);
	    var a = 0;
	    var b = 0;
	    var a1 = 0;
	    for (var j = 0; j < v.length - 1; j++) {
	        for (var i = 0; i < (repeatMinLength + 1); i++) {
	            var tmp = v.charCodeAt(i + j) - v.charCodeAt(i + j + 1);
	            if (tmp == 1) {
	                a++;
	            } else if (tmp == -1) {
	                b++;
	            }
	        }
	        if (a == (repeatMinLength) || b == (repeatMinLength)) {
	            a1++;
	        }
	        a = 0;
	        b = 0;
	    }
	    if (a1 > 0) {
	        this.pw = '';
	        this.errorMsg3 = '您输入的密码连续字符的字符数超过最大长度';
	        return false;
	    } else {
	        return true;
	    }
	},
	/**
	 * 口令复杂度策略
	 * @param {} v 待校验密码
	 * @param {} pwComplex 复杂组合类型
	 */
	passwordComplexStrategy : function(v, pwComplex) {
	    var m = 0;
	    var n = 0;
	    var p = 0;
	    var q = 0;
	    var tmp = pwComplex.split('/');
	    for (var i = 0; i < v.length; i++) {
	        var asc = v.charCodeAt(i);
	        if (asc > 47 && asc < 59) {
	            m = 1; //数字
	        } else if (asc > 64 && asc < 91) {
	            n = 1; //大写字符
	        } else if (asc > 96 && asc < 123) {
	            p = 1; //小写字符
	        } else if ((asc > 37 && asc < 48) || (asc > 57 && asc < 65)) {
	            q = 1; //其他字符
	        }
	    }
	    for (var i = 0; i < tmp.length; i++) {
	        var m = 0;
	        var n = 0;
	        var p = 0;
	        var q = 0;
	        var tmp = pwComplex.split('/');
	        for (var i = 0; i < v.length; i++) {
	            var asc = v.charCodeAt(i);
	            if (asc > 47 && asc < 59) {
	                m = 1; //数字
	            } else if (asc > 64 && asc < 91) {
	                n = 1; //大写字符
	            } else if (asc > 96 && asc < 123) {
	                p = 1; //小写字符
	            } else if ((asc > 37 && asc < 48) || (asc > 57 && asc < 65)) {
	                q = 1; //其他字符
	            }
	        }
	
	        for (var i = 0; i < tmp.length; i++) {
	            var a = tmp[i];
	            switch (a) {
	            case '1':
	                this.errorMsg5 = '数字';
	                if (m > 0) {} else {
	                    this.pw = '';
	                    this.errorMsg4 = '您输入的密码必须几种组合:';
	                };
	                break;
	            case '2':
	                this.errorMsg6 = '大写字母';
	                if (n > 0) {} else {
	                    this.pw = '';
	                    this.errorMsg4 = '您输入的密码必须几种组合:';
	                };
	                break;
	            case '3':
	                this.errorMsg7 = '小写字母';
	                if (p > 0) {} else {
	                    this.pw = '';
	                    this.errorMsg4 = '您输入的密码必须几种组合:';
	                };
	                break;
	            case '4':
	                this.errorMsg8 = '其他符号';
	                if (q > 0) {} else {
	                    this.pw = '';
	                    this.errorMsg4 = '您输入的密码必须几种组合:';
	                }
	            }
	        }
	    }
	},
	/**
	 * IP校验方法
	 * @param {} ipTmp 循环校验IP
	 */
	ipAuth : function(ipTmp){
	    //var ipTmp = Ext.getCmp('offenIP').getValue(); //循环校验IP
	    if (! (ipTmp == '')) {
	        var oftenIpTmp = ipTmp.split(',');
	        for (var i = 0; i < oftenIpTmp.length; i++) {
	            if (/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(oftenIpTmp[i])) {} else {
	                this.ipAuthSign++;
	            }
	        }
	    }
	}
});

window._PwdValid = new Com.yucheng.crm.common.PasswordValidate();
