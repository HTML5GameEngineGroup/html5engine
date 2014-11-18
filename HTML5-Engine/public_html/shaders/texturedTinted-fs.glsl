precision mediump float;

uniform sampler2D uSampler;

varying vec2 vTexCoord;

void main(void)
{
    vec4 color = vec4(0.1, 0.3, 0.6, 1.0);
    vec4 texel = color  * texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));
    gl_FragColor = texel;
}
