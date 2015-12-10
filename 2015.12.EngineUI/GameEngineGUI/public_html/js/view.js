//$(document).ready(function(){


//These global variable are bad practice I did it to make it easier to learn
//with the intention of removing them 

//this is a reference to the currently selected list item on the left hand side
//in html
var selectedListItem = null;

//this is the actual game object from the game engine. Is is accociated with the 
//above list item for updating when the user makes changes
var selectedGameObj = null;

// these two objects are panels on the right side. You can swap between the two
// depending on which type of object is selected. 
var objEditPanel = null;
var cameraEditPanel = null;

var GlobalCamera = null;


//Below are JQuery events that get called from user-html interaction
//$(html element).eventType(function to be called)
//----------------------------------------------------------------------------

//play button on the top, right now it doesn't do anything
$( "#playbtn" ).click(function() {
  //gEngine.GameLoop.stop();
});


//creates a game engine object and dynamically adds html so it displays it 
//in the list
$( "#newobject" ).click(function() {
    var defaultObjectName = 'GameObj' + GlobalCounter;
    createDefaultGameObj(defaultObjectName);
    
    $( "#objectlist" ).append(
            '<a href="#" class="list-group-item">'
            + defaultObjectName +
            '</a>'
            );

    GlobalCounter++;

});

//swaps the panel from the game object type to the camera type
$( "#cameraEdit" ).click(function() {
    cameraEditPanel.setVisible(true);
    objEditPanel.setVisible(false);

});


//This is probably the most confusing function

//Event gets called when any html <div> element gets clicked
//it further filters based on having a child html element that is of type <a>
//with a css class that is a list-group-item
$( 'div' ).on('click', 'a.list-group-item', function() {
    
    //in JQuery you get access to the html item based on the 'this' keyword
    //in this case we get the DOM element that was clicked on
    
    if(selectedListItem === this){
        //dont do anything if we clicked on an already selected item
        return;
    }
    
    //remove all html elements with the css class of .delete
    $('.delete').remove();
    //make it so the text boxes are no longer grayed out
    $("input").prop('disabled', false);
    //change the style of the deselected item to the generic list item style
    $(selectedListItem).attr('class','list-group-item' );
    
    //swap to the newly selected item
    selectedListItem = this;
    
    //we know we have selected a game object, make sure the camera panel isn't
    //showing
    cameraEditPanel.setVisible(false);
    objEditPanel.setVisible(true);
    
    //this creates the little buttons under the selected item
    //right now those buttons don't do anything
    $(selectedListItem).append(
           '<div class="delete">'
            + '<button class="btn-primary">'
            + '<span class="glyphicon glyphicon-copy"></span>'  
            + '</button>'
            + '<button class="btn-danger">'
            + '<span class="glyphicon glyphicon-trash"></span>'  
            + '</button>'
            + '</div>'
            ); 
    
    //we now are getting the game object that will be updated if the
    //user changes anything in the edit panel
    //the game object and the list item are connected by the name 
    selectedGameObj = findObjectByName($(selectedListItem).text().trim());
    
    //changed the style of the newly selected item to show that it is different
    //from the rest
    $(this).attr('class','list-group-item list-group-item-info' );
    
    //get the game object attributes and update the edit view
    if(selectedGameObj !== null){
        var xform = selectedGameObj.getXform();
        
        var name = selectedGameObj.getName();
        var x = xform.getXPos();
        var y = xform.getYPos();
        var rotation = xform.getRotationInDegree();
        var width = xform.getWidth();
        var height = xform.getHeight();
        var alpha = selectedGameObj.getColor()[3];
        
        updateEditView(name,x,y,rotation,width,height,alpha);
    }

});


//update game object from edit view after the user has changed 
//any of it's values

//this event gets called after a textbox (html input) has been selected
//and then deselected

//Example: the user clicked the textbox and then hit tab, the event will get
//called after the tab because it has been "focused out" 

//Notice I'm using the .on syntax for dynamic html
$( 'div' ).on('focusout','.form-control', function() {
    
    if(selectedGameObj !== null){

        //get all of the values from the panel
        var enteredName = objEditPanel.getComponentVal('Name');
        var enteredX = objEditPanel.getComponentVal('XPos');
        var enteredY = objEditPanel.getComponentVal('YPos');
        var enteredRot = objEditPanel.getComponentVal('Rotation');
        var enteredW = objEditPanel.getComponentVal('Width');
        var enteredH = objEditPanel.getComponentVal('Height');
      
        var xform = selectedGameObj.getXform();
        
        //update the selected game object based on the new values
        //it updates the value even if nothing changed 
        selectedGameObj.setName(enteredName);
        xform.setXPos(enteredX);
        xform.setYPos(enteredY);
        xform.setRotationInDegree(enteredRot);
        xform.setWidth(enteredW);
        xform.setHeight(enteredH);
        
        //update the html display name
        //on the left hand panel
        $(selectedListItem).text(enteredName);

    }
    
});


//color picker object sends an event every time its color is changed 
//This is no longer being used but shows how easy it is to use JQuery widgets
$('#colorPicker').colorpicker().on('changeColor.colorpicker', function(event){

    var color = event.color.toRGB();
    var hexColor = event.color.toHex(); //required for setting the colorpicker value
    
    var red = color['r']/255;
    var green = color['g']/255;
    var blue = color['b']/255;
    var alpha = selectedGameObj.getColor()[3];

     if(selectedGameObj !== null){
         selectedGameObj.setColor([red,green,blue,alpha]);
         selectedGameObj.setHexColor(hexColor);
     }
    
});
// End JQuery Events-----------------------------------------------------------

//gets the camera from my game an registers it globally for the 
//Game engine GUI 
var registerMainCamera = function(aCamera){
    GlobalCamera = aCamera;
};

var createDefaultGameObj = function (defaultName){
    var renderable = new Renderable();
    selectedGameObject = new GameObject(renderable);
    selectedGameObject.setColor([1,0,0,1]);    
    selectedGameObject.setHexColor("#ff0000");
    selectedGameObject.setName(defaultName);
    selectedGameObject.getXform().setPosition(20, 60);
    selectedGameObject.getXform().setSize(5,5);
    selectedGameObject.getXform().setRotationInDegree(20);
    
    Global_ObjectList.addToSet(selectedGameObject);   
    
};


var findObjectByName = function(name){
    var i;
    for(i = 0; i < Global_ObjectList.size(); i++){
        if(Global_ObjectList.getObjectAt(i).getName() === name){
            return Global_ObjectList.getObjectAt(i);
        }
    }
    return null;
};

function precise_round(num,decimals){
    var sign = num >= 0 ? 1 : -1;
    return (Math.round((num*Math.pow(10,decimals))+(sign*0.001))/Math.pow(10,decimals)).toFixed(decimals);
}

//this only updates the edit view if a game object is selected
//I need to make it more generic so any panel type can be selected and 
//updated with this function
var updateEditView = function(name,x,y,rotation,w,h,a){
    var tempX = precise_round(x,2);
    var tempY = precise_round(y,2);
    var tempRot = precise_round(rotation,2);
    var tempW = precise_round(w,2);
    var tempH = precise_round(h,2);
    
    objEditPanel.updateComponent('Name',name);
    objEditPanel.updateComponent('XPos',tempX);
    objEditPanel.updateComponent('YPos',tempY);
    objEditPanel.updateComponent('Rotation',tempRot);
    objEditPanel.updateComponent('Width',tempW);
    objEditPanel.updateComponent('Height',tempH); 
    
};


//this gets called after the webpage has finished loading
$(document).ready(function(){
    initialzeView();
});


//I'm bacially using this as a constructor
var initialzeView = function(){
    
    //these panels attach to the html ID 'panelStub'
    //go look for it in the index.html
    objEditPanel = new EditorPanel('panelStub');
    
    objEditPanel.createComponent('Name');
    objEditPanel.createComponent('XPos');
    objEditPanel.createComponent('YPos');
    objEditPanel.createComponent('Rotation');
    objEditPanel.createComponent('Width');
    objEditPanel.createComponent('Height'); 
    objEditPanel.setVisible(true);
    
    
    cameraEditPanel = new EditorPanel('panelStub');
    cameraEditPanel.createComponent('example');
    cameraEditPanel.createComponent('not hooked up');
    cameraEditPanel.setVisible(false);
    
    //not really being used anymore I got it working in an earlier version
    //google bootstrap color picker for documentation on the widget
    $(function(){
        $('#colorPicker').colorpicker({format:'rgba'});
    });
    
    //this "grays out" any html input objects on init
    //we dont want the user to be able to edit something when nothing is 
    //currently selected
    $("input").prop('disabled', true);
};

