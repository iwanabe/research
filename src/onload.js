
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
		//var NFList = new Point2d();
		var NFList = [];
		
		getContour(dntImg,NFList);
		
		for(var x = 0 ; x < height ; x++){
			d[x] = new Array(width);
			for(var y = 0 ; y < width ; y++){
			
			//new
			//
				d[x][y] = computeDistPoint(y,x,NFList)*computeSignPoint(y,x,binImg);
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