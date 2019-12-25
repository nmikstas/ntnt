let ntEngine;

/**************************************** Keyboard Input *****************************************/

let logKey = function(e)
{
    if(e.key.toLowerCase() === "k" && !e.repeat)
    {
        //console.log("Rotate CCW");
        ntEngine.ntRequest(NTEngine.GR_ROTATE_CCW);
    }

    if(e.key.toLowerCase() === "l" && !e.repeat)
    {
        //console.log("Rotate CW");
        ntEngine.ntRequest(NTEngine.GR_ROTATE_CW);
    }

    if(e.key.toLowerCase() === "p" && !e.repeat)
    {
        //console.log("Toggle Pause");
        ntEngine.ntRequest(NTEngine.GR_PAUSE);
    }

    if(e.key.toLowerCase() === "r" && !e.repeat)
    {
        //console.log("Reset Game");
        ntEngine.ntRequest(NTEngine.GR_RESET, 9);
        isStarted = true;
    }

    if(e.key === "ArrowLeft")
    {
        //console.log("Move Left");
        ntEngine.ntRequest(NTEngine.GR_LEFT);
    }

    if(e.key === "ArrowRight")
    {
        //console.log("Move Right");
        ntEngine.ntRequest(NTEngine.GR_RIGHT);
    }
}

let Key =
{
    _pressed: {},
  
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    
    isDown: function(keyCode)
    {
        return this._pressed[keyCode];
    },
    
    onKeydown: function(event)
    {
        this._pressed[event.keyCode] = true;
    },
    
    onKeyup: function(event)
    {
        delete this._pressed[event.keyCode];
    }
};

let doKeyUp = function()
{
    Key.onKeyup(event);
}

let doKeyDown = function()
{
    Key.onKeydown(event);
}

document.addEventListener('keydown', logKey);
document.addEventListener('keyup', doKeyUp);
document.addEventListener('keydown', doKeyDown);

//Special listener for key down.
setInterval(function()
{
    if (Key.isDown(Key.DOWN))
    {
        ntEngine.ntRequest(NTEngine.GR_DOWN);
    }
}, 17);

/*************************************** Button Listeners ****************************************/

$( document ).ready(function()
{
    $("#line-23").on("click", function()
    {
        //console.log("Add .23 line");
        ntEngine.ntRequest(NTEngine.GR_ADD_LINES, .23);
    });

    $("#line-1").on("click", function()
    {
        //console.log("Add 1 line");
        ntEngine.ntRequest(NTEngine.GR_ADD_LINES, 1);
    });

    $("#line-2").on("click", function()
    {
        //console.log("Add 2 lines");
        ntEngine.ntRequest(NTEngine.GR_ADD_LINES, 2);
    });

    $("#line-5").on("click", function()
    {
        //console.log("Add 5 lines");
        ntEngine.ntRequest(NTEngine.GR_ADD_LINES, 5);
    });

    $("#line-10").on("click", function()
    {
        //console.log("Add 10 lines");
        ntEngine.ntRequest(NTEngine.GR_ADD_LINES, 10);
    });

    $("#line-18").on("click", function()
    {
        //console.log("Add 18 lines");
        ntEngine.ntRequest(NTEngine.GR_ADD_LINES, 18);
    });

    $("#line-25").on("click", function()
    {
        //console.log("Add 25 lines");
        ntEngine.ntRequest(NTEngine.GR_ADD_LINES, 25);
    });

    $("#seed-btn").on("click", function(event)
    {
        event.preventDefault();

        let seedValue = parseInt($("#seed-text").val().trim());
        
        if(isNaN(seedValue))
        {
            $("#seed-text").val("");
            return;
        }

        console.log("Reseed Value: " + seedValue);
        ntEngine.ntRequest(NTEngine.GR_RESEED, seedValue);
    });
});

/*********************************** Game Engine And Renderer ************************************/

//Get canvas to render the game field on.
let canvas = document.getElementById("renderCanvas");

//Create a new babylon engine.
let engine = new BABYLON.Engine(canvas, true, { stencil: true });

//Create a new NT game renderer.
let renderer = new NTRender();

//Call the createScene function.
var scene = renderer.gfCreateScene(); 

//Register a Babylon render loop to repeatedly render the scene.
engine.runRenderLoop(function () { scene.render(); });

//Watch for browser/canvas resize events.
window.addEventListener("resize", function () { engine.resize(); });

//Create a new game engine.
ntEngine = new NTEngine(255000255, renderer.gfRender);






