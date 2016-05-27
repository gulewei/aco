/**
 * Map
 */
var Map = (function () {
    "use strict";
    function Map(sites, supply) {
        this._sites = sites;
        this._D = [];
        var N = this._sites.length;
        this._N = N;
        for (var i = 0; i < N; i++) {
            this._D[i] = [];
            for (var j = 0; j < N; j++) {
                this._D[i][j] = this.tpDist(i, j);
            }
        }
        if (arguments.length >= 2) {
            this._supply = supply;
        }
        else {
            this._supply = [];
            // console.log("Class Map: this is a TSP map ...");
        }
    }
    Object.defineProperty(Map.prototype, "supply", {
        get: function () {
            return this._supply;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Map.prototype, "d", {
        get: function () {
            return this._D;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Map.prototype, "n", {
        get: function () {
            return this._N;
        },
        enumerable: true,
        configurable: true
    });
    Map.prototype.tpDist = function (x, y) {
        return Math.sqrt(Math.pow((this._sites[x][0] - this._sites[y][0]), 2) + Math.pow((this._sites[x][1] - this._sites[y][1]), 2));
    };
    Map.prototype.routDist = function (rout) {
        var len = rout.length;
        if (len < 2) {
            throw "routDist: length < 2";
        }
        else {
            var pathLength = 0;
            for (var i = 0; i < len - 1; i++) {
                pathLength += this._D[rout[i]][rout[i + 1]];
            }
            return pathLength;
        }
    };
    Map.prototype.eta = function (i, j) {
        var x = 1 / this._D[i][j];
        if (isNaN(x)) {
            throw new Error('eta is not a number');
        }
        return x;
    };
    return Map;
} ());
exports.Map = Map;
