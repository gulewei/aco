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
var sites = (function (path) {
    var rf = require("fs");
    var root = "../problems/";
    var data = rf.readFileSync(root + path, "utf-8");
    data = data.split("\r\n");
    for (var i = 0; i < data.length; i++) {
        data[i] = data[i].split(",");
        for (var j = 0; j < data[i].length; j++) {
            data[i][j] = parseFloat(data[i][j]);
        }
    }
    return data;
})("20cities.csv");
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
    // globe path
    if (l_len < len || len === null) {
        len = l_len;
        rout = l_rout;
    }
    // update
    tau.update(tours, evaluates);
}
console.log(len);
console.log(rout);
