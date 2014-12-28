/*
 * File: VertexBuffer.js
 *  
 * defines the object that supports the loading and using of the buffer that 
 * contains vertex positions of a square onto the gGL context
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

//<editor-fold desc="constructor">
// Constructor and object definition
function VertexBuffer(gl)
{
    // instance variables
    // The graphical context to draw to
    this.mGL = null;
    
    // reference to the vertex positions for the square in the gl context
    this.mSquareVertexBuffer = null;

    // Hardcoded vertex positions.
    var verticesOfSquare =
    [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];
    
    this.mGL = gl;
    
    // Create a buffer on the gGL context for our vertex positions
    this.mSquareVertexBuffer = this.mGL.createBuffer();

    // Connect the vertexBuffer to the ARRAY_BUFFER global gl binding point.
    this.mGL.bindBuffer(this.mGL.ARRAY_BUFFER, this.mSquareVertexBuffer);    

    // Put the verticesOfSquare into the vertexBuffer, as non-changing drawing data (STATIC_DRAW)
    this.mGL.bufferData(this.mGL.ARRAY_BUFFER, new Float32Array(verticesOfSquare), this.mGL.STATIC_DRAW);
};
//</editor-fold>

//<editor-fold desc="Public Methods">
//**---------------------------------------
// Public Methods
//**---------------------------------------      
VertexBuffer.prototype.ActivateAndDraw = function() {
    // binds the buffer that contains the vertices to the square
    this.mGL.bindBuffer(this.mGL.ARRAY_BUFFER, this.mSquareVertexBuffer);
    //      initialized by the InitSquareBuffer() function.  
    this.mGL.drawArrays(this.mGL.TRIANGLE_STRIP, 0, 4);      
};
//-- end of public methods
//</editor-fold>