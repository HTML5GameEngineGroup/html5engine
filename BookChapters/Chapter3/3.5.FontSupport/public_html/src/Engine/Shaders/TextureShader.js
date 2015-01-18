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
    // Call sper class constructor
    SimpleShader.call(this, vertexShaderPath, fragmentShaderPath);  // call SimpleShader constructor
    
    // our own instance variable
    this._mShaderTextureCoordAttribute = null;   // reference to aTextureCoordinate within the shader 
    
    // initialization of our own 
    var gl = gEngine.Core.GetGL();
    this._mShaderTextureCoordAttribute = gl.getAttribLocation(
            this._mCompiledShader, "aTextureCoordinate");
};

// get all the prototype functions from SimpleShader
gEngine.Core.InheritPrototype(TextureShader, SimpleShader);


//</editor-fold>

// <editor-fold desc="Public Methods">

// Overriding the Activation of the shader for rendering
TextureShader.prototype.ActivateShader = function(vpMatrix) {
    // fist call the super class's activate
    SimpleShader.prototype.ActivateShader.call(this, vpMatrix);
    
    // now our own functionality: enable texture coordinate array
    var gl = gEngine.Core.GetGL();
    gl.bindBuffer(gl.ARRAY_BUFFER, gEngine.VertexBuffer.GetGLTexCoordRef());
    gl.enableVertexAttribArray(this._mShaderTextureCoordAttribute);
    gl.vertexAttribPointer(this._mShaderTextureCoordAttribute, 2, gl.FLOAT, false, 0,0);
};
    
//</editor-fold>