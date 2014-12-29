/* 
 * File: ShadderProgram.js
 * 
 * Implements a ShaderProgram object.
 * 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

//<editor-fold desc="constructor">
// constructor of ShaderProgram object: takes three parameters.
function ShaderProgram(webglContext, vertexShaderID, fragmentShaderID)
{
    // instance variables
    // Convention: all instance variables: mVariables
    this._mCompiledShader = null;  // reference to the compiled shader in webgl context  
    this._mShaderVertexPositionAttribute = null; // reference to SquareVertexPosition within the shader
    this._mGL = webglContext;         // keep a reference to the webgl context
         
    // start of constructor code
    // 
    // load and compile the shaders
    var vertexShader = this._LoadAndCompileShader(vertexShaderID, this._mGL.VERTEX_SHADER);
    var fragmentShader = this._LoadAndCompileShader(fragmentShaderID, this._mGL.FRAGMENT_SHADER);
    
    // Create and link the program.
    this._mCompiledShader = this._mGL.createProgram();
    this._mGL.attachShader(this._mCompiledShader, vertexShader);
    this._mGL.attachShader(this._mCompiledShader, fragmentShader);
    
    this._mGL.linkProgram(this._mCompiledShader);

    // Show error if failed.
    if (!this._mGL.getProgramParameter(this._mCompiledShader, this._mGL.LINK_STATUS))
    {
        alert("Error linking shader");
        return null;
    }
    
    this._mShaderVertexPositionAttribute = this._mGL.getAttribLocation(
                    this._mCompiledShader, "aSquareVertexPosition");
};
//</editor-fold>

// <editor-fold desc="Public Methods">

// Access to the compiled shader
ShaderProgram.prototype.GetShader = function() { return _mCompiledShader; };

// Activate the shader for rendering
ShaderProgram.prototype.ActivateShader = function() {
    this._mGL.useProgram(this._mCompiledShader);
    this._mGL.enableVertexAttribArray(this._mShaderVertexPositionAttribute);
    this._mGL.vertexAttribPointer(this._mShaderVertexPositionAttribute, 
        3,              // a total of 3 elements 
        this._mGL.FLOAT, // data type is FLOAT
        false,          // if the content is normalized vectors
        0,              // number of bytes to skip in between elements
        0);             // offsets to the first element
};
//-- end of public methods
// </editor-fold>

// <editor-fold desc="Private Methods">
//**-----------------------------------
// Private methods not mean to call by outside of this object
//    naming convention: starts with an "_"
// **------------------------------------

// 
// Returns a complied shader from a shader in the dom.
// The id is the id of the script in the html tag.
ShaderProgram.prototype._LoadAndCompileShader = function(id, shaderType)
{
    var shaderText, shaderSource, compiledShader;

    // Get the shader source in DOM format
    shaderText = document.getElementById(id);

    // Get shader source as a string.
    shaderSource = shaderText.firstChild.textContent;

    // Create the shader based on the input type.
    compiledShader = this._mGL.createShader(shaderType);

    // Give the source to the shader to be compiled.
    this._mGL.shaderSource(compiledShader, shaderSource);

    // Complie shader program
    this._mGL.compileShader(compiledShader);

    // Check if successful, if not display log and return null.
    // The log info is how shader compilation errors are typically displayed.
    // This is useful for debugging the shaders.
    if (!this._mGL.getShaderParameter(compiledShader, this._mGL.COMPILE_STATUS))
    {
        alert("A shader compliling error occurred: " + this._mGL.getShaderInfoLog(compiledShader));
    }

    return compiledShader;
};
//-- end of private methods
//</editor-fold>