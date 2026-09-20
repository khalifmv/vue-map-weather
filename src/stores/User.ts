import { defineStore } from 'pinia'
import type { LocationData } from '../types/User'
import type { LocationFailure } from '../helper/GetUserLocation'

export type LocationStatus = 'idle' | 'prompt' | 'requesting' | 'granted' | 'denied' | 'unavailable'
export type LocationSource = 'gps' | 'ip' | null

interface LocationResult {
  coor: [number, number]
  source: Exclude<LocationSource, null>
  label?: string | null
}

interface userInfoStore {
  locationAllowed: Boolean
  locationStatus: LocationStatus
  locationSource: LocationSource
  locationLabel: string | null
  locationErrorKind: LocationFailure | null
  coor: [number, number] | []
  locationHistory: LocationData[]
  loadingGetLocation: Boolean
}
export const useUserInfoStore = defineStore('userInfo', {
  state: () :userInfoStore => {
    return {
      locationAllowed: true,
      locationStatus: 'idle',
      locationSource: null,
      locationLabel: null,
      locationErrorKind: null,
      coor: [],
      locationHistory: [],
      loadingGetLocation: false
    }
  },
  getters: {
    reverseLocationHistory: (state) => state.locationHistory.reverse(),
    hasCoor: (state) => typeof state.coor[0] === 'number' && typeof state.coor[1] === 'number',
    isEstimatedLocation: (state) => state.locationSource === 'ip'
  },
  actions: {
    changeLocationAllowed(data: Boolean){
      this.locationAllowed = data
    },
    updateCoor(data: [number, number]){
      this.coor = data
    },
    setLoadingOfGetLocation(status: Boolean){
      this.loadingGetLocation = status
    },
    addLocationHistory(data: LocationData){
      if(this.locationHistory.length >= 20){
        this.locationHistory.pop()
      }

      this.locationHistory.push(data)
      
    },
    updateLocationHistory(idx: number, data: LocationData){
      this.locationHistory[idx] = data
    },
    deleteLocationHistory(idx: number){
      this.locationHistory = this.locationHistory.filter((_,y)=>y!==idx)
    },
    clearLocationHistory(){
      this.locationHistory = []
    },
    setLocationAllowed(status: Boolean){
      this.locationAllowed = status
    },
    setLocationStatus(status: LocationStatus){
      this.locationStatus = status
      this.locationAllowed = status !== 'denied'
      if(status !== 'denied' && status !== 'unavailable'){
        this.locationErrorKind = null
      }
    },
    setLocationError(kind: LocationFailure){
      this.locationErrorKind = kind
    },
    setLocationResult({ coor, source, label = null }: LocationResult){
      // A precise fix always wins, an IP estimate that resolves late must not
      // overwrite it.
      if(source === 'ip' && this.locationSource === 'gps'){
        return
      }
      this.coor = coor
      this.locationSource = source
      this.locationLabel = label
    }
  }
})
