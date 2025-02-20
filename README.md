# PhotoGraphy-Weather-Guide

## Overview
PhotoGraphy-Weather-Guide is a web application designed to help photographers determine if it's a good day for photography. It provides real-time weather data, personalized photography recommendations based on weather conditions, and suggests popular photography spots in the selected city.

## Features
- 🌤 Fetches real-time weather data for any city
- 📸 Provides photography recommendations based on weather conditions
- 📍 Finds popular photography locations using OpenStreetMap Overpass API
- 🖼 Fetches real images from Unsplash API
- 🏙 User-friendly interface for a smooth experience

## Tech Stack
- **Backend**: Node.js, Express.js
- **Frontend**: HTML, TailwindCSS, JavaScript (Vanilla)
- **APIs Used**:
  - OpenWeather API (Weather Data)
  - Unsplash API (Real Photos)
  - GeoDB API (City Validation)
  - OpenStreetMap Overpass API (Photography Spots)

## Installation
### Prerequisites
Make sure you have the following installed:
- Node.js & npm
- Git

### Steps to Install
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/PhotoGraphy-Weather-Guide.git
   ```
2. Navigate into the project folder:
   ```sh
   cd PhotoGraphy-Weather-Guide
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Create a `.env` file in the root directory and add the following:
   ```env
   UNSPLASH_API_KEY=your_unsplash_api_key
   OPENWEATHER_API_KEY=your_openweather_api_key
   GEODB_CITIES_API_KEY=your_geodb_api_key
   ```

## Usage
1. Start the server:
   ```sh
   npm start
   ```
2. Open your browser and visit:
   ```
   http://localhost:3000
   ```
3. Enter a city name and click **Check Weather & Find Places** to get results.

## Upcoming Improvements
✅ Improve UI with better styling and responsiveness
✅ Switch to Google Places API for more accurate photography spots

---
Developed with ❤️ by Aung Ko Ko Khant

