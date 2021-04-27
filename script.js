var city="";
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidty = $("#humidity");
var currentWSpeed =$("#wind-speed");
var currentUvindex = $("#uv-index");
var sCity=[];
var APIKey = "5391cd1c9cda260fb72d17ac7e4e7609"; 




function displayWeather(event){
    event.preventDefault();
    if(searchCity.val().trim()!==""){
        city=searchCity.val().trim();
        currentWeather(city);
    }
}

function UVIndex(ln,lt){
    //lets build the url for uvindex.
    var UVIndexUrl="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey + "&lat=" +lt+ "&lon=" +ln;
    $.ajax({
            url: UVIndexUrl,
            method:"GET"
            }).then(function(response){
                $(currentUvindex).html(response.value);
            });
}
