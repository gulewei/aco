import {Ants} from "./Ants";
import {Map} from "./Map";
import {Tau} from "./Tau";
import {Travel} from "./Travel";

let alpha: number = 1;
let beta: number = 1;
let rho: number = 1;
let q: number = 1;
let max: number = 1;
let min: number = 1;
let M: number = 10;
let T: number = 300;

let sites: number[][] = [
    [1,0],
    [4,7],
    [6,8],
    [2,4],
    [9,0],
    [1,5],
    [5,3],
    [5,1],
    [8,9],
    [1,5]
];

let map = new Map(sites);
let tau = new Tau(map.n, max, min, rho, q);
let ants = new Ants(M)
let travel = new Travel(ants, map, tau, alpha, beta);

let len: number = null;
let rout: number[];
for (let t = 0; t < T; t++) {
    // travel result
    let r = travel.run();
    let tours: number[][] = r.t;
    let evaluates: number[] = r.e;
    // evaluate
    let best: number = travel.selectMin(evaluates);
    let l_len: number = evaluates[best];
    let l_rout: number[] = tours[best];
    // globle path
    if (l_len < len || len === null) {
        len = l_len;
        rout = l_rout;
    }
    // update
    tau.update(tours, evaluates);
}
console.log(len);
console.log(rout);