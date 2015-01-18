// Set the precision for float operations, such as sampler operations.
// Without this set, those operations may not function.
precision mediump float;

// The object that fetches data from texture.
// Must be set outside the shader.
uniform sampler2D uSampler;

// The "varying" keyword is for signifing that the texture coordinate will be
// interpolated and thus varies. 
varying vec2 vTexCoord;

void main(void)
{
    gl_FragColor = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));
}
