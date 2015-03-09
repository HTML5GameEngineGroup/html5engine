// this is the fragment (or pixel) shader that 
// outputs constant red color for every pixel rendered.

precision mediump float; 
    // sets the precision for floating point computation

// Color of the object
uniform vec4 uPixelColor;  

void main(void)  {
    // for every pixel called (within the square) sets
    // constant color red with alpha-channel value of 1.0
    gl_FragColor = uPixelColor;
}
        