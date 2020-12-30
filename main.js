const light = require("./index").light;

const compiler = new light({
	file_name:["bundle.main.js"],
	path: "bin/",
	content: [""],
	config:{
		src: ["my-jss.js"]
	}
});

compiler.watch();
compiler.init();