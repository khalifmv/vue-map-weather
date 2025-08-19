import { defineStore } from 'pinia'

interface userInfoStore {
  locationAllowed: Boolean
  coor: [number, number]
  locationHistory: []
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
    }
  }
})