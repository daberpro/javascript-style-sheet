const light = require("./index").light;

const compiler = new light({
	file_name:["my-1.css","my-other.css"],
	path: "out/",
	content: ["*{\n\t margin: 0px;\n\t padding:0px;\n}","body{\n\t margin: 0px;\n\t padding:0px;\n}"],
	config:{
		src: ["my-jss.js"]
	}
});


compiler.init();
compiler.watch();