// this is the fragment (or pixel) shader

precision mediump float; 
    // sets the precision for floating point computation

// The object that fetches data from texture.
// Must be set outside the shader.
uniform sampler2D uSampler;

// The "varying" keyword is for signifing that the texture coordinate will be
// interpolated and thus varies. 
varying vec2 vTexCoord;

void main(void)  {
    // sample the texture using uSampler based on the values in vTexCoord
    gl_FragColor = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));
}
        