/**
 * Ant
 */
var Ants = (function () {
    "use strict";
    function Ants(M) {
        this._M = M;
        ;
    }
    Object.defineProperty(Ants.prototype, "sites", {
        // ank means ant_k
        get: function () {
            return this._sites;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ants.prototype, "tabus", {
        get: function () {
            return this._tabus;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ants.prototype, "m", {
        get: function () {
            return this._M;
        },
        enumerable: true,
        configurable: true
    });
    Ants.prototype.born = function () {
        this._sites = [];
        this._tabus = [];
        for (var i = 0; i < this._M; i++) {
            this._tabus[i] = [];
            this._sites[i] = null;
        }
    };
    Ants.prototype.move = function (ank, site) {
        this._sites[ank] = site;
        this._tabus[ank].push(site);
    };
    return Ants;
}());
exports.Ants = Ants;
