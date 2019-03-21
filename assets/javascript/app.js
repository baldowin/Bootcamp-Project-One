
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAArjUrbj3qORhaQ4TjdJ3tDnqBYoCoICo",
    authDomain: "risky-business-ef812.firebaseapp.com",
    databaseURL: "https://risky-business-ef812.firebaseio.com",
    projectId: "risky-business-ef812",
    storageBucket: "risky-business-ef812.appspot.com",
    messagingSenderId: "1062545813692"
  };
  firebase.initializeApp(config);

var database=firebase.database;

var stocks = ["aapl","ibm","xom","cvx","pg","mmm","jnj","mcd","wmt","utx","ko","ba","cat","jpm","hpq","vz","t","kft","dd","mrk","dis"];
var api="FP8BK7QFX0CXDD9P";
var obj; 

//Variable that holds the closing price at the moment when the user makes a decision
var closeAtChoice; 
//The variable that holds the value of the end of day close price.
var closeAnswer;
//This is the value of the percentage of change over the two hour period at the end of the day
var modifier;
//User cash is the money that the user has during the game.  It will be assumed that at the beginning of each
//round the user is half invested in the stock 
var userCash = 1000000;

var napi="7ba42f39aff0466dae6b8019f2feebf5";
var startingIndex;//index of the 
$(document).ready(function(){    
    window.onload = function(){
    $(".gameArea").hide(); //hide game. Email info will show
    $(".gameInstructions").hide();
    $(".entryForm").show();
    $("#submitInfo").on("click", function(event){
        event.preventDefault();
        instructions()
    }); //user clicks Submit
    $("#instructions").on("click", beginGame)

    };

    function instructions(){
        $(".entryForm").hide();
        $(".gameInstructions").show();
        console.log("B")
    };
    
    function beginGame(){
        $(".gameInstructions").hide();
        $(".gameArea").show();
        console.log("C")
    };
    
});

ajax();
function getDay(){
    startingIndex=Math.floor(Math.random()*(obj.startofDayIndex.length-1)+1);
    return obj.timeArr[obj.startofDayIndex[startingIndex]].split(" ")[0];
}
function ajax(){
    var stock=stocks[Math.floor(Math.random()*stocks.length)];
$.ajax({
        url:"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+stock+"&interval=5min&outputsize=full&apikey="+api,
        method:"GET"
    }).then(function(response){
        var dates =response["Time Series (5min)"]
        var i=0;
        var indexes=[-1];
        var open=[];
        var close=[];
        var high=[];
        var low=[];
        var date=[];
        $.each(response["Time Series (5min)"],function(day){//create arrays with stock info
            var x = dates[day]
            date.push(day);
            open.push(x["1. open"]);
            high.push(x["2. high"]);
            low.push(x["3. low"]);
            close.push(x["4. close"]);
            if(day.split(" ")[1]==="09:35:00"){//get the index of when each day starts
                indexes.push(i);;
            }
            i++;
        });
        obj={//create an object with all the information
            stock:stock,
            startofDayIndex:indexes,
            timeArr:date,
            highs:high,
            lows:low,
            opens:open,
            closes:close,
        }
        articleGet(stock,getDay());
        setAnswer();
        plotDay();
    })
}
function articleGet(stock,articleDate){//gets array of articles from the day about the stock
     $.ajax({
         url:"https://newsapi.org/v2/everything?q="+stock+"&to="+articleDate+"&from="+articleDate+"&apiKey="+napi,
         method:"GET"
     }).then(function(response){   
     obj.articles=response.articles;
     //titlepick to randomly select and index from the list of 
     titlePick =Math.floor(Math.random()*(obj.articles.length));
     //set the title of the article to be displayed
     var newTitle = obj.articles[titlePick].title;
     $("#newTitle").text(newTitle);
    console.log(obj);
})
}

//The setAnswer function grabs the values of the close at the moment the user chooses an action
//and the end of the day.  We will set a percentage value that will be used to caculate the earnings
function setAnswer() {
    //The close at the index of endCloseIndex is the answer for the day
    endCloseIndex = obj.startofDayIndex[startingIndex-1]+1;
    console.log("EndCloseIndex: " + endCloseIndex);
    chooseCloseIndex = obj.startofDayIndex[startingIndex-1]+21
    console.log("chooseCloseIndex: " + chooseCloseIndex);
    var close1 = obj.closes[endCloseIndex];
    console.log("close1" + close1);
    var close2 = obj.closes[chooseCloseIndex];
    console.log("close2" + close2);
    //the modifier is the percentage change  in price from the time the user chooses to the end of the day
    modifier = (close1-close2)/close1;
    console.log("Modifier: "+ modifier);

}

function plotDay(){
    //n1 sets the index of the start of the splice, n2 sets the end of the splice
    //Everything is listed backwards (the oldest stuff comes first)
    //we will clip off the last two hours of the day to make the close mysterious
    
    //The information is stored in 5 minutes increments.  If we advance the n1 index by 40 
    //it will cut off the last two hours of the day
    n1 = obj.startofDayIndex[startingIndex-1]+21;
    console.log("n1:" + n1);
    n2 = obj.startofDayIndex[startingIndex];
    console.log("n2:" + n2);

  var trace1 = {
    x: obj.timeArr.slice(n1,n2),
    open: obj.opens.slice(n1,n2) , 
    close: obj.closes.slice(n1,n2), 
    high: obj.highs.slice(n1,n2), 
    low: obj.lows.slice(n1,n2), 

      decreasing: {line: {color: 'red'}}, 
      increasing: {line: {color: 'green'}}, 
      line: {color: 'rgba(31,119,180,1)'}, 
          
      type: 'candlestick', 
      xaxis: 'x', 
      yaxis: 'y'
    };
    console.log(trace1);
    var data = [trace1];
    var layout = {
      dragmode: 'zoom', 
      margin: {
        r: 10, 
        t: 25, 
        b: 40, 
        l: 60
      }, 
      showlegend: false, 
      xaxis: {
        autorange: true, 
        domain: [0, 1], 
        rangeslider: {visible:false}, 
        title: 'Date', 
        type: 'date'
      }, 
      yaxis: {
        autorange: true, 
        domain: [0, 1], 
        type: 'linear'
      }
    };
    Plotly.plot('chartImage', data, layout)
  }  


//the buttons for the action the user chooses
//the modifier will be a negative or positive percentage based on the rise or fall of the price
$("#sell-button").on("click", function() {
    //var action = $(this).attr("value");
   // alert("Action: " + action);
    //The user sold all his stock, he is fully divested, the money he has is equal to his orignal userCash at the beginning of the round
    //userCash = userCash
    if (modifier > 0){
        alert("You missed out on " + userCash*modifier + " dollars, idiot!");
    }
    else if (modifier === 0){
        alert("I guess your choice really didnt make a difference");
    }
    else if (modifier < 0){
        alert("You dodged a bullet this time, you could have lost" + userCash*modifier +" dollars!")
    }
    console.log(userCash);
});

$("#buy-button").on("click", function() {
    //var action = $(this).attr("value");
    //alert("Action: " + action);
    //if the modifier is negative, it will subtract a percentage of the usercash. Positive will add to the usercash
    userCash = userCash + userCash*modifier;
    
    if (modifier > 0){
        alert("Good job, you made " + userCash*modifier + " dollars!");
    }
    else if (modifier === 0){
        alert("I guess your choice really didnt make a difference");
    }
    else if (modifier < 0){
        alert("How could you be so stupid? You lost" + userCash*modifier +" dollars!")
    }
    console.log(userCash);
});

$("#hold-button").on("click", function() {
    // if the user holds, then he keeps half in cash and the other half stays invested.
    //I have decided that you should be berated for whatever decision you make.
    userCash = 0.5*userCash + 0.5*userCash*modifier;
    
    if (modifier > 0){
        alert("You missed out on " + 0.5*userCash*modifier + " dollars, idiot!");
    }
    else if (modifier === 0){
        alert("I guess your choice really didnt make a difference");
    }
    else if (modifier < 0){
        alert("How could you be so stupid? You lost" + 0.5*userCash*modifier +" dollars!")
    }
    console.log(userCash);
});