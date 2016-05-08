// var

function read() {
    var rf = require("fs");
    var data = rf.readFileSync("E:/Users/Desktop/aco/problems/20cities.csv", "utf-8");
    data = data.split("\r\n");
    for (var i = 0; i < data.length; i++) {
        data[i] = data[i].split(",");
        for (var j = 0; j < data[i].length; j++) {
            data[i][j] = parseFloat(data[i][j]);
        }
    }
    console.log(data);
    console.log("Type of Data is: " + typeof (data));
}

(function () {
    var rf = require("fs");
    var data = rf.readFileSync("E:/Users/Desktop/aco/problems/vip.csv", "utf-8");
    data = data.split("\r\n");

    console.log(data);
    for (var i = 0; i < data.length; i++) {
        rf.appendFile('message.txt', "\'"+data[i]+"\',\r\n", function (err) {
            if (err) throw err;
            console.log('The "data to append" was appended to file!'); //数据被添加到文件的尾部
        });
    }

})();
// var c, i;
// var N = 20;
// for (i = 0; i < 300; i++) {
//     c = Math.round(Math.random() * (N - 1));
//     console.log(c);
// }


// var me = (function () {
//     var n = 10,
//         m = 11,
//         t = 12;      
//     function read_n() {
//         return n;
//     }
//     function chage_n(x) {
//         n = x;
//     }
//     function run(f) {
//         var c = n + m;
//         f();
//     }
//     return {
//         read_n: read_n,
//         run: run,
//         change_n: chage_n,
//     }
// })();
// function f() {
//     console.log(t)
// }
// console.log(me.run())