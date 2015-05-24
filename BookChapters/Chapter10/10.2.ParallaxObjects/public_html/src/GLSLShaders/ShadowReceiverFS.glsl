// Set the precision for float operations, such as sampler operations.
// Without this set, those operations may not function.
precision mediump float;

// The object that fetches data from texture.
// Must be set outside the shader.
uniform sampler2D uSampler;
uniform vec4 uPixelColor;

// The "varying" keyword is for signifing that the texture coordinate will be
// interpolated and thus varies. 
varying vec2 vTexCoord;

void main(void)
{
    vec4 texFragColor = texture2D(uSampler, vTexCoord);
    if (texFragColor.a < 0.9)
        discard;
    else
       gl_FragColor = vec4(1, 1, 1, 1);
    
}