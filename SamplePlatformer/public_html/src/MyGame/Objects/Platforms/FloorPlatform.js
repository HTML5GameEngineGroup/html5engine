/* 
 *
 */
function FloorPlatform(cx, cy, w, h)
{
    PlatformObject.call(this, cx, cy, w, h);
}
gEngine.Core.InheritPrototype(FloorPlatform, PlatformObject);

FloorPlatform.prototype.CreateRenderable = function()
{
    var renderableObj = new Renderable(gMyGame.GameState.GetRedShader());
    return renderableObj;
};