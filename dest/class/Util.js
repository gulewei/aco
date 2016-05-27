function sort(a) {
    var b = [];
    // copy
    for (var i = 0; i < a.length; i++) {
        b[i] = a[i];
    }
    // a < b
    return b.sort(function (a, b) {
        return a - b;
    });
}
function read(path) {
    var rf = require("fs");
    var root = "./problems/";
    var data = rf.readFileSync(root + path, "utf-8");
    data = data.split("\r\n");
    for (var i = 0; i < data.length; i++) {
        data[i] = data[i].split(",");
        for (var j = 0; j < data[i].length; j++) {
            data[i][j] = parseFloat(data[i][j]);
        }
    }
    return data;
}
function selectMin(a) {
    var min = a[0], index = 0;
    for (var i = 1; i < a.length; i++) {
        if (min > a[i]) {
            min = a[i];
            index = i;
        }
    }
    return index;
};
exports.sort = sort;
exports.read = read;
exports.selectMin = selectMin;