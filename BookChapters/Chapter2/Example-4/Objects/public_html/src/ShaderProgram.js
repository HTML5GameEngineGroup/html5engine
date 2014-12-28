/* 
 * File: ShadderProgram.js
 * 
 * Implements a ShaderProgram object.
 * 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

//<editor-fold desc="constructor">
// constructor of ShaderProgram object: takes three parameters (for now).
function ShaderProgram(webglContext, vertexShaderID, fragmentShaderID)
{
    // instance variables
    // Convention: all instance variables: mVariables
    this.mCompiledShader = null;  // reference to the compiled shader in webgl context  
    this.mShaderVertexPositionAttribute = null; // reference to SquareVertexPosition within the shader
    this.mGL = webglContext;         // keep a reference to the webgl context
         
    // start of constructor code
    // 
    // load and compile the shaders
    var vertexShader = this._loadAndCompileShader(vertexShaderID, this.mGL.VERTEX_SHADER);
    var fragmentShader = this._loadAndCompileShader(fragmentShaderID, this.mGL.FRAGMENT_SHADER);
    
    // Create and link the program.
    this.mCompiledShader = this.mGL.createProgram();
    this.mGL.attachShader(this.mCompiledShader, vertexShader);
    this.mGL.attachShader(this.mCompiledShader, fragmentShader);
    
    this.mGL.linkProgram(this.mCompiledShader);

    // Show error if failed.
    if (!this.mGL.getProgramParameter(this.mCompiledShader, this.mGL.LINK_STATUS))
    {
        alert("Error linking shader");
        return null;
    }
    
    this.mShaderVertexPositionAttribute = this.mGL.getAttribLocation(
                    this.mCompiledShader, "SquareVertexPosition");
};
//</editor-fold>

// <editor-fold desc="Public Methods">
//**----------------------------------------
// Public methods
//     Will be accessible from the returned object
//**----------------------------------------        

// Access to the compiled shader
ShaderProgram.prototype.GetShader = function() { return mCompiledShader; };

// Activate the shader for rendering
ShaderProgram.prototype.ActivateShader = function() {
    this.mGL.useProgram(this.mCompiledShader);
    this.mGL.enableVertexAttribArray(this.mShaderVertexPositionAttribute);
    this.mGL.vertexAttribPointer(this.mShaderVertexPositionAttribute, 
        3,              // a total of 3 elements 
        this.mGL.FLOAT, // data type is FLOAT
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
ShaderProgram.prototype._loadAndCompileShader = function(id, shaderType)
{
    var shaderText, shaderSource, compiledShader;

    // Get the shader source in DOM format
    shaderText = document.getElementById(id);

    // Get shader source as a string.
    shaderSource = shaderText.firstChild.textContent;

    // Create the shader based on the input type.
    compiledShader = this.mGL.createShader(shaderType);

    // Give the source to the shader to be compiled.
    this.mGL.shaderSource(compiledShader, shaderSource);

    // Complie shader program
    this.mGL.compileShader(compiledShader);

    // Check if successful, if not display log and return null.
    // The log info is how shader compilation errors are typically displayed.
    // This is useful for debugging the shaders.
    if (!this.mGL.getShaderParameter(compiledShader, this.mGL.COMPILE_STATUS))
    {
        alert("A shader compliling error occurred: " + this.mGL.getShaderInfoLog(compiledShader));
    }

    return compiledShader;
};
//-- end of private methods
//</editor-fold>