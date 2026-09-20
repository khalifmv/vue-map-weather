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
    utc_datetime: string;
    local_datetime: string;
    analysis_date: string;
    image: string;
    weather: number;
    weather_desc: string;
    weather_desc_en: string;
    t: number;
    hu: number;
    tcc: number;
    tp: number;
    ws: number;
    wd: string;
    wd_deg: number;
    wd_to: string;
    vs: number | null;
    vs_text: string | null;
    time_index: string;
}

export interface LocationData {
    location: LocationInfo;
    /** Set when the forecast is for the nearest regency, not the exact point. */
    approximate?: boolean;
    weather: WeatherType[][];
}