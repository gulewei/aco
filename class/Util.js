var Util = (function () {
    "use  strict";
    function Util() {
        // ...
    }
    Object.prototype.sort = function (a) {
        var b = [];
        // copy
        for (var i = 0; i < a.length; i++) {
            b[i] = a[i];
        }
        // a < b
        return b.sort(function (a, b) {
            return a - b;
        });
    };
    Object.prototype.read = function (path) {
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
    };
    Object.prototype.selectMin = function (a) {
        var min = a[0], index = 0;
        for (var i = 1; i < a.length; i++) {
            if (min > a[i]) {
                min = a[i];
                index = i;
            }
        }
        return index;
    };
    Object.prototype.min = function (a) {
        var min;
        for (var i = 0; i < a.length; i++) {
            //noinspection JSUnusedAssignment
            if (min > a[i] || min === undefined) {
                min = a[i];
            }
        }
        if (min === undefined) {
            throw new Error('undefined min');
        }
        return min;
    };
    Object.prototype.info = function (o) {
        var pathes = [], firsts = [], routs = [], sum = 0, sfirst = 0;
        for (i = 0; i < o.length; i++) {
            pathes[i] = Util.min(o[i].len);
            routs[i] = Util.min(o[i].rout);
            firsts[i] = Util.selectMin(o[i].len);
            sum += pathes[i];
            sfirst += firsts[i];
        }
        var min_pathes = Util.min(pathes);
        var min_firsts = Util.min(firsts);
        console.log('运行次数：' + o.length + ' ，结果如下：');
        console.log('平均值（最优解）: ' + sum / o.length);
        console.log('最小值（最优解）: ' + min_pathes);
        console.log('平均值（最早出现）: ' + sfirst / o.length);
        console.log('最小值（最早出现）: ' + min_firsts);
        console.log('移动顺序: ' + routs[pathes.indexOf(min_pathes)]);
    };
    Object.prototype.n_times_run = function (times, maco) {
        var o = [];
        for (var i = 0; i < times; i++) {
            console.time("> 算法运行第" + (i + 1) + "次，耗时");
            o[i] = maco();
            console.timeEnd("> 算法运行第" + (i + 1) + "次，耗时");
        }
        this.info(o);
    };
    return Util;
} ());
exports.Util = Util;