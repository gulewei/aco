var Ants_1 = require("./Ants");
var Map_1 = require("./Map");
var Tau_1 = require("./Tau");
var Travel_1 = require("./Travel");
var Util = require("./Util");

var alpha = 1;
var beta = 9;
var rho = 0.7;
var rho_f = 1.05;
var q = 100;
var max = 10;
var min = 0.01;
var M_1 = 15;
var M_2 = 25;
var T = 50;
var s = 2;

var sites = Util.read("eil51.csv");
var map = new Map_1.Map(sites);

var tau_1 = new Tau_1.Tau(map.n, max, min, rho, q);
var tau_2 = new Tau_1.SearchTau(map.n, max, min, rho_f, q);
var ants_1 = new Ants_1.Ants(M_1);
var ants_2 = new Ants_1.Ants(M_2);
var travel_1 = new Travel_1.Travel(ants_1, map, tau_1, alpha, beta);
var travel_2 = new Travel_1.Travel(ants_2, map, tau_2, alpha, beta);

var len = [];
var rout = [];
console.time("time: ");
for (var t = 0; t < T; t++) {
    // travel result
    var r1 = travel_1.run();
    var r2 = travel_2.run();
    var tours = r1.t.concat(r2.t);
    var evaluates = r1.e.concat(r2.e);
    // record
    var best = Util.selectMin(evaluates);
    console.log("t: %d, best: %d", t, best);
    len[t] = evaluates[best];
    rout[t] = tours[best];
    // change
    var rank = Util.sort(evaluates).slice(0, s);
    var select = [];
    for (i = 0; i < s; i++) {
        select[i] = tours[evaluates.indexOf(rank[i])];
    }
    // update
    tau_1.update(select, rank);
    tau_2.update([rout[t]], [len[t]]);
}
console.timeEnd("time: ");
console.log("len", len);
var ans = Util.sort(len);
console.log("ans ", ans[0]);
console.log("min path length: ", ans[0]);
console.log("first found in loop: ", len.indexOf(ans[0]));
console.log("routine: ", rout[len.indexOf(ans[0])]);