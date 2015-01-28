/* 
 * File: Transform.js
 * Encapsulates the matrix transformation functionality, meant to work with
 * Renderable
 */
function Transform()
{
    this._mPosition = vec2.fromValues(0, 0);   // this is the translation
    this._mScale = vec2.fromValues(1,1);       // this is the width (x) and height (y)
    this._mRotationInRad = 0.0;            // in radians!
};

// <editor-fold desc="Public Methods">

//<editor-fold desc="Setter/Getter methods">
// // <editor-fold desc="Position setters and getters ">
Transform.prototype.SetPosition = function(xPos,yPos)
    { this.SetXPos(xPos); this.SetYPos(yPos); };
Transform.prototype.GetPosition = function()
    { return this._mPosition;};
Transform.prototype.GetXPos = function() { return this._mPosition[0];};
Transform.prototype.SetXPos = function(xPos) { this._mPosition[0] = xPos;};
Transform.prototype.IncXPosBy = function(delta) { this._mPosition[0] += delta; };
Transform.prototype.GetYPos = function() { return this._mPosition[1];};
Transform.prototype.SetYPos = function(yPos) { this._mPosition[1] = yPos;}; 
Transform.prototype.IncYPosBy = function(delta) { this._mPosition[1] += delta; };
//</editor-fold>

// <editor-fold desc="size setters and getters">
Transform.prototype.SetSize = function(width, height) {
    this.SetWidth(width); this.SetHeight(height); };
Transform.prototype.GetSize = function(){ return this._mScale; };
Transform.prototype.IncSizeBy = function(delta) { 
        this.IncWidthBy(delta); this.IncHeightBy(delta); };
Transform.prototype.GetWidth = function() { return this._mScale[0]; };    
Transform.prototype.SetWidth = function(width) { this._mScale[0] = width; };
Transform.prototype.IncWidthBy = function(delta) { this._mScale[0] += delta; };
Transform.prototype.GetHeight = function(){ return this._mScale[1]; };
Transform.prototype.SetHeight = function(height) { this._mScale[1] = height; };
Transform.prototype.IncHeightBy = function(delta) { this._mScale[1] += delta; };
//</editor-fold>

// <editor-fold desc="rotation getters and setters">
Transform.prototype.SetRotationInRad = function(rotationInRadians) { 
    this._mRotationInRad = rotationInRadians; 
    while (this._mRotationInRad > (2*Math.PI))
        this._mRotationInRad -= (2*Math.PI);
};
Transform.prototype.SetRotationInDegree = function (rotationInDegree) {
    this.SetRotationInRad(rotationInDegree * Math.PI/180.0);  };
Transform.prototype.IncRotationByDegree = function(deltaDegree) { 
    this.IncRotationByRad(deltaDegree * Math.PI/180.0); };
Transform.prototype.IncRotationByRad = function(deltaRad) { 
    this.SetRotationInRad(this._mRotationInRad + deltaRad); };
Transform.prototype.GetRotationInRad = function() {  return this._mRotationInRad;};
Transform.prototype.GetRotationInDegree = function() { return this._mRotationInRad * 180.0 / Math.PI; };
    //</editor-fold>
//</editor-fold>
//
// returns the matrix the concatenates the transformations defined
Transform.prototype.GetXform = function()
{
    // Creates a blank identity matrix
    var matrix = mat4.create();
    
    // The matricies that opengl uses are transposed, thus the typical matrix
    // operations must be in reverse.
    
    // Step A: compute translation, for now z is always at 0.0
    mat4.translate(matrix, matrix, vec3.fromValues(this.GetXPos(), this.GetYPos(), 0.0));
    // Step  B: concatenate with rotation.
    mat4.rotateZ(matrix, matrix, this.GetRotationInRad());
    // Step  C: concatenate with scaling
    mat4.scale(matrix, matrix, vec3.fromValues(this.GetWidth(), this.GetHeight(), 1.0));
    
    return matrix;
};
//</editor-fold>