/*
 * File: GameLevel.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Scene, Hero, Camera, SceneFileParser, FontRenderable, vec2 */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function GameLevel(level) {
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kPlatform = "assets/platform.png";
    this.kPlatformNormal = "assets/platform_normal.png";
    this.kWall = "assets/wall.png";
    this.kWallNormal = "assets/wall_normal.png";
    
    // specifics to the level
    this.kLevelFile = "assets/" + level + "/" + level + ".xml";  // e.g., assets/Level1/Level1.xml
    this.kBg = "assets/" + level + "/bg.png";
    this.kBgNormal = "assets/" + level + "/bg_normal.png";
    this.kBgLayer = "assets/" + level + "/bgLayer.png";
    this.kBgLayerNormal = "assets/" + level + "/bgLayer_normal.png";

    // The camera to view the scene
    this.mCamera = null;
    this.mPeekCam = null;
    this.mShowPeek = false;

    this.mMsg = null;
    this.mMatMsg = null;

    // the hero and the support objects
    this.mHero = null;

    this.mGlobalLightSet = null;
    
    this.mThisLevel = level;
    this.mNextLevel = null;

    this.mLgtIndex = 0;
    this.mLgtRotateTheta = 0;
}
gEngine.Core.inheritPrototype(GameLevel, Scene);

GameLevel.prototype.loadScene = function () {
    gEngine.TextFileLoader.loadTextFile(this.kLevelFile, gEngine.TextFileLoader.eTextFileType.eXMLFile);
    
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kPlatform);
    gEngine.Textures.loadTexture(this.kPlatformNormal);
    gEngine.Textures.loadTexture(this.kWall);
    gEngine.Textures.loadTexture(this.kWallNormal);
    
    gEngine.Textures.loadTexture(this.kBg);
    gEngine.Textures.loadTexture(this.kBgNormal);
    gEngine.Textures.loadTexture(this.kBgLayer);
    gEngine.Textures.loadTexture(this.kBgLayerNormal);
};

GameLevel.prototype.unloadScene = function () {
    gEngine.LayerManager.cleanUp();
    
    gEngine.TextFileLoader.unloadTextFile(this.kLevelFile);
    
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kPlatform);
    gEngine.Textures.unloadTexture(this.kPlatformNormal);
    gEngine.Textures.unloadTexture(this.kWall);
    gEngine.Textures.unloadTexture(this.kWallNormal);
    
    gEngine.Textures.unloadTexture(this.kBg);
    gEngine.Textures.unloadTexture(this.kBgNormal);
    gEngine.Textures.unloadTexture(this.kBgLayer);
    gEngine.Textures.unloadTexture(this.kBgLayerNormal);
    
    var nextLevel = new GameLevel(this.mNextLevel);  // next level to be loaded
    gEngine.Core.startScene(nextLevel);
};

GameLevel.prototype.initialize = function () {    
    var parser = new SceneFileParser(this.kLevelFile);
    
    this.mCamera = parser.parseCamera();
    this.mGlobalLightSet = parser.parseLights();
    
    // for now here is the hero
    this.mIllumHero = new Hero(this.kMinionSprite, null, 6, 12, this.mGlobalLightSet);
        
    // needs the camera as a reference for parallax
    parser.parseBackground(this.mThisLevel, this.mCamera, this.mGlobalLightSet);
    
    // parsing of actors can only begin after background has been parsed
    // to ensure proper support shadow
    parser.parsePlatform(this.kPlatform, this.kPlatformNormal, this.mGlobalLightSet);
    parser.parseWall(this.kWall, this.kWallNormal, this.mGlobalLightSet);
    
    this.mNextLevel = parser.parseNextLevel();

    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(-9.5, 4);
    this.mMsg.setTextHeight(0.7);

    this.mMatMsg = new FontRenderable("Status Message");
    this.mMatMsg.setColor([1, 1, 1, 1]);
    this.mMatMsg.getXform().setPosition(-9.5, 20);
    this.mMatMsg.setTextHeight(0.7);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eFront, this.mMsg);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eFront, this.mMatMsg);

    // Add hero into the layer manager and as shadow caster
    // Hero should be added into Actor layer last
    // Hero can only be added as shadow caster after background is created
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, this.mIllumHero);
    gEngine.LayerManager.addAsShadowCaster(this.mIllumHero);


    this.mSlectedCh = this.mIllumHero;
    // this.mMaterialCh = this.mSlectedCh.getRenderable().getMaterial().getDiffuse();
    this.mSelectedChMsg = "";
    
    this.mPeekCam = new Camera(
            vec2.fromValues(0, 0),
            120,
            [0, 0, 320, 180],
            2
            );
    this.mShowPeek = false;
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
GameLevel.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    this.mCamera.setupViewProjection();
    gEngine.LayerManager.drawAllLayers(this.mCamera);
    
    if (this.mShowPeek) {
        this.mPeekCam.setupViewProjection();
        gEngine.LayerManager.drawAllLayers(this.mPeekCam);
    }
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
GameLevel.prototype.update = function () {
    this.mCamera.update();  // to ensure proper interpolated movement effects

    gEngine.LayerManager.updateAllLayers();
    
    var xf = this.mIllumHero.getXform();
    this.mCamera.panWith(xf, 0.5);
    var p = vec2.clone(xf.getPosition());
    p[0] -= 8;
    this.mGlobalLightSet.getLightAt(2).set2DPosition(p);
    
    // control the selected light
    var msg = "L=" + this.mLgtIndex + " ";
    msg += this._lightControl();
    this.mMsg.setText(msg);

    // msg = this._selectCharacter();
    // msg += this.materialControl();
    this.mMatMsg.setText("P: to peek the entire level; L: to change level to: " + this.mNextLevel);

    if (this.mShowPeek) {
        this.mPeekCam.setWCCenter(p[0], p[1]);
        this.mPeekCam.update();
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.P)) {
        this.mShowPeek = !this.mShowPeek;
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.L)) {
        gEngine.GameLoop.stop();
    }
};

GameLevel.prototype._selectCharacter = function () {
    // select which character to work with
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Five)) {
        this.mSlectedCh = this.mIllumMinion;
        this.mMaterialCh = this.mSlectedCh.getRenderable().getMaterial().getDiffuse();
        this.mSelectedChMsg = "L:";
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Six)) {
        this.mSlectedCh = this.mIllumHero;
        this.mMaterialCh = this.mSlectedCh.getRenderable().getMaterial().getDiffuse();
        this.mSelectedChMsg = "H:";
    }
    return this.mSelectedChMsg;
};
