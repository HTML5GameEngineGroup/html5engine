/*
 * File: VertexBuffer.js
 *  
 * defines the object that supports the loading and using of the buffer that 
 * contains vertex positions of a square onto the gGL context
 */

// Constructor and object definition
function VertexBuffer(gl)
{
    // instance variables
    // The graphical context to draw to
    var mGL = null;
    
    // reference to the vertex positions for the square in the gl context
    var mSquareVertexBuffer = null;
    
    //**-----------------------------------
    // Private methods not mean to call by outside of this object
    // **------------------------------------
        var GetGL = function() { return mGL; };
        var GetBufferReference = function() { return mSquareVertexBuffer; };
    // ---- end of private methods
    
    //**---------------------------------------
    // Public Methods
    //**---------------------------------------      
        var ActivateAndDraw = function() {
           mGL.bindBuffer(mGL.ARRAY_BUFFER, mSquareVertexBuffer);
            // gSquareVertexBuffer: is defined in VertexBuffer.js and 
            //      initialized by the InitSquareBuffer() function.  
          
           mGL.drawArrays(mGL.TRIANGLE_STRIP, 0, 4);      
        };
    //-- end of public methods

   
    // Hardcoded vertex positions.
    var verticesOfSquare =
    [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];
    
    mGL = gl;
    
    // Create a buffer on the gGL context for our vertex positions
    mSquareVertexBuffer = mGL.createBuffer();

    // Connect the vertexBuffer to the ARRAY_BUFFER global gl binding point.
    mGL.bindBuffer(mGL.ARRAY_BUFFER, mSquareVertexBuffer);    

    // Put the verticesOfSquare into the vertexBuffer, as non-changing drawing data (STATIC_DRAW)
    mGL.bufferData(mGL.ARRAY_BUFFER, new Float32Array(verticesOfSquare), mGL.STATIC_DRAW);

    var publicMethods = {
        privateMethod1: GetGL,
        privateMethod2: GetBufferReference,
        
        ActivateAndDraw: ActivateAndDraw
    };
    
    return publicMethods;
}