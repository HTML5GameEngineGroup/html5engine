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
    
    // <editor-fold desc="Position setters and getters ">
    this.SetPosition = function(xPos,yPos)
        { this.SetXPos(xPos); this.SetYPos(yPos); };
    this.GetPosition = function()
        { return mPosition;};
    this.GetXPos = function() { return mPosition[0];};
    this.SetXPos = function(xPos) { mPosition[0] = xPos;};
    this.IncXPosBy = function(delta) { mPosition[0] += delta; }
    this.GetYPos = function() { return mPosition[1];};
    this.SetYPos = function(yPos) { mPosition[1] = yPos;}; 
    this.IncYPosBy = function(delta) { mPosition[1] += delta; }
    //</editor-fold>
    
    // <editor-fold desc="size setters and getters">
    this.SetSize = function(width, height) {
        this.SetWidth(width); this.SetHeight(height); };
    this.GetSize = function(){ return mScale; };
    this.IncSizeBy = function(delta) { this.IncWidthBy(delta); this.IncHeightBy(delta); };
    this.GetWidth = function() { return mScale[0]; };    
    this.SetWidth = function(width) { mScale[0] = width; };
    this.IncWidthBy = function(delta) { mScale[0] += delta; };
    this.GetHeight = function(){ return mScale[1]; };
    this.SetHeight = function(height) { mScale[1] = height; };
    this.IncHeightBy = function(delta) { mScale[1] += delta; };
    //</editor-fold>
    
    // <editor-fold desc="rotation getters and setters">
    this.SetRotationInRad = function(rotationInRadians) { 
        mRotationInRad = rotationInRadians; 
        while (mRotationInRad > (2*Math.PI))
            mRotationInRad -= (2*Math.PI);
    };
    this.SetRotationInDegree = function (rotationInDegree) {
        this.SetRotationInRad(rotationInDegree * Math.PI/180.0);  };
    this.IncRotationByDegree = function(deltaDegree) { 
        this.IncRotationByRad(deltaDegree * Math.PI/180.0); };
    this.IncRotationByRad = function(deltaRad) { 
        this.SetRotationInRad(mRotationInRad + deltaRad); };
    this.GetRotationInRad = function() {  return mRotationInRad;};
    this.GetRotationInDegree = function() { return mRotationInRad * 180.0 / Math.PI; };
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
    
    // First translate it, for now z is always at 0.0
    mat4.translate(matrix, matrix, vec3.fromValues(this.GetXPos(), this.GetYPos(), 0.0));
    // Then rotate it.
    mat4.rotateZ(matrix, matrix, this.GetRotationInRad());
    // Finally, scale it.
    mat4.scale(matrix, matrix, vec3.fromValues(this.GetWidth(), this.GetHeight(), 1.0));
    
    return matrix;
};
//</editor-fold>