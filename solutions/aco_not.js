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
