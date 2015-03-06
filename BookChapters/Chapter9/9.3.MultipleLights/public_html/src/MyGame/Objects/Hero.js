/* 
 *
 */
function Hero(spriteTexture) {
    this._kDelta = 0.3;
    
    this._mDye = new DiffuseRenderable(spriteTexture);
    this._mDye.SetColor([1, 1, 1, 0]);
    this._mDye.GetXform().SetPosition(35, 50);
    this._mDye.GetXform().SetSize(9, 12);
    this._mDye.SetTexPixelPositions(0, 120, 0, 180);
    GameObject.call(this, this._mDye);
};
gEngine.Core.InheritPrototype(Hero, GameObject);

Hero.prototype.Update = function() {
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