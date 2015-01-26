/* 
 * File: SpriteShader.js
 * Subclass from TextureShader
 * Implements a Textured ShaderProgram object where texture coordinate can be changed
 * at run time.
 * 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

//<editor-fold desc="constructor">
// constructor 
function SpriteShader(vertexShaderPath, fragmentShaderPath)
{
    // Call sper class constructor
    TextureShader.call(this, vertexShaderPath, fragmentShaderPath);  // call SimpleShader constructor
    
    this._mTexCoordBuffer = null; // this is the reference to gl buffer that contains the actual texture coordinate

    var initTexCoord = [
      1.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      0,0, 0.0  
    ];
    
    var gl = gEngine.Core.GetGL();
    this._mTexCoordBuffer = gl.createBuffer();
    
    // the expected texture cooridnate array is an array of 8 floats where elements:
    //  [0] [1]: is x/y cooridnate of Top-Right 
    //  [2] [3]: is x/y coordinate of Top-Left
    //  [4] [5]: is x/y coordinate of Bottom-Right
    //  [6] [7]: is x/y coordinate of Bottom-Left
    // Convention: eName is an enumerated data type
    this.eTextureCoordArray = Object.freeze({
            eLeft: 2,
            eRight: 0,
            eTop: 1,
            eBottom: 5
        });

    gl.bindBuffer(gl.ARRAY_BUFFER, this._mTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(initTexCoord), gl.DYNAMIC_DRAW);
            // DYNAMIC_DRAW: says buffer content may change!
};

// get all the prototype functions from SimpleShader
gEngine.Core.InheritPrototype(SpriteShader, TextureShader);
//</editor-fold>

// <editor-fold desc="Public Methods">
    
// Overriding the Activation of the shader for rendering
SpriteShader.prototype.ActivateShader = function(vpMatrix) {
    // fist call the super class's activate
    SimpleShader.prototype.ActivateShader.call(this, vpMatrix);
    
    // now binds the proper texture coordinate buffer
    var gl = gEngine.Core.GetGL();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._mTexCoordBuffer);
    gl.vertexAttribPointer(this._mShaderTextureCoordAttribute, 
            2,
            gl.FLOAT, 
            false,    
            0,        
            0);
    gl.enableVertexAttribArray(this._mShaderTextureCoordAttribute);
};

SpriteShader.prototype.SetTextureCoordinate = function(texCoord)
{
    var gl = gEngine.Core.GetGL();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._mTexCoordBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(texCoord));
};
//</editor-fold>