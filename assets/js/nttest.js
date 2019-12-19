let playField = [];
let nextPiece = [];

/****************************************** Play Field *******************************************/

//Create 20 divs. with 10 spans each.
for(let i = 0; i < 20; i++)
{
    let thisRow = [];

    for(let j = 0; j < 10; j++)
    {
        let thisSpan = $("<span>");
        thisSpan.addClass("this-span");
        thisSpan.text(j);
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
    rowDiv.append(rowP);
    $(".play-div").append(rowDiv);
}

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

/************************************** Rendering Function ***************************************/

//Render the play field.
let render = function(status)
{
    //console.log(status);
    let pieceNext = status.pieceNext;
    let colors = status.recommendedColors;
    let level = status.currentLevel;
    let score = status.currentScore;
    let request = status.lastRequestStatus;
    let lines = status.linesCleared;
    let gameStatus = status.gameStatus;

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
    
    //Clear the old colors.
    $(".next-span").css("background-color", colors[0]);

    //Exit if the game is over.
    if(gameStatus === NTEngine.GS_OVER) return;

    //Render the next piece.
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

    //Render the game field.
    let field = status.gameField;
    for(let i = 0; i < 20; i++)
    {
        for(let j = 0; j < 10; j++)
        {
            let colorPalette = ntEngine.levelColors(0);
            playField[i][j].css("background-color", colorPalette[field[i][j]]);
        }
    }

}

/**************************************** Keyboard Input *****************************************/

let logKey = function(e)
{
    if(e.key.toLowerCase() === "k" && !e.repeat)
    {
        console.log("Rotate CCW");
    }

    if(e.key.toLowerCase() === "l" && !e.repeat)
    {
        console.log("Rotate CW");
    }

    if(e.key.toLowerCase() === "p" && !e.repeat)
    {
        console.log("Toggle Pause");
    }

    if(e.key.toLowerCase() === "r" && !e.repeat)
    {
        console.log("Reset Game");
        ntEngine.ntRequest(NTEngine.GR_RESET, 0);
    }

    if(e.key === "ArrowLeft")
    {
        console.log("Move Left");
        ntEngine.ntRequest(NTEngine.GR_LEFT);
    }

    if(e.key === "ArrowRight")
    {
        console.log("Move Right");
        ntEngine.ntRequest(NTEngine.GR_RIGHT);
    }
}

document.addEventListener('keydown', logKey);

var Key =
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
  
window.addEventListener('keyup', function(event)
{
    Key.onKeyup(event);
});

window.addEventListener('keydown', function(event)
{
    Key.onKeydown(event);
});

//Special listener for key down.
setInterval(function()
{
    if (Key.isDown(Key.DOWN))
    {
        ntEngine.ntRequest(NTEngine.GR_DOWN);
    }
}, 17);

/****************************************** Game Engine ******************************************/

//Instantiate the game engine.
let ntEngine = new NTEngine(255, render);






