/*
 * File: EngineCore_VertexBuffer.js
 *  
 * defines the object that supports the loading and using of the buffer that 
 * contains vertex positions of a square onto the gGL context
 * 
 * Notice, this is a singleton object.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || { };

// The VertexBuffer object
gEngine.VertexBuffer = function()
{    
    // reference to the vertex positions for the square in the gl context
    var _mSquareVertexBuffer = null;

    // reference to the texture positions for the square vertices in the gl context
    var _mTextureCoordBuffer = null;
    
    // First: define the vertices for a square
    var verticesOfSquare =
    [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];
    
    // Second: define the corresponding texture cooridnates
    var textureCoordinates = 
    [
        1.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        0,0, 0.0
    ];
    
    var Initialize = function() {
        var gl = gEngine.Core.GetGL();

        // <editor-fold desc="Step A: Allocate and store vertex positions into the webGL context">
            // Create a buffer on the gGL context for our vertex positions
            _mSquareVertexBuffer = gl.createBuffer();

            // Connect the vertexBuffer to the ARRAY_BUFFER global gl binding point.
            gl.bindBuffer(gl.ARRAY_BUFFER, _mSquareVertexBuffer);    

            // Put the verticesOfSquare into the vertexBuffer, as non-changing drawing data (STATIC_DRAW)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfSquare), gl.STATIC_DRAW);
        //<editor-fold>
    
        // <editor-fold desc="Step  B: Allocate and store texture coordinates">
            // Create a buffer on the gGL context for our vertex positions
            _mTextureCoordBuffer = gl.createBuffer();

            // Connect the textureCoorBuffer to the ARRAY_BUFFER global gl binding point.
                gl.bindBuffer(gl.ARRAY_BUFFER, _mTextureCoordBuffer);    

            // load the textureCoordinates into the vertexBuffer, as non-changing drawing data (STATIC_DRAW)!
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
        // </editor-fold>
    };
    
    var GetGLVertexRef = function() { return _mSquareVertexBuffer; };
    var GetGLTexCoordRef = function() { return _mTextureCoordBuffer; };
    
    var oPublic = {
        Initialize: Initialize,
        GetGLVertexRef: GetGLVertexRef,
        GetGLTexCoordRef: GetGLTexCoordRef
    };
    
    return oPublic;
}();