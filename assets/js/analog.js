var gamepadAPI =
{
    controller: {},
    turbo: false,
    buttonsCache: [],
    buttonsStatus: [],
    axesStatus: [],

    buttons:
    [
        'X', 'A', 'B', 'Y',
        'Left Lower Trigger', 'Right Lower Trigger',
        'Left Upper Trigger', 'Right Upper Trigger',
        'Select', 'Start',
        'Left Stick', 'Right Stick'
    ],

    connect: function(evt)
    {
        gamepadAPI.controller = evt.gamepad;
        gamepadAPI.turbo = true;
        console.log('Gamepad connected.');
    },

    disconnect: function(evt)
    {
        gamepadAPI.turbo = false;
        delete gamepadAPI.controller;
        console.log('Gamepad disconnected.');
    },

    update: function()
    {
        // clear the buttons cache
        gamepadAPI.buttonsCache = [];

        // move the buttons status from the previous frame to the cache
        for(var k=0; k<gamepadAPI.buttonsStatus.length; k++)
        {
            gamepadAPI.buttonsCache[k] = gamepadAPI.buttonsStatus[k];
        }

        // clear the buttons status
        gamepadAPI.buttonsStatus = [];

        // get the gamepad object
        var c = gamepadAPI.controller || {};
      
        // loop through buttons and push the pressed ones to the array
        var pressed = [];
        if(c.buttons)
        {
            for(var b=0,t=c.buttons.length; b<t; b++)
            {
                if(c.buttons[b].pressed)
                {
                    pressed.push(gamepadAPI.buttons[b]);
                }
            }
        }

        // loop through axes and push their values to the array
        var axes = [];
        if(c.axes)
        {
            for(var a=0,x=c.axes.length; a<x; a++)
            {
                axes.push(c.axes[a].toFixed(2));
            }
        }

        // assign received values
        gamepadAPI.axesStatus = axes;
        gamepadAPI.buttonsStatus = pressed;

        // return buttons for debugging purposes
        return pressed;
    },
};

window.addEventListener("gamepadconnected", gamepadAPI.connect);
window.addEventListener("gamepaddisconnected", gamepadAPI.disconnect);

let leftAxis = document.getElementById("analog-left");
leftAxis.height = 256;
leftAxis.width  = 256;
leftCtx = leftAxis.getContext("2d");

let rightAxis = document.getElementById("analog-right");
rightAxis.height = 256;
rightAxis.width  = 256;
rightCtx = rightAxis.getContext("2d");

let buttonStatus = $("#button-status");
let axesStatus   = $("#axes-status");

setInterval(function()
{
    gamepadAPI.update();
    //console.log(gamepadAPI.axesStatus);
    //console.log(gamepadAPI.buttonsStatus);
    buttonStatus.text(gamepadAPI.buttonsStatus.toString());
    axesStatus.text(gamepadAPI.axesStatus.toString());

    //Get canvas height and width.
    let leftCanvasWidth  = leftAxis.clientWidth;
    let leftCanvasHeight = leftAxis.clientHeight;

    //Get left X-axis value.
    let leftXAxis = parseFloat(gamepadAPI.axesStatus[0]);
    leftXAxis *= 128;
    leftXAxis += 128;

    //Get left Y-axis value.
    let leftYAxis = parseFloat(gamepadAPI.axesStatus[1]);
    leftYAxis *= 128;
    leftYAxis += 128;

    leftCtx.beginPath();
    leftCtx.clearRect(0, 0, leftCanvasWidth, leftCanvasHeight);
    leftCtx.arc(leftXAxis, leftYAxis, 5, 0, 2 * Math.PI);
    leftCtx.stroke();

    //Get canvas height and width.
    let rightCanvasWidth  = rightAxis.clientWidth;
    let rightCanvasHeight = rightAxis.clientHeight;

    //Get right X-axis value.
    let rightXAxis = parseFloat(gamepadAPI.axesStatus[5]);
    rightXAxis *= 128;
    rightXAxis += 128;

    //Get right Y-axis value.
    let rightYAxis = parseFloat(gamepadAPI.axesStatus[2]);
    rightYAxis *= 128;
    rightYAxis += 128;

    rightCtx.beginPath();
    rightCtx.clearRect(0, 0, rightCanvasWidth, rightCanvasHeight);
    rightCtx.arc(rightXAxis, rightYAxis, 5, 0, 2 * Math.PI);
    rightCtx.stroke();
}, 17);

