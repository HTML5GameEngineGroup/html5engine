/* 
 * These guys have constant thickness
 */
function StaticHPlatform(cx, cy, size)
{
    PlatformObject.call(this, cx, cy, size, _gPlatformThickness);
}
gEngine.Core.InheritPrototype(StaticHPlatform, StaticPlatform);