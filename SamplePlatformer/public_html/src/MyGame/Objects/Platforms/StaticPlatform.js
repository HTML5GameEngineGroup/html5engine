/* 
 * These guys have constant thickness
 */
var _gPlatformThickness = 1;
function StaticPlatform(cx, cy, w, h)
{
    PlatformObject.call(this, cx, cy, w, h);
}
gEngine.Core.InheritPrototype(StaticPlatform, PlatformObject);

StaticPlatform.prototype.CreateRenderable = function()
{
    var renderableObj = new Renderable(gMyGame.GameState.GetSimpleShader());
    renderableObj.SetColor([1, 0, 0, 1]);
    return renderableObj;
};