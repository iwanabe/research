// The model to be rendered. It contains:
// - its defining function
// - its bounding-box
var model = {};

model.eval = function(x, y, z) {
    var value = 25 - (x*x + y*y + z*z);
    return value;
}

model.boundingBox = function() {

    var bbox = {x_min: -10, x_max: 10, 
		y_min: -10, y_max: 10,
	    z_min: -10, z_max: 10}

    return bbox;
}


