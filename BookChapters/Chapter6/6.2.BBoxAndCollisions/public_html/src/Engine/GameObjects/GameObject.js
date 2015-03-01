/* 
 *
 */
function GameObject(renderableObj) {
    this._mRenderComponent = renderableObj;
    this._mVisible = true;
};
GameObject.prototype.GetXform = function(){ return this._mRenderComponent.GetXform();};
GameObject.prototype.GetBBox = function() { 
    var xform = this.GetXform();
    var b = new BoundingBox(xform.GetPosition(), xform.GetWidth(), xform.GetHeight());
    return b;
};
GameObject.prototype.SetVisibility = function(f){ this._mVisible = f;};
GameObject.prototype.IsVisible = function(){ return this._mVisible;};

GameObject.prototype.update = function(){};

GameObject.prototype.Draw = function(vpMatrix){
    if (this.IsVisible())
        this._mRenderComponent.Draw(vpMatrix);
};
