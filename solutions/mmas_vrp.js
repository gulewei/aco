(function () {
    console.log(' MMAS for VRP is running ... ');
    var sites, site_1, amounts_1, amounts, output = [];

    sites_1 = [[14.5, 13.0],
        [12.8, 8.5],
        [18.4, 3.4],
        [15.4, 16.6],
        [18.9, 15.2],
        [15.5, 11.6],
        [3.9, 10.6],
        [10.6, 7.6],
        [8.6, 8.4],
        [12.5, 2.1],
        [13.8, 5.2],
        [6.7, 16.9],
        [14.8, 2.6],
        [1.8, 8.7],
        [17.1, 11],
        [7.4, 1],
        [0.2, 2.8],
        [11.9, 19.8],
        [13.2, 15.1],
        [6.4, 5.6],
        [9.6, 14.8]];
    amounts_1 = [0,
        0.1,
        0.4,
        1.2,
        1.5,
        0.8,
        1.3,
        1.7,
        0.6,
        1.2,
        0.4,
        0.9,
        1.3,
        1.3,
        1.9,
        1.7,
        1.1,
        1.5,
        1.6,
        1.7,
        1.5];
    sites = [[18, 54], [22, 60], [58, 69], [71, 71], [83, 46], [91, 38], [24, 42], [18, 40]];
    amounts = [0, 0.89, 0.14, 0.28, 0.33, 0.21, 0.41, 0.57];

    var vrp_32 = [82, 76, 0,
        96, 44, 19,
        50, 5, 21,
        49, 8, 6,
        13, 7, 19,
        29, 89, 7,
        58, 30, 12,
        84, 39, 16,
        14, 24, 6,
        2, 39, 16,
        3, 82, 8,
        5, 10, 14,
        98, 52, 21,
        84, 25, 16,
        61, 59, 3,
        1, 65, 22,
        88, 51, 18,
        91, 2, 19,
        19, 32, 1,
        93, 3, 24,
        50, 93, 8,
        98, 14, 12,
        5, 42, 4,
        42, 9, 8,
        61, 62, 24,
        9, 97, 24,
        80, 55, 2,
        57, 69, 20,
        23, 15, 15,
        20, 70, 2,
        85, 60, 14,
        98, 5, 9]
    var vrp_32_amount = [
        0,
        19,
        21,
        6,
        19,
        7,
        12,
        16,
        6,
        16,
        8,
        14,
        21,
        16,
        3,
        22,
        18,
        19,
        1,
        24,
        8,
        12,
        4,
        8,
        24,
        24,
        2,
        20,
        15,
        2,
        14,
        9]
    function mmas_vrp(sites, amounts) {
        /** 定义：
         *  变量与函数
         */
        var M = 20, N, T = 300, SITES = sites,
            ALPHA = 1, BETA = 5, RHO = 0.75,
            MAX = 10, MIN = 0.01, Q = 100,
            D = [], TAU = [], AMOUNTS = amounts,
            tabus = [], allowed = [], giveup = [],
            capacity = [], site = [], travel = [],
            C = 8, F = 50,
            best_ant, l_len, l_rout = [], g_len, g_rout = [],
            p, path_lengthes = [];

        N = SITES.length;
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
            capacity[ant_k] -= AMOUNTS[site_j];
            travel[ant_k] += D[site[ant_k]][site_j];
            if (travel[ant_k] > F) {
                giveup[ant_k] = true;
            }
        }
        // 使蚂蚁k返回车场
        function back(ant_k) {
            if (travel[ant_k] += D[site[ant_k]][0] > F) {
                giveup[ant_k] = true;
            }
            site[ant_k] = 0;
            tabus[ant_k].push(0);
            capacity[ant_k] = C;
            travel[ant_k] = 0;
        }
        // capacity, travel, giveup, allowed, tabus, site
        function ants_redefine() {
            for (i = 0; i < M; i++) {
                tabus[i] = [];
                allowed[i] = [];
                capacity[i] = C;
                travel[i] = 0;
                giveup[i] = false;
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
                move_to(i, Math.round(Math.random() * (N - 2)) + 1);
            }
            // 构建禁忌表矩阵
            //console.time('tabus');
            for (var ant_k = 0; ant_k < M; ant_k++) {
                n = 1;
                while (n < N - 1) {
                    //console.log('n: ' + n);
                    // 概率区间列表
                    p = (function (ant_k) {
                        var p = [0];
                        for (var j = 1; j < N; j++) {
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
                    // 约束处理
                    if (capacity[ant_k] - AMOUNTS[next_site] > 0) {
                        move_to(ant_k, next_site);
                        // 循环
                        n += 1;
                    }
                    else {
                        back(ant_k);
                    }
                }
            }
            //console.log('n: ' + n);
            //console.timeEnd('tabus');
            // (function tabus_info() {
            //     for (var i = 0; i < M; i++) {
            //         console.log('[' + tabus[i] + ']');
            //     }
            // })();
            // 计算循环最短路径
            for (ant_k = 0; ant_k < M; ant_k++) {
                tabus[ant_k].unshift(0);
                tabus[ant_k].push(0);
                path_lengthes[ant_k] = rout_dist(tabus[ant_k]);
            }
            best_ant = select_min(path_lengthes);
            l_len = path_lengthes[best_ant];
            l_rout = tabus[best_ant];
            //console.log('l_len: ' + l_len);
            // console.log('l_rout: ' + l_rout);
            // 更新全局最短路径
            if (l_len < g_len || g_len == undefined) {
                g_len = l_len;
                g_rout = l_rout;
            }
            // 更新信息素        
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
            delta_tau = Q / l_len; // 信息素增量
            for (var site_i = 0; site_i < l_rout.length - 2; site_i++) {
                new_tau = TAU[l_rout[site_i]][l_rout[site_i + 1]] + delta_tau;
                // 信息素强度应小于MAX
                if (new_tau > MAX) {
                    TAU[l_rout[site_i]][l_rout[site_i + 1]] = MAX;
                }
                else {
                    TAU[l_rout[site_i]][l_rout[site_i + 1]] = new_tau;
                }
            }
            // 重置禁忌表矩阵，allowed矩阵
            ants_redefine();
        }
        // console.timeEnd('time');
        // 返回结果
        return {
            path: g_len,
            routine: g_rout
        };
    }

    for (var i = 0; i < 1; i++) {
        output[i] = mmas_vrp(vrp_32,vrp_32_amount);
    }

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
