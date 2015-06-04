jQuery.fn.imageScroller = function(params) {
	var p = params || {
		next : "buttonNext",
		prev : "buttonPrev",
		frame : "viewerFrame",
		child : "a",
		auto : false
	};
	var _btnNext = $("#" + p.next);
	var _btnPrev = $("#" + p.prev);
	var _imgFrame = $("#" + p.frame);
	var _child = p.child;
	var _auto = p.auto;
	var _itv;
	var turnLeft = function() {
		_btnPrev.unbind("click", turnLeft);
		if (_auto)
			autoStop();
		_imgFrame.animate({
			marginLeft : -95
		}, 'fast', '', function() {
			_imgFrame.find(_child + ":first").appendTo(_imgFrame);
			_imgFrame.css("marginLeft", 0);
			_btnPrev.bind("click", turnLeft);
			if (_auto)
				autoPlay();
		});
	};
	var turnRight = function() {
		_btnNext.unbind("click", turnRight);
		if (_auto)
			autoStop();
		_imgFrame.find(_child + ":last").clone().show().prependTo(_imgFrame);
		_imgFrame.css("marginLeft", -95);
		_imgFrame.animate({
			marginLeft : 0
		}, 'fast', '', function() {
			_imgFrame.find(_child + ":last").remove();
			_btnNext.bind("click", turnRight);
			if (_auto)
				autoPlay();
		});
	};
	_btnNext.css("cursor", "hand").click(turnRight);
	_btnPrev.css("cursor", "hand").click(turnLeft);
	var autoPlay = function() {
		_itv = window.setInterval(turnLeft, 9999999999);
	};
	var autoStop = function() {
		window.clearInterval(_itv);
	};
	if (_auto)
		autoPlay();
};

$(function () {
    $("#listBox").imageScroller({
        next: "btnNext",
        prev: "btnPrev",
        frame: "list",
        child: "li",
        auto: true
    });
});