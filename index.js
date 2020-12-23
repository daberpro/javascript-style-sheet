
const fs = require("fs");
const path = require("path");
const url = require("url");

//membuat class yang akan menyimpan si compiler
class compiler{
	//set contructor untuk mengambil config
	constructor(args){
		//menambahkan property dari compiler
		this._path = args.path;
		this._file_name = args.file_name;
		this.config = args.config;
		this.content = args.content;
	}

	//membuat fungsi inisialisasi
	init(){
		//membuat file
		//kemudian melakukan pengecekan apakah
		//file nya sudah ada apa belum
		if(this._file_name instanceof Array){

			if(this.content instanceof Array){
				for(let x in this._file_name){
					fs.open(this._path+this._file_name[x],"w+",(err,data)=>{

						if(err){
							throw err;
						}

						// tulis konten ke file
					    fs.writeFile(data, this.content[x], (err) => {
					        if (err) throw err;
					        console.log('Saved!');
					    }); 

					    // baca file
					    fs.readFile(data, (err, data) => {
					        if (err) throw err;
					        console.log(data.toString('utf8'));
					    });

					});
				}
			}else{
				for(let x in this._file_name){
					fs.open(this._path+this._file_name[x],"w+",(err,data)=>{

						if(err){
							throw err;
						}

						// tulis konten ke file
					    fs.writeFile(data, this.content, (err) => {
					        if (err) throw err;
					        console.log('Saved!');
					    }); 

					    // baca file
					    fs.readFile(data, (err, data) => {
					        if (err) throw err;
					        console.log(data.toString('utf8'));
					    });

					});
				}
			}

		}else{
			fs.open(this._path+this._file_name,"w+",(err,data)=>{

				if(err){
					throw err;
				}

				// tulis konten ke file
			    fs.writeFile(data, this.content, (err) => {
			        if (err) throw err;
			        console.log('Saved!');
			    }); 

			    // baca file
			    fs.readFile(data, (err, data) => {
			        if (err) throw err;
			        console.log(data.toString('utf8'));
			    });

			});
		}
	}

	watch(){
		if(this.config.src instanceof Array){
			for(let x in this.config.src){
				fs.readFile("src/"+this.config.src[x],(err,file)=>{
					let data_source = file.toString("utf-8");
					let data_format = data_source.split(/\s*\n/igm);

					// console.log(data_format);

					let light = {
						variabel: ()=>{

							let _variabel_declaration = [];
							let _final_declaration = [];
							let _content_declaration = [];
							for(let x in data_format){
								_variabel_declaration.push(data_format[x].split("="));
							}

							for(let x in _variabel_declaration){
								for(let y in _variabel_declaration[x]){
									if(_variabel_declaration[x][y].match(/\s*[{}$:]/igm)){

										_content_declaration.push(_variabel_declaration[x][y]);
									}
									if(_variabel_declaration[x][y].match(/\let*|var*|const*/igm)){

										_final_declaration.push(_variabel_declaration[x]);
									};
								}
							}

							let fill = _content_declaration.join("").split("$");
							fill.splice(fill.length-1,fill.length);
							let fill_position = -1;

							_content_declaration.forEach((i)=>{
								for(let x in _final_declaration){
									for(let y in _final_declaration[x]){
										if(_final_declaration[x][y] === i){
											fill_position++;
											_final_declaration[x][y] =fill[fill_position];

										}
									}
								}
							});

							return [...new Set(_final_declaration)];
		
						}
					}

					console.log(light.variabel());
				});	
			}
		}else{
			fs.readFile("src/"+this.config.src[x],(err,file)=>{
				console.log(file.toString("utf-8"));
			});
		}
	}
}

exports.light = compiler;