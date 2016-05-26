/**
 * Ant
 */
class Ants {
    _tabus: number[][];
    _sites: number[];
    _M: number;
    constructor(M: number) {
        this._M = M;;
    }
    // ank means ant_k
    get sites(): number[] {
        return this._sites;
    }
    get tabus(): number[][] {
        return this._tabus;
    }
    get m(): number {
        return this._M;
    }
    born() {
        this._sites = [];
        this._tabus = [];
        for (let i = 0; i < this._M; i++) {
            this._tabus[i] = [];
            this._sites[i] = null;
        }
    }
    move(ank: number, site: number) {
        this._sites[ank] = site;
        this._tabus[ank].push(site);
    }
}
export {Ants};
