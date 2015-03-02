/* 
 *
 */
function DyePack(spriteTexture) {
    this._kRefWidth = 80;
    this._kRefHeight = 130;
    this._kDelta = 0.5;
    
    this._mDyePack= new SpriteRenderable(spriteTexture);
    this._mDyePack.SetColor([1, 1, 1, 0.1]);
    this._mDyePack.GetXform().SetPosition(50, 33);
    this._mDyePack.GetXform().SetSize(this._kRefWidth/50, this._kRefHeight/50);
    this._mDyePack.SetTexPixelPositions(510, 595, 23, 153);
    GameObject.call(this, this._mDyePack);
};
gEngine.Core.InheritPrototype(DyePack, GameObject);

DyePack.prototype.Update = function() {
    var xform = this.GetXform();
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Up))
        xform.IncYPosBy(this._kDelta);
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Down))
        xform.IncYPosBy(-this._kDelta);
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Left)) 
        xform.IncXPosBy(-this._kDelta);
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Right)) 
        xform.IncXPosBy(this._kDelta);
    
    if (this.IsVisible()) 
        xform.IncYPosBy(-this._kDelta);
};