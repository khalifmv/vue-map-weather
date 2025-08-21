import { defineStore } from 'pinia'
import type { LocationData } from '../types/User'

interface userInfoStore {
  locationAllowed: Boolean
  coor: [number, number]
  locationHistory: LocationData[]
  loadingGetLocation: Boolean
}
export const useUserInfoStore = defineStore('userInfo', {
  state: () :userInfoStore => {
    return {
      locationAllowed: false,
      coor: [0,0],
      locationHistory: [],
      loadingGetLocation: false
    }
  },
  getters: {
    reverseLocationHistory: (state) => state.locationHistory.reverse()
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
    }
  }
})