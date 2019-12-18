/******************************* Seedable random number generator ********************************/

function Random(seed)
{
    this._seed = seed % 2147483647;
    if (this._seed <= 0) this._seed += 2147483646;
}
  
Random.prototype.next = function()
{
    return this._seed = this._seed * 16807 % 2147483647;
};
  
Random.prototype.nextFloat = function()
{
    // We know that result of next() will be 1 to 2147483646 (inclusive).
    return (this.next() - 1) / 2147483646;
};

/*************************************************************************************************/

let playField = [];

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

let ntEngine = new NTEngine(0, 255, null);
let rnd = new Random(255);
rnd.next();
rnd.next();
rnd.next();

//Test the RNG.
for(let i = 0; i < 20; i++)
{
    console.log("Function random: " + rnd.next() % 7);
    console.log("NTEngine random: " + ntEngine.ntNext());
    console.log("*********************************");
}

//Check the color pallette.
for(let i = 0; i < 20; i++)
{
    for(let j = 0; j < 10; j++)
    {
        playField[i][j].css("background-color", ntEngine.levelColors(i)[j % 5]);
    }
}



