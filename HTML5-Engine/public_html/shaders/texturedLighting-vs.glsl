precision highp float;

// These attributes are given from outside the shader.
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoordinate;

// Contains the texture coordinate that will be passed onto the fragment shader.
varying vec2 vTexCoord;

// This uniform transforms the verticies into a camera viewed position on the 
// screen. Must be given from outside the texture.
uniform mat4 uMVPMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
varying mat4 umvmatrix;


void main (void)
{
    // First set the position based the Model-View-Perspective matrix
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    // Pass on the texture coordinate to fragment shader.
    vTexCoord = aTextureCoordinate;
    umvmatrix = uPMatrix * uMVMatrix;
}