// this is the fragment (or pixel) shader

precision mediump float; 
    // sets the precision for floating point computation

// The object that fetches data from texture.
// Must be set outside the shader.
uniform sampler2D uSampler;

// Color of the object
uniform vec4 uPixelColor;  
uniform vec4 uGlobalAmbientColor; // this is shared globally
uniform float uGlobalAmbientIntensity;

// The "varying" keyword is for signifing that the texture coordinate will be
// interpolated and thus varies. 
varying vec2 vTexCoord;

void main(void)  {
    // simple tint based on uPixelColor setting
    vec4 c = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));
    // 
    
    c = c * uGlobalAmbientIntensity * uGlobalAmbientColor;
    
    // different options:
    // e.g.  tint the transparent area also
    // vec4 result = c * (1.0-uPixelColor.a) + uPixelColor * uPixelColor.a;
    
    // tint the textured area, and leave transparent area as defined by the texture
    vec3 r = vec3(c) * (1.0-uPixelColor.a) + vec3(uPixelColor) * uPixelColor.a;
    vec4 result = vec4(r, c.a);

    gl_FragColor = result;
}
        