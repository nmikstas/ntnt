let ntEngine;
let ntRenderer;
let ntInput;
let configCallback;
let startLevel = 0;
let selectedId = 0;

/*************************************** Button Listeners ****************************************/

$( document ).ready(function()
{
    $("#start-btn").on("click", function()
    {
        ntEngine.ntRequest(NTEngine.GR_RESET, startLevel);
        isStarted = true;
    });

    $("#line-23").on("click", function()
    {
        ntEngine.ntRequest(NTEngine.GR_ADD_LINES, .23);
    });

    $("#line-1").on("click", function()
    {
        ntEngine.ntRequest(NTEngine.GR_ADD_LINES, 1);
    });

    $("#line-2").on("click", function()
    {
        ntEngine.ntRequest(NTEngine.GR_ADD_LINES, 2);
    });

    $("#line-5").on("click", function()
    {
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

    $(".img-container").on("click", function()
    {
        startLevel = $(this).attr("id");
        $("#" + selectedId).removeClass("selected-img-container");
        $("#" + selectedId).addClass("notSelected-img-container");
        selectedId = $(this).attr("id");
        $(this).removeClass("notSelected-img-container");
        $(this).addClass("selected-img-container");

        console.log(startLevel)
    });

    $(".config").on("click", function(event)
    {
        //Get which button needs to be configured.
        let button = $(this).attr("id");
        let configBtn;
        let status;

        switch(button)
        {
            case "left-btn":
                configBtn = NTInput.IN_LEFT;
                status = "left-status";
                break;
            case "right-btn":
                configBtn = NTInput.IN_RIGHT;
                status = "right-status";
                break;
            case "down-btn":
                configBtn = NTInput.IN_DOWN;
                status = "down-status";
                break;
            case "rotate-cw-btn":
                configBtn = NTInput.IN_ROTATE_CW;
                status = "rotate-cw--status";
                break;
            case "rotate-ccw-btn":
                configBtn = NTInput.IN_ROTATE_CCW;
                status = "rotate-ccw-status";
                break;
            default:
                configBtn = NTInput.IN_PAUSE;
                status = "pause-status";
                break;
        }

        if($(this).attr("data") === "change")
        {
            //Override any active configs happening.
            $("#down-btn").attr("data", "change");
            $("#down-btn").text("Change");
            $("#left-btn").attr("data", "change");
            $("#left-btn").text("Change");
            $("#right-btn").attr("data", "change");
            $("#right-btn").text("Change");
            $("#pause-btn").attr("data", "change");
            $("#pause-btn").text("Change");
            $("#rotate-cw-btn").attr("data", "change");
            $("#rotate-cw-btn").text("Change");
            $("#rotate-ccw-btn").attr("data", "change");
            $("#rotate-ccw-btn").text("Change");

            $(this).attr("data", "cancel");
            ntInput.configInput(configBtn, configCallback);
            $(this).text("Cancel");

            $("#" + status).css("color", "#ffff00");
            $("#" + status).text("Listening");
        }
        else
        {
            $(this).attr("data", "change");
            ntInput.cancelConfig();
            $(this).text("Change");

            $("#" + status).css("color", "#0000ff");
            $("#" + status).text("Ready");
        }
    });
});

/************************************** Disable Key Scrolling **************************************/

window.addEventListener("keydown", function(e)
{
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1)
    {
        e.preventDefault();
    }
}, false);

/************************************ Configuration Callback *************************************/

configCallback = (input, type, value, status) =>
{
    let inputType;
    let inputId;

    switch(input)
    {
        case NTInput.IN_LEFT:
            inputId = "left";
            break;
        case NTInput.IN_RIGHT:
            inputId = "right";
            break;
        case NTInput.IN_ROTATE_CW:
            inputId = "rotate-cw";
            break;
        case NTInput.IN_ROTATE_CCW:
            inputId = "rotate-ccw";
            break;
        case NTInput.IN_DOWN:
            inputId = "down";
            break;
        default:
            inputId = "pause";
            break;
    }

    switch(type)
    {
        case NTInput.IT_GAMEPAD_ANALOG:
            inputType = "Stick";
            break;
        case NTInput.IT_GAMEPAD_DIGITAL:
            inputType = "Btn";
            break;
        case NTInput.IT_GAMEPAD_DPAD:
            inputType = "Pad";
            break;
        default:
            inputType = "Key";
            break;
    }

    if(status)
    {
        $("#" + inputId + "-status").text("Input already used");
        $("#" + inputId + "-status").css("color", "#ff0000");
    }
    else
    {
        $("#" + inputId + "-status").text("Input changed");
        $("#" + inputId + "-status").css("color", "#00ff00");
        $("#" + inputId + "-input").text(inputType + " " + value);
    }

    $("#" + inputId + "-btn").text("Change");
    $("#" + inputId + "-btn").attr("data", "change");
}

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


let renderHandler = (status) =>
{
    ntRenderer.gfRender(status);
}

/*********************************** Game Engine And Renderer ************************************/

//Create a new NT game renderer.
ntRenderer = new NTRender(showStats);

//Create a new game engine.
ntEngine = new NTEngine(123456789, renderHandler);

//Tie the renderer to the game engine.
ntRenderer.ntEngine = ntEngine;

//Used to hide play piece during animations.
ntRenderer.getField = () => { return ntEngine.ntGetGameField(); }

//Input control module.
ntInput = new NTInput((request, param) => ntEngine.ntRequest(request, param));

//Allows inputs to be disabled during animations.
ntRenderer.enableInputCallback = (en) => {ntInput.enableInputs(en)};

//----------------- Game Field ------------------
//Get canvas to render the game field on.
let canvas = document.getElementById("renderCanvas");

//Create a new babylon engine.
let engine = new BABYLON.Engine(canvas, true);

//Call the createScene function.
let scene = ntRenderer.gfCreateScene(engine, canvas);

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
let npScene = ntRenderer.npCreateScene(npEngine);

//Register a Babylon render loop to repeatedly render the scene.
npEngine.runRenderLoop(function () { npScene.render(); });

//Watch for browser/canvas resize events.
window.addEventListener("resize", function () { npEngine.resize(); });

/*
//Create a new NT game renderer.
ntRenderer = new NTRender(showStats);

//Create a new game engine.
ntEngine = new NTEngine(255000255, ntRenderer.gfRender);

//Used to hide play piece during animations.
let getField = () => { return ntEngine.ntGetGameField(); }

//Input control module.
ntInput = new NTInput(ntEngine.ntRequest);

//Allows inputs to be disabled during animations.
ntRenderer.enableInputCallback = ntInput.enableInputs;

//----------------- Game Field ------------------
//Get canvas to render the game field on.
let canvas = document.getElementById("renderCanvas");

//Create a new babylon engine.
let engine = new BABYLON.Engine(canvas, true);

//Call the createScene function.
let scene = ntRenderer.gfCreateScene();

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
let npScene = ntRenderer.npCreateScene();

//Register a Babylon render loop to repeatedly render the scene.
npEngine.runRenderLoop(function () { npScene.render(); });

//Watch for browser/canvas resize events.
window.addEventListener("resize", function () { npEngine.resize(); });
*/
