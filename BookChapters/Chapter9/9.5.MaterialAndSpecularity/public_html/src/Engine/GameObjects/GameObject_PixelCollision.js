// 
// 
GameObject.prototype.PixelTouches = function(otherObj, wcTouchPos) {
    // only continue if both objects have GetColorArray defined 
    // if defined, should have other texture intersection support!
    var pixelTouch = false;
    var myRen = this.GetRenderable();
    var otherRen = otherObj.GetRenderable();
    
    if ((typeof myRen.PixelTouches === "function") && (typeof otherRen.PixelTouches === "function")) {
        if ((myRen.GetXform().GetRotationInRad() === 0) && (otherRen.GetXform().GetRotationInRad() === 0)) {
            // no rotation, we can use bbox ...
            var otherBbox = otherObj.GetBBox();
            if (otherBbox.IntersectsBound(this.GetBBox())) {
                myRen.SetColorArray();
                otherRen.SetColorArray();
                pixelTouch = myRen.PixelTouches(otherRen, wcTouchPos);
            }
        } else {
            // One of both are rotated ... use radius ... be conservative
            // Use the larger of the Width/Height and approx radius
            //   Sqrt(1/2)*x Approx = 0.71f * x;
            var mySize = myRen.GetXform().GetSize();
            var otherSize = otherRen.GetXform().GetSize();
            // otherwise, use simple distance
            // Sqrt(0.5) approx = 0.71
            var myR = 0.71 * Math.max(mySize[0], mySize[1]);
            var otherR = 0.71 * Math.max(otherSize[0], otherSize[1]);
            var d = [];
            vec2.sub(d, myRen.GetXform().GetPosition(), otherRen.GetXform().GetPosition());
            if (vec2.length(d) < (myR+otherR)) {
                myRen.SetColorArray();
                otherRen.SetColorArray();
                pixelTouch = myRen.PixelTouches(otherRen, wcTouchPos);
            }
        }
    }
    return pixelTouch;
};