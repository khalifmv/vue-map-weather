import { defineStore } from 'pinia'

export const useUserInfoStore = defineStore('userInfo', {
  state: () => {
    return {
      coor: [0,0] as [number, number]
    }
  },

  actions: {
    updateCoor(e: [number, number]){
      this.coor = e
    }
  }
})