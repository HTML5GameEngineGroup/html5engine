/* 
 *
 */
function Minion(spriteTexture, normalMap, atX, atY) {
    this._kDelta = 0.2;
    if (normalMap === null)
        this._mMinion= new DiffuseRenderable(spriteTexture, normalMap);
    else
        this._mMinion= new IllumRenderable(spriteTexture, normalMap);
    
    this._mMinion.SetColor([1, 1, 1, 0]);
    this._mMinion.GetXform().SetPosition(atX, atY);
    this._mMinion.GetXform().SetSize(18, 14.4);
    this._mMinion.SetSpriteSequence(512, 0,     // first element pixel position: top-right 512 is top of image, 0 is right of image
                                    204,164,    // widthxheight in pixels
                                    5,          // number of elements in this sequence
                                    0);         // horizontal padding in between
    this._mMinion.SetAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this._mMinion.SetAnimationSpeed(30);
                                // show each element for _mAnimSpeed updates
                                
    GameObject.call(this, this._mMinion);
};
gEngine.Core.InheritPrototype(Minion, GameObject);

Minion.prototype.Update = function(){
    // remember to update this._mMinion's animation
    this._mMinion.UpdateAnimation();
};