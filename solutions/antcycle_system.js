function antcycle_system () {
	/*  PARAMETERS & FUNCTIONS  */
	var N, Q, M, T, D, TAU, alpha, beta, rho, init_tau,
		cites, ants, i, j, k, MINPATH, prob_path, best_path;

	function readIntoArray(path) {
		var rf=require("fs");  
		var data=rf.readFileSync(path,"utf-8");  
		data = data.split("\r\n");
		for (var i = 0; i < data.length; i++) {
			data[i] = data[i].split(",");
			for (var j = 0; j < data[i].length; j++) {
				data[i][j] = parseFloat(data[i][j]);
			}
		}  
		return data;
	}

	function Ant() {
		var site, tabu;
		this.site = site;
		this.tabu = tabu;
		this.move = function (site) {
			this.site = site;
			this.tabu.push(site);
		}
		this.born = function () {
			this.tabu = [];
			this.move(Math.round(Math.random() * (N - 1)));
		}
		this.delTau = function () {
			return Q / dist(this.tabu);
		}
		this.walked = function (start, stop) {
			if (Math.abs(this.tabu.indexOf(start) - this.tabu.indexOf(stop)) == 1) {
				return 1;
			}
			else {
				return 0;
			}
		}
		this.born();
	}

	//计算两点间距离
	function tpDist(x, y) {
		//x, y为城市的序号
		return Math.sqrt(Math.pow((cities[x][0] - cities[y][0]), 2) +
			Math.pow((cities[x][1] - cities[y][1]), 2));
	}

	//计算路径长度
	function dist(a) {
		var len = a.length;
		if (len < 2) {
			return;
		}
		else {
			var pathLength = 0;
			for (var i = 0; i < len - 1; i++) {
				pathLength += tpDist(a[i], a[i + 1]);
			}
			return pathLength;
		}
	}

	//ETA计算
	function eta(start, stop) {
		return 1 / D[start][stop];
	}

	// 转移概率（分子部分）
	function pk(start, stop) {
		if (start == stop) {
			return 0;
		}
		else {
			return Math.pow(TAU[start][stop], alpha) *
				Math.pow(eta(start, stop), beta);
		}
	}

	// 选择城市
	function pick(start, ant_k) {
		var p = [], pk_list = [], pk_sum = 0;
		for (var i = 0; i < N; i++) {
			if (ants[ant_k].tabu.indexOf(i) < 0) {
				pk_list.push(pk(start, i));
			}
			else {
				pk_list.push(0);
			}
			pk_sum += pk_list[pk_list.length - 1];
		}
		for (i = 0; i < N; i++) {
			p.push(pk_list[i] / pk_sum);
		}
		return chose(p);

		function chose(a) {
			//返回一个数组中最大元素的序号
			var max = 0;
			for (var i = 0; i < a.length; i++) {
				if (max < a[i] || max == 0) {
					max = a[i];
				}
			}
			return a.indexOf(max);
		}
	}

	// 更新一条边的信息素轨迹
	function edgeUpdate(start, stop) {
		var del_tau = 0, new_tou;
		for (var i = 0; i < M; i++) {
			if (ants[i].walked(start, stop)) {
				del_tau += ants[i].delTau();
			}
		}
		new_tou = rho * TAU[start][stop] + del_tau;
		TAU[start][stop] = new_tou;
	}
	
	function getMinIndex(a) {
		var min = a[0], index = 0;
		for (var i = 1; i < a.length; i++) {
			if (min > a[i]) {
				min = a[i];
				index = i;
			}
		}
		return index;
	}

	/*  SET UP  */
	//初始最短路劲设为 -1
	MINPATH = -1;
	//循环次数
	T = 300;
	//算法参数
	alpha = 1;
	beta = 5;
	rho = 0.7;
	Q = 1;
	//城市初始化
	prob_path = "E:/Users/Desktop/Huan/aco/problems/eil51.csv";
	cities = readIntoArray(prob_path);
	N = cities.length;
	//蚁群初始化
	M = N;
	ants = [];
	for (i = 0; i < M; i++) {
		ants.push(new Ant());
	}
	//矩阵D，储存每条边的长度
	//矩阵TAU, 储存每条边的信息素强度
	D = [];
	TAU = [];
	init_tau = 10;
	for (i = 0; i < N; i++) {
		D.push([]);
		TAU.push([]);
		for (j = 0; j < N; j++) {
			D[i].push(tpDist(i, j));
			TAU[i].push(init_tau);
		}
	}
	console.time("time");
	/*  MAIN  */
	var min, pathLength, nextStop;
	//每次循环
	for (var z = 0; z < T; z++) {
		//console.log("第" + z + "次循环: ");
		for (j = 0; j < N - 1; j++) {
			//每只蚂蚁	
			for (k = 0; k < M; k++) {
				//选择下一个城市
				nextStop = pick(ants[k].site, k);
				//选择城市，更新位置,禁忌表
				ants[k].move(nextStop);
			}
		}
		//找出最短路径
		pathLength = [];
		for (j = 0; j < M; j++) {
			pathLength.push(dist(ants[j].tabu));
			//console.log(ants[j].tabu);
		}
		min = pathLength[getMinIndex(pathLength)];
		best_path = ants[getMinIndex(pathLength)].tabu;
		//console.log("当前最短路径: " + best_path);
		//更新最短路径
		if (min < MINPATH || MINPATH < 0) {
			MINPATH = min;
			best_path = ants[getMinIndex(pathLength)].tabu;
		}
		//console.log("当前最短路径: " + best_path);
		//console.log("当前距离： " + MINPATH);
		//更新新信息素
		for (j = 0; j < N; j++) {	
			for (k = 0; k < N; k++) {
				edgeUpdate(j, k);
			}		
		}
		//清空禁忌表
		for (j = 0; j < M; j++) {
			ants[j].born();
		}
	}
	//输出结果
	console.log(best_path);
	console.log(MINPATH);
	console.timeEnd("time");
}

console.log(" antcycle_system is running ... ");
antcycle_system();

