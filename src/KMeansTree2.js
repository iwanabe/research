
KcomputeDistPoint = function(x, y, cntList){
	var d = Number.MAX_VALUE;
	var dt;
	var c;
	var cc;
	
	var aaaa=countTree-4;
	for(var i = 0; i < 4; i=(i+1)|0){
		var ppp = centerTree[aaaa];
		dt = (ppp.x - x)*(ppp.x - x) + (ppp.y - y)*(ppp.y - y);
		
		if(dt < d){
			d = dt;
			c = i;
		}
		aaaa++;
	}
	
	
	if(countfunction == 0){
		var result = computeDistPoint(x, y, division[c]);
		return result;
	}
	else {
		var abc = 0;
		for(;countfunction>0;countfunction--){
			if(countfunction == 1){
				var ccc = c*4 + abc;
				for(var i = 0; i < 4; i=(i+1)|0){
					var ppp = centerTree[ccc];
					dt = (ppp.x - x)*(ppp.x - x) + (ppp.y - y)*(ppp.y - y);
					
					if(dt < d){
						d = dt;
						c = ccc;
					}
					ccc++;
				}
			}
			else if(countfunction == 2){
			abc = c*20;
				var ccc = (c+1)*16 + 4*c;
					for(var i = 0; i < 4; i=(i+1)|0){
					var ppp = centerTree[ccc];
					dt = (ppp.x - x)*(ppp.x - x) + (ppp.y - y)*(ppp.y - y);
					
					if(dt < d){
						d = dt;
						c = i;
					}
					ccc++;
				}
			}
		}
		var result = computeDistPoint(x, y, divisionTree[ccc]);
		return result;
	}
}

var center = new Array(4);
var division = new Array(4);

// large size of image 
var centerD1 = new Array(4);
var divisionD1 = new Array(4);

var centerTree = [];
var divisionTree = (new Array(340)).fill(0);
//var divisionTree = new Array(340);
var countTree = 0;
var countfunction = 0;
var countfunctionMain =0;
var c0 = [];
var c1 = [];
var c2 = [];
var c3 = [];

//
//KMeansTree(width,height,NFList)
KMeansTree = function(w, h, cntList, ccc){
	
//	if(cntList.length > 500){
	
	division[0] = [];
	division[1] = [];
	division[2] = [];
	division[3] = [];
	
	InitG(center, w, h, ccc);
	
	StoreG(center, cntList, division);
	
	var checkcenter0;
	var checkcenter1;
	var checkcenter2;
	var checkcenter3;
	
	//test number of loop
	for(var n = 0; n < 100 ; n=(n+1)|0){
		checkcenter0 = center[0].y;
		checkcenter1 = center[1].y;
		checkcenter2 = center[2].y;
		checkcenter3 = center[3].y;
		
		CalcG(center, division);
		
		division[0] = [];
		division[1] = [];
		division[2] = [];
		division[3] = [];
		
		StoreG(center, cntList, division);
		
		if(
			checkcenter0 == center[0].y&&
			checkcenter1 == center[1].y&&
			checkcenter2 == center[2].y&&
			checkcenter3 == center[3].y
		){
			console.log("-------"+n+":break");
			console.log("0:"+division[0].length);
			console.log("1:"+division[1].length);
			console.log("2:"+division[2].length);
			console.log("3:"+division[3].length);
			console.log("-------");
			break;
		}
	}
	
//	if(cntList.length > 500){
		var d0 = division[0];
		var d1 = division[1];
		var d2 = division[2];
		var d3 = division[3];
		
		c0[countfunction] = center[0];
		c1[countfunction] = center[1];
		c2[countfunction] = center[2];
		c3[countfunction] = center[3];
		
		if(
			d0.length > 80 &&
			d1.length > 80 &&
			d2.length > 80 &&
			d3.length > 80
		){
		console.log("---------down");
		countfunction++;
		
		//(w,h) origin point
		KMeansTree(c0[countfunction-1].x, c0[countfunction-1].y, d0, 0);
		KMeansTree(c1[countfunction-1].x, c1[countfunction-1].y, d1, 1);
		KMeansTree(c2[countfunction-1].x, c2[countfunction-1].y, d2, 2);
		KMeansTree(c3[countfunction-1].x, c3[countfunction-1].y, d3, 3);
		
		centerTree[countTree] = c0[countfunction-1];
		divisionTree[countTree++] = d0;
		centerTree[countTree] = c1[countfunction-1];
		divisionTree[countTree++] = d1;
		centerTree[countTree] = c2[countfunction-1];
		divisionTree[countTree++] = d2;
		centerTree[countTree] = c3[countfunction-1];
		divisionTree[countTree++] = d3;
		
		
		console.log("--up--");
		console.log("0:"+d0.length);
		console.log("1:"+d1.length);
		console.log("2:"+d2.length);
		console.log("3:"+d3.length);
		console.log("--------------up");
		countfunction--;
		}
//	}
	else {
		for(var i = 0; i < 4; i++){
			divisionTree[countTree] = division[i];
			centerTree[countTree++] = center[i];
		}
		
	}
	console.log("count:"+countTree);
	console.log("cf:"+countfunction);
	if(countfunctionMain<countfunction){countfunctionMain = countfunction;}
	console.log("ccc"+countfunctionMain);
}

InitG = function(_center, w, h, c){
	
	var x = w/2;
	var y = h/2;
	
	if(c == 5){
		_center[0] = new Point2d(Math.floor(x-(w/8)), Math.floor(y-(h/8)));
		_center[1] = new Point2d(Math.floor(x+(w/8)), Math.floor(y-(h/8)));
		_center[2] = new Point2d(Math.floor(x-(w/8)), Math.floor(y+(h/8)));
		_center[3] = new Point2d(Math.floor(x+(w/8)), Math.floor(y+(h/8)));
	}
	else if(c==0){
		x = x/2;
		y = y/2;
		w = w/2;
		h = h/2;
		_center[0] = new Point2d(Math.floor(x-(w/8)), Math.floor(y-(h/8)));
		_center[1] = new Point2d(Math.floor(x+(w/8)), Math.floor(y-(h/8)));
		_center[2] = new Point2d(Math.floor(x-(w/8)), Math.floor(y+(h/8)));
		_center[3] = new Point2d(Math.floor(x+(w/8)), Math.floor(y+(h/8)));
	}
	else if(c==1){
		x = x/2;
		y = y/2;
		w = w/2;
		h = h/2;
		_center[0] = new Point2d(Math.floor(x-(w/8)+(w/2)), Math.floor(y-(h/8)));
		_center[1] = new Point2d(Math.floor(x+(w/8)+(w/2)), Math.floor(y-(h/8)));
		_center[2] = new Point2d(Math.floor(x-(w/8)+(w/2)), Math.floor(y+(h/8)));
		_center[3] = new Point2d(Math.floor(x+(w/8)+(w/2)), Math.floor(y+(h/8)));
	}
	else if(c==2){
		x = x/2;
		y = y/2;
		w = w/2;
		h = h/2;
		_center[0] = new Point2d(Math.floor(x-(w/8)), Math.floor(y-(h/8)+(h/2)));
		_center[1] = new Point2d(Math.floor(x+(w/8)), Math.floor(y-(h/8)+(h/2)));
		_center[2] = new Point2d(Math.floor(x-(w/8)), Math.floor(y+(h/8)+(h/2)));
		_center[3] = new Point2d(Math.floor(x+(w/8)), Math.floor(y+(h/8)+(h/2)));
	}
	else if(c==3){
		x = x/2;
		y = y/2;
		w = w/2;
		h = h/2;
		_center[0] = new Point2d(Math.floor(x-(w/8)+(w/2)), Math.floor(y-(h/8)+(h/2)));
		_center[1] = new Point2d(Math.floor(x+(w/8)+(w/2)), Math.floor(y-(h/8)+(h/2)));
		_center[2] = new Point2d(Math.floor(x-(w/8)+(w/2)), Math.floor(y+(h/8)+(h/2)));
		_center[3] = new Point2d(Math.floor(x+(w/8)+(w/2)), Math.floor(y+(h/8)+(h/2)));
	}
}

//
//(w,h)=origin point
InitG2 = function(_center, w, h, c){
	
	if(c == 5){
		var x = w/2;
		var y = h/2;
		_center[0] = new Point2d(Math.floor(x-(x/2)), Math.floor(y-(y/2)));
		_center[1] = new Point2d(Math.floor(x+(x/2)), Math.floor(y-(y/2)));
		_center[2] = new Point2d(Math.floor(x-(x/2)), Math.floor(y+(y/2)));
		_center[3] = new Point2d(Math.floor(x+(x/2)), Math.floor(y+(y/2)));
	}
	else{
		var x = w/4;
		var y = h/4;
		_center[0].x = w - x;
		_center[0].y = h - y;
		
		_center[1].x = w + x;
		_center[1].y = h - y;
		
		_center[2].x = w - x;
		_center[2].y = h + y;
		
		_center[3].x = w + x;
		_center[3].y = h + y;
	}
}
CalcG = function(_center, _division){
	
	for(var i = 0; i < 4; i=(i+1)|0){
		var a = 0;
		var b = 0;
		
		if(_division[i].length == 0){
		}
		else {
			for(var j = 0; j < _division[i].length; j=(j+1)|0){
				a += _division[i][j].x;
				b += _division[i][j].y;
			}
			_center[i].x = Math.floor(a/_division[i].length);
			_center[i].y = Math.floor(b/_division[i].length);
		}
	}
}

StoreG = function(_center, cntList,_division){
	
	var dt;
	var c;
	
	for(var i = 0; i < cntList.length; i=(i+1)|0){
		var d = Number.MAX_VALUE;
		var p = cntList[i];
		
		for(var j = 0; j < 4; j=(j+1)|0){
			var ppp = _center[j];
			dt = (ppp.x - p.x)*(ppp.x - p.x) + (ppp.y - p.y)*(ppp.y - p.y);
			
			if(dt <= d){
				d = dt;
				c = j;
			}
		}
		_division[c].push(new Point2d(p.x, p.y));
	}
}

