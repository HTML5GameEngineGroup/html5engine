function Light(position, color)
{
    this.mPosition = position;
    this.mColor = color;
    this.mIntensity = 1.0;
    this.mInnerRadiusSize = 150.0;
    this.mOuterRadiusSize = 100.0;
    this.mSpecularIntensity = 10.0;
    this.mDirection = vec3.fromValues(0, 0, -1);
};

Light.prototype.getPosition = function()
{
    return this.mPosition;
};

Light.prototype.setPosition = function(position)
{
    this.mPosition = position;
};

Light.prototype.getColor = function()
{
    return this.mColor;
};

Light.prototype.getInnerRadiusSize = function()
{
    return this.mInnerRadiusSize;
};

Light.prototype.getOuterRadiusSize = function()
{
    return this.mOuterRadiusSize;
};

Light.prototype.setInnerRadiusSize = function(value)
{
    this.mInnerRadiusSize = value;
};

Light.prototype.setOuterRadiusSize = function(value)
{
    this.mOuterRadiusSize = value;
};

Light.prototype.setIntensity = function(value)
{
    this.mIntensity = value;
};

Light.prototype.getIntensity = function()
{
    return this.mIntensity;
};

Light.prototype.update = function()
{

};

