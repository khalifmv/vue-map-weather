import { useUserInfoStore } from '../stores/User'
import { getUserLocation, readPermissionState, LocationError } from '../helper/GetUserLocation'
import { getLocationByIp } from '../helper/GetLocationByIp'

/**
 * Owns the whole "where is the user" flow: a city level IP estimate straight
 * away so the map is never empty, and a precise fix requested only from a user
 * gesture so the browser dialog never appears unexplained.
 */
export function useLocation() {
  const userInfo = useUserInfoStore()

  async function applyIpFallback() {
    if (userInfo.locationSource === 'gps') {
      return
    }
    try {
      const estimate = await getLocationByIp()
      userInfo.setLocationResult({
        coor: [estimate.latitude, estimate.longitude],
        source: 'ip',
        label: estimate.label
      })
    } catch (error) {
      console.warn('Could not estimate location from IP:', error)
    }
  }

  async function requestPrecise(): Promise<boolean> {
    userInfo.setLocationStatus('requesting')
    try {
      const position = await getUserLocation()
      userInfo.setLocationResult({
        coor: [position.latitude, position.longitude],
        source: 'gps'
      })
      userInfo.setLocationStatus('granted')
      return true
    } catch (error) {
      const kind = error instanceof LocationError ? error.kind : 'unavailable'
      userInfo.setLocationStatus(kind === 'denied' ? 'denied' : 'unavailable')
      userInfo.setLocationError(kind)
      applyIpFallback()
      return false
    }
  }

  async function initLocation() {
    // Never blocks on the browser dialog, the estimate lands either way.
    applyIpFallback()

    const permission = await readPermissionState()
    if (permission === 'granted') {
      // Already approved before, no explaining needed.
      requestPrecise()
      return
    }
    if (permission === 'denied') {
      userInfo.setLocationStatus('denied')
      userInfo.setLocationError('denied')
      return
    }
    // 'prompt', or a browser that won't tell us. Explain first, ask on click.
    userInfo.setLocationStatus('prompt')
  }

  return { initLocation, requestPrecise, applyIpFallback }
}
