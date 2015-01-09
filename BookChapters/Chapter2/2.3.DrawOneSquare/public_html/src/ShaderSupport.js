/* 
 * File: ShadderSupport.js
 * Support the loading, compiling, and linking of shader code
 * 
 * Notice:  although in a different file, we have access to 
 *          global variables defined in WebGL.js: gGL
 *          
 *          In the same way, the global variable gSimpleShader defined in this
 *          file will be accessible to any other javascript source code in 
 *          our projetc.
 * 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gSimpleShader = null;
    // Reference to the shader program stored in gGL context.
    
var gShaderVertexPositionAttribute = null;
    // gGL reference to the attribute to be used by the VertexShader

// Loads/compiles/links shader programs to gGL context
function InitSimpleShader(vertexShaderID, fragmentShaderID)
{
    // Step 1: load and compile vertex and fragment shaders
    var vertexShader = LoadAndCompileShader(vertexShaderID, gGL.VERTEX_SHADER);
    var fragmentShader = LoadAndCompileShader(fragmentShaderID, gGL.FRAGMENT_SHADER);

    // Step 2: Create and link the shaders into a program.
    gSimpleShader = gGL.createProgram();
    gGL.attachShader(gSimpleShader, vertexShader);
    gGL.attachShader(gSimpleShader, fragmentShader);
    gGL.linkProgram(gSimpleShader);

    // Step 3: check for error
    if (!gGL.getProgramParameter(gSimpleShader, gGL.LINK_STATUS))  {
        alert("Error linking shader");
    }
    
    // Step 4: Gets a reference to the SquareVertexPosition variable within the shaders.
    gShaderVertexPositionAttribute = gGL.getAttribLocation(gSimpleShader, "aSquareVertexPosition");
        // SquareVertexPosition: is defined in the VertexShader (in the index.html file)
   
    // Step 5: Activates the vertex buffer loaded in VertexBuffer.js
    gGL.bindBuffer(gGL.ARRAY_BUFFER, gSquareVertexBuffer);
        // gSquareVertexBuffer: is defined in VertexBuffer.js and 
        //      initialized by the InitSquareBuffer() function.
        
    // Step 6: Describe the characteristic of the vertex position attribute
    gGL.vertexAttribPointer(gShaderVertexPositionAttribute, // variable initialized above
        3,          // each vertex element is a 3-float (x,y,z)
        gGL.FLOAT,  // data type is FLOAT
        false,      // if the content is normalized vectors
        0,          // number of bytes to skip in between elements
        0);         // offsets to the first element
}

// Returns a complied shader from a shader in the dom.
// The id is the id of the script in the html tag.
function LoadAndCompileShader(id, shaderType)
{
    var shaderText, shaderSource, compiledShader;

    // Step 1: Get the shader source from index.html
    shaderText = document.getElementById(id);
    shaderSource = shaderText.firstChild.textContent;

    // Step 2: Create the shader based on the shader type: vertex or fragment
    compiledShader = gGL.createShader(shaderType);

    // Step 3: Compile the created shader
    gGL.shaderSource(compiledShader, shaderSource);
    gGL.compileShader(compiledShader);

    // Step 4: check for errors and return results (null if error)
    if (!gGL.getShaderParameter(compiledShader, gGL.COMPILE_STATUS)) {
        alert("A shader compliling error occurred: " + gGL.getShaderInfoLog(compiledShader));
    }

    return compiledShader;
}