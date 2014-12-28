/* 
 * File: Camera.js
 * Encapsulates the user define Window and Viewport functionality
 */

// cameraPosition: is a vec2
// cameraWidth: is the width of the user defined Window
//      Height of the user defined Window is implicitly defined by the viewport aspect ratio
//      Please refer to the following
// viewportRect: an array of 4 elements
//      [0] [1]: (x,y) position of lower left corner on the canvas (in pixel)
//      [2]: width of viewport
//      [3]: height of viewport
//      
//  cameraHeight = cameraWidth * viewport[3]/viewport[2]
//
function Camera(cameraPosition, cameraWidth, viewportArray)
{
    // Camera and viewport position and size
    this.mCameraPosition = cameraPosition;
    this.mCameraWidth = cameraWidth;
    this.mViewport = viewportArray;
    this.mNearPlane = 0;
    this.mFarPlane = 1000;
    
    // transformation matrices
    this.mViewMatrix = mat4.create();
    this.mProjMatrix = mat4.create();
    this.mVPMatrix = mat4.create();
    
    // background color
    this.mBgColor = [0, 0, 0, 1];
    
    //<editor-fold desc="setter/getter of window and viewport">
    this.SetCameraPosition = function(xPos, yPos) { 
        this.mCameraPosition[0] = xPos; this.mCameraPosition[1] = yPos; };
    this.GetCameraPosition = function() { return this.mCameraPosition; };
    this.SetCameraWidth = function(width) { this.mCameraWidth = width; };
    
    this.SetViewport = function(viewportArray) { this.mViewport = viewportArray; };
    this.GetViewport = function() { return this.mViewport; };
    //</editor-fold>
    
    //<editor-fold desc="setter/getter of camera background color">
    this.SetBackgroundColor = function(newColor) { this.mBgColor = newColor; };
    this.GetBackgroundColor = function() { return this.mBgColor; };
    
    //</editor-fold>
};

// <editor-fold desc="Public Methods">

// Initializes the camera to begin drawing to this camera
Camera.prototype.BeginDraw = function() {
    var gl = gEngineCore.GetGL();
    //<editor-fold desc="Setting up Viewport">
    // Set up the viewport: area on canvas to be drawn
    gl.viewport(this.mViewport[0], // x position of bottom-left corner of the area to be drawn
                this.mViewport[1], // y position of bottom-left corner of the area to be drawn
                this.mViewport[2], // width of the area to be drawn
                this.mViewport[3]);  // height of the area to be drawn

    gl.scissor( this.mViewport[0], // x position of bottom-left corner of the area to be drawn
                this.mViewport[1], // y position of bottom-left corner of the area to be drawn
                this.mViewport[2], // width of the area to be drawn
                this.mViewport[3]);// height of the area to be drawn

    gl.clearColor(this.mBgColor[0], this.mBgColor[1], this.mBgColor[2], this.mBgColor[3]);  // set the color to be cleared
    gl.enable(gl.SCISSOR_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT); 
    gl.disable(gl.SCISSOR_TEST);
    //</editor-fold>
    
    //<editor-fold desc="Set up View and Projection matrices">    
    mat4.lookAt(this.mViewMatrix, 
        [this.mCameraPosition[0], this.mCameraPosition[1], 10],   // camera position
        [this.mCameraPosition[0], this.mCameraPosition[1], 0],    // look at position
        [0, 1, 0]);     // orientation vector
    
    var halfCameraWidth = 0.5 * this.mCameraWidth;
    var halfCameraHeight = halfCameraWidth * this.mViewport[3] / this.mViewport[2]; // viewportH/viewportW
    mat4.ortho(this.mProjMatrix,
        -halfCameraWidth,   // distant to left of frustum
         halfCameraWidth,   // distant to right of frustum
        -halfCameraHeight,  // distant to bottom of frustum
         halfCameraHeight,  // distant to top of frustum
         this.mNearPlane,   // distant to near plane of frustum
         this.mFarPlane  // distant to far plane of frustum
    );
    mat4.multiply(this.mVPMatrix, this.mProjMatrix, this.mViewMatrix);
    //</editor-fold>
};

// returns the matrix the concatenates the View and Projection matrix
Camera.prototype.GetVPMatrix = function() {
      return this.mVPMatrix;
};

//</editor-fold>