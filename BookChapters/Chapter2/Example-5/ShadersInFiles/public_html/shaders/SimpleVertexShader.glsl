// For NetBeans Syntax Higlight: http://plugins.netbeans.org/plugin/46515/glsl-syntax-highlighter 
//
// This is the vertex shader 
attribute vec3 SquareVertexPosition;  // Vertex shader expects one vertex position

void main(void) {
    // Convert the vec3 into vec4 for scan conversion and
    // assign to gl_Position to pass the vertex to the fragment shader
    gl_Position = vec4(SquareVertexPosition, 1.0); 
}
