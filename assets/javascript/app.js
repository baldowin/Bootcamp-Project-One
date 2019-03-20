
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
    })
}
function articleGet(stock,articleDate){//gets array of articles from the day about the stock
     $.ajax({
         url:"https://newsapi.org/v2/everything?q="+stock+"&to="+articleDate+"&from="+articleDate+"&apiKey="+napi,
         method:"GET"
     }).then(function(response){   
     obj.articles=response.articles;
    console.log(obj);
})
}

function plotDay(){
    n1 = obj.startofDayIndex[startingIndex-1]+1;
    n2 = obj.startofDayIndex[startingIndex];
  
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
 
