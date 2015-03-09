/* 
 * File: LineShader.js
 *          for debugging physics engine
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

//<editor-fold desc="constructor">
// constructor of LineShader object
function LineShader(vertexShaderPath, fragmentShaderPath)
{
    // Call sper class constructor
    SimpleShader.call(this, vertexShaderPath, fragmentShaderPath);  // call SimpleShader constructor
    
    this._mPointSizeRef = null;            // reference to the PointSize uniform
    var gl = gEngine.Core.GetGL();
    
    // point size uniform
    this._mPointSizeRef = gl.getUniformLocation(this._mCompiledShader, "uPointSize");
    
    this._mPointSize = 1;
};
gEngine.Core.InheritPrototype(LineShader, SimpleShader);
//</editor-fold>

// <editor-fold desc="Public Methods">

// Activate the shader for rendering
LineShader.prototype.ActivateShader = function(pixelColor, aCamera) {
    // fist call the super class's activate
    SimpleShader.prototype.ActivateShader.call(this, pixelColor, aCamera);
    
    // now our own functionality: enable texture coordinate array
    var gl = gEngine.Core.GetGL();
    gl.uniform1f(this._mPointSizeRef, this._mPointSize);
    gl.bindBuffer(gl.ARRAY_BUFFER, gEngine.VertexBuffer.GetGLLineVertexRef());
    gl.vertexAttribPointer(this._mShaderVertexPositionAttribute,
        3,              // each element is a 3-float (x,y.z)
        gl.FLOAT,       // data type is FLOAT
        false,          // if the content is normalized vectors
        0,              // number of bytes to skip in between elements
        0);  
    
    gl.enableVertexAttribArray(this._mShaderVertexPositionAttribute);
};
LineShader.prototype.SetPointSize = function(w) { this._mPointSize = w; };

//-- end of public methods
// </editor-fold>