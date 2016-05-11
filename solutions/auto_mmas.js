(function () {
    // 文件输入
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
    })("30cities.csv");
    // 算法
    function mmas_tsp(sites) {
        /** 定义：
         *  变量与函数
         */
        var M, N, T = 300, SITES = sites, RHO = 1,
            ALPHA = 1, BETA = 7, RHO_MIN = 0.5,
            MAX = 10, MIN = 2, Q = 10,
            D = [], TAU = [],
            tabus = [], allowed = [], site = [],
            best_ant, l_len = [], l_rout = [], g_len = [], g_rout = [],
            p, path_lengthes = [];

        N = SITES.length;
        M = N;
        // 计算两点间距离
        function tp_dist(x, y) {
            return Math.sqrt(Math.pow((SITES[x][0] - SITES[y][0]), 2) +
                Math.pow((SITES[x][1] - SITES[y][1]), 2));
        }
        // 计算一条路径的长度
        function rout_dist(rout) {
            var len = rout.length;
            if (len < 2) {
                return;
            }
            else {
                var pathLength = 0;
                for (var i = 0; i < len - 1; i++) {
                    pathLength += D[rout[i]][rout[i + 1]];
                }
                return pathLength;
            }
        }
        // 计算边（i，j）的eta值
        function eta(i, j) {
            var x = 1 / D[i][j];
            if (isNaN(x)) {
                throw new Error('eta is not a number');
            }
            return x;
        }
        // 转移概率（分子部分）
        function pk(i, j) {
            var x;
            if (i == j) {
                return 0;
            }
            else {
                x = Math.pow(TAU[i][j], ALPHA) * Math.pow(eta(i, j), BETA);
                if (isNaN(x)) {
                    throw new Error('pk is not a number');
                }
                return x;
            }
        }
        // 数组求和
        function sum(a) {
            var sum = 0;
            for (var i = 0; i < a.length; i++) {
                sum += a[i];
            }
            return sum;
        }
        // 生成一个随机数，返回其在一组区间中的位置（选择下一站点）
        function chose(p) {
            var r = Math.random(), z = 0;
            for (var i = 0; i < p.length; i++) {
                z += p[i];
                if (r < z) {
                    return i;
                }
            }
        }
        // 返回数组中最小值的索引
        function select_min(a) {
            var min = a[0], index = 0;
            for (var i = 1; i < a.length; i++) {
                if (min > a[i]) {
                    min = a[i];
                    index = i;
                }
            }
            return index;
        }
        // 移动蚂蚁k到站点j
        function move_to(ant_k, site_j) {
            site[ant_k] = site_j;
            tabus[ant_k].push(site_j);
            allowed[ant_k][site_j] = false;
        }
        // capacity, travel, giveup, allowed, tabus, site
        function ants_redefine() {
            for (i = 0; i < M; i++) {
                tabus[i] = [];
                allowed[i] = [];
                site[i] = 0;
                for (j = 0; j < N; j++) {
                    allowed[i][j] = true;
                }
            }
            // console.log('tabus: ' + tabus);
            // console.log('allowed: ' + allowed);
            // console.log('capacity: ' + capacity);
            // console.log('travel: ' + travel);
            // console.log('giveup: ' + giveup);
            // console.log('site: ' + site);           
        }

        /** 开始：
         *  算法执行
         */
        // 距离矩阵，信息素矩阵初始化
        for (var i = 0; i < N; i++) {
            D[i] = [];
            TAU[i] = [];
            for (var j = 0; j < N; j++) {
                D[i][j] = tp_dist(i, j);
                TAU[i][j] = MAX;
            }
        }
        // console.log("tau: " + TAU);
        // console.log("D: " +D);
        // 初始化禁忌表矩阵等相关数据
        ants_redefine();
        // console.time('time');
        // 主循环
        var p_sum = 0, next_site, n,
            delta_tau = 0, new_tau = 0;

        for (var t = 0; t < T; t++) {
            //console.log('第 ' + t + ' 次循环： ');
            // 随机选择起点 
            for (var i = 0; i < M; i++) {
                move_to(i, Math.round(Math.random() * (N - 1)));
            }
            // 构建禁忌表矩阵
            //console.time('tabus');
            for (var ant_k = 0; ant_k < M; ant_k++) {
                n = 1;
                while (n < N) {
                    //console.log('n: ' + n);
                    // 概率区间列表
                    p = (function (ant_k) {
                        var p = [];
                        for (var j = 0; j < N; j++) {
                            if (allowed[ant_k][j]) {
                                p[j] = pk(site[ant_k], j);
                            }
                            else {
                                p[j] = 0;
                            }
                        }
                        if (sum(p) == 0) {
                            throw new Error('p is zero list');
                        }
                        else if (isNaN(sum(p))) {
                            throw new Error('sum p is not a number');
                        }
                        return p;
                    })(ant_k);
                    p_sum = sum(p);
                    //console.log(' p_sum: ' + p_sum)
                    for (var i = 0; i < p.length; i++) {
                        p[i] /= p_sum;
                    }
                    // 随机选择区间
                    next_site = chose(p);
                    //console.log(' after sum: ' + p);
                    move_to(ant_k, next_site);
                    // 循环
                    n++;
                }
            }
            //console.log('n: ' + n);
            //console.timeEnd('tabus');
            // 计算循环最短路径
            for (ant_k = 0; ant_k < M; ant_k++) {
                path_lengthes[ant_k] = rout_dist(tabus[ant_k]);
            }
            best_ant = select_min(path_lengthes);
            l_len[t] = path_lengthes[best_ant];
            l_rout[t] = tabus[best_ant];
            // 更新全局最短路径
            if (l_len[t] < g_len[t - 1] || t - 1 < 0) {
                g_len[t] = l_len[t];
                g_rout[t] = l_rout[t];
            }
            else {
                g_len[t] = g_len[t - 1];
                g_rout[t] = g_rout[t - 1];
            }

            (function () {
                var N = 10;
                if (RHO > RHO_MIN && t > N && g_len[t] >= g_len[t - N]) {
                    // 衰减系数更新
                    if (RHO * 0.95 > RHO_MIN) {
                        RHO *= 0.95;
                    }
                    else {
                        RHO = RHO_MIN;
                    }
                }
            })();
            // 信息素衰减        
            for (var i = 0; i < N; i++) {
                for (var j = 0; j < N; j++) {
                    new_tau = TAU[i][j] * RHO;
                    // 信息素强度应大于MIN
                    if (new_tau < MIN) {
                        TAU[i][j] = MIN;
                    }
                    else {
                        TAU[i][j] = new_tau;
                    }
                }
            }
            // 计算信息素增量
            delta_tau = Q / l_len[t];
            // 最优解路径上信息素增加
            (function () {
                var r = l_rout[t], a, b;
                for (var i = 0; i < r.length - 2; i++) {
                    a = r[i];
                    b = r[i + 1];
                    new_tau = TAU[a][b] + delta_tau;
                }
                if (new_tau > MAX) {
                    TAU[a][b] = MAX;
                    TAU[b][a] = MAX;
                }
                else {
                    TAU[a][b] = new_tau;
                    TAU[b][a] = new_tau;
                }
            })();
            // 重置禁忌表矩阵，allowed矩阵
            ants_redefine();
        }
        // console.timeEnd('time');
        //console.log("g_len: " + g_len);
        // 返回结果
        return {
            path: g_len[T - 1],
            routine: g_rout[T - 1]
        };
    }
    // 执行次数
    console.log("mmas for tsp is running ... ");
    var output = [];
    for (var i = 0; i < 10; i++) {
        console.time("time");
        output[i] = mmas_tsp(sites);
        console.timeEnd("time");
    }
    // 统计输出
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