function GameObjectSet() {
    this._mSet = new Array();
};

GameObjectSet.prototype.Size = function() { return this._mSet.length; };

GameObjectSet.prototype.GetObjectAt = function(index)
{
    return this._mSet[index];
};

GameObjectSet.prototype.AddToSet = function(obj)
{
    this._mSet.push(obj);
};

GameObjectSet.prototype.Update = function()
{
    for (var i = 0; i<this._mSet.length; i++) {
        this._mSet[i].Update();
    }
};

GameObjectSet.prototype.Draw = function(vpMatrix)
{
    for (var i = 0; i<this._mSet.length; i++) {
        this._mSet[i].Draw(vpMatrix);
    }
};
