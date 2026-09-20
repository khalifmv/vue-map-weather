export interface IpLocation {
    latitude: number;
    longitude: number;
    label: string | null;
}

interface Provider {
    url: string;
    parse: (raw: any) => IpLocation | null;
}

function toLocation(lat: unknown, long: unknown, parts: unknown[]): IpLocation | null {
    const latitude = Number(lat);
    const longitude = Number(long);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return null;
    }
    const label = parts
        .filter((part): part is string => typeof part === 'string' && part.length > 0)
        .join(', ');
    return { latitude, longitude, label: label || null };
}

// Both are keyless and send Access-Control-Allow-Origin: *, so they work from
// a static host. They are tried in order, the second covers the first being
// rate limited or down.
const PROVIDERS: Provider[] = [
    {
        url: 'https://ipwho.is/',
        parse: (raw) => (raw?.success ? toLocation(raw.latitude, raw.longitude, [raw.city, raw.country]) : null),
    },
    {
        url: 'https://get.geojs.io/v1/ip/geo.json',
        parse: (raw) => toLocation(raw?.latitude, raw?.longitude, [raw?.city, raw?.country]),
    },
];

async function fetchProvider(provider: Provider, timeoutMs: number): Promise<IpLocation | null> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(provider.url, { signal: controller.signal });
        if (!res.ok) {
            return null;
        }
        return provider.parse(await res.json());
    } finally {
        clearTimeout(timer);
    }
}

/**
 * City level location derived from the public IP address. Needs no permission,
 * so it works when the device cannot produce a real fix.
 */
export async function getLocationByIp(timeoutMs = 6000): Promise<IpLocation> {
    for (const provider of PROVIDERS) {
        try {
            const location = await fetchProvider(provider, timeoutMs);
            if (location) {
                return location;
            }
        } catch {
            // Try the next provider
        }
    }
    throw new Error('Could not estimate location from IP address.');
}
