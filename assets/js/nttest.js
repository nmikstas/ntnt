let ntEngine;
let playField   = [];
let nextPiece   = [];
let rowsToErase = [];
let isStarted   = false;
let animTimer;
let animCounter = 0;
let glueTimer;
let blocksTimer;
let blocksCounter = 0;
let blankBlocks = [];

/****************************************** Play Field *******************************************/

//Create 20 divs. with 10 spans each.
for(let i = 0; i < 20; i++)
{
    let thisRow = [];

    for(let j = 0; j < 10; j++)
    {
        let thisSpan = $("<span>");
        thisSpan.addClass("this-span");
        //thisSpan.text(j);
        thisRow.push(thisSpan);
    }

    playField.push(thisRow);
}

//Put the divs on the web page.
for(let i = playField.length - 1; i >= 0; i--)
{
    let rowP = $("<p>");
    rowP.addClass("this-p");
    rowP.text(i);

    let rowDiv = $("<div>");
    rowDiv.addClass("this-div");
    rowDiv.append(playField[i]);
    //rowDiv.append(rowP);
    $(".play-div").append(rowDiv);
}

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
        ntEngine.ntRequest(NTEngine.GR_RESET, 2);
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

/********************************************* Stats *********************************************/

//Create 4 divs. with 6 spans each.
for(let i = 0; i < 4; i++)
{
    let thisRow = [];

    for(let j = 0; j < 6; j++)
    {
        let thisSpan = $("<span>");
        thisSpan.addClass("next-span");
        thisRow.push(thisSpan);
    }

    nextPiece.push(thisRow);
}

//Put the divs on the web page.
for(let i = nextPiece.length - 1; i >= 0; i--)
{
    let rowDiv = $("<div>");
    rowDiv.addClass("this-div");
    rowDiv.append(nextPiece[i]);
    $(".next-div").append(rowDiv);
}

/****************************************** Animations *******************************************/

let addBlocksAnim = function()
{
    //Reset after add rows animation is complete.
    if(blocksCounter >= blankBlocks.length)
    {
        ntEngine.ntRequest(NTEngine.GR_RESUME_BLK);
        clearInterval(blocksTimer);
        document.addEventListener('keydown', logKey);
        document.addEventListener('keyup', doKeyUp);
        document.addEventListener('keydown', doKeyDown);
        blocksCounter = 0;
        blankBlocks = [];
        return;
    }

    for(let i = playField.length-1; i > 0; i--)
    {
        for(let j = 0; j < 10; j++)
        {
            let borderColor = playField[i-1][j].css("border-left-color");
            playField[i][j].css("background-color", playField[i-1][j].css("background-color"));
            playField[i][j].css("border-left-color", borderColor);
            playField[i][j].css("border-right-color", borderColor);
            playField[i][j].css("border-top-color", borderColor);
            playField[i][j].css("border-bottom-color", borderColor);
        }
    }

    for(let j = 0; j < 10; j++)
    {
        if(j === blankBlocks[blocksCounter])
        {
            playField[0][j].css("background-color", "rgb(0,0,0)");
            playField[0][j].css("border", "1px solid #000000");
        }
        else
        {
            playField[0][j].css("background-color", "rgb(116,116,116)");
            playField[0][j].css("border", "1px solid #666666");
        }        
    }

    blocksCounter++;
}

let eraseAnim = function()
{
    //Finish up the animation.
    if(animCounter >= 10)
    {
        ntEngine.ntRequest(NTEngine.GR_RESUME);
        clearInterval(animTimer);
        document.addEventListener('keydown', logKey);
        document.addEventListener('keyup', doKeyUp);
        document.addEventListener('keydown', doKeyDown);
        animCounter = 0;
        return;
    }

    for(let i = 0; i < rowsToErase.length; i++)
    {
        playField[rowsToErase[i]][animCounter].css("background-color", "rgb(0,0,0)");
        playField[rowsToErase[i]][animCounter].css("border", "1px solid #000000");
    }

    animCounter++;
}

let glueDelay = function()
{
    ntEngine.ntRequest(NTEngine.GR_RESUME);
    clearInterval(glueTimer);
    document.addEventListener('keydown', logKey);
    document.addEventListener('keyup', doKeyUp);
    document.addEventListener('keydown', doKeyDown);
}

/************************************** Rendering Function ***************************************/

//Render the play field.
let render = function(status)
{
    //console.log(status);
    let pieceNext  = status.pieceNext;
    let colors     = status.recommendedColors;
    let level      = status.currentLevel;
    let score      = status.currentScore;
    let request    = status.lastRequestStatus;
    let lines      = status.linesCleared;
    let gameStatus = status.gameStatus;
    rowsToErase    = status.rowsToErase;

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

    //Check if animation wait state.
    if(gameStatus === NTEngine.GS_WAIT)
    {
        document.removeEventListener('keydown', logKey);
        document.removeEventListener('keyup', doKeyUp);
        document.removeEventListener('keydown', doKeyDown);
        Key._pressed = [];

        if(status.rowsToErase.length > 0)
        {
            console.log("Erase " + status.rowsToErase.length + " rows");
            animCounter = 0;
            clearInterval(animTimer);
            animTimer = setInterval(function(){eraseAnim()}, 50);
        }
        else
        {
            clearInterval(glueTimer);
            glueTimer = setInterval(function(){glueDelay()}, 100);
        }
        return;
    }

    //Clear the old colors.
    $(".next-span").css("background-color", colors[0]);

    //Exit if the game is over.
    if(gameStatus === NTEngine.GS_OVER && !isStarted) return;

    //Render the next piece only if game is not paused.
    if(gameStatus !== NTEngine.GS_PAUSE)
    {
        switch(pieceNext)
        {
            case NTEngine.PIECE_T:
                nextPiece[1][3].css("background-color", colors[1]);
                nextPiece[2][3].css("background-color", colors[1]);
                nextPiece[2][4].css("background-color", colors[1]);
                nextPiece[2][2].css("background-color", colors[1]);
                break;

            case NTEngine.PIECE_BKL:
                nextPiece[1][4].css("background-color", colors[2]);
                nextPiece[2][4].css("background-color", colors[2]);
                nextPiece[2][3].css("background-color", colors[2]);
                nextPiece[2][2].css("background-color", colors[2]);
            break;

            case NTEngine.PIECE_Z:
                nextPiece[1][3].css("background-color", colors[3]);
                nextPiece[2][3].css("background-color", colors[3]);
                nextPiece[1][4].css("background-color", colors[3]);
                nextPiece[2][2].css("background-color", colors[3]);
                break;

            case NTEngine.PIECE_SQR:
                nextPiece[1][2].css("background-color", colors[1]);
                nextPiece[1][3].css("background-color", colors[1]);
                nextPiece[2][2].css("background-color", colors[1]);
                nextPiece[2][3].css("background-color", colors[1]);
                break;

            case NTEngine.PIECE_S:
                nextPiece[1][2].css("background-color", colors[2]);
                nextPiece[1][3].css("background-color", colors[2]);
                nextPiece[2][3].css("background-color", colors[2]);
                nextPiece[2][4].css("background-color", colors[2]);
                break;

            case NTEngine.PIECE_L:
                nextPiece[1][2].css("background-color", colors[3]);
                nextPiece[2][2].css("background-color", colors[3]);
                nextPiece[2][3].css("background-color", colors[3]);
                nextPiece[2][4].css("background-color", colors[3]);
                break;

            default:
                nextPiece[1][1].css("background-color", colors[1]);
                nextPiece[1][2].css("background-color", colors[1]);
                nextPiece[1][3].css("background-color", colors[1]);
                nextPiece[1][4].css("background-color", colors[1]);
                break;
        }
    }

    //Remove any borders on next piece blocks.
    $(".next-span").css("border", "0");

    //Add borders on next piece colored blocks.
    for(let i = 0; i < nextPiece.length; i++)
    {
        for(let j = 0; j < nextPiece[i].length; j++)
        {
            let color = nextPiece[i][j].css( "background-color" );
            if(color !== "rgb(0, 0, 0)")
            {
                nextPiece[i][j].css("border", "1px solid #666666");
            }
            else
            {
                nextPiece[i][j].css("border", "1px solid #000000");
            }
        }
    }

    //Render the game field.
    let field;
    if(gameStatus !== NTEngine.GS_WAIT_BLK)
    {
        field = status.gameField;
    }
    else
    {
        field = ntEngine.ntGetGameField();
    }
    
    for(let i = 0; i < 20; i++)
    {
        for(let j = 0; j < 10; j++)
        {
            //Render the play field only if the game is not paused.
            playField[i][j].css("background-color", gameStatus !== NTEngine.GS_PAUSE ?
                colors[field[i][j]] : "rgb(0, 0, 0)");
        }
    }

    //Remove any borders on game field blocks.
    $(".this-span").css("border", "1px solid #000000");

    //Add borders on game field colored blocks.
    for(let i = 0; i < playField.length; i++)
    {
        for(let j = 0; j < playField[i].length; j++)
        {
            let color = playField[i][j].css( "background-color" );
            if(color !== "rgb(0, 0, 0)")
            {
                playField[i][j].css("border", "1px solid #666666");
            }
        }
    }

    //Indicate the game is paused.
    if(gameStatus === NTEngine.GS_PAUSE)
    {
        let pauseText = $("<h1>");
        pauseText.addClass("pause-text");
        pauseText.text("PAUSED");
        playField[10][2].append(pauseText);
    }
    else
    {
        $(".this-span").empty();
    }

    //Check if block add wait state,
    if(gameStatus === NTEngine.GS_WAIT_BLK)
    {
        document.removeEventListener('keydown', logKey);
        document.removeEventListener('keyup', doKeyUp);
        document.removeEventListener('keydown', doKeyDown);
        Key._pressed = [];

        blankBlocks = status.blanks;
        clearInterval(blocksTimer);
        blocksTimer = setInterval(function(){addBlocksAnim()}, 50);
        return;
    }

}

/****************************************** Game Engine ******************************************/

//Instantiate the game engine.
ntEngine = new NTEngine(255000255, render);






