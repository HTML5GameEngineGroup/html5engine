/*
 * File: RenderableObject.js
 *  
 * Encapsulate the Shader and VertexBuffer into the same object (and will include
 * other attributes later) to represent a renderable object on the game screen.
 */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function TextObject(aSpriteShader, aString)
{
    this._mFont = gEngine.Fonts.DefaultFont;
    this._mOneChar = new SpriteObject(aSpriteShader, this._mFont + ".png");
    this._mXform = new Transform(); // transform that moves this object around
    this._mText = aString;
};

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
TextObject.prototype.Draw = function() {
    // we will draw the text string by calling to _mOneChar for each of the
    // chars in the _mText string.
    var widthOfOneChar = this._mXform.GetWidth() / this._mText.length;
    var heightOfOneChar = this._mXform.GetHeight();
    this._mOneChar.GetXform().SetRotationInRad(this._mXform.GetRotationInRad());
    var yPos = this._mXform.GetYPos();
    
    // center position of the first char
    var xPos = this._mXform.GetXPos() - (widthOfOneChar/2) + (widthOfOneChar*0.5);
    for(var charIndex = 0; charIndex < this._mText.length; charIndex++)
    {
        var aChar = this._mText.charCodeAt(charIndex);
        var charInfo = gEngine.Fonts.GetCharInfo(this._mFont, aChar);
        
        // set the texture coordinate
        this._mOneChar.SetTextureCoordinate(charInfo.mTexCoordLeft, charInfo.mTexCoordRight,
                charInfo.mTexCoordBottom, charInfo.mTexCoordTop);
        
        // now the size of the char
        var xSize = widthOfOneChar * charInfo.mCharWidth;
        var ySize = heightOfOneChar * charInfo.mCharHeight;
        this._mOneChar.GetXform().SetSize(xSize, ySize);
        
        // how much to offset from the center
        var xOffset = widthOfOneChar * charInfo.mCharWidthOffset * 0.5;
        var yOffset = heightOfOneChar * charInfo.mCharHeightOffset * 0.5;
        
        this._mOneChar.GetXform().SetPosition(xPos - xOffset, yPos - yOffset);        
        //
        
        this._mOneChar.Draw();
        
        xPos += widthOfOneChar;
    }
    
};

TextObject.prototype.GetXform = function() { return this._mXform; };
TextObject.prototype.GetText = function() { return this._mText; };
TextObject.prototype.SetText = function(t) { this._mText = t; };
TextObject.prototype.GetFont = function() { return this._mFont; };
TextObject.prototype.SetFont = function(f) { this._mFont = f; };
//--- end of Public Methods
//</editor-fold>