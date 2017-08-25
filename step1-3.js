



SearchNearPoints = function(x,y){

	var width = srcImg.width;
	var height = srcImg.height;
	
	var src = srcImg.data;
	var xc = 0;
	var yc = 0;
	var c = 0;
	
	var distance = 0;
	var mindistance = 100000;

	for(var i = 0 ; i < height ; i++){
		for(var j = 0 ; j < width ; j++){
		
			 var idx = (j + i*width)*4;
             var r = src[idx];
             var g = src[idx+1];
             var b = src[idx+2];
             var a = src[idx+3];
             
             var avg = (r + g + b)/3;
             
             if(avg > 128) {
             	xc[c] = i;
             	yc[c++] = j;
			}
		}
	}
	for(var i = 0 ; i < c ; i++ ){
		distance = Math.sqrt(Math.pow((x - xc),2) + Math.pow((y - yc),2));
		if(distance != 0 && distance < mindistance){
			mindistance = distance;
			minpoint = i;
		}
	}
	//return xc[minpoint],yc[minpoint];
}

SortNearPoint = function(){
	var idx = (j + i*width)*4;
	var r = src[idx];
	var g = src[idx+1];
	var b = src[idx+2];
	var a = src[idx+3];

	var avg = (r + g + b)/3;

	if(avg > 128) {
		xc[c++] = i;
		yc[c++] = j;
	}
	A = SearchNearPoints(xc,yc); 
}

MakeModel = function(A){

	A.x = x;
	A.y = y;
	for(var i = 0 ; i < ; i++){
		lineTO(x[i],y[i]);
	}
}