function Light(position, color, intensity)
{
    this.mPosition = position;
    this.mColor = color;
    this.mIntensity = intensity;
    
}

Light.prototype.getPosition = function()
{
    return this.mPosition;
}

Light.prototype.getColor = function()
{
    return this.mColor;
}

Light.prototype.getIntensity = function()
{
    return this.mIntensity;
}


