/* 
 *
 */
function Generic(texture, x, y, w, h) {
    this._kDelta = 0.2;
    this._kRDelta = 0.1; // radian
    
    this._mRenderable = new TextureRenderable(texture);
    this._mRenderable.SetColor([1, 1, 1, 0.1]);
    this._mRenderable.GetXform().SetPosition(x, y);
    this._mRenderable.GetXform().SetSize(w, h)
    GameObject.call(this, this._mRenderable);
};
gEngine.Core.InheritPrototype(Generic, GameObject);

Generic.prototype.Update = function(up, down, left, right, rot) {
    var xform = this.GetXform();
    if (gEngine.Input.IsKeyPressed(up))
        xform.IncYPosBy(this._kDelta);
    if (gEngine.Input.IsKeyPressed(down))
        xform.IncYPosBy(-this._kDelta);
    if (gEngine.Input.IsKeyPressed(left)) 
        xform.IncXPosBy(-this._kDelta);
    if (gEngine.Input.IsKeyPressed(right)) 
        xform.IncXPosBy(this._kDelta);
    if (gEngine.Input.IsKeyPressed(rot)) 
        xform.IncRotationByRad(this._kRDelta);
};