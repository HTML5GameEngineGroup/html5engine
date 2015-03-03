/* 
 * File: Camera.js
 * Encapsulates the user define WC and Viewport functionality
 */

// wcCenter: is a vec2
// wcWidth: is the width of the user defined WC
//      Height of the user defined WC is implicitly defined by the viewport aspect ratio
//      Please refer to the following
// viewportRect: an array of 4 elements
//      [0] [1]: (x,y) position of lower left corner on the canvas (in pixel)
//      [2]: width of viewport
//      [3]: height of viewport
//      
//  wcHeight = wcWidth * viewport[3]/viewport[2]
//
function Camera(wcCenter, wcWidth, viewportArray)
{
    // WC and viewport position and size
    this._mCameraState = new CameraState(wcCenter, wcWidth);
    this._mViewport = viewportArray;  // [x, y, width, height]
    this._mNearPlane = 0;
    this._mFarPlane = 1000;
    
    // transformation matrices
    this._mViewMatrix = mat4.create();
    this._mProjMatrix = mat4.create();
    this._mVPMatrix = mat4.create();
    
    // background color
    this._mBgColor = [0.8, 0.8, 0.8, 1]; // RGB and Alpha
};

Camera.eViewport = Object.freeze({
            eOrgX: 0,
            eOrgY: 1,
            eWidth: 2,
            eHeight: 3
});
    
// <editor-fold desc="Public Methods">
// <editor-fold desc="Getter/Setter">
// <editor-fold desc="setter/getter of WC and viewport">
Camera.prototype.SetWCCenter = function(xPos, yPos) { 
    var p = vec2.fromValues(xPos, yPos); 
    this._mCameraState.SetCenter(p); };
Camera.prototype.GetWCCenter = function() { return this._mCameraState.GetCenter(); };
Camera.prototype.SetWCWidth = function(width) { this._mCameraState.SetWidth(width); };
Camera.prototype.GetWCWidth = function() { return this._mCameraState.GetWidth(); };
Camera.prototype.GetWCHeight = function() { return this._mCameraState.GetWidth() * this._mViewport[Camera.eViewport.eHeight] / this._mViewport[Camera.eViewport.eWidth]; };
                                                                        // viewportH/viewportW

Camera.prototype.SetViewport = function(viewportArray) { this._mViewport = viewportArray; };
Camera.prototype.GetViewport = function() { return this._mViewport; };
//</editor-fold>

//<editor-fold desc="setter/getter of wc background color">
Camera.prototype.SetBackgroundColor = function(newColor) { this._mBgColor = newColor; };
Camera.prototype.GetBackgroundColor = function() { return this._mBgColor; };

// Getter for the View-Projection transform operator
Camera.prototype.GetVPMatrix = function() {
      return this._mVPMatrix;
};
// </editor-fold>
// </editor-fold>

// Initializes the camera to begin drawing
Camera.prototype.SetupViewProjection = function() {
    var gl = gEngine.Core.GetGL();
    //<editor-fold desc="Step A: Set up and clear the Viewport">
    // Step A1: Set up the viewport: area on canvas to be drawn
    gl.viewport(this._mViewport[0], // x position of bottom-left corner of the area to be drawn
                this._mViewport[1], // y position of bottom-left corner of the area to be drawn
                this._mViewport[2], // width of the area to be drawn
                this._mViewport[3]);  // height of the area to be drawn
    // Step A2: set up the corresponding scissor area to limite clear area
    gl.scissor( this._mViewport[0], // x position of bottom-left corner of the area to be drawn
                this._mViewport[1], // y position of bottom-left corner of the area to be drawn
                this._mViewport[2], // width of the area to be drawn
                this._mViewport[3]);// height of the area to be drawn
    // Step A3: set the color to be clear to black
    gl.clearColor(this._mBgColor[0], this._mBgColor[1], this._mBgColor[2], this._mBgColor[3]);  // set the color to be cleared
    // Step A4: enable the scissor area, clear, and then disable the scissor area
    gl.enable(gl.SCISSOR_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT); 
    gl.disable(gl.SCISSOR_TEST);
    //</editor-fold>
    
    //<editor-fold desc="Step  B: Set up the View-Projection transform operator"> 
    // Step B1: define the view matrix
    var center = this.GetWCCenter();
    mat4.lookAt(this._mViewMatrix, 
        [center[0], center[1], 10],   // WC center
        [center[0], center[1], 0],    // 
        [0, 1, 0]);     // orientation
    
    // Step B2: define the projection matrix
    var halfWCWidth = 0.5 * this.GetWCWidth();
    var halfWCHeight = 0.5 * this.GetWCHeight(); // 
    mat4.ortho(this._mProjMatrix,
        -halfWCWidth,   // distant to left of WC
         halfWCWidth,   // distant to right of WC
        -halfWCHeight,  // distant to bottom of WC
         halfWCHeight,  // distant to top of WC
         this._mNearPlane,   // z-distant to near plane 
         this._mFarPlane  // z-distant to far plane 
    );
    
    // Step B3: concatnate view and project matrices
    mat4.multiply(this._mVPMatrix, this._mProjMatrix, this._mViewMatrix);
    //</editor-fold>
};
//</editor-fold>

Camera.prototype.CollideWCBound = function(aXform, zone) {
    var bbox = new BoundingBox(aXform.GetPosition(), aXform.GetWidth(), aXform.GetHeight());
    var w = zone * this.GetWCWidth();
    var h = zone * this.GetWCHeight();
    var cameraBound = new BoundingBox(this.GetWCCenter(), w, h);
    return cameraBound.BoundCollideStatus(bbox);
};

// prevents the xform from moving outside of the WC boundary.
// by clamping the aXfrom at the boundary of WC, 
Camera.prototype.ClampAtBoundary = function(aXform, zone) {
    var status = this.CollideWCBound(aXform, zone);
    if (status !== BoundingBox.eBoundCollideStatus.eInside) {
        var pos = aXform.GetPosition();
        if ((status & BoundingBox.eBoundCollideStatus.eCollideTop) !== 0) {
            pos[1] = (this.GetWCCenter())[1] + (zone * this.GetWCHeight()/2) - (aXform.GetHeight()/2);
        }
        if ((status & BoundingBox.eBoundCollideStatus.eCollideBottom) !== 0) {
            pos[1] = (this.GetWCCenter())[1] - (zone * this.GetWCHeight()/2) + (aXform.GetHeight()/2);
        }
        if ((status & BoundingBox.eBoundCollideStatus.eCollideRight) !== 0) {
            pos[0] = (this.GetWCCenter())[0] + (zone * this.GetWCWidth()/2) - (aXform.GetWidth()/2);
        }
        if ((status & BoundingBox.eBoundCollideStatus.eCollideLeft) !== 0) {
            pos[0] = (this.GetWCCenter())[0] - (zone * this.GetWCWidth()/2) + (aXform.GetWidth()/2);
        }
    }
    return status;
};