/*
 * File: VertexBuffer.js
 *  
 * Support the loading of the buffer that contains vertex positions of a square 
 * onto the gGL context
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gSquareVertexBuffer = null;
    // gGL reference to the vertex positions for the square

function InitSquareBuffer()
{    
    // Hardcoded vertex positions.
    var verticesOfSquare =
    [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];
    
    // Create a buffer on the gGL context for our vertex positions
    gSquareVertexBuffer = gGL.createBuffer();

    // Connect the vertexBuffer to the ARRAY_BUFFER global gGL binding point.
    gGL.bindBuffer(gGL.ARRAY_BUFFER, gSquareVertexBuffer);    

    // Put the verticesOfSquare into the vertexBuffer, as non-changing drawing data (STATIC_DRAW)
    gGL.bufferData(gGL.ARRAY_BUFFER, new Float32Array(verticesOfSquare), gGL.STATIC_DRAW);
}