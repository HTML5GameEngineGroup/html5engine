/* 
 * File: ShadderProgram.js
 * 
 * Implements a ShaderProgram object.
 * 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

//<editor-fold desc="constructor">
// constructor of ShaderProgram object: takes three parameters
function ShaderProgram(webglContext, vertexShaderPath, fragmentShaderPath)
{
    // instance variables
    // Convention: all instance variables: mVariables
    this._mCompiledShader = null;  // reference to the compiled shader in webgl context  
    this._mShaderVertexPositionAttribute = null; // reference to SquareVertexPosition within the shader
    this._mModelTransform = null;		// reference to the model transform matrix in vertex shader
    this._mViewProjTransform = null;             // reference to the View/Projection matrix in the vertex shader
    this._mGL = webglContext;         // keep a reference to the webgl context
         
    // start of constructor code
    // 
    // load and compile the shaders
    var vertexShader = this._LoadAndCompileShader(vertexShaderPath, this._mGL.VERTEX_SHADER);
    var fragmentShader = this._LoadAndCompileShader(fragmentShaderPath, this._mGL.FRAGMENT_SHADER);
    
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

    this._mModelTransform = this._mGL.getUniformLocation(
                    this._mCompiledShader, "uModelTransform");
    
    this._mViewProjTransform = this._mGL.getUniformLocation(
                    this._mCompiledShader, "uViewProjTransform");
};
//</editor-fold>

// <editor-fold desc="Public Methods">


// Access to the compiled shader
ShaderProgram.prototype.GetShader = function() { return _mCompiledShader; };

// Activate the shader for rendering
ShaderProgram.prototype.ActivateShader = function(modelTransform) {
    this._mGL.useProgram(this._mCompiledShader);
    this._mGL.enableVertexAttribArray(this._mShaderVertexPositionAttribute);
    this._mGL.vertexAttribPointer(this._mShaderVertexPositionAttribute, 
        3,              // a total of 3 elements 
        this._mGL.FLOAT, // data type is FLOAT
        false,          // if the content is normalized vectors
        0,              // number of bytes to skip in between elements
        0);             // offsets to the first element
        
        // this last function loads the modelTransform matrix into webGL
        // to be used by the vertex shader
    this._mGL.uniformMatrix4fv(this._mModelTransform, false, modelTransform);
};

ShaderProgram.prototype.LoadViewProjMatrix = function(vpMatrix) {
    this._mGL.useProgram(this._mCompiledShader);
    this._mGL.uniformMatrix4fv(this._mViewProjTransform, false, vpMatrix);
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
ShaderProgram.prototype._LoadAndCompileShader = function(filePath, shaderType)
{
    var xmlReq, shaderSource = null, compiledShader = null;

    // Request the text from the given file location.
    xmlReq = new XMLHttpRequest();
    xmlReq.open('GET', filePath, false);
    try {
        xmlReq.send();
    } catch (error) {
        alert("Failed to load shader: " + filePath);
        return null;
    }
    shaderSource = xmlReq.responseText;

    if (shaderSource === null) {
        alert("WARNING: Loading of:" + filePath + " Failed!");
        return null;
    }

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