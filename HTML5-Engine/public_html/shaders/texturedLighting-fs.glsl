// Set the precision for float operations, such as sampler operations.
// Without this set, those operations may not function.
precision mediump float;
struct Light
{
    vec3 uLightPosition;
    vec4 uLightColor;
    //float uLightIntensity;
};

uniform sampler2D uSampler;
uniform Light lights[2];

uniform vec2 uObjPosition;
uniform vec2 uObjDimensions;

varying vec2 vTexCoord;


void main(void)
{
    vec4 texFragColor = texture2D(uSampler, vTexCoord);
    vec3 pixelPosition = vec3(uObjDimensions.x * vTexCoord.x + (uObjPosition.x), 
                              uObjDimensions.y * vTexCoord.y + (uObjPosition.y), 
                              0);

    vec3 v = pixelPosition - lights[0].uLightPosition;
    float len = length(v);
    
    if(len < 15.0)
    {
        gl_FragColor = texFragColor;
    }
    else
    {
        gl_FragColor = vec4(1, 0, 0, 1);
    }
    
}
