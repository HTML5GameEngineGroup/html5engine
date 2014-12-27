/* 
 * File: ShadderProgram.js
 * 
 * Implements a ShaderProgram object.
 * 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

// constructor of ShaderProgram object: takes three parameters
function ShaderProgram(webglContext, vertexShaderPath, fragmentShaderPath)
{
    // private instance variables
    // Convention: all instance variables: mVariables
    var mCompiledShader = null;  // reference to the compiled shader in webgl context  
    var mShaderVertexPositionAttribute = null; // reference to SquareVertexPosition within the shader
    var mGL = webglContext;         // keep a reference to the webgl context
        
    //**-----------------------------------
    // Private methods not mean to call by outside of this object
    // **------------------------------------
    // 
    // Returns a complied shader from a path to a file containing a shader
        var LoadAndCompileShader = function(filePath, shaderType)
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
            compiledShader = mGL.createShader(shaderType);

            // Give the source to the shader to be compiled.
            mGL.shaderSource(compiledShader, shaderSource);

            // Complie shader program
            mGL.compileShader(compiledShader);

            // Check if successful, if not display log and return null.
            // The log info is how shader compilation errors are typically displayed.
            // This is useful for debugging the shaders.
            if (!mGL.getShaderParameter(compiledShader, mGL.COMPILE_STATUS))
            {
                alert("A shader compliling error occurred: " + mGL.getShaderInfoLog(compiledShader));
            }
            
            return compiledShader;
        };
        
        // The webGL Context for this shader
        var GetGL = function() { return mGL; };   
        // Access to the vertex position attribute
        var VPAttr = function() { return mShaderVertexPositionAttribute; };
    //-- end of private methods
    
    //**----------------------------------------
    // Public methods
    //     Will be accessible from the returned object
    //**----------------------------------------        
        // Access to the compiled shader
        var GetShader = function() { return mCompiledShader; };
               
        // Activate the shader for rendering
        var ActivateShader = function() {
            mGL.useProgram(mCompiledShader);
            mGL.enableVertexAttribArray(mShaderVertexPositionAttribute);
            mGL.vertexAttribPointer(mShaderVertexPositionAttribute, 
                3,          // a total of 3 elements 
                mGL.FLOAT,  // data type is FLOAT
                false,      // if the content is normalized vectors
                0,          // number of bytes to skip in between elements
                0);         // offsets to the first element
        };
    //-- end of public methods
    
    // start of constructor code
    // 
    // load and compile the shaders
    var vertexShader = LoadAndCompileShader(vertexShaderPath, mGL.VERTEX_SHADER);
    var fragmentShader = LoadAndCompileShader(fragmentShaderPath, mGL.FRAGMENT_SHADER);
    
    // Create and link the program.
    mCompiledShader = mGL.createProgram();
    mGL.attachShader(mCompiledShader, vertexShader);
    mGL.attachShader(mCompiledShader, fragmentShader);
    
    mGL.linkProgram(mCompiledShader);

    // Show error if failed.
    if (!mGL.getProgramParameter(mCompiledShader, mGL.LINK_STATUS))
    {
        alert("Error linking shader");
        return null;
    }
    
    mShaderVertexPositionAttribute = mGL.getAttribLocation(mCompiledShader, 
                            "SquareVertexPosition");
    
    // return the varialbe that exports public methods
    var publicMethods =   {
            // these references keeps the variables in scope
            privateMethod1: GetGL,
            privateMethod2: VPAttr,
            
            GetShader: GetShader,
            ActivateShader : ActivateShader
    };
    
    return publicMethods;
};