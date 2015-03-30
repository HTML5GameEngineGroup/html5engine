/* 
 * File: TextureShader.js
 * Subclass from SimpleShader
 * Implements a Textured ShaderProgram object.
 * 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

//<editor-fold desc="constructor">
// constructor
function TextureShader(vertexShaderPath, fragmentShaderPath)
{
    // Call super class constructor
    SimpleShader.call(this, vertexShaderPath, fragmentShaderPath);  // call SimpleShader constructor
    
    // reference to aTextureCoordinate within the shader
    this._mShaderTextureCoordAttribute = null;    
    
    // get the reference of aTextureCoordinate within the shader
    var gl = gEngine.Core.GetGL();
    this._mShaderTextureCoordAttribute = gl.getAttribLocation(this._mCompiledShader, "aTextureCoordinate");
};

// get all the prototype functions from SimpleShader
gEngine.Core.InheritPrototype(TextureShader, SimpleShader);


//</editor-fold>

// <editor-fold desc="Public Methods">

// Overriding the Activation of the shader for rendering
TextureShader.prototype.ActivateShader = function(pixelColor, aCamera) {
    // first call the super class's activate
    SimpleShader.prototype.ActivateShader.call(this, pixelColor, aCamera);
    
    // now our own functionality: enable texture coordinate array
    var gl = gEngine.Core.GetGL();
    gl.bindBuffer(gl.ARRAY_BUFFER, gEngine.VertexBuffer.GetGLTexCoordRef());
    gl.enableVertexAttribArray(this._mShaderTextureCoordAttribute);
    gl.vertexAttribPointer(this._mShaderTextureCoordAttribute, 2, gl.FLOAT, false, 0,0);
};
    
//</editor-fold>