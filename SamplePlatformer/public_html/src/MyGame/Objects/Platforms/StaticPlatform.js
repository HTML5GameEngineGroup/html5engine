/* 
 *
 */
function StaticPlatform(cx, cy, w, h)
{
    PlatformObject.call(this, cx, cy, w, h);
}
gEngine.Core.InheritPrototype(StaticPlatform, PlatformObject);

StaticPlatform.prototype.CreateRenderable = function()
{
    var renderableObj = new SpriteRenderable(gMyGame.GameState.GetSpriteShader(), gMyGame.GameState.GetPlatformTexture());
    renderableObj.SetTextureCoordinate(0, 1.0, 0.02, (50/256)-0.02);   
    return renderableObj;
};