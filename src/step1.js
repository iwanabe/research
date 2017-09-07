// Binarize an image (from color to black and white)
// srcImg is the input image
// dstImg is the output (black and white) image)
//
binarize = function(srcImg, dstImg){
    var width = srcImg.width;
    var height = srcImg.height;
    
    var src = srcImg.data;
    var dst = dstImg.data;
    
    for(var i = 0; i < height; ++i){
       for(var j = 0; j < width; ++j){
             var idx = (j + i*width)*4;
             var r = src[idx];
             var g = src[idx+1];
             var b = src[idx+2];
             var a = src[idx+3];
                
             var avg = (r + g + b)/3;
             if(avg < 128) { 
		dst[idx] = 255;
		dst[idx+1] = 255;
		dst[idx+2] = 255;
		dst[idx+3] = 255;
             } else {   
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
    
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
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
	    } else {
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


onload = function(){   
    if ( ! mycanvas || ! mycanvas.getContext ) {
      return false;
    }
   
    var img = new Image();
    img.src = "image/Samurai-kanji.jpg";
  
    img.onload = function(e){
    	var width = img.width;
    	var height = img.height;
        
        var canvas = document.getElementById('mycanvas');
        var context = canvas.getContext('2d');
       
        canvas.width = width;
        canvas.height = height;
 
        context.drawImage(img, 0, 0);
       
        var srcImg = context.getImageData(0, 0, width, height);
	    var binImg = context.createImageData(width, height);
        var cntImg = context.createImageData(width, height);
        var dntImg = context.createImageData(width, height);
        var entImg = context.createImageData(width, height);
        
	    binarize(srcImg, binImg);
	    Laplacian(binImg, cntImg);
	    binarize(cntImg, dntImg);
	
		console.log("start wait plese");
		
		
		/*
		Calculate the shortest distance to the contour and put it in d[][].
		At that time, the maximum value and the minimum value of the distance are saved. 
		Then call the function and color it.
		*/
		
		var d = new Array(height);
		var dmin = 10000;
		var dmax = 0;
		var NFList = new Point2d();
		
		// n have NFList.length
		//
		var n = getContour(dntImg,NFList);
		
		for(var x = 0 ; x < height ; x++){
			d[x] = new Array(width);
			for(var y = 0 ; y < width ; y++){
				d[x][y] = computeDistPoint(y,x,NFList,n);
				if(dmax < d[x][y]){
        			dmax = d[x][y];
        		}
        		if(dmin > d[x][y]){
        			dmin = d[x][y];
        		}
			}
		}
		
		// nd is normalized distance
		//
		var nd;
		for(var i = 0; i < height; i++){
			for(var j = 0; j < width; j++){
				nd = (d[i][j]-dmin)/(dmax-dmin);
				ListContourPlot(dntImg,entImg,i,j,nd);
			}
		}
		console.log("fin");
		context.putImageData(entImg, 0, 0);
    };
}

// Change the color according to the distance from the contour
// input:
// srcImg: w*h*4 image with the contour obtained from binarize & Laplacian
// dstImg: out put image
// distance: normalized distance
//
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
	if(f<0.10){r=2; g=95; b=97;}
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
	if(f>0.09 && f<0.101
	||f>0.19 && f<0.201
	||f>0.29 && f<0.301
	||f>0.39 && f<0.401
	||f>0.49 && f<0.501
	||f>0.59 && f<0.601
	||f>0.69 && f<0.701
	||f>0.79 && f<0.801){
		r=255; g=255; b=255;
	}
	dst[idx] = Math.floor(r);
	dst[idx+1] = Math.floor(g);
	dst[idx+2] = Math.floor(b);
	dst[idx+3] = 255;
}
