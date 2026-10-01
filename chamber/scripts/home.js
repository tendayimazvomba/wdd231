// ================================
// FOOTER
// ================================

const currentYear = document.querySelector('#currentyear');
const lastModified = document.querySelector('#lastModified');

currentYear.textContent = new Date().getFullYear();
lastModified.textContent = `Last Modification: ${document.lastModified}`;


// ================================
// WEATHER
// ================================

// OpenWeatherMap API key.
const apiKey = '855ef1d52df9f2589d3d2f1e6681dc81';

// Bulawayo coordinates
const lat = -20.15;
const lon = 28.58;

const weatherURL =
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

const currentTemp = document.querySelector('#current-temp');
const weatherDescription =
    document.querySelector('#weather-description');

const forecastContainer =
    document.querySelector('#forecast');


async function getWeather() {
    try {
        const response = await fetch(weatherURL);

        if (!response.ok) {
            throw new Error('Weather data could not be loaded.');
        }

        const data = await response.json();

        displayCurrentWeather(data);
        displayForecast(data);

    } catch (error) {
        console.error('Weather error:', error);

        weatherDescription.textContent =
            'Weather unavailable';
    }
}


function displayCurrentWeather(data) {

    const current = data.list[0];

    currentTemp.textContent =
        `${Math.round(current.main.temp)}°C`;

    weatherDescription.textContent =
        capitalizeWords(current.weather[0].description);
}


function displayForecast(data) {

    forecastContainer.innerHTML = '';

    // OpenWeatherMap forecast data is provided
    // in 3-hour intervals. Select forecasts
    // around midday for the next three days.

    const dailyForecasts =
        data.list.filter((forecast) =>
            forecast.dt_txt.includes('12:00:00')
        );

    dailyForecasts.slice(0, 3).forEach((forecast) => {

        const forecastCard =
            document.createElement('div');

        forecastCard.classList.add('forecast-day');

        const date = new Date(
            forecast.dt * 1000
        );

        const dayName =
            date.toLocaleDateString('en-US', {
                weekday: 'long'
            });

        forecastCard.innerHTML = `
            <strong>${dayName}</strong>
            <span>${Math.round(forecast.main.temp)}°C</span>
        `;

        forecastContainer.appendChild(forecastCard);
    });
}


function capitalizeWords(text) {
    return text
        .split(' ')
        .map(word =>
            word.charAt(0).toUpperCase() +
            word.slice(1)
        )
        .join(' ');
}


getWeather();


// ================================
// MEMBER SPOTLIGHTS
// ================================

const membersURL = './data/members.json';

const spotlightContainer =
    document.querySelector('#spotlights');


async function getSpotlights() {

    try {

        const response =
            await fetch(membersURL);

        if (!response.ok) {
            throw new Error(
                'Member data could not be loaded.'
            );
        }

        const members =
            await response.json();

        // Membership:
        // 1 = Member
        // 2 = Silver
        // 3 = Gold

        const qualifiedMembers =
            members.filter((member) =>
                member.membership === 2 ||
                member.membership === 3
            );

        const shuffled =
            qualifiedMembers.sort(
                () => Math.random() - 0.5
            );

        const selectedMembers =
            shuffled.slice(0, 3);

        displaySpotlights(selectedMembers);

    } catch (error) {

        console.error(
            'Spotlight error:',
            error
        );
    }
}


function displaySpotlights(members) {

    spotlightContainer.innerHTML = '';

    members.forEach((member) => {

        const card =
            document.createElement('article');

        card.classList.add(
            'spotlight-card'
        );

        const membershipLevel =
            member.membership === 3
                ? 'Gold'
                : 'Silver';

        card.innerHTML = `
            <h3>${member.name}</h3>

            <img
                src="images/${member.image}"
                alt="${member.name}"
                width="300"
                height="200"
                loading="lazy">

            <p>${member.address}</p>

            <p>
                <strong>Phone:</strong>
                ${member.phone}
            </p>

            <p>
                <strong>Membership:</strong>
                ${membershipLevel}
            </p>

            <a href="${member.website}"
                target="_blank"
                rel="noopener">
                Visit Website
            </a>
        `;

        spotlightContainer.appendChild(card);
    });
}


getSpotlights();