/**
        form验证中vtype的默认支持类型
1.alpha :     只能输入字母，无法输入其他（如数字，特殊符号等）
2.alphanum:   只能输入字母和数字，无法输入其他
3.email:      email验证，要求的格式是"langsin@gmail.com"
4.url:        url格式验证，要求的格式是[url]http://www.langsin.com[/url]
5.allowBlank  false 非空 ture可以为空
**/

Ext.apply(Ext.form.VTypes, {
    /**
     * @describe validate for number（数字）；
     */
	"number" : function(_v) {
		var num=/^\d+$/;
		return num.test(_v);   
	},   
	'numberText' : '数字类型错',  
	'numberMask' : /[0-9]/i,
    
    /**
     * @describe validate for age（年龄）；
     */
    "age" : function(_v) {   
       if (/^\d+$/.test(_v)) {   
        var _age = parseInt(_v);   
        if (_age < 200)   
         return true;   
       } else 
        return false;   
    },   
    'ageText' : '年龄格式出错！！格式例如：20',   
    'ageMask' : /[0-9]/i,
    
    /**
     * @describe valiedate for post code（邮编）
     */
    "postcode" : function(_v) {   
        return /^[1-9]\d{5}$/.test(_v);   
    },   
    "postcodeText" : "该输入项目必须是邮政编码格式，例如：226001",   
    "postcodeMask" : /[0-9]/i ,
    
    /**
     *  IP地址验证  
     */
    "ip" : function(_v) {   
       return /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/   
         .test(_v);   

    },   
    "ipText" : "该输入项目必须是IP地址格式，例如：222.192.42.12",   
    "ipMask" : /[0-9\.]/i, 
    
    /**
     * 固定电话及小灵通
     */
    "telephone" : function(_v) {   
        return /(^\d{3}\-\d{7,8}$)|(^\d{4}\-\d{7,8}$)|(^\d{3}\d{7,8}$)|(^\d{4}\d{7,8}$)|(^\d{7,8}$)/   
          .test(_v);   
     },   
     "telephoneText" : "该输入项目必须是电话号码格式，例如：0513-89500414,051389500414,89500414",   
     "telephoneMask" : /[0-9\-]/i,  
     
     /**
      * 固定电话
      */
     "phone" : function(_v) {   
         return /(^\d{3}\-1[3458][0-9]\d{8}$)|(^\d{2}\-1[3458][0-9]\d{8}$)/   
           .test(_v);   
      },   
      "phoneText" : "该输入项目必须是电话号码格式[区号+号码]，例如：866-15850630832,86-15850630832",   
      "phoneMask" : /[0-9\-]/i,  
     
      /**
       * 小数和字母
       */
      "non-chinese" : function(_v) {
    	  return /(^[A-Za-z0-9]+$)|([A-Za-z]+$)|([0-9]+$)/   
    	  .test(_v);   
      },   
      "non-chineseText" : "该输入项目必须是小数或者字母",   
      "pnon-chineseMask" : /[0-9\-]/i,  
      
     /**
      * 手机
      */    
     "mobile" : function(_v) {   
        return /^1[3458][0-9]\d{8}$/.test(_v);   
     },   
     "mobileText" : "该输入项目必须是手机号码格式，例如：13485135075",   
     "mobileMask" : /[0-9]/i,  
     /**
      * 身份证
      */    
     "IDCard" : function(_v) {   
        var area = {   
         11 : "北京",   
         12 : "天津",   
         13 : "河北",   
         14 : "山西",   
         15 : "内蒙古",   
         21 : "辽宁",   
         22 : "吉林",   
         23 : "黑龙江",   
         31 : "上海",   
         32 : "江苏",   
         33 : "浙江",   
         34 : "安徽",   
         35 : "福建",   
         36 : "江西",   
         37 : "山东",   
         41 : "河南",   
         42 : "湖北",   
         43 : "湖南",   
         44 : "广东",   
         45 : "广西",   
         46 : "海南",   
         50 : "重庆",   
         51 : "四川",   
         52 : "贵州",   
         53 : "云南",   
         54 : "西藏",   
         61 : "陕西",   
         62 : "甘肃",   
         63 : "青海",   
         64 : "宁夏",   
         65 : "新疆",   
         71 : "台湾",   
         81 : "香港",   
         82 : "澳门",   
         91 : "国外" 
        };  
        var Y, JYM;   
        var S, M;   
        var idcard_array = new Array();   
        idcard_array = _v.split("");   
           
        if (area[parseInt(_v.substr(0, 2))] == null) {   
         this.IDCardText = "身份证号码地区非法!!,格式例如:32";   
         return false;   
        }   
        // 身份号码位数及格式检验   
        switch (_v.length) {   
         case 15 :   
          if ((parseInt(_v.substr(6, 2)) + 1900) % 4 == 0   
            || ((parseInt(_v.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(_v   
              .substr(6, 2)) + 1900)   
              % 4 == 0)) {   
           ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;// 测试出生日期的合法性   
          } else {   
           ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;// 测试出生日期的合法性   
          }   
          if (ereg.test(_v))   
           return true;   
          else {   
           this.IDCardText = "身份证号码出生日期超出范围,格式例如:19860817";   
           return false;   
          }   
          break;   
         case 18 :   
          // 18位身份号码检测   
          // 出生日期的合法性检查   
          // 闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))   
          // 平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))   
          if (parseInt(_v.substr(6, 4)) % 4 == 0   
            || (parseInt(_v.substr(6, 4)) % 100 == 0 && parseInt(_v   
              .substr(6, 4))   
              % 4 == 0)) {   
           ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;// 闰年出生日期的合法性正则表达式   
          } else {   
           ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;// 平年出生日期的合法性正则表达式   
          }   
          if (ereg.test(_v)) {// 测试出生日期的合法性   
           // 计算校验位   
           S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10]))   
             * 7   
             + (parseInt(idcard_array[1]) + parseInt(idcard_array[11]))   
             * 9   
             + (parseInt(idcard_array[2]) + parseInt(idcard_array[12]))   
             * 10   
             + (parseInt(idcard_array[3]) + parseInt(idcard_array[13]))   
             * 5   
             + (parseInt(idcard_array[4]) + parseInt(idcard_array[14]))   
             * 8   
             + (parseInt(idcard_array[5]) + parseInt(idcard_array[15]))   
             * 4   
             + (parseInt(idcard_array[6]) + parseInt(idcard_array[16]))   
             * 2   
             + parseInt(idcard_array[7])   
             * 1   
             + parseInt(idcard_array[8])   
             * 6   
             + parseInt(idcard_array[9]) * 3;   
           Y = S % 11;   
           M = "F";   
           JYM = "10X98765432";   
           M = JYM.substr(Y, 1);// 判断校验位   
           if (M == idcard_array[17]) {   
            return true; // 检测ID的校验位   
           } else {   
            this.IDCardText = "身份证号码末位校验位校验出错,请注意x的大小写,格式例如:201X";   
            return false;   
           }
          } else {   
           this.IDCardText = "身份证号码出生日期超出范围,格式例如:19860817";   
           return false;   
          }
          break;   
         default :   
          this.IDCardText = "身份证号码位数不对,应该为15位或是18位";   
          return false;   
          break;   
        }
     },   
     "IDCardText" : "该输入项目必须是身份证号码格式，例如：32082919860817201x",   
     "IDCardMask" : /[0-9xX]/i,
     /**
      * 科目号校验，要求值为5位数字。
      */
     "itemCode" : function(_v) {
         
         var num=/^\d+$/;
         if(_v.length != 5){
             return false;
         }
         return num.test(_v);   
     },   
     'itemCodeText' : '科目号应为5位数字编号',  
     'itemCodeMask' : /[0-9]/i,
     /**
      * 输入项校验空格
      */
     "trim" : function(_v) {         
        if( _v != _v.trim()) {
        	return  false;
    	}
        	return true;
     },
     'trimText' : '输入项项首项尾有空格'
     


});
