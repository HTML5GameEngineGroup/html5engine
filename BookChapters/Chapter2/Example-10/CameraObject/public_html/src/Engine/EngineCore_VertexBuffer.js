/*
 * File: EngineCore_VertexBuffer.js
 *  
 * defines the object that supports the loading and using of the buffer that 
 * contains vertex positions of a square onto the gGL context
 * 
 * Notice, this is a singleton object.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

// The VertexBuffer object
gEngineCore.VertexBuffer = function()
{    
    // reference to the vertex positions for the square in the gl context
    var _mSquareVertexBuffer = null;

    // Hardcoded vertex positions.
    var verticesOfSquare =
    [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];
    
    var Initialize = function() {
        var gl = gEngineCore.GetGL();

        // Create a buffer on the gGL context for our vertex positions
        _mSquareVertexBuffer = gl.createBuffer();

        // Connect the vertexBuffer to the ARRAY_BUFFER global gl binding point.
        gl.bindBuffer(gl.ARRAY_BUFFER, _mSquareVertexBuffer);    

        // Put the verticesOfSquare into the vertexBuffer, as non-changing drawing data (STATIC_DRAW)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfSquare), gl.STATIC_DRAW);
    };
    
    var GetGLVertexRef = function() { return _mSquareVertexBuffer; };
    
    var oPublic = {
        Initialize: Initialize,
        GetGLVertexRef: GetGLVertexRef
    };
    
    return oPublic;
}();