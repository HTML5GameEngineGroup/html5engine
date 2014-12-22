function Light(position, color)
{
    this.mPosition = position;
    this.mColor = color;
    this.mIntensity = 1.0;
};

Light.prototype.getPosition = function()
{
    return this.mPosition;
};

Light.prototype.getColor = function()
{
    return this.mColor;
};

Light.prototype.getIntensity = function()
{
    return this.mIntensity;
};

Light.prototype.update = function(position)
{
    this.mPosition = position;
};

