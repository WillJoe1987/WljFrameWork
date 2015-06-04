/*  
0 - (123456) show only digits, no precision
0.00 - (123456.78) show only digits, 2 precision
0.0000 - (123456.7890) show only digits, 4 precision
0,000 - (123,456) show comma and digits, no precision
0,000.00 - (123,456.78) show comma and digits, 2 precision
0,0.00 - (123,456.78) shortcut method, show comma and digits, 2 precision
 */
var money = function(format) {
    return function(v, p) {
        if (v == undefined) {
            return "";
        }
        if (v != 0 && !parseFloat(v)) {
            return v;
        }
        return Ext.util.Format.number(v, format);
    };
};

/*
 * boolean isPercent : false, 代表该字段是>0的数字，不需要乘100 : true, 是小数，需要乘100
 */
var percent = function(isPercent) {
    return function(v, p) {
        if (v == undefined) {
            return "";
        }
        if (v != 0 && !parseFloat(v)) {
            return v;
        }
        var value = parseFloat(v);
        if (isPercent) {
            value = value * 100;
        }
        return Ext.util.Format.number(value, '0.00') + '%';
    };

};
/**
 * 利率要求保存4位小数
 */
var ratePercent = function(isRatePercent) {
    return function(v, p) {
        if (v == undefined) {
            return "";
        }
        if (v != 0 && !parseFloat(v)) {
            return v;
        }
        var value = parseFloat(v);
        if (isRatePercent) {
            vaue = value * 100;
        }
        return Ext.util.Format.number(value, '0.0000') + '%';
    };
};
