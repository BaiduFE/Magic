/**
 * 重载QUnit部分接口实现批量执行控制功能
 */
(function() {
	if (!QUnit)
		return;
	var ms = QUnit.moduleStart, d = QUnit.done;

	function _d(args /* failures, total */) {
		//默认展开失败用例
		$('li.fail ol').toggle();
		if (parent && parent.brtest) {
			parent.$(parent.brtest).trigger('done', [ new Date().getTime(), {
				failed : args[0],
				passed : args[1]
			}, window._$jscoverage || null ]);
		}
	}
	
	QUnit.moduleStart = function(name,testEnvironment) {
		stop();
		/* 为批量执行等待import.php正确返回 */
		var h = setInterval(function() {
			if (window && window['baidu']) {
				clearInterval(h);
				ms.apply(this, arguments);
				start();
			}
		}, 20);
	};
	
	QUnit.done = function() {
		_d(arguments);
		d.apply(this, arguments);
	};
	
	push = function(result, actual, expected, message) {
    	message = message || (result ? "okay" : "failed");
        QUnit.ok( result, result ? message + ": " + expected : message + ", expected: " + QUnit.jsDump.parse(expected) + " result: " + QUnit.jsDump.parse(actual) );
    };
    approximateEqual = function(actual, expected, difference, message){
    	if(typeof difference == "string"){
    		var message = difference;
    		var difference = 1;
    	}
    	push(Math.abs(parseInt(actual) - parseInt(expected)) <= difference, actual, expected, message);
    };
})();
