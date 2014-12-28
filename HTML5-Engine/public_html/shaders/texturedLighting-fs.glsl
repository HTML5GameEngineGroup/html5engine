// Set the precision for float operations, such as sampler operations.
// Without this set, those operations may not function.
precision mediump float;
struct Light
{
    vec4 uLightPosition;
    vec4 uLightColor;
    //float uLightIntensity;
};

uniform sampler2D uSampler;
uniform Light lights[2];

uniform vec2 uObjPosition;
uniform vec2 uObjDimensions;

varying vec2 vTexCoord;
varying mat4 umvmatrix;

void main(void)
{
    vec4 texFragColor = texture2D(uSampler, vTexCoord);
    vec4 theLightPos = vec4(lights[0].uLightPosition.xyz, 0);
                           
    vec2 v = gl_FragCoord.xy  - theLightPos.xy;
    float len = length(v);
    float falloffFactor = len * len;
    float attenuation = 1.0 - clamp((len - 50.0)/250.0, 0.0, 1.0);
    attenuation = attenuation * attenuation;
    //if(falloffFactor != 0.0)
    //    attenuation = 1.0 / falloffFactor * 50.0;
    vec4 color = vec4((texFragColor.xyz * 0.0), texFragColor.w) + (texFragColor * attenuation * (lights[0].uLightColor * 1.0));
    gl_FragColor = color;

    //if(len < 50.0)
    //    gl_FragColor = texFragColor;
    //else
    //    gl_FragColor = vec4(1);

    
}
