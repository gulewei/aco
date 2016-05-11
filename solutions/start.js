(function () {
    /**
     *  问题输入：
     *  参数 problem:  problems中文件名， 
     *  如：var problem = "20cities.csv"
     */
    var problem = "30cities.csv";
    var sites = (function (path) {
        var rf = require("fs");
        var root = "E:/Users/Desktop/Huan/aco/problems/";
        var data = rf.readFileSync(root + path, "utf-8");
        data = data.split("\r\n");
        for (var i = 0; i < data.length; i++) {
            data[i] = data[i].split(",");
            for (var j = 0; j < data[i].length; j++) {
                data[i][j] = parseFloat(data[i][j]);
            }
        }
        return data;
    })(problem);

    /**
     *  算法程序：
     *  定义 MMAS 算法程序，在算法调用中执行
     */
    var solution = "mmas_tsp.js";
    var aco = require("E:/Users/Desktop/Huan/aco/solutions/" + solution);

    /**
     *  算法调用：
     *  参数 T: 算法执行次数
     *  参数 args: {
     *       alpha: 累积因素,
     *       beta: 启发因素,
     *       rho: 衰减剩余系数,
     *       max: 信息素强度最大值,
     *       min: 最小值,
     *       loop: 循环次数
     *       }
     */
    var T = 1;      // 参数 T，用于修改算法执行次数  
    var args = {    // 参数args，用于修改一系列算法参数
        alpha: 1,
        beta: 9,
        rho: 0.7,
        max: 10,
        min: 0.01,
        loop: 300
    };

    /**
     * 执行
     */
    console.log("%s for tsp is running ... ", aco.name);
    var output = [];
    for (var i = 0; i < T; i++) {
        console.time("循环" + (i + 1) + "，耗时：");
        output[i] = aco.run(sites, args);
        console.timeEnd("循环" + (i + 1) + "，耗时：");
    }

    /**
     *  统计输出：
     *  输出运行时间，运行次数， 平均解值， 最优解值， 最优解
     */
    (function output_info(o) {
        var pathes = [], sum = 0, min;
        for (var i = 0; i < o.length; i++) {
            // console.log('path: ' + o[i].path);
            // console.log('routine: ' + o[i].routine);
            pathes[i] = o[i].path;
            sum += pathes[i];
        }
        min = (function (a) {
            var min;
            for (var i = 0; i < a.length; i++) {
                if (min > a[i] || min == undefined) {
                    min = a[i];
                }
            }
            if (min == undefined) {
                throw new Error('undefined min');
            }
            return min;
        })(pathes);
        console.log('运行次数：' + o.length + ' ，结果如下：')
        console.log('平均值: ' + sum / o.length);
        console.log('最小值: ' + min);
        console.log('移动顺序: ' + o[pathes.indexOf(min)].routine);
    })(output);
})();