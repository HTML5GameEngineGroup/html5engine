// this is the fragment (or pixel) shader

precision mediump float; 
    // sets the precision for floating point computation

// The object that fetches data from texture.
// Must be set outside the shader.
uniform sampler2D uSampler;
uniform sampler2D uNormalSampler;

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

// The "varying" keyword is for signifing that the texture coordinate will be
// interpolated and thus varies. 
varying vec2 vTexCoord;
varying vec2 vNormalMapCoord;

vec4 LightEffect(Light lgt, vec3 N) {
    vec4 result = vec4(0);
    float atten = 0.0;
    vec3 L = lgt.Position.xyz - gl_FragCoord.xyz;
    float dist = length(L);
    if (dist <= lgt.Outer) {
        if (dist <= lgt.Inner)
            atten = 1.0;  //  no attenuation
        else {
            // simple quadratic drop off
            float n = dist - lgt.Inner;
            float d = lgt.Outer - lgt.Inner;
            atten = smoothstep(0.0, 1.0, 1.0-(n*n)/(d*d)); // blended attenuation
        }
        L = L / dist;
        float NdotL = max(0.0, dot(N, L));   
        atten = atten *= NdotL;
    }
    result = atten * lgt.Intensity * lgt.Color;
    return result;
}

void main(void)  {
    // simple tint based on uPixelColor setting
    vec4 diffuse = texture2D(uSampler, vTexCoord) * uGlobalAmbientColor * uGlobalAmbientIntensity;
    vec4 normal = texture2D(uNormalSampler, vNormalMapCoord);
    vec4 normalMap = (2.0 * normal) - 1.0;
    
    normalMap.y = -normalMap.y;  // flip Y
    vec3 N = normalize(normalMap.xyz);
   
    vec4 lgtResult = diffuse;

    // now decide if we should illuminate by the light
    if (diffuse.a > 0.0) {
        for (int i=0; i<4; i++) { 
            if (uLights[i].IsOn) { 
                lgtResult += LightEffect(uLights[i], N) * diffuse;
            }
        }
    }

    // tint the textured area, and leave transparent area as defined by the texture
    vec3 r = vec3(lgtResult) * (1.0-uPixelColor.a) + vec3(uPixelColor) * uPixelColor.a;
    vec4 result = vec4(r, diffuse.a);

     gl_FragColor = result; 
}
        