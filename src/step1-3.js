
SearchBlackPoint = function(srcImg){

	var width = srcImg.width;
	var height = srcImg.height;
	var src = srcImg.data;
	int point = new Array(height)(width);

	for(var i = 0 ; i < height ; i++){
		for(var j = 0 ; j < width ; j++){
			point[i][j] = 0;	
			var idx = (j + i*width)*4;
            var r = src[idx];
            var g = src[idx+1];
            var b = src[idx+2];
            var a = src[idx+3];
            
            var avg = (r + g + b)/3;
            
            //Black point = 1
            if(avg > 128) {
            	point[i][j] = 1;
			}
		}
	}
	return point;
}


SortNearPoint = function(getpoint){
	
	getpoint.x = x;
	getpoint.y = y;
	
	var nearpoint = {x: [], y: []};
	
	mindistance = 10000;
	
	for(var i = x-1 ; i < x+1 ; i++){
		for(var j = y-1 ; j < y+1 ; j++){
			if(point[i]][j] == 1) {
				distance = Math.sqrt(Math.pow((getpoint.x - i),2) + Math.pow((getpoint.y - j),2));
				if(mindistance - distance > 0 && distance != 0){ 
					mindistance = distance:
				}
			}
		}
	}
	return mindistance;
}
