export interface LocationInfo{
    city: string;
    subdistrict: string;
    village: string;
}

export interface LocationData {
    location: LocationInfo;
    weather: Array<{
        datetime: string;
        local_datetime: string;
        image: string;
        vs_text: string;
        weather: number;
        ws: number;
        hu: number;
        wind_speed: number;
        weather_description: string;
    }>;
}