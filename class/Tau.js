var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Tau
 */
var Tau = (function () {
    function Tau(sitesNum, a, b, rho, q) {
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
    Object.defineProperty(Tau.prototype, "tau", {
        get: function () {
            return this._tau;
        },
        enumerable: true,
        configurable: true
    });
    Tau.prototype.update = function (routs, delts) {
        var deltaTau, newTau;
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
                var routine = routs[i];
                newTau = this.tau[routine[st]][routine[st + 1]] + deltaTau;
                if (newTau > this.max) {
                    this._tau[routine[st]][routine[st + 1]] = this.max;
                }
                else {
                    this._tau[routine[st]][routine[st + 1]] = newTau;
                }
            }
        }
    };
    return Tau;
}());
exports.Tau = Tau;
/**
 * SearchTau
 */
var SearchTau = (function (_super) {
    __extends(SearchTau, _super);
    function SearchTau() {
        _super.apply(this, arguments);
    }
    SearchTau.prototype.update = function (routs, delts) {
        var rout = routs[0];
        var delta = delts[0];
        var deltaTau = this.q / delta;
        var newTau;
        for (var i = 0; i < rout.length; i++) {
            newTau = this._tau[rout[i]][rout[i + 1]] * this.rho - deltaTau;
            if (newTau > this.max) {
                this._tau[rout[i]][rout[i + 1]] = this.max;
            }
            else if (newTau < this.min) {
                this._tau[rout[i]][rout[i + 1]] = this.max;
            }
            else {
                this._tau[rout[i]][rout[i + 1]] = newTau;
            }
        }
    };
    return SearchTau;
}(Tau));
exports.SearchTau = SearchTau;
