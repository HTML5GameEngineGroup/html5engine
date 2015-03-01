// 
// 
GameObject.prototype.PixelTouches = function(otherObj, wcTouchPos) {
    // only continue if both objects have GetColorArray defined 
    // if defined, should have other texture intersection support!
    var pixelTouch = false;
    var myRen = this.GetRenderable();
    var otherRen = otherObj.GetRenderable();
    
    if ((typeof myRen.PixelTouches === "function") && (typeof otherRen.PixelTouches === "function")) {
        var otherBbox = otherObj.GetBBox();
        if (otherBbox.IntersectsBound(this.GetBBox())) {
            myRen.SetColorArray();
            otherRen.SetColorArray();
            pixelTouch = myRen.PixelTouches(otherRen, wcTouchPos);
        }
    }
    return pixelTouch;
};
    