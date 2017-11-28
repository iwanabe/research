
KcomputeDistPoint = function(x, y, cntList){

	var d = Number.MAX_VALUE;
	var dt;
	var c;
	
	for(var i = 0; i < 4; i=(i+1)|0){
		var ppp = center[i];
		dt = (ppp.x - x)*(ppp.x - x) + (ppp.y - y)*(ppp.y - y);
		
		if(dt <= d){
			d = dt;
			c = i;
		}
	}
	var result = computeDistPoint(x, y, division[c]);
	return result;
	
	//initG(center, center[c]+5,center[c]);
	//_division[c]

}

var center = new Array(4);
var division = new Array(4);

//
//KMeansTree(width,height,NFList)
KMeansTree = function(w, h, cntList){
	//var center = new Array(4);
//	var division = new Array(4);
	
	division[0] = [];
	division[1] = [];
	division[2] = [];
	division[3] = [];
	
	InitG(center, w, h);
	
	console.log("def");
	console.log(center[0].x +"," + center[0].y);
	console.log(center[1].x +"," + center[1].y);
	console.log(center[2].x +"," + center[2].y);
	console.log(center[3].x +"," + center[3].y);
	
	StoreG(center, cntList, division,w,h);
	
	//test number of loop
	for(var n = 0; n < 8 ; n=(n+1)|0){
		CalcG(center, division);
		//_division delete;
		division[0] = [];
		division[1] = [];
		division[2] = [];
		division[3] = [];
		
		StoreG(center, cntList, division,w,h);
		console.log(center[0].x +"," + center[0].y);
		console.log(center[1].x +"," + center[1].y);
		console.log(center[2].x +"," + center[2].y);
		console.log(center[3].x +"," + center[3].y);
	}
}

InitG = function(_center,w,h){
	
	var x = w/2;
	var y = h/2;
	
	_center[0] = new Point2d(Math.floor(x-(w/8)), Math.floor(y-(h/8)));
	_center[1] = new Point2d(Math.floor(x+(w/8)), Math.floor(y-(h/8)));
	_center[2] = new Point2d(Math.floor(x-(w/8)), Math.floor(y+(h/8)));
	_center[3] = new Point2d(Math.floor(x+(w/8)), Math.floor(y+(h/8)));
}

CalcG = function(_center, _division){
	
	for(var i = 0; i < 4; i=(i+1)|0){
		var a=0;
		var b=0;
		
		
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
	console.log("----------------");
}

StoreG = function(_center, cntList,_division,w,h){
	
	var dt;
	var c;
	var count0=0;
	var count1=0;
	var count2=0;
	var count3=0;
	
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
		if(c==0){count0++;}
		if(c==1){count1++;}
		if(c==2){count2++;}
		if(c==3){count3++;}
	}
	
	if(count0==cntList.length){
//		InitG(_center,w/4,h/4);
	}
	if(count1==cntList.length){
//		InitG(_center,w/4,h-(h/4));
	}
	if(count2==cntList.length){
//		InitG(_center,w-(w/4),h/4);
	}
	if(count0==cntList.length){
//		InitG(_center,w-(w/4),h-(h/4));
	}
}

