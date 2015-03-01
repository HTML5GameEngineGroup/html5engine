/* 
 *
 */
function DyePack(spriteTexture) {
    this._kRefWidth = 80;
    this._kRefHeight = 130;
    
    this._mDyePack= new SpriteRenderable(spriteTexture);
    this._mDyePack.SetColor([1, 1, 1, 0.1]);
    this._mDyePack.GetXform().SetPosition(50, 33);
    this._mDyePack.GetXform().SetSize(this._kRefWidth/50, this._kRefHeight/50);
    this._mDyePack.SetTexPixelPositions(510, 595, 512-490+1, 512-360+1);
    GameObject.call(this, this._mDyePack);
};
gEngine.Core.InheritPrototype(DyePack, GameObject);

DyePack.prototype.Update = function(){};