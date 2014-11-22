/* 
 * 
 */
function FontTexture(transform, shaderName, fontTexture, fontInfo, text)
{   
    Renderable2DObject.call(this, transform, shaderName, fontTexture);
    this._mFontInfo = fontInfo;
    this.mText = text;
    
}
FontTexture.prototype = Object.create(Renderable2DObject.prototype);

