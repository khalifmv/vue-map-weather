import type { LocationData, WeatherType } from '../types/User'
import { BMKG_REGIONS, type BmkgRegion } from '../data/bmkgRegions'

// Documented public forecast API. Takes a level IV (kelurahan/desa) area code
// from Kepmendagri 100.1.1-6117/2022, nothing else.
// Docs: https://data.bmkg.go.id/prakiraan-cuaca/
const FORECAST_URL = 'https://api.bmkg.go.id/publik/prakiraan-cuaca'

// Coordinate to area code. Undocumented, it is the endpoint BMKG's own web app
// uses, and it sits behind bot protection that refuses us often enough that it
// cannot be the only route. Hence the bundled fallback below.
const ADM_BY_COORD_URL = 'https://cuaca.bmkg.go.id/api/df/v1/adm/coord'

// 3 days at 3 hour steps.
const MAX_SLOTS = 24

// Roughly 330 km. Past this the nearest regency is meaningless, the click is
// somewhere outside Indonesia.
const MAX_FALLBACK_DEGREES = 3

export type WeatherFailure = 'outside-coverage' | 'unreachable' | 'no-forecast'

export class WeatherError extends Error {
    readonly kind: WeatherFailure

    constructor(kind: WeatherFailure, message: string) {
        super(message)
        this.name = 'WeatherError'
        this.kind = kind
    }
}

interface ResolvedArea {
    adm4: string
    /** True when we fell back to the nearest regency instead of the exact village. */
    approximate: boolean
}

async function getJson(url: string, timeoutMs = 10000): Promise<any> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) {
            return null
        }
        return await res.json()
    } finally {
        clearTimeout(timer)
    }
}

function nearestRegion(lat: number, long: number): BmkgRegion | null {
    // Equirectangular approximation, plenty accurate for picking a neighbour.
    const scale = Math.cos((lat * Math.PI) / 180)
    let best: BmkgRegion | null = null
    let bestDistance = Infinity

    for (const region of BMKG_REGIONS) {
        const dLat = region[1] - lat
        const dLon = (region[2] - long) * scale
        const distance = dLat * dLat + dLon * dLon
        if (distance < bestDistance) {
            bestDistance = distance
            best = region
        }
    }

    if (!best || Math.sqrt(bestDistance) > MAX_FALLBACK_DEGREES) {
        return null
    }
    return best
}

async function resolveArea(lat: number, long: number): Promise<ResolvedArea> {
    try {
        const area = await getJson(`${ADM_BY_COORD_URL}?lat=${lat}&lon=${long}`)
        if (area?.adm4) {
            return { adm4: area.adm4, approximate: false }
        }
    } catch {
        // Blocked or offline. The bundled table below still gets us an answer.
    }

    const region = nearestRegion(lat, long)
    if (!region) {
        throw new WeatherError(
            'outside-coverage',
            'BMKG only covers Indonesia, this point is outside it.'
        )
    }
    return { adm4: region[0], approximate: true }
}

/**
 * BMKG groups its slots per day. The card shows a single strip, so flatten and
 * drop what already passed, otherwise late in the day only one slot is left.
 */
function upcomingSlots(groups: WeatherType[][]): WeatherType[] {
    const all = groups.flat()
    const now = Date.now()
    const ahead = all.filter((slot) => new Date(slot.datetime).getTime() >= now)
    return (ahead.length ? ahead : all).slice(0, MAX_SLOTS)
}

async function fetchWeather(data: { lat: number; long: number }): Promise<{ data: LocationData[] }> {
    const area = await resolveArea(data.lat, data.long)

    let forecast: any
    try {
        forecast = await getJson(`${FORECAST_URL}?adm4=${encodeURIComponent(area.adm4)}`)
    } catch {
        throw new WeatherError('unreachable', 'Could not reach the BMKG forecast service.')
    }

    const place = forecast?.lokasi
    const groups: WeatherType[][] = forecast?.data?.[0]?.cuaca ?? []
    if (!place || !groups.length) {
        throw new WeatherError('no-forecast', 'BMKG has no forecast for this area.')
    }

    return {
        data: [
            {
                location: {
                    city: place.kotkab,
                    subdistrict: place.kecamatan,
                    village: place.desa,
                    province: place.provinsi,
                    latitide: String(place.lat),
                    longitude: String(place.lon),
                },
                approximate: area.approximate,
                weather: [upcomingSlots(groups)],
            },
        ],
    }
}

export { fetchWeather }
