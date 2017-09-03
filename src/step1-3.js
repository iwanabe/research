
SearchBlackPoint = function(srcImg){

	var width = srcImg.width;
	var height = srcImg.height;
	var src = srcImg.data;
	var point = new Array(height);
	var c = 0;

	for(var i = 0 ; i < height ; i++){
		point[i] = new Array(width);
		for(var j = 0 ; j < width ; j++){
			point[i][j] = 0;	
			var idx = (j + i*width)*4;
            var r = src[idx];
            var g = src[idx+1];
            var b = src[idx+2];
            var a = src[idx+3];
            
            var avg = (r + g + b)/3;
            
            //Black is 1
            if(avg < 128) {
            	point[i][j] = 1;
			}
		}
	}
}


MakeNearPointList = function(getpoint,nearpoint){
	
	x = getpoint.x;
	y = getpoint.y;
	
	var nearpoint = {x: [], y: []};
	
	var mindistance = 10000;
	var c = 0;
	
	for(var i = x-1 ; i < x+1 ; i++){
		for(var j = y-1 ; j < y+1 ; j++){
			if(point[i][j] == 1) {
				distance = Math.sqrt(Math.pow((x - i),2) + Math.pow((y - j),2));
				if(mindistance - distance > 0 && distance != 0){ 
					mindistance = distance;
					nearpoint.x[c] = i;
					nearpoint.y[c++] = j; 
				}
			}
		}
	}
}



ListContourPlot = function(srcImg, dstImg){
    var width = srcImg.width;
    var height = srcImg.height;
    
    var src = srcImg.data;
    var dst = dstImg.data;
    
    for(var i = 0; i < height; ++i){
       for(var j = 0; j < width; ++j){         
             if(point[i][j]==1) { 
		dst[idx] = 0;
		dst[idx+1] = Math.floor(255*point[i][j]);
		dst[idx+2] = 0;
		dst[idx+3] = 255;
             }
          }
     }
}