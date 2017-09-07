

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

    for (var j = 0; j < h; j++) {
    for (var i = 0; i < w; i++) {
        var idx = (j*w+i)*4;

        if (cnt[idx]==0) { //==255?
        cntList[n++] = new Point2d(i, j);
        }
    }
    }
   return n;
}


// Compute the dist from (x,y) to the curve approximated by
// the list of points in cntList
//
computeDistPoint = function(x, y, cntList,n) {
    var d = Number.MAX_VALUE;
    
    var count = n;
    
    for (var i = 0; i < count; i++) {// i<cntList.length is error( 3726
    p = cntList[i];
    var dt = (x - p.x)*(x - p.x) + (y - p.y)*(y - p.y);
    if (dt < d) {
        d = dt;
    }
    }

    return Math.sqrt(d);
}
