import { defineStore } from 'pinia'
import type { LocationData } from '../types/User'

interface userInfoStore {
  locationAllowed: Boolean
  coor: [number, number] | []
  locationHistory: LocationData[]
  loadingGetLocation: Boolean
}
export const useUserInfoStore = defineStore('userInfo', {
  state: () :userInfoStore => {
    return {
      locationAllowed: true,
      coor: [],
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
      console.log(this.locationHistory.length >= 20)
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
    }
  }
})