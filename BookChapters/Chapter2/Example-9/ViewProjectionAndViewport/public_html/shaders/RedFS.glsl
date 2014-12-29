// this is the fragment (or pixel) shader that 
// outputs constant red color for every pixel rendered.

void main(void)  {
    // for every pixel called (within the square) sets
    // constant color red with alpha-channel value of 1.0
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
        