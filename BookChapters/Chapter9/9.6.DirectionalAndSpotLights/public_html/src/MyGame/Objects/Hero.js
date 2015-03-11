/* 
 */
function Hero(spriteTexture, normalMap, atX, atY, lgtSet) {
    this._kDelta = 0.3;
   
    if (normalMap !== null) {
        this._mDye = new IllumRenderable(spriteTexture, normalMap);
        this._mDye.SetNormalMapPixelPositions(0, 120, 0, 180);  // left, right, bot, top
    } else {
        this._mDye = new LightRenderable(spriteTexture);
    }
    this._mDye.SetColor([1, 1, 1, 0]);
    this._mDye.GetXform().SetPosition(atX, atY);
    this._mDye.GetXform().SetSize(18, 24);
    this._mDye.SetTexPixelPositions(0, 120, 0, 180);
        
    GameObject.call(this, this._mDye);
    
    for (var i = 0; i<4; i++)
        this._mDye.AddLight(lgtSet.GetLightAt(i));
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