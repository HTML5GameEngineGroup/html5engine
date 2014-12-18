// These attributes are given from outside the shader.
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoordinate;

//Light attributes
attribute vec3 aLightPosition;
attribute vec4 aLightColor;
attribute float aLightIntensity;

// Contains the texture coordinate that will be passed onto the fragment shader.
varying vec2 vTexCoord;
varying vec3 vPos;

// This uniform transforms the verticies into a camera viewed position on the 
// screen. Must be given from outside the texture.
uniform mat4 uMVPMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main (void)
{
    // First set the position based the Model-View-Perspective matrix
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    // Pass on the texture coordinate to fragment shader.
    vTexCoord = aTextureCoordinate;
}
