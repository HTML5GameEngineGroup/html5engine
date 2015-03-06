// this is the fragment (or pixel) shader

precision mediump float; 
    // sets the precision for floating point computation

// The object that fetches data from texture.
// Must be set outside the shader.
uniform sampler2D uSampler;

// Color of the object
uniform vec4 uPixelColor;  
uniform vec4 uGlobalAmbient; // this is shared globally

// Light information
uniform bool uLightOn;
uniform vec4 uLightColor;
uniform vec4 uLightPosition;   // in pixel space!
uniform float uLightRadius;    // in pixel space!

// The "varying" keyword is for signifing that the texture coordinate will be
// interpolated and thus varies. 
varying vec2 vTexCoord;

void main(void)  {
    // simple tint based on uPixelColor setting
    vec4 diffuse = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));

    // now decide if we should illuminate by the light
    if (uLightOn && (diffuse.a > 0.0)) {
        float dist = length(uLightPosition.xyz - gl_FragCoord.xyz);
        if (dist <= uLightRadius)
            diffuse = diffuse + uLightColor;
    }

    // tint the textured area, and leave transparent area as defined by the texture
    vec3 r = vec3(diffuse) * (1.0-uPixelColor.a) + vec3(uPixelColor) * uPixelColor.a;
    vec4 result = vec4(r, diffuse.a);

    gl_FragColor = result + uGlobalAmbient;
}
        