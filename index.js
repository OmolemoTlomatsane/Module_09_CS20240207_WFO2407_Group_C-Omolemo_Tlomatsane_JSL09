async function fetchBackgroundImage() {
    try {
        const res = await fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature")
        const data = await res.json()
        document.body.style.backgroundImage = `url(${data.urls.regular})`
        document.getElementById("author").textContent = `By: ${data.user.name}`
    } catch (err) {
        // Use a default background image/author in case of an error
        document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1560008511-11c63416e52d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMTEwMjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjI4NDIxMTc&ixlib=rb-1.2.1&q=80&w=1080)`
        document.getElementById("author").textContent = `By: Dodi Achmad`
    }
}

async function fetchCryptoData(cryptoId) {
    try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${cryptoId}`)
        if (!res.ok) {
            throw new Error("Something went wrong")
        }
        const data = await res.json()
        
        // Update the innerHTML with the cryptocurrency information
        document.getElementById("crypto").innerHTML = `
            <div class="flex items-center mb-4">
                <img src="${data.image.small}" alt="${data.name}" class="mr-2" />
                <span class="font-bold">${data.name}</span>
            </div>
            <p>🎯: $${data.market_data.current_price.usd.toFixed(2)}</p>
            <p>👆: $${data.market_data.high_24h.usd ? data.market_data.high_24h.usd.toFixed(2) : 'N/A'}</p>
            <p>👇: $${data.market_data.low_24h.usd ? data.market_data.low_24h.usd.toFixed(2) : 'N/A'}</p>`
    } catch (err) {
        console.error(err)
        document.getElementById("crypto").innerHTML = `<span>Error fetching data for ${cryptoId}</span>`
    }
}

function getCurrentTime() {
    const date = new Date();
    document.getElementById("time").textContent = date.toLocaleTimeString("en-us", { timeStyle: "short" })
}

async function fetchWeatherData() {
    navigator.geolocation.getCurrentPosition(async position => {
        try {
            const res = await fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=imperial`)
            if (!res.ok) {
                throw new Error("Weather data not available")
            }
            const data = await res.json();
            const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            document.getElementById("weather").innerHTML = `
                <img src="${iconUrl}" alt="Weather Icon" />
                <p class="weather-temp">${Math.round(data.main.temp)}º</p>
                <p class="weather-city">${data.name}</p>`
        } catch (err) {
            console.error(err)
            document.getElementById("weather").innerHTML = `<p>Error fetching weather data</p>`
        }
    })
}

// Set interval for time and fetch initial data
setInterval(getCurrentTime, 1000)
getCurrentTime()
fetchBackgroundImage()
fetchWeatherData()

// Cryptocurrency array
const cryptocurrencies = ['bitcoin', 'ethereum', 'dogecoin', 'litecoin']
let currentCryptoIndex = 0

// Fetch initial cryptocurrency data
fetchCryptoData(cryptocurrencies[currentCryptoIndex])

// Change cryptocurrency every 10 seconds
setInterval(() => {
    currentCryptoIndex = (currentCryptoIndex + 1) % cryptocurrencies.length
    fetchCryptoData(cryptocurrencies[currentCryptoIndex])
}, 10000) // 10000 milliseconds = 10 seconds
