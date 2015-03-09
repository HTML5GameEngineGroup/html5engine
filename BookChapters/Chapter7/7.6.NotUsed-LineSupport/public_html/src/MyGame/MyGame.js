/*
 * File: MyGame.js 
 * This is the the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame()
{   
    // The camera to view the rectangles
    this._mCamera = null;
    
    this._mMsg = null;
    
    this._mLineSet = new Array();
    this._mCurrentLine = null;
    this._mP1 = null;
};
gEngine.Core.InheritPrototype(MyGame, Scene);

MyGame.prototype.Initialize = function() 
{
    // Step A: set up the cameras
    this._mCamera = new Camera(
            vec2.fromValues(30, 27.5), // position of the camera
            100,                       // width of camera
            [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
            );
    this._mCamera.SetBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
            
    this._mMsg = new FontRenderable("Status Message");
    this._mMsg.SetColor([0, 0, 0, 1]);
    this._mMsg.GetXform().SetPosition(-19, -8);
    this._mMsg.SetTextHeight(3);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.Draw = function() 
{   
    // Step A: clear the canvas
    gEngine.Core.ClearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    this._mCamera.SetupViewProjection();
    for (var i = 0; i<this._mLineSet.length; i++) {
        var l = this._mLineSet[i];
        l.Draw(this._mCamera);
    }
    this._mMsg.Draw(this._mCamera);   // only draw status in the main camera
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.Update = function()
{
    var msg = "Lines: " + this._mLineSet.length + " ";
    
    var echo = "";
    
    
    if (gEngine.Input.IsButtonPressed(gEngine.Input.MouseButton.Middle)) {
        var len = this._mLineSet.length;
        if (len > 0) {
            this._mCurrentLine = this._mLineSet[len-1];
            var x = this._mCamera.MouseWCX();
            var y = this._mCamera.MouseWCY();
            echo += "Selected " + len + " ";
            echo += "[" + x.toPrecision(2) + " " + y.toPrecision(2) + "]";
            this._mCurrentLine.SetFirstVertex(x, y);
        }
    }
    
    if (gEngine.Input.IsButtonPressed(gEngine.Input.MouseButton.Left)) {
        var x = this._mCamera.MouseWCX();
        var y = this._mCamera.MouseWCY();
        echo += "[" + x.toPrecision(2) + " " + y.toPrecision(2) + "]";
        
        if (this._mCurrentLine === null) { // start a new one
            this._mCurrentLine = new LineRenderable();           
            this._mCurrentLine.SetFirstVertex(x, y);
            this._mLineSet.push(this._mCurrentLine);        
        } else {
             this._mCurrentLine.SetSecondVertex(x, y);
        }
    } else {
        this._mCurrentLine = null;
        this._mP1 = null;
    }
    
    
    msg += echo;
    this._mMsg.SetText(msg);
};