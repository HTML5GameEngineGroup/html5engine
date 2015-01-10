 /* 
 * File: Transform.js
 * Encapsulates the matrix transformation functionality, meant to work with
 * RenderableObject
 */
function Transform()
{
    this._mPosition = vec2.fromValues(0, 0);   // this is the translation
    this._mScale = vec2.fromValues(1,1);       // this is the width (x) and height (y)
    this._mRotationInRad = 0.0;            // in radians!
    
    // <editor-fold desc="Position setters and getters ">
    this.SetPosition = function(xPos,yPos)
        { this.SetXPos(xPos); this.SetYPos(yPos); };
    this.GetPosition = function()
        { return this._mPosition;};
    this.GetXPos = function() { return this._mPosition[0];};
    this.SetXPos = function(xPos) { this._mPosition[0] = xPos;};
    this.GetYPos = function() { return this._mPosition[1];};
    this.SetYPos = function(yPos) { this._mPosition[1] = yPos;}; 
    //</editor-fold>
    
    // <editor-fold desc="size setters and getters">
    this.SetSize = function(width, height) {
        this.SetWidth(width); this.SetHeight(height); };
    this.GetSize = function(){ return this._mScale; };
    this.GetWidth = function() { return this._mScale[0]; };    
    this.SetWidth = function(width) { this._mScale[0] = width; };
    this.GetHeight = function(){ return this._mScale[1]; };
    this.SetHeight = function(height) { this._mScale[1] = height; };
    //</editor-fold>
    
    // <editor-fold desc="rotation getters and setters">
    this.SetRotationInRad = function(rotationInRadians) { 
        this._mRotationInRad = rotationInRadians; 
        while (this._mRotationInRad > (2*Math.PI))
            this._mRotationInRad -= (2*Math.PI);
    };
    this.SetRotationInDegree = function (rotationInDegree) {
        this._mRotationInRad = rotationInDegree * Math.PI/180.0;  };
    this.GetRotationInRad = function() {  return this._mRotationInRad;};
    this.GetRotationInDegree = function() { return this._mRotationInRad * 180.0 / Math.PI; };
    //</editor-fold>
};

// <editor-fold desc="Public Methods">

// returns the matrix the concatenates the transformations defined
Transform.prototype.GetXform = function()
{
    // Creates a blank identity matrix
    var matrix = mat4.create();
    
    // The matricies that opengl uses are transposed, thus the typical matrix
    // operations must be in reverse.
    
    // Step 1: compute translation, for now z is always at 0.0
    mat4.translate(matrix, matrix, vec3.fromValues(this.GetXPos(), this.GetYPos(), 0.0));
    // Step 2: concatenate with rotation.
    mat4.rotateZ(matrix, matrix, this.GetRotationInRad());
    // Step 3: concatenate with scaling
    mat4.scale(matrix, matrix, vec3.fromValues(this.GetWidth(), this.GetHeight(), 1.0));
    
    return matrix;
};
//</editor-fold>