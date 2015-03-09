// this is the fragment (or pixel) shader

precision mediump float; 
    // sets the precision for floating point computation

// The object that fetches data from texture.
// Must be set outside the shader.
uniform sampler2D uSampler;
uniform sampler2D uNormalSampler;

// Color of the object
uniform vec4 uPixelColor;  
uniform vec4 uGlobalAmbient; // this is shared globally

uniform vec3 uCameraPosition; // for computing the V-vector

// illumination properties
vec4 uKs;   // Specular color
float uShinningness;  // how sharp isthe specularity
vec4 uKd;   // Diffuse Color 

// Light information
struct Light  {
    vec4 Position;   // in pixel space!
    vec4 Color;
    float Inner;     // distance in pixel space
    float Outer;     // distance in pixel space
    float Intensity; // Diffuse component intenstity
    bool  IsOn;
};
uniform Light uLights[4];  // Maximum array of lights this shader supports

// The "varying" keyword is for signifing that the texture coordinate will be
// interpolated and thus varies. 
varying vec2 vTexCoord;
varying vec2 vNormalMapCoord;

// Computes the L-vector, and returns attenuation
float LightAttenuation(Light lgt, out vec3 L) {
    float atten = 0.0;
    L = lgt.Position.xyz - gl_FragCoord.xyz;  
    float dist = length(L);
    L = L / dist;
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
    return atten;
}

vec4 SpecularResult(vec3 N, vec3 L) {
    vec3 V = normalize(uCameraPosition - gl_FragCoord.xyz);
    vec3 H = (L + V) * 0.5;
    return uKs * pow(max(0.0, dot(N, H)), uShinningness);
}

vec4 DiffuseResult(vec3 N, vec3 L, vec4 diffuseMapColor) {
    return uKd * max(0.0, dot(N, L)) * diffuseMapColor;
}

vec4 ShadedResult(Light lgt, vec3 N, vec4 diffuseMapColor) {
    vec3 L;
    float atten = LightAttenuation(lgt, L);
    vec4  diffuse = DiffuseResult(N, L, diffuseMapColor);
    vec4  specular = SpecularResult(N, L);
    result = lgt.Intensity * lgt.Color + (diffuse + specular);
    return result;
}

void main(void)  {
    // simple tint based on uPixelColor setting
    vec4 diffuseMapColor = texture2D(uSampler, vTexCoord);
    vec4 normal = texture2D(uNormalSampler, vNormalMapCoord);
    vec4 normalMap = (2.0 * normal) - 1.0;
    
    normalMap.y = -normalMap.y;  // flip Y
    vec3 N = normalize(normalMap.xyz);
   
    vec4 shadedResult = vec4(0);

    // now decide if we should illuminate by the light
    if (diffuseMapColor.a > 0.0) {
        for (int i=0; i<4; i++) { 
            if (uLights[i].IsOn) { 
                shadedResult += ShadedResult(uLights[i], N, diffuseMapColor);
            }
        }
    }

    // tint the textured area, and leave transparent area as defined by the texture
    vec3 tintResult = vec3(shadedResult) * (1.0-uPixelColor.a) + vec3(uPixelColor) * uPixelColor.a;
    vec4 result = vec4(tintResult, diffuse.a);

     gl_FragColor = result + uGlobalAmbient; 
}
        