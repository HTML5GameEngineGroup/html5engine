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
    // First: define the vertices for a square
    var verticesOfSquare =
    [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];
    
    // Step 1: Create a buffer on the gGL context for our vertex positions
    gSquareVertexBuffer = gGL.createBuffer();

    // Step 2: Activate vertexBuffer
    gGL.bindBuffer(gGL.ARRAY_BUFFER, gSquareVertexBuffer);    

    // Step 3: Loads verticesOfSquare into the vertexBuffer
    gGL.bufferData(gGL.ARRAY_BUFFER, new Float32Array(verticesOfSquare), gGL.STATIC_DRAW);
}