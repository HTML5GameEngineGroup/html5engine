/* 
 * File: SimpleShader.js
 * 
 * Implements a SimpleShader object.
 * 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

// constructor of SimpleShader object: takes three parameters
function SimpleShader(webglContext, vertexShaderPath, fragmentShaderPath)
{
    // private instance variables
    // Convention: all instance variables: mVariables
    var mGL = webglContext;         // keep a reference to the webgl context
    var mCompiledShader = null;  // reference to the compiled shader in webgl context  
    var mShaderVertexPositionAttribute = null; // reference to SquareVertexPosition within the shader
    var mModelTransform = null;  // reference to model transform matrix in vertex shader
    
        
    //**-----------------------------------
    // Private methods not mean to call by outside of this object
    // **------------------------------------
    // 
    // Returns a complied shader from a path to a file containing a shader
        var LoadAndCompileShader = function(filePath, shaderType)
        {
            var xmlReq, shaderSource, compiledShader = null;

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
        
        // Access to the model transform location
        var GetGLModelTransformRef = function() { return mModelTransform; };
    //-- end of private methods
    
    //**----------------------------------------
    // Public methods
    //     Will be accessible from the returned object
    //**----------------------------------------
        // Access to the compiled shader
        var GetShader = function() { return mCompiledShader; };
                
        // Activate the shader for rendering
        var ActivateShader = function(modelTransform) {
            mGL.useProgram(mCompiledShader);
            mGL.enableVertexAttribArray(mShaderVertexPositionAttribute);
            mGL.vertexAttribPointer(mShaderVertexPositionAttribute, 
                3,          // a total of 3 elements 
                mGL.FLOAT,  // data type is FLOAT
                false,      // if the content is normalized vectors
                0,          // number of bytes to skip in between elements
                0);         // offsets to the first element
            mGL.uniformMatrix4fv(mModelTransform, false, modelTransform);
            
            /*
            var numU = mGL.getProgramParameter(mCompiledShader, mGL.ACTIVE_UNIFORMS);
            var allU = [];
            for (var ii = 0; ii < numU; ++ii) {
                allU.push(mGL.getActiveUniform(mCompiledShader, ii).name);
            }
            allU.sort();
            */
            var la =  mGL.getUniformLocation(mCompiledShader, "sat[1].a");
            // var lw =  mGL.getUniformLocation(mCompiledShader, "w");
            // var lsa =  mGL.getUniformLocation(mCompiledShader, "ss.a");
             
            // var lfr = mGL.getUniformLocation(mCompiledShader, "fs.r");
            
            
            // var s;
            // s = mGL.getUniformLocation(mCompiledShader, "s.a");
            // s = mGL.getUniformLocation(mCompiledShader, "w");
            mGL.uniform4fv(la, [0.5, 0, 1, 1]);
            // mGL.uniform4fv(lw, [0, 0, 0, 1]);
            // mGL.uniform4fv(lsa, [0, 0, 0, 1]);
            
            // mGL.uniform1f(lfr, 1);
            
            
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
    mModelTransform = mGL.getUniformLocation(mCompiledShader, "ModelTransform");
    
    // return the varialbe that exports public methods
    var publicMethods =   {
            // these references keeps the variables in scope
            privateMethod1: GetGL,
            privateMethod2: VPAttr,
            privateMethod3: GetGLModelTransformRef,
            
            GetShader: GetShader,
            ActivateShader : ActivateShader
    };
    
    return publicMethods;
};