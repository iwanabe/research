// Binarize an image (from color to black and white)
// srcImg is the input image
// dstImg is the output (black and white) image)
//
binarize = function(srcImg, dstImg){
	var width = srcImg.width;
	var height = srcImg.height;
	
	var src = srcImg.data;
	var dst = dstImg.data;
	
	for(var i = 0; i < height; i=(i+1)|0){//++i
		for(var j = 0; j < width; j=(j+1)|0){//++j
			var idx = (j + i*width)*4;
			var r = src[idx];
			var g = src[idx+1];
			var b = src[idx+2];
			var a = src[idx+3];
			
			var avg = (r + g + b)/3;
			if(avg < 128){
				dst[idx] = 255;
				dst[idx+1] = 255;
				dst[idx+2] = 255;
				dst[idx+3] = 255;
			} 
			else {   
				dst[idx] = 0;
				dst[idx+1] = 0;
				dst[idx+2] = 0;
				dst[idx+3] = 255;
			}
		}
	}
}


// Apply the Laplacian filter to the input (black and white)
// image 'srcImg' and store the result in the image 'dstImg'
//
Laplacian = function(srcImg, dstImg) {
	var width = srcImg.width;
	var height = srcImg.height;
	
	var src = srcImg.data;
	var dst = dstImg.data;
	
	// discrete Laplacian 
	var w = [
		0,-1,0,
		-1,4,-1,
		0,-1,0
	];
	
	for(var i = 0; i < height; i=(i+1)|0) {
		for (var j = 0; j < width; j=(j+1)|0) {
			var idx = (j+i*width)*4;
			var r = 0, g = 0, b = 0;
			
			// boundary conditions
			if (i == 0 || i == (height-1) 
			|| j == 0 || j == (width-1)) 
			{
				dst[idx] = src[idx];
				dst[idx+1] = src[idx+1];
				dst[idx+2] = src[idx+2];
				dst[idx+3] = 255;
			}
			else {
				var idx0 = (j-1 + (i-1)*width)*4;
				var idx1 = (j + (i-1)*width)*4;
				var idx2 = (j+1 + (i-1)*width)*4;
				var idx3 = (j-1 + i*width)*4;
				var idx4 = (j + i*width)*4;
				var idx5 = (j+1 + i*width)*4;
				var idx6 = (j-1 + (i+1)*width)*4;
				var idx7 = (j + (i+1)*width)*4;
				var idx8 = (j+1 + (i+1)*width)*4;
			
				dst[idx] = w[0]*src[idx0] + w[1]*src[idx1] + w[2]*src[idx2] +
					w[3]*src[idx3] + w[4]*src[idx4] + w[5]*src[idx5] + 
					w[6]*src[idx6] + w[7]*src[idx7] + w[8]*src[idx8];
					
				dst[idx+1] = w[0]*src[idx0+1]+w[1]*src[idx1+1]+w[2]*src[idx2+1] +
					w[3]*src[idx3+1]+w[4]*src[idx4+1]+w[5]*src[idx5+1] + 
					w[6]*src[idx6+1]+w[7]*src[idx7+1]+w[8]*src[idx8+1];
					
				dst[idx+2] = w[0]*src[idx0+2]+w[1]*src[idx1+2]+w[2]*src[idx2+2] +
					w[3]*src[idx3+2]+w[4]*src[idx4+2]+w[5]*src[idx5+2] + 
					w[6]*src[idx6+2]+w[7]*src[idx7+2]+w[8]*src[idx8+2];
				
				dst[idx+3] = 255;
			}
		}
	}
}


Point2d = function(x, y) {
	this.x = x;
	this.y = y;
}


// Extract the contour (list of points) corresponding to a curve
// drawn on an image
//
getContour = function(cntImg, cntList) {
	/* Input:
		cntImg: w*h*4 image with the contour obtained from binarize & Laplacian
		Output:
		cntList: initially empty, will be filled with the list of points
	*/
	
	var w = cntImg.width;
	var h = cntImg.height;
	
	var cnt = cntImg.data;
	var n = 0;
	
	for (var j = 0; j < h; j=(j+1)|0) {
		for (var i = 0; i < w; i=(i+1)|0) {
		
			var idx = (j*w+i)*4;
			
			if (cnt[idx]==0) {
				cntList[n] = new Point2d(i, j);
				n=(n+1)|0;
			}
		}
	}
}


// Compute the dist from (x,y) to the curve approximated by
// the list of points in cntList
//
computeDistPoint = function(x, y, cntList) {

	//new
	//under improving
	//if(x >= 0 && x < width && y >= 0 && y < height){
		//x = x|0;
		//y = y|0;
		
		var d = Number.MAX_VALUE;
		
		for (var i = 0; i < cntList.length; i=(i+1)|0){
			var p = cntList[i];
			var dt = (x - p.x)*(x - p.x) + (y - p.y)*(y - p.y);
			if (dt < d) {
				d = dt;
			}
			//new
			//
			if(d==0)break;
		}
		return Math.sqrt(d);
	//}
	//else return zmax;
}

// binalizedImg: binalize(img)
// sign: Assign -1 for white and 1 for black
//
//computeSignPoint = function(x, y, binalizedImg)
//	
//	var src = binalizedImg.data;
//	var width = binalizedImg.width;
//	var height = binalizedImg.height;
computeSignPoint = function(x, y, binImg){
	
	var src = binImg.data;
	var width = binImg.width;
	var height = binImg.height;
	var sign = 0;
	
	if(x >= 0 && x < width && y >= 0 && y < height){
		x = x|0;
		y = y|0;
		
		var idx = (y*width + x)*4;
		
		//white
		if(src[idx]==255){
			sign = 1;
		}
		else {
			sign = -1;
		}
	}
	else sign = -1;
	
	return sign;
}

// Change the color according to the distance from the contour
// input:
// srcImg: w*h*4 image with the contour obtained from binarize & Laplacian
// dstImg: out put image
// distance: normalized distance
//
ListContourPlot = function(srcImg, dstImg, height, width, distance){
	var src = srcImg.data;
	var dst = dstImg.data;
	
	var x = height;
	var y = width;
	var f = distance;
	var w = srcImg.width;
	
	var idx = (x*w + y)*4;
	var r = 0;
	var g = 0;
	var b = 0;
	
	// color map
	//
	if(f>0.0 && f<0.10){r=2; g=95; b=97;}
	if(f>0.10 && f<0.20){r=25; g=109; b=93;}
	if(f>0.20 && f<0.30){r=47; g=124; b=89;}
	if(f>0.30 && f<0.40){r=71; g=138; b=85;}
	if(f>0.40 && f<0.50){r=94; g=153; b=81;}
	if(f>0.50 && f<0.60){r=117; g=167; b=76;}
	if(f>0.60 && f<0.70){r=140; g=182; b=72;}
	if(f>0.70 && f<0.80){r=163; g=196; b=68;}
	if(f>0.80){r=186; g=211; b=64;}
	
	// border line is white
	//
	if(
		f>0.09 && f<0.101
		||f>0.19 && f<0.201
		||f>0.29 && f<0.301
		||f>0.39 && f<0.401
		||f>0.49 && f<0.501
		||f>0.59 && f<0.601
		||f>0.69 && f<0.701
		||f>0.79 && f<0.801
		||f>0.89 && f<0.901){
		r=0; g=0; b=0;
	}
	dst[idx] = r|0;
	dst[idx+1] = g|0;
	dst[idx+2] = b|0;
	dst[idx+3] = 255;
}


