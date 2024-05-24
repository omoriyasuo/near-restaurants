import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

// Replace with your API key
const apiKey = process.env.GOOGLE_API_KEY;

// Function to handle Geocoding API request
async function getCoordinates(
  placeName: string
): Promise<{ lat: number; lng: number } | null> {
  const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${placeName}&key=${apiKey}`;

  try {
    const response = await axios.get(geocodingUrl);
    const data = response.data;

    if (data.status === "OK") {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    } else {
      console.error("Geocoding API request unsuccessful:", data.status);
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// Function to handle Places API Text Search request
async function findRestaurants(
  latitude: number,
  longitude: number
): Promise<any[]> {
  const placesUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?location=${latitude},${longitude}&radius=500&type=restaurant&key=${apiKey}`;

  try {
    const response = await axios.get(placesUrl);
    const data = response.data;

    if (data.status === "OK") {
      console.log(data.results);
      return data.results;
    } else {
      console.error("Places API request unsuccessful:", data.status);
      return [];
    }
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

// Async function to run the entire process
async function main() {
  const placeName = "Kawasaki Station";

  // Get coordinates from station name
  const coordinates = await getCoordinates(placeName);

  if (coordinates) {
    const restaurants = await findRestaurants(coordinates.lat, coordinates.lng);

    // Process restaurant information
    for (const restaurant of restaurants) {
      console.log(`Restaurant Name: ${restaurant.name}`);
      console.log(`Address: ${restaurant.formatted_address}`);
      console.log("------------------");
    }
  } else {
    console.error("Failed to retrieve restaurant information");
  }
}

main();
