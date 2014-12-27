// this is the fragment (or pixel) shader that 
// outputs constant red color for every pixel rendered.
precision mediump float;

struct MyStruct {
    vec4 l;
    vec4 a;
};

struct MyFloatS{
    float r;
    float g;
    float b;
};
  
// uniform MyFloatS fs;
 
  
uniform MyStruct sat[2];

uniform vec4 w;
uniform MyStruct ss;

void main(void)  {
    // for every pixel called (within the square) sets
    // constant color red with alpha-channel value of 1.0
    
// gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);

    // gl_FragColor = s.a;
    // gl_FragColor = w;
    // gl_FragColor = vec4(sat[1].a.x, sat[1].a.y, sat[1].a.z, 1);
// gl_FragColor = vec4(sat[1].a.x, sat[1].a.y, 1, 1);
gl_FragColor = sat[1].a;
    
    // gl_FragColor = ss.a;
    // gl_FragColor = vec4(fs.r, fs.g, fs.b, 1);
}
        