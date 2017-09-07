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
	
		var d = new Array(height);
		var dmin = 10000;
		var dmax = 0;
		var c = 0;
		
		var NFList = new Point2d();
		var n = getContour(dntImg,NFList);
		
		for(var x = 0 ; x < height ; x++){
			d[x]=new Array(width);
			for(var y = 0 ; y < width ; y++){
				d[x][y] = computeDistPoint(y,x,NFList,n);
				if (dmax < d[x][y]) {
        			dmax = d[x][y];
        		}
        		if(dmin > d[x][y] && d[x][y] != 0){
        			dmin = d[x][y];
        		}
        		c++;
			}
		}
		var ddd=[];
		for(var i=0;i<height;i++){
			for(var j=0;j<width;j++){
				ddd = (d[i][j]-dmin)/(dmax-dmin);  //distance to [0,1]
				Plot(dntImg,entImg,i,j,ddd);       //color plot function
			}
		}
		console.log("fin");
		context.putImageData(entImg, 0, 0); 
    };
}

Plot = function(srcImg,dstImg,height,width,distance){
	var src = srcImg.data;
	var dst = dstImg.data;
	var x = height;
	var y = width;
	var aaa = distance;

	var width = srcImg.width;
	
	var idx = (x*width + y)*4;
    
	var rrr = 255;
	var ggg = 255;
	var bbb = 255;
			
	if(aaa<0.10){rrr=2;ggg=95;bbb=97;}
	if(aaa>0.10&&aaa<0.20){rrr=25;ggg=109;bbb=93;}
	if(aaa>0.20&&aaa<0.30){rrr=47;ggg=124;bbb=89;}
	if(aaa>0.30&&aaa<0.40){rrr=71;ggg=138;bbb=85;}
	if(aaa>0.40&&aaa<0.50){rrr=94;ggg=153;bbb=81;}
	if(aaa>0.50&&aaa<0.60){rrr=117;ggg=167;bbb=76;}
	if(aaa>0.60&&aaa<0.70){rrr=140;ggg=182;bbb=72;}
	if(aaa>0.70&&aaa<0.80){rrr=163;ggg=196;bbb=68;}
	if(aaa>0.80){rrr=186;ggg=211;bbb=64;}
	
	if(aaa>0.09&&aaa<0.101
	||aaa>0.19&&aaa<0.201
	||aaa>0.29&&aaa<0.301
	||aaa>0.39&&aaa<0.401
	||aaa>0.49&&aaa<0.501
	||aaa>0.59&&aaa<0.601
	||aaa>0.69&&aaa<0.701){
		rrr=255;ggg=255;bbb=255;
	}
	dst[idx] = Math.floor(rrr);
	dst[idx+1] = Math.floor(ggg);//ggg
	dst[idx+2] = Math.floor(bbb);//bbb
	dst[idx+3] = 255;
}
