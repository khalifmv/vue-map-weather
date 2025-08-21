export interface LocationInfo {
    city: string;
    subdistrict: string;
    village: string;
    latitide: string;
    longitude: string;
    province: string;
}

export interface WeatherType {
    datetime: string;
    local_datetime: string;
    image: string;
    vs_text: string;
    weather: number;
    ws: number;
    hu: number;
    wind_speed: number;
    weather_description: string;
    t: number;
}

export interface LocationData {
    location: LocationInfo;
    weather: WeatherType[][];
}