// Set the precision for float operations, such as sampler operations.
// Without this set, those operations may not function.
precision highp float;
struct Light
{
    vec4 uPosition;
    vec4 uColor;
    float uInner;
    float uOuter;
    float uIntensity;
    float uSpecularIntensity;
};

uniform sampler2D uSampler;
uniform sampler2D uNormalSampler;

uniform Light lights[100];

uniform float uAmbientStrength;
uniform vec4 uAmbientColor;

uniform float uDiffuseStrength;
uniform vec4 uDiffuseColor;

uniform vec3 uCameraPosition;
uniform vec2 uObjPosition;
uniform vec2 uObjDimensions;

varying vec2 vTexCoord;

vec4 LdotN(Light light, vec3 normalMap, vec4 baseFragColor, float attenuation)
{
    vec3 N = normalize(normalMap);
    vec3 L = normalize(light.uPosition.xyz - gl_FragCoord.xyz);   // light direction
    vec3 V = normalize(uCameraPosition.xyz - gl_FragCoord.xyz);   // eye direction
    
    float LdotN = max(0.0, dot(L, N));
    vec4 LN = vec4(LdotN, LdotN, LdotN, 1) * uDiffuseColor;
    vec3 H = normalize(L + V);
    float HdotN = max(0.0, dot(H, N));
    float specular = max(0.0, pow(HdotN, 250.0));
        
    vec4 atten = vec4(attenuation, attenuation, attenuation, 1);
    vec4 spec = vec4(specular, specular, specular, 0);
   
    return (baseFragColor * atten * LdotN * light.uColor * light.uIntensity) + (spec * atten * light.uColor * light.uIntensity);
}

vec4 Spot(Light light, vec3 normalMap, vec4 baseFragColor, float attenuation)
{
    vec3 N = normalize(normalMap);
    vec3 L = normalize(light.uPosition.xyz - gl_FragCoord.xyz);   // light direction
    vec3 V = normalize(uCameraPosition.xyz - gl_FragCoord.xyz);   // eye direction
    
    float LdotN = max(0.0, dot(L, N));
    vec4 LN = vec4(LdotN, LdotN, LdotN, 1);
    vec3 H = normalize(L + V);
    float HdotN = max(0.0, dot(H, N));
    float specular = max(0.0, pow(HdotN, 250.0));
        
    
    vec4 spec = vec4(specular, specular, specular, 0);
   
    vec3 dir = vec3( 1, 1, -1);
    float spotArea;
    if(LdotN > 0.0)
    {
        spotArea = dot(normalize(dir), -L);
        if(acos(spotArea) < radians(15.0))
        {
            float dist = length(light.uPosition.xyz - gl_FragCoord.xyz);
            attenuation = 1.0 - clamp((dist - light.uInner)/light.uOuter, 0.0, 1.0);
            vec4 atten = vec4(attenuation, attenuation, attenuation, 1);
            return (baseFragColor * atten * LdotN * light.uColor * light.uIntensity) + (spec * atten * light.uColor * light.uIntensity);
        }
    }

    return vec4(0,0,0,0);
}

void main(void)
{
    vec4 texFragColor = texture2D(uSampler, vTexCoord);    
    vec4 normal = texture2D(uNormalSampler, vTexCoord);
    vec4 normalMap = (2.0 * normal) - 1.0;
    
    normalMap.y = -normalMap.y;     //flip y
    //normalMap.x = -normalMap.x;   //flip x
    
    vec4 baseFragColor = vec4((texFragColor.xyz * uAmbientStrength), texFragColor.w) * uAmbientColor;

    for(int i = 0; i < 100; i++)
    {                    
        vec3 v = gl_FragCoord.xyz - lights[i].uPosition.xyz; 
        float len = length(v);
        float attenuation = 1.0 - clamp((len - lights[i].uInner)/lights[i].uOuter, 0.0, 1.0);
        attenuation = attenuation * attenuation;
        baseFragColor += LdotN(lights[i], normalMap.xyz, texFragColor, attenuation);
    }
    gl_FragColor = baseFragColor;
   
}


