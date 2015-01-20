attribute vec2 aVertexPosition;
uniform mat4 uMVPMatrix;
uniform float uPointSize;

void main(void) 
{
    gl_PointSize = uPointSize;
    gl_Position = uMVPMatrix * vec4(aVertexPosition, 1.0, 1.0);
}

