var city = "";
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidity = $("#humidity");
var currentWSpeed = $("#wind-speed");
var currentUvindex = $("#uv-index");
var cityArray = [];
var APIKey = "5391cd1c9cda260fb72d17ac7e4e7609";

function find(c){
    for (var i = 0; i < cityArray.length; i++){
        if(c.toUpperCase() === cityArray[i]){
            return -1;
        }
    }
    return 1;
}

function displayWeather(event){
    event.preventDefault();
    if(searchCity.val().trim() !== ""){
        city=searchCity.val().trim();
        currentWeather(city);
    }
}

function currentWeather(city){
    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    fetch(queryURL)
		.then(function(response){
			return response.json()
		})
		.then(function(response) {	
		var weatherIcon = response.weather[0].icon;
        var iconUrl = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
        var date = new Date(response.dt*1000).toLocaleDateString();
        $(currentCity).html(response.name + "("+ date +")" + "<img src="+ iconUrl +">");
        
		var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(currentTemperature).html((tempF).toFixed(2) + "&#8457");
        $(currentHumidity).html(response.main.humidity + "%");
        
		var ws = response.wind.speed;
        var windsmph = (ws*2.237).toFixed(1);
        $(currentWSpeed).html(windsmph + "MPH");
        
		UVIndex(response.coord.lon,response.coord.lat);
        forecast(response.id);
        if(response.cod == 200){
            cityArray = JSON.parse(localStorage.getItem("cityname"));
            if (cityArray == null){
                cityArray = [];
                cityArray.push(city.toUpperCase()
                );
                localStorage.setItem("cityname", JSON.stringify(cityArray));
                addToList(city);
            }
            else {
                if (find(city) > 0){
                    cityArray.push(city.toUpperCase());
                    localStorage.setItem("cityname", JSON.stringify(cityArray));
                    addToList(city);
                }
            }
        }
    });
}

function UVIndex(ln,lt) {
	var uvqURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lt + "&lon=" + ln;
	fetch(uvqURL)
		.then(function(UVFetch) {
			UVFetch.json()
		.then(function(UVResponse) {
			UVResponse.value 
		})
	})
}
UVIndex()

function forecast(cityid){
	var dayover = false;
	var queryForecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityid + "&appid=" + APIKey;
	fetch(queryForecastURL)
		.then(function(responseForecast) {
			return responseForecast.json()
		})
		.then(function(responseForcast) {	
			for (i = 0; i < 5; i++){
				var date = new Date((responseForecast.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
				var iconCode = responseForecast.list[((i+1)*8)-1].weather[0].icon;
				var iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
				var tempK = responseForecast.list[((i+1)*8)-1].main.temp;
				var tempF = (((tempK-273.5)*1.80)+32).toFixed(2);
				var humidity = responseForecast.list[((i+1)*8)-1].main.humidity;
			
				$("#fDate" + i).html(date);
				$("#fImg" + i).html("<img src=" + iconUrl + ">");
				$("#fTemp" + i).html(tempF + "&#8457");
				$("#fHumidity" + i).html(humidity + "%");
		}
	});
}
	
function addToList(c){
	var listEl= $("<li>"+c.toUpperCase()+"</li>");
	$(listEl).attr("class","list-group-item");
	$(listEl).attr("data-value",c.toUpperCase());
	$(".list-group").append(listEl);
}
	
function loadPastSearch(event){
	var liEl=event.target;
	if (event.target.matches("li")){
		city=liEl.textContent.trim();
		currentWeather(city);
	}
}

function loadLastCity(){
	$("ul").empty();
	var cityArray = JSON.parse(localStorage.getItem("cityname"));
	if (cityArray !== null){
		cityArray=JSON.parse(localStorage.getItem("cityname"));
		for (i = 0; i < cityArray.length; i++){
			addToList(cityArray[i]);
		}
		city = cityArray[i-1];
		currentWeather(city);
		}	
	}

function clearHistory(event){
	event.preventDefault();
	cityArray = [];
	localStorage.removeItem("cityname");
	document.location.reload();	
}
	
$("#search-button").on("click", displayWeather);
$(document).on("click", loadPastSearch);
$(window).on("load", loadLastCity);
$("#clear-history").on("click", clearHistory);
	