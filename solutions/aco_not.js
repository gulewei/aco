(function () {
    console.log(" aco system is running ... ");
    /** 算法参数 **/
    var args = new Object({
        alpha: 1,
        beta: 5,
        rho: 0.7,
        Q: 100,
        init_tau: 10,
        M: 30,
        T: 300,
        cities: function (path) {
            var root = "E:/Users/Desktop/aco/problems/",
                rf = require("fs"),
                filePath = root + path,
                cities = rf.readFileSync(filePath, "utf-8");

            cities = cities.split("\r\n");
            for (var i = 0; i < cities.length; i++) {
                cities[i] = cities[i].split(",");
                for (var j = 0; j < cities[i].length; j++) {
                    cities[i][j] = parseFloat(cities[i][j]);
                }
            }
            return cities;
        } ("30cities.csv"),
    });
    /** 距离计算方式 **/
    var getDist = new Object({
        tpDist: function (x, y) {
            var cities = args.cities;
            return Math.sqrt(Math.pow((cities[x][0] - cities[y][0]), 2) +
                Math.pow((cities[x][1] - cities[y][1]), 2));
        },
        mapDist: function () {
            // ...
        },
    });
    /* 基本流程 */
    var aco = (function (args) {
        var alpha = args.alpha,
            beta = args.beta,
            rho = args.rho,
            Q = args.Q,
            M = args.M,
            T = args.T,
            ants = [],
            cities = args.cities,
            D = [],
            TAU = [],
            MINPATH, ROUTINE, cycleMinAnt;

        // Class Ant:
        function Ant(N) {
            var site, tabu;
            this.site = site;
            this.tabu = tabu;
            this.move = function (site) {
                this.site = site;
                this.tabu.push(site);
            }
            this.walked = function (i, j) {
                var tabu = this.tabu
                if (Math.abs(tabu.indexOf(i) - tabu.indexOf(j)) == 1) {
                    return true;
                }
                else {
                    return false;
                }
            }
            this.born = function (N) {
                this.tabu = [];
                this.move(Math.round(Math.random() * (N - 1)));
            }
            this.born(N);
        }
        //计算路径长度
        function dist(a) {
            var len = a.length;
            if (len < 2) {
                return;
            }
            else {
                var pathLength = 0;
                for (var i = 0; i < len - 1; i++) {
                    pathLength += D[a[i]][a[i + 1]];
                }
                return pathLength;
            }
        }
        //ETA计算
        function eta(i, j) {
            return 1 / D[i][j];
        }
        // 转移概率（分子部分）
        function pk(i, j) {
            if (i == j) {
                return 0;
            }
            else {
                return Math.pow(TAU[i][j], alpha) *
                    Math.pow(eta(i, j), beta);
            }
        }
        // return delTau of ant(k)
        function delTau(tabu) {
            return Q / dist(tabu);
        }
        // ...
        function run(myAco) {
            var me = myAco;
            var N = cities.length;
            // ...
            for (var i = 0; i < M; i++) {
                ants.push(new Ant(N));
            }
            for (var n = 0; n < N; n++) {
                D.push([]);
                TAU.push([]);
                for (var n2 = 0; n2 < N; n2++) {
                    TAU[n].push(me.init_tau);
                    D[n].push(me.tpDist(n, n2));
                }
            }
            // ...
            for (var t = 0; t < T; t++) {
                me.travel();
                (function () {
                    // 找出循环最优解
                    var pathLengthes = (function () {
                        var pathLengthes = [];
                        for (var i = 0; i < M; i++) {
                            pathLengthes.push(dist(ants[i].tabu));
                        }
                        return pathLengthes;
                    })();
                    var minPath = (function selectMin(a) {
                        var min;
                        for (var i = 0; i < a.length; i++) {
                            if (min > a[i] || min == undefined) {
                                min = a[i];
                            }
                        }
                        // console.log("min: " + min);
                        return min;
                    })(pathLengthes);
                    aco.cycleMinAnt = pathLengthes.indexOf(minPath);
                    //console.log("cycleMinAnt: " + aco.cycleMinAnt);
                    var minRoute = ants[aco.cycleMinAnt].tabu;
                    //console.log("minRoute: " + minRoute);

                    // .更新全局最优解
                    if (MINPATH > minPath || MINPATH == undefined) {
                        MINPATH = minPath;
                        ROUTINE = minRoute;
                    }
                    //console.log("T: " + t + " --MINPATH: " + MINPATH);
                })();
                me.update();
                // clear
                for (i = 0; i < M; i++) {
                    ants[i].born(N);
                }
            }
            console.log(ROUTINE);
            console.log(MINPATH);
            return {
                minpath: MINPATH,
                routine: ROUTINE,
            }
        }
        return {
            D: D,
            TAU: TAU,
            MINPATH: MINPATH,
            ROUTINE: ROUTINE,
            ants: ants,
            dist: dist,
            eta: eta,
            pk: pk,
            delTau: delTau,
            run: run,
            cycleMinAnt: cycleMinAnt,
        }

    })(args);
    /** AS - 蚂蚁系统 **/
    var a_s = new Object({
        init_tau: 10,
        chose: function (ran, arr) {
            // arr.sort(function (a, b) { return b - a; });
            // console.log("arr sorted: " + arr);
            var n_arr = [], index;
            for (var i = 0; i < arr.length; i++) {
                n_arr.push(arr[i]);
                for (var j = i - 1; j >= 0; j--) {
                    n_arr[n_arr.length - 1] += arr[j];
                }
            }
            //console.log("n_arr: " + n_arr);
            for (index = 0; index < n_arr.length; index++) {
                if (ran < n_arr[index]) {
                    return index;
                }
                //console.log("i : " + i);
            }
        },
        travel: function () {
            var nextStop,
                ants = aco.ants,
                N = args.cities.length,
                M = args.M;
            // 为每只蚂蚁构造解决方案
            for (var i = 0; i < M; i++) {
                for (var n = 1; n < N; n++) {
                    nextStop = (function pickCity(ant_k) {
                        var pk_list = [], start = ants[ant_k].site,
                            p;
                        for (var j = 0; j < N; j++) {
                            if (ants[ant_k].tabu.indexOf(j) < 0) {
                                pk_list.push(aco.pk(start, j));
                            }
                            else {
                                pk_list.push(0);
                            }
                        }
                        p = Math.random() * pk_list.reduce(function (a, b) {
                            return a + b
                        });
                        // console.log("p: " + p);
                        // console.log("pk_list: " + pk_list);
                        var zone = a_s.chose(p, pk_list);
                        return zone;
                    })(i);
                    //console.log("ant " + i + " is move to: " + nextStop);
                    ants[i].move(nextStop);
                }
            }
        },
        update: function () {
            // 更新信息素轨迹
            var ants = aco.ants,
                delTau = aco.delTau,
                M = args.M,
                N = args.cities.length,
                del_tou = 0, new_tou;

            for (var i = 0; i < N; i++) {
                for (var j = 0; j < N; j++) {
                    // ...
                    for (var k = 0; k < M; k++) {
                        if (ants[k].walked(i, j)) {
                            del_tou += delTau(ants[k].tabu);
                        }
                    }
                    new_tou = args.rho * aco.TAU[i][j] + del_tou;
                    aco.TAU[i][j] = new_tou;
                }
            }
            //console.log("cycleMinAnt in running : " + aco.cycleMinAnt);
        },
        tpDist: getDist.tpDist,
    });
    /** MMAS - 最大-最小蚂蚁系统 **/
    var mm_as = new Object({
        MAX: 10,
        MIN: 0.01,
        init_tau: 10,
        tpDist: getDist.tpDist,
        travel: a_s.travel,
        update: function () {
            // ...
            var ants = aco.ants,
                minAnt = aco.cycleMinAnt,
                delTau = aco.delTau,
                M = args.M,
                N = args.cities.length,
                del_tou = 0,
                new_tou, a, b;

            var del_tau = delTau(ants[minAnt].tabu);
            for (var i = 0; i < N; i++) {
                for (var j = 0; j < N; j++) {
                    if (ants[minAnt].walked(i, j)) {
                        new_tou = args.rho * aco.TAU[i][j] + del_tou;
                    }
                    else {
                        new_tou = args.rho * aco.TAU[i][j];
                    }
                    aco.TAU[i][j] = new_tou;
                }
            }
        },
    });
    /** 运行（共 i 次）**/
    for (var i = 0; i < 1; i++) {
        console.time("time");
        aco.run(mm_as);
        console.timeEnd("time");
    }
    /** 输出 **/
    // ...
})();

(function () {
    function antcycle_system() {
        /*  PARAMETERS & FUNCTIONS  */
        var N, Q, M, T, D, TAU, alpha, beta, rho, init_tau,
            cites, ants, i, j, k, MINPATH, prob_path, best_path;

        function readIntoArray(path) {
            var rf = require("fs");
            var data = rf.readFileSync(path, "utf-8");
            data = data.split("\r\n");
            for (var i = 0; i < data.length; i++) {
                data[i] = data[i].split(",");
                for (var j = 0; j < data[i].length; j++) {
                    data[i][j] = parseFloat(data[i][j]);
                }
            }
            return data;
        }

        function Ant() {
            var site, tabu;
            this.site = site;
            this.tabu = tabu;
            this.move = function (site) {
                this.site = site;
                this.tabu.push(site);
            }
            this.born = function () {
                this.tabu = [];
                this.move(Math.round(Math.random() * (N - 1)));
            }
            this.delTau = function () {
                return Q / dist(this.tabu);
            }
            this.walked = function (start, stop) {
                if (Math.abs(this.tabu.indexOf(start) - this.tabu.indexOf(stop)) == 1) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
            this.born();
        }

        //计算两点间距离
        function tpDist(x, y) {
            //x, y为城市的序号
            return Math.sqrt(Math.pow((cities[x][0] - cities[y][0]), 2) +
                Math.pow((cities[x][1] - cities[y][1]), 2));
        }

        //计算路径长度
        function dist(a) {
            var len = a.length;
            if (len < 2) {
                return;
            }
            else {
                var pathLength = 0;
                for (var i = 0; i < len - 1; i++) {
                    pathLength += tpDist(a[i], a[i + 1]);
                }
                return pathLength;
            }
        }

        //ETA计算
        function eta(start, stop) {
            return 1 / D[start][stop];
        }

        // 转移概率（分子部分）
        function pk(start, stop) {
            if (start == stop) {
                return 0;
            }
            else {
                return Math.pow(TAU[start][stop], alpha) *
                    Math.pow(eta(start, stop), beta);
            }
        }

        // 选择城市
        function pick(start, ant_k) {
            var p = [], pk_list = [], pk_sum = 0;
            for (var i = 0; i < N; i++) {
                if (ants[ant_k].tabu.indexOf(i) < 0) {
                    pk_list.push(pk(start, i));
                }
                else {
                    pk_list.push(0);
                }
                pk_sum += pk_list[pk_list.length - 1];
            }
            for (i = 0; i < N; i++) {
                p.push(pk_list[i] / pk_sum);
            }
            return chose(p);

            function chose(a) {
                //返回一个数组中最大元素的序号
                var max = 0;
                for (var i = 0; i < a.length; i++) {
                    if (max < a[i] || max == 0) {
                        max = a[i];
                    }
                }
                return a.indexOf(max);
            }
        }

        // 更新一条边的信息素轨迹
        function edgeUpdate(start, stop) {
            var del_tau = 0, new_tou;
            for (var i = 0; i < M; i++) {
                if (ants[i].walked(start, stop)) {
                    del_tau += ants[i].delTau();
                }
            }
            new_tou = rho * TAU[start][stop] + del_tau;
            TAU[start][stop] = new_tou;
        }

        function getMinIndex(a) {
            var min = a[0], index = 0;
            for (var i = 1; i < a.length; i++) {
                if (min > a[i]) {
                    min = a[i];
                    index = i;
                }
            }
            return index;
        }

        /*  SET UP  */
        //初始最短路劲设为 -1
        MINPATH = -1;
        //循环次数
        T = 300;
        //算法参数
        alpha = 1;
        beta = 5;
        rho = 0.7;
        Q = 1;
        //城市初始化
        prob_path = "E:/Users/Desktop/aco/problems/20cities.csv";
        cities = readIntoArray(prob_path);
        N = cities.length;
        //蚁群初始化
        M = N;
        ants = [];
        for (i = 0; i < M; i++) {
            ants.push(new Ant());
        }
        //矩阵D，储存每条边的长度
        //矩阵TAU, 储存每条边的信息素强度
        D = [];
        TAU = [];
        init_tau = 10;
        for (i = 0; i < N; i++) {
            D.push([]);
            TAU.push([]);
            for (j = 0; j < N; j++) {
                D[i].push(tpDist(i, j));
                TAU[i].push(init_tau);
            }
        }
        console.time("time");
        /*  MAIN  */
        var min, pathLength, nextStop;
        //每次循环
        for (var z = 0; z < T; z++) {
            //console.log("第" + z + "次循环: ");
            for (j = 0; j < N - 1; j++) {
                //每只蚂蚁	
                for (k = 0; k < M; k++) {
                    //选择下一个城市
                    nextStop = pick(ants[k].site, k);
                    //选择城市，更新位置,禁忌表
                    ants[k].move(nextStop);
                }
            }
            //找出最短路径
            pathLength = [];
            for (j = 0; j < M; j++) {
                pathLength.push(dist(ants[j].tabu));
                //console.log(ants[j].tabu);
            }
            min = pathLength[getMinIndex(pathLength)];
            best_path = ants[getMinIndex(pathLength)].tabu;
            //console.log("当前最短路径: " + best_path);
            //更新最短路径
            if (min < MINPATH || MINPATH < 0) {
                MINPATH = min;
                best_path = ants[getMinIndex(pathLength)].tabu;
            }
            //console.log("当前最短路径: " + best_path);
            //console.log("当前距离： " + MINPATH);
            //更新新信息素
            for (j = 0; j < N; j++) {
                for (k = 0; k < N; k++) {
                    edgeUpdate(j, k);
                }
            }
            //清空禁忌表
            for (j = 0; j < M; j++) {
                ants[j].born();
            }
        }
        //输出结果
        console.log(best_path);
        console.log(MINPATH);
        console.timeEnd("time");
    }
    // console.log(" antcycle_system is running ... ");
    // for (var i = 0; i < 10; i++) {
    //     antcycle_system();
    // }
})();

(function () {
    function mm_ant_system(prob) {
        /*  PARAMETERS & FUNCTIONS  */
        var root = "E:/Users/Desktop/aco/problems/"
        var N, Q, M, T, D, TAU, alpha, beta, rho, MAX, MIN,
            cites, ants, i, j, k, MINPATH, prob_path, best_ant;

        /*  SET UP  */
        //初始最短路劲设为 -1
        MINPATH = -1;
        //循环次数
        T = 300;
        //算法参数
        alpha = 1;
        beta = 5;
        rho = 0.7;
        Q = 1;
        //城市初始化
        prob_path = root + prob;
        cities = readIntoArray(prob_path);
        N = cities.length;
        //蚁群初始化
        M = N;
        ants = [];
        for (i = 0; i < M; i++) {
            ants.push(new Ant());
        }
        //矩阵D，储存每条边的长度
        //矩阵TAU, 储存每条边的信息素强度
        D = [];
        TAU = [];
        MAX = 10;
        MIN = 0;
        for (i = 0; i < N; i++) {
            D.push([]);
            TAU.push([]);
            for (j = 0; j < N; j++) {
                D[i].push(tpDist(i, j));
                TAU[i].push(MAX);
            }
        }

        function readIntoArray(path) {
            var rf = require("fs");
            var data = rf.readFileSync(path, "utf-8");
            data = data.split("\r\n");
            for (var i = 0; i < data.length; i++) {
                data[i] = data[i].split(",");
                for (var j = 0; j < data[i].length; j++) {
                    data[i][j] = parseFloat(data[i][j]);
                }
            }
            return data;
        }

        function Ant() {
            var site, tabu;
            this.site = site;
            this.tabu = tabu;
            this.move = function (site) {
                this.site = site;
                this.tabu.push(site);
            }
            this.born = function () {
                this.tabu = [];
                this.move(Math.round(Math.random() * (N - 1)));
            }
            this.delTau = function () {
                return Q / dist(this.tabu);
            }
            this.walked = function (start, stop) {
                if (Math.abs(this.tabu.indexOf(start) - this.tabu.indexOf(stop)) == 1) {
                    return 1;
                }
                else {
                    return 0;
                }
            }

            this.born();
        }

        //计算两点间距离
        function tpDist(x, y) {
            //x, y为城市的序号
            return Math.sqrt(Math.pow((cities[x][0] - cities[y][0]), 2) +
                Math.pow((cities[x][1] - cities[y][1]), 2));
        }

        //计算路径长度
        function dist(a) {
            var len = a.length;
            if (len < 2) {
                return;
            }
            else {
                var pathLength = 0;
                for (i = 0; i < len - 1; i++) {
                    pathLength += tpDist(a[i], a[i + 1]);
                }
                return pathLength;
            }
        }

        //ETA计算
        function eta(start, stop) {
            return 1 / D[start][stop];
        }

        // 转移概率（分子部分）
        function pk(start, stop) {
            if (start == stop) {
                return 0;
            }
            else {
                return Math.pow(TAU[start][stop], alpha) *
                    Math.pow(eta(start, stop), beta);
            }
        }

        function compare(num1, num2) {
            return num1 - num2;
        }

        // 选择城市
        function pick(start, ant_k) {
            var p = [], pk_list = [], pk_sum = 0;
            for (i = 0; i < N; i++) {
                if (ants[ant_k].tabu.indexOf(i) < 0) {
                    pk_list.push(pk(start, i));
                }
                else {
                    pk_list.push(0);
                }
                pk_sum += pk_list[pk_list.length - 1];
            }
            for (i = 0; i < N; i++) {
                p.push(pk_list[i] / pk_sum);
            }
            return chose(p);

            function chose(a) {
                //返回一个数组中最大元素的序号
                var max = 0;
                for (i = 0; i < a.length; i++) {
                    if (max < a[i] || max == 0) {
                        max = a[i];
                    }
                }
                return a.indexOf(max);
            }
        }

        // 更新信息素轨迹
        function edgeUpdate(start, stop) {
            //check border
            if (TAU[start][stop] > MIN && TAU[start][stop] < MAX) {
                var del_tau = 0, new_tou;
                // 
                if (ants[best_ant].walked(start, stop)) {
                    del_tau += ants[best_ant].delTau();
                }
                // 
                new_tou = rho * TAU[start][stop] + del_tau;
                //check border then update
                if (new_tou > MAX) {
                    TAU[start][stop] = MAX;
                }
                else if (new_tou < MIN) {
                    TAU[start][stop] = MIN;
                }
                else {
                    TAU[start][stop] = new_tou;
                }
            }
        }

        /*  MAIN  */
        //每次循环
        console.time("MMAT(time)")
        for (var z = 0; z < T; z++) {
            //每一步
            for (j = 0; j < N - 1; j++) {
                //console.log("    第" + j + "步: ");
                //每只蚂蚁	
                for (k = 0; k < M; k++) {
                    //console.log("        第" + k + "只蚂蚁: ");
                    //选择下一个城市
                    var nextStop = pick(ants[k].site, k);
                    //console.log("            chose city " + nextStop + " as his next stop");
                    //选择城市，更新位置,禁忌表
                    ants[k].move(nextStop);
                }
            }
            //找出最短路径
            var min, pathLength;
            pathLength = [];
            for (j = 0; j < M; j++) {
                pathLength.push(dist(ants[j].tabu));
            }
            function chose(a) {
                //the index of MIN
                var min = 0;
                for (var i = 0; i < a.length; i++) {
                    if (min > a[i] || min == 0) {
                        min = a[i];
                    }
                }
            }
            best_ant = chose(pathLength);  // store the index of best ant
            pathLength.sort(compare);
            min = pathLength[0];
            //更新最短路径
            if (min < MINPATH || MINPATH < 0) {
                MINPATH = min;
            }
            //console.log("当前最短路径： " + MINPATH);
            //更新新信息素
            for (j = 0; j < N; j++) {
                for (k = 0; k < N; k++) {
                    edgeUpdate(j, k);
                }
            }
            //清空禁忌表
            for (j = 0; j < M; j++) {
                ants[j].born();
            }
        }
        console.timeEnd("MMAT(time)")
        //输出结果
        console.log(MINPATH);
    }
    //console.log(" MM_ant_system is running ... ");
    prob = "att48.csv"
    for (var i = 0; i < 1; i++) {
        //mm_ant_system(prob);
    }
})();
