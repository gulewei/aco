/**
 * Ant
 */
class Ant {
    _tabu: number[];
    _site: number;
    constructor() {
        this.born();
    }
    get site() {
        return this._site;
    }
    get tabu() {
        return this._tabu;
    }
    born() {
        this._tabu = [];
        this._site = null;
    }
    move(site: number) {
        this._site = site;
        this._tabu.push(site);
    }
}
export {Ant};
