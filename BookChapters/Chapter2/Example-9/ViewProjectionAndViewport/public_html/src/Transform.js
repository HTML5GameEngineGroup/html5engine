/* 
 * File: Transform.js
 * Encapsulates the matrix transformation functionality, meant to work with
 * RenderableObject
 */
function Transform()
{
    var mPosition = {};                   // says position and scale are arrays
    var mScale = {};
    mPosition = vec2.fromValues(0, 0);   // this is the translation
    mScale = vec2.fromValues(1,1);       // this is the width (x) and height (y)
    var mRotationInRad = 0.0;            // in radians!
    
    // Position setters and getters 
    this.SetPosition = function(xPos,yPos)
        { this.SetXPos(xPos); this.SetYPos(yPos); };
    this.GetPosition = function()
        { return mPosition;};
    this.GetXPos = function() { return mPosition[0];};
    this.SetXPos = function(xPos) { mPosition[0] = xPos;};
    this.GetYPos = function() { return mPosition[1];};
    this.SetYPos = function(yPos) { mPosition[1] = yPos;}; 
    
    // size setters and getters
    this.SetSize = function(width, height) {
        this.SetWidth(width); this.SetHeight(height); };
    this.GetSize = function(){ return mScale; };
    this.GetWidth = function() { return mScale[0]; };    
    this.SetWidth = function(width) { mScale[0] = width; };
    this.GetHeight = function(){ return mScale[1]; };
    this.SetHeight = function(height) { mScale[1] = height; };
    
    // rotation getters and setters
    this.SetRotationInRad = function(rotationInRadians) { 
        mRotationInRad = rotationInRadians; };
    this.SetRotationInDegree = function (rotationInDegree) {
        mRotationInRad = rotationInDegree * Math.PI/180.0;  };
    this.GetRotationInRad = function() {  return mRotationInRad;};
    this.GetRotationInDegree = function() { return mRotationInRad * 180.0 / Math.PI; };
};

Transform.prototype.GetXform = function()
{
    // Creates a blank identity matrix
    var matrix = mat4.create();
    
    // The matricies that opengl uses are transposed, thus the typical matrix
    // operations must be in reverse.
    
    // First translate it, for now z is always at 0.0
    mat4.translate(matrix, matrix, vec3.fromValues(this.GetXPos(), this.GetYPos(), 0.0));
    // Then rotate it.
    mat4.rotateZ(matrix, matrix, this.GetRotationInRad());
    // Finally, scale it.
    mat4.scale(matrix, matrix, vec3.fromValues(this.GetWidth(), this.GetHeight(), 1.0));
    
    return matrix;
};