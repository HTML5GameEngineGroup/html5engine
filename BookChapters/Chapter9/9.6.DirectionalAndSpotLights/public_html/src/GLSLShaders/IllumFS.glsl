// this is the fragment (or pixel) shader

precision mediump float; 
    // sets the precision for floating point computation

// The object that fetches data from texture.
// Must be set outside the shader.
uniform sampler2D uSampler;
uniform sampler2D uNormalSampler;

// Color of pixel
uniform vec4 uPixelColor;  
uniform vec4 uGlobalAmbientColor; // this is shared globally
uniform float uGlobalAmbientIntensity; 

// for supporting a simple Phong-like illumination model
uniform vec3 uCameraPosition; // for computing the V-vector
// material properties
struct Material {
    vec4 Ka;    // simple boosting of color
    vec4 Kd;    // Diffuse 
    vec4 Ks;    // Specular
    float Shinningness; // this is the "n"
};
uniform Material uMaterial;

// Light information
//   Three light types are encoded:
//     Direction.w == 1: says direction should be used
//     DropOff > 0 says SpotLight
//  PointLight:
//     Direction.w == 0
//     DropOff < 0
//     Inner/Outer: are distance in pixel space to the Position
//
//  Directoinal Light
//     Directoin.w == 1
//     DropOff < 0
//     Inner/Outer: are distance in pixel space to the Position
//
//  SpotLight
//     Direction.W == 1
//     DropOff >= 0
//     Inner/Outer: are angles measured from the Direction
//     No distance attenuation
struct Light  {
    vec4 Position;   // in pixel space!
    vec4 Direction;  // Light direction
    vec4 Color;
    float Near;
    float Far;
    float Inner;     // cone angle for spotlight
    float Outer;     // cone angle for spotlight
    float Intensity;
    float DropOff;   // for spotlight
    bool  IsOn;
};
uniform Light uLights[4];  // Maximum array of lights this shader supports

// The "varying" keyword is for signifing that the texture coordinate will be
// interpolated and thus varies. 
varying vec2 vTexCoord;

// Computes the L-vector, and returns attenuation
float AngularDropOff(Light lgt, vec3 lgtDir, vec3 L) {
    float atten = 0.0;
    float cosL = dot(lgtDir, L);
    float cosOuter = cos(lgt.Outer * 0.5);  
    float num = cosL - cosOuter;

    if (num > 0.0) {
        float cosInner = cos(lgt.Inner * 0.5);  
        float denom = cosInner - cosOuter;
        if (denom <= 0.0) 
            atten = 1.0;
        else
            atten = smoothstep(0.0, 1.0, pow(abs(num/denom), lgt.DropOff));
    }
    return atten;
}

float DistanceDropOff(Light lgt) {
    float atten = 0.0;
    float dist = length(lgt.Position.xyz - gl_FragCoord.xyz);
    if (dist <= lgt.Far) {
        if (dist <= lgt.Near)
            atten = 1.0;  //  no attenuation
        else {
            // simple quadratic drop off
            float n = dist - lgt.Near;
            float d = lgt.Far - lgt.Near;
            atten = smoothstep(0.0, 1.0, 1.0-(n*n)/(d*d)); // blended attenuation
        }   
    }
    return atten;
}

vec4 SpecularResult(vec3 N, vec3 L) {
    vec3 V = normalize(uCameraPosition - gl_FragCoord.xyz);
    vec3 H = (L + V) * 0.5;
    return uMaterial.Ks * pow(max(0.0, dot(N, H)), uMaterial.Shinningness);
}

vec4 DiffuseResult(vec3 N, vec3 L, vec4 textureMapColor) {
    return uMaterial.Kd * max(0.0, dot(N, L)) * textureMapColor;
}

vec4 ShadedResult(Light lgt, vec3 N, vec4 textureMapColor) {
    float aAtten = 1.0, dAtten = 0.0;
    vec3 lgtDir = -normalize(lgt.Direction.xyz);
    vec3 L = normalize(lgt.Position.xyz - gl_FragCoord.xyz);
    if ((lgt.Direction.w == 1.0) && (lgt.DropOff > 0.0)) {
        // spotlight: do angle dropoff
        aAtten = AngularDropOff(lgt, lgtDir, L);
    } 
    dAtten = DistanceDropOff(lgt);
    vec4  diffuse = DiffuseResult(N, L, textureMapColor);
    vec4  specular = SpecularResult(N, L);
    vec4 result = aAtten * dAtten * lgt.Intensity * lgt.Color * (diffuse + specular);
    return result;
}

void main(void)  {
    // simple tint based on uPixelColor setting
    vec4 textureMapColor = texture2D(uSampler, vTexCoord);
    vec4 normal = texture2D(uNormalSampler, vTexCoord);
    vec4 normalMap = (2.0 * normal) - 1.0;
    
    normalMap.y = -normalMap.y;  // flip Y
    vec3 N = normalize(normalMap.xyz);
   
    vec4 shadedResult = uMaterial.Ka + (textureMapColor  * uGlobalAmbientColor * uGlobalAmbientIntensity);

    // now decide if we should illuminate by the light
    if (textureMapColor.a > 0.0) {
        for (int i=0; i<4; i++) { 
            if (uLights[i].IsOn) { 
                shadedResult += ShadedResult(uLights[i], N, textureMapColor);
            }
        }
    }

    // tint the textured area, and leave transparent area as defined by the texture
    vec3 tintResult = vec3(shadedResult) * (1.0-uPixelColor.a) + vec3(uPixelColor) * uPixelColor.a;
    vec4 result = vec4(tintResult, shadedResult.a);

     gl_FragColor = result; 
}
        