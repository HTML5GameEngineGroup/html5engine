function LightSet() {
    this._mSet = new Array();
};

LightSet.prototype.NumLights = function() { return this._mSet.length; };

LightSet.prototype.GetLightAt = function(index)
{
    return this._mSet[index];
};

LightSet.prototype.AddToSet = function(light)
{
    this._mSet.push(light);
};