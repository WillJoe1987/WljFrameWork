Ext.ns('loan.util');
loan.util.formulas = {
	TOTAL_INT : {
		fields : ['FK_AMT' , 'INT_YEAR'],
		fn : function(TOTAL_BJ , INT_YEAR){
			return TOTAL_BJ * INT_YEAR;
		}
	},
	Y_XYPG_FEE : {
		fields : ['FK_AMT' , 'XYPG_RATE'],
		fn : function(TOTAL_BJ , XYPG_RATE){
			return TOTAL_BJ * XYPG_RATE;
		}
	},
	TOTAL_BJ : {
		fields : ['FK_AMT'],
		fn : function(FK_AMT){
			return FK_AMT;
		}
	},
	checkEnable : function(f){
		var formula = loan.util.formulas[f];
		if(!formula){
			Ext.error('No target!');
			return false;
		}
		if(!formula.fields || !Ext.isArray(formula.fields) || formula.fields.length == 0){
			Ext.error('No factor fields!');
			return false;
		}
		if(!Ext.isFunction(formula.fn)){
			Ext.error('No excutable function!');
			return false;
		}
		return true;
	},
	excute : function(target){
		if(!loan.util.formulas.checkEnable(target)){
			return false;
		}
		var formula = loan.util.formulas[target];
		var fieldsObjects = [];
		var _this = this;
		var form = _this.getForm();
		try{
			Ext.each(formula.fields, function(name){
				fieldsObjects.push(form.findField(name).getValue());
			});
			var result = false;
			result = formula.fn.apply(formula,fieldsObjects);
			form.findField(target).setValue(result);
		}catch(we){
			Ext.debug(we);
			Ext.error('Find factor field error!');
			return false;
		}
	},
	getTargetsByFactor : function(factor){
		var formulasArr  = [];
		for(formulas in loan.util.formulas){
			if(Ext.isObject(loan.util.formulas[formulas]) && Ext.isArray(loan.util.formulas[formulas].fields) && loan.util.formulas[formulas].fields.indexOf(factor)>=0){
				formulasArr.push(formulas);
			}
		}
		return formulasArr;
	},
	buildResult : function(factor){
		var formulas = loan.util.formulas.getTargetsByFactor(factor);
		var _this = this;
		Ext.each(formulas, function(fml){
			loan.util.formulas.excute.call(_this, fml);
		});
	}
};
loan.util.config = {
	rateYearA : .02,
	rateYearB : .03,
	rateYearC : .04,
	XYPGFLA : .02,
	XYPGFLB : .03,
	XYPGFLC : .04
};
loan.util.orgDepartmentIds = {
	xinshen : 506,
	renli : 505,
	cuishou : 504,
	fawu : 503,
	caiwu : 502,
	zongkong : 501,
	findByBelongType : function(type){
		if(type == "0"){
			return loan.util.orgDepartmentIds['xinshen'];
		}else if(type == "1"){
			return loan.util.orgDepartmentIds['cuishou'];
		}else if(type == "2"){
			return loan.util.orgDepartmentIds['cuishou'];
		}else if(type == "3"){
			return loan.util.orgDepartmentIds['fawu'];
		}else {
			return false;
		}
	}
};
