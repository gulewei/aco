var Ants_1 = require("./class/Ants");
var Map_1 = require("./class/Map");
var Tau_1 = require("./class/Tau");
var Travel_1 = require("./class/Travel");
var Util = require("./class/Util");
var alpha = 1;
var beta = 5;
var rho = 0.7;
var q = 100;
var max = 10;
var min = 0.01;
var M = 20;
var T = 300;
var sites = Util.read("eil51.csv");
var map = new Map_1.Map(sites);
var tau = new Tau_1.Tau(map.n, max, min, rho, q);
var ants = new Ants_1.Ants(M);
var travel = new Travel_1.Travel(ants, map, tau, alpha, beta);
var len = null;
var rout;
console.time("time: ");
for (var t = 0; t < T; t++) {
    // console.log("t: ", t);
    // travel result
    var r = travel.run();
    var tours = r.t;
    var evaluates = r.e;
    // evaluate
    var best = travel.selectMin(evaluates);
    var l_len = evaluates[best];
    var l_rout = tours[best];
    // globe path
    if (l_len < len || len === null) {
        len = l_len;
        rout = l_rout;
    }
    // update
    tau.update(tours, evaluates);
}
console.timeEnd("time: ");
console.log(len);
console.log(rout);
