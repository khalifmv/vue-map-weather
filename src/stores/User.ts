import { defineStore } from 'pinia'
import type { LocationData } from '../types/User'

interface userInfoStore {
  locationAllowed: Boolean
  coor: [number, number]
  locationHistory: LocationData[]
}
export const useUserInfoStore = defineStore('userInfo', {
  state: () :userInfoStore => {
    return {
      locationAllowed: false,
      coor: [0,0],
      locationHistory: []
    }
  },

  actions: {
    changeLocationAllowed(e: Boolean){
      this.locationAllowed = e
    },
    updateCoor(e: [number, number]){
      this.coor = e
    },
    addLocationHistory(e: LocationData){
      this.locationHistory.push(e)
    },
    clearLocationHistory(){
      this.locationHistory = []
    }
  }
})