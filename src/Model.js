
// The model to be rendered. It contains:
// - its defining function
// - its bounding-box
var model = {};


var binImg;
var NFList =[];
var width;
var height;
var zmax;

//
//
kmeanstree = function(cntList){
	var p1 = 0;
	var p2 = 0;
	var p3 = 0;
	var p4 = 0;
	
	var c1 = cntList.length/4;
	var c2 = cntList.legnth/2;
	var c3 = c1 + c2;
	var c4 = cntList.length;
	
	var i;
	
	for (i = 0; i < c1; i=(i+1)|0){
		p1 = cntList[i];
		x1 += p1.x;
		y1 += p1.y;
	}
	for (; i < c2; i=(i+1)|0){
		p2 += cntList[i];
		x2 += p1.x;
		y2 += p1.y;
	}
	for (; i < c3; i=(i+1)|0){
		p3 += cntList[i];
		x3 += p1.x;
		y3 += p1.y;
	}
	for (; i < c4; i=(i+1)|0){
		p4 += cntList[i];
		x4 += p1.x;
		y4 += p1.y;
	}
	x1 = x1/c1;
	y1 = y1/c1;
	x2 = x2/c2;
	y2 = y2/c2;
	x3 = x3/c3;
	y3 = y3/c3;
	x4 = x4/c4;
	y4 = y4/c4;
	
}


//
//get contour from loaded image
LoadImageAndGetContour = function(img){
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
	
	// Returning value1 corresponds to the extruded Kanji along Z
//	return value1;
	
	// Returning min(value1, value2, value3) corresponds to the 3D Kanji
	return value;
}

model.boundingBox = function() {

	var bbox = {x_min: -5, x_max: width+5, 
			y_min: -5, y_max: height+5,
			z_min: -5, z_max: zmax+5}
				
	return bbox;
}