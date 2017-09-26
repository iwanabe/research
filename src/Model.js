
// The model to be rendered. It contains:
// - its defining function
// - its bounding-box
var model = {};

var img = new Image();
img.src = "image/Samurai-kanji.jpg";
var binImg;
var NFList = [];
var width;
var height;
var zmax;

img.onload = function(e){
	width = img.width;
	height = img.height;
	
	if(width>=height){zmax = width;}
	if(height>width){zmax = height;}
			
	var canvas = document.getElementById('mycanvas');
	var context = canvas.getContext('2d');
	
	canvas.width = width;
	canvas.height = height;
	
	context.drawImage(img, 0, 0);
	
	var srcImg = context.getImageData(0, 0, width, height);
	binImg = context.createImageData(width, height);
	var cntImg = context.createImageData(width, height);
	var dntImg = context.createImageData(width, height);
	
	binarize(srcImg, binImg);
	Laplacian(binImg, cntImg);
	binarize(cntImg, dntImg);
	
	getContour(dntImg,NFList);
}

model.eval = function(x, y, z) {
//   var value = 25 - (x*x + y*y + z*z);
//    return value;
	
	var signeddistance1 = computeDistPoint(x,y,NFList)*computeSignPoint(x,y,binImg);
	var v1 = Math.min(signeddistance1,z);
	var value1 = Math.min(v1,zmax-z);
	
	var signeddistance2 = computeDistPoint(z,y,NFList)*computeSignPoint(z,y,binImg);
	var v2 = Math.min(signeddistance2,x);
	var value2 = Math.min(v2,width-x);
	
	var signeddistance3 = computeDistPoint(z,x,NFList)*computeSignPoint(z,x,binImg);
	var v3 = Math.min(signeddistance3,y);
	var value3 = Math.min(v3,height-y);
	
	var value = Math.min(value1,value2,value3);
	return value;
}

model.boundingBox = function() {

//	var bbox = {x_min: -10, x_max: 10, 
//		y_min: -10, y_max: 10,
//		z_min: -10, z_max: 10}


	var bbox = {x_min: 0, x_max: width-1, 
				y_min: 0, y_max: height-1,
				z_min: 0, z_max: zmax-1}
				
	return bbox;
}
