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
        InitShaderProgram("VertexShader", "FragmentShader");
                // the two shaders are defined in the index.html file
                // InitShaderProgram() funciton is defined in ShaderSupport.js file
                
    } else {
        document.write("<br><b>WebGL is not supported!</b>");
    }
}


// Clears the draw area and draws one square
function DrawSquare() {
    gGL.clear(gGL.COLOR_BUFFER_BIT);      // clear to the color previously set
    
    // 1. Enable the shader to use
        gGL.useProgram(gShaderProgram);
    
    // 2. Enables the vertex position attribute to pass vertex buffer content
    //       to the vertex shader
        gGL.enableVertexAttribArray(gShaderVertexPositionAttribute);
    
    // 3. finally, draw with the above settings
        gGL.drawArrays(gGL.TRIANGLE_STRIP, 0, 4);    
}

// this is the function that will cause the WebGL drawing
function DoGLDraw()
{
    InitializeGL();     // Binds gGL context to WebGL functionality
    DrawSquare();       // Clears the GL area and draws one square
}