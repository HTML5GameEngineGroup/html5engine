/*
 * File: WebGL.js 
 * Javascript source code for our project.
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gGL = null;
    // The GL context upon which we will access web-GL functioanlity
    // Convention: global variable names: gName


// Initlaize the webGL by binding the functionality to the gGL variable
function InitializeGL()
{
    // the "GLCanvas" defined in the index.html file
    var canvas = document.getElementById("GLCanvas");
        
    // Get standard webgl, or experimental
    // binds webgl the the Canvas area on the web-page to the global variable "gGL"
    gGL = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    
    if (gGL !== null) {
        gGL.clearColor(0.0, 0.8, 0.0, 1.0);  // set the color to be cleared
        
        // 1. initialize the buffer with the vertex positions for the unit square
        InitSquareBuffer();
                // This function is defined in the VertexBuffer.js file
                
        // 2. now load and compile the vertex and fragment shaders
        InitSimpleShader("VertexShader", "FragmentShader");
                // the two shaders are defined in the index.html file
                // InitSimpleShader() funciton is defined in ShaderSupport.js file
                
    } else {
        document.write("<br><b>WebGL is not supported!</b>");
    }
}


// Clears the draw area and draws one square
function DrawSquare() {
    gGL.clear(gGL.COLOR_BUFFER_BIT);      // clear to the color previously set
    
    // 1. Enable the shader to use
    gGL.useProgram(gSimpleShader);
        
    // 2. Gets a reference to the SquareVertexPosition variable within the shaders.
    var shaderVertexPositionAttribute = gGL.getAttribLocation(gSimpleShader, "aSquareVertexPosition");
        
    // 3. Enables the vertex position attribute to pass vertex buffer content
    //       to the vertex shader
     gGL.enableVertexAttribArray(shaderVertexPositionAttribute);
        
    // 4. Describe the characteristic of the vertex position attribute
    gGL.vertexAttribPointer(shaderVertexPositionAttribute, // variable initialized above
        3,          // each vertex element is a 3-float (x,y,z)
        gGL.FLOAT,  // data type is FLOAT
        false,      // if the content is normalized vectors
        0,          // number of bytes to skip in between elements
        0);         // offsets to the first element
        
    // 5. Bind the gGL vertex buffer to be used
    gGL.bindBuffer(gGL.ARRAY_BUFFER, gSquareVertexBuffer);
        // gSquareVertexBuffer: is defined in VertexBuffer.js and 
        //      initialized by the InitSquareBuffer() function.
    
    // 6. finally, draw with the above settings
        gGL.drawArrays(gGL.TRIANGLE_STRIP, 0, 4);    
}

// this is the function that will cause the WebGL drawing
function DoGLDraw()
{
    InitializeGL();     // Binds gGL context to WebGL functionality
    DrawSquare();       // Clears the GL area and draws one square
}