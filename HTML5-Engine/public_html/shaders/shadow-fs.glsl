// Set the precision for float operations, such as sampler operations.
// Without this set, those operations may not function.
precision mediump float;

// The object that fetches data from texture.
// Must be set outside the shader.
uniform sampler2D uSampler;
uniform sampler2D uShadowRecieverSampler;

uniform vec2 uShadowRecieverDimensions;
uniform vec2 uViewportDimensions;

// The "varying" keyword is for signifing that the texture coordinate will be
// interpolated and thus varies. 
varying vec2 vTexCoord;

void main(void)
{
    vec4 texFragColor = texture2D(uSampler, vTexCoord);
    vec2 v = vTexCoord * uShadowRecieverDimensions;
    vec4 reciever = texture2D(uShadowRecieverSampler, vTexCoord);
    
    vec4 baseFragColor = texFragColor;

    if(reciever.a >= 1.0)
        gl_FragColor = vec4(0, 1, 0, 1);
    else
        gl_FragColor = vec4(0, 1, 1, 0.2);
}
