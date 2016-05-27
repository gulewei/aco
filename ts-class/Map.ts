/**
 * Map
 */
class Map {
    public _sites: number[][];
    public _D: number[][];
    public _N: number;
    public _supply: number[];
    constructor(sites: number[][], supply: number[]) {
        this._sites = sites;
        this._supply = supply;
        this._D = [];
        let N = this._sites.length;
        this._N = N;
        for (let i = 0; i < N; i++) {
            this._D[i] = [];
            for (let j = 0; j < N; j++) {
                this._D[i][j] = this.tpDist(i, j);
            }
        }
        if (this._supply === undefined) {
            console.log("Class Map: this is a TSP map ...");
        }
    }
    get supply(): number[] {
        return this._supply;
    }
    get d(): number[][] {
        return this._D;
    }
    get n(): number {
        return this._N;
    }
    tpDist(x: number, y: number): number {
        return Math.sqrt(Math.pow((this._sites[x][0] - this._sites[y][0]), 2) + Math.pow((this._sites[x][1] - this._sites[y][1]), 2));
    }
    routDist(rout: number[]): number {
        let len = rout.length;
        if (len < 2) {
            throw "routDist: length < 2";
        }
        else {
            let pathLength = 0;
            for (let i = 0; i < len - 1; i++) {
                pathLength += this._D[rout[i]][rout[i + 1]];
            }
            return pathLength;
        }
    }
    eta(i: number, j: number): number {
        let x = 1 / this._D[i][j];
        if (isNaN(x)) {
            throw new Error('eta is not a number');
        }
        return x;
    }
}
export {Map};
