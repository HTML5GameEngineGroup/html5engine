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

// Light information
struct Light  {
    vec4 Position;   // in pixel space!
    vec4 Color;
    float Inner;     // distance in pixel space
    float Outer;     // distance in pixel space
    float Intensity;
    bool  IsOn;
};
uniform Light uLights[4];  // Maximum array of lights this shader supports
uniform int uNumLights;     // Number of light is switch on at each rendering

// The "varying" keyword is for signifing that the texture coordinate will be
// interpolated and thus varies. 
varying vec2 vTexCoord;


vec4 LightEffect(Light lgt)
{
    vec4 result = vec4(0);
    float atten = 0.0;
    float dist = length(lgt.Position.xyz - gl_FragCoord.xyz);
    if (dist <= lgt.Outer) {
        if (dist <= lgt.Inner)
            atten = 1.0;  //  no attenuation
        else {
            // simple quadratic drop off
            float n = dist - lgt.Inner;
            float d = lgt.Outer - lgt.Inner;
            atten = smoothstep(0.0, 1.0, 1.0-(n*n)/(d*d)); // blended attenuation
        }   
    }
    result = atten * lgt.Intensity * lgt.Color;
    return result;
}

void main(void)  {
    // simple tint based on uPixelColor setting
    vec4 textureMapColor = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));
    vec4 lgtResults = textureMapColor * uGlobalAmbientIntensity * uGlobalAmbientColor;

    // now decide if we should illuminate by the light
    if (textureMapColor.a > 0.0) {
        for (int i=0; i<4; i++) { 
            if (uLights[i].IsOn) { 
                lgtResults +=  LightEffect(uLights[i]) * textureMapColor;
            }
        }
    }

    // tint the textured area, and leave transparent area as defined by the texture
    vec3 r = vec3(lgtResults) * (1.0-uPixelColor.a) + vec3(uPixelColor) * uPixelColor.a;
    vec4 result = vec4(r, lgtResults.a);

     gl_FragColor = result;
}
        