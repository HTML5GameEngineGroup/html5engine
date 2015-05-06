// this is the fragment (or pixel) shader

precision mediump float; 
    // sets the precision for floating point computation

// The object that fetches data from texture.
// Must be set outside the shader.
uniform sampler2D uSampler;

// Color of pixel
uniform vec4 uPixelColor;  
uniform vec4 uGlobalAmbientColor; // this is shared globally
uniform float uGlobalAmbientIntensity;

// Light information
//   Three light types are encoded:
//     Direction.w == 1: says direction should be used
//     DropOff > 0 says SpotLight
//  PointLight:
//     Direction.w == 0
//     DropOff < 0
//
//  Directoinal Light
//     Directoin.w == 1
//     DropOff < 0
//
//  SpotLight
//     Direction.W == 1
//     DropOff >= 0
//
struct Light  {
    vec4 Position;   // in pixel space!
    vec4 Direction;  // Light direction
    vec4 Color;
    float Near;      // distance in pixel space
    float Far;
    float Inner;     // cone angle in radian for spotlight
    float Outer;     // cone angle in radian for spotlight
    float Intensity;
    float DropOff;   // for spotlight
    bool  IsOn;
};
uniform Light uLights[4];  // Maximum array of lights this shader supports

// The "varying" keyword is for signifing that the texture coordinate will be
// interpolated and thus varies. 
varying vec2 vTexCoord;

float AngularDropOff(Light lgt, vec3 lgtDir) {
    float atten = 0.0;
    vec3 L = normalize(lgt.Position.xyz - gl_FragCoord.xyz);
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

vec4 LightEffect(Light lgt) {
    float aAtten = 1.0, dAtten = 0.0;
    vec3 lgtDir = -normalize(lgt.Direction.xyz);
    // find out what kind of light ...
    if ((lgt.Direction.w == 1.0) && (lgt.DropOff > 0.0)) {
        // spotlight: do angle dropoff
        aAtten = AngularDropOff(lgt, lgtDir);
    } 
    dAtten = DistanceDropOff(lgt);
    if ((lgt.Direction.w == 1.0) && (lgt.DropOff < 0.0)) { // direcitonal light
        // Let's use the z-component as normal
        dAtten *= lgtDir.z;
    }
    return dAtten * aAtten * lgt.Intensity * lgt.Color;
}

#define NUM_SYS_LIGHTS 4

void main(void)  {
    // simple tint based on uPixelColor setting
    vec4 textureMapColor = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));
    vec4 lgtResults = textureMapColor * uGlobalAmbientIntensity * uGlobalAmbientColor;

    // now decide if we should illuminate by the light
    if (textureMapColor.a > 0.0) {
        for (int i=0; i<NUM_SYS_LIGHTS; i++) { 
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