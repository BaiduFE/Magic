module("baidu");

test("version check", function(){
	equals(baidu.version, "2.0", "version check");
});