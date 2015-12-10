/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */
/*jslint node: true, vars: true */
/*global gEngine: false, Scene: false, BlueLevel: false, Camera: false, Renderable: false, vec2: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
     // audio clips: supports both mp3 and wav formats
//    this.kBgClip = "assets/sounds/BGClip.mp3";
//    this.kCue = "assets/sounds/MyGame_cue.wav";
//    this.kSceneFile = "assets/GrayLevel.json";



    // The camera to view the scene
    this.mCamera = null;
//    this.mSqSet = [];
//    
//
//    // the hero and the support objects
//    this.mHero = null;
//    this.mSupport = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
   // loads the audios
    //gEngine.AudioClips.loadAudio(this.kBgClip);
   // gEngine.AudioClips.loadAudio(this.kCue);
    //gEngine.TextFileLoader.loadTextFile(this.kSceneFile, gEngine.TextFileLoader.eTextFileType.eTextFile);


};


MyGame.prototype.unloadScene = function() {
    // Step A: Game loop not running, unload all assets
    // stop the background audio
    //gEngine.AudioClips.stopBackgroundAudio();

    // unload the scene resources
    // gEngine.AudioClips.unloadAudio(this.kBgClip);
    //      You know this clip will be used elsewhere in the game
    //      So you decide to not unload this clip!!
    //gEngine.AudioClips.unloadAudio(this.kCue);


    // Step B: starts the next level
    // starts the next level
    //var nextLevel = new BlueLevel();  // next level to be loaded
    //gEngine.Core.startScene(nextLevel);
};

MyGame.prototype.initialize = function () {

 
    this.mCamera = new Camera(
        vec2.fromValues(20,60),   // position of the camera
        20,                        // width of camera
        [0,0,640,480]        // viewport (orgX, orgY, width, height)
        );
    this.mCamera.setBackgroundColor([0.8,0.8,0.8,1]);
    
    registerMainCamera(this.mCamera);
 
            
//    for(var i = 0; i < sqrs.length; i++){
//        var renderable = new Renderable(gEngine.DefaultResources.getConstColorShader());
//        renderable.setColor(sqrs[i].Color);
//        renderable.getXform().setPosition(sqrs[i].Pos[0], sqrs[i].Pos[1]);
//        renderable.getXform().setSize(sqrs[i].Width,sqrs[i].Height);
//        renderable.getXform().setRotationInDegree(sqrs[i].Rotation);
//        this.mSqSet.push(renderable);
//        Global_ObjectList[i] = renderable;
//    }

};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
//
//    // Step  B: Activate the drawing Camera
    this.mCamera.setupViewProjection();
//    


     var i;
     for (i = 0; i < Global_ObjectList.size(); i++) {
        Global_ObjectList.getObjectAt(i).draw(this.mCamera);
     } 


//    for (i = 0; i < this.mSqSet.length; i++) {
//        this.mSqSet[i].draw(this.mCamera.getVPMatrix());
//    }

};

// The update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    // let's only allow the movement of hero, 
    // and if hero moves too far off, this level ends, we will
    // load the next level
//    var deltaX = 0.05;
//    var xform = this.mHero.getXform();
//    

//      var whiteXform = this.mSqSet[0].getXform();
//      var redXform = this.mSqSet[1].getXform();
//
//
//      redXform.incRotationByDegree(1.2);
//      
//      whiteXform.incXPosBy(1/9);
//      
//      if(whiteXform.getXPos() >= 30){
//          whiteXform.setXPos(10);
//      }
//      
//
//      
//      updateView(
//              whiteXform.getXPos(),
//              whiteXform.getYPos(),
//              whiteXform.getRotationInDegree(),
//              0,
//              0
//           
//            );
//    
//        updateView(
//            redXform.getXPos(),
//            redXform.getYPos(),
//            redXform.getRotationInDegree(),
//            0,
//            1
//
//          );
      
      //console.log(whiteXform.getXPos());
    

//    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
//        gEngine.AudioClips.playACue(this.kCue);
//        xform.incXPosBy(-deltaX);
//        if (xform.getXPos() < 11) {  // this is the left-bound of the window
//            gEngine.GameLoop.stop();
//        }
//    }
};