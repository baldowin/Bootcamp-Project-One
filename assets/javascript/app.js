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
    obj={
        stock:stock,
        startofDayIndex:indexes,
        timeArr:date,
        highs:high,
        lows:low,
        opens:open,
        closes:close
    }
    console.log(obj);
})