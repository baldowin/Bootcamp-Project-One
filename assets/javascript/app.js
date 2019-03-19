$(document).ready(function(){

window.onload = function(){
     $(".gameArea").hide(); //hide game. Email info will show.
     $("#beginGame").hide();
     $(".gameInstructions").hide();
     $(".entryForm").show();
     $("#submitInfo").on("click", instructions) //user clicks Submit
};


function instructions(){
    $(".entryForm").hide();
    $(".gameInstructions").show();
};

    $("#instructions").on("click", beginGame)

function beginGame(){
    $(".gameInstructions").hide();
    $(".gameArea").show();


};

});