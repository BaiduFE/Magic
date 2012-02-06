

function exec(dom){
    var cmd = dom.getAttribute("cmd");
    try{
    	eval(parseCmd(cmd));
    }catch(e){
    	window.alert("参数出错啦！");
    }
}

function parseCmd(cmd){
	var params = cmd.match(/#\{\w+\}/g) || [];
	var obj = {};
	for(var i = 0, name, param, l = params.length; i < l; i ++){
		param = params[i];
		if(name = /#\{(\w+)\}/.test(param) && RegExp.$1)
		    obj[name] = getValue(name);
	}
	cmd = baidu.string.format(cmd, obj);
	return cmd;
}

function getValue(dom){
    return document.getElementById(dom).value;
}