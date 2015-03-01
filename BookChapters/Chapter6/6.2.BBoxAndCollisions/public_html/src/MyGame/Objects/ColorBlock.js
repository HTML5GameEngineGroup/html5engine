/* 
 *
 */
function ColorBlock(x, y, w, h, c) {
    this._kDelta = 0.5;
        
    this._mBlock = new Renderable();
    this._mBlock.SetColor(c);
    this._mBlock.GetXform().SetPosition(x, y);
    this._mBlock.GetXform().SetSize(w, h);
    GameObject.call(this, this._mBlock);
};
gEngine.Core.InheritPrototype(ColorBlock, GameObject);

ColorBlock.prototype.Update = function(){
 // control by WSAD
    var xform = this.GetXform();
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.W))
        xform.IncYPosBy(this._kDelta);
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.S))
        xform.IncYPosBy(-this._kDelta);
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.A)) 
        xform.IncXPosBy(-this._kDelta);
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.D)) 
        xform.IncXPosBy(this._kDelta);
};