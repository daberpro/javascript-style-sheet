const _eval = require("eval");
const beautify = require("js-beautify").js;
const a = `
number width = 100/2;

class orang = {
    pixel width: 100;
    pixel height: 100;
    
}

number height = 100;

class makan = {
     pixel a : 0;

     child:{
       nama: "daber";
     },
}


class buah = {
    a: 0;
}

class nama = {
    pixel width: 100;
    pixel height: 100;

    haiya : {
        ari: {
            ganteng:{
                pixel top: 100;
            },
        },
    },
    google: {
        width : 100;
    },

    google: {
        width : 100;
    },

    facebook:{
        width : 100;
        height: 400;
        background: red;

        solid:{
           color: rgba(250,250,250,0.1);
        },
    },
}

class navbar = {
    string color = "white"; 
    pixel width = 100;
    width: 200;

    umur : {
        ari: {
            ganteng:{
                pixel top: 100;
            },
            width : 100;
            height: 400;
            background: red;
        },
    },
}

`;

function log(a) {
    console.log(a);
}

// Make an object a string that evaluates to an equivalent object
//  Note that eval() seems tricky and sometimes you have to do
//  something like eval("a = " + yourString), then use the value
//  of a.
//
//  Also this leaves extra commas after everything, but JavaScript
//  ignores them.
function convertToText(obj) {
    // create an array that will later be joined into a string.
    const string = [];

    // is object
    //    Both arrays and objects seem to return "object"
    //    when typeof(obj) is applied to them. So instead
    //    I am checking to see if they have the property
    //    join, which normal objects don't have but
    //    arrays do.
    if (typeof(obj) == "object" && (obj.join == undefined)) {
        string.push("{");
        for (const prop in obj) {
            string.push(prop, ": ", convertToText(obj[prop]), ",");
        }
        string.push("}");

        // is array
    } else if (typeof(obj) == "object" && !(obj.join == undefined)) {
        string.push("[");
        for (const prop in obj) {
            string.push(convertToText(obj[prop]), ",");
        }
        string.push("]");

        // is function
    } else if (typeof(obj) == "function") {
        string.push(obj.toString());

        // all other values can be done with JSON.stringify
    } else {
        string.push(JSON.stringify(obj));
    }

    return string.join("");
}

// fungsi ini akan berisi class class yang di deklarasikan
function getClass() {
    const data = a.split(/\s*\n/);
    // variabel ini adalah varibael yang menampung banyak nya jumlah class
    const ClassData = [];
    // variabel ini berisi index dari setiap lokasi string dari setiap value dari data
    let ClassDeclaration = [];
    // ini untuk jumlah class
    let count = 0;
    // variabel ini berisi class class yang telah di ambil
    const revition = [];
    // variabel ini akan berisi string nama class
    const class_name = [];

    for (let x = 0; x < data.length; x++) {
        // mengecek setiap value dari array data yang terdapat string class
        if (data[x].match(/\w*class/) && data[x].match(/\w*{/)) {
            count++;
            ClassData.push(count);
            // di sini mengambil nama kelas
            class_name.push(data[x]);
            ClassDeclaration.push({
                // memasukan lokasi awal string class
                [count]: x,
            });
        } else if (data[x].match(/\w*}/)) {
            // memasukan lokasi akhir string } dari setiap class
            ClassDeclaration.push({
                [count]: x,
            });
        }
    }

    // kita urutkan semua index class nya dari yang terkecil ke yang terbesar
    ClassDeclaration = ClassDeclaration.sort((a, b) => {
        return a - b;
    });

    // kita ambil kelas dari si variabel data berdasarkam index dari ClassData
    for (let x = 0; x < ClassDeclaration.length - 1; x++) {
        for (const y of ClassData) {
            if (ClassDeclaration[x][y]) {
                const clear_class = data.slice(ClassDeclaration[x][y], ClassDeclaration[x + 1][y] + 1);
                const class_property = data.slice(ClassDeclaration[x][y] + 1, ClassDeclaration[x + 1][y]);
                if (clear_class.length > 0) {
                    revition.push(clear_class);
                }
            }
        }
    }

    // variabel ini akan menampung class class yang telah di ambil dan akan
    // di jadikan array
    let class_rev = "";

    // kita ambil setiap class dari variabel revition dan memisahkan setiap class
    for (let i = 0; i < revition.length; i++) {
        if (revition[i].join(" ").match(/\w*[},]/igm).length > 2) {
            revition[i] = [revition[i].join(" ").replace("}", " ")];
        }

        if (revition[i].join(" ").match(/\w*class/igm)) {
            class_rev += "$" + revition[i].join(" ");
        } else {
            class_rev += revition[i].join(" ");
        }
    }

    // kita gunakan js beauty agar sintaks nya lebih rapi
    const class_prop = beautify(class_rev, {
        indent_size: 2,
        space_in_empty_paren: true,
    });

    // kita kembalikan class yang telah di olah dan di jadiin array
    return [class_prop.split("$"), class_name.join("").replace(/\w*{/igm, "\n").replace(/\w*class|=/igm, "").split("\n")];
}

// fungsi ini untuk mengambil property class
function getClassAtribute(ClassM, ClassName) {
    // di sini nama kelasnya di ambil
    const ClassesName = ClassName;
    // kita ambil class nya
    // dan di jadiin array setiap string nya
    const class_dec = ClassM.replace(/\;/igm,";\n").split("\n");
    // kita ambil lokasi index dari string :,{,}
    let count_of_class_prop = 0;
    // kita masukan index dari :,{,} dengan di jadiin object
    const prop = [];
    // kita masukan jumlah index nya
    const prop_count = [];

    //di sini nama class yang udah di olah
    let CLASS_NAME = "otong";

    // console.log(class_dec.join("").match(/\w*class/))

    // kita lakukan filter untuk mengambil index dari property nya
    for (let i = 0; i < class_dec.length; i++) {

        if (class_dec[i].match(/\w*:/) && class_dec[i].match(/\w*{/) || class_dec[i].match(/\w*:/)) {
            count_of_class_prop++;
            prop_count.push(count_of_class_prop);
            if(class_dec[i].match(/\w*:/) && class_dec[i].match(/\w*{/) && !class_dec[i].match(/\w*;/)){
               
               class_dec[i] = CLASS_NAME.replace(/\s*/igm,"")+" "+class_dec[i].replace(/\s*/igm,"");
            }
            prop.push({
                [count_of_class_prop]: i,
            });
        } else if (class_dec[i].match(/\w*},/)) {
            prop.push({
                [count_of_class_prop]: i,
            });
        }

        if (class_dec[i].match(/\w*class/igm)) {
            CLASS_NAME = class_dec[i].replace(/\w*{/igm, "").replace(/\w*class|=/igm, "");
        }
    }

    // di sini semua property di masukan
    const all_prop = [];

    for (let x = 0; x < prop_count.length; x++) {
        for (let y = 0; y < prop.length; y++) {
            if (prop[y][prop_count[x]]) {
                all_prop.push(prop[y][prop_count[x]]);
                // console.log(class_dec[prop[y][prop_count[x]]])
            }
        }
    }

    // di sini kita ambil property class nya dan di jadiin array
    const clear = class_dec.slice(all_prop[0], all_prop[all_prop.length - 1] + 1).join("\n").split("\n");
    console.log(beautify(CLASS_NAME + " = [\n" + clear.join("").replace(/\w*,/igm, "\t").replace(/\;/igm, ";\n").
      replace(/\w*=/igm,":"), {
        indent_size: 2,
        space_in_empty_paren: true,
    }) + "\n]");

    // kita gunakan js beauty agar sintaks nya lebih rapi
    return beautify(clear.join("").replace(/\w*,/igm, "\t").replace(/\;/igm, ";\n").replace(/\w*=/igm,":"), {
        indent_size: 2,
        space_in_empty_paren: true,
    });


}


const CLASS_CLASIFICATION_FROM_JSS = getClass()[0];

for (const x of CLASS_CLASIFICATION_FROM_JSS) {
    getClassAtribute(x);
}

// log(class_clasification_from_jss.join("\n"));