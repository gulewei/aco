var e = [1, 3, 5, 7, 9, 2, 4, 6, 8, 10, 11, 13, 15, 17, 19, 12, 14, 16, 18, 20, 21, 23, 25, 27, 29, 22, 24, 26, 28, 30];

e.reduce(function(x, y) {
    return x + y;
});
// 改变数组
// e.sort(function(a, b) {
//     return a - b;
// });
function sort(a) {
    var b = [];
    // copy
    for (var i = 0; i < b.length; i ++) {
        b[i] = a[i];
    }
    // a < b
    return b.sort(function (a, b) {
        return a - b;
    });
}