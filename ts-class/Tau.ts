/**
 * Tau
 */
class Tau {
    public _tau: number[][];
    public tauInit: number;
    public max: number;
    public min: number;
    public N: number;
    public rho: number;
    public q: number;

    constructor(sitesNum: number, a: number, b: number, rho: number, q: number) {
        this.N = sitesNum;
        this.max = a;
        this.min = b;
        this.rho = rho;
        this.q = q;
        this._tau = [];
        this.tauInit = this.max;
        for (var i = 0; i < this.N; i++) {
            this._tau[i] = [];
            for (var j = 0; j < this.N; j++) {
                this._tau[i][j] = this.tauInit;
            }
        }
    }
    get tau() {
        return this._tau;
    }
    update(routs: number[][], delts: number[]) {
        var deltaTau: number, newTau: number;
        // 衰减  
        for (var i = 0, N = this.N; i < N; i++) {
            for (var j = 0; j < N; j++) {
                newTau = this._tau[i][j] * this.rho;
                if (newTau < this.min) {
                    this._tau[i][j] = this.min;
                }
                else {
                    this._tau[i][j] = newTau;
                }
            }
        }
        // 增加
        for (i = 0; i < delts.length; i++) {
            deltaTau = this.q / delts[i];
            for (var st = 0; st < routs[i].length; st++) {
                let routine: number[] = routs[i];
                newTau = this.tau[routine[st]][routine[st + 1]] + deltaTau;
                if (newTau > this.max) {
                    this._tau[routine[st]][routine[st + 1]] = this.max;
                }
                else {
                    this._tau[routine[st]][routine[st + 1]] = newTau;
                }
            }
        }
    }
}
/**
 * SearchTau
 */
class SearchTau extends Tau {
    update(routs: number[][], delts: number[]) {
        var rout: number[] = routs[0];
        var delta: number = delts[0];
        var deltaTau: number = this.q / delta;
        var newTau: number;
        for (var i = 0; i < rout.length; i++) {
            newTau = this._tau[rout[i]][rout[i + 1]] * this.rho - deltaTau;
            if (newTau > this.max) {
                this._tau[rout[i]][rout[i+1]] = this.max;
            }
            else if (newTau < this.min) {
                this._tau[rout[i]][rout[i+1]] = this.max;
            }
            else {
                this._tau[rout[i]][rout[i+1]] = newTau;
            }
        }
    }
}
export {Tau};
export {SearchTau};