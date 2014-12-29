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
    this._mGL = null;
    
    // reference to the vertex positions for the square in the gl context
    this._mSquareVertexBuffer = null;

    // Hardcoded vertex positions.
    var verticesOfSquare =
    [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];
    
    this._mGL = gl;
    
    // Create a buffer on the gGL context for our vertex positions
    this._mSquareVertexBuffer = this._mGL.createBuffer();

    // Connect the vertexBuffer to the ARRAY_BUFFER global gl binding point.
    this._mGL.bindBuffer(this._mGL.ARRAY_BUFFER, this._mSquareVertexBuffer);    

    // Put the verticesOfSquare into the vertexBuffer, as non-changing drawing data (STATIC_DRAW)
    this._mGL.bufferData(this._mGL.ARRAY_BUFFER, new Float32Array(verticesOfSquare), this._mGL.STATIC_DRAW);
};
//</editor-fold>

//<editor-fold desc="Public Methods">
//**---------------------------------------
// Public Methods
//**---------------------------------------      
VertexBuffer.prototype.ActivateAndDraw = function() {
    // binds the buffer that contains the vertices to the square
    this._mGL.bindBuffer(this._mGL.ARRAY_BUFFER, this._mSquareVertexBuffer);
    //      initialized by the InitSquareBuffer() function.  
    this._mGL.drawArrays(this._mGL.TRIANGLE_STRIP, 0, 4);      
};
//-- end of public methods
//</editor-fold>