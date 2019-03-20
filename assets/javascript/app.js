
$(document).ready(function(){

window.onload = function(){
     $(".gameArea").hide(); //hide game. Email info will show.
     $(".gameInstructions").hide();
     $(".entryForm").show(); 
     $("#submitInfo").on("click", function(event){
         event.preventDefault();
                 instructions()
     }) //user clicks Submit
     $("#instructions").on("click", beginGame)
     console.log();
};


function instructions(){
    $(".entryForm").hide()
        $(".gameInstructions").show();
};


function beginGame(){
    $(".gameInstructions").hide();
    $(".gameArea").show();
};

});
var stock="aapl";
var api="FP8BK7QFX0CXDD9P";
var open=[];
var close=[];
var high=[];
var low=[];
var date=[];
var indexes=[];
var i=0;
var obj; 
var napi="7ba42f39aff0466dae6b8019f2feebf5";
var articleDate="2019-02-20";
$.ajax({
    url:"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+stock+"&interval=5min&outputsize=full&apikey="+api,
    method:"GET"
}).then(function(response){
    var dates =response["Time Series (5min)"]
    $.each(response["Time Series (5min)"],function(day){
        var x = dates[day]
        date.push(day);
        open.push(x["1. open"]);
        high.push(x["2. high"]);
        low.push(x["3. low"]);
        close.push(x["4. close"]);
        if(day.split(" ")[1]==="09:35:00"){
            indexes.push(i);;
        }
        i++;
    });
    console.log(obj);
     $.ajax({
         url:"https://newsapi.org/v2/everything?q="+stock+"&to="+articleDate+"&from="+articleDate+"&apiKey="+napi,
         method:"GET"
     }).then(function(response){
         console.log(response);
     })
     obj={
        stock:stock,
        startofDayIndex:indexes,
        timeArr:date,
        highs:high,
        lows:low,
        opens:open,
        closes:close,
        articles:response.articles
    }
})
