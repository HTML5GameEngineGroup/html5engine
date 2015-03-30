// this is the fragment (or pixel) shader

precision mediump float; 
    // sets the precision for floating point computation

// The object that fetches data from texture.
// Must be set outside the shader.
uniform sampler2D uSampler;

// Color of the object
uniform vec4 uPixelColor;  

// The "varying" keyword is for signifing that the texture coordinate will be
// interpolated and thus varies. 
varying vec2 vTexCoord;

void main(void)  {
    // texel color look up based on interpolated UV value in vTexCoord
    vec4 c = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));
    // 
    
    // different options:
    // e.g.  tint the transparent area also
    // vec4 result = c * (1.0-uPixelColor.a) + uPixelColor * uPixelColor.a;
    
    // tint the textured area, and leave transparent area as defined by the texture
    vec3 r = vec3(c) * (1.0-uPixelColor.a) + vec3(uPixelColor) * uPixelColor.a;
    vec4 result = vec4(r, c.a);
    
    // ignore pixel tinting ...
    // vec4 result = c;

    gl_FragColor = result;
}
        