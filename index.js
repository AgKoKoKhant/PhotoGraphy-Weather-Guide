import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const app = express();
const port = 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API Keys
const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const GEODB_CITIES_API_KEY = process.env.GEODB_CITIES_API_KEY;

// 🌤️ Home Route (Simplified)
app.get('/', (req, res) => {
  res.render('index', { 
    geodbApiKey: process.env.GEODB_CITIES_API_KEY // Only pass necessary data
  });
});

// 📍 Route: Fetch Place Details + Photos
app.get('/place-details/:placeId', async (req, res) => {
  const placeId = req.params.placeId;
  const placeName = req.query.name;

  if (!placeId || !placeName) {
      return res.json({ error: "Invalid place ID or name." });
  }

  console.log(`📍 Route: Fetch Place Details + Photos`);

  try {
      // Get images from Unsplash API
      const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(placeName)}&client_id=${UNSPLASH_API_KEY}&per_page=3`;
      const photoResponse = await axios.get(unsplashUrl);
      const photos = photoResponse.data.results.map(photo => photo.urls.regular);

      res.json({ photos });

  } catch (error) {
      console.error("Error fetching place details:", error.message);
      res.json({ error: "Failed to fetch place details." });
  }
});



// 📸 Route: Fetch Weather & Photoshoot Places Together
app.post('/search', async (req, res) => {
  const city = req.body.city.trim();

  if (!city) {
    return res.status(400).json({ error: "Please enter a valid city name." });
  }

  try {

    console.log(`1.Searching for city: ${city}`);

    // 1️⃣ Check GeoDB for City Data
    console.log(`2. Requesting GeoDB for City API`);

    const geoUrl = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(city)}&limit=1`;
    const geoResponse = await axios.get(geoUrl, {
      headers: {
          "X-RapidAPI-Key": GEODB_CITIES_API_KEY,
          "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com"
      }
  });

  if (!geoResponse.data.data.length) {
    return res.status(404).json({ error: "City not found." });
}

const cityData = geoResponse.data.data[0];
const lat = cityData.latitude;
const lon = cityData.longitude;
console.log(`3.  GeoDB API response received.`);



const validCity = cityData.city;
const country = cityData.country;

// 2️⃣ Check OpenWeather API
console.log("4. Requesting OpenWeather API...");

const weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${validCity},${country}&units=metric&appid=${OPENWEATHER_API_KEY}`;
const weatherResponse = await axios.get(weatherApi);
console.log("5. Requesting OpenWeather API...");

const weatherData = weatherResponse.data;


    // Determine best photography condition
    let recommendation = 'It is a beautiful day to take photos!';
    switch (weatherData.weather[0].main) {
      case 'Clear':
        recommendation = "Golden hour is perfect for soft lighting. Use the 85mm f/1.8 for dreamy portraits or the 30mm f/1.4 for cinematic street shots. Set ISO 100-200, aperture f/1.8-2.8 for shallow depth, and shutter 1/500s+ for sharp details.";
        break;
      case 'Rain':
        recommendation = "Rain creates reflections and moody scenes. Use the 30mm f/1.4 wide open for low light. ISO 400-800, f/1.4-2.0 for brightness, and a shutter speed of 1/200s+ to freeze rain drops. Carry a rain cover!";
        break;
      case 'Clouds':
        recommendation = "Overcast skies act as a softbox. Perfect for portraits! Use the 85mm f/1.8 for soft bokeh or the 30mm f/1.4 for storytelling shots. Set ISO 200-400, f/1.8-2.8, and shutter 1/250s+.";
        break;
      case 'Drizzle':
        recommendation = "Drizzle adds soft reflections and misty textures. Use the 30mm f/1.4 for a cinematic feel. Set ISO 400-800, f/1.4-2.0, and shutter 1/160s+ for sharpness.";
        break;
      case 'Thunderstorm':
        recommendation = "Capture dramatic skies and lightning! Use the 30mm for landscapes or 85mm for distant strikes. For long exposures, use ISO 100, f/8-f/11, and shutter 5-10s with a tripod.";
        break;
      case 'Snow':
        recommendation = "Snow reflects light, so slightly overexpose to avoid underexposure. Use ISO 100-400, f/2.0-4.0 for depth, and shutter 1/500s+ for falling snowflakes.";
        break;
      case 'Mist':
        recommendation = "Mist adds depth and mystery. Use the 85mm for dreamy compression or 30mm for wide shots. Set ISO 200-600, f/1.8-2.8, and shutter 1/200s+.";
        break;
      case 'Smoke':
        recommendation = "Backlight smoke for cinematic effects. Use the 30mm at f/1.4 to capture soft transitions. Set ISO 400-800, f/1.4-2.8, and shutter 1/125s+.";
        break;
      case 'Haze':
        recommendation = "Haze softens scenes, perfect for a cinematic look. Use the 30mm for storytelling. Set ISO 200-600, f/2.0-4.0, and shutter 1/250s+.";
        break;
      case 'Dust':
        recommendation = "Use a UV filter for protection! Capture contrasty, dramatic textures with ISO 100-400, f/2.8-4.0, and shutter 1/500s+.";
        break;
      case 'Sand':
        recommendation = "Be careful with sand! Use a UV filter. Set ISO 100-400, f/2.8-5.6, and shutter 1/500s+ to freeze sand movement.";
        break;
      case 'Ash':
        recommendation = "Volcanic ash creates surreal landscapes. Keep ISO low (100-400), use f/4.0-8.0 for depth, and a shutter speed of 1/500s+.";
        break;
      case 'Squall':
        recommendation = "Capture motion in strong winds! Use ISO 400-800, f/2.8-5.6, and a fast shutter speed (1/1000s+) to freeze moving elements.";
        break;
      case 'Tornado':
        recommendation = "Stay safe! Capture from a distance using the 85mm at ISO 100-400, f/4.0-8.0, and a fast shutter (1/1000s+) to freeze motion.";
        break;
      default:
        recommendation = "Adapt settings to conditions! Use a fast aperture in low light and tweak ISO/shutter speed for best results.";
}

// 📍 Fetch Photography Spots Using OpenStreetMap (Overpass API)
console.log("📡 Requesting OpenStreetMap Overpass API...");
const overpassQuery = `[out:json];
(
  node["tourism"="attraction"](around:10000,${lat},${lon});
  node["historic"](around:10000,${lat},${lon});
  node["amenity"="place_of_worship"](around:10000,${lat},${lon});
  node["leisure"="park"](around:10000,${lat},${lon});
  node["natural"](around:10000,${lat},${lon});
  way["tourism"="attraction"](around:10000,${lat},${lon});
  way["historic"](around:10000,${lat},${lon});
  way["leisure"="park"](around:10000,${lat},${lon});
  relation["tourism"="attraction"](around:10000,${lat},${lon});
  relation["historic"](around:10000,${lat},${lon});
);
out center;`;

const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

try {
    const overpassResponse = await axios.get(overpassUrl);
    console.log("✅ OpenStreetMap API response:", JSON.stringify(overpassResponse.data, null, 2));

    if (!overpassResponse.data.elements || overpassResponse.data.elements.length === 0) {
        console.log("⚠️ No places found in Overpass API response.");
        return res.json({ weather: weatherData, recommendation, places: [] });
    }

    const places = overpassResponse.data.elements.slice(0, 5).map(place => ({
      name: place.tags.name || "Unknown Place",
      type: place.tags.tourism || place.tags.historic || "Attraction",
      lat: place.lat,
      lon: place.lon
  }));
  

    console.log("✅ Places extracted from OpenStreetMap:", places);

    res.json({ weather: weatherData, recommendation, places });
} catch (error) {
    console.error("❌ OpenStreetMap API request failed:", error.message);
    res.status(500).json({ error: "Failed to fetch photography places." });
}
  }
 catch (error) {
   console.error("Error fetching data:", error.response ? error.response.data : error.message);
   res.status(500).json({ error: "Server error. Try again later." });
 }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
