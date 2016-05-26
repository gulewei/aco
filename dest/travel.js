/**
 * Tour
 */
var Travel = (function () {
    "use strict";
    function Travel(ants, map, tau, alpha, beta) {
        this.ants = ants;
        this.map = map;
        this.tau = tau;
        this.alpha = alpha;
        this.beta = beta;
        this.all = [];
        for (var i = 0; i < this.map.n; i++) {
            this.all[i] = i;
        }
    }
    Travel.prototype.selectMin = function (a) {
        var min = a[0], index = 0;
        for (var i = 1; i < a.length; i++) {
            if (min > a[i]) {
                min = a[i];
                index = i;
            }
        }
        return index;
    };
    Travel.prototype.pk = function (i, j) {
        if (i == j) {
            return 0;
        }
        else {
            var x = Math.pow(this.tau.tau[i][j], this.alpha) * Math.pow(this.map.eta(i, j), this.beta);
            if (isNaN(x)) {
                throw new Error('pk is not a number');
            }
            return x;
        }
    };
    Travel.prototype.sum = function (a) {
        var sum = 0;
        for (var i = 0; i < a.length; i++) {
            sum += a[i];
        }
        return sum;
    };
    Travel.prototype.zone = function (site, allowed) {
        var p = [], pSum;
        for (var i = 0, N = allowed.length; i < N; i++) {
            p[i] = this.pk(site, allowed[i]);
        }
        pSum = this.sum(p);
        if (pSum === Infinity) {
            console.log("p in Infinity: ",p);
            throw new Error();
        }     
        if (pSum === 0) {
            throw new Error('p is zero list');
        }
        else if (isNaN(pSum)) {
            throw new Error('sum p is not a number');
        }
        return p.map(function (x) {
            return x / pSum;
        });
    };
    Travel.prototype.chose = function (site, allowed) {
        var p = this.zone(site, allowed);
        if (isNaN(this.sum(p)) || this.sum(p) ===0){
            console.log(p);
            throw new Error();
        }
        var r = Math.random();
        var z = 0;
        for (var i = 0; i < p.length; i++) {
            z += p[i];
            if (r < z) {
                return i;
            }
        }
    };
    Travel.prototype.makeAllowed = function (ank, tabu) {
        var allowed = this.all.filter(function (x) {
            return tabu.indexOf(x) < 0;
        });
        return allowed;
    };
    Travel.prototype.run = function () {
        var N = this.map.n, M = this.ants.m, tours = [null], evaluates = [], ants = this.ants, map = this.map, tau = this.tau, allowed;
        // 重置
        ants.born();
        // 巡游
        for (var i = 0; i < M; i++) {
            // 随机起点
            ants.move(i, Math.round(Math.random() * (N - 1)));
            // 选择并移动到下一座城市，直到完成一次巡游   
            for (var j = 1; j < N; j++) {
                //let site: number, allowed: number[];
                allowed = this.makeAllowed(i, ants.tabus[i]);
                ants.move(i, this.chose(ants.sites[i], allowed));
            }
            // 将蚂蚁的路径长度添加到评价列表
            tours[i] = ants.tabus[i];
            evaluates[i] = map.routDist(tours[i]);
        }
        return {
            t: tours,
            e: evaluates
        };
    };
    return Travel;
} ());
exports.Travel = Travel;
