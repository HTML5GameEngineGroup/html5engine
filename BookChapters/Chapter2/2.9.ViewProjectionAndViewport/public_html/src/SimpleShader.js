/* 
 * File: SimpleShader.js
 * 
 * Implements a SimpleShader object.
 * 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

//<editor-fold desc="constructor">
// constructor of SimpleShader object
function SimpleShader(vertexShaderPath, fragmentShaderPath)
{
    // instance variables
    // Convention: all instance variables: mVariables
    this._mCompiledShader = null;  // reference to the compiled shader in webgl context  
    this._mShaderVertexPositionAttribute = null; // reference to SquareVertexPosition within the shader
    this._mModelTransform = null;		// reference to the model transform matrix in vertex shader
    this._mViewProjTransform = null;             // reference to the View/Projection matrix in the vertex shader
    
    var gl = gEngineCore.GetGL();
         
    // start of constructor code
    // 
    // Step 1: load and compile vertex and fragment shaders
    var vertexShader = this._LoadAndCompileShader(vertexShaderPath, gl.VERTEX_SHADER);
    var fragmentShader = this._LoadAndCompileShader(fragmentShaderPath, gl.FRAGMENT_SHADER);
    
    // Step 2: Create and link the shaders into a program.
    this._mCompiledShader = gl.createProgram();
    gl.attachShader(this._mCompiledShader, vertexShader);
    gl.attachShader(this._mCompiledShader, fragmentShader);
    gl.linkProgram(this._mCompiledShader);

    // Step 3: check for error
    if (!gl.getProgramParameter(this._mCompiledShader, gl.LINK_STATUS))
    {
        alert("Error linking shader");
        return null;
    }
    
    // Step 4: Gets a reference to the SquareVertexPosition variable within the shaders.
    this._mShaderVertexPositionAttribute = gl.getAttribLocation(
                    this._mCompiledShader, "aSquareVertexPosition");

    
    // Step 5: Activates the vertex buffer loaded in EngineCore_VertexBuffer.js
    gl.bindBuffer(gl.ARRAY_BUFFER, gEngineCore.VertexBuffer.GetGLVertexRef());
    
    /// Step 6: Describe the characteristic of the vertex position attribute
    gl.vertexAttribPointer(this._mShaderVertexPositionAttribute, 
        3,              // each element is a 3-float (x,y.z)
        gl.FLOAT,       // data type is FLOAT
        false,          // if the content is normalized vectors
        0,              // number of bytes to skip in between elements
        0);             // offsets to the first element
    
    // Step 7: create the reference to the uniform attribute "uModelTransform" 
    this._mModelTransform = gl.getUniformLocation(
                    this._mCompiledShader, "uModelTransform");
    
    // Step 8: create the reference to the uniform attribute "uViewProjTransform"
    this._mViewProjTransform = gl.getUniformLocation(
                    this._mCompiledShader, "uViewProjTransform");
};
//</editor-fold>

// <editor-fold desc="Public Methods">


// Access to the compiled shader
SimpleShader.prototype.GetShader = function() { return _mCompiledShader; };

// Activate the shader for rendering
SimpleShader.prototype.ActivateShader = function(vpMatrix) {
    var gl = gEngineCore.GetGL();
    gl.useProgram(this._mCompiledShader);
    gl.uniformMatrix4fv(this._mViewProjTransform, false, vpMatrix);
    gl.enableVertexAttribArray(this._mShaderVertexPositionAttribute);
};
// Loads per-object model transform to the vertex shader
SimpleShader.prototype.LoadObjectTransform = function(modelTransform) {
    var gl = gEngineCore.GetGL();
        // loads the modelTransform matrix into webGL to be used by the vertex shader
    gl.uniformMatrix4fv(this._mModelTransform, false, modelTransform);
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
SimpleShader.prototype._LoadAndCompileShader = function(filePath, shaderType)
{
    var gl = gEngineCore.GetGL();
    var xmlReq, shaderSource = null, compiledShader = null;

    // Step 1: Request the text from the given file location.
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

    // Step 2: Create the shader based on the shader type: vertex or fragment
    compiledShader = gl.createShader(shaderType);

    // Step 3: Complie the created shader
    gl.shaderSource(compiledShader, shaderSource);    
    gl.compileShader(compiledShader);

    // Step 4: check for errors and return results (null if error)
    // The log info is how shader compilation errors are typically displayed.
    // This is useful for debugging the shaders.
    if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS))
    {
        alert("A shader compliling error occurred: " + gl.getShaderInfoLog(compiledShader));
    }

    return compiledShader;
};
//-- end of private methods
//</editor-fold>