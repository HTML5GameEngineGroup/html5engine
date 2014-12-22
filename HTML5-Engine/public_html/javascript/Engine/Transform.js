/* 
 * 
 */
function Transform()
{
    var x = 0.0;
    var y = 0.0;
    var zOrder = 0;
    var rotation = 0.0;
    var scale = vec3.create();
    
    this.setPosition = function(xPos,yPos)
        { x = xPos; y = yPos; };
    this.getPosition = function()
        { return vec2.fromValues(x, y);};
    this.getX = function() { return x;};
    this.setX = function(xPos) {x = xPos;};
    this.getY = function() { return y;};
    this.setY = function(yPos) {y = yPos;}; 
    this.setSize = function(width, height)
        { scale = vec3.fromValues(width, height, 0); };
    this.getScale = function(){return scale;};
    this.setRotation = function(rotationInRadians)
        { rotation = rotationInRadians; };
    this.getRotation = function()
        { return rotation;};
    this.setZOrder = function(z)
        { 
            if(z < 0){z = 0;};
            zOrder = Math.round(z);
        };
    this.getZOrder = function()
        { return zOrder;};
        
    this.getCenterPosition = function()
    {
        return vec2.fromValues(x + (scale[0] / 2), y + (scale[1]/2));
    };
    this.getWidth = function()
    {
        return scale[0];
    };
    
    this.getHeight = function()
    {
        return scale[1];
    };
};

Transform.prototype.getMatrix = function()
{
    // Creates a blank identity matrix
    var matrix = mat4.create();
    
    // The matricies that opengl uses are transposed, thus the typical matrix
    // operations must be in reverse.
    
    // First translate it and add the z-order
    mat4.translate(matrix, matrix, vec3.fromValues(this.getX(), this.getY(), this.getZOrder()));
    // Then rotate it.
    mat4.rotateZ(matrix, matrix, this.getRotation());
    // Finally, scale it.
    mat4.scale(matrix, matrix, this.getScale());
    
    return matrix;
};

