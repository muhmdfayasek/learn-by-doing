const weatherForm = document.querySelector(".weatherForm");
const getWeather = document.querySelector(".getWeather");
const cityInput = document.querySelector(".cityInput");
const loader = document.querySelector(".loader");
const card = document.querySelector(".card");
const apiKey = API_CONFIG.WEATHER_KEY;


async function getWeatherData(event){

    event.preventDefault();// To prevent automatic reloading of browser

    const city = cityInput.value;

    // Validating input
    if(city.trim() !== ""){
        
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        
        pageLoader();
        
        try {
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error("City not found or Some other Error occures");
            }
            
            const data = await response.json();
            
            displayWeather(data);
            
        } catch (error) {

            displayError(error);
        }

    } else {
        window.alert("Please enter a city. Do not accept clear field");
    }
}


function pageLoader(){

    card.innerHTML = "";
    loader.innerHTML = "";

    card.style.display = "none";
    loader.style.display = "flex";

}


function displayWeather(data){

    // Destructuring the data
    const {name,
           main: {temp, humidity},
           weather: [{description, icon}]} = data;
      
           
    // Clearing loader and displaying card
    loader.innerHTML = "";       
    loader.style.display = "none";

    card.innerHTML = "";       
    card.style.display = "flex";


    // Creating HTML elements       
    const cityDisplay = document.createElement('h1');       
    const tempDisplay = document.createElement('p');       
    const humidityDisplay = document.createElement('p');
    const descDisplay = document.createElement('p');
    const imgDisplay = document.createElement('img');       
    
    // Adding CSS classes
    cityDisplay.classList.add('cityDisplay');
    tempDisplay.classList.add('tempDisplay');
    humidityDisplay.classList.add('humidityDisplay');
    descDisplay.classList.add('descDisplay');
    imgDisplay.classList.add('imgDisplay');

    // Inserting responses
    cityDisplay.textContent = name;
    tempDisplay.textContent = `${Math.round(temp)}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;

    imgDisplay.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    imgDisplay.alt = description;

    // Appending elements to the HTML
    card.append(cityDisplay, tempDisplay, humidityDisplay, imgDisplay, descDisplay);
}


function displayError(error){

    // Clearing loader and displaying error
    loader.innerHTML = "";
    loader.style.display = "none";

    card.innerHTML = "";

    const errorDisplay = document.createElement('p');
    errorDisplay.classList.add('errorDisplay');
    errorDisplay.textContent = "Please type a vaild city";
    card.appendChild(errorDisplay);

    card.style.display = "flex";

    console.error("Can't fetch data", error.message);
}


// Get submit request from form
weatherForm.addEventListener("submit", getWeatherData);