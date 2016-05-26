/**
 * Tour
 */
class Tour {
    private ants: any;
    private map: any;
    private tau: any;
    private alpha: number;
    private beta: number;

    constructor(ants: any, map: any, tau: any, alpha: number, beta: number) {
        this.ants = ants;
        this.map = map;
        this.tau = tau;
        this.alpha = alpha;
        this.beta = beta;
    }
    selectMin(a: number[]): number {
        var min = a[0], index = 0;
        for (var i = 1; i < a.length; i++) {
            if (min > a[i]) {
                min = a[i];
                index = i;
            }
        }
        return index;
    }
    pk(i: number, j: number): number{
        if (i == j) {
            return 0;
        }
        else {
            var x = Math.pow(this.tau.getTau(i, j), this.alpha) * Math.pow(this.map.eta(i, j), this.beta);
            if (isNaN(x)) {
                throw new Error('pk is not a number');
            }
            return x;
        }
    }
    sum(a: number[]): number {
        var sum = 0;
        for (var i = 0; i < a.length; i++) {
            sum += a[i];
        }
        return sum;
    }
    zone(site: number, allowed: number[]): number[]{
        var p: number[] = [], N: number, pSum: number, i: number;
        for (i = 0, N = allowed.length; i < N; i++) {
            p[i] = this.pk(site, allowed[i]);
        }
        pSum = this.sum(p);
        return p.map(function (x) {
            return x / pSum;
        });
    }
    chose(site: number, allowed: number[]):number {
        var p = this.zone(site, allowed);
        var r = Math.random(), z = 0;
        for (var i = 0; i < p.length; i++) {
            z += p[i];
            if (r < z) {
                return i;
            }
        }
    }
    run() {
        var M: number, N = this.map.sitesNum, tours: number[] = [], evaluates: number[] = [], site: number, allowed: number[], i: number, j: number, all: number[] = [];
        let ants = this.ants, map = this.map, tau = this.tau;
        for (i = 0; i < N; i++) {
            all[i] = i;
        }

        for (i = 0, M = ants.length; i < M; i++) {
            // 随机起点
            ants[i].move(Math.round(Math.random() * (N - 1)));
            // 选择并移动到下一座城市，直到完成一次巡游
            for (j = 1; j < N; j++) {
                site = ants[i].site;
                allowed = all.filter(function makeAllowed(x) {
                    return ants[i].tabu.indexOf(x) < 0;
                });
                ants[i].move(this.chose(site, allowed));
            }
            // 将蚂蚁的路径长度添加到评价列表
            tours[i] = ants[i].tabu();
            evaluates[i] = map.routDist(tours[i]);
            // 重置
            ants[i].born();
        }
        return {
            t: tours,
            e: evaluates
        };
    }
}
export {Tour};