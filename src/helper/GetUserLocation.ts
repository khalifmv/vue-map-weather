export interface UserLocation {
    latitude: number;
    longitude: number;
}

export async function getUserLocation(): Promise<UserLocation> {
    if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser.');
    }

    console.log(navigator)
    if (navigator.permissions) {
        console.log('Permissions API is supported.');
        try {
            const status = await navigator.permissions.query({ name: 'geolocation' });
            if (status.state === 'denied') {
                throw new Error('Location access was denied.');
            }
        } catch {
            // Ignore and proceed to request location
        }
    }

    return new Promise<UserLocation>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                reject(error);
            }
        );
    });
}