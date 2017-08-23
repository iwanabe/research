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
        
	    binarize(srcImg, binImg);       
	    Laplacian(binImg, cntImg);
	    binarize(cntImg, dntImg);
	     
        context.putImageData(dntImg, 0, 0);
       
       // document.write(MinDistance(dntImg));
    };
}
