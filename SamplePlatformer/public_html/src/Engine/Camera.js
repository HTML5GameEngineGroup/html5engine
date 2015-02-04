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
    // WC bound Collision status
    this.eWCCollideStatus = Object.freeze({
            eCollideTop: 0,
            eCollideBottom: 1,
            eCollideLeft: 2,
            eCollideRight: 3,
            eInside: 4,
            eOutside: 5
        });
        
    // WC and viewport position and size
    this._mWCCenter = wcCenter;
    this._mWCWidth = wcWidth;
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

// <editor-fold desc="Public Methods">
// <editor-fold desc="Getter/Setter">
// <editor-fold desc="setter/getter of WC and viewport">
Camera.prototype.SetWCCenter = function(xPos, yPos) { 
    this._mWCCenter[0] = xPos; this._mWCCenter[1] = yPos; };
Camera.prototype.GetWCCenter = function() { return this._mWCCenter; };
Camera.prototype.SetWCWidth = function(width) { this._mWCWidth = width; };
Camera.prototype.GetWCWidth = function() { return this._mWCWidth; };
Camera.prototype.ZoomByDelta = function(delta) { 
    if (this._mWCWidth > delta)
        this.SetWCWidth(this._mWCWidth - delta); };

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
    mat4.lookAt(this._mViewMatrix, 
        [this._mWCCenter[0], this._mWCCenter[1], 10],   // WC center
        [this._mWCCenter[0], this._mWCCenter[1], 0],    // 
        [0, 1, 0]);     // orientation
    
    // Step B2: define the projection matrix
    var halfWCWidth = 0.5 * this._mWCWidth;
    var halfWCHeight = halfWCWidth * this._mViewport[3] / this._mViewport[2]; // viewportH/viewportW
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

Camera.prototype.ContainsPoint = function(x, y, safeBound) {
    var useZone = 1.0;
    if (safeBound !== undefined)
        useZone = safeBound;
    
    var wcHalfW = 0.5 * this._mWCWidth * useZone;
    var wcHalfH = wcHalfW * this._mViewport[3] / this._mViewport[2]; // viewportH/viewportW
    var wcLeft = this._mWCCenter[0] - wcHalfW;
    var wcRight = this._mWCCenter[0] + wcHalfW;
    var wcTop = this._mWCCenter[1] + wcHalfH;
    var wcBot = this._mWCCenter[1] - wcHalfH;  
    
    return (x > wcLeft) && (x < wcRight) && (y > wcBot) && (y < wcTop);
};

//
// gameObj is a GameObject
// safeBound is a percentage representing the "safty zone"
//    e.g., 0.8 says, we are touching the 80% zone of WC bound
//          1.2 says we are testing for bounds 1.2-times the WC bound
// it is ok to not pass safeBound, defualt to 1.0
Camera.prototype.CollideWCBound = function(xform, safeBound) {
    var useZone = 1.0;
    if (safeBound !== undefined)
        useZone = safeBound;
        
    var objPos = xform.GetPosition();
    var objSize = xform.GetSize();
    var objLeft = objPos[0] - (objSize[0]/2);
    var objRight = objPos[0] + (objSize[0]/2);
    var objTop = objPos[1] + (objSize[1]/2);
    var objBot = objPos[1] - (objSize[1]/2);
    
    var wcHalfW = 0.5 * this._mWCWidth * useZone;
    var wcHalfH = wcHalfW * this._mViewport[3] / this._mViewport[2]; // viewportH/viewportW
    var wcLeft = this._mWCCenter[0] - wcHalfW;
    var wcRight = this._mWCCenter[0] + wcHalfW;
    var wcTop = this._mWCCenter[1] + wcHalfH;
    var wcBot = this._mWCCenter[1] - wcHalfH;
    
    if ((objLeft < wcRight) && (objRight > wcLeft) &&
        (objBot < wcTop) && (objTop > wcBot)) {
            // inside
            if (objLeft < wcLeft)
                return this.eWCCollideStatus.eCollideLeft;
            
            if (objRight > wcRight)
                return this.eWCCollideStatus.eCollideRight;
            
            if (objBot < wcBot)
                return this.eWCCollideStatus.eCollideBottom;
            
            if (objTop > wcTop)
                return this.eWCCollideStatus.eCollideTop;
            
            return this.eWCCollideStatus.eInside;
            
        } else {
            return this.eWCCollideStatus.eOutside;
        }
};


//
// gameObj is a GameObject
// safeBound is a percentage representing the "safty zone"
//    e.g., 0.8 says, we are touching the 80% zone of WC bound
//          1.2 says we are testing for bounds 1.2-times the WC bound
// it is ok to not pass safeBound, defualt to 1.0
Camera.prototype.ClampAtWCBound = function(xform, safeBound) {
    var useZone = 1.0;
    if (safeBound !== undefined)
        useZone = safeBound;
        
    var objPos = xform.GetPosition();
    var objSize = xform.GetSize();
    var objHalfW = objSize[0]/2;
    var objHalfH = objSize[1]/2;
    var objLeft = objPos[0] - objHalfW;
    var objRight = objPos[0] + objHalfW;
    var objTop = objPos[1] + objHalfH;
    var objBot = objPos[1] - objHalfH;
    
    var wcHalfW = 0.5 * this._mWCWidth * useZone;
    var wcHalfH = wcHalfW * this._mViewport[3] / this._mViewport[2]; // viewportH/viewportW
    var wcLeft = this._mWCCenter[0] - wcHalfW;
    var wcRight = this._mWCCenter[0] + wcHalfW;
    var wcTop = this._mWCCenter[1] + wcHalfH;
    var wcBot = this._mWCCenter[1] - wcHalfH;
    
    if ((objLeft < wcRight) && (objRight > wcLeft) &&
        (objBot < wcTop) && (objTop > wcBot)) {
            // inside
            if (objLeft < wcLeft) {
                objPos[0] = wcLeft + objHalfW;
                return this.eWCCollideStatus.eCollideLeft;
            }
            
            if (objRight > wcRight) {
                objPos[0] = wcRight - objHalfW;
                return this.eWCCollideStatus.eCollideRight;
            }
            
            if (objBot < wcBot) {
                objPos[1] = wcBot + objHalfH;
                return this.eWCCollideStatus.eCollideBottom;
            }
            
            if (objTop > wcTop) {
                objPos[1] = wcTop - objHalfH;
                return this.eWCCollideStatus.eCollideTop;
            }
            return this.eWCCollideStatus.eInside;
            
        } else {
            return this.eWCCollideStatus.eOutside;
        }
};
//</editor-fold>