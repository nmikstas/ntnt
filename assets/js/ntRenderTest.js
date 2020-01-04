let ntEngine;

/*************************************** Button Listeners ****************************************/

$( document ).ready(function()
{
    $("#start-btn").on("click", function()
    {
        ntEngine.ntRequest(NTEngine.GR_RESET, 0);
        isStarted = true;
    });

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

/************************************** Game Stats Callback **************************************/

let showStats = (level, score, lines, gameStatus, request) =>
{
    //Append all the stats.
    $("#h-score").text("Score: " + score);
    $("#h-level").text("Level: " + level);
    $("#h-lines").text("Lines: " + lines);

    //Show last request status.
    switch(request)
    {
        case NTEngine.LRS_NONE:
            $("#h-request").text("Last Request: None");
            break;

        case NTEngine.LRS_ACCEPT:
            $("#h-request").text("Last Request: Accepted");
            break;

        default:
            $("#h-request").text("Last Request: Rejected");
            break;
    }

    //Show game status
    switch(gameStatus)
    {
        case NTEngine.GS_OVER:
            $("#h-status").text("Game Status: Game Over");
            break;

        case NTEngine.GS_PLAY:
            $("#h-status").text("Game Status: Playing");
            break;

        case NTEngine.GS_PAUSE:
            $("#h-status").text("Game Status: Paused");
            break;

        default:
            $("#h-status").text("Game Status: Animation Wait");
            break;
    }
}

/*********************************** Game Engine And Renderer ************************************/

//Create a new NT game renderer.
let renderer = new NTRender(showStats);

//Create a new game engine.
ntEngine = new NTEngine(255000255, renderer.gfRender);

//Used to hide play piece during animations.
let getField = () => { return ntEngine.ntGetGameField(); }

//Input control module.
let input = new NTInput
(
    ntEngine.ntRequest,
    //engineRequest, 
    /*{
        downBtn:   .14,
        downIndex: 9,
        downType:  NTInput.IT_GAMEPAD_DPAD,

        cwBtn:     1,
        cwIndex:   0,
        cwType:    NTInput.IT_GAMEPAD_DIGITAL,

        ccwBtn:     2,
        ccwIndex:   0,
        ccwType:    NTInput.IT_GAMEPAD_DIGITAL,

        pauseBtn:   9,
        pauseIndex: 0,
        pauseType:  NTInput.IT_GAMEPAD_DIGITAL,

        leftBtn:    .71,
        leftIndex:  9,
        leftType:   NTInput.IT_GAMEPAD_DPAD,

        rightBtn:   -.43,
        rightIndex: 9,
        rightType:  NTInput.IT_GAMEPAD_DPAD,
    }*/
    {
        downBtn:   13,
        downIndex: 9,
        downType:  NTInput.IT_GAMEPAD_DIGITAL,

        cwBtn:     1,
        cwIndex:   0,
        cwType:    NTInput.IT_GAMEPAD_DIGITAL,

        ccwBtn:     0,
        ccwIndex:   0,
        ccwType:    NTInput.IT_GAMEPAD_DIGITAL,

        pauseBtn:   9,
        pauseIndex: 0,
        pauseType:  NTInput.IT_GAMEPAD_DIGITAL,

        leftBtn:    14,
        leftIndex:  9,
        leftType:   NTInput.IT_GAMEPAD_DIGITAL,

        rightBtn:   15,
        rightIndex: 9,
        rightType:  NTInput.IT_GAMEPAD_DIGITAL,
    }
);

//Allows inputs to be disabled during animations.
renderer.enableInputCallback = input.enableInputs;

//----------------- Game Field ------------------
//Get canvas to render the game field on.
let canvas = document.getElementById("renderCanvas");

//Create a new babylon engine.
let engine = new BABYLON.Engine(canvas, true);

//Call the createScene function.
let scene = renderer.gfCreateScene();

//Register a Babylon render loop to repeatedly render the scene.
engine.runRenderLoop(function () { scene.render(); });

//Watch for browser/canvas resize events.
window.addEventListener("resize", function () { engine.resize(); });

//----------------- Next Piece ------------------
//Get canvas to render the next piece on.
let npCanvas = document.getElementById("pieceCanvas");

//Create a new babylon engine.
let npEngine = new BABYLON.Engine(npCanvas, true);

//Call the createScene function.
let npScene = renderer.npCreateScene();

//Register a Babylon render loop to repeatedly render the scene.
npEngine.runRenderLoop(function () { npScene.render(); });

//Watch for browser/canvas resize events.
window.addEventListener("resize", function () { npEngine.resize(); });
