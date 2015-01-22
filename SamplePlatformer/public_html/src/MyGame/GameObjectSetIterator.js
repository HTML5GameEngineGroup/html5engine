
GameObjectSetIterator = function(set)
{
    this._mIndex = 0;
    this._mNextElm = null;
    this._mSet = set;
    this.InitForIteration();
};

GameObjectSetIterator.prototype.FindNextElm = function()
{
    var done = false;
    this._mNextElm = null;
    while ((!done) && (this._mIndex<this._mSet._mSet.length)){
        this._mNextElm = this._mSet._mSet[this._mIndex];
        done = (this._mNextElm !== null);    
        this._mIndex++;
    }
};

GameObjectSetIterator.prototype.InitForIteration = function()
{
    this._mIndex = 0;
    this._mNextElm = null;
    this.FindNextElm();
};

GameObjectSetIterator.prototype.GetCurrentIndex = function()
{
    return this._mIndex-1;
};

GameObjectSetIterator.prototype.GetNextElm = function()
{
    return (this._mNextElm);
};

GameObjectSetIterator.prototype.HasNextElm = function()
{
    return (this.GetNextElm() !== null);
};