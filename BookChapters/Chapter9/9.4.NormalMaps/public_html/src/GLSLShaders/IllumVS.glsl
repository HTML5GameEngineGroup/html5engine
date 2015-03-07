// For NetBeans Syntax Higlight: http://plugins.netbeans.org/plugin/46515/glsl-syntax-highlighter 
//
// This is the vertex shader 
attribute vec3 aSquareVertexPosition;  // Vertex shader expects one vertex position
attribute vec2 aTextureCoordinate;
attribute vec2 aNormalMapCoordinate; 

// texture coordinate that will map the entire image to the entire square
varying vec2 vTexCoord;
varying vec2 vNormalMapCoord;  // similar to vTexCoord, for normal map

// to transform the vertex position
uniform mat4 uModelTransform;
uniform mat4 uViewProjTransform;

void main(void) { 
    // Convert the vec3 into vec4 for scan conversion and
    // assign to gl_Position to pass the vertex to the fragment shader
    gl_Position = uViewProjTransform * uModelTransform * vec4(aSquareVertexPosition, 1.0); 
    
    // pass the texture coordinate to the pixel shader
    vTexCoord = aTextureCoordinate;
    vNormalMapCoord = aNormalMapCoordinate;
}
