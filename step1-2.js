
MinDistance = function(srcImg){
	var width = srcImg.width;
	var height = srcImg.height;
	
	var src = srcImg.data;
	var dst = 0;
	var mindst = 10000000;
    
	var n = [600,600];
	var xc = 0;
	var yc = 0;
	
	for(var i = 0 ; i < height ; i++){
		for(var j = 0 ; j < width ; j++){
		
			 var idx = (j + i*width)*4;
             var r = src[idx];
             var g = src[idx+1];
             var b = src[idx+2];
             var a = src[idx+3];
             
             var avg = (r + g + b)/3;
             if(avg > 128) {
				dst = Math.sqrt(Math.pow((n[0] - i),2) + Math.pow((n[1] - j),2));
				if(mindst - dst > 0){
					mindst = dst; 
					xc = i;
					yc = j;
				}
			}
		}
	}
	return mindst;
}