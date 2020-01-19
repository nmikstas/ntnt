
let ntRequest = (updateRequext) =>
{
    if(updateRequext === NTInput.IN_DOWN)
    {
        $("#down-span").text("Fired");
    }

    if(updateRequext === NTInput.IN_ROTATE_CW)
    {
        $("#rotate-cw-span").text("Fired");
    }

    if(updateRequext === NTInput.IN_ROTATE_CCW)
    {
        $("#rotate-ccw-span").text("Fired");
    }

    if(updateRequext === NTInput.IN_PAUSE)
    {
        $("#pause-span").text("Fired");
    }

    if(updateRequext === NTInput.IN_LEFT)
    {
        $("#left-span").text("Fired");
    }

    if(updateRequext === NTInput.IN_RIGHT)
    {
        $("#right-span").text("Fired");
    }
}

$(document).ready(function()
{

    //Create a new NT game renderer.
    let input = new NTInput
    (
        ntRequest, 
        {
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
        }
    );

    console.log(input.leftBtn);
    console.log(input.rightBtn);   
    console.log(input.downBtn);
    console.log(input.cwBtn);
    console.log(input.ccwBtn);
    console.log(input.pauseBtn);

    setInterval(function()
    {
        console.log(input.buttonsStatus);
        console.log(input.axesStatus);
        console.log(input.keysPressed);
        console.log(input.dPads);
        console.log("******************");

        $("#down-span").text("-");
        $("#rotate-cw-span").text("-");
        $("#rotate-ccw-span").text("-");
        $("#pause-span").text("-");
        $("#left-span").text("-");
        $("#right-span").text("-");

    }, 100);

   

});

