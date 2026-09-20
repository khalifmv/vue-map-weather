export interface UserLocation {
    latitude: number;
    longitude: number;
}

export type LocationFailure = 'unsupported' | 'denied' | 'unavailable' | 'timeout';

export class LocationError extends Error {
    readonly kind: LocationFailure;

    constructor(kind: LocationFailure, message: string) {
        super(message);
        this.name = 'LocationError';
        this.kind = kind;
    }
}

const FIRST_ATTEMPT: PositionOptions = {
    enableHighAccuracy: false,
    timeout: 10000,
    maximumAge: 300000,
};

// macOS CoreLocation often fails the first request with POSITION_UNAVAILABLE
// (kCLErrorLocationUnknown) before it has a fix. Retrying with a longer timeout
// and accepting any cached position usually succeeds.
const RETRY_ATTEMPT: PositionOptions = {
    enableHighAccuracy: false,
    timeout: 20000,
    maximumAge: Infinity,
};

function toLocationError(error: unknown): LocationError {
    const code = (error as GeolocationPositionError)?.code;
    if (code === 1) {
        return new LocationError('denied', 'Location access was denied.');
    }
    if (code === 3) {
        return new LocationError('timeout', 'Timed out while determining your location.');
    }
    return new LocationError('unavailable', 'The device could not determine its position.');
}

function requestPosition(options: PositionOptions): Promise<UserLocation> {
    return new Promise<UserLocation>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => reject(toLocationError(error)),
            options
        );
    });
}

/**
 * Permission state without prompting, so the UI can explain itself before the
 * browser dialog appears. Null when the browser can't tell us.
 */
export async function readPermissionState(): Promise<PermissionState | null> {
    if (!navigator.permissions) {
        return null;
    }
    try {
        const status = await navigator.permissions.query({ name: 'geolocation' });
        return status.state;
    } catch {
        return null;
    }
}

export async function getUserLocation(): Promise<UserLocation> {
    if (!navigator.geolocation) {
        throw new LocationError('unsupported', 'Geolocation is not supported by this browser.');
    }

    if ((await readPermissionState()) === 'denied') {
        throw new LocationError('denied', 'Location access was denied.');
    }

    try {
        return await requestPosition(FIRST_ATTEMPT);
    } catch (error) {
        if (error instanceof LocationError && error.kind === 'denied') {
            throw error;
        }
        console.warn('Location lookup failed, retrying once...', error);
        return requestPosition(RETRY_ATTEMPT);
    }
}
