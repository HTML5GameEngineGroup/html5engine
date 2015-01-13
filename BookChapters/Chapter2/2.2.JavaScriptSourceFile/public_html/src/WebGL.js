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
    gGL = canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
    
    if (gGL !== null) {
        gGL.clearColor(0.9, 0.9, 0.9, 1.0);  // set the color to be cleared    
    } else {
        document.write("<br><b>WebGL is not supported!</b>");
    }
}

// Clears the gGL area to the defined color
function ClearCanvas()
{
    gGL.clear(gGL.COLOR_BUFFER_BIT);      // clear to the color previously set
}

// this is the function that will cause the WebGL drawing
function DoGLDraw()
{
    InitializeGL();     // Binds gGL context to WebGL functionality
    ClearCanvas();    // Clears the GL area
}