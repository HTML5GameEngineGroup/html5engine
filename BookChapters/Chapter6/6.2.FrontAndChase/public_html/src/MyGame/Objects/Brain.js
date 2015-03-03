/* 
 *
 */
function Brain(spriteTexture) {
    this._kDeltaDegree = 1;
    this._kDeltaRad = Math.PI * this._kDeltaDegree/180;
    this._kDeltaSpeed = 0.01;
    this._mBrain= new SpriteRenderable(spriteTexture);
    this._mBrain.SetColor([1, 1, 1, 0]);
    this._mBrain.GetXform().SetPosition(50, 10);
    this._mBrain.GetXform().SetSize(3, 5.4);
    this._mBrain.SetTexPixelPositions(600, 700, 0, 180);
                                
    GameObject.call(this, this._mBrain);
    
    this.SetSpeed(0.05);
};
gEngine.Core.InheritPrototype(Brain, GameObject);

Brain.prototype.Update = function(){
    GameObject.prototype.Update.call(this);  // default moving forward
    
    var xf = this.GetXform();
    var fdir = this.GetCurrentFrontDir();
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Left)) {
        xf.IncRotationByDegree(this._kDeltaDegree);
        vec2.rotate(fdir, fdir, this._kDeltaRad);
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Right)) {
        xf.IncRotationByRad(-this._kDeltaRad);
        vec2.rotate(fdir, fdir, -this._kDeltaRad);
    }
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Up)) {
        this.IncSpeedBy(this._kDeltaSpeed);
    }
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Down)) {
        this.IncSpeedBy(-this._kDeltaSpeed);
    }
};