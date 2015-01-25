/* 
 *
 */

var _gHeroGravity = 0.001;
var _gHeroFly = 0.1;
var _gHeroMove = 0.5;
var _gHeroWidth = 4;
var _gHeroHeight = 6;

function Dye(xPos, yPos)
{
    var renderableObj = new SpriteObject(gMyGame.GameState.GetSpriteShader(), gMyGame.GameState.GetDyeTexture());
    renderableObj.SetTextureCoordinate(0, 200/512, 0, 300/512);
    GameObject.call(this, renderableObj);
    
    this.GetXform().SetSize(_gHeroWidth, _gHeroHeight);
    this.GetXform().SetPosition(xPos, yPos);
    
    this._mShouldFall = true;
    this._mGravityOn = true;
    this._mVelocity = vec2.fromValues(0, 0);
    
    this._mDyeCollection = new GameObjectSet();
}
gEngine.Core.InheritPrototype(Dye, GameObject);

Dye.prototype.Update = function(useCamera) {
    
    this._MoveXform(gEngine.Input.A,
                        gEngine.Input.D,
                        gEngine.Input.W,
                        gEngine.Input.S);
               
     if (gEngine.Input.IsKeyClicked(gEngine.Input.SPACE)) {
         this._mVelocity[1] += _gHeroFly;
         this.SetShouldFall(true);
     }
     
     if (gEngine.Input.IsKeyClicked(gEngine.Input.F)) {
        this._SendDyePack();
    }
    
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Seven)) {
        _gHeroGravity = 0;
    }
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Eight)) {
        _gHeroGravity = 0.001;
    }
     
     if (this._mShouldFall) {
        this._mVelocity[1] -= _gHeroGravity;
        this.GetXform().IncYPosBy(this._mVelocity[1]);
     }
     
     // make sure all my dyepacks are ok
     this._mDyeCollection.Update();
     this._mDyeCollection.CleanUp(useCamera);
};

Dye.prototype.SetShouldFall = function(b) {
    this._mShouldFall = b;
    if (!b)
        this._mVelocity[1] = 0;
};

Dye.prototype.SetVelocity = function(v) {
    this._mVelocity = v;
};

Dye.prototype._MoveXform = function(left, right, up, down)
{
    var xform = this.GetXform();
    if (gEngine.Input.IsKeyPressed(left)) {
        xform.IncXPosBy(-_gHeroMove);
    }
    if (gEngine.Input.IsKeyPressed(right)) {
        xform.IncXPosBy(_gHeroMove);
    }
    
    if (gEngine.Input.IsKeyPressed(up)) {
        xform.IncYPosBy(_gHeroMove);
        this.SetShouldFall(true);
    }
    if (gEngine.Input.IsKeyPressed(down)) {
        xform.IncYPosBy(-_gHeroMove);
    } 
};

Dye.prototype._SendDyePack = function()
{
    var pos = this.GetXform().GetPosition();
    var d = new DyePack(pos[0] +2, pos[1]+ 1.9);
    this._mDyeCollection.AddToSet(d);
};

Dye.prototype.Draw = function(vpMatrix)
{
    GameObject.prototype.Draw.call(this, vpMatrix);
    this._mDyeCollection.Draw(vpMatrix);
}
