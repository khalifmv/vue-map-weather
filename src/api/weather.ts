async function fetchWeather(data: { lat: number; long: number }) {
    console.log(import.meta.env.VITE_API_URL)
    const url = `${import.meta.env.VITE_API_URL}weather/forecast?lat=${data.lat}&long=${data.long}`;
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error("Failed to fetch weather");
    }
    return res.json();
}

export { fetchWeather }