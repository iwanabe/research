
KcomputeDistPoint = function(x, y, cntList){
	var d = Number.MAX_VALUE;
	var dt;
	var c;
	
	if(cntList.length < 1000){
		for(var i = 0; i < 4; i=(i+1)|0){
			var ppp = center[i];
			dt = (ppp.x - x)*(ppp.x - x) + (ppp.y - y)*(ppp.y - y);
			
			if(dt < d){
				d = dt;
				c = i;
			}
		}
		var result = computeDistPoint(x, y, division[c]);
		return result;
	}
	else {
		for(var i = 0; i < 16; i=(i+1)|0){
			var ppp = center16[i];
			dt = (ppp.x - x)*(ppp.x - x) + (ppp.y - y)*(ppp.y - y);
			
			if(dt < d){
				d = dt;
				c = i;
			}
		}
		var result = computeDistPoint(x, y, division16[c]);
		return result;
	}
}

var center = new Array(4);
var division = new Array(4);

// large size of image 
var center16 = new Array(16);
var division16 = new Array(16);

//
//KMeansTree(width,height,NFList)
KMeansTree = function(w, h, cntList, ccc){
	
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
			break;
		}
	}
	
	if(cntList.length > 1000 ){
		var d0 = division[0];
		var d1 = division[1];
		var d2 = division[2];
		var d3 = division[3];
		KMeansTree16(w, h, d0, 0);
		KMeansTree16(w, h, d1, 1);
		KMeansTree16(w, h, d2, 2);
		KMeansTree16(w, h, d3, 3);
	}
}

KMeansTree16 = function(w, h, cntList, ccc){
	
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
			break;
		}
	}
	for(var i = 0; i<4;i++){
		console.log((i+ccc*4)+":"+division[i].length);
		division16[i+ccc*4] = division[i];
		center16[i+ccc*4] = center[i];
	}
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

