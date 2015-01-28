
var _gDyePackSpeed = 1.2;
var _gDyePackSizeX = 0.5;
var _gDyePackSizeY = 0.5;

function DyePack(posX, posY)
{
    var renderableObj = new Renderable(gMyGame.GameState.GetSimpleShader());
    renderableObj.SetColor([1, 1, 1, 1]);
    GameObject.call(this, renderableObj);
    
    this.GetXform().SetPosition(posX, posY);
    this.GetXform().SetSize(_gDyePackSizeX, _gDyePackSizeY);
}
gEngine.Core.InheritPrototype(DyePack, GameObject);

DyePack.prototype.Update = function() {
    this.GetXform().IncXPosBy(_gDyePackSpeed);
};