function GameObjectSet()
{   
    this._mSet = new Array();
    this._mIterator = new GameObjectSetIterator(this);
};


GameObjectSet.prototype.AddToSet = function(obj)
{
    var i = 0;
    var done = false;
    
    while ((!done) && (i<this._mSet.length)){
        done = (this._mSet[i] === null);
        if (done)
            this._mSet[i] = obj;
        i++;
    }
    // not inserted, add to last element
    if (!done)
        this._mSet[this._mSet.length] = obj;
};

GameObjectSet.prototype.Update = function()
{
    this._mIterator.InitForIteration();
    while (this._mIterator.HasNextElm()) {
        this._mIterator.GetNextElm().Update();
        this._mIterator.FindNextElm();
    }
};

GameObjectSet.prototype.Draw = function(vpMatrix)
{
    this._mIterator.InitForIteration();
    while (this._mIterator.HasNextElm()) {
        this._mIterator.GetNextElm().Draw(vpMatrix);
        this._mIterator.FindNextElm();
    }
};

GameObjectSet.prototype.CleanUp = function(aCamera)
{
    this._mIterator.InitForIteration();
    while (this._mIterator.HasNextElm()) {
         if (aCamera.CollideWCBound(this._mIterator.GetNextElm().GetXform()) === aCamera.eWCCollideStatus.eOutside)
            this._mSet[this._mIterator.GetCurrentIndex()] = null;
        this._mIterator.FindNextElm();
    }
};

GameObjectSet.prototype.Advance = function(delta)
{
    this._mIterator.InitForIteration();
    while (this._mIterator.HasNextElm()) {
        var xf = this._mIterator.GetNextElm().GetXform();
        xf.IncXPosBy(delta);
        this._mIterator.FindNextElm();
    }
};