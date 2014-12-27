/* 
 * File: ShadderSupport.js
 * Support the loading, compiling, and linking of shader code
 * 
 * Notice:  although in a different file, we have access to 
 *          global variables defined in WebGL.js: gGL
 *          
 *          In the same way, the global variable gShaderProgram defined in this
 *          file will be accessible to any other javascript source code in 
 *          our projetc.
 * 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gShaderProgram = null;
    // Reference to the shader program stored in gGL context.
    
var gShaderVertexPositionAttribute = null;
    // gGL reference to the attribute to be used by the VertexShader

// Loads/compiles/links shader programs to gGL context
function InitShaderProgram(vertexShaderID, fragmentShaderID)
{
    var vertexShader = LoadAndCompileShader(vertexShaderID, gGL.VERTEX_SHADER);
    var fragmentShader = LoadAndCompileShader(fragmentShaderID, gGL.FRAGMENT_SHADER);

    // Create and link the program.
    gShaderProgram = gGL.createProgram();
    gGL.attachShader(gShaderProgram, vertexShader);
    gGL.attachShader(gShaderProgram, fragmentShader);
    gGL.linkProgram(gShaderProgram);

    // Show error if failed.
    if (!gGL.getProgramParameter(gShaderProgram, gGL.LINK_STATUS))  {
        alert("Error linking shader");
    }
    
    // Gets a reference to the SquareVertexPosition variable within the shaders.
    gShaderVertexPositionAttribute = gGL.getAttribLocation(gShaderProgram, "SquareVertexPosition");
        // SquareVertexPosition: is defined in the VertexShader (in the index.html file)
}

// Returns a complied shader from a shader in the dom.
// The id is the id of the script in the html tag.
function LoadAndCompileShader(id, shaderType)
{
    var shaderText, shaderSource, compiledShader;

    // Get the shader source in DOM format
    shaderText = document.getElementById(id);

    // Get shader source as a string.
    shaderSource = shaderText.firstChild.textContent;

    // Create the shader based on the source type.
    compiledShader = gGL.createShader(shaderType);

    // Give the source to the shader to be compiled.
    gGL.shaderSource(compiledShader, shaderSource);

    // Complie shader program
    gGL.compileShader(compiledShader);

    // Check if successful, if not display log and return null.
    // The log info is how shader compilation errors are typically displayed.
    // This is useful for debugging the shaders.
    if (!gGL.getShaderParameter(compiledShader, gGL.COMPILE_STATUS)) {
        alert("A shader compliling error occurred: " + gGL.getShaderInfoLog(compiledShader));
    }

    return compiledShader;
}