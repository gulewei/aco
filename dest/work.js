var Ants_1 = require("./Ants");
var Map_1 = require("./Map");
var Tau_1 = require("./Tau");
var Travel_1 = require("./Travel");
var alpha = 1;
var beta = 1;
var rho = 1;
var q = 1;
var max = 1;
var min = 1;
var M = 10;
var T = 300;
var sites = [
    [1, 0],
    [4, 7],
    [6, 8],
    [2, 4],
    [9, 0],
    [6, 5],
    [5, 3],
    [5, 1],
    [8, 9],
    [1, 5]
];
var map = new Map_1.Map(sites);
var tau = new Tau_1.Tau(map.n, max, min, rho, q);
var ants = new Ants_1.Ants(M);
var travel = new Travel_1.Travel(ants, map, tau, alpha, beta);
var len = null;
var rout;
for (var t = 0; t < T; t++) {
    // travel result
    var r = travel.run();
    var tours = r.t;
    var evaluates = r.e;
    // evaluate
    var best = travel.selectMin(evaluates);
    var l_len = evaluates[best];
    var l_rout = tours[best];
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
