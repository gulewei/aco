/**
 * Tour
 */
class Travel {
    private ants: any;
    private map: any;
    private tau: any;
    private alpha: number;
    private beta: number;
    private all: number[];

    constructor(ants: any, map: any, tau: any, alpha: number, beta: number) {
        this.ants = ants;
        this.map = map;
        this.tau = tau;
        this.alpha = alpha;
        this.beta = beta;
        this.all = [];
        for (let i = 0; i < this.map.n; i++) {
            this.all[i] = i;
        }
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
    pk(i: number, j: number): number {
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
    }
    sum(a: number[]): number {
        var sum = 0;
        for (var i = 0; i < a.length; i++) {
            sum += a[i];
        }
        return sum;
    }
    zone(site: number, allowed: number[]): number[] {
        var p: number[] = [], pSum: number;
        for (let i = 0, N = allowed.length; i < N; i++) {
            p[i] = this.pk(site, allowed[i]);
        }
        pSum = this.sum(p);
        return p.map(function (x) {
            return x / pSum;
        });
    }
    chose(site: number, allowed: number[]): number {
        let p: number[] = this.zone(site, allowed);
        let r: number = Math.random();
        let z: number = 0;
        for (let i = 0; i < p.length; i++) {
            z += p[i];
            if (r < z) {
                return i;
            }
        }
    }
    makeAllowed(ank: number, tabu: number[]): number[] {
        var allowed: number[] = this.all.filter(function (x: number) {
            return tabu.indexOf(x) < 0;
        })
        return allowed;
    }
    run() {
        var N: number = this.map.n,
            M: number = this.ants.m,
            tours: number[][] = [],
            evaluates: number[] = [],
            ants = this.ants,
            map = this.map,
            tau = this.tau,
            allowed: number[];
        // 重置
        ants.born();
        // 巡游
        for (let i = 0; i < M; i++) {
            // 随机起点
            ants.move(i, Math.round(Math.random() * (N - 1)));
            // 选择并移动到下一座城市，直到完成一次巡游   
            for (let j = 1; j < N; j++) {
                //let site: number, allowed: number[];
                allowed = this.makeAllowed(i, ants.tabus[i]);
                ants.move(i, this.chose(ants.sites[i], allowed));
            }
            // 将蚂蚁的路径长度添加到评价列表
            tours[i] = ants.tabs[i];
            evaluates[i] = map.routDist(tours[i]);
        }

        return {
            t: tours,
            e: evaluates
        };
    }
}
export {Travel};